import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

var createReactClass = require('create-react-class');

import FrontHeader from './homeLayouts/Header.jsx';


DefaultTemplate = createReactClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		return {
			result: PanoplyCMSCollections.Sites.findOne()
		};
	},
	componentDidMount: function() {
		require('../imports/style.css')
		// console.log(this.data.result)
		document.title = this.data.result.name;
		if(PanoplyRouter.current().path == '/'){
			if($('meta[name=keywords]').length){
				$('meta[name=keywords]').attr('content', this.data.result.siteMetaKeyword);
			} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.result.siteMetaKeyword
				document.getElementsByTagName('head')[0].appendChild(metakey)
			}
			if($('meta[name=description]').length){
				$('meta[name=description]').attr('content', this.data.result.siteMetaDesc);
			} else {
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.result.siteMetaDesc
				document.getElementsByTagName('head')[0].appendChild(metadesc)
			}
		}
	},
	componentDidUpdate: function() {
		document.title = this.data.result.name;
		if(PanoplyRouter.current().path == '/'){
			if($('meta[name=keywords]').length){
				$('meta[name=keywords]').attr('content', this.data.result.siteMetaKeyword);
			} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.result.siteMetaKeyword
				document.getElementsByTagName('head')[0].appendChild(metakey)
			}
			if($('meta[name=description]').length){
				$('meta[name=description]').attr('content', this.data.result.siteMetaDesc);
			} else {
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.result.siteMetaDesc
				document.getElementsByTagName('head')[0].appendChild(metadesc)
			}
		}
	},
	render() {
		console.log("======", this.props)
		// console.log("********", this.props.content.props.sliderModule)
		return (
			<div>
				<FrontHeader module={this.props.top} topHeaderLeft={this.props.topHeaderLeft} topHeaderRight={this.props.topHeaderRight} siteData={this.data.result} />

				{/*Slider*/}
				{
					this.props.content.props.sliderModule ?
						this.props.content.props.sliderModule.map((data) =>{
							// console.log("======", data)
							if(data.trash == false){
								return(
									<section key={data._id} className="main-slider" data-start-height="600" data-slide-overlay="yes">
										<div className="tp-banner-container">
											<div className="tp-banner">
												{
													data.moduleData ?
														data.moduleData.map((value, index) =>{
															// console.log("=====", value)
															let img = Images.findOne({ _id: value.bgImageId })
															// console.log("----------", img)
															return(
																<ul key={index}>
																	{
																		value.published == true ?
																			<li data-transition="fade" data-slotamount="1" data-masterspeed="1000" data-thumb={img ? img.url() :''} data-saveperformance="off" data-title="">
															          <img src={img ? img.url() :''} alt="" data-bgposition="center top" data-bgfit="cover" data-bgrepeat="no-repeat" />
															          <div className="tp-caption sfr sfb tp-resizeme"
															            data-x="center" data-hoffset="0"
															            data-y="center" data-voffset="-10"
															            data-speed="1500"
															            data-start="0"
															            data-easing="easeOutExpo"
															            data-splitin="none"
															            data-splitout="none"
															            data-elementdelay="0.01"
															            data-endelementdelay="0.3"
															            data-endspeed="1200"
															            data-endeasing="Power4.easeIn">
															            <h2 className="big-title text-center">{value && value.title ? value.title :''}</h2>
															          </div>
															              
															          <div className="tp-caption sfr sfb tp-resizeme"
															            data-x="center" data-hoffset="0"
															            data-y="center" data-voffset="-120"
															            data-speed="1500"
															            data-start="500"
															            data-easing="easeOutExpo"
															            data-splitin="none"
															            data-splitout="none"
															            data-elementdelay="0.01"
															            data-endelementdelay="0.3"
															            data-endspeed="1200"
															            data-endeasing="Power4.easeIn">
															            	<div className="normal-text text-center">{value && value.description ? value.description :''}</div>
															            {/*<!--Slider Separeter Line-->*/}
															              <div className="slider-separeter-line">
															                <div className="line-one"></div>
															                <div className="line-two"></div>
															              </div>
															          </div>

															          <div className="tp-caption sfl sfb tp-resizeme"
															            data-x="center" data-hoffset="0"
															            data-y="center" data-voffset="70"
															            data-speed="1500"
															            data-start="1000"
															            data-easing="easeOutExpo"
															            data-splitin="none"
															            data-splitout="none"
															            data-elementdelay="0.01"
															            data-endelementdelay="0.3"
															            data-endspeed="1200"
															            data-endeasing="Power4.easeIn">
															            <a href={value && value.linkUrl ? value.linkUrl :''} className="white-btn">{value && value.linkUrl ? value.linkTitle :''}</a>
															          </div>
																			</li>
																		: ''
																	}
																</ul>
															);
														})
													:''
												}
											</div>
										</div>
									</section>
								);
							}else{
								return <div></div>
							}
						})
					:''
				}
				{
					this.props.utility.length > 0 ?
						this.props.utility.map((value) => {
							return value;
						})
					: ''
				}
				{
					this.props.feature.length > 0 ?
						this.props.feature.map((value) => {
							return value;
						})
					:''
				}
				{
					this.props.extension.length > 0 ?
						this.props.extension.map((value) =>{
							return value;
						})
					: ''
				}
				<div className="container">
					<div className="row">
						<div className={_.isEmpty(this.props.sidebar) ? "col-sm-12 blog-main" : "col-sm-8 blog-main"}>
							{this.props.content}
						</div>
						<div className={_.isEmpty(this.props.sidebar) ? "":"col-sm-3 col-sm-offset-1 blog-sidebar"}>
							<SidePanel module={this.props.sidebar} />
						</div>
					</div>
				</div>
				<FrontFooter module={this.props.footer} />
			</div>
		)
	}
});


DefaultArticle = createReactClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		Meteor.subscribe('articlesFind')
		return {
			article: PanoplyCMSCollections.Articles.findOne({_id: this.props.id, trash:false}),
			siteData: PanoplyCMSCollections.Sites.findOne()
		}
	},
	componentDidMount: function() {
		if(PanoplyRouter.current().path != '/'){
			if($('meta[name=keywords]').length){
				this.data.article ? this.data.article.metaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.article.metaKeyword) : this.data.siteData && this.data.siteData.siteMetaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.siteData.siteMetaKeyword) :'':'';
			} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.article ? this.data.article.metaKeyword ? this.data.article.metaKeyword :this.data.siteData && this.data.siteData.siteMetaKeyword ? this.data.siteData.siteMetaKeyword:'':''
				document.getElementsByTagName('head')[0].appendChild(metakey)
			}
			if($('meta[name=description]').length){
				this.data.article ? this.data.article.metaDescription != '' ? $('meta[name=description]').attr('content', this.data.article.metaDescription) : this.data.siteData && this.data.siteData.siteMetaDesc != '' ? $('meta[name=description]').attr('content', this.data.siteData.siteMetaDesc) : '' :'';
			} else {
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.article ? this.data.article.metaDescription ? this.data.article.metaDescription:this.data.siteData && this.data.siteData.siteMetaDesc ? this.data.siteData.siteMetaDesc :'':''
				document.getElementsByTagName('head')[0].appendChild(metadesc)
			}
		}
	},
	componentDidUpdate: function() {
		if(PanoplyRouter.current().path != '/'){
			if($('meta[name=keywords]').length){
				this.data.article ? this.data.article.metaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.article.metaKeyword) : this.data.siteData && this.data.siteData.siteMetaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.siteData.siteMetaKeyword) :'':'';
			} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.article ? this.data.article.metaKeyword ? this.data.article.metaKeyword :this.data.siteData && this.data.siteData.siteMetaKeyword ? this.data.siteData.siteMetaKeyword:'':''
				document.getElementsByTagName('head')[0].appendChild(metakey)
			}
			if($('meta[name=description]').length){
				this.data.article ? this.data.article.metaDescription != '' ? $('meta[name=description]').attr('content', this.data.article.metaDescription) : this.data.siteData && this.data.siteData.siteMetaDesc != '' ? $('meta[name=description]').attr('content', this.data.siteData.siteMetaDesc) : '' :'';
			} else {
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.article ? this.data.article.metaDescription ? this.data.article.metaDescription:this.data.siteData && this.data.siteData.siteMetaDesc ? this.data.siteData.siteMetaDesc :'':''
				document.getElementsByTagName('head')[0].appendChild(metadesc)
			}
		}
	},
	render(){
		if(this.data.article){
			if(!_.has(this.data.article, "_id")){
				return <LoadingSpinner />;
			}
			return <ArticleFullView {...this.data.article} />
		}else{
			return (
				<div className="col-md-3 col-md-offset-5">
					<div className="alert alert-danger"><strong>Sorry!</strong> Article not found.</div>
				</div>
			);
		}
	}
})

ArticleFullView = article => {
	let userData = Meteor.users.findOne({_id: article.ownerId})
	return (
		<div className="blog-post">
			<h2 className="blog-post-title">{article && article.title ? article.title.toUpperCase() :''}</h2>
			<p className="blog-post-meta">{article && article.createdAt ? new Date(article.createdAt).toDateString() :''} {userData && userData.profile && userData.profile.username ? 'by' :''} <strong>{userData && userData.profile && userData.profile.username ? userData.profile.username :''}</strong></p>
			<div dangerouslySetInnerHTML={{__html: article && article.article ? article.article :''}} />
			<ShowTags tags={article && article.tags ? article.tags :''} />
		</div>
	);
}

DefaultCategory = createReactClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		Meteor.subscribe('articlesFind');
		return {
			articles: PanoplyCMSCollections.Articles.find({category: this.props.id, trash:false}).fetch()
		}
	},
	render(){
		if(this.data.articles){
			if(!this.data.articles.length){
				return <LoadingSpinner />;
			}
			return (
				<div>
					{
						this.data.articles.map(a => {
							return <ArticleListView key={a._id} {...a} />
						})
					}
				</div>
			)
		}else{
			return (
				<div className="col-md-3 col-md-offset-5">
					<div className="alert alert-danger"><strong>Sorry!</strong> Article not found.</div>
				</div>
			);
		}
	}
})

ArticleListView = article => {
	let userData = Meteor.users.findOne({_id: article.ownerId})

	let route = PanoplyRouter.current().route.path.split('/')
	alias = ''
	if(route[route.length - 1] != ''){
		alias = PanoplyRouter.current().route.path+'/'+article.alias
	} else {
		alias = PanoplyRouter.current().route.path+article.alias
	}
	return (
		<div className="blog-post">
			<h2 className="blog-post-title">{article && article.title ? article.title.toUpperCase() :''}</h2>
			<p className="blog-post-meta">{article && article.createdAt ? new Date(article.createdAt).toDateString() :''} {userData && userData.profile && userData.profile.username ? 'by' : ''} <strong>{userData && userData.profile && userData.profile.username ? userData.profile.username :''}</strong></p>
			<div dangerouslySetInnerHTML={{__html:article && article.article ? article.article.substr(0, 300)+'...':''}} />
			<ShowTags tags={article && article.tags ? article.tags :''} />
			<div className="pull-right"><a href={alias} className="btn btn-default">Read More</a></div>
			<div className="clear-both"></div>
		</div>
	);
}

ShowTags = createReactClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		return {
			tags: PanoplyCMSCollections.Tags.find({}).fetch()
		}
	},
	render: function(){
		return (
			<div className="tag">
				{
					this.props.tags ?
						this.props.tags.map(tag => {
							let t = _.find(this.data.tags, t => { return t._id == tag })
							if(t)
								return <span key={tag} > <a className="label label-info"> {t.title} </a> </span>
							else return ''
						})
					:''
				}
			</div>
		)
	}
})