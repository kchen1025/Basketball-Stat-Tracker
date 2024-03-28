import * as React from "react";
import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import IconButton from "@mui/joy/IconButton";
import { MenuIcon } from "@/icons";
import { useState, useEffect } from "react";
import { API } from "@/utils";

import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const [emoji, setEmoji] = useState(":)");

  const navigate = useNavigate();

  const toggleDrawer = (inOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(inOpen);
  };

  useEffect(() => {
    API.get("/api/emoji").then((data) => {
      setEmoji(data.message);
    });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", margin: 1 }}>
        <IconButton
          size="lg"
          variant="outlined"
          color="neutral"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent={"center"} fontSize={30}>
        {emoji}
      </Box>
      <Drawer open={open} size="sm" onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("home");
                }}
              >
                Home
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("win-rate-with-others-leaderboard");
                }}
              >
                Win Rate With Others Leaderboard
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("win-rate-against-player");
                }}
              >
                Win Rate Against Player
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("stats");
                }}
              >
                Stats Counter (Legacy)
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("career-highs");
                }}
              >
                Career Highs
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={() => {
                  navigate("game-entry");
                }}
              >
                Add New Game
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Outlet />
    </>
  );
}
