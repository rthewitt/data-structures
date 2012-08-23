/*
 * Not called Node because Node.js too well known, may use
 * Currently very basic - any inheritance will be prototypical
 * for testing will probably just be an int container or something
 *
*/

function Node(data) {

   // Note that value != value()
   // Is this shared?
   var val = data || null;

   // TODO override in all children!
   this.isEqual = function(node) {
     return val === node.value();
   }

   // TODO override in all children!
   this.value = function() {
      return val;
   }

   // TODO override in all children!
   this.copy = function() {
      return new Node(val);
   }

   // TODO override in all children!
   this.toString = function() {
      return "" + val;
   }

   // TODO override in all children!
   this.compareTo = function(node) {
      return val - node.value();
   }
}
