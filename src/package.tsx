import { useEffect, useState, useCallback, FC, Suspense } from "react";
import path from "path-browserify";
import {
  Tree,
  TreeNodeInfo,
  Divider,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Dialog,
  Classes,
  Spinner,
  Intent,
  Button,
  OverlayToaster,
} from "@blueprintjs/core";
import GitHubButton from "react-github-btn";
import {
  getRepositoryUrl,
  PackageMetaItem,
  fetchMeta,
  fetchPackageJson,
  fetchCode,
  centerStyles,
  HEADER_HEIGHT,
} from "./utils";
import { Entry } from "./entry";
import {
  useLoaderData,
  LoaderFunctionArgs,
  defer,
  Await,
} from "react-router-dom";
import { Preview } from "./preview";
import { P, match } from "ts-pattern";

// https://stackoverflow.com/a/73974452
const fileSizeFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});

export const loader = async ({
  params: { scope, name: nameWithVersion },
}: LoaderFunctionArgs) => {
  let { name, version } = match(nameWithVersion?.split("@"))
    .with([P.string, P.string], ([name, version]) => {
      return { name, version };
    })
    .with([P.string], ([name]) => {
      return { name, version: undefined };
    })
    .otherwise(() => {
      throw new Error("should not be here");
    });
  const fullName = scope ? scope + "/" + name : name;

  const packageJson = await fetchPackageJson(
    version ? `${fullName}@${version}` : fullName,
  );
  return defer({
    fullName,
    packageJson,
    meta: fetchMeta(`${fullName}@${packageJson.version}`),
  });
};

export const Component: FC = () => {
  const { fullName, packageJson, meta } = useLoaderData() as {
    fullName: string;
    packageJson: Awaited<ReturnType<typeof fetchPackageJson>>;
    meta: ReturnType<typeof fetchMeta>;
  };
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [selected, setSelected] = useState<string>();
  const [codeFetcher, setCodeFetcher] =
    useState<ReturnType<typeof fetchCode>>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const convertMetaToTreeNode = (
    file: PackageMetaItem,
  ): TreeNodeInfo<PackageMetaItem> => {
    switch (file.type) {
      case "directory":
        file.files.sort((a, b) => {
          // Directory first
          if (a.type === "directory" && b.type === "file") {
            return -1;
          } else if (a.type === "file" && b.type === "directory") {
            return 1;
          } else {
            // Then sorted by first char
            return (
              path.basename(a.path).charCodeAt(0) -
              path.basename(b.path).charCodeAt(0)
            );
          }
        });
        return {
          id: file.path,
          nodeData: file,
          icon: "folder-close",
          label: path.basename(file.path),
          childNodes: file.files.map(convertMetaToTreeNode),
          isExpanded: !!expandedMap[file.path],
          isSelected: selected === file.path,
        };
      case "file":
        return {
          id: file.path,
          nodeData: file,
          icon: "document",
          label: path.basename(file.path),
          secondaryLabel: fileSizeFormatter.format(file.size),
          isSelected: selected === file.path,
        };
    }
  };

  const handleClick = useCallback(
    async (node: TreeNodeInfo<PackageMetaItem>) => {
      if (!node.nodeData) return;

      switch (node.nodeData.type) {
        case "directory":
          setSelected(node.id as string);
          setExpandedMap((old) => ({ ...old, [node.id]: !old[node.id] }));
          break;
        case "file":
          if (selected === node.id) return;

          setSelected(node.id as string);
          try {
            setCodeFetcher(
              fetchCode(
                `${fullName}@${packageJson.version}`,
                node.id as string,
              ),
            );
          } catch (err) {
            console.error(err);
            OverlayToaster.create().show({
              message: (err as Error).message,
              intent: Intent.DANGER,
            });
          }
          break;
      }
    },
    [fullName, packageJson, selected],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Navbar style={{ height: HEADER_HEIGHT }}>
        <NavbarGroup style={{ height: HEADER_HEIGHT }}>
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            {packageJson.name}@{packageJson.version}
          </Button>

          <Dialog
            isOpen={dialogOpen}
            title="Select package"
            icon="info-sign"
            onClose={() => {
              setDialogOpen(false);
            }}
          >
            <div className={Classes.DIALOG_BODY}>
              <Entry
                afterChange={() => {
                  setDialogOpen(false);
                }}
              />
            </div>
          </Dialog>

          <NavbarDivider />
          <a
            href={`https://www.npmjs.com/package/${packageJson.name}/v/${packageJson.version}`}
          >
            npm
          </a>

          {packageJson.homepage && (
            <>
              <NavbarDivider />
              <a href={packageJson.homepage}>homepage</a>
            </>
          )}

          {packageJson.repository && (
            <>
              <NavbarDivider />
              <a href={getRepositoryUrl(packageJson.repository)}>repository</a>
            </>
          )}

          {packageJson.license && (
            <>
              <NavbarDivider />
              <div>{packageJson.license}</div>
            </>
          )}

          {packageJson.description && (
            <>
              <NavbarDivider />
              <div>{packageJson.description}</div>
            </>
          )}
        </NavbarGroup>
        <NavbarGroup
          align="right"
          style={{ height: HEADER_HEIGHT, fontSize: 0 }}
        >
          <GitHubButton
            href="https://github.com/pd4d10/npmview"
            aria-label="Star pd4d10/npmview on GitHub"
            data-icon="octicon-star"
            data-show-count
            data-size="large"
          >
            Star
          </GitHubButton>
        </NavbarGroup>
      </Navbar>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div
          style={{
            flexBasis: 300,
            flexShrink: 0,
            overflow: "auto",
            paddingTop: 5,
          }}
        >
          <Suspense fallback={<Spinner />}>
            <Await
              resolve={meta}
              errorElement={<p>Error loading package files!</p>}
            >
              {(meta) => {
                const files = convertMetaToTreeNode(meta).childNodes;
                if (!files) return null;

                return (
                  <Tree
                    contents={files}
                    onNodeClick={handleClick}
                    onNodeExpand={handleClick}
                    onNodeCollapse={handleClick}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
        <Divider />
        <div style={{ flexGrow: 1, overflow: "auto" }}>
          <Suspense
            fallback={
              <div style={{ ...centerStyles, height: "100%" }}>
                <Spinner />
              </div>
            }
          >
            <Await resolve={codeFetcher}>
              {(code) => {
                if (!selected) return null;
                return (
                  <Preview
                    code={code}
                    lang={path.extname(selected).slice(1).toLowerCase()}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
