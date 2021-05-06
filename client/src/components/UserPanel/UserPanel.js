import React, { useState } from 'react';
import axios from 'axios';
import './UserPanel.css';

function UserForm(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = (source) => (event) => {
      event.preventDefault();
  
      const userData = {
        name: name,
        email: email,
        password: password
      };
  
      axios({
        url: `/${source}`,
        method: 'POST',
        data: userData
      })
        .then((res) => {
          setName("");
          setEmail("");
          setPassword("");

          if (source === "login")
            props.setData(res.data);
          else
            alert(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.status === 404)
            alert(err.response.data);
          else
            console.log(err);
        });
    };
    
    const setUserName = (props.source === "register") ?
      (<p>
        <label htmlFor="username">Username:</label> 
        <input 
          type="text"
          name="username"  
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength="254" 
          autoFocus
          required />
      </p>) : undefined;

    return (
      <form id={props.source} onSubmit={submit(props.source)}>
        {setUserName}
        <p>
            <label htmlFor="email">Email:</label> 
            <input 
              type="text"
              name="email"  
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="254" 
              required />
        </p>
        <p>
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>
        </p>
        <button type="submit">log in</button>
      </form>
    );
  
}

function UserPanel({data, setData}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handlePanel = () => {
      setIsOpen(!isOpen);
    };

    const logout = () => {
      axios({
          url: '/logout',
          method: 'POST'
        })
          .then((res) => {
            setData(null);
            alert(res.data);
          })
          .catch(err => {
            if (err.response && err.response.status === 403)
              alert(err.response.data);
            else
              console.log(err);
          });
    }

    if (data !== null) {
      return (
        <div id="panel">
          <i className={"far fa-user-circle fa-3x" + (isOpen ? " active" : "")}
             id="opener"
             onClick={handlePanel}
          ></i>
          <div className={isOpen ? "active" : ""} id="box">
            <p>Hello, {data.name}</p>
            <div className="wrapper" onClick={logout}>Logout</div>
          </div>
        </div>
      );
    }

    const renderForm = (shouldRender, source) => {
      if (shouldRender)
        return <UserForm id={source} source={source} setData={setData} />;
      else
        return undefined;
    };

    return (
        <div id="panel">
            <i className={"far fa-user-circle fa-3x" + (isOpen ? " active" : "")}
             id="opener"
             onClick={handlePanel}
            ></i>
            <div className={isOpen ? "active" : ""} id="box">
              <div 
                className="wrapper" 
                onClick={() => setShowLogin(!showLogin)}>
                Login
              </div>
              { renderForm(showLogin, "login") }
              <div 
                className="wrapper" 
                onClick={() => setShowRegister(!showRegister)}>
                Register
              </div>
              { renderForm(showRegister, "register") }
            </div>
        </div>
    );
}

export default UserPanel;