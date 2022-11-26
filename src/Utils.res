type response
module Response = {
  type t = response
  @send external json: t => promise<Js.Json.t> = "json"
  @send external text: t => promise<string> = "text"
}
@val external fetch: string => promise<response> = "fetch"

let centerStyles = ReactDOM.Style.make(
  ~display="flex",
  ~alignItems="center",
  ~justifyContent="center",
  (),
)

let unpkgUrl = "https://unpkg.com" // TODO: env

let fetchPackageJson = async packageName => {
  let res = await fetch(`${unpkgUrl}/${packageName}/package.json`)
  let json = await res->Response.json
  Model.PackageJson.decode(json)
}

let fetchMeta = async packageName => {
  let res = await fetch(`${unpkgUrl}/${packageName}/?meta`)
  let json = await res->Response.json
  Model.Meta.decode(json)
}

let fetchCode = async (packageName, path) => {
  let res = await fetch(`${unpkgUrl}/${packageName}${path}`)
  await res->Response.text
}

type state<'a> = {loading: bool, data: option<'a>, error: option<Js.Exn.t>}
type action<'a> = Init | Data('a) | Error(Js.Exn.t)

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
      | Js.Exn.Error(obj) => Error(obj)->dispatch
      }
    }
    let _ = init()
    None
  }, [fn])

  state
}
