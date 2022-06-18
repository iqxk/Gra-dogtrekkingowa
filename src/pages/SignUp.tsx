import { IonPage, IonHeader, IonContent, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonLoading, IonFooter, IonTitle } from "@ionic/react";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFirebaseApi } from "../hooks/useFirebaseApi";

const SignUp: React.FC = () => {
    const { getCurrentUser, signInAnon, signInGoogle } = useFirebaseApi();

    const [busy, setBusy] = useState(true);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        getCurrentUser().then(async user => {
            if (user) {
                setAuthed(true);
            }
            setBusy(false);
        });
    }, []);

    return !busy ? (
        !authed ? (
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
                                <IonButton
                                    expand="block"
                                    onClick={async () => {
                                        await signInGoogle().then(() => {
                                            setAuthed(true);
                                        })
                                    }}
                                >
                                    Dołącz z użyciem konta Google
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow class='ion-align-items-center ion-margin-top'>
                            <IonCol>
                                <IonButton
                                    expand="block"
                                    onClick={async () => {
                                        await signInAnon().then(() => {
                                            setAuthed(true);
                                        })
                                    }}
                                >
                                    Dołącz bez użycia konta
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
            <Redirect to="/displayName" />
        )
    ) : (
        <IonLoading isOpen={busy} spinner='circles' message='Proszę czekać...'/>
    )
}

export default SignUp;