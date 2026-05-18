from flask import Blueprint, request, jsonify
from models import db, Appointment, appt_to_dict

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/appointments', methods=['POST'])
def book_appointment():
    d = request.json
    # Check if slot already booked
    existing = Appointment.query.filter_by(
        doctor_id=d['doctor_id'], date=d['date'],
        time_slot=d['time_slot'], status='confirmed'
    ).first()
    if existing:
        return jsonify({'error': 'Slot already booked'}), 400
    a = Appointment(patient_id=d['patient_id'], doctor_id=d['doctor_id'],
                    date=d['date'], time_slot=d['time_slot'], notes=d.get('notes',''))
    db.session.add(a)
    db.session.commit()
    return jsonify({'message': 'Appointment booked', 'id': a.id})

@appointments_bp.route('/appointments/patient/<int:patient_id>', methods=['GET'])
def patient_appointments(patient_id):
    appts = Appointment.query.filter_by(patient_id=patient_id).order_by(Appointment.created_at.desc()).all()
    return jsonify([appt_to_dict(a) for a in appts])

@appointments_bp.route('/appointments/doctor/<int:doctor_id>', methods=['GET'])
def doctor_appointments(doctor_id):
    appts = Appointment.query.filter_by(doctor_id=doctor_id).order_by(Appointment.created_at.desc()).all()
    return jsonify([appt_to_dict(a) for a in appts])

@appointments_bp.route('/appointments/<int:appt_id>/status', methods=['PUT'])
def update_appointment_status(appt_id):
    a = Appointment.query.get_or_404(appt_id)
    a.status = request.json.get('status', a.status)
    db.session.commit()
    return jsonify({'message': 'Updated', 'status': a.status})
