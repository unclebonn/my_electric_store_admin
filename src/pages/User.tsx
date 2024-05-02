import { Button, Modal, Pagination, Space, Table, TableProps, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst";
import CreateStaff from "./CreateStaff";
import { formatDate } from "utils/formatDate";


interface User {
    id: number,
    name: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    avatarUrl: string,
    gender: string,
    status: boolean,
    roleId: number
}

const User: React.FC = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [total, setTotal] = useState<number>()
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState([])
    const columns: TableProps<User>['columns'] = [
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text) => <a>{text}</a>,
        // },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            dataIndex: 'phone',

        },
        {
            title: 'Ngày sinh',
            key: 'dateOfBirth',
            dataIndex: "dateOfBirth",
            render: (value, record, index) => {
                return <span>{formatDate(value)}</span>
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: "status",
            render: (value, record, index) => {
                return (
                    value ? <Tag color="green">Hoạt động</Tag> : <Tag color="black">Không hoạt động</Tag>
                )
            },
        },
        {
            title: 'Giới tính',
            key: 'gender',
            dataIndex: "gender"
        },
        {
            title: 'Vai trò',
            key: 'roleId',
            dataIndex: "roleId",
            render: (value, record, index) => {
                switch (value) {
                    case 1:
                        return <Tag color="red">Admin</Tag>
                    case 2:
                        return <Tag color="orange">Customer</Tag>
                    case 3:
                        return <Tag color="green">Staff</Tag>
                    default:
                        break;
                }
            },
            filters: [
                {
                    text: 'Admin',
                    value: '1',
                },
                {
                    text: 'Staff',
                    value: '3',
                },
                {
                    text: 'Customer',
                    value: '2',
                },
            ],
            onFilter: (value, record) => String(record.roleId).startsWith(value as string),
            filterSearch: true
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Cập nhật</a>
                </Space>
            ),
        },
    ];


    useEffect(() => {
        setIsLoading(true)
        axios.get(ADMIN.GETALLUSER)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setTotal(res.data.data.totalItems)
                    setData(res.data.data.result)
                }
            })
    }, [])

    const onChangeSizePage = (page: number, pageSize: number) => {
        setIsLoading(true)
        axios.get(`${ADMIN.GETALLUSER}?pageNumber=${page}&pageSize=${pageSize}`)
            .then((res) => {
                if (res.status === 200) {
                    setIsLoading(false)
                    setData(res.data.data.result)
                }
            })
    }


    return (
        <>
            <Modal footer={<></>} title="Tạo nhân viên" open={open} onCancel={() => setOpen(!open)}>
                <CreateStaff setOpen={setOpen} />
            </Modal>
            <div style={{ margin: "0px 50px" }}>
                <div style={{ textAlign: "right", margin: "10px 0px" }}>
                    <Button onClick={() => setOpen(!open)} style={{ backgroundColor: "orange", color: "black" }} size="large">Tạo nhân viên</Button>
                </div>
                <Table pagination={false} loading={isLoading} columns={columns} dataSource={data} />
                <div style={{ textAlign: "right" }}>
                    <Pagination defaultCurrent={1} total={total} onChange={onChangeSizePage} />
                </div>
            </div>
        </>
    )
}

export default User