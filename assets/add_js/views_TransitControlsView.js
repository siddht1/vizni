app.views.TransitControlsView = Backbone.View.extend({
  
  el: '#transit-controls',

  initialize: function __init(options) {
    console.log(`called function  #2 #0  ${arguments.callee.name}`)
  
    
    var that = this;
    
    this.transit = options.transit;
    
    if (options.user){
      this.getUserMaps(options.user);
    }
    
    setTimeout(function(){
      that.updateDownloadLink();
    },options.animationDuration)
  },
  
  getUserMaps: function getUserMaps(user){
    console.log(`called function #2 #1  ${arguments.callee.name}`)
  
    var that = this;
    
    $.getJSON( "/api/map/user/"+user, function(data) {
      that.updateEditLink(data);
    });
  },
  
  updateDownloadLink: function(){
    console.log(`called function  #2 #2  ${arguments.callee.name}`)
  
    var content = $("#map-svg").parent().html().trim(),
        canvas = document.getElementById('svg-canvas');

    // Draw svg on canvas
    canvg(canvas, content);
    
    // Retrieve img data
    var imgSrc = canvas.toDataURL('image/png'),
        $link = this.$('.download-link');
        
    $link.attr('href', imgSrc);
    $link.attr('download', 'memory-subway-map.png');
    $link.removeClass('hide');
    
    // window.open(imgSrc, '_blank');  
  },
  
  updateEditLink: function updateEditLink(maps){
    console.log(`called function #2  #3  ${arguments.callee.name}`)
  
    var match = _.findWhere(maps, {slug: this.transit.slug});
    if (match){
      this.$('.edit-link').attr('href', '/map/edit/'+match.token).removeClass('hide')
    }
  }
  
});
