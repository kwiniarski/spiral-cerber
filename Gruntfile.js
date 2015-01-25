module.exports = function (grunt) {
  'use strict';

  function readCodeclimateTokenFile() {
    var filename = './codeclimate.txt';
    if (grunt.file.exists(filename)) {
      return grunt.file.read('codeclimate.txt', { encoding: 'utf8' }).trim();
    }
  }

  var CODECLIMATE_REPO_TOKEN = process.env.CODECLIMATE_REPO_TOKEN
    || readCodeclimateTokenFile();

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= props.license %> */\n',

    testDir: './test',
    destDir: './.grunt',
    srcDir: './lib',

    clean: {
      build: '<%= destDir %>'
    },

    copy: {
      testFiles: {
        src: '<%= testDir %>/**',
        dest: '<%= destDir %>/'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', '<%= srcDir %>/**/*.js']
    },

    blanket: {
      srcFiles: {
        files: {
          '<%= destDir %>/lib/': ['./lib']
        }
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          '<%= testDir %>/bootstrap'
        ]
      },
      test: {
        src: ['<%= destDir %>/test/spec/*.js']
      },
      coverageLcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          captureFile: '<%= destDir %>/coverage.lcov',
          quiet: true
        },
        src: ['<%= destDir %>/test/spec/*.js']
      },
      coverageHtml: {
        options: {
          reporter: 'html-cov',
          captureFile: '<%= destDir %>/coverage.html',
          quiet: true
        },
        src: ['<%= destDir %>/test/spec/*.js']
      }
    },

    codeclimate: {
      options: {
        file: '<%= destDir %>/coverage.lcov',
        token: CODECLIMATE_REPO_TOKEN
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-blanket');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-codeclimate');

  grunt.registerTask('build', ['clean', 'copy', 'blanket']);
  grunt.registerTask('test', ['build', 'mochaTest:test', 'clean']);
  grunt.registerTask('coverage', ['build', 'mochaTest:coverageHtml']);
  grunt.registerTask('travis', ['build', 'mochaTest:test', 'mochaTest:coverageLcov', 'codeclimate', 'clean']);
};

