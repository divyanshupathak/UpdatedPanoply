Meteor.startup(function() {
	PanoplyCMSRegisterPackage({
		"name" : "template",
		"templates": {
			name: "Default Template",
			packageName: "deligencetechnologies:default-template",
			layoutImage: "public/templateLayout.jpg",
			active: true,
			layout: "DefaultTemplate",
			notFound:'DefaultNotFound',
			offline:'DefaultOffline',
			categoryView: "DefaultCategory",
			articleView: "DefaultArticle",
			positions: ['topHeaderLeft', 'topHeaderRight', 'mainHeaderLeft', 'mainHeaderRight', 'top', 'showcase', 'sidebar', 'utility', 'feature', 'mainTop', 'fullWidth', 'mainbody', 'contentBottom', 'extension', 'mainBottom', 'bottom', 'footer', 'mainFooterLeft', 'mainFooterRight', 'copyright']
		}
	})
});