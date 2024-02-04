import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FaceIcon from "@mui/icons-material/Face";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { UsePrivateGet, UsePrivateDelete } from "../../hooks/useFetchServer";

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isListUpdated, setIsListUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnakbar, setOpenSnakbar] = useState(false);

  const effectRun = useRef(false); //avoids axios canceledError after controler.abort()

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const deleteServer = UsePrivateDelete();

  useEffect(() => {
    let isMounted = true;
    const controler = new AbortController();

    //fech the data from database
    const getUsers = async () => {
      const response = await getServer("/getusernames", controler.signal);

      //when server answer with 401
      if (response.disconnect) {
        setAuth({});
        navigate("/login", { state: { from: location }, replace: true });
        //other errors
      } else if (response.error) {
        setSuccess(false);
        setError(response.error);
        setOpenSnakbar(true);
      }
      //no error
      else {
        isMounted && setUsers(response.data);
      }
    };

    //avoid retrieving data after controler.abort() being called
    if (process.env.NODE_ENV === "development") {
      effectRun.current && getUsers();
    } else {
      getUsers();
    }

    return () => {
      isMounted = false;
      controler.abort();
      effectRun.current = true;
    };
  }, [isListUpdated]);

  //opens the dialog to confirm delete process
  const handleDelete = (user) => {
    setOpenDialog(true);
    setSelectedUser(user.username);
  };

  //Delete Dialog control
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Delete user from the database
  const handleConfirmDelete = async () => {
    const response = await deleteServer(`/deleteuser/${selectedUser}`);

    if (response.data) {
      setError(null);
      setSuccess(true);
      setOpenSnakbar(true);
      setIsListUpdated((update) => !update);
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else if (response.error) {
      setSuccess(false);
      setError(response.error);
      setOpenSnakbar(true);
    }

    //close the dialog
    setOpenDialog(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnakbar(false);
  };

  return (
    <div className="delete-container">
      <div className="delete-container-box">
        <h2>Users registered:</h2>
        <List>
          {users?.map((user) => (
            <ListItem
              key={user.username}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(user)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FaceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
        <p></p>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Confirm deleting ${selectedUser}?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDelete}>Yes</Button>
            <Button onClick={handleCloseDialog} autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={error && openSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="error" onClose={handleClose}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success && openSnakbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity="success" onClose={handleClose}>
            <AlertTitle>User deleted</AlertTitle>
            {`The user ${selectedUser} was deleted with success.`}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default DeleteUser;
