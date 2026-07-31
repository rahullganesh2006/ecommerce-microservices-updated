import time
import os
import jwt
from fastapi import HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

SECRET_KEY = "super-secret-jwt-key"
ALGORITHM = "HS256"
GOOGLE_CLIENT_ID = "mock-client-id" # You can put a real one later

# In-memory store for Users for local dev
USER_STORE = {
    "admin@cloudcart.io": {"id": "u_admin", "name": "Rahull Ganesh", "role": "ADMIN", "email": "admin@cloudcart.io", "password": "admin"},
    "customer@cloudcart.io": {"id": "u_cust", "name": "Customer", "role": "CUSTOMER", "email": "customer@cloudcart.io", "password": "customer"},
    "rahullganesh12345@gmail.com": {"id": "u_rahull", "name": "Rahull", "role": "ADMIN", "email": "rahullganesh12345@gmail.com", "password": "Rahull@2006"}
}

class AuthService:
    @staticmethod
    def register(name: str, email: str, password: str):
        email = email.lower()
        if email in USER_STORE:
            raise HTTPException(status_code=400, detail="User already exists")
            
        USER_STORE[email] = {
            "id": f"u_{int(time.time())}", 
            "name": name, 
            "role": "CUSTOMER",
            "email": email,
            "password": password
        }
        return AuthService._generate_auth_response(email)

    @staticmethod
    def login_with_password(email: str, password: str):
        email = email.lower()
        if email not in USER_STORE:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        user = USER_STORE[email]
        if user.get("password") != password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        return AuthService._generate_auth_response(email)

    @staticmethod
    def login_with_google(token: str):
        try:
            unverified = jwt.decode(token, options={"verify_signature": False})
            email = unverified.get("email")
            if not email:
                raise ValueError("Invalid Google token payload")
                
        except Exception as e:
            # Fallback for completely fake mock tokens from the frontend UI
            email = "customer@cloudcart.io"
            
        return AuthService._generate_auth_response(email)

    @staticmethod
    def _generate_auth_response(email: str):
        # Create user if they don't exist (e.g. from Google login)
        if email not in USER_STORE:
            USER_STORE[email] = {
                "id": f"u_{int(time.time())}", 
                "name": email.split('@')[0], 
                "role": "CUSTOMER",
                "email": email,
                "password": "" # No password since they use Google
            }
            
        user = USER_STORE[email]
        
        # Mint JWT token
        payload = {
            "sub": user["id"],
            "email": email,
            "role": user["role"],
            "name": user["name"],
            "exp": time.time() + 3600 # 1 hour expiry
        }
        
        access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "user": {
                "id": user["id"],
                "name": user["name"],
                "role": user["role"],
                "email": user["email"]
            },
            "tokens": {
                "accessToken": access_token,
                "refreshToken": "mock_refresh_token",
                "idToken": access_token,
                "expiresAt": int(time.time() * 1000) + 3600000
            }
        }
