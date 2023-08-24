'use strict';

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/weather', (req, res) => {
  const { lat, lon } = req.query;
  const weatherApiUrl = `https://api.weatherprovider.com/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;

  axios.get(weatherApiUrl)
    .then(response => {
      const weatherData = response.data.daily.map(day => ({
        description: day.weather[0].description,
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
      }));
      res.json(weatherData);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Error fetching weather data' });
    });
});

const weatherData = require('./data/weather.json');

app.get('/weather-forecast', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  const cityData = weatherData.find(city => (
    city.searchQuery.toLowerCase() === searchQuery.toLowerCase()
  ));

  if (!cityData) {
    return res.status(404).json({ error: 'City not found' });
  }

  const forecastArray = cityData.forecast.map(day => ({
    description: day.description,
    date: day.date
  }));

  res.json(forecastArray);
});

// app.get('/movies', (req, res) => {
//   const cityName = req.query.cityName;
//   const movieApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

//   axios.get(movieApiUrl)
//     .then(response => {
//       const moviesData = response.data.results.map(movie => ({
//         title: movie.title,
//         overview: movie.overview,
//         average_votes: movie.vote_average,
//         total_votes: movie.vote_count,
//         image_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
//         popularity: movie.popularity,
//         released_on: movie.release_date,
//       }));
//       res.json(moviesData);
//     })
//     .catch(error => {
//       console.error('Error fetching movies data:', error);
//       res.status(500).json({ error: 'Error fetching movies data' });
//     });
// });


app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
