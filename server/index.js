const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.all("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
});

app.get("/", (req, res) => {
  res.send("<h1>hi<h1>");
});

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("a user connected!");
  socket.on("play", () => {
    console.log("video is playing...");
    io.emit("play");
  });
  socket.on("pause", () => {
    console.log("video is paused...");
    socket.broadcast.emit("pause");
  });
  socket.on("move", (value) => {
    console.log(`move to position ${value}`);
    socket.broadcast.emit("move", value);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected.");
  });
});
