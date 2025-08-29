import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";

const HomePage = () => {
    return (
        <Result
            icon={<CrownOutlined />}
            title="Welcome to Home Page"
        />
    )
}

export default HomePage;