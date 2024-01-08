import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import KeyboardBindings from "./components/Settings/KeyboardBindings";
import routerPath from "./Constants/router";

const SettingsRoutes: RouteObject | undefined = {
  path: routerPath.settings.path,
  caseSensitive: true,
  children: [
    {
      path: `${routerPath.settings.path}/${routerPath.settings.children.keyboard}`,
      element: <KeyboardBindings />,
      caseSensitive: true,
    },
  ],
};
export const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    caseSensitive: true,
    children: [SettingsRoutes],
  },
]);
