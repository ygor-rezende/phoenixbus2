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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FaceIcon from "@mui/icons-material/Face";
import { useState, useEffect } from "react";

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isListUpdated, setIsListUpdated] = useState(false);

  useEffect(() => {
    getUsers();
  }, [isListUpdated]);

  //fech the data from database
  const getUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/getusernames`
      );
      const json = await response.json();
      setUsers(json);
    } catch (err) {
      console.error(err);
    }
  };

  //opens the dialog to confirm delete process
  const handleDelete = (user) => {
    console.log(user.username);
    setOpenDialog(true);
    setSelectedUser(user.username);
  };

  //Delete Dialog control
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Delete user from the database
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/deleteuser/${selectedUser}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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
        //reload the list
        setIsListUpdated((update) => !update);
      }
      //close the dialog
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="delete-container">
      <div className="delete-container-box">
        <h2>Users registered:</h2>
        <List>
          {users.map((user) => (
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
      </div>
    </div>
  );
};

export default DeleteUser;
