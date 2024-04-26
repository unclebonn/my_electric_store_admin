import { ArrowUpOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { Card, Col, DatePicker, DatePickerProps, Image, Row, Statistic } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


interface totalPriceProps {
    "totalOrder": number,
    "totalprice": number
}

const Chart: React.FC = () => {

    ChartJS.register(ArcElement, Tooltip, Legend);

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


    const PieChart = () => {

        const label = bestSeller.map((product: any) => {
            return product.categoryName
        })
        const datasets = bestSeller.map((product: any) => {
            return product.productBestSeller
        })

        const data = {
            labels: label,
            datasets: [
                {
                    data: datasets,
                    backgroundColor: ['#E6F1D8', '#AFD788', '#5BBD2B', "#367517"],
                },
            ],
        };

        const options = {
            // Cấu hình tùy chọn cho biểu đồ
        };

        return <Pie data={data} options={options} />;
    };

    return (


        <>
            <Row style={{ margin: 60 }}>
                <Col span={8}>
                    <h2>Hôm nay</h2>
                    <Row style={{ marginTop: 50 }}>
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
                    <Row style={{ marginTop: 50 }}>
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

                <div>
                    <PieChart />
                </div>
            </Row>
        </>
    )
}

export default Chart