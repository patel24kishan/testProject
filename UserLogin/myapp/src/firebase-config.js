import { getAuth,createUserWithEmailAndPassword, onAuthStateChanged,signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useState,useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxVmynhKSlBOf77RqWs9pR2MYGe44lKwA",
  authDomain: "serverlessproject-95c6d.firebaseapp.com",
  projectId: "serverlessproject-95c6d",
  storageBucket: "serverlessproject-95c6d.appspot.com",
  messagingSenderId: "861982538997",
  appId: "1:861982538997:web:742695e224fa349b5a19bc",
  measurementId: "G-K5K3QG6CKZ"
};

const app=initializeApp(firebaseConfig);
const auth = getAuth(); 
const firebaseDB=getFirestore(app);

export default firebaseDB;

export function userSignUp(useremail ,userpassword) {
  return createUserWithEmailAndPassword(auth,useremail,userpassword);
}

export function userLogin(useremail ,userpassword) {
  return signInWithEmailAndPassword(auth,useremail,userpassword);
}

export function userSignOut() {
  return signOut(auth);
}

export function useAuth() {
  const [currentSignedInUser,setCurrentSignedInUser]=useState();

  useEffect(() => {

    const temp=onAuthStateChanged(auth,user => setCurrentSignedInUser(user));
    return temp;
    }, [])
  return currentSignedInUser;
}
