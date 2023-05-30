import React, { useEffect, useState, useContext } from 'react';
import NameForm from './NameForm';
import PlanningPokerGame from './PlanningPokerGame';
import VoterCard from './VoterCard';
import {SocketContext} from './Socketcontext'
import './App.css';
function PlanningPoker() {
  const [name, setName] = useState(null)
  const [room, setRoom] = useState(null)
  const [reveal, setReveal] = useState(false)
  const [isBossAvailable, setBossAvailablity] = useState(false)
  const socket = useContext(SocketContext);
  const [roomData, setRoomData] = useState([]);
  const urlRoom = new URLSearchParams(window.location.search).get('Id');
  const url = `${window.location.href}?Id=${room}`
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
    const reveal = !!roomData.filter(item => item.reveal && item.isAdmin).length
    const isBossAvailable = !!roomData.filter(item => item.isAdmin).length
    setBossAvailablity(isBossAvailable)
    setReveal(reveal)
  }, [roomData])
  useEffect(() => {
    const spans = document.querySelectorAll('.word span');

    spans.forEach((span, idx) => {
      span.addEventListener('click', (e) => {
        e.target.classList.add('active');
      });
      span.addEventListener('animationend', (e) => {
        e.target.classList.remove('active');
      });
      
      // Initial animation
      setTimeout(() => {
        span.classList.add('active');
      }, 750 * (idx+1))
    });
  }, [])
  return (
    <div className='app'>
      <div className='app1'>
        {/* <h1 className='heading'>PLANNING POKER</h1> */}
        <div class="word heading">
          <span>P</span>
          <span>L</span>
          <span>A</span>
          <span>N</span>
          <span>N</span> 
          <span>I</span> 
          <span>N</span> 
          <span>G</span> 
          <span>-</span>
          <span>P</span> 
          <span>O</span> 
          <span>K</span> 
          <span>E</span> 
          <span>R</span> 

        </div>
        {/* <h1><span class='one'>r</span><span class='two'>i</span><span class='three'>s</span><span class='four'>e</span> <span class='five'>u</span><span class='six'>p</span></h1> */}
        { (!name && !room) && <NameForm onNameUpdate={handleNameUpdate} urlRoom = {urlRoom}/> }
        {!urlRoom && room && <p className='urlClass'>URL - <span className='urlColor'>{url}</span></p>}
        {(name && room) && <h2 className='intro'>Hi {name}</h2>}
        { (name && room) && <PlanningPokerGame name={name}  room={room} urlRoom = {urlRoom} reveal={reveal} isBossAvailable = {isBossAvailable}/> }
        
        <VoterCard roomData = {roomData} reveal= {reveal}/>
      </div>
      <div className='app2'>
        <h1></h1>
      </div>
    </div>
  );
}

export default PlanningPoker;
