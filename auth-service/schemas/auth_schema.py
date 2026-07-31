from pydantic import BaseModel

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class PasswordLoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class ChangePasswordRequest(BaseModel):
    email: str
    current_password: str
    new_password: str
