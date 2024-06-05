import { LoadingButton } from '@mui/lab';
import { Box, Container, TextField, Typography, CssBaseline, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import { lightTheme, darkTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState('');
  const [error, setError] = useState({ error: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [weather, setWeather] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: '' });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: 'El campo ciudad es obligatorio' };

      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      const weatherData = {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      };

      setWeather(weatherData);

      // Guardar los datos del clima en MongoDB Atlas
      const response = await axios.post('http://localhost:5001/api/weather', weatherData);
      console.log('Response from server:', response.data);
    } catch (error) {
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="xs"
        sx={{ mt: 4, mb: 4, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'background.paper' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Weather App
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'grid', gap: 2 }} component="form" autoComplete="off" onSubmit={onSubmit}>
          <TextField
            id="city"
            label="Ciudad"
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={error.error}
            helperText={error.message}
            sx={{ borderRadius: 1, backgroundColor: 'background.default' }}
          />
          <LoadingButton type="submit" variant="contained" loading={loading} loadingIndicator="Buscando..." sx={{ borderRadius: 1 }}>
            Buscar
          </LoadingButton>
        </Box>
        {weather && <WeatherCard weather={weather} />}
        <Typography textAlign="center" sx={{ mt: 3, fontSize: '10px' }}>
          Powered by:{' '}
          <a href="https://www.weatherapi.com/" title="Weather API">
            WeatherAPI.com
          </a>
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
