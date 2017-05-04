import React, { Component } from 'react';
import { render } from 'react-dom';

import Heading from '../../common/heading.jsx';
import AlertMessage from '../../common/alertMessage.jsx';
import AlertMessageOfError from '../../common/alertMessageOfError.jsx';

import { insertCategory } from '../../actions/category_action.js';

export default class AddCategory extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      errorMsg:false,
      successMsg:false
    };
  }
  handleChange(event) {
    this.props.onUpdate(event.target.id,event.target.value);
  }
  submitData(event){
    event.preventDefault();
    let titleData = $('#title').val()
    let aliasData = generateAlias(titleData)
    let categoryObj = {
      title: titleData,
      alias: aliasData
    }
    Meteor.call('add_category', categoryObj, (err,data)=>{
      if(err){
        this.setState({ errorMsg:'Internal server error or duplicate categories can not insert.' })
      }else{
        this.setState({ successMsg:true })
        $('#title').val('')
      }
    });
    return dispatch => {
      dispatch(insertCategory(categoryObj))
    }
  }
  resetSuccessMsg(){
    this.setState({successMsg:false});
    this.setState({errorMsg:false})
  }
  render(){
    let msg = '';
    if(this.state.successMsg){
      msg = <AlertMessage data={'added category.'} func={this.resetSuccessMsg.bind(this)} />
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
    }else{
      msg = ''
    }
    return(
      <div className="col-md-10 content">
        <Heading data={i18n('ADMIN_COTNENTS_CATEGORY_ADDCATEGORY')} />
        { msg }
        <form className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
          <div className="form-group">
            <label className="col-sm-2 control-label">{i18n('ADMIN_COTNENTS_CATEGORY_ADDCATEGORY_FORM_CATEGORYNAME')}</label>
            <div className="col-sm-10">
              <input type = "text" id="title" className="form-control" placeholder = "Enter title" required />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <input type = "submit" className="btn btn-primary" value='SAVE' />
              &nbsp;&nbsp;
              <a href={FlowRouter.path('listCategories')} className="btn btn-danger">CANCEL</a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}