function loadJSON(file, callback) 
{   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () 
    {
          if (xobj.readyState == 4 && xobj.status == "200") 
          {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }  
 function load_json_xhr(__file) 
{
   loadJSON(__file, function(response) 
   {
  		//alert(response);
        var actual_JSON = eval('(' +response+')');//JSON.parse(response);
        if(actual_JSON)
        {
        nsc(actual_JSON);      
        } 
    });
}