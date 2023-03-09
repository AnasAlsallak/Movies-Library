'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

const server = express();

server.use(cors());

const PORT = 3000;

//Routes
//home route
server.get('/',homeRouteHandler);

//http://localhost:3000/favorite
server.get('/favorite',favoriteRouteHandler);

//other routes

server.get('/trending',trendingRouteHandler);
server.get('/search',searchRouteHandler);
server.get('/top_rated',topRatedRouteHandler);
server.get('/top_upcoming',topUpcomingRouteHandler);

//default route
server.get('*',defaultErrorHandler)

server.use(errorHandler); 

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
    console.log("use the url : http://localhost:3000/RouteName on your browser to navigate to the desired route");
    console.log("available routes are : / => home,favorite,trending,search,top_rated,top_upcoming")
})

function DataFormater (title, poster_path,overview) {
this.title = title;
this.poster_path = poster_path;
this.overview = overview;
};

// route handler

function homeRouteHandler (req,res) {
    try {
    const data = require('./Movie Data/data.json')
    const MovieData = new DataFormater (data.title,data.poster_path,data.overview);
    res.json(MovieData);
    } catch (err) {
        errorHandler(err,req,res); 
    } 
};

function favoriteRouteHandler (req,res){
    try 
    {
    let str = "Welcome to Favorite Page";
    res.send(str);
    } catch (err) {
    errorHandler(err,req,res); 
    } 
};

function defaultErrorHandler (req,res) {
    const errorRes = {
        "status": 404,
        "responseText": "page not found error"
    };
    res.status(404).send(errorRes);
}

function errorHandler (error,req,res) {
    console.log(error);
    const errorRes = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    };
    res.status(500).send(errorRes);
};

function RouteFormater (id,title,release_date,poster_path,overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
};

function trendingRouteHandler (req,res) {
    try {
    const apiKey = process.env.APIKEY;
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`)
    .then(resp => {
        const movies = resp.data.results;
        const formatedMovies = movies.map(movie => new RouteFormater(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview))
        res.json(formatedMovies);
    }).catch ((err) => {
        errorHandler(err,req,res); 
    })
    } catch (err) {
        errorHandler(err,req,res); 
    } 
};

function searchRouteHandler (req,res) {
    try {
    const apiKey = process.env.APIKEY;
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`)
    .then(resp => {
        const movies = resp.data.results;
        const formatedMovies = movies.map(movie => new RouteFormater(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview))
        res.json(formatedMovies);
    }).catch ((err) => {
        errorHandler(err,req,res); 
    })
   } catch (err) {
    errorHandler(err,req,res);
   } 
};

function topRatedRouteHandler (req,res) {
   try {
    const apiKey = process.env.APIKEY;
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`)
    .then(resp => {
        const movies = resp.data.results;
        const formatedMovies = movies.map(movie => new RouteFormater(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview))
        res.json(formatedMovies);
    }).catch ((err) => {
        errorHandler(err,req,res); 
    })
   } catch (err) {
    errorHandler(err,req,res); 
   } 
};

function topUpcomingRouteHandler (req,res) {
    try {
        const apiKey = process.env.APIKEY;
    axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`)
    .then(resp => {
        const movies = resp.data.results;
        const formatedMovies = movies.map(movie => new RouteFormater(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview))
        res.json(formatedMovies);
    }).catch ((err) => {
        errorHandler(err,req,res); 
    })
   } catch (err) {
    errorHandler(err,req,res); 
   } 
};



