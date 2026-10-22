import { useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline, calendarOutline, chevronForwardOutline, timeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Appointment, formatAppointmentDate, listAppointments } from '../domain/appointment';

type AppointmentTab = 'upcoming' | 'past';

const MyAppointmentsPage: React.FC = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<AppointmentTab>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>(listAppointments());

  useIonViewWillEnter(() => setAppointments(listAppointments()));

  const today = new Date().toISOString().slice(0, 10);
  const visibleAppointments = appointments.filter((appointment) =>
    activeTab === 'upcoming' ? appointment.date >= today : appointment.date < today,
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ManiCita</IonTitle>
          <IonButtons slot="end">
            <IonButton aria-label="Reservar cita" onClick={() => history.push('/reservar')}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="appointments-content">
        <main className="screen-shell">
          <div className="screen-intro">
            <p className="eyebrow">TU AGENDA</p>
            <h1>Mis citas</h1>
            <p className="intro-copy">Consulta tus próximas visitas y vuelve a reservar cuando quieras.</p>
          </div>

          <IonSegment
            className="appointment-segment"
            value={activeTab}
            onIonChange={(event) => setActiveTab(event.detail.value as AppointmentTab)}
            aria-label="Filtrar citas"
          >
            <IonSegmentButton value="upcoming"><span>Próximas</span></IonSegmentButton>
            <IonSegmentButton value="past"><span>Anteriores</span></IonSegmentButton>
          </IonSegment>

          {visibleAppointments.length > 0 ? (
            <section className="appointment-list" aria-label={activeTab === 'upcoming' ? 'Citas próximas' : 'Citas anteriores'}>
              {visibleAppointments.map((appointment) => (
                <article className="appointment-card" key={appointment.id}>
                  <div className="appointment-card-top">
                    <div className="date-icon"><IonIcon icon={calendarOutline} aria-hidden="true" /></div>
                    <IonBadge className={`status-badge status-${appointment.status}`}>{appointment.status}</IonBadge>
                  </div>
                  <p className="appointment-date">{formatAppointmentDate(appointment.date)}</p>
                  <h2>{appointment.service}</h2>
                  <p className="appointment-professional">Con {appointment.professional}</p>
                  <div className="appointment-card-bottom">
                    <span><IonIcon icon={timeOutline} aria-hidden="true" /> {appointment.time} · {appointment.duration} min</span>
                    <IonButton fill="clear" className="details-button" onClick={() => history.push(`/citas/${appointment.id}`)}>
                      Ver detalle <IonIcon slot="end" icon={chevronForwardOutline} />
                    </IonButton>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="empty-state" aria-live="polite">
              <div className="empty-icon"><IonIcon icon={calendarOutline} aria-hidden="true" /></div>
              <h2>{activeTab === 'upcoming' ? 'Aún no tienes citas próximas' : 'Todavía no hay citas anteriores'}</h2>
              <p>{activeTab === 'upcoming' ? 'Encuentra un horario que te quede bien y reserva tu próxima manicure.' : 'Cuando completes una visita, aparecerá aquí.'}</p>
              {activeTab === 'upcoming' && <IonButton onClick={() => history.push('/reservar')}>Reservar una cita</IonButton>}
            </section>
          )}

          <IonButton expand="block" className="book-cta" onClick={() => history.push('/reservar')}>
            <IonIcon slot="start" icon={addOutline} /> Reservar una cita
          </IonButton>
          <p className="help-note">¿Necesitas ayuda? Escríbenos por WhatsApp.</p>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default MyAppointmentsPage;
