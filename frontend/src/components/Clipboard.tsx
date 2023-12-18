import { useEffect, useState } from "react";
import "../styles/clipboard.css";
import { TClipboard } from "../../schema/clipboard";
import { clipboardData } from "../services/sampledata";
import SlotListItems from "./SlotListItems";
import { Container, Grid } from "@mui/material";
import { EventsOn } from "../../wailsjs/runtime/runtime";

export default function Clipboard() {
  const [copiedData, setCopiedData] = useState<TClipboard>(clipboardData);

  if (Object.keys(copiedData).length === 0) return null;

  EventsOn("clipboard", (data: any) => {
    try {
      let _data = JSON.parse(atob(data));
      console.log(_data)
      setCopiedData((prev) => {
        console.log('prev',prev)
        return {
          ...prev,
          [_data.id]: {
            ...prev[_data.id],
            Items: [...prev[_data.id].Items, ..._data.Items],
          },
        };
      })
    } catch (err) {
      console.log(err);
    }
  });

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
