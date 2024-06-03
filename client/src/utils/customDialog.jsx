import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const CustomDialog = (props) => {
  const { openDialog, onConfirm, onCancel, title, description, useOK } = props;

  return (
    <Dialog
      open={openDialog}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ zIndex: 2 }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {useOK ? (
          <Button onClick={onConfirm} autoFocus>
            OK
          </Button>
        ) : (
          <div>
            <Button onClick={onConfirm}>Yes</Button>
            <Button onClick={onCancel} autoFocus>
              No
            </Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
