import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import AlertMessage from '../../common/alertMessage.jsx';
import AlertMessageOfError from '../../common/alertMessageOfError.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';

import { insertArticle } from '../../actions/article_action.js';

class AddArticle extends Component {
	constructor(props) {
		super(props);

		this.state = {
			language: i18n.getLanguage(),
			msg: false,
			valid: '',
			errorMsg: false
		};
	}
	componentDidMount(){
		$('#article').summernote({ height: 200 });

		$('#tokenfield').tokenfield('destroy');
		document.title = "Add Article";

		setTimeout(() => {
			let validObj = $("#add-article").validate({
				rules: {
					title: {
						required: true
					},
					editor: {
						required: true
					},
					SelectName: { 
						required: true
					}
				},
				submitHandler: function (form) { // for demo
					return false;
				},
				errorElement : 'div',
				errorPlacement: function(error, element) {
					let placement = $(element).data('error');
					if (placement) {
						$(placement).append(error)
					} else {
						error.insertAfter(element);
					}
				}
			});
			this.setState({ valid:validObj })
		}, 3000)
	}
	componentWillUnmount() {
		// tinymce.remove();
		$('#article').summernote('destroy');
	}
	componentDidUpdate() {
		let sourceData = [];

		_.each(this.props.tags,function(a){
			sourceData.push(a.title);
		});
		
		$('#article').summernote({ height: 200 });

		$('#tokenfield').tokenfield({
			autocomplete: {
				source: sourceData,
				delay: 100
			},
			showAutocompleteOnFocus: true,
			createTokensOnBlur: true
		})
	}
	submitData(event){
		event.preventDefault();
		if(this.state.valid.form()){
			let objOfTags=$('#tokenfield').tokenfield('getTokens');
			let title = $('#title').val();
			let alias = generateAlias(title);
			let articleObj = {
				title: title,
				alias: alias,
				category: $("#selectCategory").val(),
				// article: tinyMCE.get(ReactDOM.findDOMNode(this.refs.editor1).id).getContent().trim()
				article: $('#article').summernote('code'),
				metaKeyword: $("#metaKeyword").val(),
				metaDescription: $("#metaDescription").val(),
				tags: _.pluck(objOfTags, 'value')
			}

			Meteor.call('addArticles', articleObj, (err, data) => {
				if(err){
					this.setState({ errorMsg : 'Internal server error or duplicate article can not insert.'})
				}else{
					this.setState({ msg : true });
					$('#title').val('');
					$("#selectCategory").val('');
					$('#tokenfield').tokenfield('setTokens', ' ');
					// tinyMCE.get(ReactDOM.findDOMNode(this.refs.editor1).id).setContent('')
					$("#article").summernote("code", "");
					$("#metaKeyword").val('');
					$("#metaDescription").val('');
				}
			});
			return dispatch => {
				dispatch(insertArticle(articleObj))
			}
		}
	}
	resetSuccessMsg(){
		this.setState({ 'msg': false })
		this.setState({ 'errorMsg': false })
	}
	render(){
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}
		let msg='';
		if(this.state.msg){
			msg = <AlertMessage data={'added article.'} func={this.resetSuccessMsg.bind(this)} />
		}else if(this.state.errorMsg){
			msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
		}else{
			msg = '';
		}
		return (
			<div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
				<Heading data={i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLES')} />
				{ msg }
				<div className="panel-body">
					<div id="notification"></div>
					<form id="add-article" className="form-horizontal" role="form" onSubmit={this.submitData.bind(this)}>
						<div className="form-group">
							<label htmlFor="title" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_TITLE')}</label>
							<div className="col-sm-10">
								<input type="text" id="title" name="title" className="form-control" placeholder="Enter title" required />
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="selectCategory" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_CATEGORY')}</label>
							<div className="col-sm-10">
								<select defaultValue='select' id="selectCategory" name="SelectName" className="selectpicker form-control" data-style="btn-primary" required>
									<option value="">--select--</option>
									{
										this.props.results.map((result)=>{
											return <option key={result._id} value={result._id}>{result.title}</option>
										})
									}
								</select>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="tokenfield" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_TAGS')}</label>
							<div className="col-sm-10" id="token"> 
								<input type="text" className="form-control" id="tokenfield" required />
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="article" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_ARTICLE')}</label>
							<div className="col-sm-10">
								<div className="summernote">
									<textarea id="article" className="form-control" required></textarea>
								</div>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="keyword" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_METAKEYWORD')}</label>
							<div className="col-sm-10">
								<input type="text" name="keyword" className="form-control" id="metaKeyword" />
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="metaDescription" className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_METADESCRIPTION')}</label>
							<div className="col-sm-10">
								<input type="text" name="desc" className="form-control" id="metaDescription" />
							</div>
						</div>
						<div className="form-group">
							<div className = "col-sm-offset-2 col-sm-10">
								<button className="btn btn-primary">SAVE</button>
								&nbsp;&nbsp;
								<a className="btn btn-danger" href={FlowRouter.path('articles')}>CANCEL</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

export default createContainer(()=>{
	let handle = Meteor.subscribe('Categories');
	return {
		pageLoading: ! handle.ready(),
		results: PanoplyCMSCollections.Categories.find({trash:false}).fetch(),
		tags: PanoplyCMSCollections.Tags.find({}).fetch()
	}
}, AddArticle)