module.exports = (file, options, file_, content)->
	if options._flags.debug
		return content
	else
		output = content
		replacements.forEach (replacement)->
			source = replacement[0]
			dest = replacement[1]

			output = output.replace(source, dest)
		return output


replacements = [
	[/isBase/g, 'ba']
	[/options/g, 'op']
	[/globalTransforms/g, 'gT']
	[/transforms/g, 'tr']
	[/globalFilters/g, 'gF']
	[/filters/g, 'fi']
	[/target/g, 'TA']
]
