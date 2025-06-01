import axios from "axios";
// import { API_BASE_URL } from "./utils/env";

export const axiosInstance = axios.create({
  baseURL: `/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
