import { Button, Col, Modal, Pagination, Row, Space, Table, TableProps, Tag, message } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"
import { formatCurrencyVN } from "utils/formatCurrency"
import { formatDate, getDateTodayVN } from "utils/formatDate"
import dayjs, { Dayjs } from "dayjs"



interface Order {
    id: number,
    orderDate: string,
    totalPrice: number,
    status: number,
    statusMessage: string,
    paymentName: string,
    nameCustomer: string,
    addressCustomer: string,
    phoneCustomer: string
}

interface OrderDetail {
    expiredWarranty: string,
    price: number,
    quantity: number,
    product: {
        id: number,
        imageUrl: string,
        name: string
    }
}

const Order: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [orderdetail, setOrderdetail] = useState([]);


    const [total, setTotal] = useState()



    const updateStatus = (record: Order) => {
        axios.put(`${ADMIN.UPDATESTATUSORDER}/${record.id}/1`)
            .then((res) => {
                if (res.status === 200) {
                    getAllOrder()
                    messageApi.open({
                        type: 'success',
                        content: 'Cập nhật thành công',
                    });
                }
            })

    }
    const updateStatusCancel = (record: Order) => {
        axios.put(`${ADMIN.UPDATESTATUSORDER}/${record.id}/3`)
            .then((res) => {
                if (res.status === 200) {
                    getAllOrder()
                    messageApi.open({
                        type: 'success',
                        content: 'Cập nhật thành công',
                    });
                }
            })

    }

    const columns: TableProps<Order>['columns'] = [
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text) => <a>{text}</a>,
        // },
        {
            title: 'Ngày tạo đơn hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render(value, record, index) {
                return <span>{formatDate(value)}</span>
            },
        },
        {
            title: 'Tên khách hàng',
            key: 'nameCustomer',
            dataIndex: 'nameCustomer',
        },
        {
            title: 'Địa chỉ',
            key: 'addressCustomer',
            dataIndex: 'addressCustomer',

        },
        {
            title: 'Số điện thoại',
            key: 'phoneCustomer',
            dataIndex: "phoneCustomer"
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: "paymentName",
            render: (value, record, index) => {
                switch (value) {
                    case "tienmat":
                        return <Tag color="blue">Tiền mặt</Tag>

                    case "qrcode":

                        return <Tag color="blue">Qr code</Tag>

                    case "vnpay":

                        return <Tag color="blue">VN Pay</Tag>
                    default:
                        break;
                }
            },
            filters: [
                {
                    text: 'Tiền mặt',
                    value: 'tienmat',
                },
                {
                    text: 'QrCode',
                    value: 'qrcode',
                },
                {
                    text: 'VNPay',
                    value: 'vnpay',
                },
            ],
            onFilter: (value, record) => record.paymentName.startsWith(value as string),
            filterSearch: true
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: "status",
            render: (status) => {
                switch (status) {
                    case 1:
                        return <Tag color="green">Thành công</Tag>
                    case 2:
                        return <Tag color="yellow">Đang xử lý</Tag>
                    case 3:
                        return <Tag color="red">Đã huỷ</Tag>
                    default:
                        return <Tag color="yellow">Đang xử lý</Tag>
                        return
                }
            },
            filters: [
                {
                    text: 'Thành công',
                    value: "1",
                },
                {
                    text: 'Đang xử lí',
                    value: "2",
                },
                {
                    text: 'Đã huỷ',
                    value: "3",
                },
            ],
            onFilter: (value, record) => String(record.status).startsWith(value as string),
            filterSearch: true
        },
        {
            title: 'Tổng giá trị đơn hàng',
            key: 'totalPrice',
            dataIndex: "totalPrice",
            render: (totalPrice) => <p>{formatCurrencyVN(totalPrice)}</p>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div style={{ textAlign: "center" }}>
                    {record.status == 2 ?
                        <>
                            <Button
                                style={{ backgroundColor: "lightgreen" }}
                                size="small"
                                type="dashed"
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Xác nhận',
                                        content: 'Vui lòng kiểm tra kỹ trước khi cập nhật trạng thái cho khách hàng',
                                        footer: (_, { OkBtn, CancelBtn }) => (

                                            <div style={{ display: "flex", justifyContent: "right" }}>
                                                <CancelBtn />
                                                <div onClick={() => updateStatus(record)}>
                                                    <OkBtn />
                                                </div>
                                            </div>
                                        ),
                                    });
                                }}
                            >
                                Duyệt
                            </Button>
                            <Button
                                style={{ backgroundColor: "red", color: "white" }}
                                size="small"
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Xác nhận',
                                        content: 'Vui lòng kiểm tra kỹ trước khi cập nhật trạng thái cho khách hàng',
                                        footer: (_, { OkBtn, CancelBtn }) => (

                                            <div style={{ display: "flex", justifyContent: "right" }}>
                                                <CancelBtn />
                                                <div onClick={() => updateStatusCancel(record)}>
                                                    <OkBtn />
                                                </div>
                                            </div>
                                        ),
                                    });
                                }}
                            >
                                Huỷ đơn hàng
                            </Button>
                        </>
                        : <></>
                    }
                    <Button type="primary" size="small" onClick={() => showModal(record.id)}>Xem chi tiết</Button>
                </div>

            ),
        },
    ];
    const columnDetail: TableProps<OrderDetail>['columns'] = [
        {
            title: 'Thời gian bảo hành',
            dataIndex: 'expiredWarranty',
            key: 'expiredWarranty',
            render(value, record, index) {
                return <span>{formatDate(value)}</span>
            },
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render(value, record, index) {
                return (
                    <div>{record.product.name}</div>
                )
            },
        },
        {
            title: 'Giá tiền',
            key: 'price',
            dataIndex: 'price',
            render(value, record, index) {
                return <span>{formatCurrencyVN(value)}</span>
            },
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',

        },

    ];

    const getAllOrder = async () => {
        axios.get(ADMIN.GETALLORDER)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setTotal(res.data.data.totalItems)
                    setData(res.data.data.orders)
                }
            })
    }


    useEffect(() => {
        getAllOrder()
    }, [])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (userId: number) => {
        axios.get(`${ADMIN.GETBYUSERID}/${userId}`)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setOrderdetail(res.data.data)
                }
            })
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onChangeSizePage = (page: number, pageSize: number) => {
        axios.get(`${ADMIN.GETALLORDER}?page=${pageSize}&size=${page}`)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setData(res.data.data.orders)
                }
            })
    }


    return (
        <div style={{ margin: "0px 50px" }}>
            {contextHolder}
            <Modal width={1000} title="Chi tiết đơn hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Table pagination={false} columns={columnDetail} dataSource={orderdetail} />
            </Modal>
            <Table pagination={false} loading={isLoading} columns={columns} dataSource={data} />
            <div style={{ textAlign: "right" }}>
                <Pagination defaultCurrent={1} total={total} onChange={onChangeSizePage} />
            </div>
        </div>
    )

}

export default Order