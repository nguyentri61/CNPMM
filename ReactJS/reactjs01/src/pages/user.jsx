import { notification, Table } from "antd";
import { useEffect, useState } from "react";
import { getUserApi } from "../util/api";

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (res && res.EC === 0 && res.DS) {
                setDataSource(res.DS);
            } else if (res?.message) {
                notification.error({
                    message: "Unauthorized",
                    description: res.message,
                });
            } else {
                notification.error({
                    message: "Error",
                    description: "Failed to fetch users",
                });
            }
        };
        fetchUser();
    }, []);

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
            />
        </div>
    );
};

export default UserPage;