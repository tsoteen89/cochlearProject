module.exports = function(grunt) {

	//All configuration goes here
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					//target file : source file
					"css/style.css": "lib/less/style.less"
				}
			}
		},
		watch: {
			options: {
				livereload: true,
			},
		    // scripts: {
		    //     files: ['lib/js/*.js'],
		    //     tasks: ['concat', 'uglify'],
		    //     options: {
		    //         spawn: false,
		    //     },
		    // },
		    styles: {
		    	files: ['lib/less/*.less'],
		    	tasks: ['less'],
		    	options: {
		    		nospawn: true
		    	}
		    } 
		    // images: {
		    // 	files: ['lib/images/*.{png,jpg,.gif,jpeg}'],
		    // 	tasks: ['imagemin'],
		    // 	options: {
		    // 		spawn: false,
		    // 	}
		    // }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',['watch']);
}
