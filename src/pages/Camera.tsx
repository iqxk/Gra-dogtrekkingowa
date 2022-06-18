import { IonPage, IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon, IonHeader, IonContent, IonToolbar } from "@ionic/react";
import { trash, camera } from "ionicons/icons";

import { useCamera } from '../hooks/useCamera';


const Camera: React.FC = () => {
    const { photos, takePhoto, requestDeletePhoto } = useCamera();

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>Gra dogtrekkingowa</IonToolbar>
            </IonHeader>

            <IonContent>
                <IonGrid>
                    <IonRow>
                        {photos.map((photo, index) => (
                            <IonCol size='6' key={index}>
                                <IonImg src={photo.link} />
                                <IonFab horizontal='center'>
                                    <IonFabButton onClick={() => requestDeletePhoto(photo.deleteHash)}>
                                        <IonIcon icon={trash}></IonIcon>
                                    </IonFabButton>
                                </IonFab>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                <IonFab vertical='bottom' horizontal='center' slot='fixed'>
                    <IonFabButton onClick={() => takePhoto()}>
                        <IonIcon icon={camera}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>

        </IonPage>
    )
}

export default Camera;