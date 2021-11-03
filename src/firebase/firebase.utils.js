import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const config = {
  apiKey: "AIzaSyCjhwXoQjs0V5TGWuVd4D7wEinmo6SGP5o",
  authDomain: "react-redux-f9753.firebaseapp.com",
  projectId: "react-redux-f9753",
  storageBucket: "react-redux-f9753.appspot.com",
  messagingSenderId: "7068375155",
  appId: "1:7068375155:web:9ae151d529b771a77b3206",
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
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
//trigger select account when ever we click on google auth button
googleProvider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
