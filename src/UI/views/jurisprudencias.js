import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "../components/Headers/HeaderMain";
import SideBar from "../components/SideBars/SideBarMain";
import externalAPI from "../../Services/Controllers/externalApi";
import { format, subDays, isFriday } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const disableNonFridays = (date) => {
  return date.getDay() !== 5;
};

const getLastFriday = () => {
  let date = new Date();
  while (!isFriday(date)) {
    date = subDays(date, 1);
  }
  return date;
};

function JurisprudenceFinder() {
  const navigate = useNavigate(); // Para actualizar la URL
  const location = useLocation(); // Para leer la URL

  // Leer el parámetro yearWeek de la URL al cargar
  const [selectedDate, setSelectedDate] = useState(() => {
    const params = new URLSearchParams(location.search);
    const yearWeek = params.get("yearWeek");
    if (yearWeek && yearWeek.length === 6) {
      const year = parseInt(yearWeek.slice(0, 4), 10);
      const week = parseInt(yearWeek.slice(4), 10);
      let date = new Date(year, 0, 1); // Primer día del año
      date.setDate(date.getDate() + (week - 1) * 7); // Avanzar al inicio de la semana
      while (!isFriday(date)) {
        date = subDays(date, 1); // Retroceder hasta el viernes
      }
      return date;
    }
    return getLastFriday(); // Si no hay parámetro, usa el último viernes
  });

  const [jurisprudences, setJurisprudencias] = useState([]);
  const [IsDrawerOpenMain, SetIsDrawerOpenMain] = useState();

  const filteredJurisprudences = selectedDate
    ? jurisprudences.filter((j) => {
        const selectedDateString = format(selectedDate, "yyyy-MM-dd");
        return j.date === selectedDateString;
      })
    : [];

  useEffect(() => {
    async function fetchData() {
      try {
        // Formatear el parámetro como "año + número de semana" (ejemplo: "202511")
        const year = format(selectedDate, "yyyy");
        const weekNumber = format(selectedDate, "ww"); // Número de semana (01-53)
        const yearWeekParam = `${year}${weekNumber}`;

        // Actualizar la URL con el parámetro yearWeek
        navigate(`?yearWeek=${yearWeekParam}`, { replace: true });

        const result = await externalAPI.getJurisprudencias(yearWeekParam);
        console.log(result.documents);
        setJurisprudencias(result.documents || []); // Aseguro que sea un array vacío si no hay documentos
      } catch (error) {
        console.error("Error al cargar jurisprudencias:", error);
        setJurisprudencias([]);
      }
    }
    fetchData();
  }, [selectedDate, navigate]); // Añadí navigate como dependencia

  const handleCardClick = (juris) => {
    alert(
      `Clic en: ${juris.title}\nRegistro: ${juris.id}\nDetalles: ${juris.source}`
    );
  };

  const toggleDrawerMain = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    SetIsDrawerOpenMain(open);
  };

  return (
    <Box>
      <Header toggleDrawerMain={toggleDrawerMain} />
      <SideBar
        isDrawerOpen={IsDrawerOpenMain}
        toggleDrawer={toggleDrawerMain}
      />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Buscador de Jurisprudencias
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container justifyContent="center" sx={{ mb: 4 }}>
            <DatePicker
              label="Selecciona una fecha"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              slotProps={{ textField: { variant: "outlined" } }}
              shouldDisableDate={disableNonFridays}
            />
          </Grid>
        </LocalizationProvider>

        <Grid
          container
          spacing={2}
          sx={{
            maxHeight: "650px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {selectedDate && filteredJurisprudences.length > 0 ? (
            filteredJurisprudences.map((juris) => (
              <Grid item xs={12} key={juris.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(juris)}>
                    <CardContent>
                      <Typography variant="h6">{juris.title}</Typography>
                      <Typography color="textSecondary">
                        Fecha: {juris.date}
                      </Typography>
                      <Typography variant="body2">{juris.summary}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {juris.source}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : selectedDate ? (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              No se encontraron jurisprudencias para esta fecha.
            </Typography>
          ) : (
            <Typography variant="body1" align="center" sx={{ width: "100%" }}>
              Por favor, selecciona una fecha.
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default JurisprudenceFinder;
