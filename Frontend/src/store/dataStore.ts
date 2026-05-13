import { create } from 'zustand';

// ── Types ──
export interface Appointment {
  id: string; patientId: string; patientName: string; doctorId: string; doctorName: string;
  doctorSpecialty: string; date: string; time: string; session: 'AM'|'PM'; type: 'In-person'|'Video Consult';
  location: string; status: 'pending'|'confirmed'|'in-progress'|'completed'|'cancelled';
  issue?: string; phone?: string; createdAt: string;
}
export interface Report {
  id: string; patientId: string; patientName: string; doctorId: string; doctorName: string;
  title: string; type: 'Lab Report'|'Imaging'|'Prescription'|'Visit Summary'|'Diagnosis';
  date: string; notes?: string; fileName?: string; fileUrl?: string; createdAt: string;
}
export interface Message {
  id: string; conversationId: string; from: string; fromRole: 'patient'|'doctor';
  text: string; time: string; read: boolean;
}
export interface Conversation {
  id: string; patientId: string; patientName: string; doctorId: string; doctorName: string;
  doctorSpecialty: string; lastMessage: string; lastTime: string; unreadCount: number;
}
export interface Notification {
  id: string; userId: string; title: string; message: string; type: 'appointment'|'report'|'message'|'system';
  read: boolean; link?: string; createdAt: string;
}
export interface DoctorProfile {
  id: string; name: string; specialty: string; rating: number; reviews: number;
  status: 'Available'|'Busy'|'Offline'; experience: string; email: string;
}
export interface PatientProfile {
  id: string; name: string; age: number; gender: string; email: string; phone: string;
  condition: string; lastVisit: string; status: 'active'|'pending'|'suspended';
}
export interface SystemSettings {
  platformName: string; slotDuration: number; maxAppointmentsPerDoctor: number;
  maintenanceMode: boolean; allowRegistration: boolean;
}
export interface LogEntry {
  id: string; userId: string; userName: string; action: string; details: string;
  timestamp: string; type: 'auth'|'appointment'|'report'|'admin'|'system';
}

// ── Helper ──
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();
const timeStr = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function loadJSON<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function saveJSON(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

// ── Seed Data ──
const seedDoctors: DoctorProfile[] = [
  { id: 'd1', name: 'Dr. Aasha Poudel', specialty: 'Cardiologist', rating: 4.9, reviews: 128, status: 'Available', experience: '12 years', email: 'aasha@aura.com' },
  { id: 'd2', name: 'Dr. Saugat Rijal', specialty: 'General Physician', rating: 4.8, reviews: 214, status: 'Busy', experience: '8 years', email: 'saugat@aura.com' },
  { id: 'd3', name: 'Dr. Kriti Gurung', specialty: 'Dermatologist', rating: 4.7, reviews: 96, status: 'Available', experience: '6 years', email: 'kriti@aura.com' },
];
const seedPatients: PatientProfile[] = [
  { id: 'p1', name: 'Aarav Shrestha', age: 34, gender: 'Male', email: 'aarav@mail.com', phone: '9841234567', condition: 'Hypertension', lastVisit: 'Oct 05, 2023', status: 'active' },
  { id: 'p2', name: 'Saanvi Karki', age: 29, gender: 'Female', email: 'saanvi@mail.com', phone: '9812345678', condition: 'Diabetes Type 2', lastVisit: 'Sep 28, 2023', status: 'active' },
  { id: 'p3', name: 'Rijan Basnet', age: 45, gender: 'Male', email: 'rijan@mail.com', phone: '9856789012', condition: 'Arthritis', lastVisit: 'Sep 15, 2023', status: 'active' },
];
const seedAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd1', doctorName: 'Dr. Aasha Poudel', doctorSpecialty: 'Cardiologist', date: 'Oct 12, 2023', time: '09:30', session: 'AM', type: 'In-person', location: 'Heart Care Center, Room 302', status: 'confirmed', createdAt: now() },
  { id: 'a2', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd2', doctorName: 'Dr. Saugat Rijal', doctorSpecialty: 'General Physician', date: 'Oct 15, 2023', time: '02:15', session: 'PM', type: 'Video Consult', location: 'Online', status: 'pending', createdAt: now() },
  { id: 'a3', patientId: 'p2', patientName: 'Saanvi Karki', doctorId: 'd1', doctorName: 'Dr. Aasha Poudel', doctorSpecialty: 'Cardiologist', date: 'Oct 12, 2023', time: '10:30', session: 'AM', type: 'In-person', location: 'Heart Care Center, Room 302', status: 'confirmed', createdAt: now() },
];
const seedReports: Report[] = [
  { id: 'r1', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd2', doctorName: 'Dr. Saugat Rijal', title: 'Complete Blood Count', type: 'Lab Report', date: 'Oct 05, 2023', notes: 'All values normal', createdAt: now() },
  { id: 'r2', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd1', doctorName: 'Dr. Aasha Poudel', title: 'Echocardiogram', type: 'Imaging', date: 'Sep 12, 2023', notes: 'Normal cardiac function', createdAt: now() },
  { id: 'r3', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd2', doctorName: 'Dr. Saugat Rijal', title: 'Annual Physical Report', type: 'Visit Summary', date: 'Jan 15, 2023', createdAt: now() },
];
const seedConversations: Conversation[] = [
  { id: 'c1', patientId: 'p1', patientName: 'Aarav Shrestha', doctorId: 'd1', doctorName: 'Dr. Aasha Poudel', doctorSpecialty: 'Cardiologist', lastMessage: 'How are you feeling today?', lastTime: '10:05 AM', unreadCount: 1 },
];
const seedMessages: Message[] = [
  { id: 'm1', conversationId: 'c1', from: 'd1', fromRole: 'doctor', text: 'Namaste! How can I help you today?', time: '10:05 AM', read: true },
  { id: 'm2', conversationId: 'c1', from: 'p1', fromRole: 'patient', text: 'I have mild chest discomfort after walking.', time: '10:06 AM', read: true },
];

// ── Store ──
interface DataState {
  doctors: DoctorProfile[]; patients: PatientProfile[]; appointments: Appointment[];
  reports: Report[]; conversations: Conversation[]; messages: Message[];
  notifications: Notification[]; logs: LogEntry[];
  settings: SystemSettings;
  // Appointments
  addAppointment: (a: Omit<Appointment, 'id'|'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;
  // Reports
  addReport: (r: Omit<Report, 'id'|'createdAt'>) => void;
  // Messages
  sendMessage: (conversationId: string, from: string, fromRole: 'patient'|'doctor', text: string) => void;
  getOrCreateConversation: (patientId: string, patientName: string, doctorId: string, doctorName: string, doctorSpecialty: string) => string;
  // Notifications
  addNotification: (n: Omit<Notification, 'id'|'createdAt'|'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  // Admin
  updatePatientStatus: (id: string, status: PatientProfile['status']) => void;
  updateDoctorStatus: (id: string, status: DoctorProfile['status']) => void;
  deleteUser: (id: string, type: 'doctor'|'patient') => void;
  updateSettings: (s: Partial<SystemSettings>) => void;
  addLog: (l: Omit<LogEntry, 'id'|'timestamp'>) => void;
  // Helpers
  getPatientAppointments: (patientId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getPatientReports: (patientId: string) => Report[];
  getConversationMessages: (conversationId: string) => Message[];
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

const persist = (state: DataState) => {
  saveJSON('ds_doctors', state.doctors); saveJSON('ds_patients', state.patients);
  saveJSON('ds_appointments', state.appointments); saveJSON('ds_reports', state.reports);
  saveJSON('ds_conversations', state.conversations); saveJSON('ds_messages', state.messages);
  saveJSON('ds_notifications', state.notifications); saveJSON('ds_logs', state.logs);
  saveJSON('ds_settings', state.settings);
};

export const useDataStore = create<DataState>((set, get) => ({
  doctors: loadJSON('ds_doctors', seedDoctors),
  patients: loadJSON('ds_patients', seedPatients),
  appointments: loadJSON('ds_appointments', seedAppointments),
  reports: loadJSON('ds_reports', seedReports),
  conversations: loadJSON('ds_conversations', seedConversations),
  messages: loadJSON('ds_messages', seedMessages),
  notifications: loadJSON('ds_notifications', []),
  logs: loadJSON('ds_logs', []),
  settings: loadJSON('ds_settings', { platformName: 'Aura Health', slotDuration: 30, maxAppointmentsPerDoctor: 20, maintenanceMode: false, allowRegistration: true }),

  addAppointment: (a) => set(s => {
    const apt: Appointment = { ...a, id: uid(), createdAt: now() };
    const n: Notification = { id: uid(), userId: a.doctorId, title: 'New Appointment', message: `${a.patientName} booked an appointment for ${a.date} at ${a.time}`, type: 'appointment', read: false, createdAt: now() };
    const next = { ...s, appointments: [...s.appointments, apt], notifications: [...s.notifications, n] };
    persist(next); return next;
  }),
  updateAppointmentStatus: (id, status) => set(s => {
    const appointments = s.appointments.map(a => a.id === id ? { ...a, status } : a);
    const apt = appointments.find(a => a.id === id);
    const notifications = apt ? [...s.notifications, { id: uid(), userId: status === 'completed' || status === 'confirmed' ? apt.patientId : apt.doctorId, title: `Appointment ${status}`, message: `Appointment with ${status === 'completed' || status === 'confirmed' ? apt.doctorName : apt.patientName} has been ${status}`, type: 'appointment' as const, read: false, createdAt: now() }] : s.notifications;
    const next = { ...s, appointments, notifications }; persist(next); return next;
  }),
  cancelAppointment: (id) => set(s => {
    const appointments = s.appointments.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a);
    const next = { ...s, appointments }; persist(next); return next;
  }),
  addReport: (r) => set(s => {
    const report: Report = { ...r, id: uid(), createdAt: now() };
    const n: Notification = { id: uid(), userId: r.patientId, title: 'New Report', message: `${r.doctorName} uploaded "${r.title}"`, type: 'report', read: false, createdAt: now() };
    const next = { ...s, reports: [...s.reports, report], notifications: [...s.notifications, n] };
    persist(next); return next;
  }),
  sendMessage: (conversationId, from, fromRole, text) => set(s => {
    const msg: Message = { id: uid(), conversationId, from, fromRole, text, time: timeStr(), read: false };
    const conversations = s.conversations.map(c => c.id === conversationId ? { ...c, lastMessage: text, lastTime: msg.time, unreadCount: c.unreadCount + 1 } : c);
    const next = { ...s, messages: [...s.messages, msg], conversations }; persist(next); return next;
  }),
  getOrCreateConversation: (patientId, patientName, doctorId, doctorName, doctorSpecialty) => {
    const existing = get().conversations.find(c => c.patientId === patientId && c.doctorId === doctorId);
    if (existing) return existing.id;
    const conv: Conversation = { id: uid(), patientId, patientName, doctorId, doctorName, doctorSpecialty, lastMessage: '', lastTime: timeStr(), unreadCount: 0 };
    set(s => { const next = { ...s, conversations: [...s.conversations, conv] }; persist(next); return next; });
    return conv.id;
  },
  addNotification: (n) => set(s => {
    const next = { ...s, notifications: [...s.notifications, { ...n, id: uid(), read: false, createdAt: now() }] }; persist(next); return next;
  }),
  markNotificationRead: (id) => set(s => {
    const next = { ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }; persist(next); return next;
  }),
  markAllNotificationsRead: (userId) => set(s => {
    const next = { ...s, notifications: s.notifications.map(n => n.userId === userId ? { ...n, read: true } : n) }; persist(next); return next;
  }),
  updatePatientStatus: (id, status) => set(s => {
    const next = { ...s, patients: s.patients.map(p => p.id === id ? { ...p, status } : p) }; persist(next); return next;
  }),
  updateDoctorStatus: (id, status) => set(s => {
    const next = { ...s, doctors: s.doctors.map(d => d.id === id ? { ...d, status } : d) }; persist(next); return next;
  }),
  deleteUser: (id, type) => set(s => {
    const next = type === 'doctor' ? { ...s, doctors: s.doctors.filter(d => d.id !== id) } : { ...s, patients: s.patients.filter(p => p.id !== id) };
    persist(next); return next;
  }),
  updateSettings: (updates) => set(s => {
    const next = { ...s, settings: { ...s.settings, ...updates } }; persist(next); return next;
  }),
  addLog: (l) => set(s => {
    const next = { ...s, logs: [{ ...l, id: uid(), timestamp: now() }, ...s.logs].slice(0, 200) }; persist(next); return next;
  }),
  getPatientAppointments: (pid) => get().appointments.filter(a => a.patientId === pid),
  getDoctorAppointments: (did) => get().appointments.filter(a => a.doctorId === did),
  getPatientReports: (pid) => get().reports.filter(r => r.patientId === pid),
  getConversationMessages: (cid) => get().messages.filter(m => m.conversationId === cid),
  getUserNotifications: (uid) => get().notifications.filter(n => n.userId === uid).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  getUnreadCount: (uid) => get().notifications.filter(n => n.userId === uid && !n.read).length,
}));
