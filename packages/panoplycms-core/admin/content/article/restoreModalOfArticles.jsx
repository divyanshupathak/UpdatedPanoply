import React, { Component } from 'react';
import { render } from 'react-dom';

import { restoreArticle } from '../../actions/article_action.js';

export default class RestoreModalOfArticles extends Component {
	restoreArticle(){
		Meteor.call('restoreArticles', this.props.data._id, (err,data) => {
			if(err){
				// console.log(err)
			}else{
				// console.log(data)
			}
		});
		return dispatch => {
			dispatch(restoreArticle(this.props.data._id))
		}
	}
	render(){
		return(
			<div id={this.props.data._id+'restoreArticle'} className="modal fade" role="dialog">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-body">
							<button type="button" className="close" data-dismiss="modal">&times;</button>
							<h4 className="modal-title">Do you really want to restore ?</h4>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick={this.restoreArticle.bind(this)} data-dismiss="modal">YES</button>
							<button type="button" className="btn btn-danger" data-dismiss="modal">NO</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}