import { Box, Stack, Paper, Snackbar, Alert, AlertTitle } from "@mui/material";
import Bubble from "./bubble";
import NoteInput from "./noteInput";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { UsePrivateGet, UsePrivatePost } from "../../hooks/useFetchServer";
import PaneHeader from "./paneHeader";

export default function NotesPane(props) {
  const { username, onClose } = props;
  const [messages, setMessages] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [error, setError] = useState("");
  const [openErrorSnakbar, setOpenErrorSnakbar] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const effectRun = useRef(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const getServer = UsePrivateGet();
  const postServer = UsePrivatePost();

  useEffect(() => {
    //Fetch messages from server
    let isMounted = true;
    let controller = new AbortController();

    async function getNotes() {
      try {
        const response = await getServer(`/getnotes`, controller.signal);
        if (response?.disconnect) {
          setAuth({});
          navigate("/login", { state: { from: location }, replace: true });
        } else if (response?.error) {
          setError(response.error);
          setOpenErrorSnakbar(true);
        } else {
          const notesData = response?.data;
          isMounted && setMessages(notesData);
        }
      } catch (err) {
        console.error(err);
      }
    } //getNotes

    if (process.env.NODE_ENV === "development") {
      effectRun.current && getNotes();
    } else {
      getNotes();
    }

    return () => {
      isMounted = false;
      controller.abort();
      effectRun.current = true;
    };
  }, [messageSent]);

  const handleOnSubmit = async () => {
    //Post request to server
    const response = await postServer("/createnote", {
      note: {
        text: textAreaValue,
        user: username,
      },
    });

    if (response?.data) {
      setMessageSent(!messageSent);
      setTextAreaValue("");
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      setError(response?.error);
      setOpenErrorSnakbar(true);
    }
  };

  //closes the snakbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorSnakbar(false);
  };

  //Delete a message
  const handleDelete = async (noteid) => {
    const response = await postServer("/deletenote", {
      note: {
        id: noteid,
        user: username,
      },
    });

    if (response?.data) {
      setMessageSent(!messageSent);
      setTextAreaValue("");
    } else if (response?.disconnect) {
      setAuth({});
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      setError(response?.error);
      setOpenErrorSnakbar(true);
    }
  };

  return (
    <Paper
      sx={{
        height: { xs: "calc(90dvh - var(--Header-height))", lg: "90dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "Background",
      }}
    >
      <PaneHeader sender={username} onClose={onClose} />
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
              <Stack key={index} flexDirection={isYou ? "row-reverse" : "row"}>
                <Bubble
                  variant={isYou ? "sent" : "received"}
                  loggedUser={username}
                  handleDelete={() => handleDelete(message.note_id)}
                  isDeleted={message?.delete_timestamp ? true : false}
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
      <Snackbar
        open={error && openErrorSnakbar}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="error" onClose={handleClose}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
