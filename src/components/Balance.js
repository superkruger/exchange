import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { Tabs, Tab } from 'react-bootstrap'

class Balance extends Component {
	componentDidMount() {
		this.loadBlockchainData(this.props)
	}

	async loadBlockchainData(props) {
	}

  render() {
    return (
      <div className="card bg-light text-dark">
        <div className="card-header">
          Balance
        </div>
        <div className="card-body">
          <Spinner type="div" />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(Balance)


