import { Col, Row } from "antd"
import LoginComponent from "./components/LoginComponent"
import axios, { AxiosResponse } from "axios"
import { AUTH, INFORMATION } from "utils/contanst"
import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Login: React.FC = () => {

    const cookie = new Cookies()
    const navigate = useNavigate()

    const backgroundLoginStyle: React.CSSProperties = {
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(199 141 55 / 54%)"
    }


    useEffect(() => {
        if (cookie.get("information")?.roleId == 1) {
            navigate("/dashboard/")
        } else if (cookie.get("information")?.roleId == 3) {
            navigate("/dashboard/products")
        }else{

        }
    }, [])
    const onChangeFormLogin = (auth: { email: string, password: string }) => {
        axios.post(AUTH, auth)
            .then((res) => {
                if (res.status === 200) {
                    const { tokenString, expiration } = res.data.data
                    cookie.set("jwt-token", tokenString, { expires: new Date(expiration), path: "/" })

                    axios.get(`${INFORMATION}/${tokenString}`)
                        .then((res) => {
                            if (res.status === 200) {
                                const information = res.data
                                cookie.set("information", information, { expires: new Date(expiration), path: "/" })
                                if (information.roleId === 3) {
                                    navigate("/dashboard/products")
                                } else {
                                    navigate("/dashboard/")

                                }
                            }
                        })
                } else {

                }
            })

    }
    return (
        <Row>
            <Col md={8} style={backgroundLoginStyle} className="background-login"></Col>
            <Col md={16} className="login-form" style={{ width: "450px", margin: "auto", display: "grid", justifyContent: "center" }}>
                <Row style={{ margin: "10px 0px" }}>
                    <Col span={24}>
                        <h2>Xin chào bạn!</h2>
                        <p>Vui lòng nhập thông tin đăng nhập/đăng ký của bạn!</p>
                    </Col>
                </Row>
                <Row style={{ margin: "10px 0px" }}>
                    <Col md={24}>



                        <LoginComponent onChangeFormLogin={onChangeFormLogin} />


                    </Col>
                </Row>
                <Row style={{ margin: "10px 0px" }}>

                </Row>
            </Col>
        </Row>
    )
}


export default Login