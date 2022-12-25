@react.component
let make = () => {
  let forkText = "Fork me on GitHub"

  <div className="flex items-center justify-center flex-col h-screen">
    <Blueprint.H1 style={ReactDOM.Style.make(~paddingBottom="20px", ())}>
      {"npmview"->React.string}
    </Blueprint.H1>
    <Entry />
    {React.cloneElement(
      <a className="github-fork-ribbon" href="https://github.com/pd4d10/npmview" title=forkText>
        {forkText->React.string}
      </a>,
      {"data-ribbon": forkText},
    )}
  </div>
}
