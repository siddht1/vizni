app.views.TransitShowView = Backbone.View.extend({

  el: 'body',

  initialize: function() {
    // add listeners
      console.log(`called function  #0  ${arguments.callee.name}`)
  
    this.addListeners();
  },
  
  addDotStyles: addDotStyles,
  
  addRectStyles: addRectStyles,
  
  addLabelStyles: addLabelStyles,
  
  addLineStyles: addLineStyles,
  
  addListeners: addListeners,
  
  adjustHeight: adjustHeight,
  
  adjustWidth: adjustWidth,

  drawDots: drawDots,
  
  drawRects: drawRects,
  
  drawLabels: drawLabels,
  
  drawLines: drawLines,
  
  drawMap: drawMap,
  
  exportSVG: exportSVG,
  
  getColor: getColor,
  
  getImageDataUrl: getImageDataUrl,
  
  getLengths: getLengths,
  
  getNextX: getNextX,
  
  getPointsBetween: getPointsBetween,
  
  getSymbol: getSymbol,
  
  getTitleLines: getTitleLines,
  
  makeEndLines: makeEndLines,
  
  makeLegend: makeLegend,
  
  makeLines: makeLines,
  
  // 


  processStations: processStations,
  
  render: render,
  
  renderMap: renderMap,
  
  translateCoordinates: translateCoordinates

});

