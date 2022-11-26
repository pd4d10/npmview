type response
module Response = {
  type t = response
  @send external json: t => Js.Promise2.t<Js.Json.t> = "json"
  @send external text: t => Js.Promise2.t<string> = "text"
}
@val external fetch: string => Js.Promise2.t<response> = "fetch"

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
