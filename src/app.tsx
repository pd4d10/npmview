import { FC, useEffect } from "react";
import { match, P } from "ts-pattern";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./home.js";
import { Package } from "./package.js";

const extract = (nameWithVersion: string) => {
  return match(nameWithVersion.split("@"))
    .with([P.string, P.string], ([name, version]) => {
      return { name, version };
    })
    .with([P.string], ([name]) => {
      return { name, version: undefined };
    })
    .otherwise(() => {
      return { name: undefined, version: undefined };
    });
};

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "", element: <Home /> },
      // TODO:
      // { path: "diff/:name", element: <Diff /> },
      { path: ":name", element: <Package /> },
      { path: ":scope/:name", element: <Package /> },
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
