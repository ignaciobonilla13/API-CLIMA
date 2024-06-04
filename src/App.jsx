import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography, CssBaseline, IconButton, Card, CardContent } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { lightTheme, darkTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const res = await fetch(API_WEATHER + city);
      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      });
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
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
          >
            Weather App
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
        <Box
          sx={{ display: "grid", gap: 2 }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
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

          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            loadingIndicator="Buscando..."
            sx={{ borderRadius: 1 }}
          >
            Buscar
          </LoadingButton>
        </Box>

        {weather.city && (
          <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                component="h2"
              >
                {weather.city}, {weather.country}
              </Typography>
              <Box
                component="img"
                alt={weather.conditionText}
                src={weather.icon}
                sx={{ margin: "0 auto", width: '100px', height: '100px' }}
              />
              <Typography
                variant="h6"
                component="h3"
              >
                {weather.temperature} °C
              </Typography>
              <Typography
                variant="subtitle1"
                component="h4"
              >
                {weather.conditionText}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Typography
          textAlign="center"
          sx={{ mt: 3, fontSize: "10px" }}
        >
          Powered by:{" "}
          <a
            href="https://www.weatherapi.com/"
            title="Weather API"
          >
            WeatherAPI.com
          </a>
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
