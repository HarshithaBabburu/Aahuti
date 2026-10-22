from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import Recipient, RecipientCreate
from app.database.repository import repo

router = APIRouter(prefix="/recipients", tags=["Recipients"])

@router.get("", response_model=List[Recipient])
def list_recipients():
    return repo.recipients.list_all()

@router.get("/{recipient_id}", response_model=Recipient)
def get_recipient(recipient_id: str):
    rec = repo.recipients.get_by_id(recipient_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recipient not found")
    return rec

@router.post("", response_model=Recipient)
def create_recipient(data: RecipientCreate):
    import uuid
    r_id = f"rec_{uuid.uuid4().hex[:8]}"
    return repo.recipients.create(data, r_id)
