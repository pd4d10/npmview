type props = {oldValue: string, newValue: string, splitView: bool, styles: {.}}
@module("react-diff-viewer") external make: React.component<props> = "default"
