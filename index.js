const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
// DB Setup
mongoose.connect('mongodb://localhost/auth');

// App Setup
// Setting up express

// middleware -- any incoming request will be passed through morgan + bodyParser
app.use(morgan('combined')); // logging framework
app.use(cors());
app.use(bodyParser.json({ type: '*/*' })); // parse incoming request into json
router(app);

// Server Setup
// Talking to the outside world
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on ${port}`);
