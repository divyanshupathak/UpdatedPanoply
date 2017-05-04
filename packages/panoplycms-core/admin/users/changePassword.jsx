import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../common/heading.jsx';
import AlertMessage from '../common/alertMessage.jsx';
import AlertMessageOfError from '../common/alertMessageOfError.jsx';
import LoadingSpinner from '../common/loadingSpinner.jsx';

class ChangePassword extends Component {
	constructor(props) {
    super(props);
 
    this.state = {
      msg:false,
			valid:'',
			errorMsg: false
    };
  }
  componentDidMount(){
		let validObj=$("#changePasswordForm").validate({
			rules: {
				oldPassword: {
					required: true,
					password:true
				},
				newPassword: {
					required: true,
					password:true
				},
				confirmPassword: {
					required: true,
					password:true
				},
			},
			//For custom messages
			messages: {
				oldPassword:{
					required: "Please enter old password.",
					password: "Please enter a valid password."
				},
				newPassword:{
					required: "Please enter new password.",
					password: "Please enter a valid password."
				},
				confirmPassword:{
					required: "Please enter password again.",
					password: "Please enter a valid password."
				},
			},
			submitHandler: function (form) { // for demo
				return false;
			},
			errorElement : 'div',
			errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if (placement) {
					$(placement).append(error)
				} else {
					error.insertAfter(element);
				}
			}
		});
		this.setState({valid:validObj})    
	}
	resetSuccessMsg(){
		this.setState({'msg':false})
		this.setState({'errorMsg':false})
	}
	updateuser(event){
		event.preventDefault();
		var oldPassword = $('#oldPassword').val();
		var newPassword = $('#newPassword').val();
		var confirmPassword = $('#confirmPassword').val();
		if(newPassword != confirmPassword){
			// alert('New password and Confirm password is not same.');
			this.setState({'errorMsg':'New password and Confirm password is not same.'})
		}else{
			Accounts.changePassword(oldPassword, newPassword,(err,data)=>{
				if(err){
					this.setState({'errorMsg': err.reason})
				}else{
					this.setState({ msg : true })
				}
			});
		}
	}
	render() {
		let msg = '';
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}

		if(this.state.msg){
			msg = <AlertMessage data={'changed your password.'} func={this.resetSuccessMsg.bind(this)} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
		}else{
			msg = '';
		}

		return(
			<div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
				<Heading data={i18n('ADMIN_USERS_CHANGE_PASSWORD')} />
				{ msg }

				<form className="form-horizontal" id="changePasswordForm" encType="multipart/form-data" onSubmit={this.updateuser.bind(this)}> 
					<div className="form-group">
						<label htmlFor="oldPassword" className="col-sm-2 control-label">{i18n('ADMIN_USERS_EDIT_OLD_PASSWORD')}</label>
						<div className="col-sm-10">
							<input type="password" id="oldPassword" className="form-control" required />
						</div>
					</div> 
					<div className="form-group">
						<label htmlFor="newPassword" className="col-sm-2 control-label">{i18n('ADMIN_USERS_EDIT_NEW_PASSWORD')}</label>
						<div className="col-sm-10">
							<input type="password" id="newPassword" className="form-control" required />
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="confirmPassword" className="col-sm-2 control-label">{i18n('ADMIN_USERS_EDIT_CONFIRMPASSWORD')}</label>
						<div className="col-sm-10">
							<input type="password" id="confirmPassword" className="form-control" required />
						</div>
					</div> 
					<div className="form-group">
						<div className="col-sm-6">
							<input type="submit" className="btn btn-primary" value='SAVE' />
							&nbsp;&nbsp;
							<a className="btn btn-danger" href={FlowRouter.path('dashboard')}>CANCEL</a>
						</div>
					</div> 
				</form>
			</div>
		)
	}
}

export default createContainer(() => {
	let handle = Meteor.subscribe('usersProfile')
	return {
		pageLoading: ! handle.ready()
	};
},ChangePassword)