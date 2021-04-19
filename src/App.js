import axios from 'axios';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

import Input from './components/input';
import CityCard from './components/city-card';

const initialLocations = [
  { name: 'oslo', lat: 59.9333, lon: 10.7166 },
  { name: 'bergen', lat: 60.3894, lon: 5.33 },
  { name: 'trondheim', lat: 63.4308, lon: 10.4034 },
];

// Returns a subset of timeseries for any given timpestamp in hours (00-23)
const filterTimeSeries = (timeseries, time = 12) => {
  const filtered = timeseries.filter((entry) =>
    entry.time.includes(`T${time}:00`)
  );
  return new Date(timeseries[0].time).getHours() > time
    ? [timeseries[0], ...filtered]
    : filtered;
};

//TODO use response.headers.expires to limit requests
const getWeather = async ({ lat, lon }) => {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

  return await axios
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(
        `Could not get weather data, url: ${url}. Error: ${error}`
      );
    });
};

const getLocationData = async (city) => {
  const url = `https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=${city}&epsgKode=4230`
  return await axios
    .get(url)
    .then((response) => {
      // hacky convert string to number .toFixed converts to string with decimals
      const lon = Number(response.data.stedsnavn[0].nord).toFixed(4);
      const lat = Number(response.data.stedsnavn[0].aust).toFixed(4)
      const name = response.data.stedsnavn[0].stedsnavn.toLowerCase();
      return { name, lat: Number(lat), lon: Number(lon) };
    })
    .catch((error) => console.error(`Could not get coordinates for ${city}. Url:${url}. Error: ${error}`));
};

const RenderCards = ({ weatherData }) => {
  return weatherData.map((location) => (
    <CityCard
      key={location.name}
      name={location.name}
      today={location.times[0]}
      upcoming={location.times.slice(1)}
    />
  ));
};

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [inputText, setInputText] = useState('');
  const [locations, setLocations] = useState(initialLocations);

  const alreadyInList = (location) =>
    locations.some((loc) => loc.name === location.toLowerCase());

  const updateWeatherData = (name, timeseries) => {
    const daysAhead = 7;
    const timeOfDay = 12;
    const filteredSeries = filterTimeSeries(timeseries, timeOfDay)

    setWeatherData((prev) => [
      ...prev,
      {
        name: name,
        times: filteredSeries.slice(0, daysAhead),
      },
    ]);
  };

  const addCity = async (e) => {
    e.preventDefault();
    const name = inputText.toLowerCase();

    if (alreadyInList(name)) {
      window.alert(`Could not add ${inputText}, it is already added.`)
      return;
    }

    const data = await getLocationData(name);
    if (!data) {
      window.alert(`Could not find coordinates for ${inputText}. Are you sure it's spelled correctly? `)
      return;
    }

    const weather = await getWeather({ ...data });
    const timeseries = weather.data.properties.timeseries;
    updateWeatherData(name, timeseries);
    setLocations((prev) => [...prev, { ...data }]);
    setInputText('');
  };

  useEffect(() => {
    setWeatherData([]);
    const initializeData = async (city) => {
      const response = await getWeather({ ...city });
      const timeseries = response.data.properties.timeseries;
      updateWeatherData(city.name, timeseries);
    };
    initialLocations.forEach((city) => {
      initializeData(city);
    });
  }, []);

  return (
    <Page>
      <Input text={inputText} setValue={setInputText} submit={addCity} />
      <CardsWrapper>
        <RenderCards weatherData={weatherData} />
      </CardsWrapper>
    </Page>
  );
}

export default App;

const Page = styled.div`
    width: 100%;
`;

const CardsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;
