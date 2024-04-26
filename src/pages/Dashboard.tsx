import { Button, Col, Row } from "antd"
import { Link, Route, Routes, useNavigate } from "react-router-dom"
import Order from "./Order"
import User from "./User"
import Product from "./Product"
import Cookies from "universal-cookie"
import Blog from "./Blog"
import UpdateProductModal from "./UpdateProdcutModal"

const Dashboard = () => {

    const navigate = useNavigate()
    const cookie = new Cookies()

    const logout = () => {
        cookie.remove("information")
        cookie.remove("jwt-token")
        navigate("/")

    }

    return (
        <Row>
            <Col style={{ height: "100vh", backgroundColor: "orange" }} span={3}>
                <div style={{ textAlign: "center", margin: 20 }}>
                    <img src="/logo.jpg" alt="image" width={150} height={100} style={{ objectFit: "contain" }} />
                </div>

                <Row gutter={[10, 10]} style={{ textAlign: "center" }}>
                    {
                        cookie.get("information")?.roleId === 3 ?
                            <>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}>
                                        <Link to={"products"}>Products</Link>
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}><Link to={"orders"}>Orders</Link></Button>
                                </Col>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}><Link to={"blogs"}>Blogs</Link></Button>
                                </Col>
                            </>

                            :
                            <>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}>
                                        <Link to={"products"}>Products</Link>
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}><Link to={"orders"}>Orders</Link></Button>

                                </Col>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}><Link to={"users"}>Users</Link></Button>
                                </Col>
                                <Col span={24}>
                                    <Button style={{ width: "90%" }}><Link to={"blogs"}>Blogs</Link></Button>
                                </Col>
                            </>
                    }
                </Row>

                <Col span={24} style={{ margin: 20, textAlign: "center" }}>
                    <Button onClick={() => logout()} style={{ width: "90%" }}>Đăng xuất</Button>
                </Col>

            </Col>
            <Col span={21} style={{ height: "100vh", overflowY: "auto" }}>
                <Routes>
                    {
                        cookie.get("information")?.roleId === 3 ?
                            <>
                                <Route path='/orders' element={<Order />} />
                                <Route path='/products'>
                                    <Route index element={<Product />}></Route>
                                    <Route path="detail/:id" element={<UpdateProductModal />}></Route>
                                </Route>
                                <Route path='/blogs' element={<Blog />} />
                            </>

                            :
                            <>
                                <Route path='/orders' element={<Order />} />
                                <Route path='/products'>
                                    <Route index element={<Product />}></Route>
                                    <Route path="detail/:id" element={<UpdateProductModal />}></Route>
                                </Route>
                                <Route path='/users'>
                                    <Route index element={<User />} />
                                </Route>
                                <Route path='/blogs' element={<Blog />} />
                            </>
                    }


                    {/* <Route path='*' element={<AppRoutes />} /> */}
                </Routes>
            </Col>

        </Row>
    )
}

export default Dashboard