import React, { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat'
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {

  const [messages, setMessages] =useState([])

  useEffect(()=>{
    axios.get('/api/v1/messages/sync').then(response=>{
      setMessages(response.data);
    })
  },[])

  useEffect(()=>{
    const pusher = new Pusher('c33ce805418c47a65d61', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('messages');
    channel.bind("inserted", (newMessage)=> {
      setMessages([...messages, newMessage]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);
       

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar messages={messages} />
        <Chat messages={messages} />
      
      </div>  
    </div>
  );
}

export default App;
