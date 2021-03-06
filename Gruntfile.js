/*global module:false*/
module.exports = function(grunt) {

	// load all grunt tasks
	require( 'load-grunt-tasks' )( grunt );

	// Project configuration.
	grunt.initConfig({

		config: grunt.file.readJSON( 'config.json' ),

		clean: {
			default: {
				src: [ 
					'<%= config.dist %>'
				]
			},
		},

		copy: {
			default: {
				expand: true,
				dest: '<%= config.dist %>/',
				cwd: '<%= config.src %>/',
				src: [ 
					'**',
					'!icons/**',
					'!scripts/**',
					'!styles/**',
				]
			},
		},

		webfont: {
			default: {
				src: '<%= config.src %>/icons/*.svg',
				dest: '<%= config.dist %>/fonts/',
				destCss: '<%= config.src %>/styles/core/',
				options: {
					engine: 'node',
					font: 'icons',
					stylesheet: 'less',
					relativeFontPath: './fonts/',
					destHtml: '<%= config.src %>/icons/'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require( 'jshint-stylish' )
			},
			default: [
				'Gruntfile.js',
				'<%= config.src %>/scripts/**/*.js'
			]
		},

		concat: {
			default: {
				src: [
					'<%= config.src %>/scripts/**/*.js',
				],
				dest: '<%= config.dist %>/js/scripts.js'
			}
		},

		bower_concat: {
			default: {
				dest: '<%= config.dist %>/js/libs.js',
				dependencies: {
					'jQuery.mmenu': 'jquery'
				},
				exclude: [
					'jquery'
				],
			    mainFiles: {}
			}
		},

		less: {
			development: {
				files: {
					'<%= config.dist %>/style.css': '<%= config.src %>/styles/style.less'
				}
			},
			acceptance: {
				options: {
					cleancss: true,
				},
				files: {
					'<%= config.dist %>/style.css': '<%= config.src %>/styles/style.less'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: [
					'Android 2.3',
					'Android >= 4',
					'Chrome >= 20',
					'Firefox >= 24', // Firefox 24 is the latest ESR
					'Explorer >= 8',
					'iOS >= 6',
					'Opera >= 12',
					'Safari >= 6'
				]
			},
			development: {
				src: '<%= config.dist %>/style.css'
			},
			acceptance: {
				src: '<%= config.dist %>/style.css'
			},
		},

		uglify: {
			development: {
				files: {
					'<%= config.dist %>/js/libs.js': '<%= config.dist %>/js/libs.js'
				}
			},
			acceptance: {
				files: {
					'<%= config.dist %>/js/libs.js': '<%= config.dist %>/js/libs.js',
					'<%= config.dist %>/js/scripts.js': '<%= config.dist %>/js/scripts.js'
				}
			},
		},

		watch: {
			development: {
				files: [
					'Gruntfile.js',
					'<%= config.src %>/**/*.*',
				],
				tasks: [ 
					'prepare:development'
				],
				options: {
					livereload: true
				}
			}
		},

		open: {
			development: {
				path: '<%= config.local %>'
			}
		},

		'ftp-deploy': {
			acceptance: {
				auth: {
					host: 'ftpcluster.loopia.se',
					port: 21,
					authKey: 'key',
				},
				src: '<%= config.dist %>',
				dest: '/acceptance.morencykel.se/public_html/wp-content/themes/morencykel/',
				exclusions: [ '<%= config.dist %>/**/.DS_Store' ]
			}
		}
	});

	grunt.registerTask( 'default', [

		'clean:default',
		'copy:default',
		'webfont:default',
		'jshint:default',
		'concat:default',
		'bower_concat:default',
	]);

	grunt.registerTask( 'prepare:development', [

		'default',
		'less:development',
		'autoprefixer:development',
		// 'uglify:development',
	]);

	grunt.registerTask( 'development', [

		'prepare:development',
		'open:development',
		'watch:development'
	]);

	grunt.registerTask( 'acceptance', [

		'default',
		'less:acceptance',
		'autoprefixer:acceptance',
		'uglify:acceptance',
		'ftp-deploy:acceptance',
	]);

	// grunt.registerTask( 'production', [

	// 	'default',
	// 	'less:acceptance',
	// 	'autoprefixer:acceptance',
	// 	'uglify:acceptance',
	//  'ftp-deploy:production',
	// ]);
};