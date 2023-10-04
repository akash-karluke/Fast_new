import {
    PublicClientApplication,
    AuthenticationResult,
    AccountInfo,
    EndSessionRequest,
    RedirectRequest,
    PopupRequest,
  } from "@azure/msal-browser";
  
  import { loginRequest, MSAL_CONFIG } from "../azure/config/authConfig";
  
  export class AzureAuthenticationContext {
    private myMSALObj: PublicClientApplication = new PublicClientApplication(
      MSAL_CONFIG
    );
    private account: any;
    private loginRedirectRequest?: RedirectRequest;
    private loginRequest?: PopupRequest;
  
    public isAuthenticationConfigured = false;
  
    constructor() {
      this.account = null;
      this.setRequestObjects();
      if (MSAL_CONFIG?.auth?.clientId) {
        this.isAuthenticationConfigured = true;
      }
    }
  
    private setRequestObjects(): void {
      this.loginRequest = {
        ...loginRequest,
      };
  
      this.loginRedirectRequest = {
        ...this.loginRequest,
      };
    }
  
    login(signInType: string, setUser: any): void {
      if (signInType === "loginPopup") {
        this.myMSALObj
          .loginPopup(this.loginRequest)
          .then((resp: AuthenticationResult) => {
            this.handleResponse(resp, setUser);
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (signInType === "loginRedirect") {
        this.myMSALObj.loginRedirect(this.loginRedirectRequest);
      }
    }
  
    logout(account: AccountInfo): void {
      const logOutRequest: EndSessionRequest = {
        account,
      };
  
      this.myMSALObj.logout(logOutRequest);
    }
    handleResponse(response: AuthenticationResult, incomingFunction: any): void {
      if (response !== null && response.account !== null) {
        this.account = response.account;
      } else {
        this.account = this.getAccount();
      }
  
      if (this.account) {
        incomingFunction(this.account);
      }
    }
    private getAccount(): any {
      const currentAccounts = this.myMSALObj.getAllAccounts();
      if (currentAccounts === null) {
        return undefined;
      }
  
      if (currentAccounts.length > 1) {
        // TBD: Add choose account code here
        console.log(
          "Multiple accounts detected, need to add choose account code."
        );
        return currentAccounts[0];
      } else if (currentAccounts.length === 1) {
        return currentAccounts[0];
      }
    }
  }
  
  export default AzureAuthenticationContext;
  