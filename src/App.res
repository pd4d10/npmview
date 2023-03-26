// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
let ga = %raw("
() => {
  gtag('set', 'page_path', window.location.pathname);
  gtag('event', 'page_view');
}
")

let getQuery = key =>
  Webapi.Url.make(Webapi.Dom.location->Webapi.Dom.Location.href)
  ->Webapi.Url.searchParams
  ->Webapi.Url.URLSearchParams.get(key)

@react.component
let make = () => {
  let url = RescriptReactRouter.useUrl()

  React.useEffect1(_ => {
    ga(.)->ignore
    None
  }, [url])

  let extract = nameWithVersion => {
    switch nameWithVersion->String.split("@") {
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

  | list{"diff", name} =>
    <Diff name v1={"v1"->getQuery->Option.getExn} v2={"v2"->getQuery->Option.getExn} />

  | list{path1, path2} => {
      let (name, version) = extract(path2)
      <Package name={path1 ++ "/" ++ name} version />
    }

  | _ => <div> {"404"->React.string} </div>
  }
}
