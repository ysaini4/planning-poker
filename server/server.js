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
  console.log('a user connected', socket.id);
  socket.on("disconnect", (reason) => {
    console.log('disconnet--', socket.id,'ssss')
    Object.keys(roomsData).forEach(room => {
      console.log(room, roomsData[room],'vv')
      roomsData[room] = roomsData[room].filter(user => user.id !== socket.id);
      io.to(room).emit('broadVote', {roomData: roomsData[room]})
    })
  });
  socket.on('broadMember', (room) => {
    io.to(room).emit('broadVote', {roomData: roomsData[room]})
  })
  socket.on('reveal', (room) => {
    roomsData[room].map(item => {
      if(item.isAdmin) 
        item.reveal = true;
    })
    io.to(room).emit('broadVote', {roomData: roomsData[room]})

  })

  socket.on('titleChange', (room, title) => {
    roomsData[room].map(item => {
      if(item.isAdmin) 
        item.title = title;
    })
    io.to(room).emit('broadVote', {roomData: roomsData[room]})

  })
  socket.on('clear', (room) => {
    roomsData[room].map(item => {
      item.vote = 0;
      item.voteDone = false;
      item.reveal = false;
    })
    io.to(room).emit('restarted')

    io.to(room).emit('broadVote', {roomData: roomsData[room]})

  })
  socket.on('vote', ({ name, room, vote }) => {
    const roomString = room.toString()
    console.log(vote,'voteeee')
    const voterData = roomsData[roomString] && roomsData[roomString].find(item => item.name === name)
    if (voterData) {

      voterData.vote = vote
      voterData.voteDone = true;
      io.to(room).emit('broadVote', {roomData: roomsData[room]})
    } else {
      console.log('No Data ')
    }

  });

  socket.on('createRoom', (name, room, title) => {
    console.log(`${name} joined the room ${room}--- ${socket.id}`);
    socket.join(room);
    createdRooms.push(room);
    roomsData[room] = []
    roomsData[room].push({
      name,
      vote: 0,
      id: socket.id,
      isAdmin: true,
      title: title
    })
    socket.emit('roomCreated', { room });
    io.to(room).emit('broadVote', {roomData: roomsData[room]})

  });

  socket.on("joinRoom", (name, room) => {
    const roomString = room.toString()
    if (createdRooms.indexOf(roomString) === -1) {
      console.log('No room created', room, createdRooms)
    } else {
      roomsData[roomString].push({
        name,
        vote: 0,
        id: socket.id
      })
      socket.emit('roomJoined');
      socket.join(room);
    io.to(room).emit('broadVote', {roomData: roomsData[room]})
      io.to(room).emit('broadVote', {roomData: roomsData[room]})
    }

  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
