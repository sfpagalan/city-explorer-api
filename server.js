'use strict';

const express = require('express');
const app = express();
// const port = 3000;


// const express = require('express');
// const app = express();
const PORT = process.env.PORT || 3001;

const weatherData = require('./data/weather.json');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/weather', (req, res) => {
  const { lat, lon, searchQuery } = req.query;

  const knownCities = [
    { city: 'Seattle', lat: '47.6062', lon: '-122.3321' },
    { city: 'Paris', lat: '48.8566', lon: '2.3522' },
    { city: 'Amman', lat: '31.9522', lon: '35.2332' }
  ];

  const matchedCity = knownCities.find(city => (
    city.lat === lat && city.lon === lon && city.city === searchQuery
  ));

  if (!matchedCity) {
    return res.status(404).json({ error: 'City not recognized' });
  }

  const city = weatherData.find(city => city.lat === lat && city.lon === lon && city.city === searchQuery);

  if (!city) {
    return res.status(404).json({ error: 'City not found' });
  }

  class Forecast {
    constructor(date, description) {
      this.date = date;
      this.description = description;
    }
  }

  const forecastArray = city.forecast.map(forecast => new Forecast(forecast.date, forecast.description));

  res.json(forecastArray);
});
