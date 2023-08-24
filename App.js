'use strict';

const express = require('express');
const app = express();
const port = 3000;

const weatherData = require('./data/weather.json');

app.get('/weather', (req, res) => {
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

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

