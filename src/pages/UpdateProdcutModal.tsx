import { MinusCircleOutlined } from "@ant-design/icons"
import { Button, Col, Form, Image, Input, Row, Tag } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { ADMIN } from "utils/contanst"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { ImageDB } from "utils/firebase"
import { v4 } from "uuid"



const UpdateProductModal: React.FC = () => {


    const { id } = useParams()

    const [data, setData] = useState<any>(null)
    const [detail, setDetail] = useState<any>([])
    const [images, setImages] = useState<any>([])

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


    const submit = async (form: any) => {
        const newData = {
            ...form,
            details: detail,
            imageDTOs: [...images, ...imageUrlFirebase],
            imageUrl: imagMaineUrlFirebase != "" ? imagMaineUrlFirebase : data.imageUrl
        }

        console.log(newData);

        if (form != null) {
            updateProductDetail(newData)
            setBtnListImage([])
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

    const removeImageExisted = (imageId: number) => {
        const filterImage = images.filter((image: any) => image.id != imageId)
        setImages(filterImage)
    }


    const removeImageExtra = (imageExtraId: number) => {
        const filterImage = [...btnlistImage].filter((image, index) => index != imageExtraId)
        setBtnListImage(filterImage)
    }


    const onChangeImage = (files: any) => {
        if (files != null) {
            setListImage(files)
        }
    }
    const onChangeImageMain = (files: any) => {
        if (files != null) {
            setImageMain(files[0])
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






    return (
        data != null ?
            <div style={{ margin: 50 }}>
                <h4 style={{ margin: 0, marginRight: 10 }}>Thông tin sản phẩm</h4>
                <Form onFinish={submit}>
                    <Row style={{ justifyContent: "center" }}>
                        <Image
                            src={btnimageMain != null ? URL.createObjectURL(btnimageMain) : data.imageUrl}
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
                            >
                                <div style={{ display: "flex" }}>
                                    <input type="file" onChange={(e) => onChangeImageMain(e.target.files)} />
                                    <button type="button" onClick={() => onUploadFirebaseImageMain()}>Cập nhật ảnh mới</button>
                                </div>
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
                            <Row gutter={[20, 20]}>
                                <Col span={7}>
                                    <Row>
                                        <Col span={6}>
                                            <div>Thuộc tính</div>
                                        </Col>
                                        <Col span={18}>
                                            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} />

                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={7}>
                                    <Row>
                                        <Col span={6}>
                                            <div>Giá trị</div>
                                        </Col>
                                        <Col span={18}>
                                            <Input name="value" value={value} onChange={(e) => setValue(e.target.value)} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6}>
                                    <Button onClick={addAttr}>Thêm thuộc tính</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <h4 style={{ margin: 0, marginRight: 10 }}>Các ảnh chi tiết sản phẩm: </h4>
                                        <h5>Ảnh hiện tại</h5>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <Row gutter={[20, 20]}>
                                        {images.map((image: any) => {
                                            return (
                                                <Col span={6} style={{ textAlign: "center" }}>
                                                    <Image width={200} height={200} src={image.url} style={{ objectFit: "contain" }} />
                                                    <div onClick={() => removeImageExisted(image.id)}>
                                                        <span style={{ cursor: "pointer", background: "red", color: "white", display: "inline-block", textAlign: "center", width: "100%" }}>Xoá ảnh</span>
                                                    </div>
                                                </Col>
                                            )
                                        })}

                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <h5>Ảnh thêm ( nếu có )</h5>
                        </Col>
                        <Col span={24}>
                            <Row gutter={[20, 20]}>
                                {btnlistImage?.length > 0 ? [...btnlistImage].map((image: any, index) => {
                                    return (
                                        <Col span={6} style={{ textAlign: "center" }}>
                                            <Image width={200} height={200} src={URL.createObjectURL(image)} style={{ objectFit: "contain" }} />
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
            : <></>

    )
}


export default UpdateProductModal