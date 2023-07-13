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
  const [titleInput, setTitleInput] = useState();
  useEffect(() => {
    const handler = setTimeout(() => {
        if(!urlRoom) {
        socket.emit('titleChange', room, titleInput);
        setTitleInput(titleInput);
      }
      }, 500);

    return () => {
      clearTimeout(handler);
    };
  },
  [titleInput]
  );
  
  const pokerNo = [1, 2, 3, 5, 8, 13, 20, 40]
  
  const handleReveal = () => {
    socket.emit('reveal', room);
  }

  const handleChangeTitleInput = (event) => {
    setTitleInput(event.target.value)
  }

  const handleClear = () => {
    socket.emit('clear', room);

  }

  return (
    <div>
      {isBossAvailable ? <>
      
        <div className='wrapper'>
         <div className='titleWrapper'>
          {!urlRoom &&  <input name='title' className='textInput textInputTitle' placeholder='Title/Ticket/Issue or Anything...' onChange={handleChangeTitleInput}/>}
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
