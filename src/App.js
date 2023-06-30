// App.js

import React, {createContext} from 'react';
import PlanningPoker from './PlanningPoker';
import io from 'socket.io-client';
import {SocketContext} from './Socketcontext';
//const server = 'https://fast-depths-40126.herokuapp.com';
const server = 'https://poker-server-vkeg.onrender.com';
const server_local = 'http://localhost:3001';
const socket = io(server_local, {  autoConnect: true, transports: ['websocket'] }); // connect to the socket.io server
function App() {
  
  return (
    <div>
        <SocketContext.Provider value={socket}> 
       <PlanningPoker />
        </SocketContext.Provider>
    </div>
  );
}

export default App;
