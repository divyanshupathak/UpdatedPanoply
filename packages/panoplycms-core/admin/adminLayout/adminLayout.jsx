import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import AdminFooter from '../adminLayout/component/adminFooter.jsx';
import AdminHeader from '../adminLayout/component/adminHeader.jsx';
import AdminSidebar from '../adminLayout/component/adminSidebar.jsx';

class AdminLayout extends Component {
	componentDidMount(){
		$('body').attr('style','')
		require('../../imports/styles/admin.css')
	}
	render() {
		return (
			<div>
				<AdminHeader siteData = {this.props.siteData} pageLoading={this.props.pageLoading} />
				<div className="container-fluid main-container">
					<div className="row">
						<div className="col-md-2 sidebar">
							<div className="side-menu">
								<AdminSidebar sideBarMenus={this.props.sideBarMenus} />
							</div>
						</div> 
						<div className="col-md-10 content">
							{ this.props.content }
						</div>
					</div>
					<div className="row">
						<AdminFooter />
					</div>
				</div>
			</div>
		);
	}
}

AdminLayout.propTypes = {
	content: PropTypes.object.isRequired,
};

export default createContainer(() => {
	let handle1 = Meteor.subscribe('siteName')
	let handle2 = Meteor.subscribe('usersProfile')
	return {
		pageLoading: ! handle1.ready() && ! handle2.ready(),
		siteData: PanoplyCMSCollections.Sites.findOne(),
		sideBarMenus: PanoplyCMSCollections.AdminSidebarMenu.find().fetch()
	};
}, AdminLayout);
