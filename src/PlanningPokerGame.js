// PlanningPokerGame.js

import React, { useState, useContext } from 'react';
import {SocketContext} from './Socketcontext'

function PlanningPokerGame({name, room, urlRoom, reveal}) {
  const [vote, setVote] = useState(null)
  const socket = useContext(SocketContext);

  function handleVoteChange(e) {
   // setVotes((prevVotes) => [...prevVotes, vote]);
    if(e.target.value) {
      setVote(e.target.value)
    }
    // // Calculate the average of all votes
    // const total = votes.reduce((acc, curr) => acc + curr, 0);
    // const avg = total / votes.length;
    // setAverage(avg);
  }
  const handleVote = () => {
    socket.emit('vote', {name, room, vote});
    socket.emit('S')
  }

  // socket.on('broadVote', ({roomData}) => {
  //     console.log(roomData, 'ddd')
  // });
  
  const pokerNo = [1, 2, 3, 5, 8, 13, 20, 40, 100]
  
  const handleReveal = () => {
    socket.emit('reveal', room);
  }
  const handleClear = () => {
    socket.emit('clear', room);

  }
  return (
    <div>
      <select onChange={handleVoteChange} disabled={!reveal}>
        <option value={0}>Select Your Poker Value</option>
        {pokerNo.map(item => <option value={item} key={item}>{item}</option>)}
      </select>
      {reveal && <button onClick={handleVote}>Vote</button>}
      {!urlRoom && <button onClick={handleReveal}>Reveal</button>}
      {!urlRoom && <button onClick={handleClear}>Restart</button>}
    </div>
  );
}

export default PlanningPokerGame;
