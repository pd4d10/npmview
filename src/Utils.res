let unpkgUrl = "https://unpkg.com" // TODO: env

let fetchPackageJson = async packageName => {
  open Webapi.Fetch
  let res = await fetch(`${unpkgUrl}/${packageName}/package.json`)
  let json = await res->Response.json
  json->Model.PackageJson.decode
}

let fetchMeta = async packageName => {
  open Webapi.Fetch
  let res = await fetch(`${unpkgUrl}/${packageName}/?meta`)
  let json = await res->Response.json
  json->Model.Meta.decode
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

@module("js-untar") external untar: ArrayBuffer.t => array<packageFile> = "default"
@module("pako") external ungzip: Uint8Array.t => Uint8Array.t = "ungzip"

let fetchRef = async (name: string, ref: string) => {
  let nameWithoutScope = name->String.split("/")->Array.sliceToEnd(~start=-1)->Array.get(0)
  // switch nameWithoutScope {
  // | None => failwith("invalid name")
  // | Some(nameWithoutScope) => {
  //     let url = `https://registry.npm.org/${name}/-/${nameWithoutScope}-0.0.0-${ref}.tgz`
  //     let res = await Webapi.Fetch.fetch(url)
  //     let buf = await res->Webapi.Fetch.Response.arrayBuffer
  //     let out = ungzip(Uint8Array.make(buf))
  //   }
  // }
  [{name: "", code: ""}]
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
