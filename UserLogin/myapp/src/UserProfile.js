import React,{useState,useEffect} from "react";
import firebaseDB from "./firebase-config";
import { doc, updateDoc,getDoc,setDoc  } from "firebase/firestore";
import{ userSignOut } from "./firebase-config";

 
const LoggedIn = ({ emailValue }) =>{
   
  const [boxBalance,SetBoxBalance]=useState('');
  const [boxNumber,SetBoxNumber]=useState('');
  const [transactionAmount,SetTransactionAmount]=useState('0');



  useEffect(() => {
    getBoxNumber();
    getBalanceOfBox();
  },[boxNumber]);

  
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
      try{
      const docRef = doc(firebaseDB, "UserData", emailValue);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such boxNumber!");
      }   
      var tempNo=await docSnap.get("boxnumber");
     SetBoxNumber(tempNo);
     console.log("boxNumber - ",boxNumber);
 
     
    }catch(e) {

      console.log("getboxNumber",e);
      }
    } 

    async function getBalanceOfBox() {
      try{
      const docRef = doc(firebaseDB, "boxBalances", boxNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such balance!");
      }  
      var balance = await docSnap.get("balance");
     SetBoxBalance(balance);
     console.log("box balance - ",boxBalance);
    }catch(e) {
      console.log("getBalance",e);
    }
    } 

    async function makeTransaction(){
      try{
      var currentDate = new Date();
      const dateInfo = (currentDate.getMonth() + 1) + '/' + currentDate.getDate()+'/'+currentDate.getFullYear() ;
      const random = Math.floor(Math.random() * 100);
      const temp="T0"+random;
      const transactionInfo = {
        amount:transactionAmount,
        boxID: boxNumber,
        user: emailValue,
        date: dateInfo
      };
      await setDoc(doc(firebaseDB, "boxData",temp), transactionInfo);
    }catch(e) {
      console.log("makeTransaction",e); 

    }

    }
    
    async function updateboxBalance(){
      
      try{
      const docRef = doc(firebaseDB, "boxBalances", boxNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      } else {
      console.log("No such document!");
      }   


     var updateboxBalance = parseInt(docSnap.get("balance")) - transactionAmount;
    
    await updateDoc(docRef, {
    balance: updateboxBalance
        });
       SetBoxBalance(updateboxBalance);
      }catch(e) {
        console.log("updateboxBalance",e);
      }
    }

   
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
                <button onClick={()=> window.open("https://datastudio.google.com/embed/reporting/5192856f-9ac3-4fd3-826f-892c98f95409/page/03GhC", "_blank")} > Visualize transaction</button>
                <br /> <br /> <br />
                <button onClick={() => { handleSignout();updateUserStatus() }}> LogOut</button>

            </nav>
        </div>)
}

export default LoggedIn;