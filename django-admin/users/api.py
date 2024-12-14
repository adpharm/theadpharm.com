from ninja import Router, Schema
from ninja.security import django_auth
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from .models import CustomUser as User

router = Router()


class SignInSchema(Schema):
    email: str
    password: str


class RegisterSchema(Schema):
    email: str
    password: str
    # first_name: str
    # last_name: str


@router.get("/set-csrf-token")
def get_csrf_token(request):
    return {"csrftoken": get_token(request)}


@router.post("/signin")
def login_view(request, payload: SignInSchema):
    user = authenticate(request, username=payload.email,
                        password=payload.password)
    if user is not None:
        login(request, user)
        return {"success": True}
    return {"success": False, "message": "Invalid credentials"}


@router.post("/logout", auth=django_auth)
def logout_view(request):
    logout(request)
    return {"message": "Logged out"}


@router.get("/user", auth=django_auth)
def user(request):
    secret_fact = (
        "The moment one gives close attention to any thing, even a blade of grass",
        "it becomes a mysterious, awesome, indescribably magnificent world in itself."
    )
    return {
        "username": request.user.username,
        "email": request.user.email,
        "secret_fact": secret_fact
    }


@router.post("/signup")
def register(request, payload: RegisterSchema):
    try:
        User.objects.create_user(
            email=payload.email, password=payload.password)
        return {"success": "User registered successfully"}
    except Exception as e:
        return {"error": str(e)}
