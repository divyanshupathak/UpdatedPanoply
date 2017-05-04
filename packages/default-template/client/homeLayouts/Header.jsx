import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

export default class FrontHeader extends Component {
	onClick(){
		PanoplyRouter.go('/')
	}
	render() {
		// console.log("---------", this.props)
		let img = Images.findOne({ _id:this.props.siteData.logoId })
		return(
			<header className="header">
				{/*<div className="blog-masthead">*/}
					<div className="container">
						<div className="top-head">
					    <div className="row">
					      <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
					        <div className="top-left">
					        	{
					        		this.props.topHeaderLeft ?
					        			this.props.topHeaderLeft.map((topHeader) => {
					        				return topHeader;
					        			})
					        		: ''
					        	}
					        </div>
					      </div>
					      <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
					        <div className="top-right clearfix">
						        {
						        	this.props.topHeaderRight ?
						        		this.props.topHeaderRight.map((topHeader) => {
						        			return topHeader;
						        		})
						        	: ''
						        }
					        </div>
					      </div>
					    </div>
					  </div>
						<div className="row">
							<div className="col-sm-4">
								<div className="logo">
									{
										img ?
											<img height="50px" src={img.url()} />
										:
											<div>
												<h2 style={{marginTop: "5px"}} className="blog-title" onClick={this.onClick.bind(this)}>{this.props.siteData?this.props.siteData.name:''}</h2>
											</div>
									}
								</div>
							</div>
							<nav className="nav blog-nav pull-right" id="main-nav">
								{
									this.props.module ?
										this.props.module.map(m => {
											return m;
										})
									: ''
								}
							</nav>
						</div>
					</div>
				{/*</div>*/}
			</header>
		);
	}
}

/*FrontHeader = (data) => {
	return(
		<div className="blog-masthead">
			<div className="container">
				<nav className="nav blog-nav" id="main-nav">
					{
						data.module ?
							data.module.map(m => {
								return m;
							})
						: ''
					}
				</nav>
			</div>
		</div>
	);
}*/