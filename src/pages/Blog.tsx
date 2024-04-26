import { Button, Modal, Space, Table, TableProps } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst";
import CreateBlogModal from "./CreateBlogs";


interface Blog {
    id: number,
    title: string,
    content: string,
    imageUrl: string,
    userId: string,
    categoryBlogID: string,
}

const Blog: React.FC = () => {


    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState([])
    const columns: TableProps<Blog>['columns'] = [
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (text) => <a>{text}</a>,
        // },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ảnh bài viết',
            key: 'imageUrl',
            dataIndex: 'imageUrl',

        },
        {
            title: 'Người viết',
            key: 'nameUser',
            dataIndex: "nameUser"
        },
        {
            title: 'Loại bài viết',
            key: 'categoryBlogName',
            dataIndex: "categoryBlogName"
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>View</a>
                    <a>Update</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];


    useEffect(() => {
        axios.get(ADMIN.GETALLBLOG)
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data.blogs)
                }
            })
    }, [])


    return (
        <>
            <Modal footer={<></>} title="Tạo bài viết" open={open} onCancel={() => setOpen(!open)}>
                <CreateBlogModal setOpen={setOpen}/>
            </Modal>
            <div style={{ margin: "0px 50px" }}>
                <div style={{ textAlign: "right", margin: "10px 0px" }}>
                    <Button onClick={() => setOpen(!open)} style={{ backgroundColor: "orange", color: "black" }} size="large">Tạo bài viết</Button>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        </>
    )
}

export default Blog