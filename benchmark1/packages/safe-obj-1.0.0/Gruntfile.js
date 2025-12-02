var tm = require('task-master');

module.exports = function(grunt) {
  tm(grunt);
  grunt.registerTask('mocha', ['mochaTest:test']);
  grunt.registerTask('default', ['jshint:all', 'mocha', 'testem:ci:browser']);
  grunt.registerTask('coverage', ['mochacov:html']);
  grunt.registerTask('travis', ['jshint:all', 'testem:ci:browser', 'mocha', 'mochacov:lcov']);
  grunt.registerTask('browser', ['testem:run:browser']);
};
