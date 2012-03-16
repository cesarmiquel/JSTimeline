# Test Raphael + Coffeescript
#
# levels:
#   0 segundo
#   1 hora
#   2 dia
#   3 semana
#   4 mes
#   5 año
#   6 decada
#   7 siglo
#   8 milenio
#

class RaphaelTestTimeline
	
	# Properties ---------------------------------
	viewPort: {
		startDate: new Date()
		endDate: new Date()
	}
	jsonUrl: ''
	paper: {}
	state: {
		# limits of timeline
		startDate: new Date()
		endDate: new Date()
		currentLevel: 5
		scale: 5 # scale factor for time units
	}
	config: {
		# drawing limits
		width: 2000
		height: 200

		# Main Axis
		axisStyle: {fill: '#999', stroke: '#999', "stroke-width": 2}

		# vertical axis
		axisGridColor: { fill: '#aaa', stroke: '#aaa' }
		axisGridWidth: 1

		axisMainTickStyle: {fill: '#8cc700', stroke: '#8cc700'}
		axisMainTickStyle2: {fill: '#0fad00', stroke: '#0fad00'}
	}

	# An array of timelines to show
	data: {}

	# Methods ---------------------------------

	# constructor
	constructor: (url = '') ->
		@jsonUrl = url

  # set data
	setLayer: (layerId, d) ->
		@data[layerId] = d
		@_updateState()

	# remove layer data
	removeLayer: (layerId) ->
		@data[layerId] = null
		@_updateState()

	# manage viewport
	setViewport: (sd, ed) ->
		@viewPort.startDate = sd
		@viewPort.endDate = ed

	# redraw timeline
	redraw: () ->
		console.log 'Redrawing timeline.... [' + @container + ']'
		@paper = Raphael @container, 900, 600

		@_drawBackground()
		@_drawTimeAxis()
		@_drawPrimaryScale()
		@_drawSecondaryScale()

		return true

	# Reload data from URL
	reload: () ->
		return false if @jsonUrl == ''

		console.log 'Calling URL ' + @jsonUrl
		$.getJSON @jsonUrl, {}, @finishReload, 'json'

	finishReload: (response) ->
		console.log response

	_updateState: () ->
		# determine timeline limits
		for layerId, eventData of @data
			for event in eventData

				# determinar limites
				if typeof event.start is 'string'
					event.start = new Date(event.start)
				if typeof event.end is 'string'
					event.end = new Date(event.end)

				if event.start < @state.startDate
					@state.startDate = event.start
				if event.end > @state.endDate
					@state.endDate = event.end

		maxInterval = (@state.endDate.getTime() - @state.startDate.getTime())

		# Show all timeline

		@viewPort.startDate = @state.startDate
		@viewPort.endDate   = @state.endDate

		if (maxInterval == 0)
			maxInterval = 1 * 30 * 24 * 60 * 60 * 1000
		@state.scale = @config.width / maxInterval

	# Drawing functions
	_drawTimeAxis: () ->
		x1 = 0
		x2 = @config.width
		y  = @config.height / 2
		pathString = "M#{x1},#{y}L#{x2},#{y}"
		path = @paper.path( pathString ).attr( @config.axisStyle )

	# Draw main scale
	_drawPrimaryScale: () ->
		switch @state.currentLevel
			when 5
				@_drawYearScale()
			when 4
				@_drawMonthScale()
			when 2
				@_drawDayScale()

	_drawYearScale: () ->
		y1 = 1900 + @viewPort.startDate.getYear()
		y2 = 1900 + @viewPort.endDate.getYear()
		for year in [y1..y2]
			x = @_toX(new Date(year,1,1))
			y = @config.height / 2

			# Vertical grid lines
			pathString = "M#{x},0L#{x}," + @config.height
			path = @paper.path( pathString )
				.attr( @config.axisGridColor )
				.attr( "stroke-width", @config.axisGridWidth )
			
			# Year text
			@paper.text(x + 5, y + 20, year)
				.attr( "text-anchor", "start")
				.attr( @config.axisGridColor )
				.attr()

			# Year mark
			c1 = @paper.circle(x, y, 6)
			c1.attr( { fill: '#fff', stroke: '#fff' } )
			c2 = @paper.circle(x, y, 4)
			c2.attr( @config.axisMainTickStyle )
			c2.hover(
				(e) -> this.attr('r', 6),
				(e) -> this.attr('r', 4)
			)
			c3 = @paper.circle(x, y, 2)
			c3.attr( @config.axisMainTickStyle2 )
			
		return true

	# Draw secondary scale
	_drawSecondaryScale: () ->
		return true

	_drawBackground: () ->
		@paper.image( 'http://farm8.staticflickr.com/7062/6886659043_69ceea2f71_b.jpg', 0, -200, 900, 600 )
			.attr({'clip-rect': '0 0 900 200', opacity: .1})

	_toX: (date) ->
		delta = date.getTime() - @viewPort.startDate.getTime()
		return parseInt( delta * @state.scale, 10)

# TODO ver cual es la manera correcta de exportar la clase
window.RaphaelTestTimeline = RaphaelTestTimeline

# vim: se ts=2 sw=2 ai: