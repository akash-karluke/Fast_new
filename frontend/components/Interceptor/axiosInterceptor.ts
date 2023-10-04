import axios from "axios";

export const interceptor = () => {
  axios.interceptors.response.use((response) => {
    return response.data;
  });
};
