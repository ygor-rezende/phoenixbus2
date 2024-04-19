import { useState, useMemo, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import { visuallyHidden } from "@mui/utils";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ToggleButtonGroup,
  ToggleButton,
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
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
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
    bgcolor,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: bgcolor ? bgcolor : "primary.main" }}>
        <TableCell padding="checkbox">
          <Checkbox
            style={{ color: "white" }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {heading?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ color: "white" }}
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
  const { numSelected, onFilter, onDelete, disableDelete, searchOptions } =
    props;

  const [searchOpt, setSearchOpt] = useState(searchOptions?.at(0).id);

  const handleChangeSearch = (event, newValue) => {
    if (newValue !== null) setSearchOpt(newValue);
  };

  //Logic to display delete and edit buttons
  let buttons;
  if (numSelected === 1) {
    buttons = (
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Delete">
          <IconButton
            onClick={onDelete}
            disabled={disableDelete ? disableDelete : false}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else if (numSelected > 0) {
    buttons = (
      <Tooltip title="Delete">
        <IconButton
          onClick={onDelete}
          disabled={disableDelete ? disableDelete : false}
        >
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
        <div style={{ margin: "auto" }}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
            color="primary"
          >
            Search
          </Typography>

          <div
            id="table-header"
            style={{ marginBottom: "1em", display: "flex" }}
          >
            <ToggleButtonGroup
              value={searchOpt}
              color="primary"
              onChange={handleChangeSearch}
              aria-label="Search"
              exclusive
              size="small"
              style={{ marginRight: "1em" }}
            >
              {searchOptions?.map((option) => {
                return (
                  <ToggleButton value={option.id}>{option.name}</ToggleButton>
                );
              })}
            </ToggleButtonGroup>

            <TextField size="small" onChange={(e) => onFilter(e, searchOpt)} />
          </div>
        </div>
      )}
      {buttons}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const EnhancedTable = (props) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    headings,
    loadData,
    dataUpdated,
    editData,
    boxChecked,
    onDelete,
    disableDelete,
    filterOptions,
    bgcolor,
  } = props;

  useEffect(() => {
    const fechData = async () => {
      const data = await loadData();
      setData(data);
      setFilteredData(data);
    };

    fechData().catch(console.error);
  }, [dataUpdated, loadData]);

  //Table heading settings
  const headCells = headings?.map((element) => ({
    id: element.id,
    numeric: element.isNumeric,
    disablePadding: element.isPaddingDisabled,
    label: element.label,
  }));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //handles checkbox to select all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  //Calls the parent function to show the data for editing
  //when the user clicks a row
  const handleClick = (event, id) => {
    if (
      event.target.localName === "input" ||
      event.target.localName === "path" ||
      event.target.localName === "svg" ||
      event.target.localName === "button"
    )
      return;
    console.log(id);
    editData(id);
  };

  //handles request to select row(s) in the dable
  const handleSelectItem = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected?.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    boxChecked(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //filter table content
  const filterBySearch = (event, selectedOption) => {
    const query = event.target.value;

    let updatedList = [...data];

    updatedList = updatedList.filter((e) => {
      return (
        e[selectedOption].toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });

    setFilteredData(updatedList);
  };

  //Submit delete request after user confirms
  const handleDelete = () => {
    //call parent's delete function
    onDelete(selected);

    //close the dialog
    handleCloseDialog();

    //clear the checkbox selection
    setSelected([]);
  };

  //Delete Dialog control
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData?.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy))?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredData]
  );

  const colorLine = (data) => {
    if (data?.status === "canceled") return "red";
    else if (Number(data?.amountDue?.replace("$", "")) <= 0) return "green";
    else return "";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected?.length}
          onFilter={filterBySearch}
          searchOptions={filterOptions}
          onDelete={handleOpenDialog}
          disableDelete={disableDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected?.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredData?.length}
              heading={headCells}
              bgcolor={bgcolor}
            />
            <TableBody>
              {visibleRows?.map((row, index) => {
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
                        id={`checkbox${row.id}`}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        onChange={(event) => handleSelectItem(event, row.id)}
                      />
                    </TableCell>
                    {headCells?.map((cell) => {
                      return (
                        <TableCell
                          align={cell.numeric ? "right" : "left"}
                          padding={cell.disablePadding ? "none" : "normal"}
                          key={cell.id}
                          style={{
                            color: colorLine(row),
                            textTransform: "uppercase",
                          }}
                        >
                          {row[`${cell.id}`]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 30, 35]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
    </Box>
  );
};

export default EnhancedTable;
