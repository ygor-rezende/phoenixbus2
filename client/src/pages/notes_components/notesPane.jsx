import { Box, Stack, Paper } from "@mui/material";
import Bubble from "./bubble";
import NoteInput from "./noteInput";
import { useEffect, useState } from "react";

export default function NotesPane(props) {
  const { username } = props;
  const [messages, setMessages] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    //Fetch messages from server
  }, []);

  const handleOnSubmit = async () => {
    //Post request to server
  };

  return (
    <Paper
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", lg: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "beige",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {messages?.map((message, index) => {
            const isYou = message.username === username;
            return (
              <Stack>
                <Bubble
                  variant={isYou ? "sent" : "received"}
                  loggedUser={username}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <NoteInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={handleOnSubmit}
      />
    </Paper>
  );
}
