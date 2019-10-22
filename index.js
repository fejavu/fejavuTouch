var utils = require('./utils');

export default class gesture {
  constructor(node) {
    this.node = node;
    this.handles = {
      touchstart: [],
      touchend: [],
      touchmove: [],
      tap: [],
      doubleTap: [],
      swipe: [],
      longPress: [],
      drag: [],
      pinch: []
    };
    
    this.preTap = {x: null, y: null};
    this.initTouch = {x: null, y: null};
    this.initMove = {x: null, y: null};
    this.secondFinger = {x: null, y: null};
    this.secondMove = {x: null, y: null};
    
    this.now = null;
    this.last = null;
    this.leave = null;
    this.timeGap = null;
    this.isDoubleTap = false;
    
    this.bind();
  }
  
  bind() {
    
    /* origin event wrap */ 
    this.node.ontouchstart = (event) => {
      this.dispatch('touchstart',event);
      
      this.initTouch.x = event.touches[0].clientX;
      this.initTouch.y = event.touches[0].clientY;
      
      if(event.touches.length>1){
        this.secondFinger.x = event.touches[1].clientX;
        this.secondFinger.y = event.touches[1].clientY;   
        this.isTwoFingers = true;
      }
      
      this.now = Date.now();
      this.timeGap = this.last ? this.now - this.last:0;
      
      if(this.preTap !== null) {
        this.isDoubleTap = (this.timeGap > 0 && this.timeGap < 300) 
                            && (utils.getAbs(this.initTouch.x, this.preTap.x) < 30)
                            && (utils.getAbs(this.initTouch.y, this.preTap.y) < 30);
      }
                 
      if(this.isDoubleTap) {
        clearTimeout(this.tapTimeout);
      }
      
      this.preTap.x = this.initTouch.x;
      this.preTap.y = this.initTouch.y;
      
      this.last = this.now;
      
    };
    
    this.node.ontouchmove = (event) => {
      this.dispatch('touchmove',event);     
      
      if(event.touches.length>1){
        this.initMove.x = event.touches[0].clientX;
        this.initMove.y = event.touches[0].clientY;
        this.secondMove.x = event.touches[1].clientX;
        this.secondMove.y = event.touches[1].clientY;
        
        event.beforeDistance = utils.getDistance(this.initTouch, this.secondFinger);
        event.afterDistance = utils.getDistance(this.initMove, this.secondMove);
        event.zoom = event.afterDistance / event.beforeDistance ;
        
        this.debounce(this.dispatch('pinch',event), 50);
        return;
        
      }else { 
        this.initMove.x = event.touches[0].clientX;
        this.initMove.y = event.touches[0].clientY;
        this.dispatch('drag',event);
        return;
      }
    };
    
    this.node.ontouchend = (event) => {
      this.dispatch('touchend',event);      
      this.leave = Date.now();
      
      // swipe
      if(this.initMove.x && utils.getAbs(this.initMove.x, this.initTouch.x)>30 || 
         this.initMove.y && utils.getAbs(this.initMove.y, this.initTouch.y)>30 ) {
        
        var direction = utils.swipeDirection(this.initTouch, this.initMove);
        event.direction = direction;
        if(!this.isTwoFingers){
          this.dispatch('swipe',event);
          this.initMove.x = null;
          this.initMove.y = null; // recover the x,y
          return ;                
        }  
      } 

      // single tap
      if(!this.isDoubleTap && !this.isTwoFingers && (this.leave - this.last) < 300) {
        this.tapTimeout = setTimeout(()=>{
          this.dispatch('tap',event);
        }, 300);
      }
      
      // double tap
      if(this.isDoubleTap && !this.isTwoFingers) {
        this.dispatch('doubleTap',event);
        this.isDoubleTap = false;
      }      
      
      // long press
      if( !this.initMove.x && !this.initMove.y &&!this.isTwoFingers&& (this.leave - this.last) > 300) {
        var pressTime = this.leave - this.last;
        event.pressTime = pressTime;
        this.dispatch('longPress',event);
      }
      
      this.isTwoFingers = false;
   };
  }
  
  /* core function */   
  dispatch(eventType, event) {
    this.handles[eventType].forEach(handle => handle.call(this.node,event));
    return; 
  } 
  
  on(eventType, handle) {
    this.handles[eventType].push(handle);
  }
  
  debounce(fn, duration) {
    var timer = null;
    return function() {
      var context = this;
      var args = arguments;
      
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }
      
      timer = setTimeout(function(){
        fn.apply(context, args);
      },duration);
    }
  }
}