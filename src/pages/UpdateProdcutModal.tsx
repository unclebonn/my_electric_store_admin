import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Col, Form, Image, Input, Row, Tag } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { ADMIN } from "utils/contanst"


const UpdateProductModal: React.FC = () => {


    const { id } = useParams()

    const [data, setData] = useState<any>(null)
    const [detail, setDetail] = useState([])
    const [images, setImages] = useState([])


    const getProductDetail = async () => {
        await axios.get(`${ADMIN.DETAILPRODUCT}/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data.products)
                    setDetail(res.data.data.details)
                    setImages(res.data.data.images)
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
        const newData = {
            ...form,
            details: detail
        }

        if (form != null) {
            updateProductDetail(newData)
        }

    }

    useEffect(() => {
        getProductDetail()
    }, [])


    const validateNumber = (_: any, value: any, callback: any) => {
        if (value > 0) {
            callback(); // Giá trị hợp lệ
        } else {
            callback('Số phải lớn hơn 0!'); // Lỗi khi giá trị không hợp lệ
        }
    };
    const validatePrice = (_: any, value: any, callback: any) => {
        if (value > 50000) {
            callback(); // Giá trị hợp lệ
        } else {
            callback('Giá phải lớn hơn 50.000!'); // Lỗi khi giá trị không hợp lệ
        }
    };

    const deleteAttr = (attrName: string) => {
        const filter = detail.filter((attr: any) => attr.name.toLocaleLowerCase() != attrName.toLocaleLowerCase())
        setDetail(filter)
    }

    


    const updateImageDetails = () => {
        // sau khi lay duoc d
    }


    return (
        data != null ?
            <div style={{ margin: 50 }}>
                <h4 style={{ margin: 0, marginRight: 10 }}>Thông tin sản phẩm</h4>
                <Form onFinish={submit}>
                    <Row style={{ justifyContent: "center" }}>
                        <Image
                            src={data.imageUrl}
                            width={800}
                            height={500}
                            style={{ objectFit: "contain" }}

                        />
                    </Row>
                    <Row gutter={[20, 20]}>
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
                                rules={[
                                    { required: true, message: "Vui lòng nhập trường" }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Miêu tả"
                                name="description"
                                initialValue={data.description}
                                rules={[
                                    { required: true, message: "Vui lòng nhập trường" }
                                ]}
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
                                required
                                label="Số lượng"
                                name="quantity"
                                initialValue={data.quantity}
                                rules={[

                                    { validator: validateNumber }
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                required
                                label="Giá"
                                name="price"
                                initialValue={data.price}
                                rules={[

                                    { validator: validatePrice }
                                ]}
                            >
                                <Input type="number" min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Thời gian bảo hành"
                                name="warrantyPeriod"
                                initialValue={data.warrantyPeriod}
                                rules={[
                                    { required: true, message: "Vui lòng nhập trường" }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <h4 style={{ margin: 0, marginRight: 10 }}>Các thuộc tính sản phẩm: </h4>
                                {detail.map((detail: any) => {
                                    return (
                                        <Tag color="blue">{detail.name}: {detail.value}
                                            <span onClick={() => deleteAttr(detail.name)} style={{ cursor: "pointer", marginLeft: 10, color: "red" }}><MinusCircleOutlined /> </span>

                                        </Tag>
                                    )
                                })}
                            </Row>

                        </Col>
                        <Col span={24}>
                            <Row>
                                <h4 style={{ margin: 0, marginRight: 10 }}>Các ảnh chi tiết sản phẩm: </h4>
                                <Row gutter={[20, 20]}>
                                    {images.map((image: any) => {
                                        return (
                                            <Col span={6}>
                                                <Image src={image.url} style={{ objectFit: "contain" }} />
                                            </Col>
                                        )
                                    })}

                                </Row>
                            </Row>
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