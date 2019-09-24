function  addDotStyles(dots, options){
    var pointColor = options.pointColor,
        borderColor = options.borderColor,
        borderWidth = options.borderWidth;    
    
    _.each(dots, function(dot){
      dot.className = dot.className || '';
      // train symbol
      if (dot.symbol){
        dot.borderColor = dot.pointColor;
        dot.borderWidth = borderWidth;
      // point/station
      } else {
        dot.pointColor = pointColor;
        dot.borderColor = borderColor;
        dot.borderWidth = borderWidth;
      }
    });
    
    return dots;
  }

function addRectStyles(rects, options){

    var pointColor = options.pointColor,
        borderColor = options.borderColor,
        borderWidth = options.borderWidth,
        borderRadius = options.borderRadius,
        pointRadius = options.pointRadius,        
        dotSize = pointRadius*2,
        offsetWidth = options.offsetWidth - dotSize;
        
    _.each(rects, function(rect){
      rect.className = rect.className || '';
      // hub
      if (rect.hubSize) {
        rect.pointColor = pointColor;
        rect.borderColor = borderColor;
        rect.borderWidth = borderWidth;
        rect.borderRadius = borderRadius;
        rect.width = rect.hubSize*dotSize + offsetWidth*(rect.hubSize-1);
        rect.height = dotSize;
        rect.rectX = rect.x - pointRadius;
        rect.rectY = rect.y - pointRadius;
      // legend
      } else if (rect.type=="legend") {        
        rect.borderColor = borderColor;
        rect.borderWidth = borderWidth;
        rect.borderRadius = 0;
      }
    });
    
    return rects;
  }

  function drawLines(svg, lines, options) {
    console.log('enter')
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
  }