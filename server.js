'use strict';

const express = require('express');

const cors = require('cors');

const server = express();

server.use(cors());

const PORT = 3000;

//Routes
//home route
server.get('/',homeRouteHandler)

// http://localhost:3000/favorite
server.get('/favorite',favoriteRouteHandler)

//default route
server.get('*',defaultErrorHandler)

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})

function DataFormater (title, poster_path,overview) {
this.title = title;
this.poster_path = poster_path;
this.overview = overview;
};

// route handler

function homeRouteHandler (req,res) {
    const data = require('./data.json')
    const MovieData = new DataFormater (data.title,data.poster_path,data.overview);
    res.json(MovieData);
};

function favoriteRouteHandler (req,res){
    let str = "Welcome to Favorite Page";
    res.send(str);
};

function defaultErrorHandler (req,res) {
    const errorRes = {
        "status": 404,
        "responseText": "page not found error"
    };
    res.status(404).send(errorRes);
}

function errorHandler (error,req,res) {
    const errorRes = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    };
    res.status(500).send(errorRes);
};



