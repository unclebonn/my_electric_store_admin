import { Button, Col, Form, Image, Input, Row, Select, Tag } from "antd"
import axios from "axios"
import React, { ChangeEvent, useEffect, useState } from "react"
import { ADMIN } from "utils/contanst"

import { MinusCircleOutlined } from "@ant-design/icons"
import { toast } from "react-toastify"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ImageDB } from "utils/firebase"
import { v4 } from "uuid"
import { useForm } from "antd/lib/form/Form"



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

    const [form] = useForm()

    const { setOpen, setTotal, setData } = props


    const [volt, setVolt] = useState<string>("")
    const [watt, setWatt] = useState<string>("")

    const [categories, setCategories] = useState<{ categoryID: number, categoryName: string, product: null }[]>([])

    /////////////////////////////////////////////
    const [detail, setDetail] = useState<any>([])

    //image main
    const [imageMain, setImageMain] = useState<any>(null)
    const [btnimageMain, setBtnImageMain] = useState<any>(null)


    //attribute
    const [name, setName] = useState("")
    const [value, setValue] = useState("")

    //firebase
    const [listImage, setListImage] = useState([])
    const [btnlistImage, setBtnListImage] = useState([])
    const [imageUrlFirebase, setImageUrlFirebase] = useState<{ url: string }[]>([])
    const [imagMaineUrlFirebase, setImageMainUrlFirebase] = useState<string>("")


    const submit = async (form: any) => {

        const voltandwatt = [
            {
                name: "Volt", value: volt
            },
            {
                name: "Watt", value: watt
            }
        ]

        const newDetail = [...voltandwatt, ...detail]

        const newData = {
            ...form,
            details: newDetail,
            imageDTOs: [...imageUrlFirebase],
            imageUrl: imagMaineUrlFirebase
        }


        createProduct(newData)


    }

    const createProduct = async (formSubmit: ProductProps) => {
        axios.post(`${ADMIN.CREATEPRODUCT}`, formSubmit)
            .then((res) => {
                if (res.status === 201) {
                    form.resetFields()
                    setBtnListImage([])
                    setBtnImageMain(null)
                    setDetail([])
                    toast.success("Tạo sản phẩm thành công")
                    getAllProduct()
                    setOpen(false)
                }
            })
            .catch((error) => {
                toast.error("Lỗi tạo sản phẩm")
            })
    }




    const deleteAttr = (attrName: string) => {
        const filter = detail.filter((attr: any) => attr.name.toLocaleLowerCase() != attrName.toLocaleLowerCase())
        setDetail(filter)
    }


    const addAttr = () => {
        const newAttribute = {
            // "id": 0,
            "name": name,
            "value": value
        }

        setDetail(((detail: any) => [...detail, newAttribute]))
        setName("")
        setValue("")

    }



    const removeImageExtra = (imageExtraId: number) => {
        const filterImage = [...btnlistImage].filter((image, index) => index != imageExtraId)
        setBtnListImage(filterImage)
        setImageUrlFirebase(filterImage)
    }


    const onChangeImage = (files: any) => {
        if (files != null) {
            setListImage(files)
        }
    }

    const onUploadFirebaseImageMain = async () => {
        if (imageMain == null) {
            toast.error("Vui lòng chọn ảnh để cập nhật")
        } else {
            setBtnImageMain(imageMain);
            const imageRef = ref(ImageDB, `files/${v4()}`)
            uploadBytes(imageRef, imageMain)
                .then((res) => {
                    getDownloadURL(res.ref).then((downloadUrl) => {
                        setImageMainUrlFirebase(downloadUrl)
                    })
                })

        }


    }
    const onUploadFirebaseImages = async () => {
        if (listImage.length == 0) {
            toast.error("Vui lòng chọn ảnh để cập nhật")
        } else {
            setBtnListImage(listImage);
            [...listImage].map((image, index) => {
                const imageRef = ref(ImageDB, `files/${v4()}`)
                uploadBytes(imageRef, image)
                    .then((res) => {
                        getDownloadURL(res.ref).then((downloadUrl) => {
                            setImageUrlFirebase(((imageUrlFirebase) => {

                                return [...imageUrlFirebase, { url: downloadUrl }]

                            }
                            ))
                        })
                    })
            })
        }


    }

    // categories api
    const getAllCategories = async () => {
        await axios.get(`${ADMIN.GETALLCATEGORIES}`)
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data.data)
                }
            })
    }

    const getAllProduct = async () => {
        axios.get(ADMIN.GETALLPRODUCT)
            .then((res) => {
                if (res.status === 200) {
                    setTotal(res.data.data.totalItems)
                    setData(res.data.data.products)
                }
            })
    }



    const onChangeVolt = (e: any) => {
        const volt = e.target.value
        setVolt(volt)
    }
    const onChangeWatt = (e: any) => {
        const watt = e.target.value
        setWatt(watt)
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

    const onChangeImageMain = (files: FileList | null) => {
        if (files != null) {
            setImageMain(files[0])
        }

    }

    useEffect(() => {
        getAllCategories()
    }, [])
    return (
        // <div>
        //     <Form onFinish={onSubmit}>
        //         <Row>
        //             <Col span={24}>
        //                 <Form.Item
        //                     label="Tên sản phẩm"
        //                     name="name"
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Input />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     label="Miêu tả"
        //                     name="description"
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Input.TextArea />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     required
        //                     label="Ảnh"
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <input type="file" onChange={(e) => onChangeImageMain(e.target.files)} />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 {image != undefined
        //                     ? < Image
        //                         width={"100%"}
        //                         height={"200px"}
        //                         style={{ objectFit: "contain" }}
        //                         src={URL.createObjectURL(image)}
        //                     />
        //                     : <></>
        //                 }
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     required
        //                     label="Số lượng"
        //                     name="quantity"
        //                     rules={[

        //                         { validator: validateNumber }
        //                     ]}
        //                 >
        //                     <Input type="number" />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     required
        //                     label="Giá"
        //                     name="price"
        //                     rules={[

        //                         { validator: validatePrice }
        //                     ]}
        //                 >
        //                     <Input type="number" min={0} />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     label="Loại gia dụng"
        //                     name="categoryID"
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Select
        //                         options={categories.map((category) => {
        //                             return {
        //                                 value: category.categoryID,
        //                                 label: category.categoryName
        //                             }
        //                         })}
        //                     />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={24}>
        //                 <Form.Item
        //                     label="Thời gian bảo hành"
        //                     name="warrantyPeriod"
        //                     rules={[
        //                         { required: true, min: 0, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Input type="number" />
        //                 </Form.Item>
        //             </Col>
        //         </Row>
        //         <Row gutter={[20, 0]}>
        //             <Col span={12}>
        //                 <Form.Item
        //                     label="Volt"
        //                     required
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Input type="number" onChange={onChangeVolt} />
        //                 </Form.Item>
        //             </Col>
        //             <Col span={12}>
        //                 <Form.Item
        //                     label="Watt"
        //                     required
        //                     rules={[
        //                         { required: true, message: "Vui lòng nhập trường" }
        //                     ]}
        //                 >
        //                     <Input type="number" onChange={onChangeWatt} />
        //                 </Form.Item>
        //             </Col>

        //         </Row>
        //         <div>
        //             <div style={{ boxSizing: "border-box", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>

        //                 <div>
        //                     <label htmlFor="">Thuộc tính: </label>
        //                     <Input value={name} style={{ width: 100 }} onChange={onChangeName} />
        //                 </div>
        //                 <div>
        //                     <label htmlFor="">Giá trị: </label>
        //                     <Input value={value} style={{ width: 100 }} onChange={onChangeValue} />
        //                 </div>

        //                 <Button onClick={addAttibute} type="default">Thêm thuộc tính</Button>
        //             </div>


        //             <div>
        //                 <div style={{ margin: "20px 0px", display: "flex", flexWrap: "wrap" }}>
        //                     {detail.length > 0 ?
        //                         detail.map((attr) => {
        //                             return (
        //                                 <div>
        //                                     <Tag color="blue">{attr.name}: {attr.value}
        //                                         <span onClick={() => deleteAttr(attr.name)} style={{ paddingLeft: 10, color: "red", cursor: "pointer" }} ><MinusCircleOutlined /></span>
        //                                     </Tag>
        //                                 </div>
        //                             )
        //                         })
        //                         :
        //                         <></>
        //                     }
        //                 </div>
        //             </div>
        //         </div>
        //         <div style={{ textAlign: "right" }}>
        //             <Button htmlType="submit" type="default">Tạo sản phẩm</Button>
        //         </div>
        //     </Form >
        // </div >
        <div >
            <Form form={form} style={{ maxHeight: 600, overflowY: "scroll" }} onFinish={submit}>
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
                        <Form.Item
                            label="Loại gia dụng"
                            name="categoryID"
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Select
                                options={categories.map((cate) => {
                                    return {
                                        label: cate.categoryName,
                                        value: cate.categoryID
                                    }
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            required
                            label="Ảnh mới"
                        >
                            <div style={{ display: "flex" }}>
                                <input type="file" onChange={(e) => onChangeImageMain(e.target.files)} />
                                <button type="button" onClick={() => onUploadFirebaseImageMain()}>Cập nhật ảnh mới</button>
                            </div>
                        </Form.Item>
                        <Row style={{ justifyContent: "center" }}>
                            {btnimageMain != null ?
                                <>
                                    <Image
                                        src={btnimageMain != null ? URL.createObjectURL(btnimageMain) : ""}
                                        width={200}
                                        height={200}
                                        style={{ objectFit: "contain" }}

                                    />
                                </>
                                : <></>
                            }
                        </Row>
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
                            label="Thời gian bảo hành"
                            name="warrantyPeriod"

                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[20, 0]}>
                            <Col span={12}>
                                <Form.Item
                                    required
                                    label="Volt"
                                >
                                    <Input type="number" onChange={onChangeVolt} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    required
                                    label="Watt"
                                >
                                    <Input type="number" onChange={onChangeWatt} />
                                </Form.Item>
                            </Col>
                        </Row>
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
                    <Col span={24} style={{ marginTop: 10 }}>
                        <Row>
                            <Col span={10}>
                                <Row>
                                    <Col span={10}>
                                        <div>Thuộc tính</div>
                                    </Col>
                                    <Col span={14}>
                                        <Input name="name" value={name} onChange={(e) => setName(e.target.value)} />

                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={6}>
                                        <div>Giá trị</div>
                                    </Col>
                                    <Col span={14}>
                                        <Input name="value" value={value} onChange={(e) => setValue(e.target.value)} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={4}>
                                <Button onClick={addAttr}>Thêm thuộc tính</Button>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <Row>
                    <Col span={24}>
                        <h5>Ảnh thêm</h5>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[20, 20]}>
                            {btnlistImage?.length > 0 ? [...btnlistImage].map((image: any, index) => {
                                return (
                                    <Col span={6} style={{ textAlign: "center" }}>
                                        <Image width={150} height={150} src={URL.createObjectURL(image)} style={{ objectFit: "contain" }} />
                                        <div onClick={() => removeImageExtra(index)}>
                                            <span style={{ cursor: "pointer", background: "red", color: "white", display: "inline-block", textAlign: "center", width: "100%" }}>Xoá ảnh</span>
                                        </div>
                                    </Col>
                                )
                            })
                                : <></>
                            }
                        </Row>
                    </Col>
                    <Col span={24} style={{ marginTop: 20 }}>
                        <Row>
                            <input type="file" multiple onChange={(e) => onChangeImage(e.target.files)} />
                            <button type="button" onClick={onUploadFirebaseImages}>Cập nhật hình ảnh</button>
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
    )
}

export default CreateProductModal