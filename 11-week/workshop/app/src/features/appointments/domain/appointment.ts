export type AppointmentStatus = 'confirmada' | 'pendiente' | 'cancelada';

export interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  professional: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
}

const appointments: Appointment[] = [
  {
    id: 'MC-2048',
    service: 'Manicure semipermanente',
    date: '2026-10-25',
    time: '10:30',
    professional: 'Valentina Rojas',
    duration: 60,
    price: 55000,
    status: 'confirmada',
  },
  {
    id: 'MC-1982',
    service: 'Manicure tradicional',
    date: '2026-09-12',
    time: '14:00',
    professional: 'Laura Méndez',
    duration: 45,
    price: 35000,
    status: 'confirmada',
  },
];

export const SERVICE_OPTIONS = [
  { id: 'semi', name: 'Manicure semipermanente', price: 55000, duration: 60 },
  { id: 'trad', name: 'Manicure tradicional', price: 35000, duration: 45 },
  { id: 'spa', name: 'Manicure spa', price: 70000, duration: 75 },
];

export const AVAILABLE_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];

export function listAppointments(): Appointment[] {
  return [...appointments];
}

export function findAppointment(id: string): Appointment | undefined {
  return appointments.find((appointment) => appointment.id === id);
}

export function addAppointment(input: Omit<Appointment, 'id' | 'status' | 'professional'>): Appointment {
  const appointment: Appointment = {
    ...input,
    id: `MC-${Date.now().toString().slice(-6)}`,
    status: 'pendiente',
    professional: 'Primera profesional disponible',
  };
  appointments.unshift(appointment);
  return appointment;
}

export function formatAppointmentDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
