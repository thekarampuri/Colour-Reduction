const fs = require('fs');
const path = require('path');

const newLogic = `
/*━━ SELECTION TOOLS (MAGIC WAND & LASSO) ━━*/
function initSelectionMask() {
  const w=CR.width, h=CR.height;
  if (!selectionMask || selectionMask.length !== w*h) selectionMask = new Uint8Array(w*h);
  else selectionMask.fill(0);
  hasSelection = false;
  drawSelectionOverlay();
}

function drawSelectionOverlay() {
  if(!CS)return;
  if (CS.width !== CR.width || CS.height !== CR.height) {
    CS.width = CR.width; CS.height = CR.height;
  }
  const ctx = CS.getContext('2d');
  ctx.clearRect(0,0,CS.width,CS.height);
  
  if (hasSelection && selectionMask) {
    const id = ctx.createImageData(CS.width, CS.height);
    const d = id.data;
    for(let i=0; i<selectionMask.length; i++) {
      if(selectionMask[i]) {
        const idx = i*4;
        d[idx]=0; d[idx+1]=120; d[idx+2]=212; d[idx+3]=100;
      }
    }
    ctx.putImageData(id, 0, 0);
  }
  
  if (lassoPoints && lassoPoints.length > 0) {
    ctx.strokeStyle = '#0078d4';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
    for(let i=1; i<lassoPoints.length; i++) ctx.lineTo(lassoPoints[i].x, lassoPoints[i].y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (floatingSelection) {
    ctx.drawImage(floatingSelection.canvas, floatingSelection.x, floatingSelection.y);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(floatingSelection.x, floatingSelection.y, floatingSelection.canvas.width, floatingSelection.canvas.height);
    ctx.setLineDash([]);
  }

  CS.style.width = (CR.width*zoom)+'px';
  CS.style.height = (CR.height*zoom)+'px';
  if(curTab==='reduced') CS.style.display='block';
  else CS.style.display='none';
}

function doMagicWandAt(e) {
  const pos = getCanvasPx(e, CR); if (!pos) return;
  if (!e.shiftKey && !floatingSelection) initSelectionMask();
  if (floatingSelection) commitFloatingSelection();

  const ctx = CR.getContext('2d'), id = ctx.getImageData(0,0,CR.width,CR.height), d = id.data, w = CR.width, h = CR.height;
  const idx = (pos.y * w + pos.x) * 4;
  const tr = d[idx], tg = d[idx+1], tb = d[idx+2];
  
  const visited = new Uint8Array(w*h);
  const stack = [pos.y * w + pos.x];
  const tol = 0;
  
  if (!selectionMask || selectionMask.length !== w*h) selectionMask = new Uint8Array(w*h);

  while(stack.length) {
    const p = stack.pop();
    if(visited[p]) continue;
    visited[p] = 1;
    const x = p % w, y = Math.floor(p / w), i = p * 4;
    if(Math.abs(d[i]-tr)<=tol && Math.abs(d[i+1]-tg)<=tol && Math.abs(d[i+2]-tb)<=tol) {
      selectionMask[p] = 1;
      hasSelection = true;
      if(x+1<w && !visited[p+1]) stack.push(p+1);
      if(x-1>=0 && !visited[p-1]) stack.push(p-1);
      if(y+1<h && !visited[p+w]) stack.push(p+w);
      if(y-1>=0 && !visited[p-w]) stack.push(p-w);
    }
  }
  drawSelectionOverlay();
}

let isLassoing = false;
VP.addEventListener('mousedown', e => {
  if (activeTool === 'lasso' && curTab === 'reduced' && e.button === 0) {
    if (!e.shiftKey && !floatingSelection) initSelectionMask();
    if (floatingSelection) commitFloatingSelection();
    const pos = getCanvasPx(e, CR); if (!pos) return;
    isLassoing = true;
    lassoPoints = [pos];
    e.preventDefault(); e.stopPropagation();
  }
}, {capture: true});
window.addEventListener('mousemove', e => {
  if (isLassoing) {
    const pos = getCanvasPx(e, CR);
    if (pos) { lassoPoints.push(pos); drawSelectionOverlay(); }
  }
});
window.addEventListener('mouseup', e => {
  if (isLassoing) {
    isLassoing = false;
    if (lassoPoints.length > 2) {
      const w = CR.width, h = CR.height;
      if (!selectionMask || selectionMask.length !== w*h) selectionMask = new Uint8Array(w*h);
      const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
      const tCtx = tmp.getContext('2d');
      tCtx.fillStyle = '#fff';
      tCtx.beginPath();
      tCtx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
      for(let i=1; i<lassoPoints.length; i++) tCtx.lineTo(lassoPoints[i].x, lassoPoints[i].y);
      tCtx.closePath();
      tCtx.fill();
      const td = tCtx.getImageData(0,0,w,h).data;
      for(let i=0; i<td.length; i+=4) {
        if (td[i] > 128) { selectionMask[i/4] = 1; hasSelection = true; }
      }
    }
    lassoPoints = [];
    drawSelectionOverlay();
  }
});

let isSelectionMoving = false, moveStartX = 0, moveStartY = 0;
VP.addEventListener('mousedown', e => {
  if (activeTool === 'move' && curTab === 'reduced' && e.button === 0) {
    const pos = getCanvasPx(e, CR); if (!pos) return;
    if (hasSelection && !floatingSelection) {
      if (selectionMask[pos.y * CR.width + pos.x] === 1) {
        extractSelectionToFloat(!e.altKey);
      } else {
        initSelectionMask(); return;
      }
    }
    if (floatingSelection) {
      if (pos.x >= floatingSelection.x && pos.x <= floatingSelection.x + floatingSelection.canvas.width &&
          pos.y >= floatingSelection.y && pos.y <= floatingSelection.y + floatingSelection.canvas.height) {
        isSelectionMoving = true;
        moveStartX = pos.x - floatingSelection.x;
        moveStartY = pos.y - floatingSelection.y;
        e.preventDefault(); e.stopPropagation();
      } else {
        commitFloatingSelection();
      }
    }
  }
}, {capture: true});
window.addEventListener('mousemove', e => {
  if (isSelectionMoving && floatingSelection) {
    const pos = getCanvasPx(e, CR) || { x: 0, y: 0 };
    floatingSelection.x = pos.x - moveStartX;
    floatingSelection.y = pos.y - moveStartY;
    drawSelectionOverlay();
  }
});
window.addEventListener('mouseup', e => {
  if (isSelectionMoving) isSelectionMoving = false;
});
window.addEventListener('keydown', e => {
  if ((e.key === 'Escape' || e.key === 'Enter') && floatingSelection) {
    commitFloatingSelection();
  } else if (e.key === 'Escape' && hasSelection) {
    initSelectionMask();
  }
});

function extractSelectionToFloat(cut) {
  if (!hasSelection || !selectionMask) return;
  const w = CR.width, h = CR.height;
  let minX=w, minY=h, maxX=0, maxY=0;
  for(let y=0;y<h;y++) {
    for(let x=0;x<w;x++) {
      if(selectionMask[y*w+x]) {
        if(x<minX) minX=x; if(x>maxX) maxX=x;
        if(y<minY) minY=y; if(y>maxY) maxY=y;
      }
    }
  }
  const fw = maxX - minX + 1, fh = maxY - minY + 1;
  if(fw<=0 || fh<=0) return;
  
  const ctx = CR.getContext('2d');
  const src = ctx.getImageData(0,0,w,h);
  
  const fcv = document.createElement('canvas'); fcv.width = fw; fcv.height = fh;
  const fCtx = fcv.getContext('2d');
  const fd = fCtx.createImageData(fw, fh);
  
  if (cut) pushUndo();
  
  for(let y=0;y<h;y++) {
    for(let x=0;x<w;x++) {
      const idx = y*w+x;
      if (selectionMask[idx]) {
        const sx = idx*4;
        const fx = ((y-minY)*fw + (x-minX))*4;
        fd.data[fx]=src.data[sx]; fd.data[fx+1]=src.data[sx+1]; fd.data[fx+2]=src.data[sx+2]; fd.data[fx+3]=255;
        if (cut) {
          src.data[sx]=255; src.data[sx+1]=255; src.data[sx+2]=255; src.data[sx+3]=255;
        }
      }
    }
  }
  
  fCtx.putImageData(fd, 0, 0);
  if (cut) ctx.putImageData(src, 0, 0);
  
  floatingSelection = { canvas: fcv, x: minX, y: minY };
  hasSelection = false;
  drawSelectionOverlay();
}

function commitFloatingSelection() {
  if (!floatingSelection) return;
  pushUndo();
  const ctx = CR.getContext('2d');
  ctx.drawImage(floatingSelection.canvas, floatingSelection.x, floatingSelection.y);
  floatingSelection = null;
  drawSelectionOverlay();
  if(hlColors.length)renderHL();
  if(typeof updatePaletteAfterFill === "function") updatePaletteAfterFill();
}
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert logic before VP CLICK
  if (!content.includes('function initSelectionMask()')) {
    content = content.replace('/*━━ VP CLICK ━━*/', newLogic + '\n/*━━ VP CLICK ━━*/');
  }

  // Update VP.onclick
  if (!content.includes("else if(activeTool==='magic')doMagicWandAt(e);")) {
    content = content.replace("else if(activeTool==='outline')doOutlineAt(e);", 
      "else if(activeTool==='outline')doOutlineAt(e);\n  else if(activeTool==='magic')doMagicWandAt(e);");
  }

  // Update updateSize
  if (!content.includes('CS.style.width=')) {
    content = content.replace("CH.style.height=(ch*zoom)+'px';", 
      "CH.style.height=(ch*zoom)+'px';\n  if(CS){ CS.style.width=(cw*zoom)+'px';\n  CS.style.height=(ch*zoom)+'px';\n  if (typeof drawSelectionOverlay === 'function') drawSelectionOverlay(); }");
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'e:/Projects/Colour tex/lib/legacyLogic.js',
  'e:/Projects/Colour tex/public/legacyLogic.js'
];

files.forEach(f => {
  if(fs.existsSync(f)) {
    processFile(f);
    console.log("Processed " + f);
  } else {
    console.log("Not found: " + f);
  }
});
