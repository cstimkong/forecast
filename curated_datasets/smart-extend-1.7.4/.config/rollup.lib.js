require('coffeescript/register')
import pkg from '../package.json'

function config({input, output, minify}) {
	return {
		input: input,
		output: [].concat(output).map((config)=> Object.assign({name:pkg.name, compact:true}, config)),
		plugins: [
			require('rollup-plugin-coffee-script')(),
			require('rollup-plugin-node-resolve')({
				extensions: ['.js', '.coffee'],
				jsnext: true,
				preferBuiltins: true,
				browser: true
			}),
			require('rollup-plugin-commonjs')({extensions: ['.js', '.coffee']}),
			require('rollup-plugin-json')(),
			require('rollup-plugin-babel')({extensions: ['.js', '.coffee']}),
			require('./transforms/macros')(),
			(minify ? require('rollup-plugin-terser').terser() : undefined)
		]
	}
}


module.exports = [
	config({
		input: 'src/index.coffee',
		output: [
			{file:pkg.main, format:'umd'},
			{file:pkg.module, format:'esm'},
			{file:pkg.module.replace('esm', 'debug'), format:'umd', sourcemap:'inline'}
		]
	}),
	config({
		input: 'src/index.coffee',
		minify: true,
		output: [
			{file:pkg.unpkg, format:'umd'}
		]
	})
]
