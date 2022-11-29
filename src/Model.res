module Meta = {
  type rec t = {
    path: string,
    payload: payload,
  }
  and payload = File(file) | Directory(directory)
  and file = {size: int}
  and directory = {files: array<t>}

  let rec decode = json => {
    let obj = json->Js.Json.decodeObject->Belt.Option.getExn
    let type_ =
      obj->Js.Dict.get("type")->Belt.Option.flatMap(Js.Json.decodeString)->Belt.Option.getExn
    let path =
      obj->Js.Dict.get("path")->Belt.Option.flatMap(Js.Json.decodeString)->Belt.Option.getExn

    switch type_ {
    | "file" => {
        let size =
          obj
          ->Js.Dict.get("size")
          ->Belt.Option.flatMap(Js.Json.decodeNumber)
          ->Belt.Option.getExn
          ->Belt.Int.fromFloat
        {path, payload: File({size: size})}
      }

    | "directory" => {
        let files =
          obj
          ->Js.Dict.get("files")
          ->Belt.Option.flatMap(Js.Json.decodeArray)
          ->Belt.Option.getExn
          ->Js.Array2.map(decode)
        {path, payload: Directory({files: files})}
      }

    | _ => failwith("Invalid type")
    }
  }
}

module PackageJson = {
  type t = {
    name: string,
    version: string,
    homepage: option<string>,
    // repository: option<string>,
    license: option<string>,
    description: option<string>,
  }

  let decode = json => {
    let obj = json->Js.Json.decodeObject->Belt.Option.getExn
    let name =
      obj->Js.Dict.get("name")->Belt.Option.flatMap(Js.Json.decodeString)->Belt.Option.getExn
    let version =
      obj->Js.Dict.get("version")->Belt.Option.flatMap(Js.Json.decodeString)->Belt.Option.getExn
    let homepage = obj->Js.Dict.get("homepage")->Belt.Option.flatMap(Js.Json.decodeString)
    // let repository = obj->Js.Dict.get("repository")->Belt.Option.flatMap(Js.Json.decodeString)
    let license = obj->Js.Dict.get("license")->Belt.Option.flatMap(Js.Json.decodeString)
    let description = obj->Js.Dict.get("description")->Belt.Option.flatMap(Js.Json.decodeString)

    {name, version, homepage, license, description}
  }
}
