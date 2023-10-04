import { createAsyncThunk } from "@reduxjs/toolkit";


export interface LoginRequest {
    access_token: string;
  }
  
  export interface TokenResponse {
    token: string;
    user: any;
  }

export class AuthService {

 
    login = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
          
          });
        }, 1000);
      });
    };
     

}