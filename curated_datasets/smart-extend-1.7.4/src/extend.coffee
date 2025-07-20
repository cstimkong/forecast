isArray = (target)->
	Array.isArray(target)

isObject = (target)->
	target and Object::toString.call(target) is '[object Object]' or isArray(target)

shouldDeepExtend = (options, target, parentKey)->
	if options.deep
		if options.notDeep then not options.notDeep[target] else true

	else if options.deepOnly
		options.deepOnly[target] or parentKey and shouldDeepExtend(options, parentKey)

	# else false


export default extend = (options, target, sources, parentKey)->
	target = {} if not target or typeof target isnt 'object' and typeof target isnt 'function'

	for source in sources when source?
		for key of source
			sourceValue = source[key]
			targetValue = target[key]
			
			continue if sourceValue is target or
						sourceValue is undefined or
						(sourceValue is null and not options.allowNull and not options.nullDeletes) or
						(options.keys and not options.keys[key]) or
						(options.notKeys and options.notKeys[key]) or
						(options.own and not source.hasOwnProperty(key)) or
						(options.globalFilter and not options.globalFilter(sourceValue, key, source)) or
						(options.filters and options.filters[key] and not options.filters[key](sourceValue, key, source))
			
			if sourceValue is null and options.nullDeletes
				delete target[key]
				continue
			if options.globalTransform
				sourceValue = options.globalTransform(sourceValue, key, source)
			if options.transforms and options.transforms[key]
				sourceValue = options.transforms[key](sourceValue, key, source)
	
			switch
				when options.concat and isArray(sourceValue) and isArray(targetValue)
					target[key] = targetValue.concat(sourceValue)
				
				when shouldDeepExtend(options, key, parentKey) and isObject(sourceValue)
					subTarget = if isObject(targetValue) then targetValue else if isArray(sourceValue) then [] else {}
					target[key] = extend(options, subTarget, [sourceValue], key)

				else
					target[key] = sourceValue


	return target







