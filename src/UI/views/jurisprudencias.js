import React, { useState } from "react";
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
import { format } from "date-fns";
import Header from "../components/Headers/HeaderMain";
import SideBar from "../components/SideBars/SideBarMain";
function JurisprudenceFinder() {
  const [selectedDate, setSelectedDate] = useState(null);
  const jurisprudences = [
    {
      id: "2030098",
      title:
        "COMPETENCIA ECONÓMICA. EL ARTÍCULO 127, FRACCIÓN VIII, DE LA LEY FEDERAL DE COMPETENCIA ECONÓMICA, QUE PREVÉ UNA MULTA POR OMITIR NOTIFICAR UNA CONCENTRACIÓN CUANDO LEGALMENTE DEBIÓ HACERSE, NO VIOLA EL PRINCIPIO DE PROPORCIONALIDAD CONTENIDO EN EL ARTÍCULO 22, PARRÁFO PRIMERO, DE LA CONSTITUCIÓN FEDERAL.",
      date: "2025-03-14",
      summary:
        "No viola el principio de proporcionalidad del artículo 22 constitucional.",
      source:
        "SCJN; 11a. Época; Semanario Judicial de la Federación; 1a./J. 25/2025 (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030101",
      title:
        "COMPROBANTES FISCALES DIGITALES POR INTERNET (CFDI). EL ARTÍCULO 29-A, CUARTO PÁRRAFO, DEL CÓDIGO FISCAL DE LA FEDERACIÓN VULNERA EL DERECHO A LA SEGURIDAD JURÍDICA AL DISPONER QUE EL PLAZO PARA SU CANCELACIÓN SÓLO ES DURANTE EL EJERCICIO FISCAL EN QUE SE EXPIDAN.",
      date: "2025-03-14",
      summary:
        "Vulnera el derecho a la seguridad jurídica por limitar la cancelación al ejercicio fiscal.",
      source:
        "SCJN; 11a. Época; Semanario Judicial de la Federación; 1a./J. 23/2025 (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030127",
      title:
        "RECUSACIÓN. ES IMPROCEDENTE LA QUE PLANTEA CAUSAS DE IMPEDIMENTO PARA QUE UN MINISTRO O MINISTRA SE ABSTENGA DE CONOCER CUESTIONES ACCESORIAS O DIVERSAS AL FONDO DE LA CONTROVERSIA.",
      date: "2025-03-14",
      summary:
        "No aplica para cuestiones accesorias o diversas al fondo de la controversia.",
      source:
        "SCJN; 11a. Época; Semanario Judicial de la Federación; 1a./J. 24/2025 (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030130",
      title:
        "SANCIONES PENALES EN EL SISTEMA ACUSATORIO. LAS IMPUESTAS EN LA SENTENCIA DEFINITIVA DICTADA CON MOTIVO DE LA REPOSICIÓN TOTAL DEL PROCEDIMIENTO ORDENADA POR EL TRIBUNAL DE ALZADA EN CUMPLIMIENTO A UNA EJECUTORIA DE AMPARO DIRECTO PROMOVIDO ÚNICAMENTE POR EL SENTENCIADO, NO DEBEN SUPERAR A LAS QUE YA HABÍAN SIDO DECRETADAS PREVIAMENTE A LA PROMOCIÓN DEL JUICIO CONSTITUCIONAL PRIMIGENIO.",
      date: "2025-03-14",
      summary:
        "No deben superar las sanciones previas tras reposición ordenada por amparo.",
      source:
        "TCC; 11a. Época; Semanario Judicial de la Federación; II.3o.P. J/2 P (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030131",
      title:
        "SANCIONES PENALES EN EL SISTEMA ACUSATORIO. REGLAS PARA SU IMPOSICIÓN, LUEGO DE UNA REPOSICIÓN TOTAL DEL PROCEDIMIENTO ORDENADA POR EL TRIBUNAL DE ALZADA EN CUMPLIMIENTO A UNA EJECUTORIA DE AMPARO DIRECTO PROMOVIDO POR EL SENTENCIADO.",
      date: "2025-03-14",
      summary: "Reglas tras reposición total ordenada por amparo directo.",
      source:
        "TCC; 11a. Época; Semanario Judicial de la Federación; II.3o.P. J/3 P (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030094",
      title:
        "AMPARO INDIRECTO. PROCEDE CONTRA EL AUTO QUE DESECHA EL RECURSO DE APELACIÓN INTERPUESTO CONTRA LA INTERLOCUTORIA DE UN INCIDENTE DE ALIMENTOS (LEGISLACIÓN DEL ESTADO DE JALISCO).",
      date: "2025-03-14",
      summary: "En incidente de alimentos según legislación de Jalisco.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.A.C.CS. J/23 C (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030096",
      title:
        "AUDIENCIA PRELIMINAR EN EL PROCEDIMIENTO ORDINARIO LABORAL. NO ES NECESARIO NOTIFICAR PERSONALMENTE EL ACUERDO QUE SEÑALA FECHA PARA SU DESAHOGO CON LOS APERCIBIMIENTOS DE LEY.",
      date: "2025-03-14",
      summary:
        "No requiere notificación personal del acuerdo que señala fecha.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.P.T.CS. J/34 L (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030099",
      title:
        "COMPETENCIA PARA CONOCER DE JUICIOS LABORALES EN LOS QUE ES PARTE UNA EMPRESA CUYO OBJETO SOCIAL SEA COMERCIALIZAR, DISTRIBUIR, ALMACENAR Y TRANSPORTAR PRODUCTOS ALIMENTICIOS. CORRESPONDE A LOS TRIBUNALES LABORALES LOCALES.",
      date: "2025-03-14",
      summary:
        "Corresponde a tribunales laborales locales para empresas de productos alimenticios.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.P.T.CN. J/20 L (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030100",
      title:
        "COMPETENCIA POR TERRITORIO PARA CONOCER DEL AMPARO INDIRECTO CONTRA LA OMISIÓN DEL MINISTERIO PÚBLICO DE RESPONDER UNA SOLICITUD DE DEVOLUCIÓN DE UN INMUEBLE ASEGURADO. SE SURTE EN FAVOR DEL JUEZ DE DISTRITO CON JURISDICCIÓN EN EL LUGAR DONDE SE UBICA EL BIEN.",
      date: "2025-03-14",
      summary:
        "Se surte en favor del juez de distrito donde está el inmueble asegurado.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.P.T.CN. J/28 P (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030104",
      title:
        "DAÑOS Y PERJUICIOS CAUSADOS POR LA SUSPENSIÓN A LA PARTE TERCERA INTERESADA EN EL AMPARO INDIRECTO. PUEDE CONDENARSE AL PAGO DE UN IMPORTE SUPERIOR AL DE LA GARANTÍA FIJADA.",
      date: "2025-03-14",
      summary: "Puede condenarse a un importe superior a la garantía fijada.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.A.C.CN. J/5 K (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030105",
      title:
        "DERECHOS POR EL SERVICIO DE SUMINISTRO DE AGUA. LAS DISPOSICIONES TRANSITORIAS QUE PREVÉN UN PORCENTAJE ADICIONAL APLICABLE A LA TARIFA DEL ARTÍCULO 172 DEL CÓDIGO FISCAL DE LA CIUDAD DE MÉXICO, VIOLAN LOS PRINCIPIOS TRIBUTARIOS DE PROPORCIONALIDAD Y EQUIDAD.",
      date: "2025-03-14",
      summary: "Violan principios tributarios de proporcionalidad y equidad.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.A.C.CN. J/56 A (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
    {
      id: "2030106",
      title:
        "DERECHOS POR EL SERVICIO DE SUMINISTRO DE AGUA. LAS DISPOSICIONES TRANSITORIAS Y LOS AVISOS QUE PREVÉN EL PORCENTAJE ADICIONAL APLICABLE A LA TARIFA PREVISTA EN EL ARTÍCULO 172 DEL CÓDIGO FISCAL DE LA CIUDAD DE MÉXICO, DEBEN ANALIZARSE A LA LUZ DEL PRINCIPIO DE EQUIDAD TRIBUTARIA.",
      date: "2025-03-14",
      summary: "Deben analizarse bajo el principio de equidad tributaria.",
      source:
        "Plenos Regionales; 11a. Época; Semanario Judicial de la Federación; PR.A.C.CN. J/60 A (11a.); J; Publicación: viernes 14 de marzo de 2025 10:17 h",
    },
  ];
  const [IsDrawerOpenMain, SetIsDrawerOpenMain] = useState();

  const filteredJurisprudences = selectedDate
    ? jurisprudences.filter((j) => {
        const selectedDateString = format(selectedDate, "yyyy-MM-dd");
        return j.date === selectedDateString;
      })
    : [];

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
