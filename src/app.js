const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routers/routes');

// Connecting to Database
require('./db/dbconnect')

// Define Path for Express Config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setting up hbs engine and views directory
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setting Up bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Setting up express to use JSON and routes
app.use(express.json());
app.use(userRouter);
app.use(express.static(publicDirectoryPath));

app.listen(3000, function () {
    console.log(`[+] Server up and running at port 3000.`);
});