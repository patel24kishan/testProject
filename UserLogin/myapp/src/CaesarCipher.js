import React,{  useState,useEffect } from "react";
import { doc, updateDoc  } from "firebase/firestore";
import firebaseDB from "./firebase-config";
import LoggedIn from "./UserProfile";
 
const CipherPage = ({handleSignout,emailValue,factor2Passed}) =>{

    const [cipher,setCipher]=useState('');
    const [enteredAnswer,setEnteredAnswer]=useState('');
    const [cipherFlag,setCipherFlag]=useState('');
    const [correctAnswer,setcorrectAnswer]=useState('');
      
    useEffect(() => {
            generateCipher();      
      }, []); 

    async function generateCipher(){
    const cipherList = ["Train", "February","christmas", "tiger", "Canada", "India", "Station", "mobile"];
    const random = Math.floor(Math.random() * cipherList.length);
    setCipher(cipherList[random])
    await  fetch('https://y090bzc1m1.execute-api.us-east-1.amazonaws.com/test2?userinput='+cipherList[random])
          .then(results => results.json())
          .then(data => {
            const {correctAnswer} = data;
            setcorrectAnswer(correctAnswer);
            console.log("cipher to solve - " + cipherList[random])
            console.log("correct -  "+correctAnswer);
          });
    }

    async function verifyAnswer() {
        if(enteredAnswer === correctAnswer) {
            setCipherFlag(true);
            await updateUserStatus();
        console.log("Caesar-cipher code Success");
        }else{
        console.log("not available");
        }
    }

    async function updateUserStatus(){

        const changeStatus = doc(firebaseDB, "useronlinestatus",emailValue);
       
        await updateDoc(changeStatus, {
        status: "online"
            });
    }

    return (
        <div>
            {(factor2Passed && cipherFlag) ?
             <LoggedIn
             handleSignout={handleSignout}
             emailValue={emailValue}
           />:(
            <nav>
            <h2>Solve this Cipher (Step 3) </h2>
            <br />
                    <h3> Cipher to encrypt: <h2>"{cipher}"</h2> </h3>
                    <h4>(Key: A+5 = F, a+5=f)<p/>  (Uppercase should be replaced by uppercase and
                        <p/>  same for lowerecase characters)) </h4>

                <br />
                    <h2> 
                        <label htmlFor="answerTag">Answer</label> 
                    </h2>
                    <input onChange={(e)=>setEnteredAnswer(e.target.value)} placeholder="Your Answer" style={{width: "150px",height:"35px",fontSize:"20px"}} />

                    <br /><br />
            <button onClick={verifyAnswer} style={{width: "200px",height:"35px",fontSize:"20px"}}> Go to Home Page </button> <br />
        </nav> 
        )}
            
        </div>)
}

export default CipherPage;