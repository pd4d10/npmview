@send external focus: Dom.element => unit = "focus"

@react.component
let make = (~afterChange=() => ()) => {
  let examples = ["react", "react@15", "react@15.0.0"]

  let (name, setName) = React.useState(_ => "")
  let inputRef = React.useRef(Js.Nullable.null)

  React.useEffect(() => {
    inputRef.current
    ->Js.Nullable.toOption
    ->Option.forEach(dom => {
      dom->focus
    })
    None
  })

  <>
    <form
      onSubmit={e => {
        e->ReactEvent.Form.preventDefault
        afterChange()
        RescriptReactRouter.push("/" ++ name)
      }}>
      <BlueprintjsCore.InputGroup
        inputRef={ReactDOM.Ref.domRef(inputRef)}
        large=true
        placeholder="package or package@version"
        leftIcon="search"
        rightElement={<BlueprintjsCore.Button icon="arrow-right" minimal=true type_="submit" />}
        value={name}
        onChange={e => {
          (e->ReactEvent.Form.target)["value"]->setName
        }}
        style={ReactDOM.Style.make(~minWidth="400px", ())}
      />
    </form>
    <div
      className={BlueprintjsCore.classes["TEXT_LARGE"]}
      style={ReactDOM.Style.make(~paddingTop="10px", ())}>
      <span> {"e.g."->React.string} </span>
      {React.array(
        examples->Array.map(name => {
          let href = "/" ++ name

          <a
            key={name}
            href
            style={ReactDOMStyle.make(~paddingLeft="20px", ())}
            onClick={e => {
              e->ReactEvent.Mouse.preventDefault
              afterChange()
              RescriptReactRouter.push(href)
            }}>
            {name->React.string}
          </a>
        }),
      )}
    </div>
  </>
}
