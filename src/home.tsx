import { FC } from "react";
import { H1 } from "@blueprintjs/core";
import { Entry } from "./entry";

const forkText = "Fork me on GitHub";

export const Component: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        paddingBottom: "8rem",
      }}
    >
      <H1 style={{ paddingBottom: 20 }}>npmview</H1>
      <Entry />
      <a
        className="github-fork-ribbon"
        href="https://github.com/pd4d10/npmview"
        title={forkText}
        data-ribbon={forkText}
      >
        {forkText}
      </a>
    </div>
  );
};
