import { useContext, useState } from "react";

import { LoginContext } from "../contexts/LoginContext";
import AccountLayout from "./AccountLayout";
import LoginBox from "../components/LoginBox";
import SignUpBox from "../components/SignUpBox";

import "./styles/Account.css";

function Account() {
  const { isLoggedIn, bearerToken } = useContext(LoginContext);
  const [signUpSelected, setSignUpSelected] = useState(false);
  const [signInSelected, setSignInSelected] = useState(true);

  const switchToSignIn = () => {
    setSignInSelected(true);
    setSignUpSelected(false);
  };

  const switchToSignUp = () => {
    setSignUpSelected(true);
    setSignInSelected(false);
  };

  return (
    <div className="sign-container">
      {!isLoggedIn && !bearerToken && (
        <div className="sign-selector-btns">
          <button
            className={`sign-selector ${signInSelected ? "active" : ""}`}
            onClick={switchToSignIn}
          >
            Sign in
          </button>
          <button
            className={`sign-selector ${signUpSelected ? "active" : ""}`}
            onClick={switchToSignUp}
          >
            Sign up
          </button>
        </div>
      )}

      {(!isLoggedIn && !bearerToken && (
        <>
          {signInSelected && <LoginBox />}
          {signUpSelected && <SignUpBox />}
        </>
      )) || <AccountLayout />}
    </div>
  );
}

export default Account;
