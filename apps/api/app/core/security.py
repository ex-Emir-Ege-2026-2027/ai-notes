from __future__ import annotations

import os
import time
from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError, PyJWKClient


bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class TokenClaims:
    sub: str
    role: str
    exp: int
    raw: dict[str, Any]


@dataclass(frozen=True)
class JWTConfig:
    secret: str | None
    jwks_url: str | None
    algorithms: list[str]


def _unauthorized(detail: str = "Invalid or expired token") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


@lru_cache(maxsize=1)
def get_jwt_config() -> JWTConfig:
    jwks_url = os.getenv("SUPABASE_JWKS_URL")
    secret = os.getenv("SUPABASE_JWT_SECRET")
    algorithms = [
        algorithm.strip()
        for algorithm in os.getenv("SUPABASE_JWT_ALGORITHMS", "").split(",")
        if algorithm.strip()
    ]

    if not algorithms:
        algorithms = ["RS256"] if jwks_url else ["HS256"]

    return JWTConfig(
        secret=secret,
        jwks_url=jwks_url,
        algorithms=algorithms,
    )


def _validate_claims(payload: dict[str, Any]) -> TokenClaims:
    sub = payload.get("sub")
    role = payload.get("role")
    exp = payload.get("exp")

    if not isinstance(sub, str) or not sub.strip():
        raise _unauthorized("Token missing valid sub claim")

    if not isinstance(role, str) or not role.strip():
        raise _unauthorized("Token missing valid role claim")

    try:
        exp_value = int(exp)
    except (TypeError, ValueError):
        raise _unauthorized("Token missing valid exp claim") from None

    if exp_value <= int(time.time()):
        raise _unauthorized("Token has expired")

    return TokenClaims(
        sub=sub,
        role=role,
        exp=exp_value,
        raw=payload,
    )


def verify_supabase_jwt(token: str) -> TokenClaims:
    config = get_jwt_config()

    if not config.secret and not config.jwks_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT verification is not configured",
        )

    try:
        header = jwt.get_unverified_header(token)
    except InvalidTokenError:
        raise _unauthorized() from None

    options = {
        "require": ["sub", "role", "exp"],
        "verify_aud": False,
    }

    try:
        if config.jwks_url:
            jwk_client = PyJWKClient(config.jwks_url)
            signing_key = jwk_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=config.algorithms,
                options=options,
            )
        else:
            payload = jwt.decode(
                token,
                config.secret,
                algorithms=config.algorithms,
                options=options,
            )
    except InvalidTokenError:
        raise _unauthorized() from None

    header_alg = header.get("alg")
    if header_alg and header_alg not in config.algorithms:
        raise _unauthorized()

    return _validate_claims(payload)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> TokenClaims:
    if credentials is None or not credentials.credentials.strip():
        raise _unauthorized()

    return verify_supabase_jwt(credentials.credentials.strip())
