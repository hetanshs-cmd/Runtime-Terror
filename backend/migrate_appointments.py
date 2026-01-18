#!/usr/bin/env python3
"""
Migration script to add created_by column to appointments table.
Run this script to update the appointments table with the new column.
"""

from models import db
from config import SQLALCHEMY_DATABASE_URI
from flask import Flask
import logging
import mysql.connector as con

def migrate_appointments_table():
    """Add created_by column to appointments table"""
    try:
        # Connect to database directly for migration
        connector = con.connect(
            host='localhost',
            user='govconnect',
            password='govconnect123',
            database='govconnect'
        )
        cursor = connector.cursor()

        # Check if column already exists
        cursor.execute("SHOW COLUMNS FROM appointments LIKE 'created_by'")
        if cursor.fetchone():
            print("✅ created_by column already exists in appointments table")
            return

        # Add the created_by column
        cursor.execute("""
            ALTER TABLE appointments
            ADD COLUMN created_by INT NULL,
            ADD CONSTRAINT fk_appointments_created_by
            FOREIGN KEY (created_by) REFERENCES users(id)
        """)

        connector.commit()
        print("✅ Successfully added created_by column to appointments table")

    except Exception as e:
        print(f"❌ Error migrating appointments table: {e}")
        connector.rollback()
    finally:
        if 'connector' in locals():
            connector.close()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    migrate_appointments_table()