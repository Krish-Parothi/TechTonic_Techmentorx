"""
Router to verify Amadeus API credentials by requesting an OAuth token.

Endpoints:
- POST /amadeus/check : Accepts optional JSON {client_id, client_secret}. If omitted, reads from environment variables `AMADEUS_KEY` and `SECRET`.

Returns JSON with status and either token metadata or error message. Does not echo secrets.
"""
from typing import Optional
import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/amadeus", tags=["Amadeus"])

AM_CLIENT_ID = os.getenv("AMADEUS_KEY", "")
AM_CLIENT_SECRET = os.getenv("SECRET", "")
AM_TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"

class AmadeusCheckRequest(BaseModel):
    client_id: Optional[str] = None
    client_secret: Optional[str] = None


@router.post("/check")
def check_amadeus_credentials(payload: AmadeusCheckRequest):
    """Request an OAuth2 token from Amadeus to verify credentials.

    Uses payload values if provided, otherwise falls back to environment variables.
    """
    client_id = payload.client_id or AM_CLIENT_ID
    client_secret = payload.client_secret or AM_CLIENT_SECRET

    if not client_id or not client_secret:
        raise HTTPException(status_code=400, detail="Amadeus client id and secret are required (env or payload).")

    try:
        resp = requests.post(
            AM_TOKEN_URL,
            data={
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret,
            },
            timeout=10,
        )
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Network error when contacting Amadeus: {e}")

    try:
        data = resp.json()
    except Exception:
        raise HTTPException(status_code=502, detail="Invalid response from Amadeus token endpoint")

    if resp.status_code != 200:
        # Do not return client_secret; return provider message if available
        message = data.get("error_description") or data.get("error") or data
        raise HTTPException(status_code=401, detail={"status": "invalid_credentials", "provider": message})

    # Success - return token metadata only
    return {
        "status": "success",
        "token_type": data.get("token_type"),
        "expires_in": data.get("expires_in"),
        "scope": data.get("scope"),
        "source": "amadeus_test"
    }
