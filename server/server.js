const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const createdRooms = []
const roomsData = {}
const port = process.env.PORT || 3001;
const io = require('socket.io')(server);


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('broadMember', (room) => {
    const roomString = room.toString()
    console.log(roomsData[roomString],'ddddd---')
    socket.emit('broadVote', { roomData: roomsData[roomString] });
    socket.broadcast.emit('broadVote', {roomData: roomsData[roomString]});
  })
  socket.on('reveal', (room) => {
    roomsData[room].map(item => {
      item.reveal = true;
    })
    socket.emit('broadVote', { roomData: roomsData[room] });
    socket.broadcast.emit('broadVote', {roomData: roomsData[room]});

  })
  socket.on('clear', (room) => {
    roomsData[room].map(item => {
      item.vote = 0;
      item.voteDone = false;
      item.reveal = false;
    })
    socket.emit('broadVote', { roomData: roomsData[room] });
    socket.broadcast.emit('broadVote', {roomData: roomsData[room]});

  })
  socket.on('vote', ({ name, room, vote }) => {
    const roomString = room.toString()
    const voterData = roomsData[roomString] && roomsData[roomString].find(item => item.name === name)
    if (voterData) {

      voterData.vote = vote
      voterData.voteDone = true;
      console.log("HERRE vote")

      socket.broadcast.emit('broadVote', {roomData: roomsData[roomString]});
      socket.emit('broadVote', { roomData: roomsData[roomString] });
    } else {
      console.log('No Data ')
    }

  });

  socket.on('createRoom', (name, room) => {
    console.log(`${name} joined the room ${room}`);
    // const user = userJoin(socket.id, name, room); 
    // create a new room with the user's name as the room ID
    // let i = 0;
    // let room = i.toString();
    // let roomSeleted = false;
    // while (!roomSeleted) {
    //   i++;
    //   room = i.toString();
    //   if (createdRooms.indexOf(room) === -1) {
    //     roomSeleted = true
    //     createdRooms.push(room);
    //   }


    // }
    //socket.join(room);
    createdRooms.push(room);
    roomsData[room] = []
    roomsData[room].push({
      name,
      vote: 0
    })
    // emit room name to the client
    socket.emit('roomCreated', { room });
    console.log("HERRE create")

    socket.broadcast.emit('broadVote', { roomData: roomsData[room] });
    socket.emit('broadVote', { roomData: roomsData[room] });

    // socket.broadcast.to(name).emit('join', `${name} has joined the room`);

  });

  // Handle joining a room
  socket.on("joinRoom", (name, room) => {
    const roomString = room.toString()
    if (createdRooms.indexOf(roomString) === -1) {
      console.log('No room created', room, createdRooms)
    } else {
      roomsData[roomString].push({
        name,
        vote: 0
      })
      socket.emit('roomJoined');
      console.log("HERRE join")

      socket.broadcast.emit('broadVote', { roomData: roomsData[roomString] });
      socket.emit('broadVote', { roomData: roomsData[roomString] });

    }

  });
});

// app.get('/', (req, res) => {
//   res.send('Server is up and running.');
// });

server.listen(port, () => console.log(`Listening on port ${port}`));
