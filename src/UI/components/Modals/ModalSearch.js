import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";

const ModalSearch = ({
  open,
  onClose,
  onConfirm,
  documentsList,
  selectedType,
  setSelectedType,
  selectedValue,
  setJurisdiccion,
  setJurisdicciónSelected,
  jurisdiccionSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState();
  const [JurisdiccionList, setJurisdicciónList] = useState([
    { name: "Federal", folder: "federal" },
    { name: "Tamaulipas", folder: "tamaulipas" },
  ]);

  useEffect(() => {
    if (selectedValue != null) {
      if (selectedType === "documentos") {
        const selectedDocument = documentsList.find(
          (doc) => doc.folder === selectedValue
        );
        console.log({ selectedDocument });
        setSelectedOption(selectedDocument || null);
      } else {
        setSelectedOption(null);
      }
    }
  }, [selectedValue, documentsList]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setSelectedOption(null);
  };

  const handleOptionChangeJurisdiccion = (event, newValue) => {
    if (newValue == null) {
      setSelectedOption(null);
      setJurisdicciónSelected(null);
      return;
    }

    const selectedJurisdiccion = JurisdiccionList.find(
      (item) => item.folder === newValue.folder
    );
    console.log({ selectedJurisdiccion });
    setJurisdiccion(selectedJurisdiccion.folder);
    setJurisdicciónSelected(selectedJurisdiccion);
    setSelectedOption(null);
  };

  const handleOptionChange = (event, newValue) => {
    setSelectedOption(newValue);
  };

  const handleConfirm = () => {
    if (selectedType === "documentos" && !selectedOption) {
      alert("Por favor, selecciona un documento.");
      return;
    }

    onConfirm(
      selectedType,
      selectedType === "documentos" ? selectedOption?.folder : ""
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
          width: 300,
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
            <FormControlLabel
              value="general"
              control={<Radio />}
              label="General"
            />
          </RadioGroup>
        </FormControl>

        {selectedType === "documentos" && (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Autocomplete
                options={JurisdiccionList}
                getOptionLabel={(option) => option.name}
                value={jurisdiccionSelected}
                onChange={handleOptionChangeJurisdiccion}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Jurisdicción"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Autocomplete
                options={documentsList}
                getOptionLabel={(option) => option.name}
                value={selectedOption}
                onChange={handleOptionChange}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                renderInput={(params) => (
                  <TextField {...params} label="Leyes" variant="outlined" />
                )}
              />
            </FormControl>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" onClick={handleConfirm}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalSearch;
