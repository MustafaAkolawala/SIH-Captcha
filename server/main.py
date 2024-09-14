from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint of the ML Captcha Service.
    """
    return {"message": "Welcome to the ML Captcha Service"}
