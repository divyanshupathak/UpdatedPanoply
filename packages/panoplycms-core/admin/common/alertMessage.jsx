import React, { Component } from 'react';
import { render } from 'react-dom';

import PropTypes from 'prop-types';

export default class AlertMessage extends Component {
	render(){
		return (
			<div className="successMsg alert alert-success">
				<button type="button" onClick={this.props.func} className="close"  aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<strong>Successfully! </strong>
				{this.props.data}
			</div>
		)
	}
}

/*AlertMessage.propTypes = {
  data: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired
};*/