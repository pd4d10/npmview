// import githubStyle from "react-syntax-highlighter/dist/esm/styles/hljs/github";
// import langJs from "highlight.js/lib/languages/javascript";
// import langCss from "highlight.js/lib/languages/css";
// import langScss from "highlight.js/lib/languages/scss";
// import langTs from "highlight.js/lib/languages/typescript";
// import langJson from "highlight.js/lib/languages/json";
// import langMd from "highlight.js/lib/languages/markdown";
// import langTxt from "highlight.js/lib/languages/plaintext";

// SyntaxHighlighter.registerLanguage("js", langJs);
// SyntaxHighlighter.registerLanguage("css", langCss);
// SyntaxHighlighter.registerLanguage("scss", langScss);
// SyntaxHighlighter.registerLanguage("ts", langTs);
// SyntaxHighlighter.registerLanguage("json", langJson);
// SyntaxHighlighter.registerLanguage("md", langMd);
// SyntaxHighlighter.registerLanguage("txt", langTxt);

@react.component
let make = (~code=?, ~ext="") => {
  module Highlighter = {
    @module("react-syntax-highlighter") @react.component
    external make: (
      ~language: string,
      ~showLineNumbers: bool,
      ~children: React.element,
    ) => React.element = "Light"
  }

  switch code {
  | None =>
    <div style={ReactDOMStyle.combine(Utils.centerStyles, ReactDOMStyle.make(~height="100%", ()))}>
      <Blueprint.Icon icon="arrow-left" style={ReactDOMStyle.make(~paddingRight="10px", ())} />
      {"Select a file to view"->React.string}
    </div>

  | Some(code) => {
      let language = switch ext {
      | "jsx" => "js"
      | "mjs" => "js"
      | "tsx" => "ts"
      | "" => "txt"
      | _ => ext
      }

      <Highlighter
        language
        showLineNumbers=true
        //  style={githubStyle}
        // lineProps={{
        //   style: {
        //     float: "left",
        //     paddingRight: 10,
        //     userSelect: "none",
        //     color: "rgba(27,31,35,.3)",
        //   },
        // }}
        // customStyle={{
        //   marginTop: 5,
        //   marginBottom: 5,
        //   maxHeight: `calc(100vh - ${HEADER_HEIGHT + 10}px)`,
        // }}
      >
        {code->React.string}
      </Highlighter>
    }
  }
}
