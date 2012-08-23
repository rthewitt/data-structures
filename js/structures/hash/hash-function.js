/*
   Use this hash function to build a map
*/

function hash() {
   return (typeof value) + ' ' + (value instanceof Object ?
      (value.__hash || (value.__hash = ++arguments.callee.current)) :
      value.toString());
}

hash.current = 0;
