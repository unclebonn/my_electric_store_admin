import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css"
import Cookies from "universal-cookie";
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

const cookie = new Cookies()

const onRequestSuccess = (config: any) => {
  const token = cookie.get("jwt-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axios.interceptors.request.use(onRequestSuccess)


dayjs.locale('vi');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
