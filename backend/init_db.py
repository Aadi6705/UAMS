import os
import pymysql
import bcrypt
from dotenv import load_dotenv

from app.config.database import engine, Base, SessionLocal
from app.models import User, UserRole, Department

load_dotenv()

def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_database_if_not_exists():
    host = os.getenv("MYSQL_HOST", "localhost")
    port = int(os.getenv("MYSQL_PORT", "3306"))
    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD", "root")
    database = os.getenv("MYSQL_DATABASE", "uams")

    try:
        # Connect to MySQL server without specifying the database
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database};")
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Database '{database}' ensured.")
    except Exception as e:
        print(f"Error creating database: {e}")
        # Not exiting here because maybe it already exists and the user doesn't have create permissions

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

def seed_data():
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        print("Seeding admin user...")
        admin_user = User(
            username="admin",
            email="admin@university.edu",
            password_hash=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("Admin user seeded (admin@university.edu / admin123).")
    
    # Check if departments exist
    dept = db.query(Department).first()
    if not dept:
        print("Seeding departments...")
        d1 = Department(name="Computer Science", code="CS")
        d2 = Department(name="Electrical Engineering", code="EE")
        d3 = Department(name="Mechanical Engineering", code="ME")
        db.add_all([d1, d2, d3])
        db.commit()
        print("Departments seeded.")
        
    db.close()

if __name__ == "__main__":
    create_database_if_not_exists()
    init_db()
    seed_data()
    print("Database initialization complete.")
