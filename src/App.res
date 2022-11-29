@val external gtag: option<'a> = "window.gtag"
@val external pathname: string = "window.location.pathname"

// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
let ga = %raw("
() => {
  gtag('set', 'page_path', window.location.pathname);
  gtag('event', 'page_view');
}
")

@react.component
let make = () => {
  let url = RescriptReactRouter.useUrl()

  React.useEffect1(_ => {
    ga(.)->ignore
    None
  }, [url])

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
