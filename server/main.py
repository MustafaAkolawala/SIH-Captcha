from pymongo import MongoClient
from fastapi import FastAPI

app = FastAPI()

MONGO_USER = "admin"
MONGO_PASSWORD = "password"
mongo = MongoClient(f"mongo://{MONGO_USER}:{MONGO_PASSWORD}@mongodb:27017/")
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
