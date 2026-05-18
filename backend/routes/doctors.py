from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
import json
from models import db, Doctor, allowed_file, doctor_to_dict

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/doctors', methods=['GET'])
def get_doctors():
    docs = Doctor.query.filter_by(status='approved').all()
    return jsonify([doctor_to_dict(d) for d in docs])

@doctors_bp.route('/doctors/<int:doc_id>', methods=['GET'])
def get_doctor(doc_id):
    doc = Doctor.query.get_or_404(doc_id)
    return jsonify(doctor_to_dict(doc))

@doctors_bp.route('/doctors/<int:doc_id>/slots', methods=['PUT'])
def update_slots(doc_id):
    doc = Doctor.query.get_or_404(doc_id)
    doc.available_slots = json.dumps(request.json.get('slots', []))
    db.session.commit()
    return jsonify({'message': 'Slots updated'})

@doctors_bp.route('/doctors/<int:doc_id>/upload', methods=['POST'])
def upload_doctor_files(doc_id):
    doc = Doctor.query.get_or_404(doc_id)
    upload_folder = current_app.config['UPLOAD_FOLDER']
    if 'profile' in request.files:
        f = request.files['profile']
        if f and allowed_file(f.filename):
            fn = f'profiles/{uuid.uuid4().hex}_{secure_filename(f.filename)}'
            f.save(os.path.join(upload_folder, fn))
            doc.profile_image = fn
    if 'degree' in request.files:
        f = request.files['degree']
        if f and allowed_file(f.filename):
            fn = f'degrees/{uuid.uuid4().hex}_{secure_filename(f.filename)}'
            f.save(os.path.join(upload_folder, fn))
            doc.degree_image = fn
    db.session.commit()
    return jsonify({'message': 'Files uploaded', 'doctor': doctor_to_dict(doc)})

@doctors_bp.route('/doctors/my/<int:user_id>', methods=['GET'])
def get_my_doctor_profile(user_id):
    doc = Doctor.query.filter_by(user_id=user_id).first()
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(doctor_to_dict(doc))

@doctors_bp.route('/doctors/<int:doc_id>/profile', methods=['PUT'])
def update_doctor_profile(doc_id):
    doc = Doctor.query.get_or_404(doc_id)
    d = request.json
    doc.specialty = d.get('specialty', doc.specialty)
    doc.bio = d.get('bio', doc.bio)
    doc.experience_years = d.get('experience_years', doc.experience_years)
    doc.consultation_fee = d.get('consultation_fee', doc.consultation_fee)
    db.session.commit()
    return jsonify(doctor_to_dict(doc))
