import firebaseDB, { userSignUp, useAuth, userLogin } from "./firebase-config";
import { doc, setDoc,updateDoc, getDoc } from "firebase/firestore";
import { useRef, useState,useEffect } from "react";
import QuestionPage from "./SecurityQuestion";
import { async } from "@firebase/util";
import LoggedIn from "./UserProfile";


function App() {

  const useremail = useRef();
  const username = useRef();
  const userpassword = useRef();
  const [flag, setflag] = useState('');
  const currentUser = useAuth();
  const loginemail = useRef();
  const loginpassword = useRef();
  const question = useRef();
  const [answer,setAnswer] = useState('');
  const [boxNumber,SetBoxNumber]=useState('');

  async function clearfield() {
    useremail.current.value = '';
    username.current.value = '';
    userpassword.current.value = '';
    question.current.value = '';
    setAnswer('');
  }

  async function handleSignUp() {
    try {
      await userSignUp(useremail.current.value, userpassword.current.value);
    } catch (error) {
      console.log(error.message);
      alert("User with same email already exists !!!");
    }
  }

  async function handleLogin() {
    try {
      await userLogin(loginemail.current.value, loginpassword.current.value);
      setflag(true);
    } catch (error) {
      console.log(error.message);
      alert("Invalid Username /Password !!!");
    }
  }

  async function addToDatabase() {
    try {
      const userInfo = {
        boxnumber:boxNumber,
        username: username.current.value,
        email: useremail.current.value,
        password: userpassword.current.value
      };
      await setDoc(doc(firebaseDB, "UserData", useremail.current.value), userInfo); //May change to username    
      // const boxDataRef = doc(firebaseDB, "boxData", "BOX0001");
      // const docSnap = await getDoc(boxDataRef);
      // var  countValue=0;
      // if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      //   countValue=parseInt(docSnap.get("numberofusers"))+1;
      // }
      //   await updateDoc(boxDataRef, {
      //     numberofusers: countValue
      //   });  
          
    }catch (error) {
      console.log(error.message);
    }
  }
  

  async function addOnlineStatus() {
    const statusInfo = {
      status: 'offline'
    };
    await setDoc(doc(firebaseDB, "useronlinestatus", useremail.current.value), statusInfo);

  }
  async function addQuestionsToDatabase() {
    try {
      const QnA = {
        question: question.current.value,
        answer: answer
      };
      // await addDoc(collectionName,userInfo);
      await setDoc(doc(firebaseDB, "securityquestions", useremail.current.value), QnA);

    } catch (error) {
      console.log(error.message);
    }
  }

  async function generateBoxNumber() {
    const boxNumberList = ["BOX0001", "BOX0002","BOX0003", "BOX0004", "BOX0005", "BOX0006", "BOX0007", "BOX0008", "BOX0009", "BOX0010"];
    const random = Math.floor(Math.random() * boxNumberList.length);
    SetBoxNumber(boxNumberList[random]);
  }

  useEffect(() => {
    generateBoxNumber();      
}, []); 
  

  return (
    <div id="userDetails">
      {(currentUser && flag) ? (

        <QuestionPage
          docID={loginemail.current.value}
          email={loginemail.current.value}
          loggedIn={currentUser}
        />
      ) : (
        <div>
          <br />
          <h2> Sign Up </h2>
          <br />
          <label htmlFor="boxnumber">Box Number : </label><h5>{boxNumber}</h5><button onClick={generateBoxNumber}> generate </button>
          <br />
          <label htmlFor="userEmailTag">Email Address  </label>
          <input ref={useremail} placeholder="Email" />
          
          <br />
          <label htmlFor="usernameTag">UserName :  </label>
          <input ref={username} placeholder="username" />
          <br />
          <br />
          <label htmlFor="userPasswordTag">Password     </label>
          <input type="password" ref={userpassword} placeholder="Password" />
          <br />

          <label htmlFor="questionTag">Security Question </label>
          <br />
          <select ref={question}>
            <option value="What is your pet name">What is your pet name?</option>
            <option value="Which is your city">Which is your city?</option>
            <option value="What is you Age">What is you Age?</option>

          </select>
          <br />
          <label htmlFor="answerTag">Answer </label>
          <br />
          <input onChange={(e)=>setAnswer(e.target.value.toLowerCase())} />
          <br />
          <br />
          <button onClick={() => { handleSignUp(); addQuestionsToDatabase(); addToDatabase();addOnlineStatus(); clearfield() }}> Sign Up</button>

          <br />
          <br />
          <h2> Login</h2>
          <br />
          <label htmlFor="userEmailTag">Email Address  </label>
          <input ref={loginemail} placeholder="Email" />
          <br />
          <br />
          <label htmlFor="userPasswordTag">Password     </label>
          <input type="password" ref={loginpassword} placeholder="Password" />
          <br />
          <br />
          <button onClick={handleLogin}> Login </button>
        </div>
      )}
    </div>
    // <LoggedIn/>
  );
}

export default App;
