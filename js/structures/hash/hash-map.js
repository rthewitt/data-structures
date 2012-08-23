/*
   Remember the possibility that this will be copywrite infringement
   Look into this
   Author: Eugene's Lazutkin
*/

function Map(linkItems) {
   //You can do this?
   this.current = undefined;
   this.size = 0;

   if(linkItems  === false)
      this.disableLinking();
}

Map.noop = function() {
   return this;
};

//Where is Error defined?
Map.illegal = function() {
   throw new Error("illegal operation for maps without linking");
};
/*
Map init from existing object
doesn't add inherited properties if not explicity instructed to:
omitting foreignKeys means foreignKeys === undefined, i.e. == false
--> inherited properties won't be added
*/
Map.from = function(obj, foreignKeys) {
   var map = new Map;
   for(var prop in obj) {
      if(foreignKeys || obj.hasOwnProperty(prop))
         map.put(prop, obj[prop]);
   }
  
   return map;
}

Map.prototype.disableLinking = function() {
   this.link = Map.noop;
   this.unlink = Map.noop;
   this.disableLinking = Map.noop;
   this.next = Map.illegal;
   this.value = Map.illegal;
   this.removeAll = Map.illegal;

   return this;
};

// overwrite in Map instance if necessary
//TODO merge this function in, inspect


Map.prototype.hash.current = 0;

// --- mapping functions

Map.prototype.get = function(key) {
   var item = this[this.hash(key)];
   return item === undefined ? undefined : item.value;
};

Map.prototype.put = function(key, value) {
   var hash = this.hash(key);

   if(this[hash] === undefined) {
      var item = { key : key, value : value };
      this[hash] = item;

      this.link(item);
      ++this.size;
   }
   else this[hash].value = value;

   return this;
};


Map.prototype.remove = function(key) {
   var hash = this.hash(key);
   var item = this[hash];

   if(item !== undefined) {
      --this.size;
      this.unlink(item);

      delete this[hash];
   }

   return this;
};

// only works if linked
Map.prototype.removeAll = function() {
   while(this.size)
      this.remove(this.key());

   return this;
};

// --- linked list helper functions (what?)
// will my structure help?
Map.prototype.link = function(item) {
   if(this.size == 0) {
      item.prev = item;
      item.next = item;
      this.current = item;
   }
   else {
      item.prev = this.current.prev;
      item.prev.next = item;
      item.next = this.current;
      this.current.prev = item;
   }
};

Map.prototype.unlink = function(item) {
   if(this.size == 0)
      this.current = undefined;
   else {
      item.prev.next = item.next;
      item.next.prev = item.prev;
      if(item === this.current)
         this.current = item.next;
   }
};

// --- iterator

Map.prototype.next = function() {
   this.current = this.current.next;
}

Map.prototype.key = function() {
   return this.current.key;
};

Map.prototype.value = function() {
   return this.current.value;
};
