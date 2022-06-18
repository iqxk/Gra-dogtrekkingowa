import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { useImgurApi } from './useImgurApi';


//const PHOTO_STORAGE = 'photos';


export function useCamera() {
  const [photos, setPhotos] = useState<ImgurPhoto[]>([])
  const { postPhoto, deletePhoto } = useImgurApi();

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      allowEditing: true,
      quality: 100,
      width: 400
    });

    // const photo = await Camera.getPhoto({
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Camera,
    //   quality: 100,
    // });

    // var blob = dataURItoBlob(photo.dataUrl!);
    // const file = new File([blob], "image.jpg")

    // const blob = new Blob([new Uint8Array(decode(photo.webPath!))], {
    //   type: `image/${photo.format}`,
    // });
    // const file = new File([blob], "Name", {
    //   type: blob.type
    // });

    const rawData = atob(photo.base64String!);
    const bytes = new Array(rawData.length);
    for (var x = 0; x < rawData.length; x++) {
      bytes[x] = rawData.charCodeAt(x);
    }
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], { type: 'image/jpeg' });

    var link = '';
    var deleteHash = '';
    await postPhoto(blob).then(photo => {
      // console.log('link: ' + photo.link)
      // console.log('deleteHash: ' + photo.deleteHash)
      link = photo.link;
      deleteHash = photo.deleteHash;
      setPhotos([photo, ...photos]);
    });

    // const fileName = new Date().getTime() + '.jpeg';
    // const savedFileImage = await savePhoto(photo, fileName);
    // const newPhotos = [savedFileImage, ...photos];
    // // const newPhotos = [
    // //   {
    // //     filepath: fileName,
    // //     webviewPath: photo.webPath,
    // //   },
    // //   ...photos,
    // // ];
    // Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });

    return {
      link,
      deleteHash
    }
  };

  const requestDeletePhoto = async (deleteHash: string) => {
    await deletePhoto(deleteHash).then(() => {
      setPhotos(photos.filter(photo => photo.deleteHash !== deleteHash))
    })
  }

  // useEffect(() => {
  //   const loadSaved = async () => {
  //     const { value } = await Storage.get({ key: PHOTO_STORAGE });
  //     const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[];

  //     for (let photo of photosInStorage) {
  //       const file = await Filesystem.readFile({
  //         path: photo.filepath,
  //         directory: Directory.Data,
  //       });
  //       // Web platform only: Load the photo as base64 data
  //       photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
  //     }
  //     setPhotos(photosInStorage);
  //   };
  //   loadSaved();
  // }, []);
  
  // const savePhoto = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
  //   const base64Data = await base64FromPath(photo.webPath!);
  //   const savedFile = await Filesystem.writeFile({
  //     path: fileName,
  //     data: base64Data,
  //     directory: Directory.Data,
  //   });

  //   // Use webPath to display the new image instead of base64 since it's
  //   // already loaded into memory
  //   return {
  //     filepath: fileName,
  //     webviewPath: photo.webPath,
  //   }
  // }

  return {
    photos,
    takePhoto,
    requestDeletePhoto
  };
}

export interface ImgurPhoto {
  link: string,
  deleteHash: string
}