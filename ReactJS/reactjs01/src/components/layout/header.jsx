import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(">>> check auth: ", auth);

    const items = [
        {
            label: <Link to="/">Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />
        },
        ...(auth.isauthenticated ? [
            {
                label: <Link to="/profile">Profile</Link>,
                key: 'user',
                icon: <UsergroupAddOutlined />
            }] : []),
        {
            label: 'Welcome, ' + (auth.user ? auth.user.name : 'Guest'),
            key: 'subMenu',
            icon: <SettingOutlined />,
            children: auth.isauthenticated ? [
                {
                    label: <span onClick={() => {
                        localStorage.clear("access_token");
                        setCurrent("home");
                        setAuth(
                            {
                                isauthenticated: false,
                                user: {
                                    email: "",
                                    name: ""
                                }
                            }
                        );
                        navigate("/");
                    }}>Logout</span>,
                    key: 'logout'
                }
            ] : [
                {
                    label: <Link to="/login">Login</Link>,
                    key: 'login'
                },
            ],
        }

    ]
    const [current, setCurrent] = useState('home');

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    );
};

export default Header;