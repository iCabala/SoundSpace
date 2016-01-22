#Phase 2 Report

##Initial Planning
**Scrum Master**
For this group's definition of a scrum master, the primary trait for the role is one of a facilitator. Not a position of ruling or manager, scrum master is present throughout the scrum, and is especially active during the meetings. He is no leader but rather focuses on everyone getting a turn to speak, "passing the conch" so to speak. For group's purposes, he is also the scribe and the time-keeper, taking meeting minutes and keeping track of time. As a part of this later responsibility, he keeps meetings on track, clearly identifies the topics that need to be discussed, and changes the discussion as necessary. The group chose to have a rotation of scrum masters between group members for each meeting.

**Task Size Estimation**
Unable to reach a metaphor that would feel natural and seemless, the group chose to use the Small, Medium, and Large categories for estimating task size. For the group's meetings, which have been primarily over Google Hangout calls so far, the group opens up the backlog that was started on a shared Google document, and go over each task one by one. The current implementation is to have everyone call out a size over the call, and discuss differences to reach a consensus. A more synchronized method of a countdown after which everyone writes their chosen category on Slack chat was also envisioned to simulate turning playing cards at the same time, but has been unnecessary so far, as members are willing to speak out and offer contradictory opinions.

##Sprint Backlog
**Product Description**
  The team has planned to build a multi-user music sharing and dynamic playlist web application that would allow users to join a room and collectively form and edit a playlist by voting on changes to have said playlist play on a host client. This is planned to be implemented as a dynamically populated html UI, a front-end client that would serve two user-roles: playing-host and voter, and a back-end server to maintain the user, vote and playlist information in database objects.

**Resources**  
  The group has chosen to issue the issues directly on the group's repository under the organization [here](https://github.com/csc301-fall-2015/project-team5-L0101/issues).
  
  Another crucial document is the google document which holds the priority and estimate information for tasks, accessible [here](https://docs.google.com/document/d/15Zs1FAjf2N8twKmroXOm7A31XmKmykNaXdVAeinEpCI/edit)
  
**Build Plan**
  For order of the tasks, the team refers to the google document which has a continually updated priority assessment for tasks.
  
  The team has planned to build the product in three parts: UI/UX design, front end which is mainly the client and the scripts necessary for dynamic html page, and the back end, a node.js/express server that accesses and maintains the static pages, playlist, user and vote information.
  
  As group contains members with varying fields of interest and experience, work division was handled in a manner of general allocation to these three categories. Those with limited javascript experience expressed interest in working on the UI, while the members who ran similar server projects for other courses selected to work on the server and the back-end.  Others are given to work alongside them while writing the front-end.
  
  Currently, members build parts on their own initiative, and according to agreement, write code stubs and documentation where the newly added parts need to interact with domains of others, informing them of the availability of the newly added tools.
##Update Meetings

**Meeting 1: October 27, 10am, Group Slack, all members present:**
  After TA Spandan Bemby's reminder about the demo date, the group members met over the Slack group at the specified time. Initial concern was the scheduling of the demo date, which was shortly resolved and set to Nov 3, 4:10pm. Next topic of discussion was all member's ability in two previously discussed platform choices. Alongside this ability poll was a vote for platform selection, which resulted in 3 web / 3 Android. Some justifications for both sides were discussed, and the final selection was put off until next meeting.
  
**Meeting 2: October 30, 7pm, Hangouts Call, all members present:**
  During the meeting, platform selection was finalized as web, and later possible risk and induced delays were discussed if the group chose to switch platforms. Shortly, a google document was formed for the drafting of the project backlog. Members co-edited the document to create an initial draft of the backlog, which primarily entailed the three major development areas of UI/UX, front end and back-end. 
  Throughout the meeting, as different tasks were discussed, the group continued to refine what features and functionalities would be included in the MVP, and a plethora of design decisions were made. These decisions were reflected on the document, and general listings were broken down into more specific tasks. At the end of the meeting, the current version of the backlog was reached, with priority and workload assessment pending.
  
  **Meeting 3: October 31, 10:30am, Hangouts Call, all members present:**
    The group quickly went over each previously defined task, reorganizing them under categories, and making assessments for task priority and task size. For task size assessment, the methods mentioned above were used.
    A discussion on work division followed shortly after. Trying to play into members' strengths, general directions where each member would feel more comfortable working were drawn, and luckily, this distribution was complementary. 
    In this meeting, several previously written tasks were deferred until later as low priority, such as: Fetching Music off Youtube, Round-robin voting, and user management. These features were seen as less critical to the MVP.

  **Meeting 4: November 1, 11:00am, Group Slack, all members present:**
    The group reported in with an assesment of the progress on the individually selected tasks, identifying challenges and identifying the next set of tasks that would be undertaken. The requirements for the demo was discussed. Available written libraries that would benefit the group with highly relevant content were mentioned, noted and their links stickied in the group Slack. 

##Burndown Chart
  The team has done 4 meetings, and throughout these meetings, backlog was formed and changed drastically. So, the work axis of any burndown chart at this stage is highly volatile, as it changes with every iteration. Considering Small tasks a workload value of 1, Medium taks 3, Large tasks 5, the group summed up the entire project as a workload of 61. Using this latest version of the backlog to reflect on the previous work, which caused skewing, a team burndown chart has been created and can be seen [here](http://i.imgur.com/AEZihCH.jpg). Keep in mind that as there was no clear goal for the demo, the "Expected" guidance line has very little meaning other than to illustrate the initial delay in accomplishing tasks. 
  
  Similarly, since there was initially no clear definition of the tasks, nor a clear understanding of how implementation would be handled, most of the work done by individual members were about structuring and less about individual clear tasks. Most of these tasks that could be identified were done by multiple members, with plenty of offered versions discarded later on. The team attempted to use the issues for these tasks accomplished, but were not highly successful, as most work was not tangible and clearly definable by a small task. We're unable to provide an individual burndown chart for each member, but below is a list of individual progress that contributed to the team burndown chart above:
  
  For further information on individual progress, see commit history:
  
  **Colliflower:**
- Implemented a basic UI for the project.
- Created an audio player for a static source on the computer.
- Implemented a method of loading a file from the computer.
- Implemented a way to refresh the audio player for a selected song.
- Created a basic node.js server to serve static files for testing the audio player.

**Atheed:**
- Created the template for the playlist page (which will eventually hold the currently playing song, the queue of upcoming songs, and a way to add/suggest songs)
- Built the playlist-queue view for this page. That is, parsed the playlist.json file, got the relevant information of each song to be played, and populated the page with these songs (and their details) in an easy-to-read way
- Created dynamic upvote/downvote buttons for each song on the playlist, which can be used to eventually propagate the votes on to the actual ordering of the song
- Helped build the general look and feel of the first phase of the UI, and the general client-side flow of the product

**Orangehop:**
- wrote node.js server in express to serve static files
- implemented /currentPlayList rest call
- implemented /nextSong rest call
- implemented /currentSong rest call
- implemented /removeSongFromPlayList, /addSongtoPlaylist, and /createNewPlayList rest call with place holder functions -> need to implement further once we support dynamic playlist

**icabala:**
- Helped design the initial features as well as looks of the first UI prototype
- Created a simple mock up of the "Create a Page" part of the UI
- Designed the initial "landing page" of the UI

**mcey:**
- Assisted the design categories choice, created initial empty files
- Reviewed and edited the earlier version of the server, made syntax corrections
- Wrote a getPlaylist request in front-end, and handling for the request in backend (this was later discarded for express server)
- Drafted the playlist JSON object
- Wrote the phase 2 report



##Review&Retrospective

The groups plan evolved in a cyclical way, where tasks would be introduced, and members would go back and revisit the tasks to either redefine it more clearly, or split it into multiple tasks. Although the project had clear requirements that were all agreed upon, members did not initially have a clear view of how it would be implemented step by step. Every task that was undertaken brought forth more design decisions, which lead to changes in the backlog and tasks.So at this point, there isn't a clear way of presenting a burndown chart without constantly changing Y axes.

No taks that were decided to be put on the backlog were abandoned. Some tasks were decided to be less crucial than others for the MVP, and therefore were assigned a low priorty status. Some examples given above for these are: Fetching Music off Youtube, Round-robin voting, and user management.

The changes that dominated the process were the taks that were split into multiple tasks. This was expected due to continuing redefinition of the project as the development started. We anticipate having a more guided and solid task list as we continue in the future. Some tasks that were split were: 

Local file capability: split into fetching local music files for the player client and loading/saving playlist information locally.
Implementing Playlists: split into responding to new playlist requests, and adding/removing songs from playlists
Implementing Voting: split into Highest votes first reorganization, round-robin voting, voting UI and backend support
Creating a client: split into Client capable of fetching single song info and loading/playing and Capability for adding songs to the playlist and changing current song


Decision of establishing different layers such as UI, front-end and back-end worked well so far. People with less experience and desire to work with javascript were still able to provide meaningful contrabutions, while back-end people have not been overly distracted with design aspects of the project.

Using existing libraries introduced some challenges, such as harder and longer times debugging, need to learn a new infrastructure for other members. Still however, this can't exactly be categorized as a decision that hasn't worked well, simply one that introduced challenges.

As the group has just started the implementation, there hasn't been much feedback and chance for reflection, hence there is an unability to identify many decisions that were helpful, and those that were detrimental.

A concrete improvement to the process would be to have more meetings, earlier on during springs, and make as many of these meetings as possible face-to-face. Similarly, if schedules permit, members working on the same segments of the projects actually working together in the same physical space might improve communication.
