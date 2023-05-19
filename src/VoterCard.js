import React from 'react';

function VoterCard({roomData}) {
  return (
    <div>
      <h3> All Members</h3>
      <ul>
        {roomData && roomData.map(item => <li key={item.name}>{item.name} -- {item.voteDone ? 'Voted' : 'Not voted yet'} {item.reveal && `-- ${item.vote}`}</li>)}
      </ul>
    </div>
  );
}

export default VoterCard;
