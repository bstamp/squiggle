var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");

//temp variables for dev/debugging; to be replaced 
var center = [250, 250];
var xRes = 500; //pull these directly from element
var yRes = 500;

function spin(hub){
//take hub pixel and return new blank bordering pixel coordinates
//if no valid pixels returns false
//todo: escape deadends
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
  var unchecked = [0, 1, 2, 3, 4, 5, 6, 7];
  while(unchecked.length > 0){
    var roll = Math.floor(Math.random() * unchecked.length);
    switch (unchecked[roll]){
      case 0:
        var candidate = [hub[0] - 1, hub[1] - 1];
        break;
      case 1:
        var candidate = [hub[0], hub[1] - 1];
        break;
      case 2:
        var candidate = [hub[0] + 1, hub[1] - 1];
        break;
      case 3:
        var candidate = [hub[0] - 1, hub[1]];
        break;
      case 4:
        var candidate = [hub[0] + 1, hub[1]];
        break;
      case 5:
        var candidate = [hub[0] - 1, hub[1] + 1];
        break;
      case 6:
        var candidate = [hub[0], hub[1] + 1];
        break;
      case 7:
        var candidate = [hub[0] + 1, hub[1] + 1];
        break;
    }
    if (candidateIsValid(candidate)){
      return candidate
    } else{
      unchecked.splice(roll, 1)
    }
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
    var newColor = currentColor + eval(Math.random() < 0.5 ? -1 : 1) * 10;
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
  currentHub = spin(currentHub);
  console.log("current hub is " + currentHub)
  console.log(lastHub + " lastHub")
};
console.log("it should have worked")