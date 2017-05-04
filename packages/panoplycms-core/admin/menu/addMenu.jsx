import React, { Component } from 'react';
import { render } from 'react-dom';

import Heading from '../common/heading.jsx';
import AlertMessage from '../common/alertMessage.jsx';
import AlertMessageOfError from '../common/alertMessageOfError.jsx';

import { addMenu } from '../actions/menu_action.js';

export default class AddMenu extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      language:i18n.getLanguage(),
      msg: false,
      valid:'',
      errorMsg: ''
    };
  }
  componentDidMount(){
    document.title = "Add Menu"
  }
  submitData(event){
    event.preventDefault();    
    let menuData = {
      "title": $('#title').val(),
      "desc": $('#desc').val()
    }
    Meteor.call("insertMenu", menuData, (err, data) => {
      if(err){
        console.log(err);
        this.setState({ errorMsg : err.reason })
      }else{
        this.setState({ msg : true })
        $('#title').val('')
        $('#desc').val('')
      }
    });
    return dispatch => {
      dispatch(addMenu(menuData))
    }
  }
  resetSuccessMsg(){
    this.setState({'msg': false})
    this.setState({'errorMsg': ''})
  }
  render() {
    let msg = '';
    if(this.state.msg){
      msg = <AlertMessage data={'added menu.'} func={this.resetSuccessMsg.bind(this)} />
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
    }else{
      msg = '';
    }
    return (
      <div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
        <Heading data={i18n('ADMIN_MENU_ADDMENU')} />
        { msg }
        <div className="panel-body">
          <div id="notification"></div>
            <form id="non-editable" className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
              <div className = "form-group">
                <label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_ADDMENU_FORM_TITLE')}</label>
                <div className = "col-sm-10">
                  <input type = "text" name="title" id="title" className = "form-control" placeholder = "Enter title" required />
                </div>
              </div>
              <div className = "form-group">
                <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_ADDMENU_FORM_DESCRIPTION')}</label>
                <div className = "col-sm-10" id="token" > 
                  <input type="text" className="form-control" id="desc" />
                </div>
             </div>
            <div className="form-group">
              <div className = "col-sm-offset-2 col-sm-10">
                <button className="btn btn-primary" type="submit">SAVE</button>
                &nbsp;&nbsp;
                <a className="btn btn-danger" href={FlowRouter.path('manageMenu')}>CANCEL</a>
              </div>
            </div> 
          </form>
        </div>
      </div>
    )
  }
}