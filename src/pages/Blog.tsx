import { Button, Image, Modal, Space, Table, TableProps } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react"
import { ADMIN } from "utils/contanst";
import CreateBlogModal from "./CreateBlogs";
import HTMLReactParser from "html-react-parser";


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
    const [openBlog, setOpenBlog] = useState<boolean>(false)

    const [blogdetail, setBlogDetail] = useState<string>("")
    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)


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
            render: (value, record, index) => {
                return HTMLReactParser(value)
            },
        },
        {
            title: 'Ảnh bài viết',
            key: 'imageUrl',
            dataIndex: 'imageUrl',
            render: (value, record, index) => {
                return (
                    <Image src={value} width={200} height={200} style={{ objectFit: "contain" }} />
                )
            },

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
            render: (value, record) => {
                return (
                    <div>
                        <a onClick={() => {
                            getBlogDetail(record.id)
                            setOpenBlog(!openBlog)
                        }
                        }
                        >Xem bài viết</a>
                    </div>
                )
            }
        },
    ];


    const getBlogDetail = (blogid: number) => {
        axios.get(`${ADMIN.GETBLOGDETAIL}/${blogid}`)
            .then((res) => {
                if (res.status === 200) {
                    setBlogDetail(res.data.data.blog.content)
                }
            })
    }

    useEffect(() => {
        setLoading(true)
        axios.get(ADMIN.GETALLBLOG)
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false)
                    setData(res.data.data.blogs)
                }
            })
    }, [])


    return (
        <>
            <Modal width={1000} footer={<></>} title="Bài viết" open={openBlog} onCancel={() => setOpenBlog(!openBlog)}>
                <div>
                    {HTMLReactParser(blogdetail)}
                </div>
            </Modal>
            <Modal footer={<></>} title="Tạo bài viết" open={open} onCancel={() => setOpen(!open)}>
                <CreateBlogModal setOpen={setOpen} />
            </Modal>

            <div style={{ margin: "0px 50px" }}>
                <div style={{ textAlign: "right", margin: "10px 0px" }}>
                    <Button onClick={() => setOpen(!open)} style={{ backgroundColor: "orange", color: "black" }} size="large">Tạo bài viết</Button>
                </div>
                <Table loading={loading} columns={columns} dataSource={data} />
            </div>
        </>
    )
}

export default Blog