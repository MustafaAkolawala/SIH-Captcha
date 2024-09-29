from pydantic import BaseModel
from typing import List

class MouseMovement(BaseModel):
    x: int
    y: int

class BehaviorData(BaseModel):
    mouseMovements: List[MouseMovement]
    scrollSpeed: List[int]
    typingSpeed: List[int]
    clicks: int
    tabChanges: int

class VerifyCaptchaRequest(BaseModel):
    aadhaarNumber: str
    behavior: BehaviorData
