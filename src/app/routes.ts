import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { MainPage } from "./components/MainPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: MainPage },
    ],
  },
]);
