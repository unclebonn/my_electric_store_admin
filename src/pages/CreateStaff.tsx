import { Button, Col, Form, Input, Row, Select } from "antd"
import axios from "axios"
import { toast } from "react-toastify"
import { ADMIN } from "utils/contanst"


interface CreatStaffProps {
    email: string,
    password: string,
    name: string,
    phone: string,
    address: string,
    dateOfBirth: string,
    gender: string,
    status: boolean,
    roleId: number
}


const CreateStaff = (props: any) => {

    const { setOpen } = props

    const formSubmit = (form: CreatStaffProps) => {
        const newData = {
            ...form,
            status: true,
            roleId: 3
        }

        creatStaff(newData)
        setOpen(false)
    }


    const creatStaff = async (form: CreatStaffProps) => {
        await axios.post(`${ADMIN.CREATEUSER}`, form)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Tạo nhân viên thành công")
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            }
            )
    }

    return (
        <Form onFinish={formSubmit}>
            <Row>
                <Col span={24}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Tên nhân viên"
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

                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="Ngày sinh"
                        name="dateOfBirth"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Input type="date" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[
                            { required: true, message: "Vui lòng nhập trường" }
                        ]}
                    >
                        <Select

                            options={[
                                { value: "Male", label: "Nam" },
                                { value: "Female", label: "Nữ" },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: "right" }}>
                    <Button htmlType="submit" type="primary">Tạo</Button>
                </Col>
            </Row>

        </Form>
    )
}

export default CreateStaff