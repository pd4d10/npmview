import "./app.css";
import { FC, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "", lazy: () => import("./home.js") },
      // TODO:
      // { path: "diff/:name", element: <Diff /> },
      { path: ":name", lazy: () => import("./package.js") },
      { path: ":scope/:name", lazy: () => import("./package.js") },
    ],
  },
]);

export const App: FC = () => {
  // TODO:
  // useEffect(() => {
  //   // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
  //   gtag("set", "page_path", window.location.pathname);
  //   gtag("event", "page_view");
  // }, [url]);

  return <RouterProvider router={router} />;
};
