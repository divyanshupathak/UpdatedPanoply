import React, { Component } from 'react';
import { render } from 'react-dom';

var createReactClass = require('create-react-class');

ListTags = createReactClass({
  mixins:[ReactMeteorData],
  getMeteorData(){
    Meteor.subscribe('tags')
    return{
      tagsData: PanoplyCMSCollections.Tags.find({}).fetch()
    }
  },
  render() {
    nodata = '';
    if(this.data.tagsData.length == 0 ){
      nodata = <NotFound />
    }else{
      nodata = '';
    }
    return (
      <div>
        <div className="col-md-10 content">
          <div className="page-header">
            <h3 className="sub-header">Tags</h3>
          </div>
          <div className="panel-heading">
            <a href={FlowRouter.path('addTag')} className="btn btn-success btn-ico"><i className="fa fa-plus-circle fa-lg"></i>&nbsp;Add Tag</a>
          </div>
          <div className="panel-body">
            <div className="table-responsive" id="non-editable">
              {
                nodata == '' ?
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_TAGNAME')}</th>
                        <th>{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_DESCRIPTION')}</th>
                        <th>{i18n('ADMIN_COTNENTS_ARTICLES_ADDARTICLE_FORM_ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.data.tagsData.map((tag)=>{
                          return <TagsItem key={tag._id} data={tag} />
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
            this.data.tagsData.map((tag)=>{
              return <TagsModal key={tag._id} data={tag} />
            })
          }
        </div>
      </div>
    );
  }
});

var TagsItem = React.createClass({
  editTag(){
    Meteor.call('editTag', this.props.data._id,(err,data)=>{
      // console.log(err,data)
    });
  },
  render(){
    return(
      <tr>
        <td>
          <large>{this.props.data.title}</large>
          <small>(<em>Alias:&nbsp;{this.props.data.alias}</em>)</small>
        </td>
        <td>{this.props.data.desc.length > 50?this.props.data.desc.substring(0,40)+'...':this.props.data.desc}</td>
        <td>
          <div onClick={this.deleteTag} className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}}>
            <i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" data-toggle="tooltip" title="Delete"></i> 
          </div>
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href={FlowRouter.path('editTag',{_id:this.props.data._id})}>
            <i style={{color:"#142849"}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit"></i>
          </a>
        </td>
      </tr>    
    )
  }
})
 
TagsModal=React.createClass({
  deleteTag(){
    Meteor.call('deleteTag',this.props.data._id,(err,data)=>{
      // console.log(err,data)
    });
    return dispatch => {
      dispatch(removeTag(this.props.data._id))
    }
  },
  render:function(){
    return(
      <div id={this.props.data._id} className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Do you really want to remove ?</h4>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.deleteTag} data-dismiss="modal">YES</button>
              <button type="button" className="btn btn-danger" data-dismiss="modal">NO</button>
            </div>
          </div>
        </div>
      </div>
    )     
  }
})

export default ListTags;

class NotFound extends Component {
  render(){
    return(
      <div className="alert alert-danger">
        <strong>Sorry!</strong> Data not found.
      </div>
    )
  }
}