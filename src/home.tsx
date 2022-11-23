import React, { FC } from "react";
import { Entry } from "./entry";
import { H1 } from "@blueprintjs/core";
import { centerStyles } from "./utils";

export const Home: FC = () => {
  return (
    <div style={{ ...centerStyles, height: "100vh", flexDirection: "column" }}>
      <H1 style={{ paddingBottom: 20 }}>npmview</H1>
      <Entry />
      <div style={{ height: "30vh" }} />
      <a
        className="github-fork-ribbon"
        href="https://github.com/pd4d10/npmview"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
    </div>
  );
};
