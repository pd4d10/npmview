type data = {
  p1Files?: array<Utils.packageFile>,
  p2Files?: array<Utils.packageFile>,
  diffFiles: array<Utils.diffFile>,
}

type state = {
  split: bool,
  prettier: bool,
  active?: string,
  data?: data,
}

let initialState = {
  split: false,
  prettier: false,
}

type action =
  | Active(string)
  | Load(data)
  | SetPrettier(bool)
  | SetSplit(bool)

let reducer = (state, action) => {
  switch action {
  | Active(fileName) => {...state, active: fileName}
  | Load(data) => {...state, data}
  | SetPrettier(v) => {...state, prettier: v}
  | SetSplit(v) => {...state, split: v}
  }
}

@react.component
let make = (~name, ~v1, ~v2) => {
  let (state, dispatch) = React.useReducer(reducer, initialState)

  React.useEffect0(() => {
    let init = async () => {
      let f = Utils.fetchFiles(name)
      let (p1Files, p2Files) = await Promise.all2((v1->f, v2->f))

      Load({p1Files, p2Files, diffFiles: Utils.getDiff(p1Files, p2Files)})->dispatch
    }

    init()->ignore
    None
  })

  <div className="flex flex-col h-screen">
    <div className="flex p-2">
      <strong> {"Diff"->React.string} </strong>
      <div className="grow" />
      <label className="pr-5">
        <input
          checked=state.split
          type_="checkbox"
          onChange={event => {
            let checked = (event->JsxEvent.Form.target)["checked"]
            SetSplit(checked)->dispatch
          }}
        />
        {"Split"->React.string}
      </label>
      <label className="pr-5">
        <input
          checked=state.prettier
          type_="checkbox"
          onChange={event => {
            let checked = (event->JsxEvent.Form.target)["checked"]
            SetPrettier(checked)->dispatch
          }}
        />
        {"Prettier"->React.string}
      </label>
    </div>
    {switch state.data {
    | Some({p1Files, p2Files, diffFiles}) =>
      <div className="grow flex overflow-auto">
        <div className="p-1 overflow-auto basis-60">
          {diffFiles
          ->Array.map(file =>
            <div key={file.name} className="pt-2">
              <div
                key={file.name}
                className="cursor-pointer p-1 text-sm"
                // TODO color: getStatusColor(file.status),
                //   background:
                //     active?.name === pkg.name &&
                //     active?.fileName === file.name
                //       ? "#eee"
                //       : "transparent",

                onClick={event => {
                  Active(file.name)->dispatch
                }}>
                // <span> {file.status->React.string} </span>
                {file.name->React.string}
              </div>
            </div>
          )
          ->React.array}
        </div>
        <div className="flex flex-1 overflow-auto">
          {switch state.active {
          | Some(active) =>
            <ReactDiffViewer
              oldValue={(p1Files->Array.find(file => file.name == active)->Option.getExn).code}
              newValue={(p2Files->Array.find(file => file.name == active)->Option.getExn).code}
              splitView={state.split}
              styles={Object.create({
                "diffContainer": {
                  "fontSize": 14,
                  "alignSelf": "flex-start",
                },
                "wordDiff": {"padding": 0},
              })}
            />
          | _ => <div />
          }}
        </div>
      </div>
    | _ => <div> {"loading..."->React.string} </div>
    }}
  </div>
}

// const getStatusColor = (status: DiffFile["status"]) => {
//   return status === "A" ? "green" : status === "D" ? "red" : "brown";
// };
