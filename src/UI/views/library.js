import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  List,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  ListItemButton,
} from "@mui/material";
import Documents from "../../Services/Controllers/Documents";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Header from "../components/Headers/HeaderMain";
import SideBar from "../components/SideBars/SideBarMain";
import config from "../../config/config";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const DocumentViewer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jurisdictions] = useState(["tamaulipas", "federal"]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [IsDrawerOpenMain, SetIsDrawerOpenMain] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
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
  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

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

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredDocuments = documents.filter((doc) =>
    removeAccents(doc.name.toLowerCase()).includes(
      removeAccents(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", overflow: "auto" }}>
      <Header toggleDrawerMain={toggleDrawerMain} />
      <SideBar
        isDrawerOpen={IsDrawerOpenMain}
        toggleDrawer={toggleDrawerMain}
      />
      <Grid container spacing={2} sx={{ flexWrap: "wrap", height: "100%" }}>
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
            <TextField
              fullWidth
              label="Buscar documento"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            <List
              sx={{ maxHeight: { xs: "40vh", md: "80vh" }, overflow: "auto" }}
            >
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <ListItemButton
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
                  </ListItemButton>
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
          sx={{ height: { xs: "50vh", md: "100vh" } }}
        >
          <Box
            ref={containerRef}
            sx={{ p: 2, height: "100%", position: "relative" }}
          >
            {selectedDocument ? (
              <>
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1,
                    color: "black",
                  }}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
                <Box sx={{ height: "100%", minHeight: "100vh", width: "100%" }}>
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                  >
                    <Viewer
                      fileUrl={`${config.URL_DOCUMENTS}${selectedDocument.jurisdiccion}/${selectedDocument.folder}.pdf`}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
                </Box>
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
