import extend from './extend'

normalizeKeys = (keys)-> if keys
	output = {}
	if typeof keys isnt 'object'
		output[keys] = true
	else
		keys = Object.keys(keys) if not Array.isArray(keys)
		output[key] = true for key in keys

	return output


newBuilder = (isBase)->
	builder = (target)->
		EXPAND_ARGUMENTS(sources)
		if builder.options.target
			theTarget = builder.options.target
		else
			theTarget = target
			sources.shift()
		
		extend(builder.options, theTarget, sources)
	
	builder.isBase = true if isBase
	builder.options = {}
	Object.defineProperties(builder, modifiers)
	return builder


modifiers = 
	'deep': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.deep = true
		return _

	'own': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.own = true
		return _

	'allowNull': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.allowNull = true
		return _

	'nullDeletes': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.nullDeletes = true
		return _

	'concat': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.concat = true
		return _

	'clone': get: ()->
		_ = if @isBase then newBuilder() else @
		_.options.target = {}
		return _

	'notDeep': get: ()->
		_ = if @isBase then newBuilder() else @
		return (keys)->
			_.options.notDeep = normalizeKeys(keys)			
			return _

	'deepOnly': get: ()->
		_ = if @isBase then newBuilder() else @
		return (keys)->
			_.options.deepOnly = normalizeKeys(keys)			
			return _

	'keys': get: ()->
		_ = if @isBase then newBuilder() else @
		return (keys)->
			_.options.keys = normalizeKeys(keys)			
			return _

	'notKeys': get: ()->
		_ = if @isBase then newBuilder() else @
		return (keys)->
			_.options.notKeys = normalizeKeys(keys)			
			return _

	'transform': get: ()->
		_ = if @isBase then newBuilder() else @
		return (transform)->
			if typeof transform is 'function'
				_.options.globalTransform = transform
			else if transform and typeof transform is 'object'
				_.options.transforms = transform
			
			return _


	'filter': get: ()->
		_ = if @isBase then newBuilder() else @
		return (filter)->
			if typeof filter is 'function'
				_.options.globalFilter = filter
			else if filter and typeof filter is 'object'
				_.options.filters = filter
			
			return _



import {version} from '../package.json'
primaryBuilder = newBuilder(true)
primaryBuilder.version = version
export default primaryBuilder