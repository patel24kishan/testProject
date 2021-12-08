import React,{useState,useEffect} from "react";
import firebaseDB from "./firebase-config";
import { doc, updateDoc,getDoc,setDoc  } from "firebase/firestore";
import{ userSignOut } from "./firebase-config";

 
const LoggedIn = ({ emailValue }) =>{
   
  const [boxBalance,SetBoxBalance]=useState('');
  const [boxNumber,SetBoxNumber]=useState('');
  const [transactionAmount,SetTransactionAmount]=useState('0');

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

    async function getBoxNumber() {
      const docRef = doc(firebaseDB, "UserData", emailValue);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such boxNumber!");
      }   
     SetBoxNumber(docSnap.get("boxnumber"));
     console.log("boxNumber - ",boxNumber);

    } 

    async function getBalanceOfBox() {
      const docRef = doc(firebaseDB, "boxBalances", boxNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such balance!");
      }   
     SetBoxBalance(docSnap.get("balance"));
     console.log("box balance - ",boxBalance);

    } 

    async function makeTransaction(){

      var currentDate = new Date(),
      date = (currentDate.getMonth() + 1) + '/' + currentDate.getDate()+'/'+currentDate.getFullYear() ;

      const transactionInfo = {
        amount:transactionAmount,
        boxID: boxNumber,
        user: emailValue,
        date: date
      };
      await setDoc(doc(firebaseDB, "boxData"), transactionInfo);

    }
    
    async function updateboxBalance(){
      
      const docRef = doc(firebaseDB, "boxBalances", boxNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such document!");
      }   
     var tempBalance=docSnap.get("balance");

     const updateboxBalanceRef = doc(firebaseDB, "boxBalances",boxNumber) - transactionAmount;
    
    await updateDoc(updateboxBalanceRef, {
    amount: updateboxBalance
        });

        getBalanceOfBox();
    }

    useEffect(() => {
      getBoxNumber();
      getBalanceOfBox();
    },[]);

    return (
        <div>
            <nav>
                <h2>Welcome {emailValue} &emsp;&emsp;&emsp; {boxNumber} Balance : {boxBalance}</h2>
                <br /><br />
            <nav>
            <h4>----------------------------------------- </h4>
                <h3>Transaction Amount</h3>
                <input onChange={(e)=>SetTransactionAmount(e.target.value)} placeholder="Your Answer" style={{width: "150px",height:"35px",fontSize:"20px"}} />
                <button onClick={() => { makeTransaction(); updateboxBalance() }} > Make Transaction</button>
            <h4>----------------------------------------- </h4>
            </nav>
            <br /><br />
                 <button > Virtual Assistant</button>
                <br /> <br />
                <button > Visualize transaction</button>
                <br /> <br /> <br />
                <button onClick={() => { handleSignout();updateUserStatus() }}> LogOut</button>

            </nav>
        </div>)
}

export default LoggedIn;