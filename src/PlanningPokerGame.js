import React, { useState, useContext, useEffect } from 'react';
import {SocketContext} from './Socketcontext'
import './App.css'
function PlanningPokerGame({title:inputTitle , name, room, urlRoom, reveal, isBossAvailable}) {
  const [vote, setVote] = useState(null)
  const socket = useContext(SocketContext);
  const [title , setTitle] = useState(inputTitle);
  useEffect(() => {
  setTitle(inputTitle)
  }, [inputTitle])
  function handleVoteChange(e,val) {
    const voteValue = e.target.value
    console.log(voteValue,'ddd')
    if(voteValue) {
      setVote(voteValue);
      socket.emit('vote', {name, room, vote:voteValue});

    }
  }
  useEffect(() => {
    socket.on('restarted', () => {
      setVote(null)
  });
  }, [socket])

  
  const pokerNo = [1, 3, 5, 8, 13, 20, 40, 100]
  
  const handleReveal = () => {
    socket.emit('reveal', room);
  }

  const handleChangeTitle = () => {
    socket.emit('titleChange', room, title);
  }

  const handleChangeTitleInput = (event) => {
    const ttl =  event.target.value
    socket.emit('titleChange', room, ttl);
    setTitle(ttl);
  }

  const handleClear = () => {
    socket.emit('clear', room);

  }
  return (
    <div>
      {isBossAvailable ? <>
      
        <div className='wrapper'>
         <div className='titleWrapper'>
          {!urlRoom &&  <input name='title' className='textInput textInputTitle' value={title} placeholder='Title/Ticket/Issue or Anything...' onChange={handleChangeTitleInput}/>}
          {urlRoom &&  <p className='title'>
            {title}
          </p> }
         </div>
          
        {pokerNo.map(item => <>
        <input disabled={reveal} type="radio" name="select" id={item.toString()} onChange={handleVoteChange} value={item} checked={vote == item} />
        <label htmlFor={item.toString()} className="option">
           <span>
            {item}
            </span>
              </label>
             
         </>
         )}
          </div>
      {!urlRoom && <button className='button' onClick={handleReveal}>Reveal</button>}
      {!urlRoom && <button className='button' onClick={handleClear}>Restart</button>}
      </>
      : <p style={{color:'red'}}> Your Boss left. What are you are waiting for? You can also leave.</p>
    }
    </div>
  );
}

export default PlanningPokerGame;
