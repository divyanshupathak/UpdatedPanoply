import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import AlertMessage from '../../common/alertMessage.jsx';
import AlertMessageOfError from '../../common/alertMessageOfError.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';
import SelectMenu from './menuSelect.jsx';
import SelectArticle from './articleSelect.jsx';
import SelectCategory from './categorySelect.jsx';

import { editMenuItem } from '../../actions/menuItem_action.js';

class EditMenuItem extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      itemType:'',
      MenuItemTypeValue:'',
      language:i18n.getLanguage(),
      msg:false,
      valid:'',
      errorMsg:false,
    };
  }
  selectMenuItemType(event){
    event.preventDefault();
    // console.log("selectMenuItemType >>", $('#select-menu-item-type').val())
    this.setState({ itemType: $('#select-menu-item-type').val() })
  }
  getMenuItemTypeValue(val){
    // console.log("getMenuItemTypeValue >>", val)
    this.setState({ MenuItemTypeValue: val })    
  }
  getDropDown(){
    let menus = this.listOfMenu();
    level = 1;
    that=this;
    function getElem(submenu, alias){
      let list = '';
      let ar = [];
      let menuArr = [];

      if(submenu && alias){
        menuArr = submenu;
      } else {
        menuArr = menus;
      }

      menuArr.forEach(function(menu) {
        if(that.props.menuItemData._id != menu._id)  {
        list += '<option value="' + menu._id + '"'; 
         if(that.props.menuItemData.parentId == menu._id) list += 'selected';
        list += '>';
        if(submenu){
          level++;
        }
        for(let i=0; i<level;i++){
          list += '- ';
        }
        list += menu.title + '</option>';
        if(menu.child){
          list += getElem(menu.child, menu.alias);
        }
        if(!submenu) level=1;
        else level--;     
        }  
      });
      return list;
    }
     
    let list = getElem();
    return list;
  }
  listOfMenu(){    
    that=this
    let elements = this.props.MenuItemsData;
    
    let menu = new Array();

    function getElements(parent_id){
      if(parent_id){
        return getChild(parent_id);
      } else {
        let element = new Array();
        elements.forEach(function (elem1) {
          if(that.state.MenuValue==elem1.mainParentId){
            let child = getChild(elem1._id);
            if(elem1.parentId==''){
              element.push({ _id: elem1._id, title: elem1.title, alias: elem1.alias, child: child });
            }
          }
        });
        return element;
      }   
    }

    function getChild(parent_id){
      let child = new Array();
      elements.forEach(function (elem2) {
        if(elem2.parentId){
          if(parent_id== elem2.parentId){
            child.push({ _id: elem2._id, title: elem2.title, alias: elem2.alias, child: getElements(elem2._id) });
          }
        }
      });
      return child;
    }
    return getElements();
  }
  componentDidMount(){
    this.setState({ MenuValue: this.props.MenuValue1 })
    document.title = "Edit Menu"
  }
  getMenuValue(val){
    this.setState({ MenuValue: val })
  }
  submitData(event){
    event.preventDefault();
    let menuItemObj = {
      "title": $('#title').val(),
      "desc": $('#desc').val(),
      "MenuItemType": $('#select-menu-item-type').val(),
      "mainParentId": this.state.MenuValue,
      "MenuItemTypeId": this.state.MenuItemTypeValue,
      "parentId": $('#selectParentMenu').val()
    }
    let paramId = this.props.menuItemData.mainParentId;
    Meteor.call("updateMenuItem", this.props._id, menuItemObj, (err,data)=>{
      if(err){
        this.setState({ errorMsg : err.reason });
        // console.log(err)
      }else{
        this.setState({ msg : true });
      }
    });
    return dispatch => {
      dispatch(editMenuItem(this.props._id, menuItemObj))
    }
  }
  resetSuccessMsg(){
    this.setState({'msg': false})
    this.setState({'errorMsg': false})
    Session.set("msg", false)
    Session.set("errorMsg", false)
  }
  render(){   
    let msg = '';
    if(this.state.msg){
      msg = <AlertMessage data={'updated menu item.'} func={this.resetSuccessMsg.bind(this)} />
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)} />
    }else{
      msg = '';
    }

    if (this.props.pageLoading) {
      return <LoadingSpinner />;
    }
    let a={__html: '<option value="">Root</option>'+this.getDropDown()};
    if(this.state.itemType){
      itemType = this.state.itemType
    }else{
      itemType = this.props.menuItemData.MenuItemType
    }
    return (
      <div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
        <Heading data={i18n('ADMIN_MENU_MENUITEMS_EDITMENUITEM')} />
        { msg }
        <div className="panel-body">
          <div id="notification"></div>
          <form id="non-editable" className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
            <div className = "form-group">
              <label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_TITLE')}</label>
              <div className = "col-sm-10">
                <input type = "text" name="title" id="title" className = "form-control" defaultValue={this.props.menuItemData.title} required/>
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_DESCRIPTION')}</label>
              <div className = "col-sm-10" id="token" > 
                <input type="text" id="desc" className="form-control" defaultValue={this.props.menuItemData.desc} id="desc" />
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENU')}</label>
              <SelectMenu func={this.getMenuValue.bind(this)} nameId={this.props.menuItemData.mainParentId} />    
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_MENUITEMTYPE')}</label>
              <div className = "col-sm-10">
                <select className = "form-control" defaultValue={this.props.menuItemData.MenuItemType} id="select-menu-item-type" onChange={this.selectMenuItemType.bind(this)}> 
                  <option className="form-control" value="">Select </option>
                  <option className="form-control" value="category">Category</option>
                  <option className="form-control" value="article">Article</option>
                </select>
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">
                {
                  (
                    this.state.itemType ?
                      this.state.itemType.charAt(0).toUpperCase() + this.state.itemType.slice(1)
                    :
                      this.props.menuItemData.MenuItemType.charAt(0).toUpperCase() + this.props.menuItemData.MenuItemType.slice(1)
                  )
                }
              </label>
              {
                itemType == 'category'?
                  <SelectCategory typeId={this.props.menuItemData.MenuItemTypeId} func={this.getMenuItemTypeValue.bind(this)} />
                :
                  itemType == 'article'?
                    <SelectArticle typeId={this.props.menuItemData.MenuItemTypeId} func={this.getMenuItemTypeValue.bind(this)} />
                :
                ''
              }
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_PARENT')}</label>
              <div className = "col-sm-10"  >
                <select className="form-control" id="selectParentMenu" dangerouslySetInnerHTML={a}></select>
              </div>
            </div>
            <div className="form-group">
              <div className = "col-sm-offset-2 col-sm-10">
                <button className="btn btn-primary">UPDATE</button>
                &nbsp;&nbsp;
               <a className="btn btn-danger" href={FlowRouter.path('listMenuItems',{_id:this.props.menuItemData.mainParentId})}>CANCEL</a>
              </div>
            </div>  
          </form>
        </div>
      </div>
    )
  }
}

export default createContainer((data) => {
  // console.log("------------", data)
  let handle = Meteor.subscribe('findMenuItem', data._id);
  let handle2 = Meteor.subscribe('menuItems', data._id);
  let menu = Meteor.subscribe('findMenu', data._id);
  return {
    pageLoading: ! handle.ready() && ! handle2.ready() && ! menu.ready(), 
    menuItemData: PanoplyCMSCollections.MenuItems.findOne({_id:data._id}),
    MenuId: Session.get('MenuId'),
    MenuItemsData: PanoplyCMSCollections.MenuItems.find().fetch(),
    MenuValue1: PanoplyCMSCollections.MenuItems.findOne({_id:data._id}).mainParentId
  };
}, EditMenuItem)