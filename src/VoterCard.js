import React from 'react';
import './App.css'

function VoterCard({roomData, reveal}) {

  const sortData = (a, b) => {
    if(a.isAdmin) {
      return -1;
    } else if(b.isAdmin) {
      return 1;
    } else if(a.voteDone && b.voteDone && reveal) {
      if(parseInt(a.vote) > parseInt(b.vote)) {
        return -1
      } else if(parseInt(a.vote) < parseInt(b.vote)) {
        return 1
      } else {
        if(a.name > b.name) {
          return 1;
        } else {
          return -1
        }
      }
    } else if(a.voteDone && b.voteDone && !reveal) {
      if(a.name > b.name) {
        return 1;
      } else {
        return -1
      }
    } else if(!a.voteDone && !b.voteDone) {
      if(a.name > b.name) {
        return 1;
      } else {
        return -1
      }
    }
     else if(a.voteDone) {
      return -1;
    } else if(b.voteDone) {
      return 1;
    } else {
      return 0
    }
  }
  return (
    <div>
      <h3 className='memberHeading'> All Members</h3>
      <ul className='memberUl'>
        {roomData && roomData.sort(sortData).map(item => <li 
        className={`memberLi ${item.voteDone ? 'memberLiGreen' : 'memberLiRed'} ${item.isAdmin ? 'adminRow' : ''}`}
        key={item.name}>
          <span>
          {item.name}
          </span>
          <span className='voteColumn'>
            {item.voteDone ? <img src={process.env.PUBLIC_URL + '/ok.png'} className='vote'/> : <img src={process.env.PUBLIC_URL + '/notok.png'} className='vote'/>}
          </span>
          <span>
            {reveal && `${item.vote}`}
          </span>
            </li>)}
      </ul>
    </div>
  );
}

export default VoterCard;
