import React from 'react';
import './staff.css';

import {
    Layout, Menu, Row, Col, Form, DatePicker, Input, Button, Table, Divider,
    Mentions, Empty, Modal, Descriptions, message, Card, Statistic, Popover, Checkbox, Select, TimePicker
} from 'antd';

import {
    UserOutlined, LogoutOutlined, SearchOutlined, ShoppingCartOutlined, ContactsOutlined, ReloadOutlined,
    SendOutlined, HourglassOutlined, FireOutlined
} from '@ant-design/icons';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from "moment";
import Agent from "../agent/agent";

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

function FlightStatus_Manage() {
    return (
        <div className={'ticket_title'}>
            <Row gutter={16}>
                <Col span={12}>

                </Col>
                <Col span={5}>

                </Col>
                <Col span={4}>
                    Flight Status
                </Col>
                <Col span={3}>
                    Passengers
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
                              fetch(url)
                                  .then((resp) => resp.json())
                                  .then(data => {
                                      if (data.status === 'failed') {
                                          console.log(1)
                                          message.error('Failed to return a valid response.\n' + data.msg)
                                      } else {
                                          setDataSource(data.dataSource)
                                      }
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
                              console.log(url)
                              fetch(url)
                                  .then((resp) => resp.json())
                                  .then(data => {
                                      if (data.status === 'failed') {
                                          console.log(1)
                                          message.error('Failed to return a valid response\n' + data.msg)
                                      } else {
                                          setDataSource(data.dataSource)
                                      }
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
                                    name={'date'}
                                    label={"Date"}>
                                    <DatePicker style={{width: '100%'}}/>
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

function Passenger(props) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [passenger, setPassenger] = React.useState({})
    const {name, email} = props;
    return (
        <>
            <a onClick={e => {
                e.preventDefault();
                setIsModalVisible(true)
                fetch('http://localhost:5000/api/get_passenger_info', {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({email: email})
                }).then(res => {
                    return res.json()
                }).then(result => {
                    if (result.status === 'success') {
                        setPassenger(result.data)
                    }
                    if (result.status === 'failed') {
                        message.error("Error getting passengers info.\n" + result.msg)
                    }
                });
            }}>{name}</a>
            <Modal title={'Passenger - ' + name} visible={isModalVisible} width={850}
                   onOk={() => setIsModalVisible(false)}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}
                   cancelButtonProps={{hidden: 'true'}}>
                {passenger === {} ? <Empty/> : <Descriptions bordered column={6} size={'small'}>
                    <Descriptions.Item label="First Name" span={3}>{passenger.firstname}</Descriptions.Item>
                    <Descriptions.Item label="Last Name" span={3}>{passenger.lastname}</Descriptions.Item>
                    <Descriptions.Item label="Date of Birth" span={6}>{passenger.date_of_birth}</Descriptions.Item>
                    <Descriptions.Item label="Email" span={6}>{passenger.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number" span={6}>{passenger.phone_number}</Descriptions.Item>
                    <Descriptions.Item label="Street" span={2}>{passenger.street}</Descriptions.Item>
                    <Descriptions.Item label="City" span={2}>{passenger.city}</Descriptions.Item>
                    <Descriptions.Item label="State" span={2}>{passenger.state}</Descriptions.Item>
                    <Descriptions.Item label="Passport Number" span={2}>{passenger.passport_number}</Descriptions.Item>
                    <Descriptions.Item label="Passport Expiration"
                                       span={2}>{passenger.passport_expiration}</Descriptions.Item>
                    <Descriptions.Item label="Passport Country"
                                       span={2}>{passenger.passport_country}</Descriptions.Item>
                </Descriptions>}
            </Modal>
        </>
    )
}

function ManagePassengers(props) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [passengers, setPassengers] = React.useState({
        FC: [],
        BC: [],
        EC: [],
    })
    const tableCols = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Passenger name={text} email={record.email}/>
    },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        }
    ]
    const {d} = props
    return (
        <>
            <a onClick={e => {
                e.preventDefault();
                setIsModalVisible(true)
                fetch('http://localhost:5000/api/get_passengers', {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(d)
                }).then(res => {
                    return res.json()
                }).then(result => {
                    if (result.status === 'success') {
                        setPassengers(result.data)
                    }
                    if (result.status === 'failed') {
                        message.error("Error getting passengers.\n" + result.msg)
                    }
                });
            }}>View</a>
            <Modal title={d.flight_num + ' - Passengers'} visible={isModalVisible} onOk={() => setIsModalVisible(false)}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}
                   cancelButtonProps={{hidden: 'true'}} width={900}>
                <Divider orientation="center" plain>
                    First Class
                </Divider>
                {passengers.FC.length === 0 ? <Empty/> :
                    <Table dataSource={passengers.FC} columns={tableCols} size="small"/>}
                <Divider orientation="center" plain>
                    Business Class
                </Divider>
                {passengers.BC.length === 0 ? <Empty/> :
                    <Table dataSource={passengers.BC} columns={tableCols} size="small"/>}
                <Divider orientation="center" plain>
                    Economy Class
                </Divider>
                {passengers.EC.length === 0 ? <Empty/> :
                    <Table dataSource={passengers.EC} columns={tableCols} size="small"/>}
            </Modal>
        </>

    )
}

function ManageStatusCard(props) {
    const {d} = props
    const [selVal, setSelVal] = React.useState(d.status)
    if (selVal !== d.status) {
        setSelVal(d.status);
    }
    return (
        <div className={'ticket'} key={d.key}>
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
                <Col span={5}>
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
                                    props.refresh_status(true)
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
                <Col span={3}>
                    <ManagePassengers d={d}/>
                </Col>
            </Row>
        </div>
    )
}

function Manage() {
    const [statusData, setStatusData] = React.useState({
        origin: [],
        filtered: [],
        filterOptions: ['upcoming'],
        loaded: false,
        range: [moment(), moment().add(30, 'days')]
    })
    const [form] = Form.useForm(); //for add a new flight
    const [new_plane_form] = Form.useForm();
    const [new_airport_form] = Form.useForm();

    const filterOptions = [
        {label: 'On time', value: 'ontime'},
        {label: 'Delayed', value: 'delayed'},
        {label: 'Upcoming', value: 'upcoming'},
        {label: 'Arrived', value: 'arrived'},
    ];


    function refresh_status(force_refresh = false) {
        fetch('http://localhost:5000/api/get_status_staff', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                if (!statusData.loaded || force_refresh) {
                    setStatusData({
                            origin: data.dataSource,
                            filtered: data.dataSource.filter(d => {
                                return statusData.filterOptions.includes(d.status)
                            }).filter(d => {
                                console.log(d, statusData.range)
                                return moment(d.date).isBetween(statusData.range[0].format("YYYY-MM-DD"), statusData.range[1].format("YYYY-MM-DD"))
                            }),
                            filterOptions: statusData.filterOptions,
                            loaded: true,
                            range: statusData.range
                        }
                    );

                }

            });
    }

    refresh_status()
    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <Row gutter={16}>
                <Col span={16}>
                    <Card title={'Manage status'} bordered={false} className={'card'}
                          extra={<Button type={'primary'} icon={<ReloadOutlined/>}
                                         onClick={() => refresh_status(true)}>Refresh</Button>}>
                        <div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Checkbox.Group value={statusData.filterOptions} options={filterOptions}
                                                    defaultValue={['upcoming']}
                                                    onChange={val => {
                                                        setStatusData({
                                                            origin: statusData.origin,
                                                            filtered: statusData.origin.filter(d => {
                                                                return val.includes(d.status)
                                                            }).filter(d => {
                                                                return moment(d.date).isBetween(statusData.range[0].format("YYYY-MM-DD"), statusData.range[1].format("YYYY-MM-DD"))
                                                            }),
                                                            filterOptions: val,
                                                            loaded: true,
                                                            range: statusData.range
                                                        })
                                                    }}/>
                                </Col>
                                <Col span={12} align={'end'}>
                                    <DatePicker.RangePicker value={statusData.range}
                                                            style={{transform: 'translateY(-5px)'}} onChange={range => {
                                        setStatusData({
                                            origin: statusData.origin,
                                            filtered: statusData.origin.filter(d => {
                                                return statusData.filterOptions.includes(d.status)
                                            }).filter(d => {
                                                return moment(d.date).isBetween(range[0].format("YYYY-MM-DD"), range[1].format("YYYY-MM-DD"))
                                            }),
                                            filterOptions: statusData.filterOptions,
                                            loaded: true,
                                            range: range
                                        })
                                    }}/>
                                </Col>
                            </Row>


                            <hr style={{border: 'lightgrey solid 0.5px'}}/>
                        </div>
                        <div style={{padding: '20px'}}>
                            {
                                statusData.filtered.length === 0 ? <Empty style={{margin: '100px 0'}}/> :
                                    <FlightStatus_Manage/>}
                            {
                                statusData.filtered.map((d) => {
                                    return (
                                        <ManageStatusCard d={d} id={d.flight_num + d.date}
                                                          refresh_status={refresh_status}/>
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
                                        value={statusData.origin.filter(d => {
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
                                        value={statusData.origin.filter(d => {
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
                                    message.error('Unable to add a new flight.\n' + result.msg)
                                }
                            });
                        }}>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'Flight number'} name={'flight_num'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the flight number',
                                        },
                                    ]}>
                                        <Input placeholder={'Flight number'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'Airplane ID'} name={'airplane_id'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the airplane ID',
                                        },
                                    ]}>
                                        <Input placeholder={'Airplane ID'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={'Departure time'} name={'departure_time'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the time',
                                        },
                                    ]}>
                                        <DatePicker showTime={true}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Arrival time'} name={'arrival_time'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the time',
                                        },
                                    ]}>
                                        <DatePicker showTime={true}/>
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
                                        <Input placeholder={'Departure airport'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={'Arrival airport'} name={'arrive_airport'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Arrival airport'}/>
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
                                        <Input placeholder={'Economy clsss price'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'Business Class'} name={'BCprice'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'Business class price'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'First Class'} name={'FCprice'} rules={[
                                        {
                                            required: true,
                                            message: 'Please fill in this field',
                                        },
                                    ]}>
                                        <Input placeholder={'First class price'}/>
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
                    <Card title={'Add a new plane'} bordered={false} className={'card'}>
                        <Form layout={'vertical'} requiredMark={false} form={new_plane_form} onFinish={data => {
                            fetch('http://localhost:5000/api/new_plane', {
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
                                    message.success('Successfully added plane！');
                                    new_plane_form.resetFields();
                                }
                                if (result.status === 'failed') {
                                    message.error('Unable to add a new plane.\n' + result.msg)
                                }
                            });
                        }}>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'Plane ID'} name={'id'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the plane ID',
                                        },
                                    ]}>
                                        <Input placeholder={'Plane ID'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            Seats
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label={'Economy Class'} name={'EC'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the seats',
                                        },
                                    ]}>
                                        <Input placeholder={'Economy class price'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'Business Class'} name={'BC'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the seats',
                                        },
                                    ]}>
                                        <Input placeholder={'Economy class price'}/>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={'First Class'} name={'FC'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the seats',
                                        },
                                    ]}>
                                        <Input placeholder={'Economy class price'}/>
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
                    <Card title={'Add a new airport'} bordered={false} className={'card'}>
                        <Form layout={'vertical'} requiredMark={false} form={new_airport_form} onFinish={data => {
                            fetch('http://localhost:5000/api/new_airport', {
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
                                    message.success('Successfully added airport！');
                                    new_airport_form.resetFields();
                                }
                                if (result.status === 'failed') {
                                    message.error('Unable to add a new plane.\n' + result.msg)
                                }
                            });
                        }}>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'Airport Name'} name={'name'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter airport name',
                                        },
                                    ]}>
                                        <Input placeholder={'Airport'}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item label={'City'} name={'city'} rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the city',
                                        },
                                    ]}>
                                        <Input placeholder={'City'}/>
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

function StatisticsViewOrders(props) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [order, setOrder] = React.useState([])
    const tableCols = [{
        title: 'Purchase Time',
        dataIndex: 'purchase_time',
        key: 'name',
    },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Departure',
            dataIndex: 'departure',
            key: 'departure',
            render: (text, record) => record.departure_time + ' | ' + record.arrive_city + ', ' + record.arrive_airport
        },
        {
            title: 'Arrival',
            dataIndex: 'arrival',
            key: 'arrival',
            render: (text, record) => record.arrival_time + ' | ' + record.depart_city + ', ' + record.depart_airport
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        }
    ]
    const {record} = props
    return (
        <>
            <a onClick={e => {
                e.preventDefault();
                setIsModalVisible(true)
                fetch('http://localhost:5000/api/get_customer_orders', {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({email: record.email})
                }).then(res => {
                    return res.json()
                }).then(result => {
                    if (result.status === 'success') {
                        setOrder(result.data)

                    }
                    if (result.status === 'failed') {
                        message.error("Error getting passengers.\n" + result.msg)
                    }
                });
            }}>View</a>
            <Modal title={record.name + ' - Order History'} visible={isModalVisible}
                   onOk={() => setIsModalVisible(false)}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}
                   cancelButtonProps={{hidden: 'true'}} width={1000}>
                <Table dataSource={order} columns={tableCols} size="small"/>
            </Modal>
        </>

    )
}

function Statistics() {
    function SellingStatics() {
        function SellingQuery() {
            const [selling, setSelling] = React.useState(null)
            if (!selling) {
                fetch('http://localhost:5000/api/get_selling_by_date', {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({date: moment()})
                }).then(res => {
                    return res.json()
                }).then(result => {
                    if (result.status === 'success') {
                        setSelling(result.data)

                    }
                    if (result.status === 'failed') {
                        message.error("Error getting passengers.\n" + result.msg)
                    }
                });
            }
            return (
                <Card bordered={false}>
                    <Row>
                        <Col span={8}>
                            <Statistic
                                title="Selling"
                                value={selling}
                                precision={2}
                                suffix="￥"
                            />
                        </Col>
                        <Col span={4} align={'end'}>
                            Range:&nbsp;
                        </Col>
                        <Col span={12} align={'end'}>
                            <DatePicker.RangePicker style={{transform: 'translateY(-5px)'}} defaultValue={moment()}
                                                    onChange={date => {
                                                        fetch('http://localhost:5000/api/get_selling_by_date', {
                                                            mode: 'cors',
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            },
                                                            credentials: 'include',
                                                            body: JSON.stringify({date: date})
                                                        }).then(res => {
                                                            return res.json()
                                                        }).then(result => {
                                                            if (result.status === 'success') {
                                                                setSelling(result.data)

                                                            }
                                                            if (result.status === 'failed') {
                                                                message.error("Error getting passengers.\n" + result.msg)
                                                            }
                                                        });
                                                    }}/>
                        </Col>
                    </Row>
                </Card>
            )
        }

        const [selling, setSelling] = React.useState(null)
        if (!selling) {
            fetch('http://localhost:5000/api/get_selling_statistics', {credentials: 'include',})
                .then((resp) => resp.json())
                .then(data => {
                    setSelling(data.data);
                });
        }

        return (
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total selling"
                            precision={2}
                            suffix="￥"
                            value={selling !== null ? selling.total : null}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Last year selling"
                            precision={2}
                            suffix="￥"
                            value={selling !== null ? selling.year : null}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Last month selling"
                            precision={2}
                            suffix="￥"
                            value={selling !== null ? selling.month : null}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <SellingQuery/>
                </Col>
            </Row>
        )
    }

    function CustomerTable() {
        const [customerStats, setCustomerStats] = React.useState([])
        const customerCols = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Passenger name={text} email={record.email}/>
        },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Spending',
                dataIndex: 'spending',
                key: 'spending'
            },
            {
                title: 'Orders',
                dataIndex: 'orders',
                key: 'orders',
                render: (text, record) => <StatisticsViewOrders record={record}/>
            }
        ]
        fetch('http://localhost:5000/api/get_top_customer', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                if (JSON.stringify(customerStats) !== JSON.stringify(data.data)) {
                    setCustomerStats(data.data);
                }
            });
        return (<Card title={'Customers'}>
            &nbsp;Past year
            <Table dataSource={customerStats} columns={customerCols} size="small"/>
        </Card>)
    }

    function AgentTable() {
        const [agentStats, setAgentStats] = React.useState([])
        const agentCols = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Tickets',
                dataIndex: 'tickets',
                key: 'tickets'
            },
            {
                title: 'Selling',
                dataIndex: 'selling',
                key: 'selling'
            },
        ]
        fetch('http://localhost:5000/api/get_top_agents', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                if (JSON.stringify(agentStats) !== JSON.stringify(data.data)) {
                    setAgentStats(data.data);
                }
            });
        return (
            <Card title={'Agents'}>
                &nbsp;Past year, by tickets
                <Table dataSource={agentStats.year_tickets} columns={agentCols} size="small"/>
                &nbsp;Past month, by tickets
                <Table dataSource={agentStats.month_tickets} columns={agentCols} size="small"/>
                &nbsp;Past year, by commission
                <Table dataSource={agentStats.year_commission} columns={agentCols} size="small"/>
            </Card>
        )
    }

    function SellingGraph() {
        const [sellingStats, setSellingStats] = React.useState([])
        fetch('http://localhost:5000/api/get_selling', {credentials: 'include',})
            .then((resp) => resp.json())
            .then(data => {
                if (JSON.stringify(sellingStats) !== JSON.stringify(data.data)) {
                    setSellingStats(data.data);
                }
            });
        const chartOptions = {
            chart: {
                type: 'column',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },
            xAxis: {
                categories: sellingStats.map(d => d.month)
            },
            yAxis: {
                title: {text: ''}
            },

            boost: {
                useGPUTranslations: true
            },

            title: {
                text: ''
            },

            subtitle: {
                text: ''
            },

            tooltip: {
                valueDecimals: 2
            },

            series: [{
                name: '',
                data: sellingStats.map(d => d.selling)
            }],
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            }

        }
        return (
            <Card title={'Selling in the Past Year'}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions}/>
            </Card>
        )
    }

    function PieChart() {
        const [sourceData, setSourceData] = React.useState({data: null, loaded: false})
        if (!sourceData.loaded) {
            fetch('http://localhost:5000/api/get_source', {credentials: 'include',})
                .then((resp) => resp.json())
                .then(data => {
                    setSourceData({data: data.data, loaded: true});
                });
        }
        return (<Card title={'Revenue Source'}>
            <Row>
                <Col span={12}>
                    Last Year
                    {sourceData.data === null ? <Empty/> : <HighchartsReact hicharts={Highcharts} options={{
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',
                            height: 300
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: 'Source',
                            colorByPoint: true,
                            data: [{
                                name: 'Direct Sell',
                                y: sourceData.data.direct_year,
                            }, {
                                name: 'Indirect Sell',
                                y: sourceData.data.indirect_year
                            }]
                        }],
                        credits: {
                            enabled: false
                        }
                    }}/>}
                </Col>
                <Col span={12}>
                    Last Month
                    {sourceData.data === null ? <Empty/> : <HighchartsReact hicharts={Highcharts} options={{
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',
                            height: 300
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false
                                },
                                showInLegend: true
                            }
                        },
                        series: [{
                            name: 'Source',
                            colorByPoint: true,
                            data: [{
                                name: 'Direct Sell',
                                y: sourceData.data.direct_month,
                            }, {
                                name: 'Indirect Sell',
                                y: sourceData.data.indirect_month
                            }]
                        }],
                        credits: {
                            enabled: false
                        }
                    }}/>}
                </Col>
            </Row>
        </Card>)
    }

    function Destination() {
        const [sourceData, setSourceData] = React.useState({data: null, loaded: false})
        if (!sourceData.loaded) {
            fetch('http://localhost:5000/api/get_destination', {credentials: 'include',})
                .then((resp) => resp.json())
                .then(data => {
                    setSourceData({data: data.data, loaded: true});
                });
        }
        return (<Card title={'Top 3 destination'}>
            {sourceData.data === null ? <Empty/> : <>
                <p>Last 3 Months</p>
                <Row gutter={16}>
                    <Col span={8} align={'center'} style={{transform: 'translateY(5px)'}}>
                        <Statistic title="Top 2" value={sourceData.data.threeMonth[1]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#548bfb'}}/>
                    </Col>
                    <Col span={8} align={'center'}>
                        <Statistic title="Top 1" value={sourceData.data.threeMonth[0]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#cf1322'}}/>
                    </Col>
                    <Col span={8} align={'center'} style={{transform: 'translateY(5px)'}}>
                        <Statistic title="Top 3" value={sourceData.data.threeMonth[2]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#548bfb'}}/>
                    </Col>
                </Row>
                <br/>
                <br/>
                <p>Last Year</p>
                <Row gutter={16}>
                    <Col span={8} align={'center'} style={{transform: 'translateY(5px)'}}>
                        <Statistic title="Top 2" value={sourceData.data.year[1]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#548bfb'}}/>
                    </Col>
                    <Col span={8} align={'center'}>
                        <Statistic title="Top 1" value={sourceData.data.year[0]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#cf1322'}}/>
                    </Col>
                    <Col span={8} align={'center'} style={{transform: 'translateY(5px)'}}>
                        <Statistic title="Top 3" value={sourceData.data.year[2]} prefix={<FireOutlined/>}
                                   valueStyle={{color: '#548bfb'}}/>
                    </Col>
                </Row>
                <br/>
            </>

            }
        </Card>)
    }

    return (
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <SellingStatics/>
            <br/>
            <Row gutter={16}>
                <Col span={24}>
                    <SellingGraph/>
                </Col>
            </Row>
            <br/>
            <Row gutter={16}>
                <Col span={12}>
                    <CustomerTable/>
                    <br/>
                    <PieChart/>
                    <br/>
                    <Destination/>
                </Col>
                <Col span={12}>
                    <AgentTable/>
                </Col>
            </Row>
        </Content>
    )
}

function Staff(props) {
    const [mainMenu, setMainMenu] = React.useState('manage_flights')

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
                                <Menu.Item key="statistics">Statistics</Menu.Item>
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
                {mainMenu === 'manage_flights' ? <Manage/> : <React.Fragment/>}
                {mainMenu === 'statistics' ? <Statistics/> : <React.Fragment/>}
                <Footer style={{textAlign: 'center'}}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course
                    Project</Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Staff;