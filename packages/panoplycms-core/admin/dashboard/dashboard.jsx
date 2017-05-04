import React, { Component } from 'react';
import { render } from 'react-dom';

import Heading from '../common/heading.jsx';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <div className="col-md-10 content">
          <Heading data={'Dashboard'} />
          <div className="panel-body">
            <div className="row">
              <div className="col-xs-3 col-md-3">
                <div className="dt_box">
                  <i className="fa fa-television"></i> 
                  <div><a href={FlowRouter.path('manageMenu')}>Menu Manager</a></div>
                </div>
              </div>
              <div className="col-xs-3 col-md-3">
                <div className="dt_box">
                  <i className="fa fa-building"></i> 
                  <div><a href={FlowRouter.path('listCategories')}>Category Manager</a></div>
                </div>
              </div>
              <div className="col-xs-3 col-md-3">
                <div className="dt_box">
                  <i className="fa fa-pencil"></i> 
                  <div><a href={FlowRouter.path('articles')}>Article Manager</a></div>
                </div>
              </div>
              <div className="col-xs-3 col-md-3">
                <div className="dt_box">
                  <i className="fa fa-sliders"></i> 
                  <div><a href={FlowRouter.path('modulesManager')}>Module Manager</a></div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    );
  }
}