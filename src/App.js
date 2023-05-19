// App.js

import React, {createContext} from 'react';
import PlanningPoker from './PlanningPoker';
import io from 'socket.io-client';
import {SocketContext} from './Socketcontext'
const socket = io('https://fast-depths-40126.herokuapp.com', {  autoConnect: true, transports: ['websocket'] }); // connect to the socket.io server
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
