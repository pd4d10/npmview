module GitHubButton = {
  @module("react-github-btn") @react.component
  external make: (~href: string, ~children: React.element=?) => React.element = "default"
}

@module("path-browserify")
external basename: string => string = "basename"
@module("path-browserify")
external extname: string => string = "extname"

module Numeral = {
  type t = {format: string => string}
  @module("numeral")
  external numeral: int => t = "default"
}

@react.component
let make = (~name, ~version) => {
  let (loadingMeta, setLoadingMeta) = React.useState(_ => false)
  let (meta, setMeta) = React.useState(_ => None)
  let (packageJson, setPackageJson) = React.useState(_ => None)
  let (expandedMap, setExpandedMap) = React.useState(_ => Js.Dict.empty())

  let (selected, setSelected) = React.useState(_ => None)
  let (loadingCode, setLoadingCode) = React.useState(_ => false)
  let (code, setCode) = React.useState(_ => None)
  let (ext, setExt) = React.useState(_ => None)
  let (dialogOpen, setDialogOpen) = React.useState(_ => false)

  React.useEffect2(_ => {
    let init = async _ => {
      try {
        setLoadingMeta(_ => true)
        let packageJson = await Utils.fetchPackageJson(
          switch version {
          | Some(version) => `${name}@${version}`
          | _ => name
          },
        )
        setPackageJson(_ => packageJson->Some)
        let meta = await Utils.fetchMeta(name ++ "@" ++ packageJson.version)
        setMeta(_ => meta->Some)
      } catch {
      | Js.Exn.Error(obj) =>
        switch Js.Exn.message(obj) {
        | Some(m) => Js.log(m)
        // TODO: toast
        | _ => ()
        }
      }
      setLoadingMeta(_ => false)
    }
    let _ = init()
    None
  }, (name, version))

  switch loadingMeta {
  | true =>
    <div
      style={ReactDOM.Style.combine(Utils.centerStyles, ReactDOM.Style.make(~height="100vh", ()))}>
      <Blueprint.Spinner />
    </div>
  | false =>
    switch meta {
    | None => React.null
    | Some(meta) => {
        let height = "40"

        switch packageJson {
        | None => React.null
        | Some(packageJson) =>
          <div style={ReactDOM.Style.make(~display="flex", ~flexDirection="column", ())}>
            <Blueprint.Navbar style={ReactDOM.Style.make(~height, ())}>
              <Blueprint.NavbarGroup style={ReactDOM.Style.make(~height, ())}>
                <Blueprint.Button
                  onClick={_ => {
                    setDialogOpen(_ => true)
                  }}>
                  {(packageJson.name ++ "@" ++ packageJson.version)->React.string}
                </Blueprint.Button>
                <Blueprint.Dialog
                  isOpen=dialogOpen
                  title="Select package"
                  icon="info-sign"
                  onClose={_ => {
                    setDialogOpen(_ => false)
                  }}>
                  <div className={Blueprint.classes["DIALOG_BODY"]}>
                    <Entry
                      afterChange={_ => {
                        setDialogOpen(_ => false)
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
                ~height=`calc(100vh - ${height}px)`,
                (),
              )}>
              <div
                style={ReactDOM.Style.make(
                  ~flexBasis="300",
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
                        secondaryLabel: Numeral.numeral(file.size).format(
                          file.size < 1024 ? "0b" : "0.00b",
                        ),
                        isSelected: selected == file.path->Some,
                      }
                    | Model.Meta.Directory(file) => {
                        Blueprint.Tree.id: file.path,
                        nodeData: meta,
                        icon: "folder-close",
                        label: basename(file.path),
                        childNodes: file.files->Js.Array2.map(convert),
                        isExpanded: expandedMap->Js.Dict.get(file.path) == true->Some,
                        isSelected: selected === file.path->Some,
                      }
                    }
                  }

                  let contents = switch convert(meta).childNodes {
                  | Some(contents) => contents
                  | _ => []
                  }

                  let handleClick = async node => {
                    switch node.Blueprint.Tree.nodeData {
                    | Directory(_) => {
                        setSelected(_ => node.id->Some)
                        expandedMap->Js.Dict.set(
                          node.id,
                          switch node.isExpanded {
                          | Some(true) => false
                          | _ => true
                          },
                        )
                        setExpandedMap(_ => expandedMap)
                      }

                    | File(file) =>
                      if selected != node.id->Some {
                        setSelected(_ => node.id->Some)
                        try {
                          setLoadingCode(_ => true)
                          let code = await Utils.fetchCode(
                            name ++ "@" ++ packageJson.version,
                            file.path,
                          )
                          setCode(_ => code->Some)
                          setExt(_ => file.path->extname->Js.String2.sliceToEnd(~from=1)->Some)
                        } catch {
                        | Js.Exn.Error(obj) => Js.log(obj)
                        }
                        setLoadingCode(_ => false)
                      }
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
                {switch loadingCode {
                | true =>
                  <div
                    style={ReactDOM.Style.combine(
                      Utils.centerStyles,
                      ReactDOM.Style.make(~height="100%", ()),
                    )}>
                    <Blueprint.Spinner />
                  </div>
                | false =>
                  <Preview
                    code={code->Belt.Option.getWithDefault("")}
                    ext={ext->Belt.Option.getWithDefault("")} // TODO
                  />
                }}
              </div>
            </div>
          </div>
        }
      }
    }
  }
}
