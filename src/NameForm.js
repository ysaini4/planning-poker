import React, { useState, useContext, useEffect } from 'react';
import {SocketContext} from './Socketcontext'
import ShortUniqueId from 'short-unique-id';
import './App.css';

function NameForm({onNameUpdate, urlRoom}) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const socket = useContext(SocketContext);
  const uniqueId = new ShortUniqueId({ length: 10 });
  const handleChange = (event) => {
    setName(event.target.value);
  }
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
 
    if(urlRoom) {
      socket.emit('joinRoom', name, urlRoom);
      socket.on('roomJoined', () => {
        onNameUpdate(urlRoom, name)
      });
    } else {
      const room = uniqueId()
      socket.emit('createRoom', name, room, title); // emit a 'join' event with the user's name
      socket.on('roomCreated', (room) => {
        onNameUpdate(room.room, name, title)
      });
    
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        
        <input className='textInput' type="text" value={name} onChange={handleChange} placeholder='Enter Your Name'/>
        <br />
        {/* {!urlRoom && <input className='textInput' type="text" value={title} onChange={handleChangeTitle} placeholder='Title or Ticket/Jira No.'/>} */}
      </label>
      <button className='button nameButton' type="submit">Submit</button>
    </form>
  );
}

export default NameForm;
