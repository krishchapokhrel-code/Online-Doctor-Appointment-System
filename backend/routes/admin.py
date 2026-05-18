from flask import Blueprint, request, jsonify
from models import db, Doctor, User, Appointment, doctor_to_dict

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/doctors', methods=['GET'])
def admin_get_doctors():
    docs = Doctor.query.all()
    return jsonify([doctor_to_dict(d) for d in docs])

@admin_bp.route('/admin/doctors/<int:doc_id>/status', methods=['PUT'])
def admin_update_doctor_status(doc_id):
    doc = Doctor.query.get_or_404(doc_id)
    doc.status = request.json.get('status', doc.status)
    db.session.commit()
    return jsonify({'message': 'Status updated', 'status': doc.status})

@admin_bp.route('/admin/stats', methods=['GET'])
def admin_stats():
    return jsonify({
        'total_doctors': Doctor.query.count(),
        'pending_doctors': Doctor.query.filter_by(status='pending').count(),
        'approved_doctors': Doctor.query.filter_by(status='approved').count(),
        'total_patients': User.query.filter_by(role='patient').count(),
        'total_appointments': Appointment.query.count(),
    })
