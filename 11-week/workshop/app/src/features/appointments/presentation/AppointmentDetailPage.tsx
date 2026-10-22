import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { calendarOutline, locationOutline, personOutline, timeOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { findAppointment, formatAppointmentDate, formatCOP } from '../domain/appointment';

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const appointment = findAppointment(id);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/mis-citas" text="Mis citas" /></IonButtons>
          <IonTitle>Detalle de cita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="appointments-content">
        <main className="screen-shell detail-shell">
          {appointment ? (
            <>
              <div className="detail-confirmation">
                <span className="confirmation-icon"><IonIcon icon={calendarOutline} aria-hidden="true" /></span>
                <p className="eyebrow">CITA {appointment.status === 'pendiente' ? 'SOLICITADA' : 'AGENDADA'}</p>
                <h1>{appointment.status === 'pendiente' ? 'Solicitud enviada' : 'Tu cita está lista'}</h1>
                <p>{appointment.status === 'pendiente' ? 'El salón confirmará la disponibilidad del horario.' : 'Guarda estos datos para tu próxima visita.'}</p>
              </div>

              <section className="detail-card" aria-label="Información de la cita">
                <div className="detail-card-heading">
                  <div><p className="eyebrow">MANICITA · NEIVA</p><h2>{appointment.service}</h2></div>
                  <span className={`detail-status status-${appointment.status}`}>{appointment.status}</span>
                </div>
                <div className="detail-row"><IonIcon icon={calendarOutline} aria-hidden="true" /><div><span>Fecha</span><strong>{formatAppointmentDate(appointment.date)}</strong></div></div>
                <div className="detail-row"><IonIcon icon={timeOutline} aria-hidden="true" /><div><span>Hora y duración</span><strong>{appointment.time} · {appointment.duration} minutos</strong></div></div>
                <div className="detail-row"><IonIcon icon={personOutline} aria-hidden="true" /><div><span>Profesional</span><strong>{appointment.professional}</strong></div></div>
                <div className="detail-row"><IonIcon icon={locationOutline} aria-hidden="true" /><div><span>Dirección</span><strong>Neiva, Huila · dirección del salón</strong></div></div>
                <div className="detail-total"><span>Total del servicio</span><strong>{formatCOP(appointment.price)}</strong></div>
                {appointment.notes && <div className="detail-note"><span>Tu nota</span><p>{appointment.notes}</p></div>}
              </section>

              <div className="appointment-reference">Código de cita <strong>{appointment.id}</strong></div>
              <IonButton expand="block" className="book-cta" onClick={() => history.replace('/mis-citas')}>Volver a Mis citas</IonButton>
              <IonButton expand="block" fill="clear" className="secondary-cta" onClick={() => history.push('/reservar')}>Reservar otra cita</IonButton>
              <p className="help-note">Si necesitas cambiar tu horario, comunícate con el salón.</p>
            </>
          ) : (
            <section className="empty-state detail-not-found" aria-live="polite">
              <div className="empty-icon"><IonIcon icon={calendarOutline} aria-hidden="true" /></div>
              <p className="eyebrow">CITA NO DISPONIBLE</p>
              <h1>No encontramos esta cita</h1>
              <IonText><p>Puede que el enlace haya vencido o que la cita ya no esté disponible.</p></IonText>
              <IonButton onClick={() => history.replace('/mis-citas')}>Ir a Mis citas</IonButton>
            </section>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default AppointmentDetailPage;
