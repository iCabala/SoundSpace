var roomInput;
var userInput;
var passwordInput;
var currentRoomName;
var currentUserName;
var socket = io();

$(window).ready(function () {

    //getPlaylist();
});

/*
 * Triggered when Create Room button is clicked on the landing page
 * Hides the landing page and reveals the secondary create room page if a room name is entered
 */
$(document).on('click', '#createRoomButton', function () {
    if (entryFieldsFilled()) {
        $("#landing").hide();
        $("#create").show();
        $("#errorField").text("");
    }
});

/*
 * Triggered when Create Continue button is clicked on the create room page
 * Hides the landing page and reveals the secondary create room page if a room name is entered
 */
$(document).on('click', '#createContinueButton', function () {
    passwordInput = $('[name = "pswdfield"]').val();
    $("#errorField").text("");
    createRoom(roomInput, userInput, passwordInput);
    
});

/*
 * Triggered when room name input field is clicked 
 * Resets the 'Room Name' placeholder text inside the input field
 * In case user previously caused the text to change to a warning 
 */
$(document).on('click', "#roomNameField", function () {
    $("#roomNameField").attr("placeholder", "Room Name");
});

/*
 * Triggered when user name input field is clicked 
 * Resets the 'User Name' placeholder text inside the input field
 * In case user previously caused the text to change to a warning 
 */
$(document).on('click', "#userNameField", function () {
    $("#userNameField").attr("placeholder", "User Name");
});


/*
 * Triggered when private radio button in secondary room creation screen is clicked
 * Reveals the password field
 */
$(document).on('click', '#privRadio', function () {
    $("#create > .input-field > input").show();
});

/*
 * Triggered when public radio button in secondary room creation screen is clicked
 * Resets and hides the password field
 */
$(document).on('click', '#pubRadio', function () {
    $('[name = "pswdfield"]').val();
    $("#create > .input-field > input").hide();
});

/*
 * Triggered when join room button is pressed on landing page
 * Hides the landing page if a room name is entered
 * Shows a password input field if the room is private
 */
$(document).on('click', '#joinRoomButton', function () {
    if (entryFieldsFilled()) {
        $("#errorField").text("");
        //Private room functionality not yet implemented.
        //$("#join").show();
        joinRoom(roomInput, userInput, "");
        //Error handling for private rooms
        //Trigger password input
    }
});

/*
 * Triggered when a Back button is clicked while either creating or joining a room
 * Hides the create/join room page and reverts to the landing page
 */
$(document).on('click', '.backButton', function () {
    if (entryFieldsFilled()) {
        $("#landing").show();
        $("#create").hide();
        $("#join").hide();
        $('.passwordField').val('');
        $("#errorField").text("");
    }
});

/* Function to change button text/classes/etc appropraitely upon clicking.
 *  Later on, can also be the starting point to actually do the upvote (i.e. to 
 *  propagate the vote onto the ordering of the queue)
 */
$(document).on('click', '.upvoteButton', function () {
    var $this = $(this);
    if (voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] == 0) {
        voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] = 1;
        socket.emit("upvote", $this.parent().prev().prev().prev().html());
    }
});


/* Function to change button text/classes/etc appropraitely upon clicking.
 *  Later on, can also be the starting point to actually do the undo upvote (i.e. to 
 *  propagate the undo upvote onto the ordering of the queue)
 */
$(document).on('click', '.undoUpvoteButton', function () {
    var $this = $(this);
    if (voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] == 1) {
        voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] = 0;
        socket.emit("downvote", $this.parent().prev().prev().prev().html());
    }
});


/* Function to change button text/classes/etc appropraitely upon clicking.
 *  Later on, can also be the starting point to actually do the downvote (i.e. to 
 *  propagate the downvote onto the ordering of the queue)
 */
$(document).on('click', '.downvoteButton', function () {
    var $this = $(this);
    if (voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] == 0) {
        voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] = -1;
        socket.emit("downvote", $this.parent().prev().prev().prev().html());
    }
});


/* Function to change button text/classes/etc appropraitely upon clicking.
 *  Later on, can also be the starting point to actually do the undo downvote (i.e. to 
 *  propagate the undo downvote onto the ordering of the queue)
 */
$(document).on('click', '.undoDownvoteButton', function () {
    var $this = $(this);
    if (voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] == -1) {
        voted[playlistorder[$this.parent().prev().prev().prev().attr("index")]] = 0;
        socket.emit("upvote", $this.parent().prev().prev().prev().html());
    }
});

/* Shows/hides the person who suggested the song
 *  Credits to Matt Kruse for the idea
 */
$(function () {
    $('tr.parent')
        .css("cursor", "pointer")
        .click(function () {
            $(this).siblings('.child-' + this.id).toggle();
        });
    $('tr[@class^=child-]').hide().children('td');
});

/*
 * Makes and AJAX call to create a new playlist at the back-end
 * TODO: Add any additional consequent action necessary to .done()
 *   which may be none...
 */

$(document).on('click', '#nextSong', function() {
    if (curr != playlist.length - 1) {
        curr++;
        index = playlistorder[curr];
        replaceAudioElement($("audio").prop("volume"));
        socket.emit("nextSong",{roomName: "demo"});
    }
});

$(document).on('click', '#prevSong', function () {
    if (curr != 0) {
        curr--;
        index = playlistorder[curr];
        replaceAudioElement($("audio").prop("volume"));
        socket.emit("prevSong",{roomName: "demo"});
    }
});

function createRoom(roomNameIn, userNameIn, passwordIn) {
    $.ajax({
        type: "POST",
        url: "/createRoom",
        dataType: "json",
        data: {
            roomName: roomNameIn,
            username: userNameIn,
            password: passwordIn,
        },
        statusCode: {
            201: function (data) {
                console.log("roomcreated");
                console.log(data);
                $("#create").hide();
                $("#playlist").show();
                getFileInput();
                socket.emit("joinRoom",{roomName: roomNameIn});
                socket.emit("getPlaylist");
            },
            400: function () {
                $("#errorField").text("Room Name already exists. Select a different room name.");
            },
            500: function () {
                $("#errorField").text("Internal Server Error");
            }
        }
    })
};



/*
 * Makes and AJAX call to log into a specified playlist at the back-end
 * TODO: Add any additional consequent action necessary to .done()
 *   which may be none...
 */
function joinRoom(roomNameInput, userNameInput, passwordInput) {
    var data = {
        roomName: roomNameInput,
        username: userNameInput,
        password: passwordInput
    };
    $.ajax({
        type: "POST",
        url: "/joinRoom",
        dataType: "json",
        data: data,
        statusCode: {
            200: function (data) {
                $("#landing").hide();
                $("#playlist").show();
                $("#currently_playing").hide();
                console.log(data);
                console.log(userNameInput + " logged into: " + roomNameInput + " successfully.");
                socket.emit("joinRoom",{roomName: roomNameInput});
                socket.emit("getPlaylist");
            },
            400: function () {
                $("#errorField").text("Room not found.");
            },
            500: function () {
                $("#errorField").text("Internal Server Error.");
            }
        }
    })
};

var playlist = [];
var playlistorder = [];
var songinfo = [];
var songurls = [];
var songpaths = [];
var curr = -1;
var index = 0;
var counter = 0;
var voted = [];
//Handles dealing with file Input
function getFileInput() {
    var fileInput = document.getElementById("FileInput");
    fileInput.addEventListener('change', function (evt) {
        songinfo = [];
        songurls = [];
        songpaths = [];
        for (i = 0; i < fileInput.files.length; i++) {
            var file = fileInput.files[i],
                url = file.urn || file.name;
            songurls.push(url);
            songinfo.push("");
        }
        readFile(fileInput.files, 0);
    });
}

function readFile(files, i) {
    var file = files[i];
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            songpaths.push(e.target.result.toString());
            playlist.push(e.target.result.toString());
            voted.push(0);
            ID3.loadTags(songurls[i], function () {
                writeSongName(i);
            }, {
                tags: ["title", "artist", "album", "picture"],
                dataReader: ID3.FileAPIReader(file)
            });
            if (i == files.length - 1) {
                if (curr == -1) {
                    curr = 0;
                    replaceAudioElement(1);
                }
            } else {
                readFile(files, i + 1);
            }
        };
    })(file);
    reader.readAsDataURL(file);
}

function sendUpdate() {
    socket.emit("playlistUpdate", {
        songs: songinfo,
        updateType: "add",
        roomName: "demo"
    });
}


function replaceAudioElement(volume) {
    $("audio").remove();
    $(".first").after("<audio controls autoplay='autoplay'></audio>");
    $("audio").append("<source id='player' src='" + playlist[index] + "' type='audio/mp3'>");
    $("audio").append("Your browser does not support this music player.");
    $("audio").prop("volume", volume);
    $("audio").on("ended", function () {
        if (curr != playlist.length - 1) {
            curr++;
            index = playlistorder[curr];
            replaceAudioElement($("audio").prop("volume"));
            socket.emit("nextSong",{roomName: "demo"});
        }
    });

}


/*Displays the song info after loaded
 * TODO: change function to send data to server
 */
function writeSongName(i) {
    var url = songurls[i];
    var tags = ID3.getAllTags(url);
    songinfo[i] = {
        "title": tags.title,
        "album": tags.album,
        "artist": tags.artist,
        "score": 0,
        "index": counter
    }
    counter++;
    if (i == songinfo.length-1) {
        sendUpdate();
    }
}

function entryFieldsFilled() {
    roomInput = $("#roomNameField").val();
    userInput = $("#userNameField").val();

    if (roomInput == "" || userInput == "") {
        if (roomInput == "") {
            $("#roomNameField").attr("placeholder", "You must enter a room to continue");
        }
        if (userInput == "") {
            $("#userNameField").attr("placeholder", "You must enter a user name to continue");
        }
        return false;
    }
    return true;
}

socket.on("playlistClientUpdate", function(room) {
    $("#songPlaylist").empty();
    var counter = 0;
    playlistorder = [];
    for (i=0;i<room.playedSongs.length;i++) {
        playlistorder.push(room.playedSongs[i].index);
        insertPlayedSong(room.playedSongs[i].title,room.playedSongs[i].artist,room.playedSongs[i].album, counter);
        counter++;
    }
    if(room.currentSong != null) {
        playlistorder.push(room.currentSong.index);
        insertPlayedSong(room.currentSong.title,room.currentSong.artist,room.currentSong.album, counter);
        counter++;
    }
    for (i=0;i<room.upcomingSongs.length;i++) {
        playlistorder.push(room.upcomingSongs[i].index);
        insertSong(room.upcomingSongs[i].title,room.upcomingSongs[i].artist,room.upcomingSongs[i].album, counter);
        counter++;
    }
    
});

socket.on("roomClosed", function() {
    location.reload();
});

function insertSong(title, artist, album, i) {
    var idupvote = title.replace(/\s+/g, '') + i + 'u';
    var iddownvote = title.replace(/\s+/g, '') + i + 'd';
    if (voted[playlistorder[i]] == 0) {
        $("#songPlaylist").append(`<tr class ='parent' id='row'`+i+`>
        <td index=`+i+`>`+title+`</td>
        <td>`+artist+`</td>
        <td>`+album+`</td>
        <td>
            <button type="button" id=`+idupvote+` class="voteBtn upvoteButton">Upvote</button> 
            <button type="button" id=`+iddownvote+` class="voteBtn downvoteButton" style.display="block">Downvote</button>
        </td>
        </tr>
        <tr class='child-row'`+i.toString()+` style='display: none;'>
            <td></td><td></td><td></td>
            <td>Suggested by host</td>
        </tr>`);
    }
    else if (voted[playlistorder[i]] == 1){
        $("#songPlaylist").append(`<tr class ='parent' id='row'`+i+`>
        <td index=`+i+`>`+title+`</td>
        <td>`+artist+`</td>
        <td>`+album+`</td>
        <td>
            <button type="button" id=`+idupvote+` class="voteBtn undoUpvoteButton">Undo Upvote</button> 
        </td>
        </tr>
        <tr class='child-row'`+i.toString()+` style='display: none;'>
            <td></td><td></td><td></td>
            <td>Suggested by host</td>
        </tr>`);
    }
    else {
        $("#songPlaylist").append(`<tr class ='parent' id='row'`+i+`>
        <td index=`+i+`>`+title+`</td>
        <td>`+artist+`</td>
        <td>`+album+`</td>
        <td>
            <button type="button" id=`+iddownvote+` class="voteBtn undoDownvoteButton" style.display="block">Undo Downvote</button>
        </td>
        </tr>
        /*
        <tr class='child-row'`+i.toString()+` style='display: none;'>
            <td></td><td></td><td></td>
            <td>Suggested by host</td>
        </tr>
        */
    `);
    }
    
}

function insertPlayedSong(title, artist, album, i) {
    var idupvote = title.replace(/\s+/g, '') + i + 'u';
    var iddownvote = title.replace(/\s+/g, '') + i + 'd';
    $("#songPlaylist").append(`<tr class ='parent' id='row'`+i+`>
        <td>`+title+`</td>
        <td>`+artist+`</td>
        <td>`+album+`</td>
        <td colspan=2></td>
        </tr>
        /*
        <tr class='child-row'`+i+` style='display: none;'>
            <td></td><td></td><td></td>
            <td>Suggested by host</td>
        </tr>
        */
    `);
}