import React, { Component } from 'react'

class Notification extends Component {

  render() {
    let {title, type} = this.props
    if (type === undefined) {
      type = "info"
    }
    return (
      <div className={`alert alert-${type}`}>{title}</div>
    )
  }
}

export default Notification
