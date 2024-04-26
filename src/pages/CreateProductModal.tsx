import { Button, Col, Form, Input, Row, Select, Tag } from "antd"
import axios from "axios"
import React, { ChangeEvent, useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"

import { MinusCircleOutlined } from "@ant-design/icons"
import { toast } from "react-toastify"



interface ProductProps {
    name: string,
    description: string,
    imageUrl: string,
    quantity: 0,
    price: 0,
    categoryID: 0,
    details:
    {
        name: string,
        value: string
    }[]
    ,
    imageDTOs:
    {
        url: string
    }[]

}


const CreateProductModal: React.FC<any> = (props) => {

    const {setOpen} = props


    const [volt, setVolt] = useState<string>("")
    const [watt, setWatt] = useState<string>("")



    const [name, setName] = useState<string>("")
    const [value, setValue] = useState<string>("")

    const [detail, setDetail] = useState<{ name: string, value: string }[]>([])
    const [categories, setCategories] = useState<{ categoryID: number, categoryName: string, product: null }[]>([])

    // categories api
    const getAllCategories = async () => {
        await axios.get(`${ADMIN.GETALLCATEGORIES}`)
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data.data)
                }
            })
    }


    const addAttibute = () => {
        if (name == "" || value == "") {

        } else {
            setDetail((detail) => [...detail, { name: name, value: value }])
            setName("")
            setValue("")
        }
    }

    const onChangeVolt = (e: any) => {
        const volt = e.target.value
        setVolt(volt)
    }
    const onChangeWatt = (e: any) => {
        const watt = e.target.value
        setWatt(watt)
    }

    const onChangeName = (e: any) => {
        const name = e.target.value
        setName(name)
    }
    const onChangeValue = (e: any) => {
        const value = e.target.value
        setValue(value)
    }


    const deleteAttr = (attrName: string) => {
        const filter = detail.filter((attr) => attr.name.toLocaleLowerCase() != attrName.toLocaleLowerCase())
        setDetail(filter)
    }






    const createProduct = async (form: ProductProps) => {
        await axios.post(`${ADMIN.CREATEPRODUCT}`, form)
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Tạo sản phẩm thành công")
                }
            })
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    const onSubmit = (form: ProductProps) => {
        const voltandwatt = [
            {
                name: "Volt", value: volt
            },
            {
                name: "Watt", value: watt
            }
        ]

        const newDetail = [...voltandwatt, ...detail]

        const submitForm = {
            ...form, details: newDetail, imageDTOs: [
                {
                    url: "https://chupanh.vn/wp-content/uploads/2017/04/cach-chup-anh-do-gia-dung-dep.jpg"
                }
            ]
        };

        createProduct(submitForm)
        setOpen(false)

    }


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

    return (
        <div>
            <Form onFinish={onSubmit}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Tên sản phẩm"
                            name="name"
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
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Ảnh (đường link)"
                            name="imageUrl"
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            required
                            label="Số lượng"
                            name="quantity"
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
                            rules={[

                                { validator: validatePrice }
                            ]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Loại gia dụng"
                            name="categoryID"
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Select
                                options={categories.map((category) => {
                                    return {
                                        value: category.categoryID,
                                        label: category.categoryName
                                    }
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Thời gian bảo hành"
                            name="warrantyPeriod"
                            rules={[
                                { required: true, min: 0, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[20, 0]}>
                    <Col span={12}>
                        <Form.Item
                            label="Volt"
                            required
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input type="number" onChange={onChangeVolt} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Watt"
                            required
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input type="number" onChange={onChangeWatt} />
                        </Form.Item>
                    </Col>

                </Row>
                <div>
                    <div style={{ boxSizing: "border-box", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>

                        <div>
                            <label htmlFor="">Thuộc tính: </label>
                            <Input value={name} style={{ width: 100 }} onChange={onChangeName} />
                        </div>
                        <div>
                            <label htmlFor="">Giá trị: </label>
                            <Input value={value} style={{ width: 100 }} onChange={onChangeValue} />
                        </div>

                        <Button onClick={addAttibute} type="default">Thêm thuộc tính</Button>
                    </div>


                    <div>
                        <div style={{ margin: "20px 0px", display: "flex", flexWrap: "wrap" }}>
                            {detail.length > 0 ?
                                detail.map((attr) => {
                                    return (
                                        <div>
                                            <Tag color="blue">{attr.name}: {attr.value}
                                                <span onClick={() => deleteAttr(attr.name)} style={{ paddingLeft: 10, color: "red", cursor: "pointer" }} ><MinusCircleOutlined /></span>
                                            </Tag>
                                        </div>
                                    )
                                })
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
                <Button htmlType="submit" type="default">Tạo sản phẩm</Button>
            </Form >
        </div >
    )
}

export default CreateProductModal