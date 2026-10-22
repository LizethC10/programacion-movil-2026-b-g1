import { FormEvent, useMemo, useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { addAppointment, AVAILABLE_SLOTS, formatCOP, SERVICE_OPTIONS } from '../domain/appointment';

type BookingField = 'serviceId' | 'date' | 'time';
type BookingErrors = Partial<Record<BookingField, string>>;

function localDateValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

const BookAppointmentPage: React.FC = () => {
  const history = useHistory();
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedService = useMemo(() => SERVICE_OPTIONS.find((service) => service.id === serviceId), [serviceId]);

  const validate = (): BookingErrors => {
    const nextErrors: BookingErrors = {};
    if (!serviceId) nextErrors.serviceId = 'Elige el servicio que quieres reservar.';
    if (!date) nextErrors.date = 'Selecciona una fecha para tu cita.';
    else if (date < localDateValue()) nextErrors.date = 'La fecha debe ser hoy o posterior.';
    if (!time) nextErrors.time = 'Elige uno de los horarios disponibles.';
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setSubmitError('');
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !selectedService) {
      setSubmitError('Revisa los campos marcados para continuar.');
      return;
    }

    try {
      const appointment = addAppointment({
        service: selectedService.name,
        date,
        time,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: notes.trim() || undefined,
      });
      history.replace(`/citas/${appointment.id}`);
    } catch {
      setSubmitError('No pudimos enviar la solicitud. Inténtalo de nuevo.');
    }
  };

  const updateField = (field: BookingField, value: string) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
    if (field === 'serviceId') setServiceId(value);
    if (field === 'date') {
      setDate(value);
      setTime('');
      setErrors((current) => ({ ...current, date: undefined, time: undefined }));
    }
    if (field === 'time') setTime(value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/mis-citas" text="Volver" /></IonButtons>
          <IonTitle>Reservar cita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="appointments-content">
        <main className="screen-shell booking-shell">
          <div className="screen-intro">
            <p className="eyebrow">UN MOMENTO PARA TI</p>
            <h1>Agenda tu manicure</h1>
            <p className="intro-copy">Elige un servicio, una fecha y un horario disponible.</p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <section className="form-section" aria-labelledby="service-heading">
              <div className="form-section-heading">
                <span className="step-number">1</span>
                <div><h2 id="service-heading">Servicio</h2><p>¿Qué te gustaría hacerte?</p></div>
              </div>
              <IonItem className={`field-item ${isSubmitted && errors.serviceId ? 'field-invalid' : ''}`} lines="none">
                <IonLabel position="stacked">Servicio <span aria-hidden="true">*</span></IonLabel>
                <IonSelect
                  value={serviceId}
                  placeholder="Selecciona un servicio"
                  interface="popover"
                  aria-label="Servicio"
                  onIonChange={(event) => updateField('serviceId', String(event.detail.value ?? ''))}
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <IonSelectOption key={service.id} value={service.id}>{service.name} · {formatCOP(service.price)}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {isSubmitted && errors.serviceId && <IonText color="danger"><p className="field-error" role="alert">{errors.serviceId}</p></IonText>}
              {selectedService && (
                <div className="service-summary" aria-live="polite">
                  <IonIcon icon={timeOutline} aria-hidden="true" />
                  <span>{selectedService.duration} min</span><span className="summary-dot">·</span><strong>{formatCOP(selectedService.price)}</strong>
                </div>
              )}
            </section>

            <section className="form-section" aria-labelledby="date-heading">
              <div className="form-section-heading">
                <span className="step-number">2</span>
                <div><h2 id="date-heading">Fecha y hora</h2><p>Los horarios se actualizan según disponibilidad.</p></div>
              </div>
              <IonItem className={`field-item ${isSubmitted && errors.date ? 'field-invalid' : ''}`} lines="none">
                <IonLabel position="stacked">Fecha <span aria-hidden="true">*</span></IonLabel>
                <IonInput
                  type="date"
                  value={date}
                  min={localDateValue()}
                  aria-label="Fecha de la cita"
                  onIonChange={(event) => updateField('date', String(event.detail.value ?? ''))}
                />
              </IonItem>
              {isSubmitted && errors.date && <IonText color="danger"><p className="field-error" role="alert">{errors.date}</p></IonText>}

              <p className="field-label">Horarios disponibles <span aria-hidden="true">*</span></p>
              {date ? (
                <div className="slot-grid" role="group" aria-label="Horarios disponibles">
                  {AVAILABLE_SLOTS.map((slot) => (
                    <IonButton
                      key={slot}
                      type="button"
                      fill={time === slot ? 'solid' : 'outline'}
                      className={`slot-button ${time === slot ? 'slot-selected' : ''}`}
                      aria-pressed={time === slot}
                      onClick={() => updateField('time', slot)}
                    >
                      {time === slot && <IonIcon slot="start" icon={checkmarkCircleOutline} />}{slot}
                    </IonButton>
                  ))}
                </div>
              ) : (
                <p className="slot-hint">Selecciona una fecha para consultar los horarios.</p>
              )}
              {isSubmitted && errors.time && <IonText color="danger"><p className="field-error" role="alert">{errors.time}</p></IonText>}
            </section>

            <section className="form-section" aria-labelledby="notes-heading">
              <div className="form-section-heading">
                <span className="step-number">3</span>
                <div><h2 id="notes-heading">Nota para el salón</h2><p>Este campo es opcional.</p></div>
              </div>
              <IonItem className="field-item notes-item" lines="none">
                <IonLabel position="stacked">¿Hay algo que debamos saber?</IonLabel>
                <IonTextarea
                  value={notes}
                  maxlength={240}
                  autoGrow
                  placeholder="Cuéntanos si tienes alguna preferencia…"
                  aria-label="Nota opcional para el salón"
                  onIonInput={(event) => setNotes(String(event.detail.value ?? ''))}
                />
              </IonItem>
              <p className="character-count">{notes.length}/240</p>
            </section>

            {submitError && <IonText color="danger"><p className="form-feedback" role="alert">{submitError}</p></IonText>}
            <div className="booking-summary">
              <span>El servicio se confirma con el salón</span>
              <strong>{selectedService ? formatCOP(selectedService.price) : 'Elige un servicio'}</strong>
            </div>
            <IonButton expand="block" type="submit" className="book-cta">
              Solicitar cita
            </IonButton>
            <p className="privacy-note">Al continuar, enviaremos tu solicitud para confirmar el cupo.</p>
          </form>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default BookAppointmentPage;
