import { ArrowUpOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import { Card, Col, DatePicker, DatePickerProps, Image, Row, Statistic } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarController, BarElement, LinearScale, CategoryScale } from "chart.js";


interface totalPriceProps {
    "totalOrder": number,
    "totalprice": number
}

const Chart: React.FC = () => {


    const [daily, setDaily] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })
    const [weekly, setWeekly] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })
    const [monthly, setMonthly] = useState<totalPriceProps>({ totalOrder: 0, totalprice: 0 })


    const [fiveweek, setFiveWeek] = useState([])


    const [bestSeller, setBestSeller] = useState([])

    ChartJS.register(ArcElement, Tooltip, Legend);
    ChartJS.register(BarController, BarElement, LinearScale, CategoryScale);

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

    const getfiveweek = () => {
        axios.get(`${ADMIN.DASHBOARD.FIVEWEEK}`)
            .then((res) => {
                if (res.status === 200) {
                    setFiveWeek(res.data.data)
                }
            })
    }


    useEffect(() => {
        totalPriceByTime(1)
        // totalPriceByTime(2)
        totalPriceByTime(3)
        bestseller()
        getfiveweek()
    }, [])




    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        axios.get(`${ADMIN.DASHBOARD.TOTALPRICEBYTIME}?ordertime=${dateString}&type=2`)
            .then((res) => {
                if (res.status === 200) {
                    setWeekly(res.data.data)
                }
            })
    };


    // const PieChart = () => {

    //     const label = bestSeller.map((product: any) => {
    //         return product.categoryName
    //     })
    //     const datasets = bestSeller.map((product: any) => {
    //         return product.productBestSeller
    //     })

    //     const data = {
    //         labels: label,
    //         datasets: [
    //             {
    //                 data: datasets,
    //                 backgroundColor: ['#E6F1D8', '#AFD788', '#5BBD2B', "#367517"],
    //             },
    //         ],
    //     };

    //     const options = {
    //         // Cấu hình tùy chọn cho biểu đồ
    //     };

    //     return <Pie data={data} options={options} />;
    // };

    const BarChart = () => {

        const label = fiveweek.map((statistic: any) => {
            return `Tuần ${statistic.week}`
        })
        const value = fiveweek.map((statistic: any) => {
            return statistic.totalInWeek
        })

        const data = {
            labels: label,
            datasets: [
                {
                    label: "Số lượng sản phẩm bán trong 5 tuần",
                    data: value,
                    backgroundColor: ["orange"],
                },
            ],
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        return <Bar height={300} width={400} data={data} options={options} />;
    };
    const BarChartTop4 = () => {

        const label = bestSeller.map((statistic: any) => {
            return `${statistic.categoryName}`
        })
        const value = bestSeller.map((statistic: any) => {
            return statistic.productBestSeller
        })

        const data = {
            labels: label,
            datasets: [
                {
                    label: "Top 4 sản phẩm bán chạy",
                    data: value,
                    backgroundColor: ["green"],
                },
            ],
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        return <Bar height={300} width={400} data={data} options={options} />;
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
                    <h2>Các loại biểu đồ</h2>
                </Col>

                <div style={{ marginRight: 200 }}>
                    <BarChartTop4 />
                </div>
                <div>
                    <BarChart />
                </div>
            </Row>
        </>
    )
}

export default Chart