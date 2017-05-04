import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Modal from './deletemodal.jsx';
import RestoreModal from './restoreModal.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';

import { editDefaultMenuItem } from '../../actions/menuItem_action.js';

class MenuItemsDataList extends Component {
  changeDefaultValue(event){
    event.preventDefault();
    Meteor.call("updateDefaultMenuItem", this.props.data._id, this.props.homepage, (err,data)=>{
      if(err){
        console.log(err)
      }else{
      }
    });
    return dispatch => {
      dispatch(editDefaultMenuItem(this.props.data._id, this.props.homepage))
    }
  }
  render() {
    if(this.props.data._id == this.props.homepage){
      style={color:'#2574ab',cursor:'pointer'}
      classname="fa fa-star fa-lg"
    }else{
      classname='fa fa-star-o fa-lg'
      style={cursor:'pointer'}
    }
    let iconStyle={
      display:"inline-block",
      fontSize:"1.8em",
      verticalAlign:"top",
    };
    let divStyle = {
      display: "inline-block",
    };
    let anchorStyle= {
      display:"block",
    }
    let list='|-';
    for(i=0;i < this.props.data.level; i++){
      list +='|-';
    }

    if(this.props.pageLoading){
      <LoadingSpinner />
    }
    
    let c = 0;
    return (
      <tr>
        <td id="edit_menuItem" style={{lineHeight: "1em",width:"20%"}}>
          <large style={iconStyle}>{list}</large>
          <div style={divStyle}>
            <a href="javascript:void(0)">
              <large style={anchorStyle}>{this.props.data.title}</large>
            </a>
            <small style={anchorStyle}> (<span>{'Alias: '+this.props.data.alias}</span>) </small>
          </div>
        </td>
        <td style={{width:"50%"}}>{this.props.data.desc}</td>
        <td style={{width:"10%"}}>
          <span style={style} className={classname} onClick={this.changeDefaultValue.bind(this)}></span>
        </td>
        <td style={{width:"10%"}}>
          <div id="delete_menuItem" className="delete_btn" data-toggle="modal" data-target={"#"+this.props.data._id} style={{display:'inline-block'}}>
            {
              Session.get("trashListShow") ? <i style={{color:'red', cursor:'pointer'}} title="Delete" className="fa fa-times" aria-hidden="true"></i> : <i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" title="Trash"></i>
            }
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            Session.get("trashListShow")? <i data-toggle="modal" data-target={'#'+this.props.data._id+'restoreArticle'} className="fa fa-undo" aria-hidden="true" title="Restore" style={{cursor:'pointer'}}></i> : <a href={FlowRouter.path('editMenuItem',{_id:this.props.data._id})}> <i style={{color:"#142849"}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit" style={{cursor:'pointer'}}></i> </a> 
          }
          <Modal key={this.props.data._id} data={this.props.data} stateVal={Session.get("trashListShow")} homepage={this.props.defaultMenuItem1? this.props.defaultMenuItem1._id: ""} />
          <RestoreModal key={this.props.data._id+"restore"} data={this.props.data} />
        </td>
      </tr>
    );
  }
}

export default createContainer((data)=>{
  let handle = Meteor.subscribe('menuParentItems', data.data._id, false);
  let item = data;
  return {
    pageLoading: ! handle.ready(),
    MenuItemData: PanoplyCMSCollections.MenuItems.find({ trash:false }).fetch(),
    defaultMenuItem1: PanoplyCMSCollections.MenuItems.findOne({ homepage:true })
  }
}, MenuItemsDataList)