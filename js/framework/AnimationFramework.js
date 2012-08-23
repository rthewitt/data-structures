// TODO Allow for need based canvas updating
// TODO implement getAll() as local hashmap
var _AF = (function(alias){ 

   var DEFAULT_TIMEOUT = 10;
   var registeredAnimators = new Array();
   var running = false;
   var timeout = DEFAULT_TIMEOUT;
   var ctx;
   var interval;

   function _generateID () {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
   }

   function _register (animator){ registeredAnimators.push(animator);}
   
   function _schedule ( t_o) {
      running = false;
   
      if( t_o !== undefined && t_o !== null ) {
         if( typeof(t_o) === 'string') timeout = parseInt(t_o);
         else if( typeof(t_o) === 'number') timeout = t_o;
         else return;
      }
   }

   function _setContext (context, width, height) {
      ctx = context;
      totalWidth = width;
      totalHeight = height;
   }

   function _start () {
      if(!running !== true) return
      running = true;
      // can I clean the check below?
      if(interval) clearInterval(interval);
      _drawScene();
      interval = setInterval(function() {
         _AF.drawScene(); // TODO API?
         }, 10);
   }

   function _pause () {
      if(interval) clearInterval(interval);
      running = false;
   }

   function _stop () {
      _pause();
      _resetFramework();
   }

   function _clear () {
      ctx.clearRect(0,0,totalw,totalh);
   }

   function _resetFramework () {
      _clear();
      registeredAnimators = new Array();
   }

   // Consider moving into a separate object, like CanvasState.
   function _drawScene () {
      _clear();
      for(var anim in registeredAnimators) {
         if( registeredAnimators[anim].keepGoing !== false )  registeredAnimators[anim].animate(); 
      }
   }

   function _createAnimator (name, structure, strategy) {
      if(!structure || !name) return null;

      function A() {
         this.state;
         this.id = name;
         this.runningAnimations = [];
         this.actions = [];
         this.active = strategy || [];
         // this breaks with more than one animation.
         this.removeAnimation = function(animID) {
            for(var z=0;z<this.runningAnimations.length;z++)
               if(this.runningAnimations[z].id == animID) this.runningAnimations.splice(z,1);
         }
         this.setState = function(st) {
            this.state = st;
         }
         this.drawSelf = function() {
            //TODO change getAll to refer to hashmap?
            var nodes = this.getAll(); // could be handled by structure, or by Framework.  (large hashmap to registeredAnimators?)
            for(var i in nodes) {
               nodes[i].draw();
               nodes[i].update();
            }
            for(var anim in this.runningAnimations) this.runningAnimations[anim].run();
         }
         this.keepGoing = true; // is this every really used?
      }

      // Wraps Data Structure functions via closure
      function Operation(orig) {
         return function(){
            var opArgs;
            // is the below operation dangerous?  Could animation actually disrupt underlying operation?
            if(typeof this.actions[orig].args == 'undefined') {
               opArgs = [];
               for(var r in arguments) {
                  opArgs.push(arguments[r]);
               }
            } else opArgs = this.actions[orig].args;

            //TODO abstract getNode to arguments
            var nodeAnimation = _defineAnimation(this.actions[orig].name, this.actions[orig].subs, opArgs);
            nodeAnimation.destruct = function(id) {
               this.removeAnimation(id);
            }.bind(this);
            this.runningAnimations.push(nodeAnimation);

            return structure[orig].apply(structure,arguments);
         }
      }

      /*
         This cycles through the structure, copying over and extending the prototype
         as necessary.  Currently considering extending by including a function
         Almost seems to negate the purpose of convenience.
      */
      A.prototype.init = function() {
         if(structure)
            for(var m in structure) {
               if(typeof structure[m] == 'function' && this.actions[m]){
                  this[m] = new Operation(m);
               } else this[m] = structure[m];
            }
         this.state = 'ready';
      }

         // This should do more, confuses things as intermediary
      A.prototype.animate = function() {
         if(!this.keepGoing) return;
         this.drawSelf(); // control, stasis, etc.  Will receive array of nodes from Structure.getAll();
      }

       A.prototype.addAnimation = function(name, subs, args) {
         this.actions[name] = {
            name : name,
            subs : subs,
            args : args // function, argument or (ultimately) argument array
         };
      }

      A.prototype.isActive = function(animation){
         for(var an in this.active) {
            if(this.active[an] === animation) {
               return true;
            }
         }
         return false;
      }
      return new A();
}

   /*
     @Argument runFuns = Array of animation sub-functions
     @Argument args = argument array to be applied to operation
     Note: if args is not defined, the operation arguments will 
     be applied to the animation
   */
   function _defineAnimation (name, runFuns, args) {
      var arrayArgs;

      if(args) {
         // function referenced below would be a one time call.
         // Framework does not support dynamic args at this time.
         if(typeof args == 'function') 
            arrayArgs = args(); // one time function called during operation
         else {
         arrayArgs = args; // arg or args passed in directly
         }
   
         var isArray = (arrayArgs != null && typeof arrayArgs === "object" && 'splice' in arrayArgs && 'join' in arrayArgs);
         if(!isArray)
            arrayArgs = [ arrayArgs ];
      } 
         
      function S() {
         this.id = name + '-' + _generateID();
         this.args = arrayArgs;   
         this.isActive = false;
         this.animQ = new Queue();
         for(var r=0; r<runFuns.length; r++)
            this.animQ.enqueue(runFuns[r]); // hide impl from AnimationFramework
      }
      S.prototype.run = function() {
            if(!this.current)
               this.current = this.animQ.dequeue();
            if(this.current)
             this.current.apply(this, this.args);
      }
      S.prototype.transition = function() {
         this.current = this.animQ.dequeue();
         if(typeof this.current == 'undefined') 
            this.destruct(this.id);
      }

      return new S();
   }

   function _getAnimator (name) {
      for(var ra in registeredAnimators) {
         if(registeredAnimators[ra].id == name) return registeredAnimators[ra];
      }
      return null;
   }

   function _deactivate (animatorName) {
      _getAnimator(animatorName).keepGoing = false;
   }

   function _activate (animatorName) {
      _getAnimator(animatorName).keepGoing = true;
   }

   // API Definition TODO organize by function
   // Do this for the individual structures, so separate
   // internal functions from functions from animator
   // Sort of like aspect-oriented, return a cross-section
   return {
      register : _register,
      schedule : _schedule,
      setContext : _setContext,
      start : _start,
      pause : _pause,
      stop : _stop,
      clear : _clear,
      drawScene : _drawScene,
      createAnimator : _createAnimator,
      getAnimator : _getAnimator,
      deactivate : _deactivate,
      activate : _activate
   }

})()

