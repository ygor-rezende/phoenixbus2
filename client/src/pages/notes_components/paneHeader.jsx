import { Stack, Avatar, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PaneHeader(props) {
  const { sender, onClose } = props;
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderBottom: "1px solid",
        borderColor: "darkgray",
        backgroundColor: "white",
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <Avatar sx={{ width: 24, height: 24 }}>
          {sender?.substring(0, 2)}
        </Avatar>
        <Typography
          sx={{ color: "primary.main", fontWeight: "bold" }}
          variant="h6"
        >
          NOTES
        </Typography>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <IconButton
          onClick={onClose}
          aria-label="close"
          style={{ alignSelf: "flex-end" }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
