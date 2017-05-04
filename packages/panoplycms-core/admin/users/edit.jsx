import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../common/heading.jsx';
import AlertMessage from '../common/alertMessage.jsx';
import AlertMessageOfError from '../common/alertMessageOfError.jsx';
import LoadingSpinner from '../common/loadingSpinner.jsx';

import { editUser } from '../actions/userProfile_action.js';

class EditUser extends Component {
	constructor(props) {
    super(props);
 
    this.state = {
      msg:false,
			valid:'',
			errorMsg: false
    };
  }
  componentDidMount(){
		let validObj=$("#userEditForm").validate({
			rules: {
				email: {
					required: true,
					email:true
				},
				username: {
					required: true,
				},
			},
			//For custom messages
			messages: {
				email:{
					required: "Please enter  email.",
					email: "Please enter a valid email."
				},
				username: {
					required: "Please enter name.",
				}
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
		this.setState({ valid:validObj })    
	}
	resetSuccessMsg(){
		this.setState({'msg':false})
		this.setState({'errorMsg':false})
	}
	updateuser(event){
		event.preventDefault();
		let username = $('#username').val();
		let email = $('#email').val();
		let files = $('#profilePic')[0].files[0];
		let regex = /[^.]+$/;

		let userObj = {
			'emails.0.address': email,
			profile: { 
				username: username,
				imageId: Meteor.user().profile.imageId
			}
		}
		// if(this.state.valid.form()){
			if(files){
				if(regex.exec(files.name)[0] == "jpg" || regex.exec(files.name)[0] == "png" || regex.exec(files.name)[0] == "svg"){
					Images.insert(files, (err, fileObj)=> {
						if(fileObj){
							userObj.profile['imageId'] = fileObj. _id;
							// console.log(userObj, " User ==== ")

							Meteor.call('updateUser', userObj, (err,data)=>{
								if(err){
									this.setState({ 'errorMsg': err.reason })
								}else{
									this.setState({ msg : true })
								}
							})
							return dispatch => {
								dispatch(editUser(userObj))
							}
						}
					});
				}else{
					this.setState({'errorMsg': 'Unsupported Image format'});
				}
			}else{
				Meteor.call('updateUser', userObj, (err,data)=>{
					if(err){
						this.setState({ 'errorMsg': err.reason })
					}else{ 
						this.setState({ msg : true })
					}
				})
				return dispatch => {
					dispatch(editUser(userObj))
				}
			}
		// }
	}
	render() {
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}
		let msg = '';
		let img = Images.findOne({ _id:Meteor.user().profile.imageId })

		if(this.state.msg){
			msg = <AlertMessage data={'updated your profile.'} func={this.resetSuccessMsg.bind(this)} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
		}else{
			msg = '';
		}

		return(
			<div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
				<Heading data={i18n('ADMIN_USERS_EDIT')} />
				{ msg }

				<form className="form-horizontal" id="userEditForm" encType="multipart/form-data" onSubmit={this.updateuser.bind(this)}>
					<div className = "form-group">
						<label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_USERS_EDIT_USERNAME')}</label>
						<div className = "col-sm-10">
							<input type = "text" id="username" name="username" defaultValue={this.props.user.profile?this.props.user.profile.username:''} className = "form-control" />
						</div>
					</div> 
					<div className = "form-group">
						<label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_USERS_EDIT_EMAIL')}</label>
						<div className = "col-sm-10">
							<input type = "email" name="email" id="email" defaultValue={this.props.user.emails[0].address} className = "form-control" />
						</div>
					</div> 
					<div className = "form-group">
						<label htmlFor = "firstname" className = "col-sm-2 control-label">Profile Picture</label>
						<div className = "col-sm-10">
							<input id="profilePic" type="file" name="file" className="upload-file"/>
							<div className="col-md-3"><br />
							{	img ?
									<img src={ img.url() } className="img-rounded" style={{maxWidth: "100%"}} />
								: ''
							}
							</div>
						</div>
					</div> 
					<div className = "form-group">
						<label htmlFor = "firstname" className = "col-sm-2 control-label"></label>
						<div className = "col-sm-6">
							<input type = "submit" className = "btn btn-primary" value='UPDATE' />
							&nbsp;&nbsp;
							<a className = "btn btn-danger" href={FlowRouter.path('dashboard')}>CANCEL</a>
						</div>
					</div> 
				</form>
			</div>
		)
	}
}

export default createContainer(()=>{
	let handle = Meteor.subscribe('usersProfile')
	return {
		pageLoading: ! handle.ready(),
		user: Meteor.users.findOne()
	};
}, EditUser)