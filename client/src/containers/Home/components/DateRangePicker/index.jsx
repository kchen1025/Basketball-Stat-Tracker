import {
  Grid,
  Box,
  FormControl,
  FormLabel,
  Input,
  Typography,
  FormHelperText,
  Button,
} from "@mui/joy";

import { useState } from "react";
import { isAfter } from "date-fns";

const DateRangePicker = ({ onSubmit }) => {
  const [error, setError] = useState("");

  return (
    <Grid margin={5}>
      <Grid display="flex" justifyContent="flexStart">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            const { startDate, endDate } = formJson;

            if (isAfter(startDate, endDate)) {
              setError("Start date must be before end date");
            } else {
              onSubmit(formJson);
              setError("");
            }
          }}
          style={{ display: "inline-flex" }}
        >
          <FormControl error={error !== ""}>
            <FormLabel>Start Date</FormLabel>
            <Input name="startDate" type="date" placeholder="" required />
          </FormControl>
          <FormControl error={error !== ""}>
            <FormLabel>End Date</FormLabel>
            <Input name="endDate" type="date" placeholder="" required />
          </FormControl>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button type="submit" variant="solid">
              Submit
            </Button>
          </Box>
        </form>
      </Grid>
      {error ? (
        <FormHelperText sx={{ color: "red" }}>{error}</FormHelperText>
      ) : null}
    </Grid>
  );
};

export default DateRangePicker;
