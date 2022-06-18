import { IonPage, IonHeader, IonContent, IonToolbar, IonGrid, IonCol, IonLabel, IonRow, IonButton, IonItem, IonLoading, useIonAlert, IonFooter, IonTitle } from "@ionic/react";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { useFirebaseApi } from "../hooks/useFirebaseApi";
import { FirebaseConfig } from "../utils/firebase";

const DisplayName: React.FC = () => {
    const { getCurrentUser, getDisplayName, confirmDisplayName, isDisplayNameConfirmed } = useFirebaseApi();
    const [displayName, setDisplayName] = useState(getDisplayName());
    const { auth } = FirebaseConfig();
    const [present] = useIonAlert();
    const history = useHistory();

    const [busy, setBusy] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => {
        getCurrentUser().then(async user => {
            if (user) {
                setAuthed(true);
                setDisplayName(auth.currentUser?.displayName);
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
        authed ? (
            !confirmed ? (
                <IonPage>

                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Gra dogtrekkingowa</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent>
                        <IonGrid>
                            <IonRow class='ion-align-items-center ion-margin-top'>
                                <IonCol>
                                    <IonItem>
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel>Aktualne imię i nazwisko:</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow>
                                            <IonCol>
                                                <IonLabel class='ion-text-wrap'>{displayName}</IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow class='ion-align-items-center ion-margin-top'>
                                <IonCol>
                                    <IonButton
                                        expand="block"
                                        onClick={async () => {
                                            if (displayName?.length === 0 || displayName === null) {
                                                present({
                                                    header: 'Uwaga',
                                                    message: 'Należy podać imię i nazwisko',
                                                    buttons: [
                                                        'Ok',
                                                    ],
                                                })
                                            } else {
                                                await confirmDisplayName().then(() => {
                                                    history.replace('/riddle')
                                                })
                                            }
                                        }}
                                    >
                                        Potwierdź
                                    </IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton
                                        expand="block"
                                        href='/changeName'
                                    >
                                        Zmień
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>

                    <IonFooter>
                        <IonToolbar>
                            <IonTitle size="small" color="medium">@ Igor Kucyk 2022</IonTitle>
                        </IonToolbar>
                    </IonFooter>
                </IonPage>
            ) : (
                <Redirect to='/riddle' />
            )
        ) : (
            <Redirect to='/signUp' />
        )
    ) : (
        <IonLoading isOpen={busy} spinner='circles' message='Proszę czekać...' />
    )
}

export default DisplayName;