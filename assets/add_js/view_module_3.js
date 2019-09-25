//function 21
function makeEndLines(lines, options){
    console.log(`called function  #21  ${arguments.callee.name}`)
  
    var pointRadiusLarge = options.pointRadiusLarge,
        lineLength = pointRadiusLarge * 2 + 10,
        endLines = [],
        yHash = {};
        
    _.each(lines, function(line, i){
      var firstPoint = line.points[0],
          lastPoint = line.points[line.points.length-1],
          lineClassName = helper.parameterize('line-'+line.label) + ' end-line',
          pointClassName = helper.parameterize('point-'+line.label) + ' end-line',
          lineStart = { className: lineClassName + ' start-line', type: 'symbol', points: [] },
          lineEnd = { className: lineClassName, type: 'symbol', points: [] },
          
          fpId = 'p'+firstPoint.y,
          lpId = 'p'+lastPoint.y;
      
      // keep track of existing y points
      if (yHash[fpId]!==undefined) {
        yHash[fpId]++;
      } else {
        yHash[fpId] = 0;
      }
      if (yHash[lpId]!==undefined) {
        yHash[lpId]++;
      } else {
        yHash[lpId] = 0;
      }
      
      // add start line
      lineStart.points.push({
        x: firstPoint.x,
        y: firstPoint.y - lineLength - yHash[fpId]%2*lineLength, // stagger y's that are next to each other
        symbol: line.symbol,
        pointColor: line.color,
        pointRadius: pointRadiusLarge,
        className: pointClassName + ' symbol'
      });
      lineStart.points.push({
        x: firstPoint.x,
        y: firstPoint.y,
        className: pointClassName
      });
          
      // make end line
      lineEnd.points.push({
        x: lastPoint.x,
        y: lastPoint.y,
        className: pointClassName
      });
      lineEnd.points.push({
        x: lastPoint.x,
        y: lastPoint.y + lineLength + yHash[lpId]%2*lineLength, // stagger y's that are next to each other
        symbol: line.symbol,
        pointColor: line.color,
        pointRadius: pointRadiusLarge,
        className: pointClassName + ' symbol'
      });
      
      // add end lines
      endLines.push(lineStart, lineEnd);      
      
    });
    
    return endLines;
  }

  //function 22

  function makeLegend(width, lines, options){    
    console.log(`called function  #22  ${arguments.callee.name}`)
  
    var // options
        canvasWidth = width,
        canvasPaddingX = options.padding[0],
        canvasPaddingY = options.padding[1],
        title = options.title,
        pointRadius = options.pointRadius,
        pointRadiusLarge = options.pointRadiusLarge,
        borderWidth = options.borderWidth,        
        columns = lines.length > options.legend.columnThreshold ? options.legend.columns : 1,
        legendWidth = options.legend.columnWidth * columns,     
        padding = options.legend.padding,
        bgColor = options.legend.bgColor,
        titleFontSize = options.legend.titleFontSize,
        titleMaxLineChars = options.legend.titleMaxLineChars,
        titleLineHeight = options.legend.titleLineHeight,
        fontSize = options.legend.fontSize,
        lineHeight = options.legend.lineHeight,
        gridUnit = options.legend.gridUnit,
        // calculations
        columnWidth = Math.floor((legendWidth-padding*2)/columns),        
        titleLines = this.getTitleLines(title, titleMaxLineChars),        
        x1 = legendWidth >= canvasWidth/2 ? canvasWidth - legendWidth - padding - borderWidth*2 : canvasWidth/2,
        y1 = canvasPaddingY,
        lineCount = lines.length,
        height = padding *2 + lineHeight*Math.ceil(lineCount/columns) + titleLineHeight*titleLines.length,        
        // initializers       
        legend = {dots: [], labels: [], lines: [], rects: []};
    
    // break up lines into columns
    var columnLines = [],
        perColumn = Math.floor(lineCount/columns),
        remainder = lineCount%columns,
        lineIndex = 0;
    _.times(columns, function(i){
      var start = lineIndex,
          end = lineIndex+perColumn;
      // add remainder to first column
      if (i===0)  end += remainder;
      columnLines.push(
        lines.slice(start, end)
      );
      lineIndex = end;
    });
    
    // create rectangle
    legend.rects.push({
      width: legendWidth,
      height: height,
      rectX: x1,
      rectY: y1,
      pointColor: bgColor,
      type: "legend"
    });
    
    // add legend padding
    x1 += padding;
    y1 += padding;
    
    // add title
    _.each(titleLines, function(titleLine, i){
      legend.labels.push({
        text: titleLine,
        anchor: "start",
        labelX: x1,
        labelY: y1,
        fontSize: titleFontSize,
        type: "legendTitle"
      });
      y1 += titleLineHeight;
    });
    
    // add a space
    y1 += gridUnit;
    
    // loop through columns
    _.each(columnLines, function(columnLine, c){
      
      var colOffset = columnWidth * c,
          y2 = y1;
      
      // loop through lines
      _.each(columnLine, function(line, i){
        
        var lineClassName = helper.parameterize('line-'+line.label) + ' legend',
            pointClassName = helper.parameterize('point-'+line.label) + ' legend';
        
        // add symbol dot
        legend.dots.push({
          x: colOffset+x1+pointRadiusLarge, y: y2,
          pointColor: line.color,
          symbol: line.symbol,
          pointRadius: pointRadiusLarge,
          className: pointClassName
        });
        // add symbol label
        legend.labels.push({
          text: line.symbol,
          labelX: colOffset+x1+pointRadiusLarge,
          labelY: y2+1,
          symbol: line.symbol,
          className: pointClassName
        });
        
        // add line
        legend.lines.push({
          color: line.color,
          type: "legend",
          className: lineClassName,
          points: [
            {x: colOffset+x1+pointRadiusLarge*2, y: y2, className: pointClassName},
            {x: colOffset+x1+pointRadiusLarge*2+gridUnit*4, y: y2, className: pointClassName}
          ]
        });
        // add line dot
        legend.dots.push({
          x: colOffset+x1+pointRadiusLarge*2+gridUnit*2, y: y2,
          pointRadius: pointRadius,
          className: pointClassName
        });      
        // add line label
        legend.labels.push({
          text: line.label + " Line",
          labelX: colOffset+x1+pointRadiusLarge*2+gridUnit*5,
          labelY: y2,
          fontSize: fontSize,
          anchor: "start",
          type: "legend",
          className: pointClassName
        });
        
        y2+=lineHeight;
      });
      
      
    });
    
    return legend;
    
  }


  //function 23

  function makeLines(stations, width, height, options){
    console.log(`called function  #23  ${arguments.callee.name}`)
  
    var that = this,
        // options
        paddingX = options.padding[0],
        paddingY = options.padding[1],
        colors = options.colors,
        pathTypes = options.pathTypes,
        offsetWidth = options.offsetWidth,        
        cornerRadius = options.cornerRadius,
        minXDiff = options.minXDiff,
        pointRadius = options.pointRadius,
        hubSize = options.hubSize,
        // calculations
        activeW = width - paddingX*2,
        activeH = height - paddingY*2,
        boundaries = {minX: paddingX, minY: paddingY, maxX: width-paddingX, maxY: height-paddingY},
        stationCount = stations.length,
        yUnit = Math.floor(activeH/stationCount),
        // initializers
        lines = [],
        prevLines = [];
    
    // ensure y-unit is 2 or more
    if (yUnit<2) yUnit = 2;
    options.yUnit = yUnit;
    
    // loop through stations
    _.each(stations, function(station, i){
      var nextY = paddingY + i * yUnit, // next available yUnit
          nextX = that.getNextX(boundaries, i, stationCount, activeW, minXDiff), // random x
          lineCount = station.lines.length,
          firstX = nextX;
          
      // loop through station's lines
      _.each(station.lines, function(lineLabel, j){
        // if line already exists
        var foundLine = _.findWhere(lines, {label: lineLabel}),
            prevPoint = false, 
            lineClassName = helper.parameterize('line-'+lineLabel) + " primary",
            pointClassName = helper.parameterize('point-'+lineLabel),
            newPoint;
        
        // retieve previous point
        if (foundLine) {
          prevPoint = _.last(foundLine.points); 
        }
        
        // if line is in previous lines, it will be straight
        if (prevLines.indexOf(lineLabel)>=0 && prevPoint) {
          nextX = prevPoint.x;
        
        // if line already exists, make sure X is within 20% of previous X
        } else if (prevPoint) {                   
          nextX = that.getNextX(boundaries, i, stationCount, activeW, minXDiff, prevPoint);
        }
        
        // init new point
        newPoint = {
          id: _.uniqueId('p'),
          x: nextX,
          y: nextY,
          lineLabel: lineLabel,
          pointRadius: pointRadius,
          className: pointClassName + " station"
        };
            
        // for first line, just add target point
        if (j===0) {
          firstX = newPoint.x;
          newPoint.label = station.label; // only the target point of the first line gets label
          newPoint.className += " primary";
          if (lineCount >= hubSize) {
            newPoint.hubSize = lineCount;
            newPoint.className += " hub";
          }          
          
        // for additional new lines, place first point next to the first line's target point plus offset
        } else {
          newPoint.x = firstX + j*offsetWidth;
          newPoint.className += " secondary";
        }
        
        // line already exists
        if (foundLine){
          var transitionPoints = [],
              lastPoint;          

          // retrieve transition points
          transitionPoints = that.getPointsBetween(prevPoint, newPoint, pathTypes, cornerRadius, options);          
          
          // add direction2 to previous point
          if (transitionPoints.length > 0 && foundLine.points.length > 0) {
            lastPoint = _.last(foundLine.points);
            lastPoint.direction2 = transitionPoints[0].direction1;
          }

          // add transition points          
          _.each(transitionPoints, function(tp){
            tp.className = pointClassName;
            foundLine.points.push(tp);
          });
          
          // update last point with meta data
          lastPoint = _.last(foundLine.points);
          lastPoint = _.extend(lastPoint, newPoint);          
          
        // line does not exist, add a new one
        } else {          
          var color = that.getColor(lines, colors),
              newLine = {
                label: lineLabel,
                color: color.hex,
                symbol: that.getSymbol(lineLabel, lines),
                className: lineClassName,
                points: []            
              };         
          // add point to line, add line to lines
          newLine.points.push(newPoint);
          lines.push(newLine);
        }
        
      });
      
      prevLines = station.lines;     
    });
    
    // console.log(lines)
    
    return lines;
  }

  //function 24
  function processStations(stations)
  {
    console.log(`called function  #24  ${arguments.callee.name}`)
  
    var that = this,
        lineLabels = _.uniq( _.flatten( _.pluck(stations, 'lines') ) ); // get unique lines

	// console.log(lineLabels)    
    // loop through each point    
    _.each(stations, function(station, i)
    {
      // sort all the lines consistently
      station.lines = _.sortBy(station.lines, function(lineLabel){ return lineLabels.indexOf(lineLabel); });

    });
    
    return stations;
  }

  //function 25

  function render(options){
    console.log(`called function  #25  ${arguments.callee.name}`)
  
    // reset halton sequence index
    helper.hRandomIndex = 0;
    
    // render the map
    this.renderMap(options);
    
    // activate pan-zoom
    
    // this.panZoom($("#map-svg"));    
  }

  //function 26

  function renderMap(options){
    console.log(`called function  #26  ${arguments.callee.name}`)
  
    var stations = options.transit.stations,
        width = options.width,
        height = options.height,
        pathInterpolation = options.pathInterpolation,
        lines = [], endLines = [], legend;
    
    options.title = options.transit.title; 
    stations = this.processStations(stations);    
        height = this.adjustHeight(height, stations.length, options);
    width = this.adjustWidth(width, stations.length, options);
    
    // generate lines with points
    lines = this.makeLines(stations, width, height, options);
    legend = this.makeLegend(width, lines, options);
    endLines = this.makeEndLines(lines, options);
    lines = _.union(lines, endLines);
    
    // draw the svg map
    this.drawMap(lines, legend, width, height, options);
  }

  //function 27

  function translateCoordinates(x, y, direction, length){
    console.log(`called function  #27  ${arguments.callee.name}`)
  
    var x_direction = 0, y_direction = 0;
    
    switch(direction){
      case 'e':
        x_direction = 1;
        break;
      case 's':
        y_direction = 1;
        break;
      case 'w':
        x_direction = -1;
        break;
    }
    return {
      x: x + length * x_direction,
      y: y + length * y_direction
    };
  }