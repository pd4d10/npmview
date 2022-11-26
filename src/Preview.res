@react.component
let make = (~code, ~lang) => {
  module Shiki = {
    type t1 = {theme: string, langs?: array<string>}
    type t2 = {lang: string}
    type t3 = {codeToHtml: (string, t2) => string}

    @module("shiki")
    external getHighlighter: t1 => promise<t3> = "getHighlighter"
    @module("shiki")
    external setCDN: string => unit = "setCDN"
  }

  let (highlighter, setHighlighter) = React.useState(() => None)

  React.useEffect0(_ => {
    let init = async _ => {
      Shiki.setCDN("https://unpkg.com/shiki/")
      let h = await Shiki.getHighlighter({theme: "github-light"})
      setHighlighter(_ => Some(h))
    }
    let _ = init()
    None
  })

  switch highlighter {
  | None => React.null
  | Some(h) => {
      let html = h.codeToHtml(code, {lang: lang})
      <div dangerouslySetInnerHTML={{"__html": html}} />
    }
  }
}
