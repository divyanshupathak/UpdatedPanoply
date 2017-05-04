import React, { Component } from 'react';
import { render } from 'react-dom';

var createReactClass = require('create-react-class');

import Positions from './positions.jsx';

EditSliderModule = createReactClass({
	getInitialState(){
		return {
			valid: '',
			successMsg: false,
			errorMsg: false,
			imageId: ''
		}
	},
	mixins: [ReactMeteorData],
	getMeteorData() {
		return {
			sliderModuleData: PanoplyCMSCollections.Modules.findOne({_id:this.props._id}),
			templateRegister: PanoplyCMSCollections.RegisteredPackages.findOne({name:'template'})
		};
	},
	resetSuccessMsg(){
		this.setState({'successMsg': false})
		this.setState({'errorMsg': false})
	},
	componentDidMount(){
		// $('#slider-content').summernote({ height: 200 });

		$('.slider-info').on('click', '.add-item', function(e) {
			// console.log("add item button clicked");
			e.preventDefault();
			let controlForm = $(this).parents('.slider-info'),
				currentEntry = controlForm.children(':first'),
				addSlider = $(this).parent().clone(),
				newEntry = $(currentEntry.clone()).appendTo(controlForm);
			$(this).parent().remove();
			$(addSlider).appendTo(controlForm);
			newEntry.find('input').val('');
		}).on('click', '.remove-item', function(e) {
			e.preventDefault();
			var childs = $(this).parents('.slider').parent().children('.slider').length;
			if (childs > 1){
				$(this).parents('.slider').remove();
			}
			else $(this).parents('.slider').find('input').val('');
			return false;
		});
	},
	componentWillUnmount: function() {
		// tinymce.remove();
		// $('#slider-content').summernote('destroy');
	},
	handleUpdate(e){
		e.preventDefault();
		let regex = /[^.]+$/;

		let sliderObj = {
			name: this.refs.name.value,
			type:'slidermodule',
			position: $('#position').val(),
			allPages: $('.pageall').is(':checked'),
			moduleData: []
		}

		let select = {
			_id: this.props._id
		}

		if(!e.currentTarget.content.length) {
			let imageFile = $('#bg-image')[0].files[0];
			if(imageFile){
				if(regex.exec(imageFile.name)[0] == "jpg" || regex.exec(imageFile.name)[0] == "png" || regex.exec(imageFile.name)[0] == "svg"){
					Images.insert(imageFile, (err, fileObj) => {
						if(fileObj){
							sliderObj.moduleData.push({
								title: this.refs.title.value,
								description: this.refs.description.value,
								linkTitle: this.refs.linkText.value,
								linkUrl: this.refs.linkUrl.value,
								published: $(".published").is(':checked'),
								bgImageId: fileObj. _id
							})
							select = {
								_id: this.props._id
							}
							Meteor.call('editModule', select, sliderObj, (error,data) => {
								if(error){
									this.setState({errorMsg: error.reason})
								}else{
									this.setState({successMsg: true});
								}
							})
						}
					})
				}else{
					this.setState({'errorMsg': 'Unsupported Image format'});
				}
			}else{
				this.data.sliderModuleData && this.data.sliderModuleData.moduleData ?
					this.data.sliderModuleData.moduleData.map((value, index) => {
						sliderObj.moduleData.push({
							title: this.refs.title.value,
							description: this.refs.description.value,
							linkTitle: this.refs.linkText.value,
							linkUrl: this.refs.linkUrl.value,
							published: $(".published").is(':checked'),
							bgImageId: value.bgImageId ? value.bgImageId : ''
						})
					})
				: ''
				select = {
					_id: this.props._id
				}
				Meteor.call('editModule', select, sliderObj, (error,data) => {
					if(error){
						this.setState({errorMsg: error.reason})
					}else{
						this.setState({successMsg: true});
					}
				})
			}
		}else{
			let title = [], content = [], linkText = [], linkUrl = [], published = [], imageObj = [];
			e.currentTarget.title.forEach(i => { title.push(i.value) });
			e.currentTarget.content.forEach(i => { content.push(i.value) });
			e.currentTarget.linkText.forEach(i => { linkText.push(i.value) });
			e.currentTarget.linkUrl.forEach(i => { linkUrl.push(i.value) });
			e.currentTarget.published.forEach(i => { published.push(i.checked) });
			e.currentTarget.bgimage.forEach(i => { imageObj.push(i.files[0]) });
			
			let imageId = _.pluck(this.data.sliderModuleData.moduleData, 'bgImageId');
			
			for (let i = 0; i < content.length; i++) {
				if(imageObj[i]){
					if(regex.exec(imageObj[i].name)[0] == "jpg" || regex.exec(imageObj[i].name)[0] == "png" || regex.exec(imageObj[i].name)[0] == "svg") {
						Images.insert(imageObj[i], (err, fileObj)=> {
							if(fileObj){
								sliderObj.moduleData.push({
									title: title[i],
									description: content[i],
									linkTitle: linkText[i],
									linkUrl: linkUrl[i],
									published: published[i],
									bgImageId: fileObj. _id
								});
								select = {
									_id:this.props._id
								}
								Meteor.call('editModule', select, sliderObj, (error,data) => {
									if(error){
										this.setState({errorMsg: error.reason})
									}else{
										this.setState({successMsg: true});
									}
								})
							}
						})
					}else{
						this.setState({'errorMsg': 'Unsupported Image format'});
					}
				}else{
					sliderObj.moduleData.push({
						title: title[i],
						description: content[i],
						linkTitle: linkText[i],
						linkUrl: linkUrl[i],
						published: published[i],
						bgImageId: imageId[i]
					});
					if(sliderObj.moduleData.length == content.length) {
						select = {
							_id:this.props._id
						}
						Meteor.call('editModule', select, sliderObj, (error,data) => {
							if(error){
								this.setState({errorMsg: error.reason})
							}else{
								this.setState({successMsg: true});
							}
						})
					}
				}
			}
		}
	},
	render() {
		if(this.state.successMsg){
			msg = <AlertMessageSuccess data={'Updated slider module.'} func={this.resetSuccessMsg} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageError data={this.state.errorMsg} func={this.resetSuccessMsg} />
		}else{
			msg = '';
		}
		return (
			<div className="col-md-10 content" onClick={this.resetSuccessMsg}>
				<div className="page-header">
					<h3 className="sub-header">Update Slider Module</h3>
				</div>
				{ msg }
				<div className="panel-body">
					<div id="notification"></div>
					<form id="sliderModule" role = "form" onSubmit={this.handleUpdate}>
						<div className = "form-group">
							<label>Module Title</label>
							<input type = "text" name="name" ref="name" id="name" className = "form-control" defaultValue={this.data.sliderModuleData ? this.data.sliderModuleData.name : ''} required />
						</div>
						<Positions key={this.data.templateRegister._id} data={this.data.templateRegister} value={this.data.sliderModuleData?this.data.sliderModuleData.position:''}/>
						<div className="form-group">
							<label>All Page</label>&nbsp;&nbsp;
							<input type="checkbox" className="pageall" ref="pageall" name="pageall" defaultChecked={this.data.sliderModuleData.allPages} />
						</div>
						<div className="form-group">
							<label>Add Slides</label>
							<div className="panel panel-default">
								<div className="panel-heading">Slides</div>
								<ul className="list-group slider-info">
									{
										this.data.sliderModuleData && this.data.sliderModuleData.moduleData ?
											this.data.sliderModuleData.moduleData.map((value, index) => {
												// console.log("=========", value)
												let img = Images.findOne({ _id: value.bgImageId })
												return(
													<li key={index} className="list-group-item slider">
														<div>
															<div className="remove-item-wrap">
																<button type="button" className="btn btn-primary remove-item">
																	<span className="glyphicon glyphicon-minus"></span>
																</button>
															</div><br/>
															<div className="array-item-body">
																<div className="panel panel-default">
																	<div className="panel-body">
																		<div className="form-group" data-required="true">
																			<label>Title</label>
																			<input type = "text" name="title" ref="title" id="title" className = "form-control title" defaultValue={value.title} required />
																		</div>
																		<div className="form-group" data-required="true">
																			<label>Description</label>
																			<textarea id="slider-content" name="content" ref="description" className="form-control content" defaultValue={value.description}></textarea>
																		</div>
																		<div className="form-group" data-required="true">
																			<label>Link Title</label>
																			<input name="linkText" className="form-control linkText" type="text" required ref="linkText" defaultValue={value.linkTitle} />
																		</div>
																		<div className="form-group" data-required="true">
																			<label>Link Url</label>
																			<input type="text" name="linkUrl" ref="linkUrl" id="link-url" className="form-control linkUrl" defaultValue={value.linkUrl} required />
																		</div>
																		<div className="form-group" data-required="true">
																			<label>Image</label>
																			<input name="bgimage" type="file" id="bg-image" className="bgimage" /><br/>
																			{
																				img ?
																					<img src={ img.url() } className="img-rounded" height="100px" width="100px" style={{maxWidth: "100%"}} />
																				: ''
																			}
																		</div>
																		<div className="form-group" data-required="true">
																			<label>Published&nbsp;&nbsp;</label>
																			<label className="switch">
																				<input name="published" type="checkbox" className="input-checkbox published" defaultChecked={value.published} />
																				<div className="slide round"></div>
																			</label>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</li>
												);
											})
										: ''
									}
									<li className="list-group-item">
										<button type="button" className="btn btn-primary add-item"><span className="glyphicon glyphicon-plus"></span></button>
										</li>
								</ul>
							</div>
						</div>
						<div className="form-group">
							<button className="btn btn-primary">SAVE</button>
							&nbsp;&nbsp;
							<a className="btn btn-danger" href={FlowRouter.path('modulesManager')}>CANCEL</a>
						</div>
					</form>
				</div>
			</div>
		);
	}
})

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


export default EditSliderModule;