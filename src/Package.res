module GitHubButton = {
  @module("react-github-btn") @react.component
  external make: (~href: string, ~children: React.element=?) => React.element = "default"
}

@module("path-browserify")
external basename: string => string = "basename"
@module("path-browserify")
external extname: string => string = "extname"

module NumberFormat = {
  type t
  type options = {
    style: string,
    unit: string,
    unitDisplay: string,
  }

  @scope("Intl") @new
  external make: (string, ~options: options) => t = "NumberFormat"

  @send external format: (t, int) => string = "format"
}

type state = {
  selected: option<string>,
  expanded: array<string>,
  loadingCode: bool,
  code: option<string>,
  dialogOpen: bool,
}
type action = Select(string, Model.Meta.t) | CodeFetched(string) | OpenDialog | CloseDialog

@react.component
let make = (~name, ~version) => {
  let reducer = (state, action) => {
    switch action {
    | Select(id, meta) =>
      switch meta {
      | Directory(_) => {
          ...state,
          selected: id->Some,
          expanded: switch state.expanded->Js.Array2.includes(id) {
          | true => state.expanded->Js.Array2.filter(v => v != id)
          | false => state.expanded->Js.Array2.concat([id])
          },
        }

      | File(_) =>
        if state.selected != id->Some {
          {...state, selected: id->Some, loadingCode: true}
        } else {
          state
        }
      }
    | CodeFetched(code) => {...state, code: code->Some, loadingCode: false}
    | OpenDialog => {...state, dialogOpen: true}
    | CloseDialog => {...state, dialogOpen: false}
    }
  }
  let initialState = {
    selected: None,
    expanded: [],
    loadingCode: false,
    code: None,
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
    <div
      style={ReactDOM.Style.combine(Utils.centerStyles, ReactDOM.Style.make(~height="100vh", ()))}>
      <Blueprint.Spinner />
    </div>
  | false =>
    switch all.data {
    | None => React.null
    | Some((packageJson, meta)) => {
        let height = "40px"

        <div style={ReactDOM.Style.make(~display="flex", ~flexDirection="column", ())}>
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
              align="right" style={ReactDOM.Style.make(~height, ~fontSize="0", ())}>
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
          <div
            style={ReactDOM.Style.make(
              ~display="flex",
              ~flexGrow="1",
              ~height=`calc(100vh - ${height})`,
              (),
            )}>
            <div
              style={ReactDOM.Style.make(
                ~flexBasis="300px",
                ~flexShrink="0",
                ~overflow="auto",
                ~paddingTop="5px",
                (),
              )}>
              {
                let rec convert = meta => {
                  switch meta {
                  | Model.Meta.File(file) => {
                      Blueprint.Tree.id: file.path,
                      nodeData: meta,
                      icon: "document",
                      label: basename(file.path),
                      secondaryLabel: NumberFormat.make(
                        "en-US",
                        ~options={
                          style: "unit",
                          unit: file.size < 1024 ? "byte" : "kilobyte",
                          unitDisplay: "narrow",
                        },
                      )->NumberFormat.format(file.size),
                      isSelected: state.selected == file.path->Some,
                    }
                  | Model.Meta.Directory(file) => {
                      Blueprint.Tree.id: file.path,
                      nodeData: meta,
                      icon: "folder-close",
                      label: basename(file.path),
                      childNodes: file.files
                      ->Js.Array2.sortInPlaceWith((a, b) => {
                        let charCode = p =>
                          basename(p)->Js.String2.charCodeAt(0)->Belt.Int.fromFloat

                        switch (a, b) {
                        // directory first
                        | (Directory(_), File(_)) => -1
                        | (File(_), Directory(_)) => 1
                        | (File(a), File(b)) => a.path->charCode - b.path->charCode
                        | (Directory(a), Directory(b)) => a.path->charCode - b.path->charCode
                        }
                      })
                      ->Js.Array2.map(convert),
                      isExpanded: state.expanded->Js.Array2.includes(file.path),
                      isSelected: state.selected === file.path->Some,
                    }
                  }
                }

                let contents = switch convert(meta).childNodes {
                | Some(contents) => contents
                | None => []
                }

                let handleClick = async node => {
                  Select(node.Blueprint.Tree.id, node.nodeData)->dispatch
                  switch node.nodeData {
                  | File(file) => {
                      let code = await Utils.fetchCode(
                        name ++ "@" ++ packageJson.version,
                        file.path,
                      )
                      CodeFetched(code)->dispatch
                    }

                  | _ => ()
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
            <div style={ReactDOM.Style.make(~flexGrow="1", ~overflow="auto", ())}>
              {switch state.loadingCode {
              | true =>
                <div
                  style={ReactDOM.Style.combine(
                    Utils.centerStyles,
                    ReactDOM.Style.make(~height="100%", ()),
                  )}>
                  <Blueprint.Spinner />
                </div>
              | false =>
                switch state.code {
                | None =>
                  <div
                    style={ReactDOMStyle.combine(
                      Utils.centerStyles,
                      ReactDOMStyle.make(~height="100%", ()),
                    )}>
                    <Blueprint.Icon
                      icon="arrow-left" style={ReactDOMStyle.make(~paddingRight="10px", ())}
                    />
                    {"Select a file to view"->React.string}
                  </div>
                | Some(code) => {
                    let lang = switch state.selected
                    ->Belt.Option.map(extname)
                    ->Belt.Option.map(Js.String2.sliceToEnd(~from=1)) {
                    | Some("mjs") | Some("cjs") => "js"
                    | Some(ext) => ext
                    | _ => ""
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
