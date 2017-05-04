import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import AlertMessage from '../../common/alertMessage.jsx';
import AlertMessageOfError from '../../common/alertMessageOfError.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';

import { editCategory } from '../../actions/category_action.js';

class EditCategory extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      errorMsg: false,
      successMsg: false
    };
  }
  submitData(event){
    event.preventDefault();
    let title = $('#title').val();
    let alias = generateAlias(title);
    let categoryObj = {
      title: title,
      alias: alias
    }
    Meteor.call('update_category', this.props._id, categoryObj,(err,data)=>{
      if(err)
        this.setState({ errorMsg: err.reason })
      else{
        this.setState({ successMsg:true })
        // $('#title').val('')
      }
    });
    return dispatch => {
      dispatch(editCategory(this.props._id, categoryObj))
    }
  }
  resetSuccessMsg(){
    this.setState({successMsg:false});
    this.setState({errorMsg:false})
  }
  render() {
    let msg = '';
    if (this.props.pageLoading) {
      return <LoadingSpinner />;
    }
    if(this.state.successMsg){
      msg = <AlertMessage data={'updated category.'} func={this.resetSuccessMsg.bind(this)} />
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
    }else{
      msg = ''
    }

    return (
      <div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
        <Heading data= {i18n('ADMIN_COTNENTS_CATEGORY_EDITCATEGORY')} />
        { msg }
        <form className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
          <div className="form-group">
            <label className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_CATEGORY_ADDCATEGORY_FORM_CATEGORYNAME')}</label>
            <div className="col-sm-10">
              <input type = "text" id="title" className="form-control" defaultValue={this.props.categoryData.title} placeholder = "Enter title" required />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <input type = "submit" className="btn btn-primary" value='UPDATE' />
              &nbsp;&nbsp;
              <a href={FlowRouter.path('listCategories')} className="btn btn-danger">CANCEL</a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default createContainer((data)=>{
  let handle = Meteor.subscribe('Categories', data._id)
  return {
    pageLoading: ! handle.ready(),
    categoryData: PanoplyCMSCollections.Categories.findOne({_id: data._id})
  };
}, EditCategory)