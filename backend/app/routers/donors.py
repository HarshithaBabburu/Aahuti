from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import Donor, DonorCreate
from app.database.repository import repo

router = APIRouter(prefix="/donors", tags=["Donors"])

@router.get("", response_model=List[Donor])
def list_donors():
    return repo.donors.list_all()

@router.get("/{donor_id}", response_model=Donor)
def get_donor(donor_id: str):
    donor = repo.donors.get_by_id(donor_id)
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return donor

@router.post("", response_model=Donor)
def create_donor(data: DonorCreate):
    import uuid
    d_id = f"donor_{uuid.uuid4().hex[:8]}"
    return repo.donors.create(data, d_id)
