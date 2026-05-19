from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import uuid
from models import db, User, Doctor, allowed_file, doctor_to_dict

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.is_json:
        d = request.json
    else:
        d = request.form

    if User.query.filter_by(email=d['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    u = User(
        name=d['name'], email=d['email'],
        password=generate_password_hash(d['password']),
        role=d.get('role', 'patient'),
        phone=d.get('phone', '')
    )
    db.session.add(u)
    db.session.flush()

    if u.role == 'doctor':
        profile_fn = None
        degree_fn = None
        upload_folder = current_app.config['UPLOAD_FOLDER']

        if 'profile' in request.files:
            f = request.files['profile']
            if f and allowed_file(f.filename):
                profile_fn = f'profiles/{uuid.uuid4().hex}_{secure_filename(f.filename)}'
                f.save(os.path.join(upload_folder, profile_fn))

        if 'degree' in request.files:
            f = request.files['degree']
            if f and allowed_file(f.filename):
                degree_fn = f'degrees/{uuid.uuid4().hex}_{secure_filename(f.filename)}'
                f.save(os.path.join(upload_folder, degree_fn))

        doc = Doctor(
            user_id=u.id, 
            specialty=d.get('specialty',''), 
            bio=d.get('bio',''),
            experience_years=int(d.get('experience_years', 0)) if d.get('experience_years') else 0,
            consultation_fee=float(d.get('consultation_fee', 0)) if d.get('consultation_fee') else 0.0,
            profile_image=profile_fn,
            degree_image=degree_fn,
            status='pending'
        )
        db.session.add(doc)

    db.session.commit()
    return jsonify({'message': 'Registered successfully', 'user_id': u.id, 'role': u.role})

@auth_bp.route('/login', methods=['POST'])
def login():
    d = request.json
    role = d.get('role')
    u = User.query.filter_by(email=d['email']).first()
    if not u or not check_password_hash(u.password, d['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    # Enforce role alignment to block cross-login attempts
    if role and u.role != role:
        return jsonify({'error': f"Unauthorized access. Your profile is registered as a {u.role}."}), 403
        
    doc_id = None
    if u.role == 'doctor':
        doc = Doctor.query.filter_by(user_id=u.id).first()
        doc_id = doc.id if doc else None
    return jsonify({'user_id': u.id, 'name': u.name, 'email': u.email,
                    'role': u.role, 'doctor_id': doc_id})

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    d = request.json
    email = d.get('email')
    u = User.query.filter_by(email=email).first()
    if not u:
        return jsonify({'error': 'Email address not registered'}), 404
    return jsonify({'message': 'User verified. Please set your new password.'})

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    d = request.json
    email = d.get('email')
    new_password = d.get('new_password')
    if not new_password or len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    u = User.query.filter_by(email=email).first()
    if not u:
        return jsonify({'error': 'Email address not registered'}), 404
    u.password = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({'message': 'Password has been reset successfully. Please log in.'})
