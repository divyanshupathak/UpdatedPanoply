import React, { Component } from 'react';
import { render } from 'react-dom';

export default class AdminFooter extends Component {
	render(){
		return (
			<footer className="pull-left">
				<div className="col-md-12">
					<hr className="divider"/>
					{i18n('ADMIN_FOOTER_COPYRIGHT')} &copy; 2017 <a href="http://www.deligence.com" target="_blank">{i18n('ADMIN_FOOTER_DELIGENCE')}</a>
				</div>
			</footer>
		)
	}
}