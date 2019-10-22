//import gesture from '/index.js';
var gesture = require('./index.js');

let node = document.querySelector('.wrap');
let touchGesture = new gesture(node);
let img = node.querySelector('img');

function showEvent(event) {
  var showEvent = document.querySelector('.event');
  showEvent.innerText = event;
}

function resetEle() {
  img.style.transform = "rotate3d(0,0,0,0deg)";
  img.style.transition = "transform 0.5s";
}

touchGesture.on('tap',function(e) {
  console.log('tap');
  showEvent('tap');
  img.classList.add('tapRotate');
  setTimeout(function(){
    // resetEle();
    img.classList.remove('tapRotate');
  }, 1500);
});

touchGesture.on('doubleTap',function(e) {
    showEvent('doubleTap');
  // img.style.width = img.width*1.5+'px';  
  
  img.classList.add('doubleTabR');
  setTimeout(function(){
    img.classList.remove('doubleTabR');
    // resetEle();
  }, 1500);
});

touchGesture.on('swipe',function(e) {
  console.log('swipe '+e.direction);
  showEvent('swipe:'+e.direction);
});

touchGesture.on('longPress',function(e) {
  showEvent('longPress:'+e.pressTime/1000+'s');
});

touchGesture.on('pinch',function(e) {
  console.log('double finger');  
  showEvent('pinch:'+e.zoom.toFixed(2)); 
  console.log(e);
  var modulus = 0.5;
  img.style.width = img.width*e.zoom*modulus+'px';
});

touchGesture.on('drag',function(e){
  // console.log('draging');
  showEvent('draging'); 
  
//console.log(img.height);
  node.style.top = e.targetTouches[0].clientY-img.height/2+'px';
  node.style.left = e.targetTouches[0].clientX-img.width/2+'px';
});
