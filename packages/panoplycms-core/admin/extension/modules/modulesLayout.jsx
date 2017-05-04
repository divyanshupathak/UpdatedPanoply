import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Heading from '../../common/heading.jsx';
import LoadingSpinner from '../../common/loadingSpinner.jsx';
import NotFoundComp from '../../common/notFoundComp.jsx';

import { trashModule } from '../../actions/module_action.js';
import { removeModule } from '../../actions/module_action.js';
import { restoreModule } from '../../actions/module_action.js';

class ModulesLayout extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showTrashList: false,
			id: ''
		};
	}
	showModules(){
		if($('#display').val()=='trash'){
			this.setState({ showTrashList:true })
		}else{
			this.setState({ showTrashList:false })
		}
	}
	addModules(){
		$('#add.modal').modal()
	}
	addModuleAction(type){
		let moduleArray = _.findWhere(this.props.modulesList, {name: type}) || []
		// console.log("moduleArray :: addModuleAction ==>", moduleArray)
		moduleArray = _.findWhere(moduleArray.routes, {role: 'add'}) || []
		// console.log(moduleArray,'moduleArray-----')
		FlowRouter.go(moduleArray.name)
		// type=='menumodule'?FlowRouter.go('addMenuModule'):FlowRouter.go('addHtmlblock');
	}
	editModuleAction(type, id){
		// console.log("moduleArray :: type, id ==>", type, id)
		// console.log("moduleList :: editModuleAction ==>", this.props.modulesList)
		let moduleArray = _.findWhere(this.props.modulesList, {name: type}) || []
		// console.log("moduleArray :: editModuleAction ==>", moduleArray)
		moduleArray = _.findWhere(moduleArray.routes, {role: 'edit'}) || []
		// console.log("====>", moduleArray)
		FlowRouter.go(moduleArray.name,{_id:id})
	}
	trashModule(id) {
		Meteor.call('trashModule', id, (err, res) => {
			this.setState({ id: '' })
		})
		return dispatch => {
			dispatch(trashModule(id))
		}
	}
	deleteModule(id) {
		Meteor.call('deleteModule', id, (err, res) => {
			this.setState({ id:'' })
		})
		return dispatch => {
			dispatch(removeModule(id))
		}
	}
	restoreModule(id) {
		Meteor.call('restoreModule', id, (err, res) => {
			this.setState({ id:'' })
		})
		return dispatch => {
			dispatch(restoreModule(id))
		}
	}
	handelClick(e){
		switch(e.action){
			case 'edit':
				/*e.type=='menumodule'?FlowRouter.go('editMenuModule',{_id:e.id}):FlowRouter.go('editHtmlblock',{_id:e.id});*/
				this.editModuleAction(e.type, e.id)
				break;
			case 'trash':
				this.setState({id: e.id})
				$('#trash.modal').modal() 
				break;
			case 'delete':
				this.setState({id: e.id})
				$('#remove.modal').modal()
				break;
			case 'restore':
				this.setState({id: e.id})
				$('#restore.modal').modal()
				//this.restoreModule(e.id)
				break;
		}
	}
	render() {
		nodata='';
		if(this.props.results.length == 0  && this.state.showTrashList == false){
			nodata = <NotFoundComp />
		}else if(this.props.resultOfTrash.length == 0 && this.state.showTrashList == true){
			nodata = <NotFoundComp />
		}else{
			nodata = '';
		}
		return (
			<div className="col-md-10 content">
				<Heading data={i18n('ADMIN_EXTENSION_MODULES_MANAGER')} />
				<div className="panel-heading"> 
					<a className="btn btn-success btn-ico" onClick={this.addModules.bind(this)}>
						<i className="fa fa-plus-circle fa-lg"></i> {i18n('ADMIN_EXTENSION_MODULES_ADDMODULE')}
					</a>
					<div className="pull-right">
						Display:&nbsp;
						<select id="display" onChange={this.showModules.bind(this)}>
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
											<th className="">{i18n('ADMIN_EXTENSION_MODULES_ADDMODULE_FORM_TITLE')}</th>
											<th className="">{i18n('ADMIN_EXTENSION_MODULES_ADDMODULE_FORM_TYPE')}</th>
											<th className="">{i18n('ADMIN_EXTENSION_MODULES_ADDMODULE_FORM_POSITION')}</th>
											<th className="">{i18n('ADMIN_EXTENSION_MODULES_ADDMODULE_FORM_ACTIONS')}</th>
										</tr>
									</thead>
									<tbody>
										{
											this.state.showTrashList ?
												this.props.resultOfTrash.map(result => {
													return <ModuleList key={result._id} {...result} onClick={this.handelClick.bind(this)} stateVal={this.state.showTrashList} />;
												})
											:
												this.props.results.map(result => {
													return <ModuleList key={result._id} {...result} onClick={this.handelClick.bind(this)} stateVal={this.state.showTrashList} />;
												})
										}
									</tbody>
								</table>
							: ''
						}
						{ nodata }
					</div>
				</div> 
				<AddModulesPopup list={this.props.modulesList} onClick={this.addModuleAction.bind(this)} />
				<TrashModulesPopup id={this.state.id} onClick={this.trashModule.bind(this)} />
				<RemoveModulesPopup id={this.state.id} onClick={this.deleteModule.bind(this)} />
				<RestoreModulesPopup id={this.state.id} onClick={this.restoreModule.bind(this)} />
			</div>
		);
	}
}

export default createContainer(() => {
	let moduleList = Meteor.subscribe('moduleList');
	return {
		results: PanoplyCMSCollections.Modules.find({trash:false},{_id:1, name: 1, type: 1, position: 1}).fetch(),
		resultOfTrash: PanoplyCMSCollections.Modules.find({trash:true},{_id:1, title: 1, type: 1, position: 1}).fetch(),
		modulesList: PanoplyCMSCollections.RegisteredPackages.find({type: "module"}).fetch()
	};
}, ModulesLayout)

ModuleList = module => {
	style = { display: 'inline-block' };
	// console.log("modulesLayout :: Module Params ==>", module)
	return (
		<tr>
			<td>{module.name ? module.name : ''}</td>
			<td>{module.type ? module.type : ''}</td>
			<td>{module.position ? module.position : ''}</td>
			<td>
				{
					! module.stateVal ?
						<div>
							<div style={style}><i style={{color:"red", cursor:'pointer'}} className="fa fa-trash-o" title="Trash" data-toggle="tooltip" onClick={() => {module.onClick({id: module._id, action:'trash'})}}></i></div> 
							&nbsp;&nbsp;&nbsp;
							<div style={style}><i style={{color:"#142849", cursor:'pointer'}} className="fa fa-pencil-square-o" data-toggle="tooltip" title="Edit" onClick={() => {module.onClick({id: module._id, action:'edit', type:module.type})}} ></i></div>  
						</div> :
					<div> 
						<div style={style}><i title="Delete" style={{color: "red", cursor:'pointer'}} className="fa fa-times" data-toggle="tooltip" onClick={() => {module.onClick({id: module._id, action:'delete'})}}></i></div>
						&nbsp;&nbsp;&nbsp;
						<div style={style}><i title="Restore" className="fa fa-undo" data-toggle="tooltip" onClick={() => {module.onClick({id: module._id, action:'restore'})}} style={{cursor:'pointer'}}></i></div>
					</div>
				}
			</td>
		</tr>
	);
}

AddModulesPopup = (modules) => {
	return (
		<div id="add" className="modal fade" role="dialog">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">Please select a module you want to add</h4>
					</div>
					<div className="modal-body">
						<ul className="listModules">
							{
								modules.list.map(l => {
								return <li data-dismiss="modal" key={l._id} onClick={() => { modules.onClick(l.name) }}>{l.label?_.capitalize(l.label):_.capitalize(l.name)}</li>
								})
							}
						</ul>
					</div>
					<div className="modal-footer">
					<button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		);
}

TrashModulesPopup = (m) => {
	return (
		<div id="trash" className="modal fade" role="dialog">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-body">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">Do you really want to remove ?</h4>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>{m.onClick(m.id)}}>Yes</button>
						<button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	);
}

RemoveModulesPopup = (m) => {
	return (
		<div id="remove" className="modal fade" role="dialog">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-body">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">Do you want to parmanently delete ?</h4>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>{m.onClick(m.id)}}>Yes</button>
						<button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	);
}

RestoreModulesPopup = (m) => {
	return (
		<div id="restore" className="modal fade" role="dialog">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-body">
						<button type="button" className="close" data-dismiss="modal">&times;</button>
						<h4 className="modal-title">Do you want to really restore ?</h4>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>{m.onClick(m.id)}}>Yes</button>
						<button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	);
}