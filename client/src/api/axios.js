import axios from "axios";

let url = "";
if (process.env.NODE_ENV === "development") url = process.env.LOCAL_SERVER_URL;
else url = process.PROD_SERVER_URL;


export default axios.create({
  baseURL: url,
});

export const axiosPrivate = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
