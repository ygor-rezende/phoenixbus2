import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EnhancedTable from "../../utils/table_generic";
import { useState } from "react";

import { UsePrivateDelete } from "../../hooks/useFetchServer";

import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const QuotesView = (props) => {
  const [expandPanel, setExpandPanel] = useState(false);
  const { getQuotesData, handleRowClick, onSuccess, onError, cancelEditing } =
    props;

  const deleteServer = UsePrivateDelete();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  //table headings
  const headings = [
    {
      id: "id",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Quote ID",
    },
    {
      id: "agencyName",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Agency",
    },
    {
      id: "agencyContact",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Contact",
    },
    {
      id: "salesPerson",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Sales Person",
    },
    {
      id: "quoteDate",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "Quote Date",
    },
    {
      id: "agencyEmail",
      isNumeric: false,
      isPaddingDisabled: false,
      label: "E-Mail",
    },
  ];

  const handleBoxChecked = (isItemChecked) => {
    if (isItemChecked) cancelEditing();
  };

  //Delete one or more records from the database
  const handleDelete = async (itemsSelected) => {
    const quoteIds = JSON.stringify(itemsSelected);
    const response = await deleteServer(`/deletebooking/${quoteIds}`);

    if (response?.data) {
      onSuccess(response.data);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response?.error) {
      onError(response.error);
    }
  }; //handleDelete

  return (
    <Accordion
      expanded={expandPanel}
      onChange={() => setExpandPanel(!expandPanel)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: "bold", color: "green" }}>
          VIEW QUOTES
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <EnhancedTable
          headings={headings}
          loadData={getQuotesData}
          dataUpdated={false}
          editData={handleRowClick}
          boxChecked={handleBoxChecked}
          onDelete={handleDelete}
          filterOption="agencyName"
          bgcolor="green"
        />
      </AccordionDetails>
    </Accordion>
  );
}; //QuotesView
