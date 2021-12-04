import React from "react";
import firebaseDB from "./firebase-config";
import { doc, updateDoc  } from "firebase/firestore";
import{ userSignOut } from "./firebase-config";

 
const LoggedIn = ({ emailValue }) =>{
   
    async function handleSignout(){
        try {
          await userSignOut();
        } catch {
          alert("Something went wrong !!!");
        }
      }

    async function updateUserStatus(){

    const changeStatus = doc(firebaseDB, "useronlinestatus",emailValue);
    
    await updateDoc(changeStatus, {
    status: "offline"
        });
    }

    return (
        <div>
            <nav>
                <h2>Welcome {emailValue}</h2>
                <br />
                <button onClick={() => { handleSignout();updateUserStatus() }}> LogOut</button>

            </nav>
        </div>)
}

export default LoggedIn;