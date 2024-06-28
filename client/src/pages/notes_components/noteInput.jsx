import {
  Box,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Button,
  OutlinedInput,
} from "@mui/material";

import { useRef } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function NoteInput(props) {
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = useRef(null);

  const handleClick = () => {
    if (textAreaValue.trim() !== "") {
      onSubmit();
      setTextAreaValue("");
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <OutlinedInput
          placeholder="Type your note here..."
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e) => setTextAreaValue(e.target.value)}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          multiline
          style={{ width: "400px" }}
          endAdornment={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <div></div>
              <Button
                size="small"
                color="primary"
                sx={{ alignSelf: "center", borderRadius: "sm" }}
                onClick={handleClick}
              >
                Send {<SendRoundedIcon />}
              </Button>
            </Stack>
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{ "& textarea:first-of-type": { minHeight: 72 } }}
        />
      </FormControl>
    </Box>
  );
}
