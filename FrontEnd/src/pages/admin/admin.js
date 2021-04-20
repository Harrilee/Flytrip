import React from 'react';
import './admin.css';

import {Layout, Typography, Button, message} from 'antd';
import {ImportOutlined, DeleteOutlined,RollbackOutlined} from '@ant-design/icons';

const {Content, Footer} = Layout
const {Text} = Typography;

function Admin(props) {

    return (
        <div className="App">
            <div style={{
                width: '100%',
                height: "100vh",
                background: "linear-gradient(to bottom, #e6f7ff, #c9edff)",
                position: "absolute",
                zIndex: -1
            }}>
            </div>
            <Layout>
                <Content>
                    <div style={{
                        position: 'absolute',
                        bottom: '55%',
                        left: '50%',
                        transform: 'translate(-50%,40%)',
                        width: "450px",
                        padding: '10px',
                        transition: '1s'
                    }}>
                        <img src={'./logo_white.png'} width={'180px'} style={{
                            transform: "translate(0,-70%)"
                        }} alt={'logo'}></img>

                        <div>
                            <Button className={'button'} type={'primary'} size={'large'} onClick={()=>{
                                fetch('http://localhost:5000/api/admin/import_data', {
                                    mode: 'cors',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'include',//add cookie
                                    body: JSON.stringify({})
                                }).then(res => {
                                    console.log('res',res)
                                    return res.json()
                                }).then(result => {
                                    if(result.status==='success'){
                                        message.success('Data imported successfully');
                                    }
                                    if(result.status==='failed'){message.error("Import failed.\n" + result.msg)}
                                });
                            }}><ImportOutlined />Import test data</Button>
                        </div>
                        <div>
                            <Button className={'button'} type={'primary'} size={'large'} danger onClick={()=>{
                                fetch('http://localhost:5000/api/admin/clear', {
                                    mode: 'cors',
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'include',//add cookie
                                    body: JSON.stringify({})
                                }).then(res => {
                                    console.log('res',res)
                                    return res.json()
                                }).then(result => {
                                    if(result.status==='success'){
                                        message.success('Data cleared successfully');
                                    }
                                    if(result.status==='failed'){message.error("Clear data failed.\n" + result.msg)}
                                });
                            }}><DeleteOutlined />Clear all data</Button>
                        </div>
                        <div>
                            <Button className={'button'} size={'large'} onClick={
                                ()=> {
                                    fetch('http://localhost:5000/auth/logout', {
                                        mode: 'cors',
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'include',
                                        body: JSON.stringify({})
                                    }).then(res => {
                                        return res.json()
                                    }).then(result => {
                                        if (result.status === 'success') {
                                            props.setUserType('login');
                                        }
                                        if (result.status === 'failed') {
                                            alert("logout failed.\n" + result.msg)
                                        }
                                    });
                                }
                            }><RollbackOutlined />Return to login</Button>
                        </div>



                    </div>
                </Content>
                <Footer style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}>
                    <Text>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course Project</Text>
                </Footer>
            </Layout>
        </div>
    )
}

export default Admin;