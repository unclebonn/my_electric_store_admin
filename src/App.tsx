import { Button, Col, Row } from 'antd';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import Order from 'pages/Order';
import User from 'pages/User';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css"
import { Helmet } from 'react-helmet';


function App() {

  const cookie = new Cookies()
  return (
    <>
      <Helmet>
        <title>Electronic Admin</title>
      </Helmet>
      <ToastContainer position="top-right" autoClose={1500} closeButton={true} limit={3} newestOnTop />
      <BrowserRouter>
        {/* <Helmet>
          <title>Electronic Admin</title> */}
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/dashboard*' element={<Dashboard />} />
        </Routes>
        {/* </Helmet> */}

        {/* <ToastContainer position="top-right" autoClose={1500} closeButton={true} limit={3} newestOnTop /> */}
      </BrowserRouter>
    </>

  );
}

export default App;
