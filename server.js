const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const socketIO = require('socket.io');
const http = require('http');

const server = http.Server(app);
const io = socketIO(server);
io.listen(server);
io.on('connection', (socket) => {

 console.log('Socket conneted');
});

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Poll application." });
});
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
app.get("/public", express.static(path.join(__dirname, "./Download/")));

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


module.exports = { io }