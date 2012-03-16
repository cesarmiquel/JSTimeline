(function() {
  var RaphaelTestTimeline;

  RaphaelTestTimeline = (function() {

    RaphaelTestTimeline.prototype.viewPort = {
      startDate: new Date(),
      endDate: new Date()
    };

    RaphaelTestTimeline.prototype.jsonUrl = '';

    RaphaelTestTimeline.prototype.paper = {};

    RaphaelTestTimeline.prototype._state = {
      startDate: new Date(),
      endDate: new Date(),
      currentLevel: 5,
      scale: 5
    };

    RaphaelTestTimeline.prototype._config = {
      width: 2000,
      height: 200,
      axisStyle: {
        fill: '#999',
        stroke: '#999',
        "stroke-width": 2
      },
      axisGridColor: {
        fill: '#aaa',
        stroke: '#aaa'
      },
      axisGridWidth: 1,
      axisMainTickStyle: {
        fill: '#8cc700',
        stroke: '#8cc700'
      },
      axisMainTickStyle2: {
        fill: '#0fad00',
        stroke: '#0fad00'
      }
    };

    RaphaelTestTimeline.prototype.data = {};

    function RaphaelTestTimeline(url) {
      if (url == null) url = '';
      this.jsonUrl = url;
    }

    RaphaelTestTimeline.prototype.setLayer = function(layerId, d) {
      this.data[layerId] = d;
      return this._updateState();
    };

    RaphaelTestTimeline.prototype.removeLayer = function(layerId) {
      this.data[layerId] = null;
      return this._updateState();
    };

    RaphaelTestTimeline.prototype.setViewport = function(sd, ed) {
      this.viewPort.startDate = sd;
      return this.viewPort.endDate = ed;
    };

    RaphaelTestTimeline.prototype.redraw = function() {
      console.log('Redrawing timeline.... [' + this.container + ']');
      this.paper = Raphael(this.container, 900, 600);
      this._drawBackground();
      this._drawTimeAxis();
      this._drawPrimaryScale();
      this._drawSecondaryScale();
      return true;
    };

    RaphaelTestTimeline.prototype.reload = function() {
      if (this.jsonUrl === '') return false;
      console.log('Calling URL ' + this.jsonUrl);
      return $.getJSON(this.jsonUrl, {}, this.finishReload, 'json');
    };

    RaphaelTestTimeline.prototype.finishReload = function(response) {
      return console.log(response);
    };

    RaphaelTestTimeline.prototype._updateState = function() {
      var event, eventData, layerId, maxInterval, _i, _len, _ref;
      _ref = this.data;
      for (layerId in _ref) {
        eventData = _ref[layerId];
        for (_i = 0, _len = eventData.length; _i < _len; _i++) {
          event = eventData[_i];
          if (typeof event.start === 'string') event.start = new Date(event.start);
          if (typeof event.end === 'string') event.end = new Date(event.end);
          if (event.start < this._state.startDate) {
            this._state.startDate = event.start;
          }
          if (event.end > this._state.endDate) this._state.endDate = event.end;
        }
      }
      maxInterval = this._state.endDate.getTime() - this._state.startDate.getTime();
      this.viewPort.startDate = this._state.startDate;
      this.viewPort.endDate = this._state.endDate;
      if (maxInterval === 0) maxInterval = 1 * 30 * 24 * 60 * 60 * 1000;
      return this._state.scale = this._config.width / maxInterval;
    };

    RaphaelTestTimeline.prototype._drawTimeAxis = function() {
      var path, pathString, x1, x2, y;
      x1 = 0;
      x2 = this._config.width;
      y = this._config.height / 2;
      pathString = "M" + x1 + "," + y + "L" + x2 + "," + y;
      return path = this.paper.path(pathString).attr(this._config.axisStyle);
    };

    RaphaelTestTimeline.prototype._drawPrimaryScale = function() {
      switch (this._state.currentLevel) {
        case 5:
          return this._drawYearScale();
        case 4:
          return this._drawMonthScale();
        case 2:
          return this._drawDayScale();
      }
    };

    RaphaelTestTimeline.prototype._drawYearScale = function() {
      var c1, c2, c3, path, pathString, x, y, y1, y2, year;
      y1 = 1900 + this.viewPort.startDate.getYear();
      y2 = 1900 + this.viewPort.endDate.getYear();
      for (year = y1; y1 <= y2 ? year <= y2 : year >= y2; y1 <= y2 ? year++ : year--) {
        x = this._toX(new Date(year, 1, 1));
        y = this._config.height / 2;
        pathString = ("M" + x + ",0L" + x + ",") + this._config.height;
        path = this.paper.path(pathString).attr(this._config.axisGridColor).attr("stroke-width", this._config.axisGridWidth);
        this.paper.text(x + 5, y + 20, year).attr("text-anchor", "start").attr(this._config.axisGridColor).attr();
        c1 = this.paper.circle(x, y, 6);
        c1.attr({
          fill: '#fff',
          stroke: '#fff'
        });
        c2 = this.paper.circle(x, y, 4);
        c2.attr(this._config.axisMainTickStyle);
        c2.hover(function(e) {
          return this.attr('r', 6);
        }, function(e) {
          return this.attr('r', 4);
        });
        c3 = this.paper.circle(x, y, 2);
        c3.attr(this._config.axisMainTickStyle2);
      }
      return true;
    };

    RaphaelTestTimeline.prototype._drawSecondaryScale = function() {
      return true;
    };

    RaphaelTestTimeline.prototype._drawBackground = function() {
      return this.paper.image('http://farm8.staticflickr.com/7062/6886659043_69ceea2f71_b.jpg', 0, -200, 900, 600).attr({
        'clip-rect': '0 0 900 200',
        opacity: .1
      });
    };

    RaphaelTestTimeline.prototype._toX = function(date) {
      var delta;
      delta = date.getTime() - this.viewPort.startDate.getTime();
      return parseInt(delta * this._state.scale, 10);
    };

    return RaphaelTestTimeline;

  })();

  window.RaphaelTestTimeline = RaphaelTestTimeline;

}).call(this);
