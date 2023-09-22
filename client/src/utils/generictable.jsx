import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { MuiColorInput } from "mui-color-input";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Modal,
} from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    heading,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {heading.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, onFilter, onDelete, onEdit } = props;

  //Logic to display delete and edit buttons
  let buttons;
  if (numSelected === 1) {
    buttons = (
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else if (numSelected > 0) {
    buttons = (
      <Tooltip title="Delete">
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  } else {
    buttons = (
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <div id="table-header" style={{ margin: "auto", display: "flex" }}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Search by name:
          </Typography>
          <TextField size="small" onChange={onFilter} />
        </div>
      )}
      {buttons}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [vehiclesData, setVehiclesData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isTableUpdated, setIsTableUpdated] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [vehicleColor, setVehicleColor] = React.useState("#ffffff");
  const [vehicleModel, setVehicleModel] = React.useState("");
  const [vehicleName, setVehicleName] = React.useState("");
  const [vehicleYear, setVehicleYear] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const { headings } = props;

  //Get all vehicles data
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getallvehicles`
      );
      let responseData = await response.json();
      responseData = responseData.map((item) => {
        const vehicles = {
          id: item.vehicle_id,
          name: item.vehicle_name,
          model: item.vehicle_model,
          year: item.vehicle_year,
          color: item.vehicle_color,
        };
        return vehicles;
      });
      setVehiclesData(responseData);
      setFilteredData(responseData);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getData();
  }, [isTableUpdated]);

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: headings[0],
    },
    {
      id: "model",
      numeric: false,
      disablePadding: false,
      label: headings[1],
    },
    {
      id: "year",
      numeric: true,
      disablePadding: false,
      label: headings[2],
    },
    {
      id: "color",
      numeric: false,
      disablePadding: false,
      label: headings[3],
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const filterBySearch = (event) => {
    const query = event.target.value;

    let updatedList = [...vehiclesData];

    updatedList = updatedList.filter((e) => {
      return e.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    setFilteredData(updatedList);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deletevehicle`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleIds: selected }),
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      console.log(data);
      if (data.detail) {
        console.log(data.detail);
      } else {
        //reload the data
        setIsTableUpdated((update) => !update);
      }
    } catch (err) {
      console.error(err);
    }

    //close the dialog
    handleCloseDialog();
  };

  //Delete Dialog control
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleEdition = () => {
    if (isSelected.length === 1) {
      //load fields
      console.log(vehiclesData.filter((e) => e.id === selected[0]));
      setVehicleColor(
        vehiclesData.filter((e) => e.id === selected[0])[0].color
      );
      setVehicleName(vehiclesData.filter((e) => e.id === selected[0])[0].name);
      setVehicleModel(
        vehiclesData.filter((e) => e.id === selected[0])[0].model
      );
      setVehicleYear(vehiclesData.filter((e) => e.id === selected[0])[0].year);

      //open modal
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //save the changes made in one vehicle
  const handleSaveChanges = async () => {
    //save the vehicle data
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/updatevehicle`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicle: {
              id: selected[0],
              name: vehicleName,
              model: vehicleModel,
              year: vehicleYear,
              color: vehicleColor,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      console.log(data);
      if (data.detail) {
        console.log(data.detail);
      } else {
        //reload the data
        setIsTableUpdated((update) => !update);
      }
    } catch (err) {
      console.error(err);
    }
    //close modal
    setOpenModal(false);

    //remove selection
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredData]
  );

  const modalStile = {
    position: "absolute",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onFilter={filterBySearch}
          onDelete={handleOpenDialog}
          onEdit={handleEdition}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
              heading={headCells}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.model}</TableCell>
                    <TableCell align="right">{row.year}</TableCell>
                    <TableCell
                      align="left"
                      sx={{ backgroundColor: row.color }}
                    ></TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm deleting record(s)?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the records selected?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStile}>
          <Tooltip title="Close" style={{ alignSelf: "flex-end" }}>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            style={{ alignSelf: "center" }}
          >
            Edit vechicle
          </Typography>
          <p></p>
          <TextField
            required
            id="vehiclename"
            value={vehicleName}
            label="Name"
            type="text"
            onChange={(e) => setVehicleName(e.target.value)}
          />
          <p></p>
          <TextField
            id="vehiclemodel"
            value={vehicleModel}
            label="Model"
            type="text"
            onChange={(e) => setVehicleModel(e.target.value)}
          />
          <p></p>
          <TextField
            id="vehicleyear"
            value={vehicleYear}
            label="Year"
            type="text"
            onChange={(e) => setVehicleYear(e.target.value)}
          />
          <p></p>
          <MuiColorInput
            id="vehicleColor"
            label="Color"
            value={vehicleColor}
            onChange={(color) => setVehicleColor(color)}
            isAlphaHidden
          />
          <p></p>
          <Button variant="contained" onClick={handleSaveChanges}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
