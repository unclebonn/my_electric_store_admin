import { ArrowUpOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { Card, Col, DatePicker, DatePickerProps, Image, Row, Statistic } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"


interface totalPriceProps {
    "totalOrder": number,
    "totalprice": number
}

const Chart: React.FC = () => {

    const [daily, setDaily] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })
    const [weekly, setWeekly] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })
    const [monthly, setMonthly] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })


    const [bestSeller, setBestSeller] = useState([])


    const totalPriceByTime = async (type: number) => {
        axios.get(`${ADMIN.DASHBOARD.TOTALPRICEBYTIME}?type=${type}`)
            .then((res) => {
                if (res.status === 200) {
                    switch (type) {
                        case 1:
                            setDaily(res.data.data)
                            break;
                        case 2:
                            setWeekly(res.data.data)
                            break;
                        case 3:
                            setMonthly(res.data.data)
                            break;

                        default:
                            break;
                    }
                }
            })
    }

    const bestseller = async () => {
        axios.get(`${ADMIN.DASHBOARD.BESTSELLER}`)
            .then((res) => {
                if (res.status === 200) {
                    setBestSeller(res.data.data)
                }
            })
    }


    useEffect(() => {
        totalPriceByTime(1)
        // totalPriceByTime(2)
        totalPriceByTime(3)
        bestseller()
    }, [])


    const imagelist = [
        "https://mekoong.com/wp-content/uploads/2022/10/4_mekoong-11.jpg",
        "https://thienkimhome.com/application/upload/products/bep-dien-tu-malloca-mh-03irb-new.jpg",
        "https://bepeu.vn/wp-content/uploads/2022/04/anh1-tu-lanh-4-canh-Fagor.jpg",
        "https://mekoong.com/wp-content/uploads/2022/10/4_mekoong-11.jpg",
    ]


    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        axios.get(`${ADMIN.DASHBOARD.TOTALPRICEBYTIME}?ordertime=${dateString}&type=2`)
            .then((res) => {
                if (res.status === 200) {
                    setWeekly(res.data.data)
                }
            })
    };

    return (


        <>
            <Row style={{ margin: 60 }}>
                <Col span={8}>
                    <h2>Hôm nay</h2>
                    <Row style={{marginTop:50}}>
                        <Card>
                            <Statistic
                                title="Đơn"
                                value={daily.totalOrder}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix={<ShoppingCartOutlined />}
                            />
                        </Card>

                    </Row>
                    <Row>
                        <Card >
                            <Statistic
                                title="Tổng tiền"
                                value={daily.totalprice}
                                
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="đ"
                            />
                        </Card>
                    </Row>
                </Col>
                <Col span={8}>
                    <h2>Tuần</h2>
                    <span>Vui lòng chọn ngày</span> <DatePicker onChange={onChange} />
                    <Row>
                        <Card>
                            <Statistic
                                title="Đơn"
                                value={weekly.totalOrder}
                               
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix={<ShoppingCartOutlined />}
                            />
                        </Card>

                    </Row>
                    <Row>
                        <Card >
                            <Statistic
                                title="Tổng tiền"
                                value={weekly.totalprice}
                               
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="đ"
                            />
                        </Card>
                    </Row>
                </Col>
                <Col span={8}>
                    <h2>Tháng</h2>
                    <Row style={{marginTop:50}}>
                        <Card >
                            <Statistic
                                title="Đơn"
                                value={monthly.totalOrder}
                               
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix={<ShoppingCartOutlined />}
                            />
                        </Card>

                    </Row>
                    <Row>
                        <Card >
                            <Statistic
                                title="Tổng tiền"
                                value={monthly.totalprice}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="đ"
                            />
                        </Card>
                    </Row>
                </Col>



            </Row>

            <Row style={{ margin: 70 }}>
                <Col span={24}>
                    <h2>Các loại bán chạy</h2>
                </Col>
                <Row gutter={[30, 30]}>
                    {bestSeller.map((product: any, index: number) => {
                        return (
                            <Col span={8}>
                                <Row>
                                    <Image style={{ objectFit: "contain" }} src={imagelist[index]}></Image>
                                </Row>
                                <Row>
                                    <h4>
                                        {product.categoryName}
                                    </h4>

                                </Row>
                                <Row>
                                    Số lượng: {product.productBestSeller}
                                </Row>
                            </Col>
                        )
                    })}

                </Row>
            </Row>
        </>
    )
}

export default Chart