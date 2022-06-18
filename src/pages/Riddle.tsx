import { IonPage, IonHeader, IonContent, IonToolbar, IonButton, IonTitle, IonText, IonLabel, IonInput, IonItem, useIonAlert, IonLoading, IonCard, IonCardHeader, IonCardContent, IonFooter } from "@ionic/react";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useFirebaseApi } from "../hooks/useFirebaseApi";

const Riddle: React.FC = () => {
    const { getCurrentUser, isDisplayNameConfirmed, isRiddleSolved, getRiddle, setRiddleSolved, checkCode } = useFirebaseApi();
    const [present] = useIonAlert();
    const history = useHistory();
    const [data, setData] = useState({
        taskNumber: 0,
        code: 'loading',
        riddle: 'loading',
    })

    isRiddleSolved().then(result => {
        if (result)
            history.push('/task');
    });

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

    useEffect(() => {
        getRiddle().then(result => {
            if (data.taskNumber === 0)
                setData(result);
        })
    }, [data])

    var code = '';

    return !busy ? (
        confirmed ? (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Gra dogtrekkingowa</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>

                    <IonCard>
                        <IonCardHeader>
                            <IonTitle color='dark'>Zadanie nr. {data.taskNumber}</IonTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonTitle color='dark'>Zagadka</IonTitle>
                            <IonText color='dark'>{data.riddle}</IonText>
                        </IonCardContent>
                    </IonCard>

                    <IonItem>
                        <IonLabel position="floating">Wprowadź kod</IonLabel>
                        <IonInput
                            clearInput={true}
                            autofocus={true}
                            onIonInput={(e: any) => {
                                code = e.target.value
                            }}
                        />
                    </IonItem>

                    <IonButton
                        expand="block"
                        onClick={async () => {
                            if (code.length !== 8) {
                                present({
                                    header: 'Uwaga',
                                    message: 'Kod musi składać się z 8 znaków.',
                                    buttons: [
                                        'Ok',
                                    ],
                                })
                            } else {
                                await checkCode(code).then(async result => {
                                    if (result) {
                                        await setRiddleSolved(true).then(() => {
                                            // if (data.taskNumber === 12)
                                            //     history.push('/finished');
                                            // else
                                                history.replace('/task')
                                        })
                                    }
                                    else
                                        present({
                                            header: 'Uwaga',
                                            message: 'Kod jest nieprawidłowy.',
                                            buttons: [
                                                'Ok',
                                            ],
                                        })
                                });
                            }
                        }}
                    >
                        Zatwierdź
                    </IonButton>
                </IonContent>

                <IonFooter>
                    <IonToolbar>
                        <IonTitle size="small" color="medium">@ Igor Kucyk 2022</IonTitle>
                    </IonToolbar>
                </IonFooter>
            </IonPage >
        ) : (
            <Redirect to='/displayName' />
        )
    ) : (
        <IonLoading isOpen={busy} spinner='circles' message='Proszę czekać...'/>
    )
}

export default Riddle;