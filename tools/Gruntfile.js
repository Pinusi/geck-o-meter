module.exports = function( grunt ) {

	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	grunt.initConfig({

		//Folders
		folder: {
			development: '../src',
			distribution: '../dist',
			test: '../spec',
			temporary: '.tmp'
		},

		gruntConfig: grunt.file.readJSON('gruntConfig.json'),
		pkg: grunt.file.readJSON('package.json'),

		/**
		* Watch
		* https://github.com/gruntjs/grunt-contrib-watch
		*/
		watch: {
			scss: {
				files: [ "<%= folder.development %>/sass/{,*/,**/}*.scss" ],
				tasks: [ "sass"]
			},
			styles: {
				files: [
					'gruntConfig.json',
					'<%= folder.temporary %>/{,*/}*.css'],
				tasks: ['cssmin']
			},
			js: {
				files: [ 
					"<%= folder.development %>/app/js/{,*/,**/}*.js",
					'gruntConfig.json' 
				],
				tasks: [ "concat" ]
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['build']
			},
			fonts:{
				files: ['<%= folder.development %>/assets/fonts/{,*/}*.*'],
				tasks: ['copy:fonts']
			},
			templates:{
				files: ['<%= folder.development %>/app/templates/{,*/,**/}*.html'],
				tasks: ['jst','concat']
			},
			html:{
				files: ['<%= folder.development %>/index.html'],
				tasks: ['copy:html']
			},
			images:{
				files: ['<%= folder.development %>/assets/images/{,*/}*.{png,jpg,gif,svg}'],
				tasks: ['copy:images']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= folder.distribution %>/index.html',
					'<%= folder.distribution %>/{,*/,**/}*.*'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 5000,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					open: true,
					base: ['<%= folder.distribution %>'],
				}
			}
		},

		concat: {
			options: {
				separator:  grunt.util.linefeed + ';' + grunt.util.linefeed,
			},
			app: {
				src: ['<%= gruntConfig.js.app %>'],
				dest: '<%= folder.distribution %>/js/main.min.js',
			},
			vendor:{
				src: '<%= gruntConfig.js.vendor %>',
				dest: '<%= folder.distribution %>/js/vendor.min.js'
			},
			spec:{
				src: '<%= gruntConfig.js.test %>',
				dest: '<%= folder.test %>/vendor/vendor_test.min.js'
			}
		},

		cssmin: {
			build:{
				files: {
					'<%= folder.distribution %>/css/main.min.css': [
						'<%= gruntConfig.css.vendor %>',
						'<%= folder.temporary %>/{,*/}*.css'
					]
				}
			},
			test:{
				files: {
					'<%= folder.test %>/vendor/vendor_test.min.css': [
						'<%= gruntConfig.css.test %>'
					]
				}
			}
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.development %>/assets',
					dest: '<%= folder.distribution %>/assets',
					src: ['fonts/{,*/,**/}*.*']
				}]
			},
			images: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.development %>/assets',
					dest: '<%= folder.distribution %>/assets',
					src: ['images/{,*/,**/}*.*']
				}]
			},
			html: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.development %>',
					dest: '<%= folder.distribution %>',
					src: ['index.html']
				}]
			},
			api: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.development %>',
					dest: '<%= folder.distribution %>',
					src: ['api/{,*/,**/}*.*']
				}]
			},
			favicons: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= folder.development %>',
					dest: '<%= folder.distribution %>',
					src: ['favicon.ico']
				}]
			}
		},

		jst: {
			compile: {
				options: {
					prettify: true,
					namespace: "GEOM.Templates",
					processName: function(filepath) {
						return filepath.replace("../src/app/","");
					},
					processContent: function(src) {
						return src.replace(/(^\s+|\s+$)/gm, '');
					}
				},
				files: {
					"<%= folder.temporary %>/templates.js": ["<%= folder.development %>/app/templates/{,*/,**/}*.html"]
				}
			}
		},

		sass: {
			dist: {
				options: {
					trace : true,
					style : "compressed",
					"sourcemap=none" : ""
				},
				files: {
					"<%= folder.temporary %>/main.css": "<%= folder.development %>/sass/main.scss"
				}
			}
		},

		clean: {
			build: {
				src: [
					'<%= folder.distribution %>',
					'<%= folder.temporary %>'
				]
			},
			options:{
				force: true
			}
		}

	});


	/**
	* tasks
	*/
	grunt.registerTask( "default", [
		'build',
		'connect:livereload',
		"watch"
	]);

	grunt.registerTask('build', [
		'clean:build',
		'sass',
		'jst',
		'cssmin',
		'concat',
		'copy'
	]);

};