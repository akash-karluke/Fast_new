import "antd/dist/antd.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Avatar, Badge, Spin } from "antd";
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import commentIcon from "../assets/icons/comment.svg";
import bellIcon from "../assets/icons/bellIcon.svg";
import Image from "next/image";
import ulLogo from "../assets/images/ulLogo.svg";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MSAL_CONFIG } from "../components/azure/config/authConfig";
import ProfileContent from "../components/ProfileContent";
import { Authentication } from "../components/Authentication";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { interceptor } from "../components/Interceptor/axiosInterceptor";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    interceptor();
  }, []);

  const msalInstance = new PublicClientApplication(MSAL_CONFIG);
  if ("/notAuthorized" === asPath) {
    return (
      <Provider store={store}>
        <MsalProvider instance={msalInstance}>
          <AuthenticatedTemplate>
            <Component {...pageProps} />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Authentication>
              <Component {...pageProps} />
            </Authentication>
          </UnauthenticatedTemplate>
        </MsalProvider>
      </Provider>
    );
  }
  console.log('here')
  return (
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <AuthenticatedTemplate>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Header />
          <ProfileContent />
          <Component {...pageProps} />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Authentication>
            <Header />
            <ProfileContent />
            <Component {...pageProps} />
          </Authentication>
        </UnauthenticatedTemplate>
      </MsalProvider>
    </Provider>
  );
}

const Header = () => {
  // temp Code Starts
  const { user } = useSelector((state: any) => state.user);
  // temp code ends here
  if (user.userId === null) {
    return <></>;
  }
  return (
    <div>
      <div className="header">
        <div className="header_logo">
          <Image src={ulLogo} className="logo_img" />
        </div>
        <Navbar />
        <div className="comment_icon">
          <Image src={commentIcon} />
        </div>
        <div className="bell_icon">
          <Badge count={1}>
            <Image src={bellIcon} />
          </Badge>
        </div>
        <div className="user_sections">
          {user.avatarLink === "NONE" ? (
            <Avatar size={"small"}>
              {user.displayName
                .split(" ")
                .map((word: string) => word[0])
                .join("")}
            </Avatar>
          ) : (
            <Avatar
              className="avatar"
              src={<img src={user.avatarLink} />}
              shape="square"
            />
          )}
        </div>
        <div className="user_details">
          <div className="">{user.displayName}</div>
          <div className="">{user.profile}</div>
        </div>
      </div>
    </div>
  );
};

export default MyApp;
