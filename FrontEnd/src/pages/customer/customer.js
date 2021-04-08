import React from 'react';
import './customer.css';

import {Layout, Menu, Row, Col, Form, DatePicker, Input, Button, Mentions, Empty, Modal,Descriptions, message } from 'antd';

import {UserOutlined, LogoutOutlined, SearchOutlined, ShoppingCartOutlined} from '@ant-design/icons';

const {Header, Content, Footer} = Layout;

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function Buy(props){
    const [showModal, setShowModal] = React.useState(false)
    function handleCancel(){
        setShowModal(false)
    }
    function handleOk(){
        setShowModal(false)
        fetch('http://localhost:5000/api/purchase', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                airline:props.ticket.airline,
                flight_num: props.ticket.flight_num,
                ticket_type:props.type,
                date:props.ticket.date
            })
        }).then(res => {
            console.log('res',res)
            return res.json()
        }).then(result => {
            if(result.status=='success'){
                message.success('Successfully ordered!')
            }
            if(result.status=='failed'){alert("Purchase failed\n" + result.msg)}
        });
    }
    return(<span>
        <a onClick={(e)=>{
            e.preventDefault();
            setShowModal(true);

        }}>
            <ShoppingCartOutlined style={{margin: '0 10px'}} />
        </a>
            <Modal title={'Please confirm your ticket information'} visible={showModal} onOk={handleOk} onCancel={handleCancel}>
                <Descriptions column={2} bordered={true}>
                    <Descriptions.Item label={'Date'}>{props.ticket.date}</Descriptions.Item>
                    <Descriptions.Item label={'Take off'}>{props.ticket.departure_time}</Descriptions.Item>
                    <Descriptions.Item label={'Departure'} span={2}>{props.ticket.depart_city}, {props.ticket.depart_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Arrival'} span={2}>{props.ticket.arrive_city}, {props.ticket.arrive_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Class'} span={2}>
                        {props.type==='EC'?'Economy class':
                            props.type==='BC'?'Business class':'First Class'}
                    </Descriptions.Item>
                    <Descriptions.Item label={'Price'} span={2}>{props.ticket[props.type+'price']+'￥'}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </span>)
}
function TableTitle() {
    return (
        <div style={{padding: '20px 0 0 0'}}>
            <div className={'ticket_title'}>
                <Row gutter={16}>
                    <Col span={12}>
                    </Col>
                    <Col span={4}>
                        Economy Class
                    </Col>
                    <Col span={4}>
                        Business Class
                    </Col>
                    <Col span={4}>
                        First Class
                    </Col>
                </Row>
            </div>
        </div>
    )
}

function FlightStatus(){
    return(
        <div className={'ticket_title'}>
            <Row gutter={16}>
                <Col span={12}>

                </Col>
                <Col span={4}>

                </Col>
                <Col span={4}>

                </Col>
                <Col span={4}>
                    Flight Status
                </Col>
            </Row>
        </div>
    )
}

function Tickets() {
    const [dataSource, setDataSource] = React.useState([]);
    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <div className="site-layout-content">
                <div style={{margin: 'auto', maxWidth: '1000px'}}>
                    <Form style={{padding: '20px', border: 'lightgrey solid 1px', borderRadius: '2px'}}
                          onFinish={(form) => {
                              let url = 'http://localhost:5000?'
                              url += 'action=getTickets'
                              Object.keys(form).forEach(key => {
                                  url += '&' + key + '=' + form[key]
                              })
                              console.log(url)
                              fetch(url)
                                  .then((resp) => resp.json())
                                  .then(data => {
                                      setDataSource(data.dataSource)
                                  })
                          }}>
                        <Row gutter={32}>
                            <Col span={6}>
                                <Form.Item
                                    name={'date'}
                                    label={"Date"}>
                                    <DatePicker/>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item
                                    name={'from'}
                                    label={"From"}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item
                                    name={'to'}
                                    label={"To"}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify={'end'}>
                            <Col>
                                <Button type={'primary'} onClick={() => {
                                }} icon={<SearchOutlined/>} htmlType={'submit'}>
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                {dataSource==''?<React.Fragment />:
                    dataSource==[]?<Empty style={{margin: '100px 0'}}/>:<TableTitle/>}
                {
                    dataSource.map((d) => {
                        return (
                            <div className={'ticket'} key={d.key}>
                                <Row gutter={16} style={{minHeight: '100px'}} align={'middle'}
                                     justify={'center'}>
                                    <Col span={12}>
                                        <div className={'airports'}>
                                            {d.airline + ' | ' + d.flight_num}
                                        </div>
                                        <div className={'time'}>
                                            <Row align={'space-around'}>
                                                <Col span={11} style={{textAlign: 'right'}}>
                                                    {d.departure_time}
                                                </Col>
                                                <Col span={2}>

                                                </Col>
                                                <Col span={11} style={{textAlign: 'left'}}>
                                                    {d.arrival_time}
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={'airports'}>
                                            <Row align={'middle'} justify={'bottomCenter'}>
                                                <Col span={11} style={{textAlign: 'right'}}>
                                                    {d.depart_airport}
                                                </Col>
                                                <Col span={2}>
                                                    <div style={{
                                                        borderBottom: 'black solid 0.5px',
                                                        transform: 'translateY(2px)',
                                                        margin: '0 10px'
                                                    }}/>
                                                </Col>
                                                <Col span={11} style={{textAlign: 'left'}}>
                                                    {d.arrive_airport}
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={"duration"}>
                                            {d.durationHour + 'h ' + d.durationMin + 'min'}
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        {d.ECSellable === true ?
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.ECprice)}
                                                <Buy type={'EC'} ticket={d}/>
                                            </div>
                                            :
                                            <div className={'price_sold_out'}>
                                                {'￥' + formatNumber(d.ECprice)}
                                            </div>
                                        }
                                    </Col>
                                    <Col span={4}>
                                        {d.BCSellable === true ?
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.BCprice)}
                                                <Buy type={'BC'} ticket={d}/>
                                            </div>
                                            :
                                            <div className={'price_sold_out'}>
                                                {'￥' + formatNumber(d.BCprice)}
                                            </div>
                                        }
                                    </Col>
                                    <Col span={4}>
                                        {d.FCSellable === true ?
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.FCprice)}
                                                <Buy type={'FC'} ticket={d}/>
                                            </div>
                                            :
                                            <div className={'price_sold_out'}>
                                                {'￥' + formatNumber(d.FCprice)}
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        )
                    })
                }
            </div>
        </Content>
    )
}

function UpcomingFlights() {
    const [dataSource, setDataSource] = React.useState([])
    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <div className="site-layout-content">
                <div style={{margin: 'auto', maxWidth: '1000px'}}>
                    <Form style={{padding: '20px', border: 'lightgrey solid 1px', borderRadius: '2px'}}
                          onFinish={(form) => {
                              let url = 'http://localhost:5000?'
                              url += 'action=getStatus'
                              Object.keys(form).forEach(key => {
                                  url += '&' + key + '=' + form[key]
                              })
                              console.log(url)
                              fetch(url)
                                  .then((resp) => resp.json())
                                  .then(data => {
                                      setDataSource(data.dataSource)
                                  })
                          }}>
                        <Row gutter={32} justify={'end'}>
                            <Col span={10}>
                                <Form.Item
                                    name={'flight_num'}
                                    label={"Flight Number"}>
                                    <Input/> {/*todo 后面这些input全部改成mentions，随时返回提示*/}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    name={'airline'}
                                    label={"Airline"}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Button type={'primary'} onClick={() => {
                                }} icon={<SearchOutlined/>} htmlType={'submit'}>
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div style={{padding: '20px'}}>
                    {dataSource==''?<React.Fragment />:
                        dataSource==[]?<Empty style={{margin: '100px 0'}}/>:<FlightStatus/>}
                    {
                        dataSource.map((d) => {
                            return (
                                <div className={'ticket'} key={d.key}>
                                    <Row gutter={16} style={{minHeight: '100px'}} align={'middle'}
                                         justify={'center'}>
                                        <Col span={12}>
                                            <div className={'airports'}>
                                                {d.airline + ' | ' + d.flight_num}
                                            </div>
                                            <div className={'time'}>
                                                <Row align={'space-around'}>
                                                    <Col span={11} style={{textAlign: 'right'}}>
                                                        {d.departure_time}
                                                    </Col>
                                                    <Col span={2}>
                                                    </Col>
                                                    <Col span={11} style={{textAlign: 'left'}}>
                                                        {d.arrival_time}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={'airports'}>
                                                <Row align={'middle'} justify={'bottomCenter'}>
                                                    <Col span={11} style={{textAlign: 'right'}}>
                                                        {d.depart_airport}
                                                    </Col>
                                                    <Col span={2}>
                                                        <div style={{
                                                            borderBottom: 'black solid 0.5px',
                                                            transform: 'translateY(2px)',
                                                            margin: '0 10px'
                                                        }}/>
                                                    </Col>
                                                    <Col span={11} style={{textAlign: 'left'}}>
                                                        {d.arrive_airport}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={"duration"}>
                                                {d.durationHour + 'h ' + d.durationMin + 'min'}
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={'price'}>

                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={'price'}>

                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={d.status}>
                                                {d.status}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Content>
    )

}

function Customer(props) {
    const [mainMenu, setMainMenu] = React.useState('tickets')

    return (
        <React.Fragment>
            <Layout className="layout">
                <Header>
                    <Row justify={'space-between'}>
                        <Col>
                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[mainMenu]} onClick={e => {
                                setMainMenu(e.key)
                            }}>
                                <img src={'logo_white.png'} style={{display: 'inline'}} height={'50px'}/>
                                <Menu.Item key="tickets">Tickets</Menu.Item>
                                <Menu.Item key="upcoming_flights">Upcoming Flights</Menu.Item>
                            </Menu>
                        </Col>
                        <Col>

                            <span style={{color: 'rgb(166, 173, 180)',display:'inline-block'}}>Welcome, {props.username} <UserOutlined/>&nbsp;&nbsp; |&nbsp;&nbsp; </span>
                            <span><a className="ant-dropdown-link" onClick={e => {
                                e.preventDefault();
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
                                    if(result.status=='success'){
                                        props.setUserType('login');
                                    }
                                    if(result.status=='failed'){alert("logout failed.\n" + result.msg)}
                                });


                            }}>
                                Logout <LogoutOutlined />
                            </a></span>
                        </Col>
                    </Row>
                </Header>
                {mainMenu == 'tickets' ? <Tickets/> : <React.Fragment/>}
                {mainMenu == 'upcoming_flights' ? <UpcomingFlights/> : <React.Fragment/>}
                <Footer style={{textAlign: 'center'}}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course
                    Project</Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Customer;