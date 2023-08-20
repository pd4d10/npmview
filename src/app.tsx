import { FC, useEffect } from "react";
import { match, P } from "ts-pattern";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { make as Diff } from "./Diff.bs.js";
import { make as Home } from "./Home.bs.js";
import { make as Package } from "./Package.bs.js";

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

export const PackageWithParams: FC = () => {
  const { path0, path1 } = useParams<{ path0: string; path1: string }>();

  return match([path0, path1])
    .with([P.string, P.string], ([scope, nameWithVersion]) => {
      const { name, version } = extract(nameWithVersion);
      return <Package name={scope + "/" + name} version={version} />;
    })
    .with([P.string, P.nullish], ([nameWithVersion]) => {
      const { name, version } = extract(nameWithVersion);
      return <Package name={name} version={version} />;
    })
    .otherwise(() => <div>404</div>);
};

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "", element: <Home /> },
      { path: "diff/:name", element: <Diff /> },
      { path: ":path0", element: <PackageWithParams /> },
      { path: ":path0/:path1", element: <PackageWithParams /> },
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
