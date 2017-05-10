import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

var createReactClass = require('create-react-class');

import FrontHeader from './homeLayouts/Header.jsx';
import FrontFooter from './homeLayouts/Footer.jsx';


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
		return (
			<div>
				<FrontHeader module={this.props.mainHeaderRight} topHeaderLeft={this.props.topHeaderLeft} topHeaderRight={this.props.topHeaderRight} siteData={this.data.result} />
				
				<div className="container">
					<div className="row">
						<div className={_.isEmpty(this.props.sidebar) ? "col-sm-12 blog-main" : "col-sm-8 blog-main"}>
							{ this.props.content }
						</div>
						<div className={_.isEmpty(this.props.sidebar) ? "":"col-sm-3 col-sm-offset-1 blog-sidebar"}>
							<SidePanel module={this.props.sidebar} />
						</div>
					</div>
				</div>

				<FrontFooter mainFooterLeft={this.props.mainFooterLeft} mainFooterRight={this.props.mainFooterRight} copyright={this.props.copyright} />
			</div>
		)
	}
});

ModuleOnly = createReactClass({
	render(){
		console.log("-------->>>", this.props)
		return(
			<div>
				{
					this.props.modules.showcase && this.props.modules.showcase.length > 0 ?
						this.props.modules.showcase.map((value) => {
							return value;
						})
					: ''
				}
				{
					this.props.modules.utility && this.props.modules.utility.length > 0 ?
						this.props.modules.utility.map((value) => {
							return value;
						})
					: ''
				}
				{
					this.props.modules.feature && this.props.modules.feature.length > 0 ?
						this.props.modules.feature.map((value) => {
							return value;
						})
					: ''
				}
				{
					this.props.modules.extension && this.props.modules.extension.length > 0 ?
						this.props.modules.extension.map((value) => {
							return value;
						})
					: ''
				}
				{
					this.props.modules.bottom && this.props.modules.bottom.length > 0 ?
						this.props.modules.bottom.map((value) => {
							return value;
						})
					: ''
				}
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
			return <ArticleFullView articles={this.data.article} modules={this.props.modules} />
		}else{
			return (
				<div className="col-md-3 col-md-offset-5">
					<div className="alert alert-danger"><strong>Sorry!</strong> Article not found.</div>
				</div>
			);
		}
	}
})

ArticleFullView = data => {
	// console.log(data)
	let userData = Meteor.users.findOne({_id: data.ownerId})
	return (
		<div>
			<div className="blog-post">
				<h2 className="blog-post-title">{data.articles && data.articles.title ? data.articles.title.toUpperCase() :''}</h2>
				<p className="post-meta-data">{data.articles && data.articles.createdAt ? new Date(data.articles.createdAt).toDateString() :''} {userData && userData.profile && userData.profile.username ? 'by' :''} <strong>{userData && userData.profile && userData.profile.username ? userData.profile.username :''}</strong></p>
				<br/>
				<div dangerouslySetInnerHTML={{__html: data.articles && data.articles.article ? data.articles.article :''}} />
				<ShowTags tags={data.articles && data.articles.tags ? data.articles.tags :''} />
			</div>
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
		if(this.data.articles && this.data.articles.length){
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

ArticleListView = data => {
	let userData = Meteor.users.findOne({_id: data.ownerId})

	let route = PanoplyRouter.current().route.path.split('/')
	alias = ''
	if(route[route.length - 1] != ''){
		alias = PanoplyRouter.current().route.path+'/'+data.alias
	} else {
		alias = PanoplyRouter.current().route.path+data.alias
	}
	return (
		<div className="blog-post">
			<h2 className="blog-post-title">{data && data.title ? data.title.toUpperCase() :''}</h2>
			<p className="blog-post-meta">{data && data.createdAt ? new Date(data.createdAt).toDateString() :''} {userData && userData.profile && userData.profile.username ? 'by' : ''} <strong>{userData && userData.profile && userData.profile.username ? userData.profile.username :''}</strong></p>
			<div dangerouslySetInnerHTML={{__html:data && data.article ? data.article.substr(0, 300)+'...':''}} />
			<ShowTags tags={data && data.tags ? data.tags :''} />
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
								return <span key={tag}><a className="label label-info"> {t.title} </a></span>
							else return ''
						})
					:''
				}
			</div>
		)
	}
})

class LoadingSpinner extends Component {
	render(){
		return <div>Loading...</div>
	}
}