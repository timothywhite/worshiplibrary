module.exports = function(grunt) {
	grunt.initConfig({
		bowerRequirejs: {
			dev: {
				rjsConfig: 'main.js'
			}
		},
		sass: {
	  		dev: { 
				options: {
	     				style: 'expanded'
	     			},
	     			files: {
					'_css/main.css': 'scss/main.scss'
				}
			},
			build: {
				options: {
					style: 'compressed'
				},
				files: {
					'_css/main.css': 'scss/main.scss'
				}
			}
		},
		requirejs: {
	  		build: {
	  			options: {
	  				mainConfigFile: 'main.js',
	  				baseUrl: '',
					include: 'requirejs',
					out: 'app.js',
					name: 'main'
	  			}
	  		}
		},
	  	watch: {
			dev: {
				files: ['scss/*.scss'],
				tasks: ['sass:dev']
			}	  
	  	}	
	});
	
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');	
	
	grunt.registerTask('brjs', ['bowerRequirejs']);
	
	var buildTasks = ['sass:build', 'requirejs:build'];
	grunt.registerTask('default', buildTasks);
	grunt.registerTask('build', buildTasks);

};
