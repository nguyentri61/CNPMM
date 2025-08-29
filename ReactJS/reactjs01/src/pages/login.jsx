import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context";
import { loginApi } from "../util/api";

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginApi(email, password);
        console.log("response: ", res);

        if (res && res.EC === 0) {
            localStorage.setItem("access_token", res.token);
            // Lưu thông tin user vào localStorage để sử dụng sau này
            localStorage.setItem("user_email", res?.user?.email ?? "");
            localStorage.setItem("user_name", res?.user?.name ?? "");

            notification.success({
                message: "LOGIN USER",
                description: "Success",
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? "",
                },
            });
            navigate("/");
        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "Error",
            });
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Đăng nhập</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
                            <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default LoginPage;