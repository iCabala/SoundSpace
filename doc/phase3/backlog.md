Status at completion of Phase 2:

UI/UX:
Application has a working but rudimentary interface, able to navigate between login and playlist view.

Front End:
Able to play music loaded from file, pending issues switching to following songs.
Front End is able to make get Playlist request from back end, and display the given playlist on screen.

Back End:
Node.js and Express server successfully runs and listens, able to load playlists from json object as a placeholder measure. 


First user flow:
Landing page, user selects create new room
    New room is created
User is the first user in the room, is assumed to be host-user
Host user makes a set of local files available as available songs
Users (host or otherwise) add songs to the room/playlist from the list of available songs
voting/reordering functionality (elaborate)



Work to be Done in Phase 3 for foreseen MVP:


UI/UX:
Must have a final UI and working interaction design that switches between login, room and playlist views

Front-end:
All buttons/links must be connected to necessary div hide/display functions, and post/get ajax requests:
List div/hide display and navigation tasks here:
Edit style file to set default visibility behaviour for divs
Write click functions in index.js to implement swapping between divs

List ajax calls here:
getPlaylist method which places an AJAX call with url currentPlaylist 
    receives the playlist structure for display on user clients and playing on host client

Implement AJAX call to back-end for getAllPlaylists:    will be necessary at log into playlist screen
    User will need to select a playlist to enter, all open playlists must be displayed. 
Implement AJAX call to back-end for createPlaylist: create a new playlist in the db for the room
    Must include a playlist name input from UI, along with the user's name
Implement AJAX call to back-end for logIntoPlaylist: request to log into the given room title, with a password if private
    Must include a room name (by clicked room's id rather than input) along with a new username, and a password if the room is private
    Username must be unique in the playlist
Implement AJAX call to back-end for getAvailableSongs:    will be necessary to add songs to playlist
    User will need a list of all available songs on the host's local files, added by the host in order to add songs to the playlist
Implement AJAX call to back-end for addSongToPlaylist: request to add a song to the given playlist
    Must include a songname or other song reference, and a playlist name(taken by context once again, such as actively open playlist etc)
Implement AJAX call to back-end for deleteSongFromPlaylist: request to delete a song from a specified playlist
    Must include a songname or other song reference, and a playlist name(taken by context, such as actively open playlist etc)
Implement AJAX call to back-end for currentSong: request to get the currently playing song at the active playlist in the room
    Must include playlist name, there must be handling in case the selected playlist is not actively playing
        This can also be handled by not making this call available in the UI while viewing an unactive playlist
Implement AJAX call to back-end for nextSong: request to get the next song in queue for the active playlist in the room
    Must include a playlist name, might need to have handling for the return of the first song in playlist if the playlist is not actively playing
        Or similar UI availability as above




Back-end:
Must implement mongodb (perhaps with mongoose) database management to handle larger volumes of users/rooms/playlists
(Current implementation is with JSON objects, insufficient)
List all database tasks here:
Implement a mongodb database in server.js
Create Schemas and models in mongoose in server.js:
    Schema/model for room
    Schema/model for playlist

Must implement handling for front end AJAX calls>
Lit all API tasks here:
Implement handling for login to playlist requests
Implement handling for create playList request
Change getCurrentPlaylist handling when mongodb database is integrated
Implement getPlaylistByTitle handling (after design decision One or more playlist per room?)
Implement handling for delete playlist 
    Session handling must be included to check the connected users, when no users are connected, the playlist is deleted
Implement handling for add song to playlist request
Implement handling for remove song from playlist request
Implement retrieving list of songs available to be added to playlists for a given room
Review handling for currentSong request after db chane
Review handling for nextSong request after db change
