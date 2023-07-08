const { Server } = require("socket.io");

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
          origin: "*",
        },
        /* options */
    });
    
    /* 
    ! This sets up an event listener for the "connection" event.
    ! When a client connects to the server, the callback function is called 
    ! with a socket object representing the connection.
    */
    //when a connection is made to the server a socket instance is created
    io.on("connection", (socket) => {
        console.log("BE: io.on connection");
        
        socket.on("send-message", (message) => {
            io.emit("message-received");
        });
        
        socket.on("group-update", () => {
            io.emit("groupUpdated");
            })
        });
}
