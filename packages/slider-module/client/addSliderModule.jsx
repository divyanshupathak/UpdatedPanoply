import React, { Component } from 'react';
import { render } from 'react-dom';

var createReactClass = require('create-react-class');

import Positions from './positions.jsx';

AddSliderModule = createReactClass({
	mixins: [ReactMeteorData],
	getMeteorData() {
		return {
			templateRegister: PanoplyCMSCollections.RegisteredPackages.findOne({name:'template'})
		};
	},
	getInitialState(){
		return {
			valid: '',
			successMsg: false,
			errorMsg: false
		}
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
			newEntry.find('input, textarea').val('');
		}).on('click', '.remove-item', function(e) {
			e.preventDefault();
			let childs = $(this).parents('.slider').parent().children('.slider').length;
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
	handleSubmit(e){
		e.preventDefault();
		let regex = /[^.]+$/;

		let sliderObj = {
			name: this.refs.name.value,
			type:'slidermodule',
			position: $('#position').val(),
			allPages: $('.pageAll').is(':checked'),
			moduleData: []
		}
		if(!e.currentTarget.content.length) {
			let imageFile = $('#bg-image')[0].files[0];
			if(regex.exec(imageFile.name)[0] == "jpg" || regex.exec(imageFile.name)[0] == "png" || regex.exec(imageFile.name)[0] == "svg"){
				Images.insert(imageFile, (err, fileObj)=> {
					if(fileObj){
						sliderObj.moduleData.push({
							title: this.refs.title.value,
							description: this.refs.description.value,
							linkTitle: this.refs.linkText.value,
							linkUrl: this.refs.linkUrl.value,
							published: $(".published").is(':checked'),
							bgImageId: fileObj. _id
						})
						Meteor.call('addModule', sliderObj, (error,data) => {
							if(error){
								this.setState({errorMsg: error.reason})
							}else{
								this.setState({successMsg: true});
								this.refs.name.value = '';
								this.refs.title.value = '';
								this.refs.linkText.value = '';
								this.refs.linkUrl.value = '';
								$("#slider-content").val('');
								$('#bg-image').val('');
								FlowRouter.go('modulesManager')
							}
						})
					}
				})
			}else{
				this.setState({'errorMsg': 'Unsupported Image format'});
			}
		}else{
			let title = [], content = [], linkText = [], linkUrl = [], published = [], imageObj = [];
			e.currentTarget.title.forEach(i => { title.push(i.value) });
			e.currentTarget.content.forEach(i => { content.push(i.value) });
			e.currentTarget.linkText.forEach(i => { linkText.push(i.value) });
			e.currentTarget.linkUrl.forEach(i => { linkUrl.push(i.value) });
			e.currentTarget.published.forEach(i => { published.push(i.checked) });
			e.currentTarget.bgimage.forEach(i => { imageObj.push(i.files[0]) });
			
			for (let i = 0; i < content.length; i++) {
				if(regex.exec(imageObj[i].name)[0] == "jpg" || regex.exec(imageObj[i].name)[0] == "png" || regex.exec(imageObj[i].name)[0] == "svg"){
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
							if(sliderObj.moduleData.length == content.length) {
								Meteor.call('addModule', sliderObj, (error,data) => {
									if(error){
										this.setState({errorMsg: error.reason})
									}else{
										this.setState({successMsg: true});
										this.refs.name.value = '';
										this.refs.title.value = '';
										this.refs.linkText.value = '';
										this.refs.linkUrl.value = '';
										$("#slider-content").val('');
										$('#bg-image').val('');
										FlowRouter.go('modulesManager')
									}
								})
							}
						}
					})
				}else{
					this.setState({'errorMsg': 'Unsupported Image format'});
				}
			}
		}
	},
	render() {
		if(this.state.successMsg){
			msg = <AlertMessageSuccess data={'added slider module.'} func={this.resetSuccessMsg} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageError data={this.state.errorMsg} func={this.resetSuccessMsg} />
		}else{
			msg = '';
		}
		return (
			<div className="col-md-10 content" onClick={this.resetSuccessMsg}>
				<div className="page-header">
					<h3 className="sub-header">Add Slider Module</h3>
				</div>
				{ msg }
				<div className="panel-body">
					<div id="notification"></div>
					<form id="sliderModule" role = "form" onSubmit={this.handleSubmit}>
						<div className = "form-group">
							<label>Module Title</label>
							<input type = "text" name="name" ref="name" id="name" className = "form-control" placeholder = "Enter module name" required />
						</div>
						<Positions key={this.data.templateRegister._id} data={this.data.templateRegister} value={this.data.templateRegister} />
						<div className="form-group">
							<label>All Page</label>&nbsp;&nbsp;
							<input type="checkbox" className="pageAll" ref="pageAll" name="pageAll" />
						</div>
						<div className="form-group">
							<label>Add Slides</label>
							<div className="panel panel-default">
								<div className="panel-heading">Slides</div>
								<ul className="list-group slider-info">
									<li className="list-group-item slider">
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
															<input type="text" name="title" ref="title" id="title" className="form-control title" placeholder = "Enter title" required />
														</div>
														<div className="form-group" data-required="true">
															<label>Description</label>
															<div className="summernote">
																<textarea id="slider-content" placeholder = "Enter Description" ref="description" name="content" className="form-control content"></textarea>
															</div>
														</div>
														<div className="form-group" data-required="true">
															<label>Link Title</label>
															<input name="linkText" className="form-control linkText" ref="linkText" type="text" placeholder = "Enter Link Title" required />
														</div>
														<div className="form-group" data-required="true">
															<label>Link Url</label>
															<input type="text" name="linkUrl" ref="linkUrl" id="link-url" className="form-control linkUrl" placeholder = "Enter Link Url" required />
														</div>
														<div className="form-group" data-required="true">
															<label>Image</label>
															<input name="bgimage" type="file" id="bg-image" className="bgimage" required />
														</div>
														<div className="form-group" data-required="true">
															<label>Published&nbsp;&nbsp;</label>
															<label className="switch">
																<input name="published" type="checkbox" className="input-checkbox published" defaultChecked="true" />
																<div className="slide round"></div>
															</label>
														</div>
													</div>
												</div>
											</div>
										</div>
									</li>
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

SliderBlock = data => {
	let dataArr = _.values(data)
	return(
		<section className="main-slider" data-start-height="600" data-slide-overlay="yes">
			<div className="tp-banner-container">
				<div className="tp-banner">
					{
						dataArr.map((value, index) => {
							let img = Images.findOne({ _id: value.bgImageId })
							return(
								<ul key={index}>
									{
										value.published ?
											<li data-transition="fade" data-slotamount="1" data-masterspeed="1000" data-thumb={img ? img.url() :''} data-saveperformance="off" data-title="">
												<img src={img ? img.url() :''} alt="" data-bgposition="center top" data-bgfit="cover" data-bgrepeat="no-repeat" />
												<div className="tp-caption sfr sfb tp-resizeme"
												data-x="center" data-hoffset="0"
												data-y="center" data-voffset="-10"
												data-speed="1500"
												data-start="0"
												data-easing="easeOutExpo"
												data-splitin="none"
												data-splitout="none"
												data-elementdelay="0.01"
												data-endelementdelay="0.3"
												data-endspeed="1200"
												data-endeasing="Power4.easeIn">
													<h2 className="big-title text-center">{value && value.title ? value.title :''}</h2>
												</div>

												<div className="tp-caption sfr sfb tp-resizeme"
												data-x="center" data-hoffset="0"
												data-y="center" data-voffset="-120"
												data-speed="1500"
												data-start="500"
												data-easing="easeOutExpo"
												data-splitin="none"
												data-splitout="none"
												data-elementdelay="0.01"
												data-endelementdelay="0.3"
												data-endspeed="1200"
												data-endeasing="Power4.easeIn">
													<div className="normal-text text-center">{value && value.description ? value.description :''}</div>
													{/*<!--Slider Separeter Line-->*/}
													<div className="slider-separeter-line">
														<div className="line-one"></div>
														<div className="line-two"></div>
													</div>
												</div>

												<div className="tp-caption sfl sfb tp-resizeme"
												data-x="center" data-hoffset="0"
												data-y="center" data-voffset="70"
												data-speed="1500"
												data-start="1000"
												data-easing="easeOutExpo"
												data-splitin="none"
												data-splitout="none"
												data-elementdelay="0.01"
												data-endelementdelay="0.3"
												data-endspeed="1200"
												data-endeasing="Power4.easeIn">
													<a href={value && value.linkUrl ? value.linkUrl :''} className="white-btn">{value && value.linkUrl ? value.linkTitle :''}</a>
												</div>
											</li>
										: ''
									}
								</ul>
							);
						})
					}
				</div>
			</div>
		</section>
	);
}

export default AddSliderModule;