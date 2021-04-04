import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Login from './pages/login/Login.js';
import Main from './pages/main/main.js';

import reportWebVitals from './reportWebVitals';

function Root(){
    const [userType, setUserType] = React.useState('guest');
// userType can be [guest, login, admin, agent, customer]

    if (userType=='guest') {
        return <Main setUserType={setUserType}/>
    }
    else if (userType=='login'){
        return <Login setUserType={setUserType}/>
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));

reportWebVitals();
