module Meta = {
  @tag("type")
  type rec t =
    | @as("file") File({path: string, size: int})
    | @as("directory") Directory({path: string, files: array<t>})

  let struct = S.recursive(struct =>
    S.union([
      S.object(o => {
        o->S.field("type", "file"->S.String->S.literal)->ignore
        File({
          path: o->S.field("path", S.string()),
          size: o->S.field("size", S.int()),
        })
      }),
      S.object(o => {
        o->S.field("type", "directory"->S.String->S.literal)->ignore
        Directory({
          path: o->S.field("path", S.string()),
          files: o->S.field("files", S.array(struct)),
        })
      }),
    ])
  )
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

  let struct = S.object(o => {
    name: o->S.field("name", S.string()),
    version: o->S.field("version", S.string()),
    homepage: o->S.field("homepage", S.string()->S.option),
    license: o->S.field("license", S.string()->S.option),
    description: o->S.field("description", S.string()->S.option),
  })
}
