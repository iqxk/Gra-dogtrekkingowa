import { IonPage, IonHeader, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonFooter, IonTitle, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { useFirebaseApi, UserInfo } from "../hooks/useFirebaseApi";

const UserList: React.FC = () => {
    const { getUsers, getTotalTime } = useFirebaseApi();
    const [users, setUsers] = useState<UserInfo[]>([]);

    useIonViewWillEnter(() => {
        getUsers().then(result => {
            result.forEach(async user => {
                if (user.finished) {
                    await getTotalTime(user.uid).then(resultTime => {
                        user.totalTime = resultTime;
                        setUsers(result);
                    })
                }
            })
        })
    }, [])

    return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Panel administracyjny</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonGrid>
                        {users.map((user, index) => (
                            <IonCol size='6' key={index}>
                                <IonCard routerLink={'/user/' + user.uid} routerDirection='none'>
                                    <IonCardHeader>
                                        <IonCardTitle>{user.displayName}</IonCardTitle>
                                        <IonCardSubtitle>
                                            <IonRow>
                                                <IonCol>
                                                    Zadanie {user.taskNumber}/12
                                                </IonCol>
                                                <IonCol>
                                                    <IonText color={user.finished ? 'success' : 'danger'}>
                                                        {user.finished ? 'Ukończono' : 'Nieukończono'}
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText>{user.totalPoints} punktów</IonText>
                                                </IonCol>
                                                <IonCol>
                                                    {user.totalTime === 'not finished' ? '' : 'Czas: ' + user.totalTime}
                                                </IonCol>
                                            </IonRow>
                                        </IonCardSubtitle>
                                    </IonCardHeader>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonGrid>
                </IonContent>

                <IonFooter>
                    <IonToolbar>
                        <IonTitle size="small" color="medium">@ Igor Kucyk 2022</IonTitle>
                    </IonToolbar>
                </IonFooter>
            </IonPage >
        )
}

export default UserList;