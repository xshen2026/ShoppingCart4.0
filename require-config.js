requirejs.config({
	baseUrl:'lib',
	path: {
		'angular': 'angular',
		'angular-ui-router': 'angular-ui-router',
		'draganddrop':'draganddrop',
		'google-maps': 'google-maps',
		'vs-google-autocomplete':'vs-google-autocomplete'
	},
	shim: {
		'angular': {
            exports: 'angular'
        },
		'angular-ui-router':[
			'angular'
		],
		'draganddrop':[
			'angular'
		],
		'vs-google-autocomplete':[
			'angular',
			'google-maps'
		]
	}
});

/*requirejs(['../app1']);*/

require([/*'angular',*/ '../app1'],
    function () {
        angular.bootstrap(document, ['ShoppingCart']);
    }
);