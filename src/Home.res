@react.component
let make = () => {
  let forkText = "Fork me on GitHub"

  <div
    style={ReactDOM.Style.combine(
      Utils.centerStyles,
      ReactDOM.Style.make(~flexDirection="column", ~height="100vh", ()),
    )}>
    <BlueprintjsCore.H1 style={ReactDOM.Style.make(~paddingBottom="20px", ())}>
      {"npmview"->React.string}
    </BlueprintjsCore.H1>
    <Entry />
    <div style={ReactDOM.Style.make(~height="30vh", ())} />
    {React.cloneElement(
      <a className="github-fork-ribbon" href="https://github.com/pd4d10/npmview" title=forkText>
        {forkText->React.string}
      </a>,
      {"data-ribbon": forkText},
    )}
  </div>
}
