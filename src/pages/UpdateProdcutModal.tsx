import { Button, Col, Form, Image, Input, Row } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { ADMIN } from "utils/contanst"


const UpdateProductModal: React.FC = () => {


    const { id } = useParams()

    const [data, setData] = useState<any>(null)


    const getProductDetail = async () => {
        await axios.get(`${ADMIN.DETAILPRODUCT}/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data.products)
                }
            })
    }

    const updateProductDetail = async (form: any) => {
        await axios.put(`${ADMIN.UPDATEPRODUCT}`, form)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Cập nhật thành công")
                    getProductDetail()
                }
            })
    }


    const submit = (form: any) => {
        if (form != null) {
            updateProductDetail(form)
        }

    }

    useEffect(() => {
        getProductDetail()
    }, [])




    return (
        data != null ?
            <div style={{ margin: 50 }}>
                <Form onFinish={submit}>
                    <Row style={{justifyContent:"center"}}>
                        <Image
                            src={data.imageUrl}
                            width={800}
                            height={500}
                            style={{ objectFit: "contain" }}

                        />
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Id"
                                name="id"
                                initialValue={data?.id}

                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                initialValue={data.name}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Miêu tả"
                                name="description"
                                initialValue={data.description}
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Ảnh mới (nếu cần)"
                                name="imageUrl"
                                initialValue={data.imageUrl}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="price"
                                name="price"
                                initialValue={data.price}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="quantity"
                                name="quantity"
                                initialValue={data.quantity}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="warrantyPeriod"
                                name="warrantyPeriod"
                                initialValue={data.warrantyPeriod}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ textAlign: "right" }} span={24}>
                            <Button type="primary" htmlType="submit">Cập nhật</Button>
                        </Col>
                    </Row>
                </Form >

            </div>
            : <></>

    )
}


export default UpdateProductModal