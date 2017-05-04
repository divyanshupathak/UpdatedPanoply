import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../common/heading.jsx';
import ModalMenu from './modalMenu.jsx';
import RestoreModalMenu from './restoreModalMenu.jsx';
import NotFoundComp from '../common/notFoundComp.jsx';


class ListMenus extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      trashListShow: false
    };
  }
  showArticles(){
    if($('#display').val()=='trash'){
      this.setState({trashListShow:true})
    }else{
      this.setState({trashListShow:false})
    }
  }
  render() {
    nodata = '';
    if((this.props.results).length == 0 && this.state.trashListShow == false){
      nodata = <NotFoundComp />;
    }else if((this.props.resultOfTrash).length == 0 && this.state.trashListShow == true){
      nodata = <NotFoundComp />
    }else{
      nodata = '';
    }
    return (
      <div className="col-md-10 content">
        <Heading data={i18n('ADMIN_MENU')} />
        <div className="panel-heading"> 
          <a className="btn btn-success btn-ico" href={FlowRouter.path('addMenu')} >
            <i className="fa fa-plus-circle fa-lg"></i>&nbsp;
              {i18n('ADMIN_MENU_ADDMENU')}
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
                      <th>{i18n('ADMIN_MENU_ADDMENU_FORM_TITLE')}</th>
                      <th>{i18n('ADMIN_MENU_ADDMENU_FORM_DESCRIPTION')}</th>
                      <th>{i18n('ADMIN_MENU_ADDMENU_FORM_ACTION')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.trashListShow ?
                        this.props.resultOfTrash.map((result) => {
                          return <Trvalue key={result._id} data={result} stateVal={this.state.trashListShow} />;
                        })
                      :
                      this.props.results.map((result) => {
                        return <Trvalue key={result._id} data={result} stateVal={this.state.trashListShow} />;
                      })
                    }
                  </tbody>
                </table>
              : ''
            }
            { nodata }
          </div>
        </div>
        {
          this.props.results.map((result) => {
            return <ModalMenu key={result._id} data={result} stateVal={this.state.trashListShow} />
          })
        }
        {
          this.props.resultOfTrash.map((result) => {
            return <RestoreModalMenu key={result._id} data={result} />
          })
        }
        {
          this.props.resultOfTrash.map((result) => {
            return <ModalMenu key={result._id} data={result} stateVal={this.state.trashListShow} />
          })
        }
      </div>
    );
  }
}

export default createContainer(()=> {
  Meteor.subscribe('menus');
  Meteor.subscribe('trashMenus')
  return {
    results: PanoplyCMSCollections.Menus.find({ trash:false }).fetch(),
    resultOfTrash: PanoplyCMSCollections.Menus.find({ trash:true }).fetch()
  }
}, ListMenus)

class Trvalue extends Component {
  storeMenuid(event){
    event.preventDefault();
    Session.set('MenuId',this.props.data._id);
    FlowRouter.go('listMenuItems',{_id:this.props.data._id})
  }
  render() {
    let c = 0;
    return (
      <tr>
        <td id="edit_menu">
          <a onClick={this.storeMenuid.bind(this)}><large> {this.props.data.title} </large></a>
          <small> (<em>Alias:&nbsp;{this.props.data.alias}</em>) </small>
        </td>
        <td> {this.props.data.desc} </td>  
        <td>
          <div id="delete_article" className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}}>
            {
              this.props.stateVal ?
                <i style={{color:'red', cursor:'pointer'}} title="Delete" className="fa fa-times" aria-hidden="true"></i> 
              : <i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" title="Trash"></i> 
            }
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.props.stateVal ?
              <i data-toggle="modal" data-target={'#'+this.props.data._id+'restoreArticle'} className="fa fa-undo" aria-hidden="true" onClick={this.restoreMenu} title="Restore" style={{cursor:'pointer'}}></i> 
            : <a href={FlowRouter.path('editMenu',{_id:this.props.data._id})}> <i style={{color:"#142849",cursor:'pointer'}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit"></i></a> 
          }
        </td>
      </tr>
    )
  }
}