@module("@blueprintjs/core")
external classes: {"TEXT_LARGE": string, "DIALOG_BODY": string} = "Classes"

module H1 = {
  @module("@blueprintjs/core") @react.component
  external make: (~style: ReactDOM.Style.t=?, ~children: React.element=?) => React.element = "H1"
}

module Divider = {
  @module("@blueprintjs/core") @react.component
  external make: (~style: ReactDOM.Style.t=?, ~children: React.element=?) => React.element =
    "Divider"
}

module Navbar = {
  @module("@blueprintjs/core") @react.component
  external make: (~style: ReactDOM.Style.t=?, ~children: React.element=?) => React.element =
    "Navbar"
}

module NavbarGroup = {
  @module("@blueprintjs/core") @react.component
  external make: (
    ~style: ReactDOM.Style.t=?,
    ~children: React.element=?,
    ~align: string=?,
  ) => React.element = "NavbarGroup"
}

module NavbarDivider = {
  @module("@blueprintjs/core") @react.component
  external make: (~style: ReactDOM.Style.t=?, ~children: React.element=?) => React.element =
    "NavbarDivider"
}

module Icon = {
  @module("@blueprintjs/core") @react.component
  external make: (~icon: string, ~style: ReactDOM.Style.t=?) => React.element = "Icon"
}

module Spinner = {
  @module("@blueprintjs/core") @react.component
  external make: unit => React.element = "Spinner"
}

module Dialog = {
  @module("@blueprintjs/core") @react.component
  external make: (
    ~isOpen: bool=?,
    ~title: string=?,
    ~icon: string=?,
    ~onClose: unit => unit=?,
    ~children: React.element=?,
  ) => React.element = "Dialog"
}

module Button = {
  @module("@blueprintjs/core") @react.component
  external make: (
    @as("type") ~type_: string=?,
    ~minimal: bool=?,
    ~icon: string=?,
    ~onClick: unit => unit=?,
    ~children: React.element=?,
  ) => React.element = "Button"
}

module InputGroup = {
  @module("@blueprintjs/core") @react.component
  external make: (
    ~inputRef: ReactDOM.domRef,
    ~large: bool,
    ~placeholder: string,
    ~leftIcon: string,
    ~rightElement: React.element,
    ~value: string,
    ~onChange: ReactEvent.Form.t => unit,
    ~style: ReactDOM.Style.t,
  ) => React.element = "InputGroup"
}

module Tree = {
  type rec t<'a> = {
    id: string,
    nodeData: 'a,
    icon: string,
    label: string,
    secondaryLabel?: string,
    childNodes?: array<t<'a>>,
    isExpanded?: bool,
    isSelected?: bool,
  }

  @module("@blueprintjs/core") @react.component
  external make: (
    ~contents: array<t<'a>>=?,
    ~onNodeClick: t<'a> => promise<unit>=?,
    ~onNodeExpand: t<'a> => promise<unit>=?,
    ~onNodeCollapse: t<'a> => promise<unit>=?,
  ) => React.element = "Tree"
}
