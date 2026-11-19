import hashlib
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.models.schemas import UserModel, UserLogin, UserRegister, UserResponse, TokenResponse

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication & Access Control"])

SECRET_SALT = "ecosphere_enterprise_salt_2026"

def hash_password(password: str) -> str:
    """Hash password using sha256 with consistent salt."""
    return hashlib.sha256((password + SECRET_SALT).encode('utf-8')).hexdigest()

def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed

def create_access_token(user_id: int, email: str, role: str) -> str:
    """Generate secure lightweight token."""
    random_hex = secrets.token_hex(16)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"eco_{user_id}_{role}_{random_hex}_{timestamp}"

def get_current_user_from_token(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> UserModel:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required"
        )
    token = authorization.split(" ")[1]
    parts = token.split("_")
    if len(parts) < 3 or parts[0] != "eco":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token format"
        )
    try:
        user_id = int(parts[1])
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token user ID"
        )
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user account not found"
        )
    return user


def seed_default_users(db: Session):
    """Seed standard initial Admin and Citizen accounts if missing."""
    default_users = [
        {
            "email": "admin@ecosphere.gov",
            "password": "admin123",
            "full_name": "Dr. Varshith Rao",
            "role": "admin",
            "department": "National Environmental Protection Agency"
        },
        {
            "email": "citizen@ecosphere.org",
            "password": "citizen123",
            "full_name": "Ananya Sharma",
            "role": "citizen",
            "department": "Public Community Observer"
        }
    ]

    for u_data in default_users:
        existing = db.query(UserModel).filter(UserModel.email == u_data["email"]).first()
        if not existing:
            new_user = UserModel(
                email=u_data["email"],
                hashed_password=hash_password(u_data["password"]),
                full_name=u_data["full_name"],
                role=u_data["role"],
                department=u_data["department"]
            )
            db.add(new_user)
    db.commit()


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials"
        )

    token = create_access_token(user.id, user.email, user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    existing = db.query(UserModel).filter(UserModel.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    role = payload.role if payload.role in ["admin", "citizen", "operator"] else "citizen"
    new_user = UserModel(
        email=email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        role=role,
        department=payload.department or ("Environmental Operations" if role == "admin" else "Public Citizen")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.id, new_user.email, new_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: UserModel = Depends(get_current_user_from_token)):
    return user
