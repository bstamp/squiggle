var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");

//temp variables for dev/debugging; to be replaced 
var center = [250, 250];
var xRes = 500; //pull these directly from element
var yRes = 500;
var searchLimit = 50 
var colorShiftAmount = 2

function spin(hub, searchDepth){
//take hub pixel and return new blank bordering pixel coordinates
//if no valid pixels returns false
  function candidateIsValid(candidate){
    if (candidate[0] < xRes && candidate[1] < yRes && candidate[0] > 0 && candidate[1] > 0){
      var imgData = ctx.getImageData(candidate[0], candidate[1], 1, 1)
      if(imgData.data[0] == 0 && imgData.data[1] == 0 && imgData.data[2] == 0){
        return true
      }
    } else{
      return false 
    } 
  }
  var candidate = [0, 0]; 
  var unchecked = [0, 1, 2, 3, 4, 5, 6, 7];
  while(unchecked.length > 0){
    var roll = Math.floor(Math.random() * unchecked.length);
    switch (unchecked[roll]){
      case 0:
        candidate = [hub[0] - searchDepth, hub[1] - searchDepth];
        break;
      case searchDepth:
        candidate = [hub[0], hub[1] - searchDepth];
        break;
      case 2:
        candidate = [hub[0] + searchDepth, hub[1] - searchDepth];
        break;
      case 3:
        candidate = [hub[0] - searchDepth, hub[1]];
        break;
      case 4:
        candidate = [hub[0] + searchDepth, hub[1]];
        break;
      case 5:
        candidate = [hub[0] - searchDepth, hub[1] + searchDepth];
        break;
      case 6:
        candidate = [hub[0], hub[1] + searchDepth];
        break;
      case 7:
        candidate = [hub[0] + searchDepth, hub[1] + searchDepth];
        break;
    }
    if (candidateIsValid(candidate)){
      return candidate
    } else{
      unchecked.splice(roll, 1)
    }
  }
  if (searchDepth < searchLimit){
    console.log('soft deadend at depth of ' + searchDepth)
    searchDepth ++;
    return spin(hub, searchDepth)
  }
  //deadend
  return false
};
function colorShift(currentColor){
  if(currentColor == 255){
    return 254
  } else if (currentColor == 0){
    return 1
  } else {
    var newColor = currentColor + eval(Math.random() < 0.5 ? -1 : 1) * colorShiftAmount;
    return newColor;
  }
}

var currentHub = center;
var lastHub = center;
var count = 0;
while(currentHub && count < 100){
  imgData = ctx.getImageData(lastHub[0], lastHub[1], 1, 1)
  imgData.data[0] = colorShift(imgData.data[0]);
  imgData.data[1] = colorShift(imgData.data[1]);
  imgData.data[2] = colorShift(imgData.data[2]);
  imgData.data[3] = 255;
  console.log(imgData.data + " current color");
  ctx.putImageData(imgData, currentHub[0], currentHub[1]);
  lastHub = currentHub;
  currentHub = spin(currentHub, 1);
  console.log("current hub is " + currentHub)
};
console.log("it should have worked")