import React from 'react';
import './staff.css';

import {
    Layout, Menu, Row, Col, Form, DatePicker, Input, Button,
    Mentions, Empty, Modal, Descriptions, message, Card, Statistic, Popover, Checkbox, Select, TimePicker
} from 'antd';

import {
    UserOutlined, LogoutOutlined, SearchOutlined, ShoppingCartOutlined, ContactsOutlined, ReloadOutlined,
    SendOutlined, HourglassOutlined
} from '@ant-design/icons';

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
                                       span={2}>{props.ticket.depart_city}, {props.ticket.depart_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Arrival'}
                                       span={2}>{props.ticket.arrive_city}, {props.ticket.arrive_airport}</Descriptions.Item>
                    <Descriptions.Item label={'Class'} span={2}>
                        {props.type === 'EC' ? 'Economy class' :
                            props.type === 'BC' ? 'Business class' : 'First Class'}
                    </Descriptions.Item>
                    <Descriptions.Item label={'Price'}
                                       span={2}>{props.ticket[props.type + 'price'] + '￥'}</Descriptions.Item>
                    <Descriptions.Item label={'Customer Email'}>
                        <Input bordered={false} placeholder={'Email of the customer'}
                               style={{transform: 'translateX(-10px)'}} id={'customerEmail'}></Input>
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
                {dataSource === '' ? <React.Fragment/> :
                    dataSource === [] ? <Empty style={{margin: '100px 0'}}/> : <TableTitle/>}
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
                    {dataSource === '' ? <React.Fragment/> :
                        dataSource === [] ? <Empty style={{margin: '100px 0'}}/> : <FlightStatus/>}
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

function OrderStatus() {
    return (
        <div className={'ticket_title'}>
            <Row gutter={16}>
                <Col span={12}>
                    Order
                </Col>
                <Col span={5}>
                    Purchase Time
                </Col>
                <Col span={4}>
                    Customer
                </Col>
                <Col span={3}>
                    Order Status
                </Col>
            </Row>
        </div>
    )
}

function MyOrders() {
    const [orderData, setOrderData] = React.useState(null)
    if (orderData === null) {
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
                setOrderData(result.data)
            }
            if (result.status === 'failed') {
                alert("logout failed.\n" + result.msg)
            }
        });
    }

    function OrderList(props) {
        return (
            <div>
                {props.orderData.details.map((d) => {
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
                                <Col span={5}>
                                    <div>
                                        {d.purchase_time}
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div>
                                        <Popover content={'Email: ' + d.customer_email} title={d.customer_name}
                                                 trigger="hover">
                                            <ContactsOutlined style={{marginRight: '10px'}}/>
                                        </Popover>
                                        {d.customer_name}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className={d.status === "In progress" ? 'in_progress' : ""}>
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
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total selling / Past 30 days"
                                precision={2}
                                suffix=""
                                value={orderData === null ? true : formatNumber(orderData.spending) + '￥ / ' + formatNumber(orderData.spending30) + '￥'}
                                loading={orderData === null ? true : false}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={false}>
                            <Statistic
                                title="Average commission"
                                precision={2}
                                suffix=""
                                value={orderData === null ? true : formatNumber((orderData.commission / orderData.order).toFixed(2)) + '￥'}
                                loading={orderData === null ? true : false}
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total order"
                                value={orderData === null ? true : orderData.order}
                                loading={orderData === null ? true : false}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false}>
                            <Statistic
                                title="Order in progress"
                                value={orderData === null ? true : orderData.in_progress}
                                loading={orderData === null ? true : false}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={false}>
                            <Statistic
                                title="Finished order"
                                value={orderData === null ? true : orderData.finished}
                                loading={orderData === null ? true : false}
                                precision={0}
                                suffix=""
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className="site-layout-content">
                <div style={{padding: '20px'}}>
                    {orderData === null ? <React.Fragment/> :
                        orderData.data === [] ? <Empty style={{margin: '100px 0'}}/> : <OrderStatus/>}
                    {orderData === null ? <React.Fragment/> : <OrderList orderData={orderData}/>}

                </div>
            </div>
        </Content>
    )
}

function ManageStatusCard(props) {
    const {d} = props
    const [selVal, setSelVal] = React.useState(d.status)
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
                    <div>
                        <Select defaultValue={d.status} className={d.status}
                                style={{width: 120}} value={selVal} onChange={val => {
                            let chg = {new_status: val}
                            let newval = Object.assign({}, d, chg)
                            fetch('http://localhost:5000/api/set_status_staff', {
                                mode: 'cors',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify(newval)
                            }).then(res => {
                                return res.json()
                            }).then(result => {
                                if (result.status === 'success') {
                                    d.status = val;
                                    setSelVal(val);
                                    message.success('Successfully updated status!')
                                }
                                if (result.status === 'failed') {
                                    message.error("Error updating status.\n" + result.msg)
                                }
                            });
                        }}>
                            <Select.Option value="ontime"
                                           className={'ontime'}>ontime</Select.Option>
                            <Select.Option value="delayed"
                                           className={'delayed'}>delayed</Select.Option>
                            <Select.Option value="upcoming">upcoming</Select.Option>
                            <Select.Option value="arrived">arrived</Select.Option>
                        </Select>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

function Manage() {
    const [statusData, setStatusData] = React.useState([])
    const [filteredData, setFilteredData] = React.useState([])
    const [form] = Form.useForm();
    const filterOptions = [
        {label: 'On time', value: 'ontime'},
        {label: 'Delayed', value: 'delayed'},
        {label: 'Upcoming', value: 'upcoming'},
        {label: 'Arrived', value: 'arrived'},
    ];


    function refresh_status() {
        fetch('http://localhost:5000/api/get_status_staff')
            .then((resp) => resp.json())
            .then(data => {
                if (JSON.stringify(statusData) !== JSON.stringify(data.dataSource)) {
                    setStatusData(data.dataSource);

                }
            })
    }

    refresh_status()
    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <Row gutter={16}>
                <Col span={16}>
                    <Card title={'Manage status'} bordered={false} className={'card'}
                          extra={<Button type={'primary'} icon={<ReloadOutlined/>}
                                         onClick={refresh_status}>Refresh</Button>}>
                        <div>
                            <Checkbox.Group options={filterOptions} defaultValue={[]}
                                            onChange={val => {
                                                setFilteredData(statusData.filter(d => {
                                                    return val.includes(d.status)
                                                }))
                                            }}/>
                            <hr style={{border: 'lightgrey solid 0.5px'}}/>
                        </div>
                        <div style={{padding: '20px'}}>
                            {
                                filteredData.length === 0 ? <Empty style={{margin: '100px 0'}}/> : <FlightStatus/>}
                            {
                                filteredData.map((d) => {
                                    return (
                                        <ManageStatusCard d={d} id={d.flight_num + d.date}
                                                          refresh_status={refresh_status()}/>
                                    )
                                })
                            }
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={'Live report'} bordered={false} className={'card'}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="On time"
                                        value={statusData.filter(d => {
                                            return d.status === 'ontime'
                                        }).length}
                                        precision={0}
                                        valueStyle={{color: '#3f8600'}}
                                        prefix={<SendOutlined/>}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Delayed"
                                        value={statusData.filter(d => {
                                            return d.status === 'delayed'
                                        }).length}
                                        precision={0}
                                        valueStyle={{color: '#cf1322'}}
                                        prefix={<HourglassOutlined/>}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'Add a new flight'} bordered={false} className={'card'}>
                        <Form layout={'vertical'} requiredMark={false} form={form} onFinish={data => {
                            fetch('http://localhost:5000/api/new_flight', {
                                mode: 'cors',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify(data)
                            }).then(res => {
                                return res.json()
                            }).then(result => {
                                if (result.status === 'success') {
                                    message.success('Successfully added flight！');
                                    form.resetFields();
                                }
                                if (result.status === 'failed') {
                                    message.error('Unable to add a new plane.\n'+result.msg)
                                }
                            });
                        }}>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'Flight number'} name={'flight_num'} rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={'Departure date'} name={'departure_date'} rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name',
                                        },
                                    ]}>
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Departure time'} name={'departure_time'} rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name',
                                        },
                                    ]}>
                                        <TimePicker/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={'Arrival date'} name={'arrival_date'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <DatePicker/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Arrival time'} name={'arrival_time'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <TimePicker/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={'Departure airport'} name={'depart_airport'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Arrival airport'} name={'arrive_airport'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label={'Economy Class'} name={'ECprice'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'Business Class'} name={'BCprice'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'First Class'} name={'FCprice'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row glutter={16}>
                                <Col span={24}>
                                    <Button type={'primary'} htmlType={'submit'} style={{
                                        position: 'absolute',
                                        right: 0
                                    }}>Submit</Button>
                                </Col>
                            </Row>
                            <Button/>

                        </Form>
                    </Card>
                </Col>
            </Row>
        </Content>)
}

function Customers() {
    return (<div></div>)
}

function Staff(props) {
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
                                <Menu.Item key="manage_flights">Manage Flights</Menu.Item>
                                <Menu.Item key="customers">Customers</Menu.Item>
                                <Menu.Item key="orders">My Orders</Menu.Item>
                            </Menu>
                        </Col>
                        <Col>

                            <span style={{color: 'rgb(166, 173, 180)', display: 'inline-block'}}>Welcome,
                                {' '+props.username} <UserOutlined/>&nbsp;&nbsp; |&nbsp;&nbsp; </span>
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
                {mainMenu === 'manage_flights' ? <Manage/> : <React.Fragment/>}
                {mainMenu === 'customers' ? <Customers/> : <React.Fragment/>}
                <Footer style={{textAlign: 'center'}}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course
                    Project</Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Staff;