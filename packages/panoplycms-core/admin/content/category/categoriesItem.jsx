import React, { Component } from 'react';
import { render } from 'react-dom';

// import { editCategory } from '../../actions/category_action.js';
// import { removeCategory } from '../../actions/category_action.js';

export default class CategoriesItem extends Component {
  deleteCategory(){
    // return dispatch => {
    //   dispatch(removeCategory(this.props.data._id))
    // }
    Meteor.call('delete_category',this.props.data._id,function(err,data){
      // console.log(err,data)
    });
  }
  editCategory(){
    // return dispatch => {
    //   dispatch(editCategory(this.props.data._id))
    // }
    Meteor.call('editCategory',this.props.data._id, (err,data)=>{
      // console.log(err,data)
    });
  }
  render(){
    return(
      <tr>
        <td>
          <a href={FlowRouter.path('editCategory',{_id:this.props.data._id})}>
            <large> 
              {this.props.data.title}
            </large>
          </a>
          <small> 
            &nbsp;(<em>Alias:&nbsp;{this.props.data.alias}</em>)
          </small> 
        </td>
        <td>
          <div className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}} >
            {
              this.props.stateVal ? <i style={{color:'red', cursor:'pointer'}} title="Delete" className="fa fa-times" aria-hidden="true"></i> : <i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" title="Trash"></i>
            }
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.props.stateVal? <i data-toggle="modal" data-target={'#'+this.props.data._id+'restoreCategory'} className="fa fa-undo" aria-hidden="true" onClick={this.restoreArticle} title="Restore" style={{cursor:'pointer'}}></i> : <a href={FlowRouter.path('editCategory',{_id:this.props.data._id})}> <i style={{color:"#142849", cursor:'pointer'}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit" ></i> </a> 
          }
        </td>
      </tr>
    )
  }
}