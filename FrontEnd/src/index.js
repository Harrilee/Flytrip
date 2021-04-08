import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Login from './pages/login/Login.js';
import Main from './pages/main/main.js';
import Customer from "./pages/customer/customer";

import reportWebVitals from './reportWebVitals';

function Root(){
    const [userType, setUserType] = React.useState('guest');
    const [username, setUsername] = React.useState('Guest');
// userType can be [guest, login, admin, agent, customer]

    fetch('http://localhost:5000/auth/getSessionInfo', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify('')
    }).then(res => {
        console.log('res',res)
        return res.json()
    }).then(result => {
        if(result.status=='success'){setUserType(result.user_type)}
        if(result.status=='failed'){console.log('No login info found')}
    });

    console.log(userType)
    if (userType=='guest') {
        return <Main setUserType={setUserType}/>
    }
    else if (userType=='login'){
        return <Login setUserType={setUserType} setUsername={setUsername}/>
    }
    else if (userType=='customer'){
        return <Customer setUserType={setUserType} username={username}/>
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));

reportWebVitals();
