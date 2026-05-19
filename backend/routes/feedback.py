from flask import Blueprint, request, jsonify, send_file
from models import db, Appointment, Feedback
from io import BytesIO
from datetime import datetime

# Import reportlab components
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
def save_feedback():
    d = request.json
    appt_id = d.get('appointment_id')
    if not appt_id:
        return jsonify({'error': 'appointment_id is required'}), 400
        
    appt = Appointment.query.get_or_404(appt_id)
    
    # Create or update medical report
    fb = Feedback.query.filter_by(appointment_id=appt_id).first()
    if not fb:
        fb = Feedback(
            appointment_id=appt_id,
            diagnosis=d.get('diagnosis', ''),
            prescription=d.get('prescription', ''),
            advice=d.get('advice', '')
        )
        db.session.add(fb)
    else:
        fb.diagnosis = d.get('diagnosis', fb.diagnosis)
        fb.prescription = d.get('prescription', fb.prescription)
        fb.advice = d.get('advice', fb.advice)
        
    # Mark appointment status as completed automatically
    appt.status = 'completed'
    db.session.commit()
    
    return jsonify({
        'message': 'Medical report saved successfully',
        'feedback': {
            'id': fb.id,
            'appointment_id': fb.appointment_id,
            'diagnosis': fb.diagnosis,
            'prescription': fb.prescription,
            'advice': fb.advice,
            'created_at': fb.created_at.isoformat()
        }
    }), 200

@feedback_bp.route('/feedback/appointment/<int:appt_id>/pdf', methods=['GET'])
def download_feedback_pdf(appt_id):
    appt = Appointment.query.get_or_404(appt_id)
    if not appt.feedback:
        return jsonify({'error': 'No medical report exists for this appointment'}), 404
        
    fb = appt.feedback
    
    # Initialize dynamic output stream
    pdf_buffer = BytesIO()
    
    # Set up reportlab document properties
    doc = SimpleDocTemplate(
        pdf_buffer,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom high-fidelity styles
    teal_color = colors.HexColor('#0d9488')
    text_color = colors.HexColor('#1e293b')
    border_color = colors.HexColor('#cbd5e1')
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=teal_color,
        leading=26,
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#64748b'),
        leading=14
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=teal_color,
        spaceBefore=14,
        spaceAfter=6,
        leading=18
    )
    
    body_style = ParagraphStyle(
        'BodyTxt',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        textColor=text_color,
        leading=16
    )
    
    meta_label_style = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        leading=12
    )
    
    meta_val_style = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=text_color,
        leading=12
    )
    
    # 1. Clinic Letterhead Header
    story.append(Paragraph("AURA HEALTH MEDICAL CENTER", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Clinical Care, Consultations & Digital Diagnostics Prescriptions", subtitle_style))
    story.append(Spacer(1, 12))
    
    # Teal horizontal separator rule
    story.append(HRFlowable(
        width="100%",
        thickness=2.5,
        color=teal_color,
        spaceBefore=0,
        spaceAfter=16
    ))
    
    # 2. Metadata details block (Patient, Doctor, Appointment Info)
    meta_data = [
        [
            Paragraph("Patient Name:", meta_label_style),
            Paragraph(appt.patient.name, meta_val_style),
            Paragraph("Consultation Date:", meta_label_style),
            Paragraph(f"{appt.date} at {appt.time_slot}", meta_val_style),
        ],
        [
            Paragraph("Patient Email:", meta_label_style),
            Paragraph(appt.patient.email, meta_val_style),
            Paragraph("Medical License:", meta_label_style),
            Paragraph("EHR-VALIDATED", meta_val_style),
        ],
        [
            Paragraph("Consulting Doctor:", meta_label_style),
            Paragraph(f"Dr. {appt.doctor.user.name}", meta_val_style),
            Paragraph("Specialty Area:", meta_label_style),
            Paragraph(appt.doctor.specialty or "General Medicine", meta_val_style),
        ]
    ]
    
    meta_table = Table(meta_data, colWidths=[110, 140, 110, 144])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#f1f5f9')),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 20))
    
    # 3. Clinical Diagnosis Section
    story.append(Paragraph("I. Diagnosis & Assessment Findings", section_title_style))
    story.append(Paragraph(fb.diagnosis or "No specific diagnosis provided.", body_style))
    story.append(Spacer(1, 14))
    
    # 4. Prescriptions Table Section
    story.append(Paragraph("II. Prescriptions & Dosage Matrix", section_title_style))
    
    # Render prescription items inside a beautiful clinical grid
    rx_lines = [line.strip() for line in fb.prescription.split('\n') if line.strip()]
    if rx_lines:
        rx_data = [[
            Paragraph("<strong>Medication / Treatment</strong>", meta_label_style),
            Paragraph("<strong>Dosage Directions / Frequency</strong>", meta_label_style)
        ]]
        for line in rx_lines:
            # Check if there is a dash or colon to split medication name and directions
            if ' - ' in line:
                med, dose = line.split(' - ', 1)
            elif ': ' in line:
                med, dose = line.split(': ', 1)
            elif '–' in line:
                med, dose = line.split('–', 1)
            else:
                med, dose = line, "As directed by medical provider."
            rx_data.append([
                Paragraph(med, body_style),
                Paragraph(dose, body_style)
            ])
            
        rx_table = Table(rx_data, colWidths=[240, 264])
        rx_table_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
            ('PADDING', (0, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ]
        
        # Alternating row colors
        for i in range(1, len(rx_data)):
            if i % 2 == 0:
                rx_table_style.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f8fafc')))
                
        rx_table.setStyle(TableStyle(rx_table_style))
        story.append(rx_table)
    else:
        story.append(Paragraph("No active medications prescribed.", body_style))
        
    story.append(Spacer(1, 14))
    
    # 5. Doctor Advice & Directions Section
    story.append(Paragraph("III. Therapeutic Advice & Recuperation Plan", section_title_style))
    story.append(Paragraph(fb.advice or "Standard rest and monitoring recommended.", body_style))
    story.append(Spacer(1, 40))
    
    # 6. Signature Block
    sig_data = [
        ["", f"Dr. {appt.doctor.user.name}"],
        ["", "Aura Health Clinical Practitioner"],
        ["", f"Report Date: {datetime.now().strftime('%Y-%m-%d')}"]
    ]
    sig_table = Table(sig_data, colWidths=[300, 204])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEABOVE', (1, 0), (1, 0), 1, colors.HexColor('#64748b')),
        ('PADDING', (0, 0), (-1, -1), 2),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#475569')),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (1, 0), (1, -1), 9),
    ]))
    story.append(sig_table)
    
    # 7. Document Footer Disclaimer
    story.append(Spacer(1, 30))
    story.append(HRFlowable(
        width="100%",
        thickness=0.5,
        color=border_color,
        spaceBefore=0,
        spaceAfter=10
    ))
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor('#94a3b8'),
        alignment=TA_CENTER,
        leading=10
    )
    story.append(Paragraph(
        "Disclaimer: This is a verified electronic health record generated by Aura Health. "
        "For urgent inquiries, please contact your clinical practitioner directly.",
        disclaimer_style
    ))
    
    # Build PDF document
    doc.build(story)
    
    pdf_buffer.seek(0)
    
    # Send PDF byte payload
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"Medical_Report_{appt_id}.pdf"
    )
