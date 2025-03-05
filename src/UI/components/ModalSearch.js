import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const ModalSearch = ({ open, onClose, onConfirm, documentsList }) => {
  const [selectedType, setSelectedType] = useState("documentos");
  const [selectedOption, setSelectedOption] = useState("");
  const [keyword, setKeyword] = useState("");

  const documentos = [
    { id: 1, name: "Contrato de Arrendamiento" },
    { id: 2, name: "Acta Constitutiva" },
    { id: 3, name: "Demanda Civil" },
  ];

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedOption(""); // Reiniciar la selección al cambiar el tipo
    setKeyword(""); // Reiniciar la palabra clave
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleConfirm = () => {
    if (selectedType === "jurisprudencias" && keyword.trim() === "") {
      alert("Por favor, ingresa una palabra clave.");
      return;
    }
    if (selectedType === "documentos" && selectedOption === "") {
      alert("Por favor, selecciona un documento.");
      return;
    }

    onConfirm(
      selectedType,
      selectedType === "jurisprudencias" ? keyword : selectedOption
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Selecciona una opción
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup row value={selectedType} onChange={handleTypeChange}>
            <FormControlLabel
              value="documentos"
              control={<Radio />}
              label="Leyes"
            />
            <FormControlLabel
              value="jurisprudencias"
              control={<Radio />}
              label="Jurisprudencias"
            />
          </RadioGroup>
        </FormControl>

        {selectedType === "jurisprudencias" && (
          <TextField
            fullWidth
            label="Palabra clave"
            value={keyword}
            onChange={handleKeywordChange}
            sx={{ mb: 3 }}
          />
        )}

        {selectedType === "documentos" && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="select-label">Documento</InputLabel>
            <Select
              labelId="select-label"
              value={selectedOption}
              onChange={handleOptionChange}
              label="Documento"
            >
              {documentsList.map((item, index) => (
                <MenuItem key={index} value={item.folder}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalSearch;
