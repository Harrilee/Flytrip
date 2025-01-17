import React from 'react';
import './agent.css';

import {
    Layout, Menu, Row, Col, Form, DatePicker, Input, Button,
    Mentions, Empty, Modal, Descriptions, message, Card, Statistic, Popover
} from 'antd';

import {
    UserOutlined, LogoutOutlined, SearchOutlined, ShoppingCartOutlined, ContactsOutlined
} from '@ant-design/icons';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from "moment";

const {Header, Content, Footer} = Layout;

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function Buy(props) {
    const [showModal, setShowModal] = React.useState(false)

    function handleCancel() {
        setShowModal(false)
    }

    function handleOk() {
        if (document.getElementById('customerEmail').value === '') {
            message.error("Customer email cannot be empty!")
            return
        }
        fetch('http://localhost:5000/api/purchase', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                airline: props.ticket.airline,
                flight_num: props.ticket.flight_num,
                ticket_type: props.type,
                date: props.ticket.date,
                email: document.getElementById('customerEmail').value
            })
        }).then(res => {
            console.log('res', res)
            return res.json()
        }).then(result => {
            if (result.status === 'success') {
                setShowModal(false)
                message.success('Successfully ordered!')
            }
            if (result.status === 'failed') {
                message.error("Purchase failed\n" + result.msg)
            }
        });
    }

    return (<span>
        <a onClick={(e) => {
            e.preventDefault();
            setShowModal(true);

        }}>
            <ShoppingCartOutlined style={{margin: '0 10px'}}/>
        </a>
            <Modal title={'Please confirm your ticket information'} visible={showModal} onOk={handleOk}
                   onCancel={handleCancel}>
                <Descriptions column={2} bordered={true}>
                    <Descriptions.Item label={'Date'}>{props.ticket.date}</Descriptions.Item>
                    <Descriptions.Item label={'Take off'}>{props.ticket.departure_time}</Descriptions.Item>
                    <Descriptions.Item label={'Departure'}
                                       span={2}>{props.ticket.departure_city}, {props.ticket.departure_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Arrival'}
                                       span={2}>{props.ticket.arrival_city}, {props.ticket.arrival_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Class'} span={2}>
                        {props.type === 'EC' ? 'Economy class' :
                            props.type === 'BC' ? 'Business class' : 'First Class'}
                    </Descriptions.Item>
                    <Descriptions.Item label={'Price'}
                                       span={2}>{props.ticket[props.type + 'price'] + '￥'}</Descriptions.Item>
                    <Descriptions.Item label={'Customer Email'}>
                        <Input bordered={false} placeholder={'Email of the customer'}
                               style={{transform: 'translateX(-10px)'}} id={'customerEmail'} onChange={e => {
                            document.getElementById('customerEmail').value = e.target.value
                        }}></Input>
                    </Descriptions.Item>
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

function FlightStatus() {
    return (
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
                              let url = 'http://localhost:5000/api/search?'
                              url += 'action=getTickets'
                              Object.keys(form).forEach(key => {
                                  url += '&' + key + '=' + form[key]
                              })
                              console.log(url)
                              fetch(url, {credentials: 'include',})
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
                                    label={"From"}
                                >
                                    <Input placeholder={'Source city/airport'}/>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item
                                    name={'to'}
                                    label={"To"}>
                                    <Input placeholder={'Destination city/airport'}/>
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
                {dataSource === '' ? <React.Fragment/> :
                    dataSource.length === 0 ? <Empty style={{margin: '100px 0'}}/> : <TableTitle/>}
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
                                                    {d.departure_airport + ' | ' + d.departure_city}
                                                </Col>
                                                <Col span={2}>
                                                    <div style={{
                                                        borderBottom: 'black solid 0.5px',
                                                        transform: 'translateY(2px)',
                                                        margin: '0 10px'
                                                    }}/>
                                                </Col>
                                                <Col span={11} style={{textAlign: 'left'}}>
                                                    {d.arrival_city+' | ' + d.arrival_airport}
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
                              let url = 'http://localhost:5000/api/search?'
                              url += 'action=getStatus'
                              Object.keys(form).forEach(key => {
                                  url += '&' + key + '=' + form[key]
                              })
                              console.log(form)
                              fetch(url, {credentials: 'include',})
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
                                    <Input/>
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
                    {dataSource === '' ? <React.Fragment/> :
                        dataSource.length === 0 ? <Empty style={{margin: '100px 0'}}/> : <FlightStatus/>}
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
                                                        {d.departure_city + ' | ' + d.departure_airport}
                                                    </Col>
                                                    <Col span={2}>
                                                        <div style={{
                                                            borderBottom: 'black solid 0.5px',
                                                            transform: 'translateY(2px)',
                                                            margin: '0 10px'
                                                        }}/>
                                                    </Col>
                                                    <Col span={11} style={{textAlign: 'left'}}>
                                                        {d.arrival_airport + ' | ' + d.arrival_city}
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

function OrderStatus() {
    return (
        <div className={'ticket_title'}>
            <Row gutter={16}>
                <Col span={12}>
                    Order
                </Col>
                <Col span={3}>
                    Price
                </Col>
                <Col span={4}>
                    Purchase Time
                </Col>
                <Col span={3}>
                    Customer
                </Col>
                <Col span={2}>
                    Order Status
                </Col>
            </Row>
        </div>
    )
}

function MyOrders() {
    const [filteredData, setFilteredData] = React.useState({
        data: [],
        loaded: false,
        range: [moment().subtract(30, 'days'), moment()],
        orderData: []
    })
    const [ticketBuyer, setTicketBuyer] = React.useState(null)
    const [commission, setCommission] = React.useState(null)
    if (!filteredData.loaded) {
        fetch('http://localhost:5000/api/order', {
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
                setFilteredData({
                    orderData: result.data,
                    data: result.data.filter(d => {
                        return moment(d.date).isBetween(filteredData.range[0].format("YYYY-MM-DD"), filteredData.range[1].format("YYYY-MM-DD"))
                    }),
                    loaded: true,
                    range: [moment().subtract(30, 'days'), moment()],
                })
            } else if (result.status === 'failed') {
                alert("logout failed.\n" + result.msg)
            } else {
                console.log("What's this?")
            }
        });
    }
    if (ticketBuyer === null) {
        fetch('http://localhost:5000/api/agent_get_top_customer_by_ticket', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                setTicketBuyer(data.data);
            });
    }
    if (commission === null) {
        fetch('http://localhost:5000/api/agent_get_top_customer_by_commission', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                setCommission(data.data);
            });
    }

    function OrderList(props) {
        return (
            <div>
                {props.orderData.map((d) => {
                    return (<div className={'ticket'} key={d.key}>
                            <Row gutter={16} style={{minHeight: '100px'}} align={'middle'}
                                 justify={'center'}>
                                <Col span={12}>
                                    <div className={'airports'}>
                                        {d.airline + ' | ' + d.flight_num + ' | ' + d.date}
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
                                                {d.departure_city + ' | ' + d.departure_airport}
                                            </Col>
                                            <Col span={2}>
                                                <div style={{
                                                    borderBottom: 'black solid 0.5px',
                                                    transform: 'translateY(2px)',
                                                    margin: '0 10px'
                                                }}/>
                                            </Col>
                                            <Col span={11} style={{textAlign: 'left'}}>
                                                {d.arrival_airport + ' | ' + d.arrival_city}
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className={"duration"}>
                                        {d.durationHour + 'h ' + d.durationMin + 'min'}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className={'price'}>
                                        {d.price + "￥"}
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div>
                                        {d.purchase_time}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div>
                                        <Popover content={'Email: ' + d.customer_email} title={d.customer_name}
                                                 trigger="hover">
                                            <ContactsOutlined style={{marginRight: '10px'}}/>
                                        </Popover>
                                        {d.customer_name}
                                    </div>
                                </Col>
                                <Col span={2}>
                                    <div className={d.status}>
                                        {d.status}
                                    </div>
                                </Col>

                            </Row>
                        </div>

                    )
                })}
            </div>

        )
    }

    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <div style={{margin: '0 10px 10px'}}>
                <DatePicker.RangePicker value={filteredData.range} onChange={(range) => {

                    let endDate = moment(range[1].format('YYYY-MM-DD'),'YYYY-MM-DD')
                    endDate.add(1,'d')
                    setFilteredData({
                        orderData:filteredData.orderData,
                        data: filteredData.orderData.filter?filteredData.orderData.filter(d => {
                            return moment(d.purchase_time,'YYYY-MM-DD').isBetween(range[0].format("YYYY-MM-DD"),endDate.format("YYYY-MM-DD"))
                        }):[],
                        loaded: true,
                        range: range
                    })
                }}/>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total commission"
                                precision={2}
                                suffix="￥"
                                value={filteredData.data.map?filteredData.data.map(d => d.price).reduce((accu, cur) => {
                                    return accu + cur
                                }, 0) / 10
                                :
                                0}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total order"
                                value={filteredData.data.length}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Order in progress"
                                value={filteredData.data.filter?filteredData.data.filter(d => d.status !== 'finished').length:0}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Finished order"
                                value={filteredData.data.filter?filteredData.data.filter(d => d.status == 'finished').length:0}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card bordered={false} title={'Top 5 half-year ticket buyers'}>
                            {ticketBuyer===null?<Empty />:<HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column'
                                    },
                                    title: {
                                        text: ''
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    xAxis: {
                                        categories: ticketBuyer.map(d => d.name),
                                        crosshair: true
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: ''
                                        }
                                    },
                                    tooltip: {},
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        }
                                    },
                                    series: [{
                                        name: 'Customer',
                                        data: ticketBuyer.map(d => d.ticket)
                                    }],
                                    credits: {
                                        enabled: false
                                    },
                                    legend: {
                                        enabled: false
                                    }
                                }
                            }/>}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false} title={'Top 5 half-year commission contributors'}>
                            {commission===null?<Empty />:<HighchartsReact highcharts={Highcharts} options={
                                {
                                    chart: {
                                        type: 'column'
                                    },
                                    title: {
                                        text: ''
                                    },
                                    subtitle: {
                                        text: ''
                                    },
                                    xAxis: {
                                        categories: commission.map(d => d.name),
                                        crosshair: true
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: ''
                                        }
                                    },
                                    tooltip: {},
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        }
                                    },
                                    series: [{
                                        name: 'Customer',
                                        data: commission.map(d => d.commission)
                                    }],
                                    credits: {
                                        enabled: false
                                    },
                                    legend: {
                                        enabled: false
                                    }
                                }
                            }/>}
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className="site-layout-content">

                <div style={{padding: '20px'}}>
                    {filteredData.data.length === 0 ? <Empty style={{margin: '100px 0'}}/> : <OrderStatus/>}
                    {filteredData.data.length === 0 ? <React.Fragment/> : <OrderList orderData={filteredData.data}/>}

                </div>
            </div>
        </Content>
    )
}

function Agent(props) {
    const [mainMenu, setMainMenu] = React.useState('orders')

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
                                <Menu.Item key="orders">My Orders</Menu.Item>
                            </Menu>
                        </Col>
                        <Col>

                            <span style={{color: 'rgb(166, 173, 180)', display: 'inline-block'}}>Welcome,
                                {' ' + props.username} <UserOutlined/>&nbsp;&nbsp; |&nbsp;&nbsp; </span>
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
                                    if (result.status === 'success') {
                                        props.setUserType('login');
                                    }
                                    if (result.status === 'failed') {
                                        alert("logout failed.\n" + result.msg)
                                    }
                                });


                            }}>
                                Logout <LogoutOutlined/>
                            </a></span>
                        </Col>
                    </Row>
                </Header>
                {mainMenu === 'tickets' ? <Tickets/> : <React.Fragment/>}
                {mainMenu === 'upcoming_flights' ? <UpcomingFlights/> : <React.Fragment/>}
                {mainMenu === 'orders' ? <MyOrders/> : <React.Fragment/>}
                <Footer style={{textAlign: 'center'}}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course
                    Project</Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Agent;