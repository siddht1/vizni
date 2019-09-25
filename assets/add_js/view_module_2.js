//function 11
function drawLines(svg, lines, options) {
    var that = this,
        pathInterpolation = options.pathInterpolation,
        animate = options.animate,
        animationDuration = options.animationDuration,
        svg_line;
        
    svg_line = d3.svg.line()
      .interpolate(pathInterpolation)
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });
      _.each(lines, function(line){
      var points = line.points,
          path = svg.append("path")
                  .attr("d", svg_line(points))
                  .attr("class", line.className)
                  .style("stroke", line.color)
                  .style("stroke-width", line.strokeWidth)
                  .style("stroke-opacity", line.strokeOpacity)                  
                  .style("fill", "none");
                  
      // animate if it's a solid line
      if (path && animate && line.strokeDash=="none" && line.className.indexOf("primary")>=0) {
        var totalLength = path.node().getTotalLength();
        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
            .duration(animationDuration)
            .ease("linear")
            .attr("stroke-dashoffset", 0)   
      
      // otherwise, set the stroke dash
      } else {
        path.style("stroke-dasharray", line.strokeDash);
      }    
                
    });
      console.log(`called function  #11  ${arguments.callee.name}`)
  
  }

  //function 12

  function drawMap(lines, legend, width, height, options){
  	console.log(`called function  #12  ${arguments.callee.name}`)
  
    var bgColor = options.bgColor,        
        svg, points = [], dots = [], labels = [], rects = [],
        showLegend = parseInt(options.transit.legend),
        showLabels = parseInt(options.transit.labels);
    
    // reset if already there
    if ($("#map-svg").length > 0) {
      $("#map-svg").remove();
    }
    
    // init svg and add to DOM
    svg = d3.select("#svg-wrapper")
      .append("svg")
      .attr("id", "map-svg")
      .attr("width", width)
      .attr("height", height);
            
    // extract points, dots, labels from lines
    points = _.flatten( _.pluck(lines, "points") );
    dots = _.filter(points, function(p){ return p.pointRadius && p.pointRadius > 0; });    
    if (showLabels) labels = _.filter(points, function(p){ return p.label !== undefined || p.symbol !== undefined; });
    rects = _.filter(points, function(p){ return p.hubSize; });
    
    // add legend items
    if (showLegend) {
      lines = _.union(lines, legend.lines);
      dots = _.union(dots, legend.dots);
      labels = _.union(labels, legend.labels);
    }   
    
    // add styles
    lines = this.addLineStyles(lines, options);
    dots = this.addDotStyles(dots, options);
    labels = this.addLabelStyles(labels, options);
    rects = this.addRectStyles(rects, options);
    legend.rects = this.addRectStyles(legend.rects, options);
    
    // draw lines, dots, labels, rects
    if (showLegend) this.drawRects(svg, legend.rects);
    this.drawLines(svg, lines, options);
    this.drawDots(svg, dots, options);   
    this.drawRects(svg, rects, options);
    this.drawLabels(svg, labels, options);
  }

  //function 13

  function exportSVG(){   
  console.log(`called function  #13 ${arguments.callee.name}`)
   
    var dataUrl = this.getImageDataUrl();
    
    window.open(dataUrl, '_blank');
    
    // $("body").append($("<img src='data:image/svg+xml;base64,\n"+b64+"' alt='file.svg'/>"));
  }
  //function 14

  function getColor(lines, colors){
    console.log(`called function  #14 ${arguments.callee.name}`)
  
    var i = lines.length;
    if (i>=colors.length) {
      i = i % lines.length;
    }
    return colors[i];
  }

  //function 15
  function getImageDataUrl(){
    console.log(`called function  #15  ${arguments.callee.name}`)
  
    var svg_xml = $("#map-svg").parent().html(),
        b64 = window.btoa(svg_xml);
        
    return "data:image/svg+xml;base64,\n"+b64; 
  }
  //function 16
  function getLengths(xDiff, yDiff, directions, y, options) {
    console.log(`called function  #16  ${arguments.callee.name}`)
  
    var lengths = [],
        rand = helper.hRandom(20, 80) / 100,
        yUnit = options.yUnit,
        paddingY = options.padding[1],
        i = 0, timeout = 10,
        firstY;
    
    // don't let in-between points overlap with yUnit
    while((y+Math.round(yDiff*rand)-paddingY)%yUnit===0 && i<timeout) {
      rand = helper.hRandom(20,80) / 100;
      i++;
    }
    
    xDiff = Math.abs(xDiff);
    
    _.each(directions, function(d, i){
      // assuming only 1 east or west
      if (d=="e" || d=="w") {
        lengths.push(xDiff);
       // assuming only 2 souths
      } else { 
        if (i==0) {
          firstY = Math.round(yDiff*rand);
          lengths.push(firstY);
        } else {
          lengths.push(yDiff-firstY);
        }
      }
    });
    
    return lengths;
    
  }
  //function 17
  function getNextX(boundaries, iterator, totalPoints, width, minXDiff, prevPoint){
    console.log(`called function  #17  ${arguments.callee.name}`)
  
    var x = 0,
        prevPadding = 0.25,
        trendPadding = 0.4,
        percentComplete = parseFloat(iterator/totalPoints),
        // absolute min/max based on boundaries
        absMinX = boundaries.minX,
        absMaxX = boundaries.maxX,
        // min/max based on general trend from left to right
        trendMinX = Math.round(percentComplete*width) - Math.round(width*trendPadding),
        trendMaxX = Math.round(percentComplete*width) + Math.round(width*trendPadding),
        // create arrays
        mins = [absMinX, trendMinX],
        maxs = [absMaxX, trendMaxX],
        xDiff = 0;
    
    // make sure point is within x% of previous point
    if (prevPoint) {
      mins.push(prevPoint.x - Math.round(width*prevPadding));
      maxs.push(prevPoint.x + Math.round(width*prevPadding));
    }
    
    // determine the min/max
    minX = _.max(mins);
    maxX = _.min(maxs);   
    
    do {
      // ensure no logic error   
      if (minX<maxX) {
        x =  helper.hRandom(minX, maxX);
      } else {
        x =  helper.hRandom(maxX, minX);
      }
      if (prevPoint)
        xDiff = Math.abs(Math.floor(x - prevPoint.x));
    } while(prevPoint && xDiff<minXDiff); // ensure xDiff is above min
    
    return x;
  }

  //function 18

  function getPointsBetween(p1, p2, pathTypes, cornerRadius, options) {
    console.log(`called function  #18  ${arguments.callee.name}`)
  
    var that = this,
        points = [],
        x1 = p1.x, y1 = p1.y,
        x2 = p2.x, y2 = p2.y,
        yDiff = y2 - y1
        xDiff = x2 - x1,
        xDirection = false,
        pathType = false;
        
    // determine x direction 
    if (xDiff>0) {
      xDirection = "e";
    } else if (xDiff<0) {
      xDirection = "w";
    }
    
    // filter and choose random path type
    pathTypes = _.filter(pathTypes, function(pt){
      return pt.xDirection===xDirection;
    });
    pathType = _.sample(pathTypes);  

    // get points if path type exists
    if (pathType && xDirection) {
      
      // retrieve directions
      var directions = pathType.directions;
      
      // retrieve lengths
      var x = x1, y = y1,
          lengths = that.getLengths(xDiff, yDiff, directions, y, options);
          
      // generate points
      _.each(directions, function(direction, i){
        var length = lengths[i],
            point = that.translateCoordinates(x, y, direction, length),
            pointR1 = false, pointR2 = false;
            
        x = point.x;
        y = point.y;        
        point.id = _.uniqueId('p');
        point.direction1 = direction;
        
        // add transition points if corner radius
        if (cornerRadius>0 && cornerRadius<length/2) {
          if (direction=="s") {
            pointR1 = { x: x, y: y-length+cornerRadius };
            pointR2 = { x: x, y: y-cornerRadius };
          } else if (direction=="e") {
            pointR1 = { x: x-length+cornerRadius, y: y };
            pointR2 = { x: x-cornerRadius, y: y };
          } else {
            pointR1 = { x: x+length-cornerRadius, y: y };
            pointR2 = { x: x+cornerRadius, y: y };
          }
        }
        
        // add points
        if (pointR1) points.push(pointR1);
        if (pointR2) points.push(pointR2);
        points.push(point);        
        
        // add direction out
        if (i>0) {
          points[i-1].direction2 = direction;
        }
      });
           
      // ensure the last point matches target
      if (points.length > 0) {
        points[points.length-1].x = x2;
        points[points.length-1].y = y2;
      }
    
    // otherwise, just return target point
    } else {
      points.push({
        id: _.uniqueId('p'),
        direction1: 's',
        x: x2,
        y: y2
      });
    }   
    
    return points;
  }
  //function 19
  function getSymbol(lineLabel, lines) {
    console.log(`called function  #19  ${arguments.callee.name}`)
  
    // prioritize characters: uppercase label, numbers, lowercase label
    var str = lineLabel.toUpperCase() + "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ" + lineLabel.toLowerCase() + "abcdefghijklmnopqrstuvwxyz",
        symbols = _.pluck(lines, "symbol"),
        symbol = str.charAt(0);
    
    // strip spaces
    str = str.replace(" ","");
    
    // loop through string's characters
    for(var i=0; i<str.length; i++) {
      // get next character
      var chr = str.charAt(i);
      // if character not already taken, use as symbol
      if (symbols.indexOf(chr) < 0) {
        symbol = chr;
        break;
      }
    }
    
    return symbol;
  }
  //function 20
  function getTitleLines(title, titleMaxLineChars) {
    console.log(`called function  #20 ${arguments.callee.name}`)
  
    var lines = [],
        titleLength = title.length,
        words = title.split(" "),
        currentLine = "";
        
    _.each(words, function(word){
      // if new word goes over max, start new line 
      if (word.length+currentLine.length+1 > titleMaxLineChars) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    });
    
    if (currentLine.length) lines.push(currentLine);
    
    return lines;
  }