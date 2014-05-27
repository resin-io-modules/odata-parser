assert = require('assert')
test = require('./test')

filterString = [1..2000].map((i) -> 'id eq ' + i).join(' or ')
test '/resource?$filter=' + filterString, 'OData', (result) ->
	it 'A filter should be present', ->
		assert.notEqual(result.options.$filter, null)