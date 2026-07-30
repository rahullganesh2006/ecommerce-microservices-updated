import os
import requests

from dotenv import load_dotenv

from fastapi import HTTPException
from fastapi import Security
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from jose import jwt
from jose import JWTError

load_dotenv()

REGION = os.getenv("COGNITO_REGION")
USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")

ISSUER = (
    f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}"
)

JWKS_URL = f"{ISSUER}/.well-known/jwks.json"

jwks = requests.get(JWKS_URL).json()

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(
        bearer_scheme
    )
):
    token = credentials.credentials

    try:

        header = jwt.get_unverified_header(token)
        kid = header["kid"]

        key = None

        for jwk in jwks["keys"]:
            if jwk["kid"] == kid:
                key = jwk
                break

        if key is None:
            raise HTTPException(
                status_code=401,
                detail="Public key not found"
            )

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=ISSUER,
            options={
                "verify_aud": False
            }
        )

        if payload.get("token_use") != "access":
            raise HTTPException(
                status_code=401,
                detail="Access Token required"
            )

        if payload.get("client_id") != CLIENT_ID:
            raise HTTPException(
                status_code=401,
                detail="Invalid Client ID"
            )

        return {
            "access_token": token,
            "claims": payload
        }

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or Expired Token"
        )

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )