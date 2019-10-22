module.exports = class utils {
  
  swipeDirection(initTouch,initMove) {
    return (this.getAbs(initTouch.x,initMove.x) >this.getAbs(initTouch.y, initMove.y)) ? 
            (initMove.x-initTouch.x > 0 ? 'right':'left'):(initMove.y - initTouch.y>0?'down':'up');
  }

  getAbs(arg1,arg2) {
    return Math.abs(arg1-arg2);
  }

  getDistance(arg1,arg2) {
    return Math.sqrt(Math.pow(this.getAbs(arg1.x,arg2.x),2)+
                     Math.pow(this.getAbs(arg1.y,arg2.y),2));
  }  
}
