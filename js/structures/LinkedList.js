/*
 * Linked List created now, because I need it for the graph structure.
 *
 * For OrderedLinkedList, use prototypical inheritance before animating.
*/

// TODO implement insertAt or whatever
// TODO determine if insertFirst / insertLast results in expensive closures.
function LinkedList() {

   function ListNode(data) {
      this.dataNode = data || null;
      this.link = null;
   } 

   // These are ListNodes, not DataNodes!!
   this.first = null;
   this.last = null;

   var size = 0;   

   this.init = function() {
      this.first = null;
      this.last = null;
      size = 0;
   }

   this.getFirst = function() {
      return this.first;
   }

   this.getLast = function() {
      return this.last;
   }

   this.isEmpty = function() {
      return (size <= 0);
   }

   this.insertFirst = function(dataNode) {
      var listNode = new ListNode(dataNode.copy());
      listNode.link = this.first;
      this.first = listNode;
      if(this.last == null) this.last = listNode;
      size++;
   }

   this.insertLast =  function(dataNode) {
      var listNode = new ListNode(dataNode.copy());
      if(this.first == null) {
         this.first = listNode;
         this.last = listNode;
      } else {
         if(!this.last) {
            throw("Error, last should not be null...");
            return;
         }
         this.last.link = listNode;
         this.last = listNode;
      }
      size++;
   }

   this.length = function() {
      return size;
   }

   this.find = function(item) {
      var cur = this.first;
      var found = false;

      while(cur != null && found !== false)
         if(cur.dataNode.isEqual(item)) found = true;
         else cur = cur.link;

      return found;
   }

   this.remove = function(item) {
      var cur;
      var trail;
      var found = false;

      if(!this.first) throw "List was empty, cannot remove";
      else {
         if(this.first.dataNode.isEqual(item)) {
            this.first = this.first.link;

            if(this.first == null) this.last = null;
            size--;
         } else {
            trail = this.first;
            cur = this.first.link;
            
            // TODO test the truthiness of cur
            while(cur && !found) 
               if(cur.dataNode.isEqual(item)) found = true;
               else {
                  trail = cur;
                  cur = cur.link;
               }

            if(found) {
               trail.link = cur.link;
               size--;

               if(this.last == cur) this.last = trail;
            }
              
         }
      }
   }

   // TODO Test thoroughly, logic was wrong in Java
   // Also add additional verification.  Something could be undefined
   // for runtime reasons.  Why, and should I handle it?
   // TODO Should I handle deletes as memory management?
   this.removeAll = function( itemValue ) {
      var cur;
      var trail;

      if(!this.first) // && first) !=== undefined) // TODO check this
        throw 'List was empty, cannote remove'; 
      else {
         if(this.first.dataNode.isEqual(itemValue)) {
            this.first = this.first.link;
            size--;
            if(this.first === null) // TODO VERIFY
               this.last = null;
         }

            trail = this.first;
            cur = this.first.link;

            while(cur !== null) {
               if(cur.dataNode.isEqual(itemValue)) {
                  trail.link = cur.link;
                  cur = cur.link;
                  if(cur === null) this.last = trail;
                  size--;
               } else {
                     trail = cur;
                     cur = cur.link;
               }
            }
      }
   }

   this.toString = function() {
      var str = "";
      var cur = this.first;
      while(cur) {
         str += cur.dataNode + " ";
         cur = cur.link;
      }
      return str;
   }
}
