var express = require('express')
var app = express()
var Sequelize = require('sequelize');
var cors = require('cors'); // Cross Origin Resource Sharing
var mysql = require ('mysql');
var bodyParser = require ('body-parser');
var dotenv = require ('dotenv');
dotenv.config();

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var yelp = require('./api/yelp');

var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
    _socket: '/var/lib/mysql/mysql.sock',
     pool: {
        max: 1,
        min: 0,
        idle: 1000
    }
});


var Restaurant = sequelize.define('SoCalRestaurants', {
  restaurantName: {
    type: Sequelize.STRING
  },
  cuisine: {
    type: Sequelize.STRING
  },
  stars: {
    type: Sequelize.INTEGER
  },
  address: {
    type: Sequelize.STRING
  },
  reviews: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});
app.use(cors());
app.use(bodyParser());

// app.use(function(request, response, next) {
//   response.header('Access-Control-Allow-Origin', '*');
//   next();
// });

app.get('/api/SoCalRestaurants', function (request, response) {
  var promise = Restaurant.findAll();
  promise.then(function(SoCalRestaurants) {
    response.json({
      data: SoCalRestaurants
    });
  });
})


app.get('/api/SoCalRestaurants/byID/:id', function (request, response){
var promise = Restaurant.findById(request.params.id);
promise.then(function(SoCalRestaurants){
    response.json({
    data: SoCalRestaurants
    });
  });
});

app.post('/api/SoCalRestaurants', function (request, response){
var restaurant = Restaurant.build({
restaurantName: request.body.restaurantName,
cuisine: request.body.cuisine,
stars: request.body.stars,
address: request.body.address,
reviews: request.body.reviews
});

restaurant.save().then(function(restaurant){
  response.json(restaurant);
});
});

app.get('/results/:s/:l?', function(request, response) {
  yelp.search({ term: request.params.s, location: request.params.l}).then(function(results) {
    response.json(results);
  }, function(err) {
    response.json(err);
  });
});



app.listen(process.env.PORT || 3000);