import React, { useState, useEffect }from "react";
import {useLocation, Link} from "react-router-dom";
import querString from 'query-string';
import io from 'socket.io-client';

let socket;
const Chat = ()=>{
    const {search}=useLocation();
    const {name, room}=querString.parse(search);
    const [messages, setMessages]=useState([]);

    useEffect(()=>{
        socket = io("http://localhost:4000");
        socket.emit("join", {name, room}, (error)=>{
            if(error){
                alert(error);
            }
        });

        socket.on('message', (message)=>{
            setMessages((exsistingMsgs=>[...exsistingMsgs, message]));
        });
    }, []);

    const sendMessage=(e)=>{
        let message=e.target.value;
        if(e.key==='Enter' && message){
            socket.emit("message", message);
            e.target.value="";
        }
    };

    return <div className="chat">
        <div className="chat-head">
            <div className="room">{room}</div>
            <Link to="/">X</Link>
        </div>
        <div className="chat-box">
            <div className="messages">
                {messages.map((message, index)=>(
                <div key={index} className="message">{message.user}:{message.text}</div>
                ))}
            </div>
            <input placeholder="message" onKeyDown={sendMessage}/>
        </div>
    </div>
};

export default Chat;