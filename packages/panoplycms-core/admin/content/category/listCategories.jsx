import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import NotFoundComp from '../../common/notFoundComp.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';
import CategoriesItem from './categoriesItem.jsx';
import ModalOfCat from './modalOfCat.jsx';
import ModalOfRestoreCat from './modalOfRestoreCat.jsx';

class ListCategories extends Component {
	constructor(props) {
		super(props);

		this.state = {
			trashListShow:false
		};
	}
	showCategories(){
		if($('#display').val() == 'trash'){
			this.setState({trashListShow:true})
		}else{
			this.setState({trashListShow:false})
		}
	}
	render() {
		nodata = '';
		if (this.props.pageLoading) {
			return <LoadingSpinner />;
		}
		if((this.props.Categories).length == 0  && this.state.trashListShow == false){
			nodata = <NotFoundComp />
		}else if((this.props.resultOfTrash).length == 0 && this.state.trashListShow == true){
			nodata = <NotFoundComp />
		}else{
			nodata = '';
		}
		return (
			<div className="col-md-10 content">
				<Heading data={i18n('ADMIN_COTNENTS_CATEGORY_CATEGORY')} />
				<div className="panel-heading">
					<a href={FlowRouter.path('addCategory')} className="btn btn-success btn-ico">
						<i className="fa fa-plus-circle fa-lg"></i>&nbsp;
						{i18n('ADMIN_COTNENTS_CATEGORY_ADDCATEGORY')}
					</a>
					<div className="pull-right">
						Display:&nbsp;
						<select id="display" onChange={this.showCategories.bind(this)}>
							<option value="active">Active</option>
							<option value="trash">Trash</option>
						</select>
					</div>
				</div>
				<div className="panel-body"> 
					<div className="table-responsive">
						{
							nodata == '' ?
								<table className="table  table-bordered">
									<thead>
										<tr>
											<th>{i18n('ADMIN_COTNENTS_CATEGORY_ADDCATEGORY_FORM_CATEGORYNAME')}</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.trashListShow ?
												this.props.resultOfTrash.map((cat)=>{
													return <CategoriesItem key={cat._id} data={cat} stateVal={this.state.trashListShow} />
												})
											:
												this.props.Categories.map((cat)=>{
													return <CategoriesItem key={cat._id} data={cat} stateVal={this.state.trashListShow} />
												})
										}
									</tbody>
								</table>
							:''
						}
						{ nodata }
					</div>
				</div>
				{
					this.props.Categories.map((cat)=>{
						return <ModalOfCat key={cat._id} resultOfArticles={this.props.resultOfArticles} data={cat} stateVal={this.state.trashListShow} /> 
					})
				}

				{
					this.props.resultOfTrash.map((cat)=>{
						return <ModalOfRestoreCat key={cat._id} data={cat} />
					})
				}

				{
					this.props.resultOfTrash.map((cat)=>{
						return <ModalOfCat key={cat._id} data={cat} resultOfArticles={this.props.resultOfArticles} stateVal={this.state.trashListShow} /> 
					})
				}
				<ArticlesExistPopup />
			</div>
		);
	}
}

export default createContainer(()=>{
	const categoriesSubscription = Meteor.subscribe('Categories')
	return{
		pageLoading:! categoriesSubscription.ready(),
		Categories: PanoplyCMSCollections.Categories.find({trash:false}).fetch(),
		resultOfTrash: PanoplyCMSCollections.Categories.find({trash:true}).fetch(),
		resultOfArticles: PanoplyCMSCollections.Articles.find({trash:false},{category:1}).fetch()
	}
}, ListCategories)


ArticlesExistPopup = (m) => {
	return(
		<div id="articlExist" className="modal fade" role="dialog">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-body">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">You can not remove this category because articles exist of that category. Please remove the article first after you can delete category.</h4>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-danger" data-dismiss="modal">CANCEL</button>
					</div>
				</div>
			</div>
		</div>
	)
}