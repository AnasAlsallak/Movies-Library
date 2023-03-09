'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');
const { response } = require('express');
require('dotenv').config();

const pg = require('pg');
const { get } = require('https');
const client = new pg.Client(process.env.DB_url);

const server = express();

server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3000;

//Routes
//home route
server.get('/', homeRouteHandler);

//http://localhost:3000/favorite
server.get('/favorite',favoriteRouteHandler);

//other routes

server.get('/trending', trendingRouteHandler);
server.get('/search', searchRouteHandler);
server.get('/top_rated', topRatedRouteHandler);
server.get('/top_upcoming', topUpcomingRouteHandler);
server.post('/add_movie', addMovieHandler);
server.get('/get_movies', getMoviesHandler);
server.delete('/delete_movie/:id', deleteMovieHandler);
server.put('/update_movie/:id', updateMovieHandler);
server.get('/get_movie/:id', getMovieHandler);

//default route
server.get('*', defaultErrorHandler)

server.use(errorHandler); 
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
            console.log("use the url : http://localhost:3000/RouteName on your browser to navigate to the desired route");
            console.log("available routes are : / => home,favorite,trending,search,top_rated,top_upcoming,add_movie,get_movies,get_movie/id,update_movie/id,delete_movie/id");
        })
    })

function DataFormater(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
};

// route handler

function homeRouteHandler(req, res) {
    try {
        const data = require('./Movie Data/data.json');
        const MovieData = new DataFormater(data.title, data.poster_path, data.overview);
        res.json(MovieData);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

function favoriteRouteHandler(req, res) {
    try {
        let str = "Welcome to Favorite Page";
        res.send(str);
    } catch (err) {
        errorHandler(err, req, res);
    }
};

function defaultErrorHandler(req, res) {
    const errorRes = {
        "status": 404,
        "responseText": "page not found error"
    };
    res.status(404).send(errorRes);
}

function errorHandler(error, req, res) {
    console.log(error);
    const errorRes = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    };
    res.status(500).send(errorRes);
};

function RouteFormater(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
};

function trendingRouteHandler(req, res) {
    try {
        const apiKey = process.env.APIKEY;
        axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`)
            .then(resp => {
                const movies = resp.data.results;
                const formatedMovies = movies.map(movie => new RouteFormater(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
                res.json(formatedMovies);
            }).catch((err) => {
                errorHandler(err, req, res);
            })
    } catch (err) {
        errorHandler(err, req, res);
    };
};

function searchRouteHandler(req, res) {
    try {
        const apiKey = process.env.APIKEY;
        axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`)
            .then(resp => {
                const movies = resp.data.results;
                const formatedMovies = movies.map(movie => new RouteFormater(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
                res.json(formatedMovies);
            }).catch((err) => {
                errorHandler(err, req, res);
            })
    } catch (err) {
        errorHandler(err, req, res);
    };
};

function topRatedRouteHandler(req, res) {
    try {
        const apiKey = process.env.APIKEY;
        axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`)
            .then(resp => {
                const movies = resp.data.results;
                const formatedMovies = movies.map(movie => new RouteFormater(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
                res.json(formatedMovies);
            }).catch((err) => {
                errorHandler(err, req, res);
            })
    } catch (err) {
        errorHandler(err, req, res);
    };
};

function topUpcomingRouteHandler(req, res) {
    try {
        const apiKey = process.env.APIKEY;
        axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`)
            .then(resp => {
                const movies = resp.data.results;
                const formatedMovies = movies.map(movie => new RouteFormater(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview))
                res.json(formatedMovies);
            }).catch((err) => {
                errorHandler(err, req, res);
            })
    } catch (err) {
        errorHandler(err, req, res);
    };
};

function addMovieHandler(req, res) {
    try {
        const movie = req.body;
        const sql = `INSERT INTO Movie_list (title, release_date, poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const values = [movie.title, movie.release_date, movie.poster_path, movie.overview];
        client.query(sql, values)
            .then((data) => {
                res.send("your data was added !");
            })
            .catch(error => {
                // console.log(error);
                errorHandler(error, req, res);
            });
    } catch (error) {
        errorHandler(error, req, res);
    };

};

function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM movie_list ;`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
};

function deleteMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM Movie_list WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.status(204).json({});
        })
        .catch((err) => {
            errorHandler(err, req, res);
        });

};

function updateMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `UPDATE Movie_list SET title=$1, release_date=$2, poster_path=$3, overview=$4 WHERE id=${id} RETURNING *`;
    const values = [req.body.title, req.body.release_date, req.body.poster_path, req.body.overview];
    client.query(sql, values)
        .then((data) => {
            res.status(200).send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        });
};

function getMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM movie_list WHERE id=${id};`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
};



