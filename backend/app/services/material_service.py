from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
from app.models.material import Material
from app.schemas.material import MaterialCreate

def upload_material(db: Session, faculty_id: int, material_data: MaterialCreate) -> Material:
    new_material = Material(
        course_id=material_data.course_id,
        faculty_id=faculty_id,
        title=material_data.title,
        description=material_data.description,
        file_path=material_data.file_path
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    return new_material

def get_materials_for_course(db: Session, course_id: int) -> List[Material]:
    return db.query(Material).filter(Material.course_id == course_id).order_by(Material.uploaded_at.desc()).all()
