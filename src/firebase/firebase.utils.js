import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyBuEMu_KVL17DTJaBlkyGmVcGCCVZIrfyw",
  authDomain: "crwn-clo.firebaseapp.com",
  databaseURL: "https://crwn-clo-default-rtdb.firebaseio.com",
  projectId: "crwn-clo",
  storageBucket: "crwn-clo.appspot.com",
  messagingSenderId: "687005184465",
  appId: "1:687005184465:web:098154e0152f0ee6a4f0f0"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (collectionKey, documentsToAdd) => {
  const collectionRef = firestore.collection(collectionKey);
  const batch = firestore.batch();
  documentsToAdd.forEach(doc => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, doc)
  });

  return await batch.commit();
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
