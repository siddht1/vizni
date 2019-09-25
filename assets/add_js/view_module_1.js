//function 1

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
     console.log(`called function  #1  ${arguments.callee.name}`)
  
    return dots;
  }
  
// function 2

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
      console.log(`called function  #2 ${arguments.callee.name}`)
  
    return rects;
  }


//function 3

function addLabelStyles(labels, options){
    var fontFamily = options.fontFamily,
        textColor = options.textColor,
        fontSize = options.fontSize,
        fontWeight = options.fontWeight;
    
    _.each(labels, function(label){
      label.className = label.className || '';
      label.fontFamily = fontFamily;
      label.alignment = "middle";
      // symbol    
      if (label.symbol) {
        label.textColor = "#ffffff";
        label.fontSize = 14;
        label.fontWeight = "normal";
        label.anchor = "middle"; 
        label.text = label.symbol;
        label.labelX = label.labelX!==undefined ? label.labelX : label.x;
        label.labelY = label.labelY!==undefined ? label.labelY : label.y + 1;  
      // label
      } else {
        label.textColor = textColor;
        label.fontSize = label.fontSize || fontSize;
        label.fontWeight = fontWeight;
        label.anchor = label.anchor || "end";
        label.text = label.text || label.label;
        label.labelX = label.labelX!==undefined ? label.labelX : label.x-10;
        label.labelY = label.labelY!==undefined ? label.labelY : label.y; 
      }
    });
      console.log(`called function  #3  ${arguments.callee.name}`)
  
    return labels;
  }

  //function 4

  function addLineStyles(lines, options){
    var strokeOpacity = options.strokeOpacity,
        strokeWidth = options.strokeWidth;
    
    _.each(lines, function(line){
      line.className = line.className || '';
      line.strokeOpacity = strokeOpacity;
      // symbol    
      if (line.type=="symbol") {
        line.color = "#aaaaaa";   
        line.strokeWidth = 2;
        line.strokeDash = "2,2";
   
      // normal line
      } else {
        line.strokeWidth = strokeWidth;
        line.strokeDash = "none";
      }
    });
      console.log(`called function  #4  ${arguments.callee.name}`)
  
    return lines;
  }

  //function 5

  function addListeners(){
    var that = this;
      console.log(`called function  #5  ${arguments.callee.name}`)
  
    // keyboard listeners
    $(document).on('keydown', function(e){        
      switch(e.keyCode) {          
        // o - output to svg
        case 79:
          if (e.ctrlKey) that.exportSVG();
          break;
          
        default:
          break;
      }
    });    
  }


  //function 6

  function adjustHeight(height, stationCount, options) {
    var yUnit = options.yUnit,
        paddingY = options.padding[1],
        activeH = height - paddingY*2;
    
    // make height shorter if not enough stations
    if (Math.floor(height/stationCount) > yUnit) {
      activeH = yUnit*stationCount;
      height = activeH + paddingY*2;
    }
      console.log(`called function  #6  ${arguments.callee.name}`)
      return height;
  }


  //function 7

  function adjustWidth(width, stationCount, options){
    var xUnit = options.xUnit,
        paddingX = options.padding[0],
        activeW = width - paddingX*2;
    
    // make height shorter if not enough stations
    if (Math.floor(width/stationCount) > xUnit) {
      activeW = xUnit*stationCount;
      width = activeW + paddingX*2;
    }
    
    width = _.max([options.minWidth, width]);
     console.log(`called function  #7  ${arguments.callee.name}`)
  
    return width;
  }


  //function 8

  function drawDots(svg, dots) {
console.log(`called function  #8  ${arguments.callee.name}`)

    svg.selectAll("dot")
      .data(dots)
      .enter().append("circle")
      .attr("r", function(d) { return d.pointRadius; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("class", function(d) { return d.className || ''; })
      .style("fill", function(d){ return d.pointColor; })
      .style("stroke", function(d){ return d.borderColor; })
      .style("stroke-width", function(d){ return d.borderWidth; });
  }

//function 9

function drawRects(svg, rects){
  console.log(`called function  #9  ${arguments.callee.name}`)

    _.each(rects, function(r){
      svg.append("rect")
        .attr("width", r.width)
        .attr("height", r.height)
        .attr("x", r.rectX)
        .attr("y", r.rectY)
        .attr("rx", r.borderRadius)
        .attr("ry", r.borderRadius)
        .attr("class", r.className)
        .style("fill", r.pointColor)
        .style("stroke", r.borderColor)
        .style("stroke-width", r.borderWidth);
    });    
  }

  //function 10

  function drawLabels(svg, labels, options) {  
  console.log(`called function  #10  ${arguments.callee.name}`)
      
    svg.selectAll("text")
      .data(labels)
      .enter().append("text")
      .text( function (d) { return d.text; })
      .attr("class", function(d) { return d.className || ''; })
      .attr("x", function(d) { return d.labelX; })
      .attr("y", function(d) { return d.labelY; })
      .attr("text-anchor",function(d){ return d.anchor; })
      .attr("alignment-baseline",function(d){ return d.alignment; })
      .attr("dominant-baseline",function(d){ return d.alignment; })      
      .attr("font-size", function(d){ return d.fontSize; })
      .style("font-family", function(d){ return d.fontFamily; })
      .style("font-weight", function(d){ return d.fontWeight; })
      .style("fill", function(d){ return d.textColor; });
  }