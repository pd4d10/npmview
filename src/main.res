%%raw(`
import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "github-fork-ribbon-css/gh-fork-ribbon.css"
`)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  ReactDOM.querySelector("#root")->Belt.Option.getExn,
)
