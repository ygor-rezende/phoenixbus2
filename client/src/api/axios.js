import axios from "axios";

let url = "";
let pdfUrl = "";
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:8000";
  pdfUrl = "http://localhost:8080/api/getpdf";
} else {
  url = "https://app-aybje326pa-uc.a.run.app";
  pdfUrl = "https://pdfservice-aybje326pa-uc.a.run.app/api/getpdf";
}

export const axiosPdfService = axios.create({
  baseURL: pdfUrl,
  responseType: "blob",
});

export default axios.create({
  baseURL: url,
});

export const axiosPrivate = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
