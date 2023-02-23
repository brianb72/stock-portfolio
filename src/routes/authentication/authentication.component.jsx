import { useNavigate } from "react-router-dom";

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";

import { AuthenticationContainer } from "./authentication.styles";
import { UserContext } from "../../contexts/user.context";
import React, { useContext } from "react";

const Authentication = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  if (currentUser) {
    navigate("/");
  }

  return (
    <AuthenticationContainer>
      <SignInForm />
      <SignUpForm />
    </AuthenticationContainer>
  );
};

export default Authentication;
