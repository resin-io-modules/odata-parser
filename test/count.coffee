assert = require 'assert'

module.exports = (test) ->
	describe 'Count', ->
		test '$count=true', 'OData', (result) ->
			it 'count option should be specified with value true', ->
				assert.equal(result.options.$count, true)

		test '$count=false', 'OData', (result) ->
			it 'count option should be specified with value false', ->
				assert.equal(result.options.$count, false)