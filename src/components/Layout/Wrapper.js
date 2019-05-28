import React, { Component } from 'react'

class Wrapper extends Component {
  render() {
    var that = this
    var newChildren = React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {
        width: parseInt(that.props.style.width),
        height: parseInt(that.props.style.height)
      })
    })
    return <div {...this.props}>{newChildren}</div>
  }
}

export default Wrapper
