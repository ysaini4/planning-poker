import React, { useEffect, useState, useContext } from 'react';
import NameForm from './NameForm';
import PlanningPokerGame from './PlanningPokerGame';
import VoterCard from './VoterCard';
import {SocketContext} from './Socketcontext'

function PlanningPoker() {
  const [name, setName] = useState(null)
  const [room, setRoom] = useState(null)
  const [reveal, setReveal] = useState(false)
  const socket = useContext(SocketContext);
  const [roomData, setRoomData] = useState([]);
  const urlRoom = new URLSearchParams(window.location.search).get('Id')
  const handleNameUpdate = (room, name) => {
    setRoom(room)
    setName(name)
  }
  useEffect(() => {
    console.log(urlRoom,'urlRoom---')
    if(urlRoom) {
      socket.emit('broadMember', urlRoom)
    }
  }, [urlRoom])

  useEffect(() => {
    socket.on('broadVote', ({roomData}) => {
      setRoomData(roomData)
  });
  }, [socket])

  useEffect(() => {
    const reveal = !!roomData.filter(item => !item.reveal).length
    setReveal(reveal)
  }, [roomData])
  
//  useEffect(() => {
//   if(room) {
//     console.log(room,'room-----')
//     const cipherText = AES.encrypt(room.toString(),'yogy').toString();
//     setChiper(cipherText)
//   }
//  }, [room])

//  useEffect(() => {
//   if(urlRoomEN) {
//     try{
//       const cipherText = AES.encrypt('1','yogy').toString();
//       const bytes = AES.decrypt(urlRoomEN, 'yogy');
//       const decrypted = bytes.toString(enc.Utf8);
//       console.log(decrypted,'decrypted--', urlRoomEN)
//       setUrlRoom(decrypted)
//     } catch(e) {
//       console.log('IN DECRYPTED ERROR')
//     }
//   }
//  }, [urlRoomEN])


  return (
    <div>
      <h1 style={{color:'#70a379'}}>PLANNING POKER</h1>
      { (!name && !room) && <NameForm onNameUpdate={handleNameUpdate} urlRoom = {urlRoom}/> }
      {!urlRoom && room && <p>URL - {`${window.location.href}?Id=${room}`}</p>}
      {(name && room) && <h2>Name: {name}</h2>}
      { (name && room) && <PlanningPokerGame name={name}  room={room} urlRoom = {urlRoom} reveal={reveal}/> }
      
      <VoterCard roomData = {roomData} />
      {/* render the rest of the planning poker game here */}
    </div>
  );
}

export default PlanningPoker;
