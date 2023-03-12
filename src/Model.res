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
    let obj = json->JSON.Decode.object->Option.getExn
    let type_ = obj->Dict.get("type")->Option.flatMap(JSON.Decode.string)->Option.getExn
    let path = obj->Dict.get("path")->Option.flatMap(JSON.Decode.string)->Option.getExn

    switch type_ {
    | "file" => {
        path,
        payload: File(json->file_decode->Result.getExn),
      }

    | "directory" => {
        let files =
          obj
          ->Dict.get("files")
          ->Option.flatMap(JSON.Decode.array)
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
