/*
  Author: Ryan Hewitt
  This will be an animated Queue
   you can var x = shift(), may be useful
*/

function Queue() {

   this.line = new Array();

   this.dequeue = function() {
   return this.line.pop();
   }

   this.enqueue = function(obj) {
   this.line.unshift(obj);
   }

}
