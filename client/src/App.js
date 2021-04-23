import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home/Home';
import UserPanel from './components/UserPanel/UserPanel';
import "./App.css";


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getUser = () => {
      axios({
        url: '/user',
        method: 'GET'
      }).then(res => {
        if (res.data !== "")
          setData(res.data);
      });
    }

    getUser();
  }, []);

  return (
    <div id="container">
      <header className="title" id="mainHeader">
        <h1>Movie Picker</h1>
      </header>
      <UserPanel 
        id="userPanel" 
        data={data} 
        setData={setData} />
      <Home data={data} />
      <footer className="small" id="mainFooter">Jakub Korzeniewski &copy; 2021</footer>
    </div>
  );
}

export default App;
