from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.models.user import User, UserRole
from app.models.faculty import Faculty
from app.utils.dependencies import RoleChecker, get_current_user
from app.schemas.material import MaterialCreate, MaterialResponse
from app.services import material_service

router = APIRouter(
    prefix="/api/materials",
    tags=["Materials"]
)

@router.post("", response_model=MaterialResponse, dependencies=[Depends(RoleChecker([UserRole.FACULTY]))])
def upload_material(material_data: MaterialCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
    if not faculty:
        raise HTTPException(status_code=403, detail="Only faculty can upload materials")
    return material_service.upload_material(db, faculty.id, material_data)

@router.get("/course/{course_id}", response_model=List[MaterialResponse], dependencies=[Depends(RoleChecker([UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN]))])
def get_materials(course_id: int, db: Session = Depends(get_db)):
    return material_service.get_materials_for_course(db, course_id)
