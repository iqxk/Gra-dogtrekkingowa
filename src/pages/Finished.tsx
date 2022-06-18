import { IonPage, IonHeader, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonLoading, IonTitle, IonText, IonImg, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonFooter } from "@ionic/react";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFirebaseApi } from "../hooks/useFirebaseApi";

const Finished: React.FC = () => {
    const { getCurrentUser, signInAnon, signInGoogle, signOutUser, isFinished } = useFirebaseApi();

    const [busy, setBusy] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [finished, setFinished] = useState(false);
    useEffect(() => {
        getCurrentUser().then(async user => {
            if (user) {
                setAuthed(true);
            }
            isFinished().then(result => {
                if (result)
                    setFinished(true);
                setBusy(false);
            })
        });
    }, []);

    return !busy ? (
        authed ? (
            finished ? (
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Gra dogtrekkingowa</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent>
                        <IonGrid>
                            <IonRow class='ion-align-items-center ion-margin-top'>
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            Gratulujemy ukończenia gry dogtrekkingowej!
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        Dziękujemy za wzięcie udziału i zapraszamy na inne atrakcje!
                                        <IonRow class='ion-align-items-center ion-margin-top'>
                                            <IonCol>
                                                <IonCard>
                                                    <IonImg src='https://scontent.fpoz4-1.fna.fbcdn.net/v/t1.6435-9/122205005_104073634826853_5955226269211834468_n.png?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=_gk2O51sHfMAX-mgT8X&_nc_oc=AQk_j1XTiSjzS0BPikKlzttnb3Ar2RyxUFBDnf7et3o0Y73sHM8iQKvm0F8p5HOFdus&_nc_ht=scontent.fpoz4-1.fna&oh=00_AT-m_GFsIQsHgTb2rBPeXJNI4rJxnbXPYpZ-KbvjjFC-SA&oe=62AC999D' />
                                                </IonCard>
                                            </IonCol>
                                            <IonCol>
                                                <IonCard>
                                                    <IonImg src='https://scontent.fpoz4-1.fna.fbcdn.net/v/t1.6435-9/82540236_484331752461320_1659353154451406848_n.png?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=UUcTvZAqbvIAX_PhGyD&_nc_ht=scontent.fpoz4-1.fna&oh=00_AT8Sim24_p86-4TcJ3aD-jEnioPVztbZ3Ro5CMDaMBfZkA&oe=62AFA4BC' />
                                                </IonCard>
                                            </IonCol>
                                        </IonRow>
                                        <IonRow class='ion-align-items-center ion-margin-top'>
                                            <IonCol>
                                                <IonText>Aplikacja do gry dogtrekkingowej została napisana dla Studenckiego Koła Naukowego Sympatyków Zwierząt przez członka zarządu Koła Naukowego Studentów Informatyki Genbit Igora Kucyka</IonText>
                                            </IonCol>
                                        </IonRow>
                                    </IonCardContent>
                                </IonCard>
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
            <Redirect to="/signUp" />
        )
    ) : (
        <IonLoading isOpen={busy} spinner='circles' message='Proszę czekać...'/>
    )
}

export default Finished;