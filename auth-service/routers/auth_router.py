from fastapi import APIRouter
from schemas.auth_schema import PasswordLoginRequest, RegisterRequest, GoogleLoginRequest, ChangePasswordRequest
from services.auth_service import AuthService

router = APIRouter()

@router.post("/register")
def register(request: RegisterRequest):
    return AuthService.register(request.name, request.email, request.password)

@router.post("/login/password")
def login_password(request: PasswordLoginRequest):
    return AuthService.login_with_password(request.email, request.password)

@router.post("/change-password")
def change_password(request: ChangePasswordRequest):
    return AuthService.change_password(request.email, request.current_password, request.new_password)

@router.post("/google")
def google_login(request: GoogleLoginRequest):
    return AuthService.login_with_google(request.token)
