const express = require("express");
const app = express();

const port = process.env.PORT || 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  console.log("rtc connect");

  var weight = 20;
  var count = 0;

  // 연결 뒤 init
  socket.on("init", () => {
	console.log("init");
	io.sockets.emit("weight", weight);
        var counting = setInterval(function(){
     		count += 1;
     		io.sockets.emit("count",count);
  		}, 1000);
  });

  // 무게 증가 입력
  socket.on("plus", (amount) => {
    console.log("plus weight");
    weight += amount;
    io.sockets.emit("weight", weight);
  });

  // 무게 감소 입력
  socket.on("minus", (amount) => {
    console.log("minus weight");
    weight -= amount;
    io.sockets.emit("weight", weight);
  });

  // connection 종료
  socket.on("close", () => {
    console.log("socket close");
    clearInterval(counting);
  });
		
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
