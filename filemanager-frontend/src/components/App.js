import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Header from "./Header";
import S3Bucket from "./S3Bucket";

const App = () => {
  const [user, setUser] = useState({});
  const [cred, setCred] = useState("");

  useEffect(()=>{
    let jwt = getCookie("jwt")
    if(jwt){
      setCred(jwt)
      getUserData(jwt)
    }
  },[])
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
 
  const getUserData = async (jwt) => {
    try {
      const response = await axios.get(
        "http://localhost:5001/upload/userdata",
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: jwt,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setUser(response.data);
      } else {
        throw new Error("authentication has been failed!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {

    googleLogout();
    setCred("");
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUser({});
    console.log("Google Logout");
  };

  const handleOnSuccess = (credentialResponse) => {
    setCred(credentialResponse.credential);
    document.cookie = `jwt=${credentialResponse.credential}`
    getUserData(credentialResponse.credential);
  };

  return (
    <>
      <Header name={user?.name} picLink={user?.picture} logout={handleLogout} />

      {!cred ? (
        <div id="login">
          <GoogleLogin
            onSuccess={(credentialResponse) =>
              handleOnSuccess(credentialResponse)
            }
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      ) : (
        <S3Bucket jwt={cred} />
      )}
    </>
  );
};

export default App;
