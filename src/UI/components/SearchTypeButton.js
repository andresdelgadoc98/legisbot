import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import config from "../../config/config";
import { Button } from "@mui/material";

export default function SearchTypeButton({ searchType, name_file }) {
  const url =
    searchType === "documentos"
      ? name_file
      : searchType === "jurisprudencias"
      ? "https://sjf2.scjn.gob.mx/busqueda-principal-tesis"
      : "#";

  const icon =
    searchType === "documentos" ? (
      <DescriptionIcon />
    ) : searchType === "jurisprudencias" ? (
      <GavelIcon />
    ) : null;

  return (
    <div>
      {searchType === null || searchType === "general" ? (
        <div></div>
      ) : (
        <Button
          variant="contained"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
        </Button>
      )}
    </div>
  );
}
