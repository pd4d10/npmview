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
  | Option({prettier: bool, split: bool})

let reducer = (state, action) => {
  switch action {
  | Active(fileName) => {...state, active: fileName}
  | Load(data) => {...state, data}
  | Option({prettier, split}) => {
      ...state,
      prettier,
      split,
    }
  }
}

@react.component
let make = (~name, ~v1, ~v2) => {
  let ({split, prettier, active, data}, dispatch) = React.useReducer(reducer, initialState)
  // let findCode = (collectFiles: option<package> => array<Utils.packageFile>) => {
  //   packages
  //   ->Array.find(pkg => pkg.name == active.name)
  //   ->collectFiles
  //   ->Array.find(file => file.name == active.fileName)
  //   ->Option.map(file => prettier ? Utils.formatCode(file.name, file.code) : file.code)
  // }

  React.useEffect0(() => {
    let init = async () => {
      let [p1Files, p2Files] = await Promise.all(
        [v1, v2]->Array.map(ref => Utils.fetchRef(name, ref)),
      )
      dispatch(Load({p1Files, p2Files, diffFiles: Utils.getDiff(p1Files, p2Files)}))
    }

    init()->ignore
    None
  })

  <div />

  //   if (!ref0 || !ref1) {
  //     return <div>Lack of `ref0` and `ref1` in search params</div>;
  //   }
  //   return (
  //     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  //       <div
  //         style={{
  //           padding: 8,
  //           borderBottom: "1px solid #eee",
  //           display: "flex",
  //         }}
  //       >
  //         <strong>PIPO Build Review</strong>
  //         <div style={{ flexGrow: 1 }}></div>
  //         <label style={{ paddingRight: 20 }}>
  //           <input
  //             checked={split}
  //             type="checkbox"
  //             onChange={(e) => {
  //               dispatch({ type: "option", split: e.target.checked });
  //             }}
  //           />
  //           Split
  //         </label>
  //         <label style={{ paddingRight: 20 }}>
  //           <input
  //             checked={prettier}
  //             type="checkbox"
  //             onChange={(e) => {
  //               dispatch({ type: "option", prettier: e.target.checked });
  //             }}
  //           />
  //           Prettier
  //         </label>
  //         <div>
  //           <RefLink gitRef={ref0} /> vs <RefLink gitRef={ref1} />
  //         </div>
  //       </div>
  //       <div style={{ flexGrow: 1, display: "flex", overflow: "auto" }}>
  //         <div style={{ padding: 4, overflow: "auto", flexBasis: 240 }}>
  //           {diffFiles.map((pkg) => (
  //             <div key={pkg.name} style={{ paddingTop: 8 }}>
  //               <div
  //                 style={{
  //                   fontWeight: 600,
  //                   padding: 4,
  //                 }}
  //               >
  //                 {pkg.name}
  //               </div>
  //               {pkg.files.map((file) => (
  //                 <div
  //                   className="file-item"
  //                   key={file.name}
  //                   style={{
  //                     cursor: "pointer",
  //                     padding: 4,
  //                     fontSize: 14,
  //                     color: getStatusColor(file.status),
  //                     background:
  //                       active?.name === pkg.name &&
  //                       active?.fileName === file.name
  //                         ? "#eee"
  //                         : "transparent",
  //                   }}
  //                   onClick={() => {
  //                     dispatch({
  //                       type: "active",
  //                       name: pkg.name,
  //                       fileName: file.name,
  //                     });
  //                   }}
  //                 >
  //                   <span>{file.status}</span> {file.name}
  //                 </div>
  //               ))}
  //             </div>
  //           ))}
  //         </div>
  //         <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
  //           {active ? (
  //             <ReactDiffViewer
  //               oldValue={findCode("oldFiles")}
  //               newValue={findCode("newFiles")}
  //               splitView={split}
  //               styles={{
  //                 diffContainer: {
  //                   fontSize: 14,
  //                   alignSelf: "flex-start",
  //                 },
  //                 wordDiff: { padding: 0 },
  //               }}
  //             />
  //           ) : (
  //             <div></div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
}

// const RefLink: FC<{ gitRef: string }> = ({ gitRef }) => (
//   <a
//     href=""
//     target="_blank"
//   >
//     <code>{gitRef.slice(0, 8)}</code>
//   </a>
// );

// const getStatusColor = (status: DiffFile["status"]) => {
//   return status === "A" ? "green" : status === "D" ? "red" : "brown";
// };
