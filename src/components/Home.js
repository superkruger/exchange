import React, { Component } from 'react'
import { connect } from 'react-redux'

class Home extends Component {

  render() {
    return (
      <div className="content">
        Welcome to the Kouga ERC20 exchange.
        Please note, a 1% fee is charged on all succesful trades.
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Home)
