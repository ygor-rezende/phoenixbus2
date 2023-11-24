import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EnhancedTable from "../../utils/table_generic";
import { useState } from "react";

export const QuotesView = (props) => {
  const [expandPanel, setExpandPanel] = useState(false);
  const { getQuotesData, handleRowClick } = props;

  //table headings
  const headings = [
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
    //do nothing
    return;
  };

  const handleDelete = (item) => {
    //do nothing
    return;
  };

  return (
    <Accordion
      expanded={expandPanel}
      onChange={() => setExpandPanel(!expandPanel)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: "bold", color: "#1976d2" }}>
          USE QUOTE TO CREATE A BOOKING
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
        />
      </AccordionDetails>
    </Accordion>
  );
}; //QuotesView
