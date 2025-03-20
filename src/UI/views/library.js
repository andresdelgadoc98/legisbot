import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
} from "@mui/material";
import Documents from "../../Services/Controllers/Documents";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Header from "../components/Headers/HeaderMain";
import SideBar from "../components/SideBars/SideBarMain";
import config from "../../config/config";

const DocumentViewer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jurisdictions] = useState(["tamaulipas", "federal"]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const iframeRef = useRef(null);
  const [IsDrawerOpenMain, SetIsDrawerOpenMain] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const handleJurisdictionChange = async (event) => {
    const jurisdiction = event.target.value;
    setSelectedJurisdiction(jurisdiction);
    setSelectedDocument(null);
    if (jurisdiction) {
      const result = await Documents.getDocuments(jurisdiction);
      console.log({ result });
      setDocuments(result.data);
    } else {
      setDocuments([]);
    }
  };

  // Alternar pantalla completa
  const toggleFullscreen = () => {
    if (!isFullscreen && iframeRef.current) {
      iframeRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Detectar cambios en el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
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

  // Función para eliminar acentos
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar documentos según el texto del buscador, sin sensibilidad a acentos
  const filteredDocuments = documents.filter((doc) =>
    removeAccents(doc.name.toLowerCase()).includes(
      removeAccents(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ minHeight: "100vh", width: "100%" }}>
      <Header toggleDrawerMain={toggleDrawerMain} />
      <SideBar
        isDrawerOpen={IsDrawerOpenMain}
        toggleDrawer={toggleDrawerMain}
      />
      <Grid container spacing={2} sx={{ flexWrap: "wrap", height: "100%" }}>
        {/* Panel izquierdo */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          elevation={3}
          sx={{
            maxHeight: { xs: "50vh", md: "100vh" },
            overflow: "auto",
          }}
        >
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Jurisdicción</InputLabel>
              <Select
                value={selectedJurisdiction}
                label="Jurisdicción"
                onChange={handleJurisdictionChange}
              >
                <MenuItem value="">
                  <em>Selecciona una jurisdicción</em>
                </MenuItem>
                {jurisdictions.map((jurisdiction) => (
                  <MenuItem key={jurisdiction} value={jurisdiction}>
                    {jurisdiction}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Buscador de documentos */}
            <TextField
              fullWidth
              label="Buscar documento"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Lista de documentos */}
            <List
              sx={{ maxHeight: { xs: "40vh", md: "80vh" }, overflow: "auto" }}
            >
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={selectedDocument === doc}
                    onClick={() => handleDocumentClick(doc)}
                    sx={{ mb: 1, borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={doc.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Fecha: {doc.fecha_publicacion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Jurisdicción: {doc.jurisdiction}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ p: 2 }}>
                  {searchQuery
                    ? "No se encontraron documentos que coincidan con la búsqueda"
                    : "Selecciona una jurisdicción para ver los documentos"}
                </Typography>
              )}
            </List>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={8}
          elevation={3}
          sx={{ height: { xs: "50vh", md: "100vh" } }} // Ajusta altura según pantalla
        >
          <Box sx={{ p: 2, height: "100%", position: "relative" }}>
            {selectedDocument ? (
              <>
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
                <iframe
                  ref={iframeRef}
                  src={`${config.URL_DOCUMENTS}${selectedDocument.jurisdiccion}/${selectedDocument.folder}.pdf`}
                  title={selectedDocument.name}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary">
                  Selecciona un documento para visualizarlo
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentViewer;
