import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const ModalSearch = ({
  open,
  onClose,
  onConfirm,
  documentsList,
  selectedType: initialSelectedType,
}) => {
  const [selectedType, setSelectedType] = useState(initialSelectedType);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSelectedType(initialSelectedType);
  }, [initialSelectedType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedOption("");
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirm = () => {
    if (selectedType === "documentos" && selectedOption === "") {
      alert("Por favor, selecciona un documento.");
      return;
    }

    onConfirm(
      selectedType,
      selectedType === "jurisprudencias" ? "" : selectedOption
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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Selecciona una opción
        </Typography>

        {/* RadioGroup para seleccionar el tipo (Leyes o Jurisprudencias) */}
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
            <FormControlLabel
              value="general"
              control={<Radio />}
              label="General"
            />
          </RadioGroup>
        </FormControl>

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
