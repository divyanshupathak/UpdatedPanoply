import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

class ArticleDataList extends Component {
	openRestoreModal(){
		$('#'+this.props.data._id+' restoreArticle').modal('show');
	}
	render() {
		let c = 0;

		return (
			<tr>
				<td id="edit_article">
					<a href={FlowRouter.path('editArticle',{_id:this.props.data._id})}>
						<large>
							{this.props.data.title}
						</large>
					</a>
					<small>
						&nbsp;(<em>Alias:&nbsp;{this.props.data.alias}</em>) 
					</small>
				</td>
				<td>
					{this.props.results?this.props.results.title:''}
				</td>
				<td>
					<div id="delete_article" className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}}>
						{
							this.props.stateVal ?
								<i style={{color:'red', cursor:'pointer'}} title="Delete" className="fa fa-times" aria-hidden="true"></i>
							:
								<i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" title="Trash"></i> 
						}
					</div>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					{
						this.props.stateVal ?
							<i style={{cursor:'pointer'}} data-toggle="modal" data-target={'#'+this.props.data._id+'restoreArticle'} className="fa fa-undo" aria-hidden="true" title="Restore"></i>
						:
							<a href={FlowRouter.path('editArticle',{_id:this.props.data._id})}>
								<i style={{color:"#142849",cursor:'pointer'}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit"></i>
							</a>
					}
				</td>
			</tr>
		)
	}
}

export default createContainer((data)=>{
	Meteor.subscribe('findCategory', data.data.category);
	return {
		results: PanoplyCMSCollections.Categories.findOne({_id:data.data.category})
	}
}, ArticleDataList)