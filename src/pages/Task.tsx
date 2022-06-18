import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonText, useIonAlert, IonFab, IonFabButton, IonIcon, IonLoading, IonFooter, IonCard, IonCardContent, IonCardHeader } from "@ionic/react";
import { camera } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useCamera } from "../hooks/useCamera";
import { useFirebaseApi } from "../hooks/useFirebaseApi";

const Task: React.FC = () => {
    const { getCurrentUser, isDisplayNameConfirmed, isRiddleSolved, getTask, setRiddleSolved, addPhotoToDb, increaseTaskNumber, setFinished } = useFirebaseApi();
    const { takePhoto } = useCamera();
    const [present] = useIonAlert();
    const history = useHistory();
    const [data, setData] = useState({
        taskNumber: 0,
        task: 'loading',
    })

    isRiddleSolved().then(result => {
        if (!result)
            history.push('/riddle');
    });

    const [end, setEnd] = useState(false);
    useEffect(() => {
        getTask().then(async result => {
            if (data.taskNumber === 0) {
                setData(result);
            }
            if (data.taskNumber >= 12) {
                // console.log('taskNumber >= 12');
                await setFinished().then(() => {
                    // console.log('setFinished');
                    setEnd(true);
                })
            }
        })
    }, [data])

    const [busy, setBusy] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    useEffect(() => {
        getCurrentUser().then(async user => {
            if (user) {
                setAuthed(true);
            }
            isDisplayNameConfirmed().then(async result => {
                if (result) {
                    setConfirmed(true);
                }
                setBusy(false);
            });
        });
    }, []);

    return !busy ? (
        confirmed ? (
            !end ? (
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
                                <IonTitle color='dark'>Polecenie</IonTitle>
                                <IonText color='dark'>{data.task}</IonText>
                            </IonCardContent>
                        </IonCard>

                        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
                            <IonFabButton onClick={async () => {
                                setBusy(true);
                                await takePhoto().then(async result => {
                                    // console.log(result)
                                    if (result.link === "undefined" || result.deleteHash === "undefined") {
                                        present({
                                            header: 'Uwaga',
                                            message: 'Wystąpił błąd podczas wysyłania zdjęcia. Spróbuj ponownie. Jeżeli błąd nadal będzie występował, proszę przesłać zdjęcie na naszego messengera (Studenckie Koło Naukowe Sympatyków Zwierząt UPH).',
                                            buttons: [
                                                'Ok',
                                                {
                                                    text: 'Kontakt', handler: (d) => {
                                                        window.open('https://m.me/SKNSZ.UPH');
                                                    }
                                                }
                                            ],
                                        })
                                        setBusy(false);
                                    } else {
                                        // console.log('takePhoto');
                                        await addPhotoToDb(result.link, result.deleteHash).then(async () => {
                                            // console.log('addPhotoToDb');
                                            await increaseTaskNumber().then(async () => {
                                                // console.log('increaseTaskNumber')
                                                await setRiddleSolved(false).then(() => {
                                                    history.replace('/riddle')
                                                });
                                            });
                                        });
                                    }
                                }).catch(() => {
                                    present({
                                        header: 'Uwaga',
                                        message: 'Wystąpił błąd podczas wysyłania zdjęcia. Spróbuj ponownie. Jeżeli błąd nadal będzie występował, proszę przesłać zdjęcie na naszego messengera (Studenckie Koło Naukowe Sympatyków Zwierząt UPH).',
                                        buttons: [
                                            'Ok',
                                            {
                                                text: 'Kontakt', handler: (d) => {
                                                    window.open('https://m.me/SKNSZ.UPH');
                                                }
                                            }
                                        ],
                                    })
                                });
                            }}>
                                <IonIcon icon={camera}></IonIcon>
                            </IonFabButton>
                        </IonFab>
                    </IonContent>

                    <IonFooter>
                        <IonToolbar>
                            <IonTitle size="small" color="medium">@ Igor Kucyk 2022</IonTitle>
                        </IonToolbar>
                    </IonFooter>
                </IonPage >
            ) : (
                <Redirect to='/finished' />
            )
        ) : (
            <Redirect to='/displayName' />
        )
    ) : (
        <IonLoading isOpen={busy} spinner='circles' message='Proszę czekać...' />
    )
}

export default Task;