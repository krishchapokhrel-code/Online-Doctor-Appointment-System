from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='patient')  # patient | doctor | admin
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    specialty = db.Column(db.String(100))
    bio = db.Column(db.Text)
    experience_years = db.Column(db.Integer, default=0)
    consultation_fee = db.Column(db.Float, default=0)
    profile_image = db.Column(db.String(200))
    degree_image = db.Column(db.String(200))
    status = db.Column(db.String(20), default='pending')  # pending | approved | rejected
    available_slots = db.Column(db.Text, default='[]')  # JSON array of time slots
    user = db.relationship('User', backref='doctor_profile')

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time_slot = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending | confirmed | cancelled | completed
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    patient = db.relationship('User', foreign_keys=[patient_id])
    doctor = db.relationship('Doctor', foreign_keys=[doctor_id])

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'))
    content = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    sender = db.relationship('User', foreign_keys=[sender_id])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png','jpg','jpeg','gif','pdf'}

def doctor_to_dict(doc):
    user = doc.user
    slots = []
    try:
        slots = json.loads(doc.available_slots or '[]')
    except:
        pass
    return {
        'id': doc.id,
        'user_id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'specialty': doc.specialty,
        'bio': doc.bio,
        'experience_years': doc.experience_years,
        'consultation_fee': doc.consultation_fee,
        'profile_image': f'/uploads/{doc.profile_image}' if doc.profile_image else None,
        'degree_image': f'/uploads/{doc.degree_image}' if doc.degree_image else None,
        'status': doc.status,
        'available_slots': slots,
    }

def appt_to_dict(a):
    return {
        'id': a.id,
        'patient_id': a.patient_id,
        'patient_name': a.patient.name,
        'patient_email': a.patient.email,
        'doctor_id': a.doctor_id,
        'doctor_name': a.doctor.user.name,
        'doctor_specialty': a.doctor.specialty,
        'doctor_profile': f'/uploads/{a.doctor.profile_image}' if a.doctor.profile_image else None,
        'date': a.date,
        'time_slot': a.time_slot,
        'status': a.status,
        'notes': a.notes,
        'created_at': a.created_at.isoformat(),
    }
