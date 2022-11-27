%%raw(`
import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "github-fork-ribbon-css/gh-fork-ribbon.css"
`)

let root = ReactDOM.Client.createRoot(ReactDOM.querySelector("#root")->Belt.Option.getExn)

root->ReactDOM.Client.Root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
