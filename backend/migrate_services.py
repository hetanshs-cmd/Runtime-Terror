#!/usr/bin/env python3
"""
Migration script to add services table for dynamic service management.
Run this script to add the services table to your database.
"""

from models import db, Service
from config import SQLALCHEMY_DATABASE_URI
from flask import Flask
import logging

def create_services_table():
    """Create the services table"""
    try:
        # Create Flask app context
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        db.init_app(app)

        with app.app_context():
            # Create the services table
            db.create_all()

            # Add some default built-in services
            builtin_services = [
                {
                    'name': 'healthcare',
                    'display_name': 'Healthcare',
                    'description': 'Healthcare services and hospital management',
                    'icon': 'Heart',
                    'route': '/healthcare',
                    'component_name': 'HealthcarePage',
                    'is_active': True,
                    'is_builtin': True,
                    'created_by': 1  # Assuming super_admin has ID 1
                },
                {
                    'name': 'agriculture',
                    'display_name': 'Agriculture',
                    'description': 'Agriculture and farmer management services',
                    'icon': 'Sprout',
                    'route': '/agriculture',
                    'component_name': 'AgriculturePage',
                    'is_active': True,
                    'is_builtin': True,
                    'created_by': 1
                },
                {
                    'name': 'alerts',
                    'display_name': 'Alerts',
                    'description': 'System alerts and notifications',
                    'icon': 'AlertTriangle',
                    'route': '/alerts',
                    'component_name': 'AlertsPage',
                    'is_active': True,
                    'is_builtin': True,
                    'created_by': 1
                },
                {
                    'name': 'admin',
                    'display_name': 'Admin',
                    'description': 'System administration and user management',
                    'icon': 'Shield',
                    'route': '/admin',
                    'component_name': 'AdminPage',
                    'is_active': True,
                    'is_builtin': True,
                    'created_by': 1
                }
            ]

            for service_data in builtin_services:
                # Check if service already exists
                existing = Service.query.filter_by(route=service_data['route']).first()
                if not existing:
                    service = Service(**service_data)
                    db.session.add(service)
                    print(f"Added built-in service: {service_data['display_name']}")

            db.session.commit()
            print("Services table created and populated successfully!")

    except Exception as e:
        logging.error(f"Error creating services table: {e}")
        print(f"Error: {e}")

if __name__ == '__main__':
    create_services_table()