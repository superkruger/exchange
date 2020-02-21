import React, { Component } from 'react'
import { connect } from 'react-redux'

class Content extends Component {

  componentWillMount() {
  }

  async loadBlockchainData(dispatch) {
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          Bla
        </div>
        Foo
        <div className="vertical-split">
          Bar
        </div>
        <div className="vertical">
          Boo 
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Content)
