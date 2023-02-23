import { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";

import { UserContext } from "../../contexts/user.context";

import { signOutUser } from "../../utils/firebase/firebase.utils";

import {
  NavigationContainer,
  NavLinks,
  NavLink,
  LogoContainer,
} from "./navigation.styles";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <Fragment>
      <NavigationContainer>
        <LogoContainer to="/">Home</LogoContainer>
        <NavLinks>
          <NavLink to="/sample">Sample</NavLink>
          {currentUser ? (
            <Fragment>
              <NavLink to="/view">View</NavLink>
              <NavLink to="/edit">Edit</NavLink>
              <NavLink as="span" onClick={signOutUser}>
                SIGN OUT
              </NavLink>
            </Fragment>
          ) : (
            <NavLink to="/auth">SIGN IN</NavLink>
          )}
        </NavLinks>
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
