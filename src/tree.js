import React from 'react'
import { Treebeard } from 'react-treebeard'
import theme from './theme'

const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [{ name: 'child1' }, { name: 'child2' }],
    },
    {
      name: 'loading parent',
      loading: true,
      children: [],
    },
    {
      name: 'parent',
      children: [
        {
          name: 'nested parent',
          children: [{ name: 'nested child 1' }, { name: 'nested child 2' }],
        },
      ],
    },
  ],
}

export default class TreeExample extends React.Component {
  state = {}

  onToggle = (node, toggled) => {
    if (this.state.cursor) {
      this.state.cursor.active = false
    }
    node.active = true
    if (node.children) {
      node.toggled = toggled
    }
    this.setState({ cursor: node })
  }
  render() {
    return <Treebeard data={data} onToggle={this.onToggle} style={theme} />
  }
}
