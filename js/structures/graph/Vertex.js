//------ Vertex ----------------------------
//  Id (val) must be a simple type
//  When replace TestNode with SimpleNode, can
//  delete most of these assignments.
//------------------------------------------

function Vertex(value) {
      Node.call(this, value);
   }

Vertex.prototype = new Node();

Vertex.prototype.constructor = Vertex;

// Is this replacement deep enough / too deep?
Vertex.prototype.value = function() {
      return val; // will serve as the id of the vertex.  Must be simple type
   }

Vertex.prototype.isEqual = function(otherVertex) {
      return (val === otherVertex.value())
   }
