import React from 'react';
import './main.css';

import {Layout, Menu, Breadcrumb, Row, Col, Dropdown, Form, DatePicker, Input, Button, Mentions, Empty} from 'antd';

import { UserOutlined, LaptopOutlined, NotificationOutlined,DownOutlined, SearchOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
function TableTitle(){
    return(
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
function Tickets(){
    const [dataSource, setDataSource] = React.useState([]);
    return(
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <div className="site-layout-content">
                <div style={{margin: 'auto', maxWidth: '1000px'}}>
                    <Form style={{padding: '20px', border: 'lightgrey solid 1px', borderRadius: '2px'}} onFinish={(form)=>{
                        let url = 'http://localhost:5000?'
                        url += 'action=getTickets'
                        Object.keys(form).forEach(key=>{
                            url += '&'+key+'='+form[key]
                        })
                        console.log(url)
                        fetch(url)
                            .then((resp) => resp.json())
                            .then(data=>{
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
                {dataSource.length === 0? <Empty style={{margin:'100px 0'}}/> : <TableTitle />}
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
                                                        <div style={{borderBottom:'black solid 0.5px', transform:'translateY(2px)', margin:'0 10px'}} />
                                                    </Col>
                                                    <Col span={11} style={{textAlign: 'left'}}>
                                                        {d.arrive_airport}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={"duration"}>
                                                {d.durationHour+'h '+d.durationMin+'min'}
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.ECprice)}
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.BCprice)}
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className={'price'}>
                                                {'￥' + formatNumber(d.FCprice)}
                                            </div>
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
function UpcomingFlights(){
    const dataSource = [
        {
            key: '1',
            airline: 'China Eastern Airline',
            flight_num: 'MU5401',
            departure_time: '08:10',
            arrival_time: '11:05',
            status:'upcoming',
            arrive_city: 'Chengdu',
            arrive_airport: 'Shuangliu International Airport',
            depart_city: "Shanghai",
            depart_airport: "Hongqiao International Airport",
            durationHour: 3,
            durationMin: 50
        },
        {
            key: '2',
            airline: 'China International Airline',
            flight_num: 'CA9880',
            departure_time: '09:10',
            arrival_time: '12:05',
            status:'upcoming',
            arrive_city: 'Chengdu',
            arrive_airport: 'Shuangliu International Airport',
            depart_city: "Shanghai",
            depart_airport: "Hongqiao International Airport",
            durationHour: 2,
            durationMin: 20
        },
        {
            key: '2',
            airline: 'China International Airline',
            flight_num: 'CA9880',
            departure_time: '09:10',
            arrival_time: '12:05',
            status:'delayed',
            arrive_city: 'Chengdu',
            arrive_airport: 'Shuangliu International Airport',
            depart_city: "Shanghai",
            depart_airport: "Hongqiao International Airport",
            durationHour: 2,
            durationMin: 20
        },
        {
            key: '2',
            airline: 'China International Airline',
            flight_num: 'CA9880',
            departure_time: '09:10',
            arrival_time: '12:05',
            status:'upcoming',
            arrive_city: 'Chengdu',
            arrive_airport: 'Shuangliu International Airport',
            depart_city: "Shanghai",
            depart_airport: "Hongqiao International Airport",
            durationHour: 2,
            durationMin: 20
        },
    ];
    return(
        <Content style={{padding: '50px 50px', minHeight: '90vh'}}>
            <div className="site-layout-content">
                <div style={{margin: 'auto', maxWidth: '1000px'}}>
                    <Form style={{padding: '20px', border: 'lightgrey solid 1px', borderRadius: '2px'}}>
                        <Row gutter={32} justify={'end'}>
                            <Col span={10}>
                                <Form.Item
                                    name={'from'}
                                    label={"From"}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item
                                    name={'to'}
                                    label={"To"}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Button type={'primary'} onClick={() => {
                                }} icon={<SearchOutlined/>}>
                                    Search
                                </Button>
                            </Col>

                        </Row>
                    </Form>
                </div>
                <div style={{padding: '20px'}}>
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
                    {
                        dataSource.map((d) => {
                            return (
                                <div class={'ticket'}>
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
                                                        <div style={{borderBottom:'black solid 0.5px', transform:'translateY(2px)', margin:'0 10px'}} />
                                                    </Col>
                                                    <Col span={11} style={{textAlign: 'left'}}>
                                                        {d.arrive_airport}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={"duration"}>
                                                {d.durationHour+'h '+d.durationMin+'min'}
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
function Main(props) {
    const [mainMenu, setMainMenu] = React.useState('tickets')

    return (
        <React.Fragment>
            <Layout className="layout">
                <Header>
                    <Row justify={'space-between'}>
                        <Col>
                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[mainMenu]} onClick={e=>{setMainMenu(e.key)}}>
                                <img src={'logo_white.png'} style={{display: 'inline'}} height={'50px'}/>
                                <Menu.Item key="tickets">Tickets</Menu.Item>
                                <Menu.Item key="upcoming_flights">Upcoming Flights</Menu.Item>
                            </Menu>
                        </Col>
                        <Col>
                            <a className="ant-dropdown-link" onClick={e => {
                                e.preventDefault();
                                props.setUserType('login');
                            }}>
                                Login <UserOutlined/>
                            </a>
                        </Col>
                    </Row>
                </Header>
                {mainMenu=='tickets'?<Tickets />:<React.Fragment />}
                {mainMenu=='upcoming_flights'?<UpcomingFlights />:<React.Fragment />}
                <Footer style={{textAlign: 'center'}}>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course
                    Project</Footer>
            </Layout>
        </React.Fragment>
    )
}

export default Main;