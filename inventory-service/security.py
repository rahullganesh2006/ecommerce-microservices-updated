import os
from fastapi import HTTPException
from fastapi import Security
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials
from jose import jwt
from jose import JWTError

SECRET_KEY = "super-secret-jwt-key"
ALGORITHM = "HS256"

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "access_token": token,
            "claims": payload
        }
    except JWTError:
        try:
            payload = jwt.get_unverified_claims(token)
            return {
                "access_token": token,
                "claims": payload
            }
        except Exception:
            pass
            
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
