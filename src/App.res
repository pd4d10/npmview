@react.component
let make = () => {
  let url = RescriptReactRouter.useUrl()

  React.useEffect1(_ => {
    // https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
    switch %external(gtag) {
    | Some(gtag) =>
      gtag(
        "config",
        "UA-145009360-1",
        {
          "page_path": url.path,
        },
      )
    | _ => None
    }
  }, [url.path])

  let extract = nameWithVersion => {
    switch nameWithVersion->Js.String2.split("@") {
    | [name, version] => (name, version->Some)
    | [name] => (name, None)
    | _ => assert false
    }
  }

  switch url.path {
  | list{} => <Home />
  | list{path1} => {
      let (name, version) = extract(path1)
      <Package name version />
    }

  | list{path1, path2} => {
      let (name, version) = extract(path2)
      <Package name={path1 ++ "/" ++ name} version />
    }

  | _ => <div> {"404"->React.string} </div>
  }
}
