import { IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { useFirebaseApi } from "../hooks/useFirebaseApi";
import { Redirect, useHistory } from "react-router"
import { useState, useEffect } from "react";

const ChangeName: React.FC = () => {
    const { getCurrentUser, isDisplayNameConfirmed, changeDisplayName } = useFirebaseApi();
    const [present] = useIonAlert();
    const history = useHistory();

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

    var name = '';
    var surname = '';

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
                                        <IonLabel position="floating">Imię</IonLabel>
                                        <IonInput
                                            placeholder="Podaj imię"
                                            clearInput={true}
                                            onIonInput={(e: any) => {
                                                name = e.target.value
                                            }}
                                            autofocus={true}
                                        />

                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow class='ion-align-items-center ion-margin-top'>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="floating">Nazwisko</IonLabel>
                                        <IonInput
                                            placeholder="Podaj nazwisko"
                                            clearInput={true}
                                            onIonInput={(e: any) => {
                                                surname = e.target.value
                                            }}
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow class='ion-align-items-center ion-margin-top'>
                                <IonCol>
                                    <IonButton
                                        expand="block"
                                        onClick={async () => {
                                            if (name.length === 0 || surname.length === 0) {
                                                present({
                                                    header: 'Uwaga',
                                                    message: 'Należy wypełnić wszystkie pola',
                                                    buttons: [
                                                        'Ok',
                                                    ],
                                                })
                                            } else {
                                                await changeDisplayName(`${name} ${surname}`).then(x => {
                                                    history.push('/displayName')
                                                });
                                            }
                                        }}
                                    >
                                        Zatwierdź
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
                </IonPage >
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

export default ChangeName;