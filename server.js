var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var app = express();
var server = app.listen(3000);
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); //for JSON parsing for request body
var io = require('socket.io').listen(server);
var ios = require('socket.io-express-session');
var session = require('express-session');
var options = {
    root: __dirname
}


//Connect to MongoDB database
var DB_PORT = "27017";
mongoose.connect('mongodb://localhost:' + DB_PORT + "/301db");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log.bind(console, 'connection success');
});

//Create db schema for users
var roomSchema = mongoose.Schema({
    roomName: String,
    password: String,
    hostUser: String,
    clientUsers: [String],
    upcomingSongs: [{
        title: String,
        artist: String,
        album: String,
        score: Number,
        index: Number
    }],
    playedSongs: [{
        title: String,
        artist: String,
        album: String,
        score: Number,
        index: Number
    }],
    currentSong: {
        title: String,
        artist: String,
        album: String,
        score: Number,
        index: Number
        
    },
    availableSongs: [{
        title: String,
        artist: String,
        album: String,
        score: Number,
        index: Number
    }]
});
var Room = mongoose.model('Room', roomSchema);

//serve static files
app.use(express.static(__dirname + '/static'));

//bind session middleware
var sess = session({
    secret: 'csc301group',
    cookie: {
        secure: true
    },
    saveUninitialized: true,
    resave: true
});
    
app.use(sess);
io.use(ios(sess));

//Bind middleware for parsing response
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var socketList = {};

io.on('connection', function (socket) {
    console.log("a user connected");
    socket.on('availableSongUpdate', function (json) {
        Room.findOne({
                roomName: socket.handshake.session.room
            },
            function (err, room) {
                if (json.updateType === "add") {
                    for (i = 0; i < json.songs.length; i++) {
                        room.availableSongs.push(json.songs[i]);
                    }
                } else if (json.updateType === "remove") {
                    for (i = 0; i < json.songs.length; i++) {
                        room.availableSongs.splice(indexOf(json.songs[i]), 1);
                    }
                }
                room.save();
                socketList[socket.handshake.session.room].forEach(function(esocket){
                    esocket.emit('availableSongClientUpdate', room);
                });
            });
    });

    socket.on('playlistUpdate', function (json) {
        Room.findOne({
                roomName: socket.handshake.session.room
            },
            function (err, room) {
                if(room) {
                    if (json.updateType === "add") {
                        for (i = 0; i < json.songs.length; i++) {
                            room.upcomingSongs.push(json.songs[i]);
                            if (room.currentSong == "null") {
                                room.currentSong = room.upcomingSongs.shift();
                            }
                        }
                    } else if (json.updateType === "remove") {
                        for (i = 0; i < json.songs.length; i++) {
                            room.upcomingSongs.splice(indexOf(json.songs[i]), 1);
                        }
                    }
                    room.upcomingSongs.sort(compare);
                    room.save();
                    socketList[socket.handshake.session.room].forEach(function(esocket){
                        esocket.emit('playlistClientUpdate', room);
                    });
                }
                else {
                    console.log("room not found", socket.handshake.session.room);
                }
            });
    });

    socket.on('nextSong', function (json) {
        Room.findOne({
                roomName: socket.handshake.session.room
            },
            function (err, room) {
                if (room.upcomingSongs.length > 0) {
                    room.playedSongs.push(room.currentSong);
                    room.currentSong = room.upcomingSongs.shift();
                }
                room.upcomingSongs.sort(compare);
                room.save();
                socketList[socket.handshake.session.room].forEach(function(esocket){
                    esocket.emit('playlistClientUpdate', room);
                });
            });
    });
    
    socket.on('prevSong', function (json) {
        Room.findOne({
                roomName: socket.handshake.session.room
            },
            function (err, room) {
                if (room.playedSongs.length > 0) {
                    room.upcomingSongs.unshift(room.currentSong);
                    room.currentSong = room.playedSongs.pop();
                }
                room.upcomingSongs.sort(compare);
                room.save();
                socketList[socket.handshake.session.room].forEach(function(esocket){
                    esocket.emit('playlistClientUpdate', room);
                });
            });
    });
    
    socket.on('joinRoom', function (json) {
        socket.handshake.session.room = json.roomName;
        socket.handshake.session.uid = guid();
        Room.findOne({
           roomName: json.roomName
        },
        function(err, room) {
            if(room) {
                if (room.hostUser == null) {
                    room.hostUser = socket.handshake.session.uid;
                    room.save();
                    socketList[socket.handshake.session.room] = [socket];
                }
                else {
                    room.clientUsers.push(socket.handshake.session.uid);
                    room.save();
                    socketList[socket.handshake.session.room].push(socket);
                }
            }
        });
    });
    
    socket.on("getPlaylist", function(json) {
        Room.findOne({
           roomName: socket.handshake.session.room
        },
        function(err, room) {
            if(room) {
                socket.emit('playlistClientUpdate', room);
            }
        });
    });
    
    socket.on("upvote", function(title) {
        Room.findOne({
           roomName: socket.handshake.session.room
        },
        function(err, room) {
            if(room) {
                for (i=0; i<room.upcomingSongs.length;i++) {
                    if (title == room.upcomingSongs[i].title) {
                        room.upcomingSongs[i].score++;
                        room.upcomingSongs.sort(compare);
                    }
                }
                room.save();
                socketList[socket.handshake.session.room].forEach(function(esocket){
                    esocket.emit('playlistClientUpdate', room);
                });
            }
        });
    });
    socket.on("downvote", function(title) {
        Room.findOne({
           roomName: socket.handshake.session.room
        },
        function(err, room) {
            if(room) {
                for (i=0; i<room.upcomingSongs.length;i++) {
                    if (title == room.upcomingSongs[i].title) {
                        room.upcomingSongs[i].score--;
                        room.upcomingSongs.sort(compare);
                    }
                }
                room.save();
                socketList[socket.handshake.session.room].forEach(function(esocket){
                    esocket.emit('playlistClientUpdate', room);
                });
            }
        });
    });
    
    socket.on('disconnect', function () {
        console.log("user disconnected");
        Room.findOne({
           roomName: socket.handshake.session.room
        },
        function(err, room) {
            if(room && room.hostUser == socket.handshake.session.uid) {
                room.remove(function(err,removed) {
                    socketList[socket.handshake.session.room].forEach(function(esocket){
                        esocket.emit('roomClosed');
                    });
                });
            }
            else if (room) {
                var index = room.clientUsers.indexOf(socket.handshake.session.uid);
                if (index > -1) {
                    room.currentUsers.splice(index, 1);
                    socketList[socket.handshake.session.room].forEach(function(esocket){
                        esocket.emit('userLeft', {room: room, user: socket.handshake.session.uid});
                    });
                    room.save();
                }
            }
        });
    });
});

function compare(a, b) {
  if (a.score > b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }
  return 0;
}

app.get('/id3-minimized.js', function (req, res) {
    res.sendfile('./static/id3-minimized.js');
});

app.post('/joinRoom', function (request, response) {
    console.log('joining room');
    Room.findOne({
            roomName: request.body.roomName
        },
        function (err, room) {
            if (err) {
                response.status(500);
                response.send({
                    "ErrorCode": "INTERNAL_SERVER_ERROR"
                });
                console.error(err);
                return response.end();
            }
            if (!room) { //if room not found, return 400
                response.status(400);
                response.send({
                    "ErrorCode": "ROOM_NOT_FOUND"
                });
                console.log("room not found");
                return response.end();
            }
            if (room.clientUsers.indexOf(request.body.username) === -1) {
                console.log("room joined");
                request.session.username = (request.body.username);
                request.session.room = (request.body.roomName);
                room.save(function (err) {
                    if (err) {
                        response.status(500);
                        response.send({
                            "ErrorCode": "INTERNAL_SERVER_ERROR"
                        });
                        console.error(err);
                        return response.end();
                    }
                });
                response.status(200); //returns 200 on success
                io.emit('userJoin', room);
                response.send(room); //returns user as response
                return response.end();
            } else {
                response.status(400);
                response.send({
                    "ErrorCode": "BAD_USERNAME"
                });
                console.log("usernametaken");
                return response.end();
            }
        });
});

app.post('/createRoom', function (request, response) {
    console.log('creating room');
    Room.findOne({
            roomName: request.body.roomName
        },
        function (err, room) {
            if (err) {
                response.status(500);
                response.send({
                    "ErrorCode": "INTERNAL_SERVER_ERROR"
                });
                console.error(err);
                return response.end();
            }
            if (room) { //if room not found, return 400
                response.status(400);
                response.send({
                    "ErrorCode": "ROOM_NAME_TAKEN"
                });
                console.error("ROOM_NAME_TAKEN");
                return response.end();
            } else {
                var newRoom = new Room;
                newRoom.roomName = request.body.roomName;
                newRoom.password = request.body.password;
                newRoom.hostUser = null;
                newRoom.availableSongs = [];
                newRoom.upcomingSongs = [];
                newRoom.playedSongs = [];
                newRoom.currentSong = {};
                newRoom.save(function (err) {
                    if (err) {
                        response.status(500);
                        response.send({
                            "ErrorCode": "INTERNAL_SERVER_ERROR"
                        });
                        console.error(err);
                        return response.end();
                    }
                });
                response.status(201);
                response.send(newRoom);
                return response.end();
            }
    });
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}