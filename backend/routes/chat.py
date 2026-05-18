from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
from models import db, Message, User, Doctor, allowed_file

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/messages', methods=['POST'])
def send_message():
    content = request.form.get('content', '')
    sender_id = int(request.form.get('sender_id'))
    receiver_id = int(request.form.get('receiver_id'))
    appointment_id = request.form.get('appointment_id')
    image_url = None
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    if 'image' in request.files:
        f = request.files['image']
        if f and allowed_file(f.filename):
            fn = f'chat/{uuid.uuid4().hex}_{secure_filename(f.filename)}'
            f.save(os.path.join(upload_folder, fn))
            image_url = fn
            
    m = Message(sender_id=sender_id, receiver_id=receiver_id,
                 content=content, image_url=image_url,
                 appointment_id=int(appointment_id) if appointment_id else None)
    db.session.add(m)
    db.session.commit()
    return jsonify({
        'id': m.id, 'sender_id': m.sender_id, 'receiver_id': m.receiver_id,
        'content': m.content, 'image_url': f'/uploads/{m.image_url}' if m.image_url else None,
        'created_at': m.created_at.isoformat(), 'sender_name': m.sender.name
    })

@chat_bp.route('/messages/<int:user1>/<int:user2>', methods=['GET'])
def get_messages(user1, user2):
    msgs = Message.query.filter(
        ((Message.sender_id == user1) & (Message.receiver_id == user2)) |
        ((Message.sender_id == user2) & (Message.receiver_id == user1))
    ).order_by(Message.created_at.asc()).all()
    return jsonify([{
        'id': m.id, 'sender_id': m.sender_id, 'receiver_id': m.receiver_id,
        'content': m.content, 'image_url': f'/uploads/{m.image_url}' if m.image_url else None,
        'created_at': m.created_at.isoformat(), 'sender_name': m.sender.name
    } for m in msgs])

@chat_bp.route('/messages/conversations/<int:user_id>', methods=['GET'])
def get_conversations(user_id):
    msgs = Message.query.filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).order_by(Message.created_at.desc()).all()
    seen = set()
    convos = []
    for m in msgs:
        other_id = m.receiver_id if m.sender_id == user_id else m.sender_id
        if other_id not in seen:
            seen.add(other_id)
            other = User.query.get(other_id)
            if other:
                other_doc = Doctor.query.filter_by(user_id=other_id).first()
                convos.append({
                    'user_id': other_id,
                    'name': other.name,
                    'role': other.role,
                    'profile_image': f'/uploads/{other_doc.profile_image}' if other_doc and other_doc.profile_image else None,
                    'last_message': m.content or '📷 Image',
                    'last_time': m.created_at.isoformat()
                })
    return jsonify(convos)
