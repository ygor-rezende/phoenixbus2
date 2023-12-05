import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const CustomDialog = (props) => {
  const { openDialog, onDelete, onCancel, title, description } = props;

  return (
    <Dialog
      open={openDialog}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete}>Yes</Button>
        <Button onClick={onCancel} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
