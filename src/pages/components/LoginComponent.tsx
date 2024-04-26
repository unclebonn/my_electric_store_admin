import { Button, Form, Input } from "antd"
import React from "react"

interface LoginComponentProps {
    onChangeFormLogin: (auth: { email: string, password: string }) => void
}

const LoginComponent: React.FC<LoginComponentProps> = (props) => {

    const { onChangeFormLogin } = props
    return (
        <Form
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onChangeFormLogin}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Vui lòng nhập email" }
                ]}

            >
                <Input placeholder="Email" type="email" />
            </Form.Item>
            <Form.Item

                label="Mật khẩu"
                name="password"
                rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" }
                ]}
            >
                <Input placeholder="Mật khẩu" type="password" autoComplete="current-password" />
            </Form.Item>

            <Button style={{ width: "100%", height: "auto" }} htmlType="submit" size="middle">Đăng nhập</Button>

        </Form>
    )
}

export default LoginComponent