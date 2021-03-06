import React, { Component } from 'react';
import { render } from 'react-dom';

var createReactClass = require('create-react-class');

EditTag = createReactClass({
  mixins:[ReactMeteorData],  
  getMeteorData: function() {
    var handle = Meteor.subscribe('findTag', this.props._id)
    return {
      pageLoading: ! handle.ready(), 
      tagsData: PanoplyCMSCollections.Tags.findOne({_id:this.props._id})
    };
  },
  submitData(event){
    event.preventDefault();
    let tagObj = {
      title: ReactDOM.findDOMNode(this.refs.title).value.trim(),
      desc: ReactDOM.findDOMNode(this.refs.desc).value.trim(),
      metaKeyword: ReactDOM.findDOMNode(this.refs.metaKeyword).value.trim(),
      metaDesc: ReactDOM.findDOMNode(this.refs.metaDesc).value.trim()
    }
    Meteor.call('editTag', this.props._id, tagObj, (err,data)=>{
      if(err){
        this.setState({errorMsg : err})
      }else{
        this.setState({msg : true});            
      }
    });
    return dispatch => {
      dispatch(updateTag(this.props._id, tagObj))
    }
  },
  getInitialState(){
    return {
      language:i18n.getLanguage(),
      msg:false,
      valid:'',
      errorMsg:false
    }
  },
  resetSuccessMsg(){
    this.setState({'msg':false})
    this.setState({'errorMsg':false})
  },
  render:function(){
    if (this.data.pageLoading) {
      return <div>Loading...</div>;
    }
    let msg = '';
    if(this.state.msg){
      msg = <AlertMessageSucess data={'updated tag.'} func={this.resetSuccessMsg}/>
    }else if(this.state.errorMsg){
      msg = <AlertMessageError data={this.state.errorMsg} func={this.resetSuccessMsg}/>
    }else{
      msg = '';
    }

    return(
      <div className="col-md-10 content" onClick={this.resetSuccessMsg}>
        <div className="page-header">
          <h3 className="sub-header">{i18n('ADMIN_COMPONENTS_TAGS_EDITTAG')}</h3>
        </div>
        { msg }
        <div className="panel-body">
          <form className = "form-horizontal" role = "form" onSubmit={this.submitData}>
            <div className="form-group">
              <label className="col-sm-2 control-label">{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_TAGNAME')}</label>
              <div className="col-sm-10">
                <input type = "text" ref="title" id="title" defaultValue={this.data.tagsData.title} className="form-control"   maxLength='25' placeholder = "Enter title" required />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_DESCRIPTION')}</label>
              <div className="col-sm-10">
                <textarea ref="desc" id="desc" defaultValue={this.data.tagsData.desc} className="form-control"></textarea>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_METAKEYWORD')}</label>
              <div className="col-sm-10">
                <input type = "text" ref="metaKeyword" id="metaKeyword" defaultValue={this.data.tagsData.metaKeyword} className="form-control" placeholder = "Enter title"  />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">{i18n('ADMIN_COMPONENTS_TAGS_ADDTAGS_FORM_METADESCRIPTION')}</label>
              <div className="col-sm-10">
                <textarea ref="metaDesc" id="metaDesc" defaultValue={this.data.tagsData.metaDescription} className="form-control"  ></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <input type = "submit" className="btn btn-primary" value='UPDATE' />
                &nbsp;&nbsp;
                <a href={FlowRouter.path('tags')} className="btn btn-danger">CANCEL</a>
              </div>
            </div>
          </form>
        </div>
        <div className="panel-body">
          <div id="notification"></div>
        </div>
      </div>
    )
  }
})

export default EditTag;

class AlertMessageSucess extends Component {
  render(){
    return (
      <div className="successMsg alert alert-success">
        <button type="button" onClick={this.props.func} className="close"  aria-label="Close">
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