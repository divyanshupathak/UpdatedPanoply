import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../common/heading.jsx';
import AlertMessage from '../common/alertMessage.jsx';
import AlertMessageOfError from '../common/alertMessageOfError.jsx';
import LoadingSpinner from '../common/loadingSpinner.jsx';

import { editMenu } from '../actions/menu_action.js';

class EditMenu extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      msg: false,
      errorMsg: false
    };
  }
  componentDidMount(){
    document.title = "Edit Menu"
  }
  submitData(event){
    event.preventDefault();
    let menuData = {
      "title": $('#title').val(),
      "desc": $('#desc').val()
    }
    Meteor.call("updateMenu", this.props._id, menuData, (err,data) => {
      if(err){
        this.setState({ errorMsg : err.reason });
        console.log(err);
      }else{
        this.setState({msg : true});
        // $('#title').val('')
        // $('#desc').val('')
      }
    });
    return dispatch => {
      dispatch(editMenu(this.props._id, menuData))
    }
  }
  resetSuccessMsg(){
    this.setState({'msg':false})
    this.setState({'errorMsg':false})
  }
  render(){
    let msg = '';
    if(this.state.msg){
      msg = <AlertMessage data={'updated menu.'} func={this.resetSuccessMsg.bind(this)} />
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
    }else{
      msg = '';
    }

    if (this.props.pageLoading) {
      return <LoadingSpinner />;
    }
    return (
      <div className="col-md-10 content"  onClick={this.resetSuccessMsg.bind(this)}>
        <Heading data={i18n('ADMIN_MENU_EDITMENU')} />
        { msg }
        <div className="panel-body">
          <div id="notification"></div>
          <form id="non-editable" className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
            <div className = "form-group">
              <label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_ADDMENU_FORM_TITLE')}</label>
              <div className = "col-sm-10">
                <input type = "text" name="title" id="title" className = "form-control" defaultValue={this.props.menuData.title} required />
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_ADDMENU_FORM_DESCRIPTION')}</label>
              <div className = "col-sm-10" id="token"> 
                <input type="text" className="form-control" defaultValue={this.props.menuData.desc} id="desc" />
              </div>
            </div>
            <div className="form-group">
              <div className = "col-sm-offset-2 col-sm-10">
                <button className="btn btn-primary">UPDATE</button>
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

export default createContainer((data) => {
  let handle = Meteor.subscribe('findMenu', data._id)
  return {
    pageLoading: ! handle.ready(),
    menuData: PanoplyCMSCollections.Menus.findOne({_id:data._id})
  };
}, EditMenu)