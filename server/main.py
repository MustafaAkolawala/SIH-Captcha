from pymongo import MongoClient
from fastapi import FastAPI

from app.schema import VerifyCaptchaRequest
from app.verify_human import verifyHuman

app = FastAPI()

MONGO_USER = "admin"
MONGO_PASSWORD = "password"
mongo = MongoClient(f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@mongodb:27017/")
fingerCollection = mongo["captcha"]["fingerprint"]

@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint of the ML Captcha Service.
    """
    return {"message": "Welcome to the ML Captcha Service"}

@app.post("/api/fingerprint")
async def add_fingerprint(fingerprint: dict[str, str]) -> dict[str, str]:
    """
    Add a fingerprint to the database.
    """
    try:
        fingerCollection.insert_one(fingerprint)
        return {"message": "Fingerprinted successfully"}
    except Exception as e:
        return {"message": f"An error occurred: {e}"}

@app.post("/api/verify-captcha")
async def verify_captcha(cap: VerifyCaptchaRequest) -> dict[str, str|int]:
    """
    Verify the captcha.
    """
    try:
        if verifyHuman(cap.behavior):
            return {"message": "Captcha verified", "success": 1}
        else:
            return {"message": "Captcha not verified", "success": 0}
    except Exception as e:
        return {"message": f"An error occurred: {e}", "success": 0}
