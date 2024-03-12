import axios from "axios";

let url = "";
if (process.env.NODE_ENV === "development") url = "http://localhost:8000";
else url = "https://app-aybje326pa-uc.a.run.app";

export default axios.create({
  baseURL: url,
});

export const axiosPrivate = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
