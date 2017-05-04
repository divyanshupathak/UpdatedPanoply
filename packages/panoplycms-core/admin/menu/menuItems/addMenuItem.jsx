import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import AlertMessage from '../../common/alertMessage.jsx';
import AlertMessageOfError from '../../common/alertMessageOfError.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';

import { addMenuItem } from '../../actions/menuItem_action.js';

class AddMenuItem extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      language: i18n.getLanguage(),
      msg: false,
      valid: '',
      errorMsg: false,
      itemType: '',
      MenuItemTypeValue: '',
      MenuValue: this.props._id
    };
  }
  selectMenuItemType(event){
    event.preventDefault();
    this.setState({itemType: $('#selectMenuItemType').val()})
  }
  getMenuItemTypeValue(val){
    this.setState({ MenuItemTypeValue: val })
  }
  getMenuValue(val){
    this.setState({MenuValue: $('#selectMenu').val()})
  }
  componentDidMount(){
    document.title = "Add Menu Item"
  }
  submitData(event){
    event.preventDefault();
    let menuItemsData = {
      "title": $('#title').val(),
      "desc": $('#desc').val(),
      "mainParentId": $('#selectMenu').val(),//FlowRouter.getParam("_id"),
      "MenuItemType": this.state.itemType,
      "MenuItemTypeId": $('#mainMenu').val(),
      "parentId": $('#selectParent').val(),
      "homepage": false
    }
    Meteor.call("insertMenuItem", menuItemsData, (err,data)=>{
      if(err){
        this.setState({ errorMsg : err.reason })
        console.log(err);
      }else{
        this.setState({ msg : true })
        this.setState({ itemType :'' });
        $('#title').val('');
        $('#desc').val('');
        $('#selectParent').val('');
        $('#selectMenu').val(this.props._id);
        $('#selectMenuItemType').val('');
      }
    });
    return dispatch => {
      dispatch(addMenuItem(menuItemsData))
    }
  }
  resetSuccessMsg(){
    this.setState({'msg':false})
    this.setState({'errorMsg':false})
    this.setState({'msg':false})
    this.setState({'errorMsg':false})
  }
  fecthCategoryArticles(event){
    event.preventDefault();
  }
  getchild(id){
    childData=[];
    _.each(this.props.MenuItemData,function(a){
      if(id == a.parentId){
        childData.push({_id:a._id, title:a.title});
      }
    });
    return childData;
  }
  getDropDown(){
    let menus=this.listOfMenu();
    level = 1;
    let menuArr = [];
    function getElem(submenu, alias){
      let list='';
      let ar=[];

      if(submenu && alias){
        menuArr = submenu;
      } else {
        menuArr = menus;
      }

      menuArr.forEach(function (menu) {
        list += '<option value="' + menu._id + '"';
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
      });

      return list;
    }
     
    let list = getElem();
    return list;
  }
  listOfMenu(){ 
    that=this;
   
    let elements = this.props.MenuItemData;
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
  render(){
    that = this
    let msg = '';
    if(this.state.msg){
      msg = <AlertMessage data={'added menu item.'} func={this.resetSuccessMsg.bind(this)}/>
    }else if(this.state.errorMsg){
      msg = <AlertMessageOfError data={this.state.errorMsg} func={this.resetSuccessMsg.bind(this)}/>
    }else{
      msg = '';
    }
    if (this.props.pageLoading) {
      return <LoadingSpinner />;
    }

    let a = {__html: '<option value="">Root</option>'+this.getDropDown()};
    return (
      <div className="col-md-10 content" onClick={this.resetSuccessMsg.bind(this)}>
        <Heading  data={i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM')} />
        { msg }
        <div className="panel-body">
          <div id="notification"></div>
          <form id="non-editable" className = "form-horizontal" role = "form" onSubmit={this.submitData.bind(this)}>
            <div className = "form-group">
              <label htmlFor = "firstname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_TITLE')}</label>
              <div className = "col-sm-10">
                <input type = "text" name="title" id="title" className = "form-control"  placeholder = "Enter title" required />
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_DESCRIPTION')}</label>
              <div className = "col-sm-10"> 
                <input type="text" className="form-control" id="desc" />
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENU')}</label>
              <div className = "col-sm-10"> 
                <select id="selectMenu" className = "form-control" onChange={this.getMenuValue.bind(this)} defaultValue={that.props._id}>
                  <option className="form-control" value="">Select </option>
                  {
                    this.props.Menu1.map((result) => {
                      return <option value={result._id} key={result._id}>{result.title} </option>;
                    })
                  } 
                </select>
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_MENUITEMTYPE')}</label>
              <div className = "col-sm-10"  > 
                <select className = "form-control" id="selectMenuItemType" onChange={that.selectMenuItemType.bind(that)} required> 
                  <option className="form-control" value="">Select </option>
                  <option className="form-control" value="category">Category</option>
                  <option className="form-control" value="article">Article</option>
                </select>
              </div>
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{this.state.itemType.charAt(0).toUpperCase() + this.state.itemType.slice(1)}</label>
              <div className = "col-sm-10" id="token"> 
                {
                  this.state.itemType=='category'?
                    <select id="mainMenu" className = "form-control" required>
                      <option className="form-control" value="">Select</option>
                      {
                        this.props.categoryData.map((result)=> {
                          return <option key={result._id} value={result._id} >{result.title} </option>;
                        })
                      } 
                    </select>
                  : this.state.itemType=='article' ?
                    <select id="mainMenu" className = "form-control" required>
                      <option className="form-control" value="">Select</option>
                        {
                          this.props.articleData.map((result)=> {
                            return <option key={result._id} value={result._id} >{result.title} </option>;
                          })
                        }
                    </select>
                  :/*this.state.itemType=='url'?<input type="text" ref="url" name="url" className="form-control"  />:*/''
                }
              </div>  
            </div>
            <div className = "form-group">
              <label htmlFor = "lastname" className = "col-sm-2 control-label">{i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_FORM_PARENT')}</label>
              <div className = "col-sm-10" id="token" > 
                <select className="form-control" id="selectParent" dangerouslySetInnerHTML={a} ></select>
              </div>
            </div>         
            <div className="form-group">
              <div className = "col-sm-offset-2 col-sm-10">
                <button className="btn btn-primary">SAVE</button>
                &nbsp;&nbsp;
                <a className="btn btn-danger" href={FlowRouter.path('listMenuItems',{_id:FlowRouter.getParam("_id")})}>CANCEL</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default createContainer(()=>{
  let menu = Meteor.subscribe('menus')
  let handle = Meteor.subscribe('articlesFind')
  let handle1 = Meteor.subscribe('Categories')
  let handle2 = Meteor.subscribe('menuItemsByMainParentId')
  return {
    pageLoading: ! handle.ready() && ! handle1.ready(),
    categoryData: PanoplyCMSCollections.Categories.find({trash:false}).fetch(),
    articleData: PanoplyCMSCollections.Articles.find({trash:false}).fetch(),
    MenuItemData: PanoplyCMSCollections.MenuItems.find({trash:false}).fetch(),
    Menu1:PanoplyCMSCollections.Menus.find({trash:false}).fetch()
  };
}, AddMenuItem)