import { IonPage, IonGrid, IonRow, IonCol, IonHeader, IonContent, IonToolbar, IonFooter, IonTitle, useIonAlert, IonItem, IonButton, IonInput, IonLabel } from "@ionic/react";
import { useHistory } from "react-router";


const Admin: React.FC = () => {
    const [present] = useIonAlert();
    const history = useHistory();

    var password = '';

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Panel administracyjny</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonRow class='ion-align-items-center ion-margin-top'>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">Hasło</IonLabel>
                                <IonInput
                                    placeholder="Podaj hasło"
                                    clearInput={true}
                                    type='password'
                                    onIonInput={(e: any) => {
                                        password = e.target.value
                                    }}
                                    autofocus={true}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow class='ion-align-items-center ion-margin-top'>
                        <IonCol>
                            <IonButton
                                expand="block"
                                onClick={async () => {
                                    if (password.length === 0) {
                                        present({
                                            header: 'Uwaga',
                                            message: 'Należy wypełnić pole',
                                            buttons: [
                                                'Ok',
                                            ],
                                        })
                                    } else {
                                        if (password === 'sknsz2022!@') {
                                            history.push('/userList');
                                        }
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
        </IonPage>
    )
}

export default Admin;