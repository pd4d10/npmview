module Meta = {
  @spice
  type rec t = {
    path: string,
    payload: payload,
  }
  @spice and payload = File(file) | Directory(directory)
  @spice and file = {size: int}
  @spice and directory = {files: array<t>}

  let rec decode = json => {
    let obj = json->Js.Json.decodeObject->Option.getExn
    let type_ = obj->Js.Dict.get("type")->Option.flatMap(Js.Json.decodeString)->Option.getExn
    let path = obj->Js.Dict.get("path")->Option.flatMap(Js.Json.decodeString)->Option.getExn

    switch type_ {
    | "file" => {
        path,
        payload: File(json->file_decode->Result.getExn),
      }

    | "directory" => {
        let files =
          obj
          ->Js.Dict.get("files")
          ->Option.flatMap(Js.Json.decodeArray)
          ->Option.getExn
          ->Array.map(decode)
        {
          path,
          payload: Directory({files: files}),
        }
      }

    | _ => failwith("Invalid type")
    }
  }
}

module PackageJson = {
  @spice
  type t = {
    name: string,
    version: string,
    homepage: option<string>,
    // repository: option<string>,
    license: option<string>,
    description: option<string>,
  }

  let decode = json => json->t_decode->Result.getExn
}
