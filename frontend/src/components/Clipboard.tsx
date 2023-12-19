import { useEffect, useState } from "react";
import "../styles/clipboard.css";
import { TClipboard } from "../../schema/clipboard";
import { clipboardData } from "../services/sampledata";
import SlotListItems from "./SlotListItems";
import { Container, Grid, debounce } from "@mui/material";
import { EventsOn } from "../../wailsjs/runtime/runtime";

export default function Clipboard() {
  let [copiedData, setCopiedData] = useState<TClipboard>(clipboardData);

  if (Object.keys(copiedData).length === 0) return null;

  const debouncedUpdateState = debounce(
    (data: { id: string; Items: Array<string> }) => {
      setCopiedData((pre) => {
        return {
          ...pre,
          [data.id]: {
            id: data.id,
            Items: [...pre[data.id].Items, ...data.Items],
          },
        };
      });
    },
    300
  );

  useEffect(() => {
    EventsOn("clipboard", (data: any) => {
      try {
        let _data = JSON.parse(atob(data));
        console.log(_data);
        debouncedUpdateState(_data);
      } catch (err) {
        console.log(err);
      }
    });

    EventsOn("slotClipboardChanges", (data: any) => {
      try {
        let _data = JSON.parse(atob(data));
        console.log("Slot Changes", _data);
        debouncedUpdateState(_data);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  return (
    <Container sx={{ marginTop: "1rem" }}>
      <Grid container spacing={1}>
        {Object.keys(copiedData).map((e) => {
          return (
            <Grid item xs={4} key={e}>
              <SlotListItems slot={copiedData[e]} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
