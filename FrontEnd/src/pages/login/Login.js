import React from 'react';
import { Button, Layout, Form, Input, Typography, Menu,Col, Row, Drawer, Select, DatePicker, Radio} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, CloseSquareOutlined } from '@ant-design/icons';
import cities from './cities.json';
import prefixDefault from './phoPre.json';
import './login.css'
const { Footer, Content } = Layout;
const { Text} = Typography;


const countries = Array.from(new Set(cities.map(d=>{return d.country}))).sort((a,b)=>{
    if(a===b){
        if(a>b){
            return 1;
        }else if(a<b){
            return -1;
        }else{
            return 0;
        }
    }else{
        if(a>b){
            return 1;
        }else{
            return -1;
        }
    }
});
const { Option } = Select;
const options = [
    { label: 'Customer', value: 'customer' },
    { label: 'Agent', value: 'agent' },
    { label: 'Staff', value: 'staff' },
    { label: 'Admin', value: 'admin'}
];
const register = (values)=>{
    if (values.phone_prefix!=undefined) values.phone = values.phone_prefix+' '+values.phone_number
    values.action='register'
    console.log(JSON.stringify(values));
    //拿到注册请求返回结果，如果正确，刷新页面；否则提示错误

    fetch('http://localhost:5000/auth/register', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',//add cookie
            body: JSON.stringify(values)
    }).then(res => {
        console.log('res',res)
        return res.json()
    }).then(result => {
        if(result.status=='success'){window.location.reload()}
        if(result.status=='failed'){alert("Registration failed.\n" + result.msg)}
    });
}
function Subform(props){

    const [selCities, setSelCities] = React.useState();
    const handleState = selectionState=>{
        setSelCities(Array.from(new Set(cities.filter(d=>{  //todo: 重复的地名直接被去掉了这里
                return selectionState===d.country;
            }).map(d=>{return d.city}).sort((a,b)=>{
                if(a===b){
                    if(a.label>b.label){
                        return 1;
                    }else if(a.label<b.label){
                        return -1;
                    }else{
                        return 0;
                    }
                }else{
                    if(a>b){
                        return 1;
                    }else{
                        return -1;
                    }
                }
            })
        )));
    }
    function MyPassword(){
        return(
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password  placeholder="Please enter your password" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password2"
                            label="Confirm your password"
                            rules={[{ required: true, message: 'Please enter your password' },({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),

                            ]}
                        >
                            <Input.Password placeholder="Please enter your password" />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>

        )
    }
        if (props.type==='customer') return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="firstname"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter your first name' }]}
                        >
                            <Input placeholder="Please enter your first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="lastname"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter your last name' }]}
                        >
                            <Input placeholder="Please enter your first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='date_of_birth'
                            label={'Date of birth'}
                            rules={[{ required: true, message: 'Please enter your birth date' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter your email' }]}
                        >
                            <Input placeholder="Please enter your email" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            label = 'Phone number'
                        >
                            <Input.Group compact>
                                <Form.Item name={'phone_prefix'}>
                                    <Select style={{ width: '12em' }} rules={[{ required: true, message: 'Please enter your phone number' }]}>
                                        ()=>{
                                        prefixDefault.map(d=>{
                                            return <Option value={'+'+d.prefix} key={d.en}>{"("+d.en+") +"+d.prefix}</Option>
                                        })
                                    }
                                    </Select>
                                </Form.Item>
                                <Form.Item name={'phone_number'}>
                                    <Input style={{ width: '100%' }}  placeholder={'Please enter your phone number'} rules={[{ required: true, message: 'Please enter your phone number' }]}/>
                                </Form.Item>

                            </Input.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <MyPassword />
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="building_number"
                            label="Building number"
                            rules={[{ required: true, message: 'Please enter your building number' }]}
                        >
                            <Input placeholder="Building number" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="street"
                            label="Street"
                            rules={[{ required: true, message: 'Please enter your street' }]}
                        >
                            <Input placeholder="Street" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name={'state'}
                            label={'State/region'}
                            rules={[{ required: true, message: 'Please select your state/region' }]}>
                            <Select showSearch onChange={handleState}>
                                ()=>{
                                countries.map(d=>{
                                    return <Option value={d} key={d}>{d}</Option>
                                })
                            }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name={'city'}
                            label={'City'}
                            rules={[{ required: true, message: 'Please select your city' }]}>
                            <Select  showSearch>
                                ()=>{
                                selCities===undefined?
                                    <React.Fragment />:selCities.map(d=>{
                                        return <Option value={d} key={d}>{d}</Option>
                                    })
                            }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="passport_count"
                            label="Passport country / region"
                            rules={[{ required: true, message: 'Please enter your passport country / region' }]}
                        >
                            <Select showSearch >
                                ()=>{
                                countries.map(d=>{
                                    return <Option value={d} key={d}>{d}</Option>
                                })
                            }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="passport_num"
                            label="Passport number"
                            rules={[{ required: true, message: 'Please enter your passport number' }]}
                        >
                            <Input placeholder="Passport number" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='passport_exp'
                            label={'Passport expiration'}
                            rules={[{ required: true, message: 'Please enter your expiration date' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        )
        else if(props.type==='agent') return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="agent_name"
                            label="Agent name"
                            rules={[{ required: true, message: 'Please enter your name as agent' }]}
                        >
                            <Input placeholder="Please enter your name as agent" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="agent_ID"
                            label="Agent ID"
                            rules={[{ required: true, message: 'Please enter your ID as agent' }]}
                        >
                            <Input placeholder="Please enter your ID as agent" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter your email' }]}
                        >
                            <Input placeholder="Please enter your email" />
                        </Form.Item>
                    </Col>

                </Row>
                <MyPassword />
            </React.Fragment>
        )
        else if(props.type==='staff') return (
            <React.Fragment>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please enter your username' }]}
                        >
                            <Input placeholder="Please enter your email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="airline"
                            label="Airline"
                            rules={[{ required: true, message: 'Please enter the airline you work for' }]}
                        >
                            <Input placeholder="Please enter the airline you work for" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="firstname"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter your first name' }]}
                        >
                            <Input placeholder="Please enter your first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="lastname"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter your last name' }]}
                        >
                            <Input placeholder="Please enter your first name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name='date_of_birth'
                            label={'Date of birth'}
                            rules={[{ required: true, message: 'Please enter your birth date' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>

                <MyPassword />
            </React.Fragment>
        )
        else if(props.type==='admin') return (
            <MyPassword />
        )


}

class DrawerForm extends React.Component {
    constructor() {
        super();
        this.formRef = React.createRef();
    }

    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true,
            typeChosen: 'customer'
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            typeChosen: 'customer'
        });
    };

    typeChange = (e) =>{
        this.setState({
            visible: true,
            typeChosen: e.target.value
        });
    };
    render() {
        const typeChosen = this.state.typeChosen;

        return (
            <>
                <Text onClick={this.showDrawer}>
                    <a href={'localhost'} onClick={(e)=>{e.preventDefault()}}>Register</a>
                </Text>
                <Drawer

                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType={'submit'} onClick={()=> {this.formRef.current.submit()
                            }}>
                                Submit
                            </Button>
                        </div>
                    }
                >
                    <Form layout="vertical" hideRequiredMark method={'GET'} onFinish={register}
                      initialValues={{user_type:'customer', phone_prefix:'+86'}} ref={this.formRef}>
                        <Form.Item name={'user_type'} label={'You are registered as'} >
                            <Radio.Group options={options}  onChange={this.typeChange}  value={typeChosen} optionType='button' buttonStyle={'solid'}/>
                        </Form.Item>
                        <Subform type={typeChosen}/>
                        <input id={'form_submit'} type={'submit'} hidden  />
                    </Form>
                </Drawer>
            </>
        );
    }
}

function LoginMenu(props){
    const [menuSelection, setMenuSelection] = React.useState('Customer');
    const handleClick = (e)=>{
        setMenuSelection(e.key);
    }
    const onFinish = (values) => {//登录请求
        values.user_type=menuSelection.toLowerCase();
        values.action='login'
        console.log('Received values of form: ', JSON.stringify(values));
        //todo 修改上一条代码发送POST请求，获取登录状态等

        fetch('http://localhost:5000/auth/login', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(values)
        }).then(res => {
            console.log('res',res)
            return res.json()
        }).then(result => {
            if(result.status=='success'){
                console.log("logged in as "+values.user_type);
                props.setUserType(result.user_type);
                props.setUsername(result.username);
            }
            if(result.status=='failed'){alert("Login failed.\n" + result.msg)}
        });

    };
    function Email(props){
            return(props.role==='Customer' || props.role==='Agent')?
                <Form.Item name = {'email'} rules={[{ required: true, message: 'Please enter your email' }]} >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>:<React.Fragment />}
    function AgentId(props){
        return(props.role==='Agent')?
            <Form.Item name = {'agent_ID'} rules={[{ required: true, message: 'Please enter your agent id' }]}>
                    <Input prefix={<IdcardOutlined />} placeholder={"Agent ID"} />
            </Form.Item> :<React.Fragment />}
    function Username(props){
        return(props.role==='Staff')?
                <Form.Item name = {'username'} rules={[{ required: true, message: 'Please enter your username' }]}>
                    <Input prefix={<UserOutlined />} placeholder={"Username"} />
                </Form.Item> :<React.Fragment />}

    return(
        <Content>
            <Menu mode={"horizontal"} selectedKeys={menuSelection} onClick={handleClick}>

                <Menu.Item key={"Customer"}>Customer</Menu.Item>
                <Menu.Item key={"Agent"}>Agent</Menu.Item>
                <Menu.Item key={"Staff"}>Staff</Menu.Item>
                <Menu.Item key={"Admin"}>Admin</Menu.Item>
            </Menu>
            <br/>


            <h1 style={{fontSize:"xx-large"}}>Welcome</h1>
            <Form onFinish={onFinish} style={{padding:'20px 50px'}} >
                <Email role={menuSelection} />
                <AgentId role={menuSelection} />
                <Username role={menuSelection} />
                <Form.Item  name = {'password'} rules={[{ required: true, message: 'Please enter your password' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder={"Password"} />
                </Form.Item>
                <br/>
                <div style={{padding:"0 80px"}}>
                    <Button type={"primary"} htmlType={'submit'}  block={true}>Login</Button>
                </div>
                <Text>Do not have an account? <DrawerForm />.</Text>

            </Form>


        </Content>

    )
}
function Ads() {
    const [showAds, setShowAds] = React.useState(true)
    console.log(showAds)
    return showAds===true?<div style={{position:'fixed', marginLeft:'50%', transform:'translate(-50%,0)'}}>
        <img src={'ads.png'} alt={"Ads"} width={'50%'}/>
        <CloseSquareOutlined style={{position:'absolute'}} onClick={()=>setShowAds(false)}/>
    </div>:<React.Fragment />
}

const Login = (props) => (
    <div className="App" >
        <div style={{
            width:'100%',
            height:"100vh",
            background:"linear-gradient(to bottom, #e6f7ff, #c9edff)",
            position:"absolute",
            zIndex:-1
        }}>
        </div>
        <Ads />
        <Layout>
            <Content>
                <div style={{
                    position: 'absolute',
                    bottom:'50%',
                    left:'50%',
                    transform:'translate(-50%,40%)',
                    width:"450px",
                    padding:'10px',
                    transition:'1s'
                }}>
                <img src={'./logo_white.png'} width={'150px'} style={{
                    transform:"translate(0,-70%)"
                }} alt={'logo'}></img>
                    <div style={{
                        border: 'rgba(0,0,0,0.3) 1px solid',
                        borderRadius:'20px',
                        borderSize:'2px',
                        backgroundColor:'white',
                        padding:'10px',
                        transition:'1s'
                    }}>
                    <LoginMenu setUserType={props.setUserType} setUsername={props.setUsername} />
                    </div>
                </div>
                <div className={'asGuest'}><a onClick={(e)=>{
                    e.preventDefault();
                    props.setUserType('guest')
                }}>
                    Continue as Guest >>
                </a></div>
            </Content>
            <Footer style={{
                position: 'absolute',
                bottom:0,
                width:'100%'
            }}>
                <Text>@Harry Lee, Zihang Xia | CSCI-SHU 213 Databases Course Project</Text>
            </Footer>
        </Layout>
    </div>
);

export default Login;