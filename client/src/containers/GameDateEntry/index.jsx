import {
  Grid,
  Box,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Button,
} from "@mui/joy";

import { useState } from "react";

import { Form, redirect } from "react-router-dom";
import { createGame } from "@/api/stat-entry";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const { results } = await createGame(updates);
  if (results?.length) {
    return redirect(`/data-entry/${results[0]?.id}`);
  } else {
    return redirect(`/home`);
  }
}

const GameDataEntry = () => {
  const generateGameName = (day, game) => {
    return `D${day}G${game}`;
  };

  const [dayNumber, setDayNumber] = useState("");
  const [gameNumber, setGameNumber] = useState("");

  return (
    <Grid container justifyContent="center" margin={5}>
      <Box margin={3} width={500}>
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <Typography level="h1">New Game</Typography>
        </Box>
        <Form method="post">
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input name="date" type="date" placeholder="" required />
          </FormControl>
          <FormControl>
            <FormLabel>Day #</FormLabel>
            <Input
              name="dayNumber"
              type="number"
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              placeholder="e.g. 1"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Game #</FormLabel>
            <Input
              name="gameNumber"
              type="number"
              value={gameNumber}
              onChange={(e) => setGameNumber(e.target.value)}
              placeholder="e.g. 99"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Generated Game Name</FormLabel>
            <Input
              value={generateGameName(dayNumber, gameNumber)}
              name="gameNameDisplay"
              type="text"
              disabled
              required
            />
          </FormControl>
          {/* Hidden input to actually submit the gameName value */}
          <input
            type="hidden"
            name="gameName"
            value={generateGameName(dayNumber, gameNumber)}
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button type="submit" variant="solid">
              Submit
            </Button>
          </Box>
        </Form>
      </Box>
    </Grid>
  );
};

export default GameDataEntry;
