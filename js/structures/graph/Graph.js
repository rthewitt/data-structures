/*
 * Graph Data structure for demo / activity purposes.
 *
 * I'm finding out very quickly that I need to get this Node vs. AnimationNode vs. dataNode
 * figured out.  Currently believe that graph will ONLY be a graph of ids.  
 * I'm handling id explicity in some places, but also referencing dataNode and isEqual.
 * If the data contained in the "node" is merely a string (the ID), then I should always handle it this way.
 * Another option is to use a sentinal node - or in this case a SPECIAL node, representing Vertex.
 * That would probably be too expensive to perform the LinkedList lookup. 
*/

// TODO add an init() method, make structures conform to Framework.  Maybe add structures to FrameWork?
// TODO Use the javascript hashmap instead of associative array.
function Graph() {

   var graph = new Object();

   // This returns size of associative array
   // move somewhere more accessible - perhaps extend Object.
   function sizeOf(assoc) {
      var ss = 0, key;
      for(key in assoc) {
         if(assoc.hasOwnProperty(key)) ss++;
      }
      return ss;
   }


//------ Adjacency Linked-List -------------
   function AdjLinkedList() {
      LinkedList.call(this);
   }
   AdjLinkedList.prototype = new LinkedList();
   AdjLinkedList.prototype.constructor = AdjLinkedList;
   // THIS IS TO BE USED INTERNALLY BY GRAPH.  REMEMBER TO DEEP COPY
   AdjLinkedList.prototype.getArray = function( adjArray ) {
      var len = 0;
      var cur;
   
      // TODO Set this back, revert LinkedList and see if getFirst() is a better solution.
      // what is the behavior of first as a var, instead of a this.__something__?
      cur = this.first;
      while(cur) {
         adjArray[len++] = cur.dataNode; // in this case, dataNode refers to Vertex object
         cur = cur.link;
      }
      return len;
   }


   AdjLinkedList.prototype.getIDArray = function( adjArray ) {
      var len = 0;
      var cur;
   
      cur = this.first;
      while(cur) {
         adjArray[len++] = cur.dataNode.value(); // in this case, dataNode refers to Vertex object
         cur = cur.link;
      }
      return len;
   }
//------------------------------------------

// Was going to return a matrix.
// But now I think the matrix should be composed by surrounding
// context.  The purpose and appearance of the matrix is dependent
// on information not available to the structure, as the structure
// only handles mappings between node-ids at this point.
/*
   this.getState = function() {
      var vertices = new Array();
      var fromV = new Array();
      var toV = new Array();
      // will vertices.length work?
      for(var v in graph) {
         vertices.push({id: v, index: vertices.length);
      }
      for(var v in graph) {
         vertices.push({id: v, index: vertices.length);
      }
      //return vertices;
   }
*/

   this.getHiddenState = function() {
      var vertices = new Object();
      for(var v in graph) {
         var partialState = [];
         var numV = graph[v].getIDArray(partialState);
         vertices[v] = {total: numV, edges: partialState};
      }
      return vertices;
   }

   this.createGraph = function( matrix ) {
      graph = new Array( matrix.length );

      for(var i=0; i<matrix.length; i++) {
         // Set up the array of linked lists for this vertex
         graph[i] = new AdjLinkedList();

         for(var j=0; j<matrix.length; j++) {
            // Rules for graph loops?  Currently _DISALLOWING_
            if( i !== j && matrix[i][j] > 0) {
               // The matrix will probably not be just adjacency values
               // unless separate list of vertex nodes provided...
               graph[i].insertLast( matrix[i][j] );
            }
         }
      }
   }

   this.addVertex = function(vertex) {
      var vID = vertex.value();
      if(!(vID in graph)) {
         graph[vID] = new AdjLinkedList();
         //graph[vID].insertLast(new Vertex(vID) );
      }
   }

   this.removeVertex = function(vertex) {
      var vID = vertex.value();
      if(vID in graph) delete graph[vID];
      // TODO verify that we're only grabbing Lists...
      for(var v in graph)
         graph[v].remove(vertex); // no need to search
   }

/*
   this.connectVertices = function(fromId, toId) {
      if(graph[fromId] && graph[toId]) {
         var adj = graph[fromId];
         if(! adj.find( new Vertex(toId) )) adj.insertLast(toId);
      } else throw 'Cannot connect vertices that do not exist';
   }
*/

   // This version accepts vertices, not ids
   this.connectVertices = function(from, to) {
      var fromId = from.value();
      var toId = to.value();
      if(graph[fromId] && graph[toId]) {
         var adj = graph[fromId];
         if(! adj.find( to )) adj.insertLast(to);
      } else throw 'Cannot connect vertices that do not exist';
   }

   // Will I ever need to worry about asynch additions / deletes?!
   this.initGraph = function() {
      if(!this.isEmpty())
         for(var d=0, z=sizeOf(graph); d < z; d++)
            delete graph[d];
   }

   this.isEmpty = function() {
      return ( sizeOf(graph) <= 0 );
   }

   this.toString = function() {
      var stRep = '';
      var state = this.getHiddenState();
      for(var v in state) {
         stRep += v + ': ';
         for(var e=0; e<state[v].total; e++)
            stRep += state[v].edges[e] + (e<state[v].total-1 ? ',' : '');
         stRep +='\n';
      }
      return stRep;
   }


}
