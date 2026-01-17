#!/usr/bin/env python3

"""
Database migration script to add missing columns to hospital table
"""

from app import db, app
from sqlalchemy import text

def migrate_hospital_table():
    """Add missing columns to hospital table"""
    with app.app_context():
        try:
            # Check if columns already exist
            result = db.session.execute(text("DESCRIBE hospital"))
            existing_columns = [row[0] for row in result.fetchall()]

            # Columns to add
            columns_to_add = {
                'address': 'TEXT',
                'pincode': 'VARCHAR(10)',
                'phone': 'VARCHAR(20)',
                'email': 'VARCHAR(120)',
                'website': 'VARCHAR(200)',
                'emergency_contact': 'VARCHAR(20)',
                'total_beds': 'INT',
                'icu_beds': 'INT',
                'emergency_beds': 'INT',
                'specialties': 'JSON',
                'facilities': 'JSON',
                'director_name': 'VARCHAR(200)',
                'director_phone': 'VARCHAR(20)',
                'director_email': 'VARCHAR(120)',
                'established_year': 'INT',
                'accreditation': 'VARCHAR(200)',
                'description': 'TEXT',
                'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
            }

            for column_name, column_type in columns_to_add.items():
                if column_name not in existing_columns:
                    alter_query = f"ALTER TABLE hospital ADD COLUMN {column_name} {column_type}"
                    db.session.execute(text(alter_query))
                    print(f"Added column: {column_name}")

            db.session.commit()
            print("Hospital table migration completed successfully!")

        except Exception as e:
            print(f"Migration error: {e}")
            db.session.rollback()

if __name__ == "__main__":
    migrate_hospital_table()