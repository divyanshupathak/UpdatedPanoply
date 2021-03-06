import React, { Component } from 'react';
import { render } from 'react-dom';

import MenuItemT from './menuItemTypes.jsx'
import Positions from './positions.jsx'

var createReactClass = require('create-react-class');

EditHtmlblock = createReactClass({
	getInitialState(){
		return {
			valid:'',
			successMsg:false,
			errorMsg:false,
		}
	},
	mixins: [ReactMeteorData],
	getMeteorData() {
		return {
			menuResults: PanoplyCMSCollections.Menus.find({trash:false}).fetch(),
			templateRegister: PanoplyCMSCollections.RegisteredPackages.findOne({name:'template'}),
			htmlblockModuleData: PanoplyCMSCollections.Modules.findOne({_id:this.props._id})
		};
	},
	submitData(event){
		event.preventDefault()
		let menuItems = [];
		$.each($("input[name='menucheck']:checked"), function(){            
			menuItems.push($(this).val());
		});

		if(this.state.valid.form()){
			let name=ReactDOM.findDOMNode(this.refs.name).value.trim();
			let position=$('#position').val()
			let article=$('#article').summernote('code');
			let showTitle=$('input[name="options"]:checked').val()
			let allPage=$('#all-page').is(':checked')
			showTitle = showTitle=='yes'?true:typeof showTitle=='undefined'?true:false

			obj = {
				name: name,
				type:'htmlblock',
				position:position,
				showTitle:showTitle,
				menuItems:menuItems,
				moduleClass: $("#moduleClass").val(),
				allPages:allPage,
				moduleData:{
					html:article
				}
			}
			select = {
				_id:this.props._id
			}

			Meteor.call('editModule', select, obj,(error,data)=>{
				if(error){
					this.setState({errorMsg:error.reason})
				}else{
					this.setState({successMsg:true});
				}
			})
			return dispatch => {
				dispatch(updateModule(select, obj))
			}
		}
	},
	componentDidMount(){
		let validObj=$("#menuModule").validate({
			rules: {
				name: {
					required: true
				},
				position: {
					required: true
				},
				selectMenu: { 
					required: true
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
		this.setState({valid:validObj})  
		$('.options').toggleClass('active');
		$('.option').button();
		$('#article').summernote({height: 200});
	},
	componentDidUpdate: function() {
		$('#article').summernote({height: 200});
	},
	componentWillUnmount: function() {
		// tinymce.remove();
		$('#article').summernote('destroy');
	},
	resetSuccessMsg(){
		this.setState({'successMsg':false})
		this.setState({'errorMsg':false})
	},
	render(){
		c = 0;
		if(this.state.successMsg){
			msg = <AlertMessageSuccess data={'updated htmlblock.'} func={this.resetSuccessMsg} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageError data={this.state.errorMsg} func={this.resetSuccessMsg} />
		}else{
			msg = '';
		}
		return (
			<div className="col-md-10 content" onClick={this.resetSuccessMsg}>
				<div className="page-header">
					<h3 className="sub-header">Edit Htmlblock</h3>
				</div>
				{ msg }
				<div className="panel-body">
					<div id="notification"></div>
					<form id="menuModule" className = "form-horizontal" role = "form" onSubmit={this.submitData}>
						<div className = "form-group">
							<label htmlFor = "firstname" className = "col-sm-2 control-label">Name</label>
							<div className = "col-sm-10">
								<input type = "text" name="name" ref="name"  className = "form-control"  placeholder = "Enter title" defaultValue={this.data.htmlblockModuleData?this.data.htmlblockModuleData.name:''} required/>
							</div>
						</div>
						<div className = "form-group">
							<label htmlFor = "firstname" className = "col-sm-2 control-label">Module Suffix Class</label>
							<div className = "col-sm-10">
								<input type = "text" name="name" ref="moduleClass" id="moduleClass" className = "form-control" defaultValue={this.data.htmlblockModuleData?this.data.htmlblockModuleData.moduleClass:''} required />
							</div>
						</div>
						<Positions key={this.data.templateRegister._id} data={this.data.templateRegister} value={this.data.htmlblockModuleData?this.data.htmlblockModuleData.position:''}/>
						<div className = "form-group">
							<label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_ARTICLE')}</label>
							<div className = "col-sm-10">
								<div className="summernote">
									<textarea type="text" id="article" className="form-control" defaultValue={this.data.htmlblockModuleData?this.data.htmlblockModuleData.moduleData.html:''}></textarea>
								</div>
							</div>
						</div>
						<div className="form-group">
							<label className="col-sm-2 control-label">Show Title</label>
							<div className="col-sm-10">
								<div className="btn-group" data-toggle="buttons">
									<label className={this.data.htmlblockModuleData.showTitle?'active option btn btn-primary':'option btn btn-primary'} ref="option" >
										<input type="radio" className="rad" name="options" ref="options" id="option2"  value="yes"/>{i18n('ADMIN_SETTINGS_SITE_OFFLINE_YES')}
									</label>
									<label className={this.data.htmlblockModuleData.showTitle?'option btn btn-primary':'active option btn btn-primary'} ref="option">
									<input type="radio" className="rad" ref="options" name="options" id="option3" value="no" /> {i18n('ADMIN_SETTINGS_SITE_OFFLINE_NO')}
									</label>
								</div>
							</div>
						</div>
						<div className = "form-group">
							<label htmlFor = "lastname" className = "col-sm-2 control-label">All Page</label>
							<div className = "col-sm-10">
								<input type="checkbox" defaultChecked={this.data.htmlblockModuleData.allPages} className="allPage" id="all-page" ref="desc" name="allPage" />
							</div>
						</div>

						<MenuItemT value={this.data.htmlblockModuleData?this.data.htmlblockModuleData.menuItems:[]} />

						<div className="form-group">
							<div className = "col-sm-offset-2 col-sm-10">
								<button className="btn btn-primary">UPDATE</button>
								&nbsp;&nbsp;
								<a className="btn btn-danger" href={FlowRouter.path('modulesManager')}>CANCEL</a>
							</div>
						</div> 
					</form>
				</div>
			</div>
		)
	}
});

class AlertMessageSuccess extends Component {
  render(){
    return (
      <div className="successMsg alert alert-success">
        <button type="button" onClick={this.props.func} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>Successfully! </strong>
        {this.props.data}
      </div>
    )
  }
}

class AlertMessageError extends Component {
  render(){
    return (
      <div className="successMsg alert alert-danger">
        <button type="button" onClick={this.props.func} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>Error! </strong>
        {this.props.data}
      </div>
    )
  }
}


/*MenuList = React.createClass({
	propTypes:{
		menu: React.PropTypes.object.isRequired,
	},
	render(){
		return (
			<option value={this.props.menu._id}>{this.props.menu.title}</option>
		);
	}
});*/

export default EditHtmlblock;