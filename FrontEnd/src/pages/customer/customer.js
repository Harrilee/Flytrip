import React from 'react';
import './main.css';

import { Layout, Menu, Breadcrumb, Row, Col, Dropdown} from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined,DownOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
            </a>
        </Menu.Item>
        <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
);

const Main = () => (
    <Layout className="layout">
        <Header>
            <Row justify={'space-between'}>
                <Col>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <img src={'logo_white.png'} style={{display:'inline'}} height={'50px'}/>
                        <Menu.Item key="1">Purchase Tickets</Menu.Item>
                        <Menu.Item key="2">Upcoming Flight</Menu.Item>
                        <Menu.Item key="3">My Orders</Menu.Item>
                    </Menu>
                </Col>
                <Col>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            Welcome, username  <UserOutlined />
                        </a>
                    </Dropdown>
                </Col>
            </Row>

        </Header>
        <Content style={{ padding: '0 50px', minHeight:'90vh'}}>
            <div className="site-layout-content">
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course Project</Footer>
    </Layout>
);

export default Main;