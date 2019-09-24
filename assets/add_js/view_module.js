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
  