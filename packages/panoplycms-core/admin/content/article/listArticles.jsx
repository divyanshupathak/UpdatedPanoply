import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import NotFoundComp from '../../common/notFoundComp.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';
import ArticleDataList from './articleDataList.jsx';
import ModalOfArticles from './modalOfArticles.jsx';
import RestoreModalOfArticles from './restoreModalOfArticles.jsx';

class ListArticles extends Component {
	constructor(props) {
    super(props);
 
    this.state = {
      trashListShow: false
    };
  }
	showArticles(){
		if($('#display').val()=='trash'){
			this.setState({ trashListShow:true })
		}else{
			this.setState({ trashListShow:false })
		}
	}
	render() {
		nodata = '';
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}
		if(this.props.results.length == 0  && this.state.trashListShow == false){
			nodata = <NotFoundComp />
		}else if(this.props.resultOfTrash.length == 0 && this.state.trashListShow == true){
			nodata = <NotFoundComp />
		}else{
			nodata = '';
		}
		return (
			<div className="col-md-10 content">
				<Heading data={i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_ARTICLE')} />
				<div className="panel-heading">
					<a className="btn btn-success btn-ico" href={FlowRouter.path('addArticle')}>
						<i className="fa fa-plus-circle fa-lg"></i> {i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLES')}
					</a>
					<div className="pull-right">
						Display:&nbsp;
						<select id="display" onChange={this.showArticles.bind(this)}>
							<option value="active">Active</option>
							<option value="trash">Trash</option>
						</select>
					</div>
				</div>
				<div className="panel-body">
					<div className="table-responsive" id="non-editable">
						{
							nodata == '' ?
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_TITLE')}</th>
											<th>{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_CATEGORY')}</th>
											<th>{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_ACTIONS')}</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.trashListShow ?
												this.props.resultOfTrash.map((result) => {
													return <ArticleDataList key={result._id} data={result} stateVal={this.state.trashListShow} />;
												})
											:this.props.results.map((result) => {
												return <ArticleDataList key={result._id} data={result} stateVal={this.state.trashListShow} />;
											})
										}
									</tbody>
								</table>
							: ''
						}
					</div>
					{ nodata }
				</div>
				{
					this.props.results.map((result) => {
						return <ModalOfArticles key={result._id} data={result} stateVal={this.state.trashListShow} />         
					})
				}

				{
					this.props.resultOfTrash.map((result) => {
						return <RestoreModalOfArticles key={result._id} data={result} />
					})
				}

				{
					this.props.resultOfTrash.map((result) => {
						return <ModalOfArticles key={result._id} data={result} stateVal={this.state.trashListShow} />         
					})
				}
			</div>
		);
	}
}

export default createContainer(() => {
	let articleSubscription = Meteor.subscribe('articlesFind');
	return {
		pageLoading:! articleSubscription.ready(),
		results: PanoplyCMSCollections.Articles.find({trash:false}).fetch(),
		resultOfTrash: PanoplyCMSCollections.Articles.find({trash:true}).fetch()
	}
}, ListArticles)
