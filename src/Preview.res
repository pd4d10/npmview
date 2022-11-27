%%raw(`
import "@wooorm/starry-night/style/light.css"
`)

@react.component
let make = (~code, ~lang) => {
  module StarryNight = {
    type tree
    type t2
    type t3 = {highlight: (. string, string) => tree}

    @module("@wooorm/starry-night")
    external createStarryNight: t2 => promise<t3> = "createStarryNight"

    @module("@wooorm/starry-night")
    external common: t2 = "common"

    @module("hast-util-to-html")
    external toHtml: tree => string = "toHtml"
  }

  let (highlighter, setHighlighter) = React.useState(() => None)

  React.useEffect0(_ => {
    let init = async _ => {
      let h = await StarryNight.createStarryNight(StarryNight.common) // TODO: save
      setHighlighter(_ => Some(h))
    }
    init()->ignore
    None
  })

  let scope = switch lang {
  | "js" | "ts" | "tsx" | "json" => Some("source." ++ lang)
  | _ => None
  }

  <pre>
    <code>
      {switch (highlighter, scope) {
      | (Some(h), Some(scope)) => {
          let html = StarryNight.toHtml(h.highlight(. code, scope))
          <div dangerouslySetInnerHTML={{"__html": html}} />
        }

      | _ => code->React.string
      }}
    </code>
  </pre>
}
