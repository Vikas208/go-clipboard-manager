import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Settings } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import routerPath from "../Constants/router";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      enableColorOnDark
      sx={{
        backgroundColor: "var(--mainColor)",
      }}
    >
      <IconButton
        size="small"
        edge="start"
        color="inherit"
        aria-label="menu"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          width: "24px",
          height: "24px",
          margin: 1,
          marginLeft: "auto",
        }}
      >
        <Settings sx={{ fontSize: "1.5rem" }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            to={`${routerPath.settings.path}/${routerPath.settings.children.keyboard}`}
          >
            KeyBoard Bindings
          </Link>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
export default Navbar;
