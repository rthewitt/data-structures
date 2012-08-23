var _Draw = (function() {

   var ctx;

   function _setContext(c) {
      ctx = c;
   }

   function _drawNode(nx, ny, nw, nh, color, state) {

      ctx.fillStyle="rgb("+color[0]+", "+color[1]+", "+color[2]+")";
      ctx.fillRect(nx,ny,nw,nh);

      if(state)
         switch(state) {
         case 'breaking':
            _drawNodeBreak(nx, ny+nh, nw);
            _drawNodeConnector(nx,ny+nh+2, nw);
         break;
         case 'connecting':
            _drawNodeMerge(nx, ny+nh, nw);
            _drawNodeConnector(nx,ny+nh+2, nw);
         break;
         case 'connected':
            _drawNodeConnector(nx, ny+nh, nw);
         break;
         }

   }

   function _drawNodeConnector(x, y, w) {
      ctx.strokeStyle="rgb(0, 0, 0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x+w, y);
      ctx.closePath();
      ctx.stroke();
   }

   function _drawNodeBreak(x, y, w) {
      ctx.strokeStyle="rgb(255, 0, 0)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x+w, y);
      ctx.closePath();
      ctx.stroke();
   }

   // Temp (I realize it looks like duplication)
   function _drawNodeMerge(x, y, w) {
      ctx.strokeStyle="rgb(0, 255, 0)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x+w, y);
      ctx.closePath();
      ctx.stroke();
   }

   function _colorfulExample() { 
     ctx.fillStyle = "#00A308";
     ctx.beginPath();
     ctx.arc(220, 220, 50, 0, Math.PI*2, true);
     ctx.closePath();
     ctx.fill();
    
     ctx.fillStyle = "#FF1C0A";
     ctx.beginPath();
     ctx.arc(100, 100, 100, 0, Math.PI*2, true);
     ctx.closePath();
     ctx.fill();
 
     //the rectangle is half transparent
     ctx.fillStyle = "rgba(255, 255, 0, .5)";
     ctx.beginPath();
     ctx.rect(15, 150, 120, 120);
     ctx.closePath();
     ctx.fill();
   }

   return {
      setContext : _setContext,
      drawNode : _drawNode,
      drawNodeConnector : _drawNodeConnector,
      drawNodeBreak : _drawNodeBreak
   }
})()
