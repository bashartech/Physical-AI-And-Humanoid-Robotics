import httpx
from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from typing import Optional

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: Optional[HTTPAuthorizationCredentials] = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            token = credentials.credentials
            user_data = await self.verify_jwt_with_auth_service(token)
            if not user_data:
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            request.state.user = user_data
            return token
        else:
            raise HTTPException(status_code=403, detail="Authentication credentials were not provided.")

    async def verify_jwt_with_auth_service(self, token: str) -> Optional[dict]:
        """
        Validate JWT token by calling the auth service
        """
        try:
            # Call the auth service to validate the token
            auth_service_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:3000")
            validate_url = f"{auth_service_url}/api/auth/validate"

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    validate_url,
                    json={"token": token},
                    timeout=10.0
                )

                if response.status_code == 200:
                    result = response.json()
                    if result.get("valid"):
                        return {
                            "userId": result.get("userId"),
                            "email": result.get("email"),
                            "profileId": result.get("profileId")
                        }
                    else:
                        print("Token validation failed:", result.get("message", "Unknown error"))
                        return None
                else:
                    print(f"Auth service validation failed with status: {response.status_code}")
                    return None
        except Exception as e:
            print(f"Error validating token with auth service: {e}")
            return None