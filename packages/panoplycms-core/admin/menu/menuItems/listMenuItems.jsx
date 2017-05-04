import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import NotFoundComp from '../../common/notFoundComp.jsx';
import Heading from '../../common/heading.jsx';
import MenuItemsDataList from './menuItemsDataList.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';

class ListMenuItems extends Component {
  constructor(props) {
    super(props);

    Session.setDefault("trashListShow", false)
 
    this.state = {
      trashListShow: false,
    };
  }
  listOfMenu() {
    // console.log("=====**=====", this.props.MenuItemsData)
    let elements = this.props.MenuItemsData;
    let menu = new Array();
    let element = new Array();
    let level=0;
    elements.forEach(function(elem1) {
      if(elem1.parentId=='' || elem1.trash==true){
        element.push({ _id: elem1._id, title: elem1.title, alias: elem1.alias, desc:elem1.desc, level:level });
        let child = getChild(elem1._id,level+1);
      }else if(elem1.parentId==''){
        element.push({ _id: elem1._id, title: elem1.title, alias: elem1.alias, desc:elem1.desc, level:level });
        let child = getChild(elem1._id,level+1);
      }
    });
    function getChild(parent_id, level){
      elements.forEach(function (elem2) {
        if(elem2.parentId){
          if(parent_id== elem2.parentId){
            if(elem2.trash==true){
              element.push({ _id: elem2._id, title: elem2.title, alias: elem2.alias, desc:elem2.desc, child: getChild(elem2._id,level+1), level:level });
            }else {
              element.push({ _id: elem2._id, title: elem2.title, alias: elem2.alias, desc:elem2.desc, level:level });
              getChild(elem2._id,level+1)
            }
          }
        }
      });
      if(Session.get("trashListShow")){
        return element;
      }else{
        return _.sortBy(element,'level');
      }
    }
    // console.log(element,"----",'level')
    return element;
  }
  showArticles(){
    if($('#display').val() == 'trash'){
      Session.set("trashListShow", true);
      this.setState({trashListShow: true})
    }else{
      Session.set("trashListShow", false);
      this.setState({trashListShow: false})
    }
  }
  showMenu(){
    Session.set('MenuId',$('#mainMenu').val());
    FlowRouter.go('listMenuItems',{_id: $('#mainMenu').val()})
  }
  storeMenuid(event){
    event.preventDefault();
    FlowRouter.go(''+'\addMenuItem',{_id: FlowRouter.getParam("_id")})
  }
  render() {
    let m = this.listOfMenu();
    nodata = '';
    if((m).length == 0  && this.state.trashListShow == false){
      nodata = <NotFoundComp />;
    }else if((m).length == 0 && this.state.trashListShow == true){
      nodata = <NotFoundComp />;
    }else{
      nodata = '';
    }

    if (this.props.pageLoading) {
      <LoadingSpinner />
    }
    return (
      <div className="col-md-10 content">
        <Heading data={i18n('ADMIN_MENU_MENUITEMS')} />
        <div className="panel-heading"> 
          <a className="btn btn-success btn-ico" onClick={this.storeMenuid.bind(this)}><i className="fa fa-plus-circle fa-lg"></i>&nbsp;
            {i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM')}
          </a>
          <div className="pull-right" >
            Menus:&nbsp;
            <select id="mainMenu" onChange={this.showMenu.bind(this)} defaultValue={FlowRouter.getParam("_id")}>
              {
                this.props.Menus.map((result) => {
                  return <option key={result._id} value={result._id}>{result.title}</option>;
                })
              } 
            </select>
          </div>
          <div className="pull-right col-md-3 ">
            Display:&nbsp;
            <select id="display" onChange={this.showArticles.bind(this)}>
              <option value="all">Active</option>
              <option value="trash">Trash</option>
            </select>
          </div>
        </div>
       
        <div className="table-responsive" id="non-editable">
          {
            nodata == '' ?
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>{i18n('ADMIN_MENU_ADDMENU_FORM_TITLE')}</th>
                    <th>{i18n('ADMIN_MENU_ADDMENU_FORM_DESCRIPTION')}</th>
                    <th>{/*i18n('ADMIN_MENU_MENUITEMS_ADDMENUITEM_DEFAULT')*/}</th>
                    <th>{i18n('ADMIN_MENU_ADDMENU_FORM_ACTION')}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    m.map((menu) => {
                      // console.log(menu)
                      return <MenuItemsDataList key={menu._id} data={menu} homepage={this.props.defaultMenuItem? this.props.defaultMenuItem._id: ""} />
                    })
                  }
                </tbody>
              </table>
            :''
          }
          { nodata }
        </div>
        <DefaultItemParentPopup />
      </div>
    );
  }
}

export default createContainer(() => {
  let handle = Meteor.subscribe('menuItems', FlowRouter.getParam("_id"), Session.get("trashListShow"));
  let handle2 = Meteor.subscribe('menus');
  //let DefaultItem=Meteor.subscribe('defaultMenuItem');
  return {
    pageLoading: ! handle.ready() && ! handle2.ready(),
    MenuItemsData: PanoplyCMSCollections.MenuItems.find({ mainParentId: FlowRouter.getParam("_id"), trash: Session.get("trashListShow") }).fetch(),
    results: PanoplyCMSCollections.MenuItems.find().fetch(),
    Menus: PanoplyCMSCollections.Menus.find({ trash:false }).fetch(),
    defaultMenuItem: PanoplyCMSCollections.MenuItems.findOne({ homepage:true }),
  }
}, ListMenuItems)


DefaultItemParentPopup = (m) => {
  return(
    <div id="defaultItemParentPopup" className="modal fade" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title">You can not delete default menu Items parent. Please change the default menu Item first after you can delete this menu Item.</h4>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal">Ok</button>
          </div>
        </div>
      </div>
    </div>
  )
}