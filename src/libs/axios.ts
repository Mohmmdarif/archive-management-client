import axios from "axios";
import { API_BASE_URL } from "./utils/env";

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
