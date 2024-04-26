import { Button, Col, Input, Modal, Pagination, Row, Space, Table, TableProps } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ADMIN } from "utils/contanst"
import { formatCurrencyVN } from "utils/formatCurrency"
import UpdateProductModal from "./UpdateProdcutModal"
import CreateProductModal from "./CreateProductModal"


interface DataType {
    id: string;
    name: string;
    description: number;
    imageUrl: string;
    quantity: number;
    price: number,
    categoryID: number
}

const Product: React.FC = () => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)

    const [total, setTotal] = useState<number>(0)


    const onChangeSizePage = (page: number, pageSize: number) => {
        axios.get(`${ADMIN.GETALLPRODUCT}?size=${pageSize}&page=${page}`)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setData(res.data.data.products)
                }
            })
    }
    const findProduct = (e: any) => {
        const name = e.target.value
        if (name == "") {
            axios.get(ADMIN.GETALLPRODUCT)
                .then((res) => {
                    if (res.status === 200) {
                        setIsLoading(false)
                        setTotal(res.data.data.totalItems)
                        setData(res.data.data.products)
                    }
                })
        } else {
            axios.get(`${ADMIN.SEARCHBYNAMEPRODUCT}/${name}?page=${1}&size=${10}`)
                .then((res) => {
                    if (res.status === 200) {
                        setIsLoading(false)
                        setTotal(res.data.data.totalItems)
                        setData(res.data.data.products)
                    }
                })
        }
    }

    const toggleModal = (record: any) => {
        navigate(`detail/${record.id}`)
    }

    const columns: TableProps<DataType>['columns'] = [
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text) => <a>{text}</a>,
        // },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Miêu tả',
            key: 'description',
            dataIndex: 'description',
            render: (description) => (
                <div style={{ height: "100px", overflowY: "auto" }}>{description}</div>
            )
        },
        {
            title: 'Ảnh sản phẩm',
            key: 'imageUrl',
            dataIndex: 'imageUrl',
            render: (imageUrl) => (
                <img width={"200px"} height={"200px"} style={{ objectFit: "contain" }} src={imageUrl} alt="image" />
            )

        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: "quantity",

        },
        {
            title: 'Giá',
            key: 'price',
            dataIndex: "price",
            render: (value, record, index) => (
                <span>{formatCurrencyVN(value)}</span>
            ),
        },
        {
            title: "Thao tác",
            key: 'action',
            render: (_, record) => (
                <>
                    <Button size="small" onClick={() => toggleModal(record)} type="primary">Xem chi tiết</Button>
                    <Button size="small" style={{ backgroundColor: "red", color: "white" }}>Xoá sản phẩm</Button>
                </>
            ),
        },
    ];


    useEffect(() => {
        setIsLoading(true)
        axios.get(ADMIN.GETALLPRODUCT)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setTotal(res.data.data.totalItems)
                    setData(res.data.data.products)
                }
            })
    }, [])



    return (
        <>
            <Modal footer={<></>} title="Thêm sản phẩm" open={open} onCancel={() => setOpen(!open)}>
                <CreateProductModal setOpen={setOpen} />
            </Modal>
            <div style={{ margin: "0px 50px" }}>
                <div style={{ textAlign: "right", margin: "10px 0px" }}>
                    <Button onClick={() => setOpen(!open)} style={{ backgroundColor: "orange", color: "black" }} size="large">Thêm sản phẩm</Button>
                </div>
                <div style={{ display: "flex" }}>
                    <div>Tìm kiếm: </div><Input onChange={findProduct} placeholder="Tìm kiếm sản phẩm"></Input>
                </div>
                <Table pagination={false} loading={isLoading} columns={columns} dataSource={data} />
                <div style={{ textAlign: "right", margin: 20 }}>
                    <Pagination defaultCurrent={1} onChange={onChangeSizePage} total={total} />
                </div>
            </div>
        </>
    )
}


export default Product