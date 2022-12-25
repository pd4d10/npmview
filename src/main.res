%%raw(`
import "/src/main.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "github-fork-ribbon-css/gh-fork-ribbon.css"
`)

let root = ReactDOM.Client.createRoot(ReactDOM.querySelector("#root")->Option.getExn)

root->ReactDOM.Client.Root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
