module Intl = {
  module NumberFormat = {
    type t

    @scope("Intl") @new
    external make: (string, ~options: 'options) => t = "NumberFormat"

    @send external format: (t, int) => string = "format"
  }
}

module Path = {
  @module("path-browserify") @variadic
  external join: array<string> => string = "join"

  @module("path-browserify")
  external basename: string => string = "basename"

  @module("path-browserify")
  external extname: string => string = "extname"
}

module GitHubButton = {
  @module("react-github-btn") @react.component
  external make: (~href: string, ~children: React.element=?) => React.element = "default"
}

type state = {
  selected?: string,
  expanded: array<string>,
  loadingCode: bool,
  fileAndCode?: (string, string),
  dialogOpen: bool,
}
type action =
  | SelectFile(string)
  | ToggleDirectory(string)
  | CodeFetched(string, string)
  | OpenDialog
  | CloseDialog

@react.component
let make = (~name, ~version) => {
  let reducer = (state, action) => {
    switch action {
    | SelectFile(id) =>
      if state.selected != id->Some {
        {...state, selected: id, loadingCode: true}
      } else {
        state
      }

    | ToggleDirectory(id) => {
        ...state,
        selected: id,
        expanded: switch state.expanded->Array.some(v => id == v) {
        | true => state.expanded->Array.keep(v => v != id)
        | false => state.expanded->Array.concat([id])
        },
      }

    | CodeFetched(file, code) => {...state, fileAndCode: (file, code), loadingCode: false}
    | OpenDialog => {...state, dialogOpen: true}
    | CloseDialog => {...state, dialogOpen: false}
    }
  }
  let initialState = {
    expanded: [],
    loadingCode: false,
    dialogOpen: false,
  }
  let (state, dispatch) = React.useReducer(reducer, initialState)

  let fetchAll = React.useCallback2(async _ => {
    let packageJson = await Utils.fetchPackageJson(
      switch version {
      | Some(version) => `${name}@${version}`
      | None => name
      },
    )
    let meta = await Utils.fetchMeta(name ++ "@" ++ packageJson.version)
    (packageJson, meta)
  }, (name, version))

  let all = Utils.useQuery(~fn=fetchAll)

  switch all.loading {
  | true =>
    <div className="flex items-center justify-center h-screen">
      <Blueprint.Spinner />
    </div>
  | false =>
    switch all.data {
    | None => React.null
    | Some((packageJson, meta)) => {
        let height = "40px"

        <div className="flex flex-col">
          <Blueprint.Navbar style={ReactDOM.Style.make(~height, ())}>
            <Blueprint.NavbarGroup style={ReactDOM.Style.make(~height, ())}>
              <Blueprint.Button
                onClick={_ => {
                  OpenDialog->dispatch
                }}>
                {(packageJson.name ++ "@" ++ packageJson.version)->React.string}
              </Blueprint.Button>
              <Blueprint.Dialog
                isOpen=state.dialogOpen
                title="Select package"
                icon="info-sign"
                onClose={_ => {
                  CloseDialog->dispatch
                }}>
                <div className={Blueprint.classes["DIALOG_BODY"]}>
                  <Entry
                    afterChange={_ => {
                      CloseDialog->dispatch
                    }}
                  />
                </div>
              </Blueprint.Dialog>
              <Blueprint.NavbarDivider />
              <a
                href={`https://www.npmjs.com/package/${packageJson.name}/v/${packageJson.version}`}>
                {"npm"->React.string}
              </a>
              {switch packageJson.homepage {
              | Some(homepage) =>
                <>
                  <Blueprint.NavbarDivider />
                  <a href={homepage}> {"homepage"->React.string} </a>
                </>
              | _ => React.null
              }}
              // {switch packageJson.repository {
              // | Some(repository) =>
              //   <>
              //     <Blueprint.NavbarDivider />
              //     // TODO: getRepositoryUrl
              //     <a href={repository}> {"repository"->React.string} </a>
              //   </>
              // | _ => React.null
              // }}
              {switch packageJson.license {
              | Some(license) =>
                <>
                  <Blueprint.NavbarDivider />
                  <div> {license->React.string} </div>
                </>
              | _ => React.null
              }}
              {switch packageJson.description {
              | Some(description) =>
                <>
                  <Blueprint.NavbarDivider />
                  <div> {description->React.string} </div>
                </>
              | _ => React.null
              }}
            </Blueprint.NavbarGroup>
            <Blueprint.NavbarGroup
              align={#right} style={ReactDOM.Style.make(~height, ~fontSize="0", ())}>
              {React.cloneElement(
                <GitHubButton href="https://github.com/pd4d10/npmview">
                  {"Star"->React.string}
                </GitHubButton>,
                {
                  "aria-label": "Star pd4d10/npmview on GitHub",
                  "data-icon": "octicon-star",
                  "data-show-count": "data-show-count",
                  "data-size": "large",
                },
              )}
            </Blueprint.NavbarGroup>
          </Blueprint.Navbar>
          <div className="flex flex-grow h-[calc(100vh-40px)]">
            <div className="basis-80 flex-shrink-0 overflow-auto pt-1">
              {
                let rec convert = (meta: Model.Meta.t): Blueprint.Tree.data<Model.Meta.payload> => {
                  let (id, nodeData, label, isSelected) = (
                    meta.path,
                    meta.payload,
                    Path.basename(meta.path),
                    state.selected == meta.path->Some,
                  )

                  switch meta.payload {
                  | Model.Meta.File(file) => {
                      id,
                      nodeData,
                      label,
                      isSelected,
                      icon: "document",
                      secondaryLabel: Intl.NumberFormat.make(
                        "en",
                        // https://stackoverflow.com/a/73974452
                        ~options={
                          "notation": "compact",
                          "style": "unit",
                          "unit": "byte",
                          "unitDisplay": "narrow",
                        },
                      )->Intl.NumberFormat.format(file.size),
                    }
                  | Model.Meta.Directory(file) => {
                      id,
                      nodeData,
                      label,
                      isSelected,
                      icon: "folder-close",
                      childNodes: file.files
                      ->SortArray.stableSortBy((a, b) => {
                        let charCode = p =>
                          Path.basename(p)->Js.String2.charCodeAt(0)->Int.fromFloat

                        switch (a, b) {
                        // directory first
                        | ({payload: Directory(_)}, {payload: File(_)}) => -1
                        | ({payload: File(_)}, {payload: Directory(_)}) => 1
                        | ({payload: File(_)}, {payload: File(_)}) =>
                          a.path->charCode - b.path->charCode
                        | ({payload: Directory(_)}, {payload: Directory(_)}) =>
                          a.path->charCode - b.path->charCode
                        }
                      })
                      ->Array.map(convert),
                      isExpanded: state.expanded->Array.some(v => meta.path == v),
                    }
                  }
                }

                let contents = switch convert(meta).childNodes {
                | Some(contents) => contents
                | None => []
                }

                let handleClick = async (node: Blueprint.Tree.data<Model.Meta.payload>) => {
                  switch node.nodeData {
                  | File(_) =>
                    if node.id->Some != state.selected {
                      SelectFile(node.id)->dispatch

                      let code = await Utils.fetchCode(name ++ "@" ++ packageJson.version, node.id)
                      CodeFetched(node.id, code)->dispatch
                    }
                  | Directory(_) => ToggleDirectory(node.id)->dispatch
                  }
                }

                <Blueprint.Tree
                  contents
                  onNodeClick={handleClick}
                  onNodeCollapse={handleClick}
                  onNodeExpand={handleClick}
                />
              }
            </div>
            <Blueprint.Divider />
            <div className="flex-grow overflow-auto">
              {switch state.loadingCode {
              | true =>
                <div className="flex items-center justify-center h-full">
                  <Blueprint.Spinner />
                </div>
              | false =>
                switch state.fileAndCode {
                | None =>
                  <div className="flex items-center justify-center h-full">
                    <Blueprint.Icon
                      icon="arrow-left" style={ReactDOMStyle.make(~paddingRight="10px", ())}
                    />
                    {"Select a file to view"->React.string}
                  </div>
                | Some(file, code) => {
                    let lang = switch file->Path.extname->Js.String2.sliceToEnd(~from=1) {
                    | "mjs" | "cjs" => "js"
                    | ext => ext
                    }

                    <Preview code lang />
                  }

                // TODO
                }
              }}
            </div>
          </div>
        </div>
      }
    }
  }
}
