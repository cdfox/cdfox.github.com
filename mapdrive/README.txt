These are the files for the route tracing app ("mapdrive") that
enables a tutor and a driver to work together on the route
tracing task. To set up the app, put these files somewhere that
serves static web pages (e.g., Dropbox, Google Drive, or Gihub
all offer free static hosting) and then set up a free account 
on Firebase, a real-time database-as-a-service. There is a 
place near the top of each Javascript file where the URL for
the Firebase should go. This app is known to work in Google
Chrome on OS X and Windows. There have been problems with 
Safari on OS X.

--

mapdrive_driver.html
mapdrive_driver.js

These files are for the driver's side of the route tracing app.
The driver can use the search box to find the starting point of
the route. Holding the Shift key while moving the mouse cursor
allows the driver to draw on the map. The New Session button
will begin a new route tracing session. There is a chat box for
communication with the tutor.

--

mapdrive_driver.html
mapdrive_driver.js

These files are for the tutor's side of the route tracing app.
The tutor cannot draw on the map but is able to see what the
driver draws (in real-time). The tutor also sees the route that
the driver needs to learn in the route tracing task. There is a
search box to find the starting point of the route and a chat 
box for communication with the driver.


--

In Firebase, each session is represented as a list of events.
Events are of two types: mouse move events that comprise the 
path the driver has traced and messages written in the chat
box by either the driver or the tutor.