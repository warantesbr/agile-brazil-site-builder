'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist',
      locales_src: 'src/locales/*.json',
      locales_min: 'src/data/i18n'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates}/{,*/}*.{md,hbs,json,yml}'],
        tasks: ['transpile', 'assemble']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          data: '<%= config.src %>/data/**/*.{json,yml}',
          helpers: ['<%= config.src %>/helpers/**/*.js'],
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          partials: '<%= config.src %>/templates/partials/*.hbs',
          plugins: [
            'assemble-contrib-permalinks',
            'assemble-contrib-i18n'
          ],
          i18n: {
            languages: [
              'en',
              'pt-BR'
            ],
            templates: [
              "src/templates/pages/**/*.hbs"
            ]
          },
          permalinks: {
            structure: ':build_filename',
            patterns: [
              {
                pattern: ':build_filename',
                replacement: function () {
                  var original_file_name = this.filename.replace("-" + this.language + this.ext, this.ext);

                  if ( this.language == 'en' ) return ":language/" + original_file_name;
                  return original_file_name;
                }
              }
            ]
          }
        },
        dest: '<%= config.dist %>/',
        src: "!*.*"
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'src/assets/',
        src: '**',
        dest: '<%= config.dist %>/assets/'
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.src %>/data/i18n/*', '<%= config.dist %>/**/*']

  });

  grunt.loadNpmTasks('assemble');

  grunt.registerTask('server', [
    'build',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'transpile',
    'assemble'
  ]);

  grunt.task.registerTask('transpile', 'Minify / flat JSON translation files', function() {
    var config = grunt.config.data.config,
        path = require('path'),
        dest = config.locales_min,
        flatten = require('flat'),
        files = grunt.file.expand(config.locales_src);

    files.forEach(function(f) {
      var p = dest + '/' + path.basename(f),
          contents = grunt.file.readJSON(f);

      grunt.file.write(p, JSON.stringify(flatten(contents, { safe: true })));
      grunt.log.writeln('File "' + p + '" transpiled.');
    });
  });

  grunt.registerTask('default', [
    'build'
  ]);

};
