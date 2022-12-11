module Meta = {
  type rec t = {
    path: string,
    payload: payload,
  }
  and payload = File(file) | Directory(directory)
  and file = {size: int}
  and directory = {files: array<t>}

  let rec decode = json => {
    let obj = json->Js.Json.decodeObject->Option.getExn
    let type_ = obj->Js.Dict.get("type")->Option.flatMap(Js.Json.decodeString)->Option.getExn
    let path = obj->Js.Dict.get("path")->Option.flatMap(Js.Json.decodeString)->Option.getExn

    switch type_ {
    | "file" => {
        let size =
          obj
          ->Js.Dict.get("size")
          ->Option.flatMap(Js.Json.decodeNumber)
          ->Option.getExn
          ->Int.fromFloat
        {path, payload: File({size: size})}
      }

    | "directory" => {
        let files =
          obj
          ->Js.Dict.get("files")
          ->Option.flatMap(Js.Json.decodeArray)
          ->Option.getExn
          ->Array.map(decode)
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
    let obj = json->Js.Json.decodeObject->Option.getExn
    let name = obj->Js.Dict.get("name")->Option.flatMap(Js.Json.decodeString)->Option.getExn
    let version = obj->Js.Dict.get("version")->Option.flatMap(Js.Json.decodeString)->Option.getExn
    let homepage = obj->Js.Dict.get("homepage")->Option.flatMap(Js.Json.decodeString)
    // let repository = obj->Js.Dict.get("repository")->Option.flatMap(Js.Json.decodeString)
    let license = obj->Js.Dict.get("license")->Option.flatMap(Js.Json.decodeString)
    let description = obj->Js.Dict.get("description")->Option.flatMap(Js.Json.decodeString)

    {name, version, homepage, license, description}
  }
}
