import { Fragment, useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import dayjs from "dayjs";

export const ScheduleTable = (props) => {
  const { data } = props;

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
          {data?.map((row, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{row?.invoice.slice(0, 8)}</TableCell>
                <TableCell>{dayjs(row?.spot_time).format("HH:MM a")}</TableCell>
                <TableCell>
                  {dayjs(row?.start_time).format("HH:MM a")}
                </TableCell>
                <TableCell>{dayjs(row?.end_time).format("HH:MM a")}</TableCell>
                <TableCell>{`${row?.firstname} ${row?.lastname}`}</TableCell>
                <TableCell>{row?.vehicle_name}</TableCell>
                <TableCell>todo</TableCell>
                <TableCell>{row?.service_type}</TableCell>
                <TableCell>{row?.from_location}</TableCell>
                <TableCell>{row?.from_city}</TableCell>
                <TableCell>{row?.to_location}</TableCell>
                <TableCell>{row?.to_city}</TableCell>
                <TableCell>{row?.instructions}</TableCell>
                <TableCell>{row?.charge}</TableCell>
              </TableRow>
            );
          })}
        </TableHead>
      </Table>
    </Fragment>
  );
};
