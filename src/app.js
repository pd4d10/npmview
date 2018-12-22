import React from 'react'
import pako from 'pako'
import untar from 'js-untar'
import TreeExample from './tree'

class App extends React.Component {
  componentDidMount() {
    // this.unzip()
  }

  unzip = async () => {
    const res = await fetch(
      'https://cors-anywhere.herokuapp.com/https://registry.npmjs.org/tiza/download/tiza-2.1.0.tgz',
    )
    const data = await res.arrayBuffer()
    const buffer = await pako.ungzip(data)
    // console.log(buffer)
    untar(buffer.buffer).then(console.log, console.log, console.log)
    // console.log(t)
  }

  render() {
    return (
      <div>
        <TreeExample />
      </div>
    )
  }
}

export default App
