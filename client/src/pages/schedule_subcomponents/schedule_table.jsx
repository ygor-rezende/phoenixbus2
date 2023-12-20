import { Fragment } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";

export const ScheduleTable = () => {
  return (
    <Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Schedule
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Invoice</TableCell>
            <TableCell>Spot Time</TableCell>
            <TableCell>Service Time</TableCell>
            <TableCell>Released</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Vehicle</TableCell>
            <TableCell align="right">Payment</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>City From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>City To</TableCell>
            <TableCell>Instruction</TableCell>
            <TableCell align="right">Charge</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </Fragment>
  );
};
