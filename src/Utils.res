let unpkgUrl = "https://unpkg.com" // TODO: env

let fetchPackageJson = async packageName => {
  open Webapi.Fetch
  let res = await fetch(`${unpkgUrl}/${packageName}/package.json`)
  let json = await res->Response.json
  json->S.parseWith(Model.PackageJson.struct)->Result.getExn
}

let fetchMeta = async packageName => {
  open Webapi.Fetch
  let res = await fetch(`${unpkgUrl}/${packageName}/?meta`)
  let json = await res->Response.json
  json->S.parseWith(Model.Meta.struct)->Result.getExn
}

let fetchCode = async (packageName, path) => {
  open Webapi.Fetch
  let res = await fetch(`${unpkgUrl}/${packageName}${path}`)
  await res->Response.text
}

type state<'a> = {loading: bool, data: option<'a>, error: option<Exn.t>}
type action<'a> = Init | Data('a) | Error(Exn.t)

let useQuery = (~fn) => {
  let reducer = (state, action) => {
    switch action {
    | Init => {...state, loading: true}
    | Data(data) => {...state, loading: false, data: data->Some}
    | Error(error) => {...state, loading: false, error: error->Some}
    }
  }
  let (state, dispatch) = React.useReducer(reducer, {loading: false, data: None, error: None})

  React.useEffect1(() => {
    let init = async () => {
      Init->dispatch
      try {
        let data = await fn()
        Data(data)->dispatch
      } catch {
      | Exn.Error(obj) => Error(obj)->dispatch // TODO: toast
      }
    }
    let _ = init()
    None
  }, [fn])

  state
}

type status = M | A | D
type packageFile = {
  name: string,
  code: string,
}
type diffFile = {
  name: string,
  status: status,
}

@module("js-untar") external untar: 'a => promise<array<'b>> = "default"
@module("pako") external ungzip: Webapi.Fetch.arrayBuffer => 'a = "ungzip"

let fetchFiles = async (name: string, version: string) => {
  let nameWithoutScope =
    name->String.split("/")->Array.sliceToEnd(~start=-1)->Array.get(0)->Option.getExn

  let url = `https://registry.npmjs.org/${name}/-/${nameWithoutScope}-${version}.tgz`
  let res = await Webapi.Fetch.fetch(url)
  let buf = await res->Webapi.Fetch.Response.arrayBuffer
  let files = await untar(ungzip(buf)["buffer"])
  files->Array.map(file => {
    name: file["name"],
    code: %raw("new TextDecoder().decode(file.buffer)"),
  })
}

let getDiff = (files0: array<packageFile>, files1: array<packageFile>) => {
  let res = []
  files0->Array.forEach(file => {
    let file1 = files1->Array.find(f => f.name === file.name)
    switch file1 {
    | None => res->Array.push({name: file.name, status: D})
    | Some(file1) =>
      if file.code !== file1.code {
        res->Array.push({name: file.name, status: M})
      }
    }
  })

  files1->Array.forEach(file => {
    let file0 = files0->Array.find(f => f.name === file.name)
    switch file0 {
    | None => res->Array.push({name: file.name, status: A})
    | Some(_) => ()
    }
  })

  res
}

let formatCode = (name, code) => {
  // TODO
  code
}
