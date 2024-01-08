import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Container,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { KeyBindings } from "../../types/keyboard";
import { AddKeyBindings } from "../../../wailsjs/go/keyboard/Application";

function KeyboardBindings() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = React.useState<Array<KeyBindings>>([
    {
      id: 1,
      slot: "Slot1",
      key: null,
    },
    {
      id: 2,
      slot: "Slot2",
      key: null,
    },
    {
      id: 3,
      slot: "Slot3",
      key: null,
    },
    {
      id: 4,
      slot: "Slot4",
      key: null,
    },
    {
      id: 5,
      slot: "Slot5",
      key: null,
    },
    {
      id: 6,
      slot: "Slot6",
      key: null,
    },
    {
      id: 7,
      slot: "Slot7",
      key: null,
    },
    {
      id: 8,
      slot: "Slot8",
      key: null,
    },
    {
      id: 9,
      slot: "Common",
      key: null,
    },
  ]);
  const [editMetaData, setEditMetaData] = React.useState<KeyBindings>();

  const handleEditBinding = (text: string) => {
    console.log(text);

    


    const _rows = rows.map((e) => {
      if (e.id === editMetaData?.id) {
        return {
          ...editMetaData,
          key: text,
        };
      } else {
        return e;
      }
    });
    setRows(_rows);
    AddKeyBindings({
      id: editMetaData?.id ?? 0,
      key: text,
      slot: editMetaData?.slot ?? "",
    });

  };

  const onClickOfCell = (data: KeyBindings) => {
    setOpen(true);
    setEditMetaData(data);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <TableContainer component={Paper}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
            letterSpacing: 1,
            p: 1,
          }}
        >
          Keyboard Bindings
        </Typography>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Slots</TableCell>
              <TableCell>Shortcut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="td" scope="row">
                  {row.slot}
                </TableCell>

                <TableCell
                  sx={{
                    userSelect: "none",
                    display: "flex",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onClickOfCell({
                      id: row.id,
                      key: row.key,
                      slot: row.slot,
                    });
                  }}
                >
                  {row.key ? (
                    row.key.split("+").map((e, idx) => {
                      return (
                        <div key={idx}>
                          <kbd>{e}</kbd>
                          {idx ===
                          (row.key?.split("+").length ?? 0) - 1 ? null : (
                            <code className="mx-1">+</code>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <pre>EMPTY</pre>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <KeyBindingsModal
        open={open}
        setOpen={setOpen}
        callback={handleEditBinding}
        metaData={editMetaData}
      />
    </Container>
  );
}

type KeyBindingsModalType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback: Function;
  metaData: KeyBindings | undefined;
};

function KeyBindingsModal({
  open,
  setOpen,
  callback,
  metaData,
}: KeyBindingsModalType) {
  const [keyCodes, setKeyCodes] = React.useState<Array<string>>([]);
  // ** Handle Events **
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(e.key);

    switch (e.key) {
      case "Enter":
        callback(keyCodes.join("+"));
        setOpen(false);
        break;
      case "Escape":
        setKeyCodes([]);
        break;
      default:
        if (keyCodes.length > 3) setKeyCodes([]);
        console.log(
          keyCodes.find((e) => e === "Control" || e === "Shift" || e === "Alt")
        );
        if (keyCodes.includes(e.key)) {
          setKeyCodes([e.key]);
        } else if (
          !keyCodes.find((e) => e === "Control" || e === "Shift" || e === "Alt")
        ) {
          if (keyCodes.length === 2) setKeyCodes(() => [e.key]);
          else setKeyCodes((pre) => [...pre, e.key]);
        } else {
          setKeyCodes((pre) => [...pre, e.key]);
        }
        break;
    }
  };

  React.useEffect(() => {
    return () => {
      setKeyCodes([]);
    };
  }, []);

  // Style
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "0.6rem",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Modal
      open={open}
      onClose={(_e, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        setOpen(false);
      }}
    >
      <Box sx={style}>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: "600",
          }}
        >
          Press desire key combination and then press enter
        </Typography>

        <TextField
          id="key-binding"
          label="binding"
          variant="standard"
          value={keyCodes.join("+")}
          focused
          autoFocus
          sx={{
            mt: 1,
          }}
          onChange={() => {
            setKeyCodes(keyCodes);
          }}
          onKeyDown={handleKeyPress}
          helperText={
            keyCodes.length !== 0 ? (
              keyCodes.map((e, idx) => {
                return (
                  <div key={idx}>
                    <kbd>{e}</kbd>
                    {idx === keyCodes.length - 1 ? null : (
                      <code className="mx-1">+</code>
                    )}
                  </div>
                );
              })
            ) : (
              <pre>Press Escape to clear value</pre>
            )
          }
          FormHelperTextProps={{
            style: {
              textAlign: "center",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            },
          }}
        />
      </Box>
    </Modal>
  );
}
export default KeyboardBindings;
