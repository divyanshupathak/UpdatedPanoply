import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../common/heading.jsx';
import LoadingSpinner from '../common/loadingSpinner.jsx';

class UserList extends Component {
	render() {
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}
		// console.log(this.props.user.profile.imageId)
		if(this.props.user && this.props.user.profile.imageId){
			var image = Images.findOne({_id: this.props.user.profile.imageId})
		}
		// console.log(image)
		return(
			<div className="col-md-10 content">
				<Heading data={'User List'} />
				<div className="panel-body">
					<div className="table-responsive" id="non-editable">
						<table className="table">
							<thead>
								<tr>
									<th>{i18n('ADMIN_USERS_PROFILE_PICTURE')}</th>
									<th>{i18n('ADMIN_USERS_EDIT_USERNAME')}</th>
									<th>{i18n('ADMIN_USERS_EDIT_EMAIL')}</th>
									<th>{i18n('ADMIN_USERS_PROFILE_EDIT')}</th>
									<th>Delete</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										{
											image ?
												<img src={image.url()} className="img-circle" alt="Profile Picture" width="50" height="50" />
											: 'No image'
										}
									</td>
									<td>{this.props.user?this.props.user.profile?this.props.user.profile.username:'':''}</td>
									<td>{this.props.user?this.props.user.emails[0].address:''}</td>
									<td><a className = "btn btn-primary fa fa-pencil-square-o" data-toggle="tooltip" title="Edit" href={FlowRouter.path('editUser',{_id:this.props.user._id})}></a></td>
									<td><button disabled='true' className = "btn btn-danger fa fa-trash-o" href={FlowRouter.path('dashboard')} data-toggle="tooltip" title="Delete" ></button></td>
								</tr> 
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default createContainer(() => {
	let handle = Meteor.subscribe('usersProfile')
	return {
		pageLoading: ! handle.ready(), 
		user: Meteor.users.findOne()
	};
}, UserList)
