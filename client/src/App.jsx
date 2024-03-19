import "./App.css";
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
        path: "/data-entry/:gameId",
        element: <DataEntry />,
        loader: DataEntryLoader,
      },
    ],
  },
]);

const App = () => {
  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
};

export default App;
