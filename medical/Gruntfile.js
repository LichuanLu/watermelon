module.exports = function(grunt) {
  
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    less: {
      development: {
        files: {
          "static/dist/debug/stylesheet/ctt-debug.css": "stylesheet/*.less"
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          "static/dist/release/stylesheet/ctt-<%= grunt.template.today('dd-mm-yyyy') %>.css": "static/stylesheet/*.less"
        }
      }
    },

    requirejs: {
        development:{
          options:{
            optimize: "none", // no minification
              out:"static/dist/debug/js/ctt-debug.js",
              mainConfigFile: "static/app/main.js",
              include : 'main',
              logLevel: 0,
              done: function(done, output) {
                var duplicates = require('rjs-build-analysis').duplicates(output);

                if (duplicates.length > 0) {
                  grunt.log.subhead('Duplicates found in requirejs build:');
                  grunt.log.warn(duplicates);
                  done(new Error('r.js built duplicate modules, please check the excludes option.'));
                }

                done();
              }

          }
        
        }
    },


    watch: {
      cssSet: {
        files: ['static/stylesheet/*.less'],
        tasks: ['less:development']
      }

    },

     sync: {
      main: {
        files: [{
          cwd: 'static',
          src: '**',
          dest: '/dev_lic/atc-core/atc-webapp/src/main/webapp/static'
        }]
      }
    },
    concat:{
      css:{
        src: ['static/stylesheet/**/*.css'],
        dest: 'static/dist/debug/stylesheet/ctt-debug-full.css'
      }
    }


  });

  // grunt.loadNpmTasks('grunt-contrib-cssmin');

  //  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-concat');


  // grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['less:development']);
  grunt.registerTask('watchAll', ['watch:cssSet']);
  grunt.registerTask('release',['less:production','requirejs']);
  grunt.registerTask('syncAll',['sync:main']);
  grunt.registerTask('concatCss',['concat:css']);
  grunt.registerTask('requireDebugAll',['requirejs:development']);



};