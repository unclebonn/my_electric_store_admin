import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { Button, Col, Form, Input, Modal, Row, Select } from "antd"
import axios from "axios"
import EditorContent from "ckeditor/components/Editor"
import HTMLReactParser from "html-react-parser"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Cookies from "universal-cookie"
import { ADMIN } from "utils/contanst"

interface BlogProps {
    title: string,
    content: string,
    imageUrl: string,
    userId: 0,
    categoryBlogID: 0
}

const CreateBlogModal = (props: any) => {

    const { setOpen } = props


    const [editor, setEditor] = useState("")
    const [categoryBlog, setCategoryBlog] = useState([])
    const cookie = new Cookies()
    const account = cookie.get("information")

    const formSubmit = (form: BlogProps) => {
        const newForm = { ...form, content: editor, userId: account.id }
        createblog(newForm)
        setOpen(false)
    }

    const categoryStaff = async () => {
        await axios.get(`${ADMIN.GETALLCATEGORYBLOG}`)
            .then((res) => {
                if (res.status === 200) {
                    setCategoryBlog(res.data.data)
                }
            })
            .catch((error) => {
                console.log(error);
            }
            )
    }


    const createblog = async (form: BlogProps) => {
        await axios.post(`${ADMIN.CREATEBLOG}`, form)
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Tạo thành công")
                }
            })
            .catch((error) => {
                toast.error("Tạo thất bại")

            }
            )
    }

    useEffect(() => {
        categoryStaff()
    }, [])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal width={1500} style={{maxHeight:700, overflowY:"scroll"}} title="Bài viết" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {HTMLReactParser(editor)}
            </Modal>
            <Form onFinish={formSubmit}>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Hình ảnh"
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
                            label="Loại bài viết"
                            name="categoryBlogID"
                            rules={[
                                { required: true, message: "Vui lòng nhập trường" }
                            ]}
                        >
                            <Select
                                options={categoryBlog.map((category: any) => {
                                    return {
                                        value: category.id,
                                        label: category.name
                                    }
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col style={{ margin: 10 }} span={24}>
                        <Button onClick={() => setIsModalOpen(true)}>Xem thử bài viết</Button>
                    </Col>
                    <Col span={24} style={{ maxHeight: "400px", overflowY: "scroll" }}>
                        <CKEditor
                            editor={ClassicEditor}
                            data="<p>Hello from CKEditor&nbsp;5!</p>"
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData()
                                setEditor(data)
                            }}
                            onBlur={(event, editor) => {
                                console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                console.log('Focus.', editor);
                            }}
                        />
                    </Col>

                </Row>
                <div style={{ textAlign: "right" }}>
                    <Button style={{ marginTop: 15 }} type="primary" htmlType="submit">Tạo</Button>
                </div>
            </Form>
        </>
    )

}

export default CreateBlogModal