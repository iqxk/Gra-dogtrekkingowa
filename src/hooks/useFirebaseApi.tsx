import { onAuthStateChanged, signInAnonymously, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { FirebaseConfig } from "../utils/firebase";
import { collection, query, where, getDocs, setDoc, doc, documentId, getDoc, addDoc, orderBy } from "firebase/firestore";

export function useFirebaseApi() {
    const { auth, db, googleProvider } = FirebaseConfig();
    var user = auth.currentUser

    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user);
                } else {
                    resolve(null);
                }
                unsubscribe();
            })
        })
    }

    const signInAnon = async () => {
        const response = await signInAnonymously(auth);
        user = response.user

        // await isNewUser().then(result => {
        //     if (result) {
        //         addUserToDb()
        //     }
        // })
    }

    const signInGoogle = async () => {
        const response = await signInWithPopup(auth, googleProvider)
        user = response.user

        // await isNewUser().then(result => {
        //     console.log(result)
        //     if (result) {
        //         addUserToDb();
        //     }
        // })

        return user
    }

    const signOutUser = async () => {
        signOut(auth);
    }

    const addUserToDb = async () => {
        // console.log(user?.uid)
        await setDoc(doc(db, 'users', '' + user?.uid), {
            displayName: user?.displayName,
            email: user?.email,
            taskNumber: 1,
            finished: false,
            displayNameConfirmed: false,
            riddleSolved: false,
            totalPoints: 0
        })
    }

    const isNewUser = async () => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where(documentId(), '==', user?.uid))
        const result = await getDocs(q);

        return result.empty
    }

    const getDisplayName = () => {
        return user?.displayName
    }

    const changeDisplayName = async (displayName: string) => {
        await updateProfile(user!, {
            displayName: displayName
        })
        const docRef = doc(db, 'users', '' + user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await setDoc(docRef,
                { displayName: displayName, },
                { merge: true }
            )
        }
    }

    const confirmDisplayName = async () => {
        await isNewUser().then(result => {
            if (result) {
                addUserToDb()
            }
        })

        const docRef = doc(db, 'users', '' + user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await setDoc(docRef,
                { displayNameConfirmed: true, },
                { merge: true }
            )
        }
    }

    const isDisplayNameConfirmed = async () => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            const displayNameConfirmed: boolean = userResult.get('displayNameConfirmed');
            // console.log('displayNameConfirmed: ' + displayNameConfirmed)

            return displayNameConfirmed
        }
        return false;
    }

    const isRiddleSolved = async () => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            const riddleSolved: boolean = userResult.get('riddleSolved');

            return riddleSolved;
        }
        return false
    }

    const getRiddle = async () => {
        var taskNumber = 0;
        var code = 'notfound';
        var riddle = 'not found';

        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            taskNumber = userResult.get('taskNumber');

            const taskRef = doc(db, 'tasks', '' + taskNumber);
            const taskResult = await getDoc(taskRef);

            if (taskResult.exists()) {
                code = taskResult.get('code');
                riddle = taskResult.get('riddle');
            }
        }

        return {
            taskNumber,
            code,
            riddle,
        }
    }

    const checkCode = async (answerCode: string) => {
        var taskNumber = 0;
        var code = 'notfound';

        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            taskNumber = userResult.get('taskNumber');

            const taskRef = doc(db, 'tasks', '' + taskNumber);
            const taskResult = await getDoc(taskRef);

            if (taskResult.exists()) {
                code = taskResult.get('code');
            }
        }

        if (answerCode === code)
            return true;
        return false;
    }

    const setRiddleSolved = async (value: boolean) => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            await setDoc(userRef,
                { riddleSolved: value, },
                { merge: true }
            )
        }
    }

    const getTask = async () => {
        var taskNumber = 0;
        var task = 'not found';

        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            taskNumber = userResult.get('taskNumber');

            const taskRef = doc(db, 'tasks', '' + taskNumber);
            const taskResult = await getDoc(taskRef);

            if (taskResult.exists()) {
                task = taskResult.get('task');
            }
        }

        return {
            taskNumber,
            task,
        }
    }

    const addPhotoToDb = async (link: string, deleteHash: string) => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            const taskNumber = userResult.get('taskNumber');

            const date = new Date()
            const day = date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate();
            const monthTemp = date.getMonth() + 1
            const month = monthTemp > 9 ? monthTemp.toString() : '0' + monthTemp.toString()
            const year = date.getFullYear().toString();
            const hour = date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours().toString();
            const minute = date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
            const second = date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds().toString();

            await addDoc(collection(db, 'photos'), {
                taskNumber: taskNumber,
                userUid: user?.uid,
                link: link,
                deleteHash: deleteHash,
                date: day + '.' + month + '.' + year + ' ' + hour + ':' + minute + ':' + second,
                valid: false
            });
        }
    }

    const increaseTaskNumber = async () => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            const taskNumber = parseInt(userResult.get('taskNumber')) + 1;

            await setDoc(userRef,
                { taskNumber: taskNumber },
                { merge: true }
            )
        }
    }

    const setFinished = async () => {
        const docRef = doc(db, 'users', '' + user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await setDoc(docRef,
                { finished: true, },
                { merge: true }
            )
        }
    }

    const isFinished = async () => {
        const userRef = doc(db, 'users', '' + user?.uid);
        const userResult = await getDoc(userRef);

        if (userResult.exists()) {
            const finished: boolean = userResult.get('finished');

            return finished;
        }
        return false
    }

    const getUsers = async () => {
        const u = query(collection(db, "users"));
        const arr: UserInfo[] = [];

        const usersSnapshot = await getDocs(u);
        usersSnapshot.forEach(async (userDoc) => {
            const newItem = {
                uid: userDoc.id,
                displayName: userDoc.get('displayName'),
                taskNumber: userDoc.get('taskNumber'),
                finished: userDoc.get('finished'),
                totalPoints: userDoc.get('totalPoints'),
                totalTime: 'not finished'
            }
            arr.push(newItem)
        });

        // console.log(arr);
        // console.log(arr.length);

        return arr;
    }

    const getUserWithPhotos = async (uid: string) => {
        const userRef = doc(db, 'users', uid);
        const userResult = await getDoc(userRef);

        var userInfo: UserInfo = {
            uid: '',
            displayName: '',
            taskNumber: 0,
            finished: false,
            totalPoints: 0,
            totalTime: 'not finished'
        };
        const photos: PhotoInfo[] = [];

        if (userResult.exists()) {
            userInfo = {
                uid: userResult.id,
                displayName: userResult.get('displayName'),
                taskNumber: userResult.get('taskNumber'),
                finished: userResult.get('finished'),
                totalPoints: userResult.get('totalPoints'),
                totalTime: ''
            }

            const p = query(collection(db, "photos"), where("userUid", "==", userInfo.uid), orderBy("taskNumber", "asc"));
            const usersSnapshot = await getDocs(p);
            usersSnapshot.forEach((doc) => {
                const newItem = {
                    id: doc.id,
                    taskNumber: doc.get('taskNumber'),
                    link: doc.get('link'),
                    deleteHash: doc.get('deleteHash'),
                    date: doc.get('date'),
                    valid: doc.get('valid')
                }
                photos.push(newItem)
            })
        }

        return {
            userInfo,
            photos
        }
    }

    const setPhotoValidation = async (id: string, value: boolean) => {
        // console.log(id + ' ' + value)
        const photoRef = doc(db, 'photos', id);
        const photoSnap = await getDoc(photoRef);
        if (photoSnap.exists()) {
            if (photoSnap.get('valid') !== value) {
                await setDoc(photoRef,
                    {
                        valid: value,
                    },
                    { merge: true }
                )

                const uid = photoSnap.get('userUid');
                const userRef = doc(db, 'users', uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const totalPoints = userSnap.get('totalPoints');
                    // console.log(totalPoints);
                    const points = value ? totalPoints + 1 : totalPoints - 1;
                    await setDoc(userRef,
                        {
                            totalPoints: points,
                        },
                        { merge: true }
                    )
                }
            }
        }
    }

    const getTotalTime = async (uid: string) => {
        const u = query(collection(db, "users"), where(documentId(), '==', uid));
        var time = 'not finished'
        await getDocs(u).then(async u => {
            const startPhotoRef = query(collection(db, 'photos'), where('userUid', '==', '' + u.docs[0].id), where('taskNumber', '==', 1));
            await getDocs(startPhotoRef).then(async s => {
                const startDate = s.docs[0].get('date').split(' ');

                const endPhotoRef = query(collection(db, 'photos'), where('userUid', '==', '' + u.docs[0].id), where('taskNumber', '==', 11));
                await getDocs(endPhotoRef).then(e => {
                    const endDate = e.docs[0].get('date').split(' ');

                    const startDay = startDate[0].substring(0, 2)
                    const startMonth = startDate[0].substring(3, 5)
                    const startYear = startDate[0].substring(6, 10)
                    const startHour = Number(startDate[1].substring(0, 2));
                    const startMinute = Number(startDate[1].substring(3, 5));
                    const startSecond = Number(startDate[1].substring(6, 8));

                    const endDay = endDate[0].substring(0, 2)
                    const endMonth = endDate[0].substring(3, 5)
                    const endYear = endDate[0].substring(6, 10)
                    const endHour = Number(endDate[1].substring(0, 2));
                    const endMinute = Number(endDate[1].substring(3, 5));
                    const endSecond = Number(endDate[1].substring(6, 8));

                    const date1 = new Date(startYear, startMonth - 1, startDay, startHour, startMinute, startSecond);
                    const date2 = new Date(endYear, endMonth - 1, endDay, endHour, endMinute, endSecond);
                    const result = date2.valueOf() - date1.valueOf();
                    const sec = Math.floor(result / 1000)
                    const min = Math.floor(sec / 60);
                    const hour = Math.floor(min / 60);

                    time = '';
                    if ((hour % 60) < 10) time += '0';
                    time += hour + ':';
                    if ((min % 60) < 10) time += '0';
                    time += (min % 60) + ':';
                    if (sec < 10) time += '0';
                    time += sec % 60;

                    return time;
                });
            });
        });

        // console.log(time);
        return time
    }

    return {
        user,
        getCurrentUser,
        signInAnon,
        signInGoogle,
        signOutUser,
        getDisplayName,
        changeDisplayName,
        confirmDisplayName,
        isDisplayNameConfirmed,
        isRiddleSolved,
        getRiddle,
        checkCode,
        setRiddleSolved,
        getTask,
        addPhotoToDb,
        increaseTaskNumber,
        setFinished,
        isFinished,
        getUsers,
        getUserWithPhotos,
        setPhotoValidation,
        getTotalTime,
    }
}

export interface UserInfo {
    uid: string,
    displayName: string,
    taskNumber: number,
    finished: boolean,
    totalPoints: number,
    totalTime: string,
}

export interface PhotoInfo {
    id: string,
    taskNumber: number,
    link: string,
    deleteHash: string,
    date: string,
    valid: boolean
}