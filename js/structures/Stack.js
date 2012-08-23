/*
 Author: Ryan Hewitt
 This will be an animated Stack
*/

/*
   Idea for activity: Towers of Hanoi
*/

function Stack() {
   var topIndex = 0;

   this.pile = new Array();

   this.pop = function() {
      if(topIndex > 0) topIndex --;
      return this.pile.pop();
   }

   this.push = function(obj) {
      topIndex++;
      return this.pile.push(obj);
   }

   this.getTop = function() {
      return this.pile[topIndex-1];
   }

   this.isEmpty = function() {
      return topIndex <= 0 ? true : false;
   }

   // can I make this aspectOriented?
   // Also, perhaps should return copy
   this.getAll = function() {
      return this.pile;
   }

}
