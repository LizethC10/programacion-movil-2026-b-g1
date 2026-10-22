import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import MyAppointmentsPage from '../features/appointments/presentation/MyAppointmentsPage';
import BookAppointmentPage from '../features/appointments/presentation/BookAppointmentPage';
import AppointmentDetailPage from '../features/appointments/presentation/AppointmentDetailPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import '../features/appointments/presentation/appointments.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/mis-citas" component={MyAppointmentsPage} />
        <Route exact path="/reservar" component={BookAppointmentPage} />
        <Route exact path="/citas/:id" component={AppointmentDetailPage} />
        <Route exact path="/">
          <Redirect to="/mis-citas" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
