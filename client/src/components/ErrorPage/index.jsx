import { useRouteError } from "react-router-dom";
import { Grid, Box } from "@mui/joy";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Grid container justifyContent="center" alignItems={"center"} margin={5}>
      <Box margin={3} width={500}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </Box>
    </Grid>
  );
}
