import "./App.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Home from "./containers/Home";
import Sidebar from "./containers/Sidebar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StatEntry from "./containers/StatEntry";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import GameDateEntry, {
  action as GameDateEntryAction,
} from "./containers/GameDateEntry";
import DataEntry, { loader as DataEntryLoader } from "./containers/DataEntry";
import ErrorPage from "./components/ErrorPage";
import { SnackbarProvider } from "./context/SnackbarContext";
import WinRateWithOthersLeaderboard, {
  loader as WinRateWithOthersLeaderboardLoader,
} from "./containers/WinRateWithOthersLeaderboard";
import WinRateAgainstPlayer, {
  loader as WinRateAgainstPlayerLoader,
} from "./containers/WinRateAgainstPlayer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/stats",
        element: <StatEntry />,
      },
      {
        path: "/game-entry",
        element: <GameDateEntry />,
        action: GameDateEntryAction,
      },
      {
        path: "/win-rate-with-others-leaderboard",
        element: <WinRateWithOthersLeaderboard />,
        loader: WinRateWithOthersLeaderboardLoader,
      },
      {
        path: "/win-rate-against-player",
        element: <WinRateAgainstPlayer />,
        loader: WinRateAgainstPlayerLoader,
      },
      {
        path: "/data-entry/:gameId",
        element: <DataEntry />,
        loader: DataEntryLoader,
      },
    ],
  },
]);

const App = () => {
  return (
    <SnackbarProvider>
      <CssVarsProvider defaultMode="dark">
        <CssBaseline />
        <RouterProvider router={router} />
      </CssVarsProvider>
    </SnackbarProvider>
  );
};

export default App;
