import { InteractionType } from "@azure/msal-browser";
import {
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react";

import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { RootState } from "../../app/store";
import { clearToken, setToken, setUser } from "../store/features/auth/authSlice";
//import { useLoginMutation } from "../../service/auth";
import { loginRequest } from "../components/azure/config/authConfig";
import { AuthService } from "../components/Services/Auth";
import { callMsGraph }from "../api/graph";
import { Spin } from "antd";


/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const Authentication = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const dispatch = useDispatch();
  const { instance, accounts } = useMsal();

 
  //const token = useSelector((state:any) => state.auth.token);

 // const login = new AuthService();
  //const [login] = useLoginMutation();

  const isAuthenticated = useIsAuthenticated();

  const { error } = useMsalAuthentication(InteractionType.Silent, loginRequest);

  useEffect(() => {
    if (error) {
      handleLogin("redirect");
      //dispatch(clearToken());
    }
  }, [error]);

  const handleLogin = (loginType: string) => {
    if (loginType === "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch((e) => {
      });
    }
  };

  return (
    <div>
      {isAuthenticated? (
        <>{children}</>
      ) : (
        <Spin/>
      )}
    </div>
  );
};
