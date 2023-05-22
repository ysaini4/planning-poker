import React, { useState, useContext, useEffect } from 'react';
import {SocketContext} from './Socketcontext'
import ShortUniqueId from 'short-unique-id';
function NameForm({onNameUpdate, urlRoom}) {
  const [name, setName] = useState('');
  const socket = useContext(SocketContext);
  const uniqueId = new ShortUniqueId({ length: 10 });
  const handleChange = (event) => {
    setName(event.target.value);
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
      console.log(room,'room---')
      socket.emit('createRoom', name, room); // emit a 'join' event with the user's name
      socket.on('roomCreated', (room) => {
          console.log(room,'ddd')
        onNameUpdate(room.room, name)
      });
    
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default NameForm;
