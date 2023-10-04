import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { callMsGraph } from "../api/graph";
import { fetchFilters } from "../store/features/filters";
import { addUser, fetchUser } from "../store/features/user";
import { userProps } from "../store/features/user/user";
import { Overviewservice } from "./Services/OverviewService";

function ProfileContent() {
  const { instance, inProgress, accounts } = useMsal();
  const [apiData, setApiData] = useState<any>(null);
  const dispatch = useDispatch();


  useEffect(() => {
    const accessTokenRequest = {
      scopes: ["user.read"],
      account: accounts[0],
    };
    let accessToken = "";
    if (!apiData && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          accessToken = accessTokenResponse.accessToken;
          // Call your API with token
          callMsGraph(accessToken).then((response: any) => {
            setApiData(response);
            fetchUser(response?.userPrincipalName)
              .then((userData: { data: userProps }) => {
                if (userData.data === null) {
                  Router.push("/notAuthorized");
                }
                Overviewservice.getImageUrl(accessToken)
                  .then((res: any) => {
                    const image = Buffer.from(res, "binary").toString("base64");
                    dispatch(
                      addUser({
                        ...userData.data,
                        avatarUrl: "data:image/jpeg;base64, " + image,
                      })
                    );
                    dispatch(fetchFilters(userData));
                  })
                  .catch((err: any) => {
                    dispatch(addUser({ ...userData.data, avatarUrl: "NONE" }));
                    dispatch(fetchFilters(userData));
                  });
              })
              .catch((err) => {
                Router.push("/notAuthorized");
              });
          });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(accessTokenRequest);
          }
        });
    }
  }, [instance, accounts, inProgress, apiData]);

  return <></>;
}

export default ProfileContent;
