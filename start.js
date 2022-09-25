const express = require('express');
const app = express();
const http = require('http').Server(app);

const socket = require("socket.io");

//integrating socketio
io = socket(http);

var users = [];

require('dotenv').config();


io.on("connection", (socket) => {
    //attach incoming listerner for new user
    // console.log("User connected", socket.id);

    socket.on('user_connected', function(userId) {
        console.log("user connected " + userId);
        //save in array
        users[userId] = socket.id;

        //notify all connected clients
        io.emit("updateUserStatus", users);
        

        // // //notify all connected clients
        // io.emit("user_connected", username);
    });

    socket.on('disconnect', function() {
        var i = users.indexOf(socket.id);
        users.splice(i, 1, 0);

        //add date and emit to user
        //notify all connected clients
        io.emit("user-disconnected", users);

    });

    socket.on('send_message', (data)=>{
        console.log(data);

        //send event to receiver
        var socketId = users[data.receiver];
        io.to(socketId).emit("new_message", data);
        io.emit("updateUserStatusChat", users);


        // //save to database
        // let value = [
        //                 [data.sender, data.receiver, data.message]
        //             ];
        // let sql = "INSERT INTO messages (sender, receiver, message) VALUES ?";
        // connection.query(sql, [value], (err, result) =>{
        //     if (err) throw err;
        //     // console.log(result);
        // });

    
    });
});

const port = 4000;
http.listen(port, () => {
    console.log('Running on port: '+port);
});
