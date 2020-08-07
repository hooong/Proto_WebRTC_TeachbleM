const express = require("express");
const app = express();

let broadcaster;

const port = process.env.PORT || 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  console.log("connect");

  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

  // tablet socket
  //weight = 20;
  //count = 0;

  socket.on("init", () => {
	console.log("init");
	io.sockets.emit("weight", 20);
        var counting = async () => { 
		await setInterval(function(){
     		//count += 1;
     			io.sockets.emit("count",1);
  		}, 1000);
  }});
  socket.on("plus", (amount) => {
	console.log("plus weight");
	weight += amount;
	io.sockets.emit("weight", weight);
  });
  socket.on("minus", (amount) => {
	console.log("minus weight");
	weight -= amount;
	io.sockets.emit("weight", weight);
  });
  socket.on("close", () => {
	console.log("socket close");
	clearInterval(counting);
  });
  socket.on("server", data => {
	console.log("server");
	io.sockets.emit("client", "response");
  });		
		
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
