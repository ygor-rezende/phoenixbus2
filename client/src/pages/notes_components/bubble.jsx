import { Avatar, Stack, Box, Typography, IconButton } from "@mui/material";
import Sheet from "@mui/joy/Sheet";
import { useState } from "react";
import localDayJs from "../../utils/localDayjs";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Bubble(props) {
  const { content, variant, timestamp, sender, isDeleted, handleDelete } =
    props;
  const isSent = variant === "sent";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography>{sender === "You" ? sender : sender.name}</Typography>
        <Typography>{localDayJs(timestamp).format("LL")}</Typography>
      </Stack>
      <Box
        sx={{ position: "relative" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sheet
          color={isSent ? "primary" : "neutral"}
          variant={isSent ? "solid" : "soft"}
          sx={{
            p: 1.25,
            borderRadius: "lg",
            borderTopRightRadius: isSent ? 0 : "lg",
            borderTopLeftRadius: isSent ? "lg" : 0,
            backgroundColor: isSent ? "blue" : "whitesmoke",
          }}
        >
          <Typography sx={{ color: isSent ? "white" : "black" }}>
            {content}
          </Typography>
        </Sheet>
        {isHovered && isSent && (
          <Stack
            direction="row"
            justifyContent={isSent ? "flex-end" : "flex-start"}
            spacing={0.5}
            sx={{
              position: "absolute",
              top: "50%",
              p: 1.5,
              ...(isSent
                ? { left: 0, transform: "translate(-100%, -50%)" }
                : { right: 0, transform: "translate(100%, -50%)" }),
            }}
          >
            <IconButton size="small" onClick={handleDelete}>
              {isDeleted ? "" : <DeleteIcon color="primary" />}
            </IconButton>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
