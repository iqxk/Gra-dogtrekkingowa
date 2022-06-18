/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import SignUp from './pages/SignUp';
import DisplayName from './pages/DisplayName';
import ChangeName from './pages/ChangeName';
import Riddle from './pages/Riddle';
import Task from './pages/Task';
import { useEffect, useState } from 'react';
import { useFirebaseApi } from './hooks/useFirebaseApi';
import Finished from './pages/Finished';
import UserList from './pages/UserList';
import User from './pages/User';
import Admin from './pages/Admin';


setupIonicReact();

const App: React.FC = () => {
  const { getCurrentUser, isDisplayNameConfirmed } = useFirebaseApi();

  const [busy, setBusy] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    getCurrentUser().then(async user => {
      if (user) {
        setAuthed(true);
      }
      isDisplayNameConfirmed().then(result => {
        if (result) {
          setConfirmed(true);
        }
        setBusy(false);
      });
    });
  }, []);

  return !busy ? (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/displayName">
            <DisplayName />
          </Route>
          <Route exact path="/changeName">
            <ChangeName />
          </Route>
          <Route exact path="/riddle">
            <Riddle />
          </Route>
          <Route exact path="/task">
            <Task />
          </Route>
          <Route exact path="/finished">
            <Finished />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route exact path="/userList">
            <UserList />
          </Route>
          <Route exact path="/user/:uid">
            <User />
          </Route>
          <Route exact path="/">
            <Redirect to="/signup" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  ) : (
    <IonLoading isOpen={!busy} />
  )
};

export default App;
