import { IonPage, IonGrid, IonRow, IonCol, IonImg, IonHeader, IonContent, IonToolbar, IonFooter, IonTitle, IonItem, IonText, IonButton, IonSlides, IonSlide, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { PhotoInfo, useFirebaseApi, UserInfo } from "../hooks/useFirebaseApi";


const User: React.FC = () => {
    const [authed, setAuthed] = useState(true);
    const { getUserWithPhotos, setPhotoValidation } = useFirebaseApi();
    const history = useHistory();
    const { uid } = useParams<{ uid: string }>();

    const [user, setUser] = useState<UserInfo>();
    const [photos, setPhotos] = useState<PhotoInfo[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    const slidesRef = useRef<any>()
    const [slideChange, setSlideChange] = useState<any>()
    const opts = {
        initialSlide: 0,
        speed: 300
    }

    useEffect(() => {
        getUserWithPhotos(uid).then(result => {
            setUser(result.userInfo);
            setPhotos(result.photos);
        })
    }, [uid, refresh])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Panel administracyjny</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonCol>
                        <IonItem>
                            <IonCol>
                                <IonTitle>{user?.displayName}</IonTitle>
                            </IonCol>
                            <IonCol>
                                <IonText>{user?.totalPoints} punktów</IonText>
                            </IonCol>
                            <IonButton
                                expand="block"
                                onClick={() => {
                                    setUser(undefined);
                                    setPhotos([]);
                                    history.push('/userList');
                                }}
                            >
                                Powrót
                            </IonButton>
                        </IonItem>
                    </IonCol>

                    <IonSlides
                        options={opts}
                        ref={slidesRef}
                        key={user?.uid}
                        onIonSlideDidChange={slideChange}>
                        {photos.map((photo, index) => (
                            <IonSlide key={index}>
                                <IonCard>
                                    <IonImg src={photo.link} />
                                    <IonCardHeader>
                                        <IonCardTitle>Zadanie {photo.taskNumber}</IonCardTitle>
                                        <IonCardSubtitle color={photo.valid ? 'success' : 'danger'}>{photo.valid ? 'Zatwierdzone' : 'Niezatwierdzone'}</IonCardSubtitle>
                                        <IonCardSubtitle>{photo.date}</IonCardSubtitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonRow>
                                            <IonCol>
                                                <IonButton
                                                    expand="block"
                                                    onClick={async () => {
                                                        await setPhotoValidation(photo.id, true).then(() => {
                                                            setRefresh(!refresh);
                                                        })
                                                    }}
                                                >
                                                    Zatwierdź
                                                </IonButton>
                                            </IonCol>
                                            <IonCol>
                                                <IonButton
                                                    expand="block"
                                                    onClick={async () => {
                                                        await setPhotoValidation(photo.id, false).then(() => {
                                                            setRefresh(!refresh);
                                                        })
                                                    }}
                                                >
                                                    Odrzuć
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonCardContent>
                                </IonCard>
                            </IonSlide>
                        ))}
                    </IonSlides>
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

export default User;