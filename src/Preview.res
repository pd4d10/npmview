%%raw(`
import "@wooorm/starry-night/style/light.css"
`)

module StarryNight = {
  type tree
  type grammar
  type t = {highlight: (. string, string) => tree}

  @module("@wooorm/starry-night")
  external createStarryNight: array<grammar> => promise<t> = "createStarryNight"

  @module("@wooorm/starry-night")
  external common: array<grammar> = "common"

  @module("hast-util-to-html")
  external toHtml: tree => string = "toHtml"
}

let highlighter = ref(None)
let initHighlighter = async _ => {
  let h = await StarryNight.createStarryNight(StarryNight.common)
  highlighter := h->Some
}

@react.component
let make = (~code, ~lang) => {
  React.useEffect0(_ => {
    if highlighter.contents == None {
      initHighlighter()->ignore
    }
    None
  })

  let scope = switch lang {
  | "js" | "ts" | "tsx" | "json" => Some("source." ++ lang)
  | _ => None
  }

  <pre style={ReactDOMStyle.make(~margin="10px", ())}>
    {switch (highlighter.contents, scope) {
    | (Some(h), Some(scope)) => {
        let html = StarryNight.toHtml(h.highlight(. code, scope))
        <code dangerouslySetInnerHTML={{"__html": html}} />
      }

    | _ => <code> {code->React.string} </code>
    }}
  </pre>
}
