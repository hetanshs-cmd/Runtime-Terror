#!/usr/bin/env python3
"""
Script to populate GovConnect database with realistic sample data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import (
    SECRET_KEY, DEBUG, HOST, PORT, SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS, SESSION_TYPE
)
from models import db, Hospital, Farmer

def create_app():
    """Create and configure the Flask app"""
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['SESSION_TYPE'] = SESSION_TYPE

    # Initialize extensions
    db.init_app(app)
    Session(app)

    return app

def add_sample_hospitals():
    """Add realistic hospital data"""
    hospitals_data = [
        {
            'name': 'City General Hospital',
            'location': 'Downtown, New Delhi',
            'hospital_type': 'general',
            'num_rooms': 150,
            'num_doctors': 45,
            'num_nurses': 120,
            'capacity': 300,
            'phone': '+91-11-23456789',
            'email': 'info@citygeneral.in'
        },
        {
            'name': 'Apollo Healthcare Center',
            'location': 'Connaught Place, New Delhi',
            'hospital_type': 'specialty',
            'num_rooms': 200,
            'num_doctors': 80,
            'num_nurses': 180,
            'capacity': 450,
            'phone': '+91-11-34567890',
            'email': 'contact@apollohc.in'
        },
        {
            'name': 'Max Super Speciality Hospital',
            'location': 'Saket, New Delhi',
            'hospital_type': 'specialty',
            'num_rooms': 180,
            'num_doctors': 65,
            'num_nurses': 150,
            'capacity': 400,
            'phone': '+91-11-45678901',
            'email': 'info@maxhospital.in'
        },
        {
            'name': 'AIIMS Trauma Center',
            'location': 'Ansari Nagar, New Delhi',
            'hospital_type': 'specialty',
            'num_rooms': 120,
            'num_doctors': 55,
            'num_nurses': 100,
            'capacity': 250,
            'phone': '+91-11-26588500',
            'email': 'trauma@aiims.edu'
        },
        {
            'name': 'Fortis Hospital',
            'location': 'Vasant Kunj, New Delhi',
            'hospital_type': 'general',
            'num_rooms': 160,
            'num_doctors': 50,
            'num_nurses': 140,
            'capacity': 350,
            'phone': '+91-11-42776222',
            'email': 'info@fortis.in'
        },
        {
            'name': 'Medanta Hospital',
            'location': 'Gurgaon, Haryana',
            'hospital_type': 'specialty',
            'num_rooms': 220,
            'num_doctors': 90,
            'num_nurses': 200,
            'capacity': 500,
            'phone': '+91-124-4141414',
            'email': 'info@medanta.org'
        },
        {
            'name': 'Sir Ganga Ram Hospital',
            'location': 'Rajinder Nagar, New Delhi',
            'hospital_type': 'general',
            'num_rooms': 140,
            'num_doctors': 42,
            'num_nurses': 110,
            'capacity': 320,
            'phone': '+91-11-25750000',
            'email': 'info@sgrh.com'
        },
        {
            'name': 'Lok Nayak Hospital',
            'location': 'Central Delhi',
            'hospital_type': 'general',
            'num_rooms': 100,
            'num_doctors': 35,
            'num_nurses': 85,
            'capacity': 220,
            'phone': '+91-11-23232400',
            'email': 'info@loknayak.in'
        },
        {
            'name': 'Ram Manohar Lohia Hospital',
            'location': 'New Delhi',
            'hospital_type': 'general',
            'num_rooms': 130,
            'num_doctors': 40,
            'num_nurses': 95,
            'capacity': 280,
            'phone': '+91-11-23365525',
            'email': 'info@rmlh.nic.in'
        },
        {
            'name': 'Safdarjung Hospital',
            'location': 'Ansari Nagar, New Delhi',
            'hospital_type': 'general',
            'num_rooms': 110,
            'num_doctors': 38,
            'num_nurses': 90,
            'capacity': 240,
            'phone': '+91-11-26707444',
            'email': 'info@safdarjung.in'
        }
    ]

    for hospital_data in hospitals_data:
        hospital = Hospital(**hospital_data)
        db.session.add(hospital)

    db.session.commit()
    print(f"Added {len(hospitals_data)} hospitals to database")

def add_sample_farmers():
    """Add realistic farmer data"""
    farmers_data = [
        {
            'name': 'Rajesh Kumar',
            'location': 'Meerut, Uttar Pradesh',
            'area_plot': 15.5,
            'crop_type': 'wheat,rice,mustard',
            'irrigation_type': 'canal',
            'phone': '+91-9876543210',
            'email': 'rajesh.farmer@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Priya Sharma',
            'location': 'Hisar, Haryana',
            'area_plot': 8.2,
            'crop_type': 'cotton,maize',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543211',
            'email': 'priya.sharma.farm@gmail.com',
            'farm_size_category': 'small'
        },
        {
            'name': 'Amit Singh',
            'location': 'Ludhiana, Punjab',
            'area_plot': 25.8,
            'crop_type': 'wheat,paddy,sugarcane',
            'irrigation_type': 'canal',
            'phone': '+91-9876543212',
            'email': 'amit.singh.farmer@gmail.com',
            'farm_size_category': 'large'
        },
        {
            'name': 'Sunita Devi',
            'location': 'Patna, Bihar',
            'area_plot': 12.3,
            'crop_type': 'rice,wheat,pulses',
            'irrigation_type': 'rainfed',
            'phone': '+91-9876543213',
            'email': 'sunita.devi.farm@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Vikram Patel',
            'location': 'Ahmedabad, Gujarat',
            'area_plot': 18.7,
            'crop_type': 'cotton,groundnut,tobacco',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543214',
            'email': 'vikram.patel.farmer@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Meera Joshi',
            'location': 'Jaipur, Rajasthan',
            'area_plot': 6.5,
            'crop_type': 'bajra,moth,clusterbean',
            'irrigation_type': 'rainfed',
            'phone': '+91-9876543215',
            'email': 'meera.joshi.farm@gmail.com',
            'farm_size_category': 'small'
        },
        {
            'name': 'Ravi Kumar',
            'location': 'Kanpur, Uttar Pradesh',
            'area_plot': 22.1,
            'crop_type': 'wheat,sugarcane,potato',
            'irrigation_type': 'canal',
            'phone': '+91-9876543216',
            'email': 'ravi.kumar.farmer@gmail.com',
            'farm_size_category': 'large'
        },
        {
            'name': 'Kavita Gupta',
            'location': 'Agra, Uttar Pradesh',
            'area_plot': 9.8,
            'crop_type': 'wheat,mustard,potato',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543217',
            'email': 'kavita.gupta.farm@gmail.com',
            'farm_size_category': 'small'
        },
        {
            'name': 'Suresh Chandra',
            'location': 'Varanasi, Uttar Pradesh',
            'area_plot': 16.4,
            'crop_type': 'rice,wheat,sugarcane',
            'irrigation_type': 'canal',
            'phone': '+91-9876543218',
            'email': 'suresh.chandra.farmer@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Anjali Verma',
            'location': 'Lucknow, Uttar Pradesh',
            'area_plot': 11.2,
            'crop_type': 'wheat,paddy,vegetables',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543219',
            'email': 'anjali.verma.farm@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Mohan Lal',
            'location': 'Jodhpur, Rajasthan',
            'area_plot': 14.6,
            'crop_type': 'pearl millet,clusterbean,sesame',
            'irrigation_type': 'rainfed',
            'phone': '+91-9876543220',
            'email': 'mohan.lal.farmer@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Rekha Bai',
            'location': 'Indore, Madhya Pradesh',
            'area_plot': 7.9,
            'crop_type': 'soybean,wheat,chickpea',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543221',
            'email': 'rekha.bai.farm@gmail.com',
            'farm_size_category': 'small'
        },
        {
            'name': 'Dinesh Yadav',
            'location': 'Allahabad, Uttar Pradesh',
            'area_plot': 19.3,
            'crop_type': 'wheat,rice,sugarcane',
            'irrigation_type': 'canal',
            'phone': '+91-9876543222',
            'email': 'dinesh.yadav.farmer@gmail.com',
            'farm_size_category': 'large'
        },
        {
            'name': 'Poonam Singh',
            'location': 'Bhopal, Madhya Pradesh',
            'area_plot': 13.7,
            'crop_type': 'wheat,soybean,maize',
            'irrigation_type': 'tubewell',
            'phone': '+91-9876543223',
            'email': 'poonam.singh.farm@gmail.com',
            'farm_size_category': 'medium'
        },
        {
            'name': 'Ram Prasad',
            'location': 'Gorakhpur, Uttar Pradesh',
            'area_plot': 28.5,
            'crop_type': 'sugarcane,wheat,paddy',
            'irrigation_type': 'canal',
            'phone': '+91-9876543224',
            'email': 'ram.prasad.farmer@gmail.com',
            'farm_size_category': 'large'
        }
    ]

    for farmer_data in farmers_data:
        farmer = Farmer(**farmer_data)
        db.session.add(farmer)

    db.session.commit()
    print(f"Added {len(farmers_data)} farmers to database")

def main():
    """Main function to populate database"""
    app = create_app()

    with app.app_context():
        print("Populating GovConnect database with sample data...")

        # Check if data already exists
        hospital_count = Hospital.query.count()
        farmer_count = Farmer.query.count()

        if hospital_count > 0:
            print(f"Hospitals already exist ({hospital_count} records). Skipping hospital data addition.")
        else:
            add_sample_hospitals()

        if farmer_count > 0:
            print(f"Farmers already exist ({farmer_count} records). Skipping farmer data addition.")
        else:
            add_sample_farmers()

        print("Database population complete!")

if __name__ == '__main__':
    main()