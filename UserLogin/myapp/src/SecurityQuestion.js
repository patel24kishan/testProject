import React,{  useState,useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import firebaseDB from "./firebase-config";
import CipherPage from "./CaesarCipher";
 
const QuestionPage = ({docID,email,loggedIn}) =>{

    const [enteredAnswer,setEnteredAnswer]=useState('');
    const [question,setQuestion] = useState('');
    const [answer,setAnswer] = useState('');
    const [QnAPassed,setQnAPassed]=useState('');

    async function verifyAnswer(){
        if(enteredAnswer === answer) {
            setQnAPassed(true);
        console.log("Caesar-cipher code");
        }else{
        console.log("not available");

        }
    }

    useEffect(()=>{
        getQuestion();
    },[]);

    async function getQuestion(){
        const docRef = doc(firebaseDB, "securityquestions", docID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        } else {
        console.log("No such document!");
        }   
       setQuestion(docSnap.get("question"));
       setAnswer(docSnap.get("answer"));
      } 

      
    return (
        <div>
            {(loggedIn && QnAPassed) ?
             <CipherPage
             emailValue={email}
             factor2Passed={loggedIn}
           /> : (
            <nav>
            <h2>Security Question (Step 2) </h2>
            <br />
                    <h3>{question} ?</h3>
                <br />
                    <h2> 
                        <label htmlFor="answerTag">Answer</label> 
                    </h2>
                    <input onChange={(e)=>setEnteredAnswer(e.target.value.toLowerCase())} placeholder="Your Answer" style={{width: "150px",height:"35px",fontSize:"20px"}} />

                    <br /><br />
            <button onClick={verifyAnswer} style={{width: "100px",height:"35px",fontSize:"20px"}}> Next </button> <br />

        </nav>
           )}
            
        </div>)
}

export default QuestionPage;