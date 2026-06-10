"use client";

import React, { useEffect } from 'react';

export default function LegacyApp() {
  useEffect(() => {
    if (document.getElementById('legacy-script')) return;
    const script = document.createElement('script');
    script.id = 'legacy-script';
    script.src = './legacyLogic.js';
    document.body.appendChild(script);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `<div id="app">
<!--━━ SIDEBAR ━━-->
<div id="sidebar">
  <div id="logo">
    <div id="logo-title">Color Reduction</div>
    <div id="logo-sub">Color Reduction</div>
  </div>
  <div id="sb-scroll">

    <!-- Upload -->
    <div class="grp">
      <div class="grp-hdr">Image</div>
      <div class="grp-body">
        <div id="drop">
          <div id="drop-icon">📁</div>
          <div id="drop-label">Click or drop image<br><span style="font-size:10px;color:#aaa">BMP · PNG · JPG · GIF · WEBP</span></div>
        </div>
        <input type="file" id="file-inp" accept="image/*,.bmp" style="display:none"/>
        <div id="file-info"><b id="fi-name">—</b><span id="fi-dim">—</span></div>
        <div class="stat-row" id="fstats" style="display:none">
          <div class="stat-box"><div class="stat-lbl">Size</div><div class="stat-val" id="ss">—</div></div>
          <div class="stat-box"><div class="stat-lbl">Unique</div><div class="stat-val" id="su">—</div></div>
        </div>
      </div>
    </div>

    <!-- Color Picker -->
    <div class="grp">
      <div class="grp-hdr">Color Picker</div>
      <div class="grp-body">
        <button class="win-btn" id="btn-open-cp" style="width:100%;text-align:left;">
          🎯 Color Picker Window
        </button>
        <div id="cp-sidebar-status" style="font-size:10px;color:#888;margin-top:4px;display:none;"></div>
      </div>
    </div>

    <!-- Reduce -->
    <div class="grp">
      <div class="grp-hdr">Reduce</div>
      <div class="grp-body">
        <div class="field-row">
          <label class="field-lbl">Colors</label>
          <input type="number" class="win-inp" id="cnt-inp" min="2" max="256" placeholder="2–256" disabled/>
        </div>
        <div id="cnt-msg"></div>
      </div>
    </div>

    <!-- Tools (shown after reduce) -->
    <div class="grp" id="tools-sec" style="display:none">
      <div class="grp-hdr">🛠 Tools</div>
      <div class="grp-body" style="padding:4px 6px;">
        <div class="tool-tabs">
          <button class="ttab" id="ttab-tile" title="Tile">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><rect x="0" y="0" width="5" height="5" rx="1"/><rect x="8" y="0" width="5" height="5" rx="1"/><rect x="0" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/></svg>
          </button>
          <button class="ttab" id="ttab-fill" title="Fill">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M2 14h12v1.5H2zm1.5-2.5 4-9 4 9H3.5zm4-7L5.2 10h4.6L7.5 4.5z"/><circle cx="13" cy="10" r="2.5"/></svg>
          </button>
          <button class="ttab" id="ttab-paint" title="Paint">🖌</button>
          <button class="ttab" id="ttab-outline" title="Outline">⬜</button>
          <button class="ttab" id="ttab-magic" title="Magic Wand">✨</button>
          <button class="ttab" id="ttab-lasso" title="Lasso Selection">➰</button>
        </div>
      </div>
    </div>

    <!-- Inline Tool Panel (shown when a tool is active, directly below tools) -->
    <div id="sb-tool-panel">
      <div id="sb-tool-panel-body"></div>
    </div>

    </div><!-- sb-scroll END -->

  <!-- Actions bar -->
  <div id="actions">
    <div id="mode-badge"></div>
    <div id="status">Processing…</div>
    <button class="win-btn primary" id="btn-reduce" disabled>▶ Reduce Colors</button>
    <div id="undo-row">
      <button id="btn-undo" disabled title="Undo (Ctrl+Z)">← Undo</button>
      <span id="hist-cnt">0/10</span>
      <button id="btn-redo" disabled title="Redo (Ctrl+Y)">Redo →</button>
    </div>
    <div class="act-row">
      <button class="win-btn" id="btn-cmap">🎨 Map</button>
      <button class="win-btn" id="btn-lib">📚 Library</button>
      <button class="win-btn" id="btn-exp">↓ Export</button>
    </div>
  </div>

  <!-- Brand logo at bottom of sidebar -->
  <div id="sb-brand">
    <img src="logo/logo.PNG" alt="By Bhagya Lakshmi and Devi Priya" width="140">
  </div>


</div><!-- sidebar END -->

<!-- ━━ TOOL POPUP WINDOWS ━━ -->
<div class="tool-popup" id="popup-tile">
  <div class="tool-popup-hdr" id="popup-tile-hdr">
    <span>⊞ Tile</span>
    <button class="tool-popup-close" onclick="closeToolPopup('tile')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-tile">
      <div class="tile-grid">
        <div class="tile-field"><label>Repeat X</label><input type="number" id="tile-x" value="1" min="1" max="16"/></div>
        <div class="tile-field"><label>Repeat Y</label><input type="number" id="tile-y" value="1" min="1" max="16"/></div>
      </div>
      <div id="tile-info" style="margin-top:4px"></div>
    </div>
  </div>
</div>

<div class="tool-popup" id="popup-fill">
  <div class="tool-popup-hdr" id="popup-fill-hdr">
    <span>🪣 Fill</span>
    <button class="tool-popup-close" onclick="closeToolPopup('fill')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-fill">
      <div class="fill-modes">
        <button class="fmode on" id="fmode-single">Single</button>
        <button class="fmode" id="fmode-similar">Similar</button>
      </div>
      <div class="tool-active-color-row">
        <span class="tool-color-lbl">Color</span>
        <div class="tool-active-sw" id="fill-active-sw"></div>
      </div>
    </div>
  </div>
</div>

<div class="tool-popup" id="popup-paint">
  <div class="tool-popup-hdr" id="popup-paint-hdr">
    <span>🖌 Paint</span>
    <button class="tool-popup-close" onclick="closeToolPopup('paint')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-paint">
      <div class="field-row" style="margin-bottom:6px;">
        <label class="field-lbl" style="width:62px;">Brush px</label>
        <input type="number" class="win-inp" id="paint-size-inp" min="1" max="64" value="1" style="width:58px;text-align:center;font-size:13px;font-weight:700;"/>
        <span style="font-size:10px;color:#888;">px</span>
      </div>
      <div class="tool-active-color-row">
        <span class="tool-color-lbl">Color</span>
        <div class="tool-active-sw" id="paint-active-sw"></div>
      </div>
    </div>
  </div>
</div>

<div class="tool-popup" id="popup-outline">
  <div class="tool-popup-hdr" id="popup-outline-hdr">
    <span>⬜ Outline</span>
    <button class="tool-popup-close" onclick="closeToolPopup('outline')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-outline">
      <div class="tool-active-color-row">
        <span class="tool-color-lbl">Outline Color</span>
        <div class="tool-active-sw" id="outline-active-sw"></div>
      </div>
      <div style="margin:5px 0 3px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:9px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.4px;">Color Group</span>
        <button id="ol-group-pick-btn" title="Click to enter pick mode — click canvas colors to add to group" style="font-size:9px;padding:2px 7px;border:1px solid #0078d4;background:#e8f4ff;color:#0055a0;border-radius:2px;cursor:pointer;font-weight:700;">🎯 Pick Colors</button>
      </div>
      <div id="ol-group-strip" style="display:flex;flex-wrap:wrap;gap:3px;min-height:22px;padding:4px;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:3px;margin-bottom:5px;"></div>
      <div style="display:flex;gap:4px;margin-bottom:6px;">
        <button id="ol-group-clear" class="ol-act-btn" style="flex:1;background:#fff3f3;border:1px solid #d32f2f;border-radius:2px;padding:4px 6px;font-size:10px;color:#d32f2f;cursor:pointer;">✕ Clear Group</button>
      </div>
      <div class="ol-prop-row">
        <span class="ol-prop-lbl">Area</span>
        <div class="ol-radio-grp">
          <label class="ol-radio"><input type="radio" name="ol-area" id="ol-area-single" checked/> Single</label>
          <label class="ol-radio"><input type="radio" name="ol-area" id="ol-area-all"/> Similar</label>
        </div>
      </div>
      <div class="ol-prop-row">
        <span class="ol-prop-lbl">Type</span>
        <div class="ol-radio-grp">
          <label class="ol-radio"><input type="radio" name="ol-type" id="ol-type-inside" checked/> Inside</label>
          <label class="ol-radio"><input type="radio" name="ol-type" id="ol-type-outside"/> Outside</label>
        </div>
      </div>
      <div class="ol-prop-row">
        <span class="ol-prop-lbl">Shape</span>
        <select class="ol-shape-sel" id="ol-shape">
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div style="font-size:9px;font-weight:700;color:#666;margin-top:4px;margin-bottom:3px;text-transform:uppercase;">Direction (px) — center syncs all</div>
      <div class="ol-dir-grid" id="ol-dir-grid">
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="tl" type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="t"  type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="tr" type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="l"  type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp ol-dir-all" id="ol-dir-center-inp" type="number" value="1" min="0" max="99" title="Set all 8 directions at once"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="r"  type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="bl" type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="b"  type="number" value="1" min="0" max="99"/></div>
        <div class="ol-dir-cell"><input class="ol-dir-inp" data-dir="br" type="number" value="1" min="0" max="99"/></div>
      </div>
      <div id="outline-status"></div>
    </div>
  </div>
</div>

<div class="tool-popup" id="popup-magic">
  <div class="tool-popup-hdr" id="popup-magic-hdr">
    <span>✨ Magic Wand</span>
    <button class="tool-popup-close" onclick="closeToolPopup('magic')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-magic">
      <div class="fill-modes">
        <button class="fmode on" id="mmode-single">Single</button>
        <button class="fmode" id="mmode-similar">Similar</button>
      </div>
    </div>
  </div>
</div>

<div class="tool-popup" id="popup-move">
  <div class="tool-popup-hdr" id="popup-move-hdr">
    <span>✥ Move</span>
    <button class="tool-popup-close" onclick="closeToolPopup('move')">✕</button>
  </div>
  <div class="tool-popup-body">
    <div class="tp" id="tp-move">
      <div class="move-hint" style="font-size:11px;color:#666;line-height:1.7;">Drag the canvas to scroll / pan the view.</div>
    </div>
  </div>
</div>

<!--━━ RIGHT PANEL ━━-->
<div id="right">
  <div id="toolbar">
    <button class="tb on" data-tab="orig">Original</button>
    <button class="tb" data-tab="reduced" disabled>Reduced</button>
    <div id="tb-sep"></div>
    <div id="tile-badge">
      <span id="tile-badge-txt">⊞ Tiled</span>
      <button id="tile-badge-rst" title="Reset tiling">✕</button>
    </div>
    <div id="tb-sp"></div>
    <button id="btn-pan" title="Hand · Hold &amp; drag to pan (H / Middle-click)">✋</button>
    <div id="eye-live">
      <div id="el-sw"></div>
      <span id="el-hex"></span>
      <span id="el-rgb" style="color:#aaa;margin-left:2px"></span>
    </div>
    <div id="zrow">
      <button class="zb" id="btn-zo">−</button>
      <div id="zpct">100%</div>
      <button class="zb" id="btn-zi">+</button>
      <button id="btn-z1">1:1</button>
      <button id="btn-grid" title="Toggle pixel grid (visible at 4x+ zoom)">⊞ Grid</button>
    </div>
  </div>

  <!-- Canvas + right palette panel side by side -->
  <div id="canvas-row">
    <div id="vp">
      <div id="empty">
        <div id="empty-icon">🖼</div>
        <div id="empty-txt">OPEN AN IMAGE TO BEGIN</div>
      </div>
      <div id="ssp" style="width:100%;height:100%;min-width:100%;min-height:100%;">
        <div id="cwrap">
          <canvas id="co"></canvas>
          <canvas id="cr"></canvas>
          <canvas id="ch"></canvas>
          <canvas id="csel"></canvas>
          <canvas id="cgrid"></canvas>
        </div>
      </div>
    </div>

    <!-- Right Tabbed Panel: Library + Color Picker -->
    <div id="rtp">
      <div id="rtp-tabs">
        <button class="rtp-tab on" id="rtp-tab-lib" onclick="rtpSwitch('lib')">📚<br>Library</button>
        <button class="rtp-tab" id="rtp-tab-cp" onclick="rtpSwitch('cp')">🎯<br>Picker</button>
      </div>

      <!-- Library Pane -->
      <div class="rtp-pane on" id="rtp-pane-lib">
        <div id="rtp-lib-hdr">
          Drag → palette to replace
          <div id="rtp-lib-group-row">
            <select id="lib-panel-grp"></select>
            <button id="lib-panel-new-grp" title="Create group in Color Library">+</button>
          </div>
        </div>
        <div id="lib-panel-scroll"></div>
        <!-- Unified Add / Edit bar -->
        <div id="lp-add-bar">
          <input type="color" id="lp-add-ci" value="#0078d4"/>
          <input type="text" id="lp-add-ni" placeholder="Shade name…" maxlength="20" style="flex:1;min-width:0;"/>
          <div style="display:flex;flex-direction:column;gap:2px;flex-shrink:0;">
            <button id="lp-add-btn">+ Add</button>
            <button id="lp-edit-cancel" style="display:none;font-size:9px;padding:1px 4px;background:#e1e1e1;border:1px solid #adadad;color:#555;border-radius:1px;cursor:pointer;">✕</button>
          </div>
        </div>
      </div>

      <!-- Color Picker Pane -->
      <div class="rtp-pane" id="rtp-pane-cp">
        <!-- Live color preview -->
        <div id="rtp-cp-live">
          <div id="rtp-cp-sw"></div>
          <div>
            <div id="rtp-cp-hex">—</div>
            <div id="rtp-cp-rgb">Hover image</div>
          </div>
        </div>
        <!-- Reduce bar -->
        <div id="rtp-cp-reduce">
          <input type="number" id="rtp-reduce-inp" min="2" max="256" placeholder="auto"/>
          <button id="rtp-reduce-btn" disabled>▶</button>
          <div id="rtp-reduce-msg"></div>
        </div>
        <!-- Sampled swatches -->
        <div id="rtp-cp-grid">
          <div id="rtp-cp-swatches"></div>
          <div id="rtp-cp-empty">No colors yet<br><small>Enable Eyedrop<br>&amp; click image</small></div>
        </div>
        <!-- Footer -->
        <div id="rtp-cp-footer">
          <button class="win-btn" id="rtp-eye-btn">◎</button>
          <span id="rtp-count">0</span>
          <button class="win-btn" id="rtp-clear-btn">✕</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Palette Strip -->
  <div id="rpal">
    <div id="rpal-resize-handle" title="Drag to resize palette"></div>
    <div id="rpal-hdr">
      <span id="rpal-hdr-title">Palette — Click swatch to fill Library Add bar</span>
      <button id="btn-hl-mode" title="Toggle Highlight Mode — then click a swatch to highlight it on canvas" style="padding:2px 7px;font-size:10px;background:#e1e1e1;border:1px solid #adadad;border-radius:2px;cursor:pointer;color:#555;transition:all .12s;white-space:nowrap;">🔦 Highlight</button>
      <div id="rpal-ctrl">
        <label>Dim</label>
        <input type="number" id="rpal-dim-inp" min="0" max="100" value="80" title="Overlay darkness when highlighting"/>
        <span id="rpal-dim-pct">%</span>
      </div>
    </div>
    <div style="display:flex;flex:1;overflow:hidden;align-items:flex-start;">
      <div id="rpal-scroll"></div>
      <button id="rpal-clear" title="Clear highlight (Esc)">✕ Clear</button>
    </div>
  </div>

  <!-- Keep pstrip in DOM for legacy refs but hide it -->
  <div id="pstrip" style="display:none">
    <span id="plbl"></span>
    <div id="hl-opacity-wrap" style="display:none">
      <input type="number" id="hl-opacity-inp" value="80"/>
    </div>
    <button id="hl-clear" style="display:none"></button>
  </div>
</div><!-- right -->

<div id="etip">
  <div id="et-sw"></div>
  <span id="et-hex" style="font-weight:600;font-family:monospace"></span>
  <span id="et-rgb" style="color:#aaa;font-family:monospace"></span>
</div>

<!--━━ COLOR MAP ━━-->
<div class="ov" id="cm-ov">
  <div class="mwin" id="cm-win">
    <div class="mhdr" id="cm-hdr">
      <div class="mtitle">Color Map <span id="cm-badge" style="font-size:10px;color:#888;font-weight:400;margin-left:6px"></span></div>
      <button class="mclose" id="cm-close">✕</button>
    </div>
    <div id="cm-steps">
      <div class="cstep"><div class="csn">1</div>Swatch</div><div class="csa">→</div>
      <div class="cstep"><div class="csn">2</div>Usage %</div><div class="csa">→</div>
      <div class="cstep"><div class="csn">3</div>Replace</div><div class="csa">→</div>
      <div class="cstep"><div class="csn">📚</div>Library</div>
    </div>
    <div id="cm-list"><div class="cm-empty">Reduce an image first</div></div>
    <div class="mfoot">
      <button class="win-btn primary" id="cm-apply-all">Apply All</button>
      <div class="mfoot-note" id="cm-fnote"></div>
    </div>
    <div id="cm-resize"></div>
  </div>
</div>

<!--━━ COLOR PICKER WINDOW ━━-->
<div class="ov" id="cp-ov" style="z-index:1500">
  <div class="mwin" id="cp-win">
    <!-- Title bar with traffic-light buttons -->
    <div class="mhdr" id="cp-hdr">
      <div class="mtitle" style="font-size:12px;">🎯 Color Picker</div>
      <div id="cp-win-btns">
        <div class="cp-wbtn" id="cp-btn-min" title="Minimize">—</div>
        <div class="cp-wbtn" id="cp-btn-max" title="Maximize">⤢</div>
        <div class="cp-wbtn" id="cp-btn-close" title="Close">✕</div>
      </div>
    </div>
    <!-- Live preview -->
    <div id="cp-live-bar">
      <div id="cp-live-sw"></div>
      <div id="cp-live-info">
        <div id="cp-live-hex">—</div>
        <div id="cp-live-rgb">Hover image to preview</div>
      </div>
    </div>
    <!-- Reduce bar -->
    <div id="cp-reduce-bar">
      <label>Reduce to</label>
      <input type="number" id="cp-reduce-inp" min="2" max="256" placeholder="auto"/>
      <span id="cp-reduce-msg"></span>
      <button id="cp-reduce-btn" disabled>▶ Reduce</button>
    </div>
    <!-- Eyedrop hint -->
    <div id="cp-use-hint">◉ Eyedrop ON — click image pixels to pick colors</div>
    <!-- Colors grid -->
    <div id="cp-body">
      <div id="cp-sampled-grid"></div>
      <div id="cp-empty">No colors yet<br><small>Enable Eyedrop &amp; click image</small></div>
    </div>
    <!-- Footer -->
    <div id="cp-footer">
      <button class="win-btn" id="cp-eye-btn">◎ Eyedrop</button>
      <span id="cp-count-badge">0 colors</span>
      <button class="win-btn" id="cp-clear-btn">✕ Clear</button>
    </div>
    <!-- Resize handle -->
    <div id="cp-resize"></div>
  </div>
</div>

<!--━━ UNIFIED LIBRARY WINDOW (manager + chooser) ━━-->
<div class="ov" id="lm-ov">
  <div class="mwin" id="lm-win">
    <div class="mhdr" id="lm-hdr">
      <div class="mtitle" id="lm-title">Color Library<span id="lm-mode-badge"></span></div>
      <div id="lm-win-btns">
        <div class="lm-wbtn" id="lm-btn-min" title="Minimize">—</div>
        <div class="lm-wbtn" id="lm-btn-max" title="Maximize">⤢</div>
        <div class="lm-wbtn" id="lm-btn-close" title="Close">✕</div>
      </div>
    </div>
    <!-- File save/load toolbar -->
    <div id="lm-file-bar">
      <span>FILE</span>
      <button class="lm-file-btn" id="lm-btn-connect" title="Connect to ColorPallete folder">📁 Connect Folder</button>
      <button class="lm-file-btn" id="lm-btn-save" title="Save library to .sdlib file">💾 Save Library</button>
      <button class="lm-file-btn" id="lm-btn-load" title="Load library from .sdlib file (replaces current)">📂 Load Library</button>
      <button class="lm-file-btn" id="lm-btn-merge" title="Merge groups from a .sdlib file into current library">⊕ Merge File</button>
      <input type="file" id="lm-file-inp" accept=".sdlib,.json" style="display:none"/>
      <span id="lm-file-status"></span>
    </div>
    <!-- Fill hint: shown only in pick+fill mode -->
    <div id="lm-fill-hint">
      🎨 Click a color swatch to apply it as your fill color · Window stays open
    </div>
    <div class="lib-body" id="lm-body"></div>
    <!-- Pick mode selection footer -->
    <div id="lm-sel-bar">
      <div id="lm-sel-sw"></div>
      <div id="lm-sel-hex">— select a color —</div>
      <button id="lm-use-btn" disabled>Use This Color</button>
    </div>
    <!-- Resize handle -->
    <div id="lm-resize"></div>
  </div>
</div>

<!-- Right palette swatch context menu -->
<div id="rpal-ctx">
  <div class="ctx-preview">
    <div class="ctx-preview-sw" id="ctx-sw"></div>
    <div>
      <div class="ctx-preview-hex" id="ctx-hex"></div>
      <div class="ctx-preview-pct" id="ctx-pct"></div>
    </div>
  </div>
  <div class="ctx-item" id="ctx-lib"><span class="ctx-ico">📚</span> Replace from Library</div>
  <div class="ctx-sep"></div>
  <div class="ctx-item" id="ctx-copy"><span class="ctx-ico">📋</span> Copy Hex</div>
  <div class="ctx-item" id="ctx-hl"><span class="ctx-ico">🔦</span> Highlight on Canvas</div>
</div>

</div><!-- app -->
<script>
/*━━ HELPERS ━━*/
const \$=id=>document.getElementById(id);
const toHex=([r,g,b])=>'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
const hexToRgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const isHex=h=>/^#[0-9a-fA-F]{6}\$/.test(h);
const cdist=(a,b)=>Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2);
const clamp=(v,mn,mx)=>Math.max(mn,Math.min(mx,v));
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const ZSTEPS=[0.1,0.25,0.5,0.75,1,1.5,2,3,4,6,8,10,12];
function uid(){return Math.random().toString(36).slice(2,9);}

function unlockApp(){
  document.body.classList.remove('activation-locked');
  \$('activation-gate').classList.add('hidden');
}
async function initActivationGate(){
  const gate=\$('activation-gate');
  const input=\$('activation-input');
  const error=\$('activation-error');
  const hwIdEl=\$('activation-hw-id');
  let machineId='BROWSER-MODE';
  let licensed=false;

  if(window.license){
    try{
      const info=await window.license.getInfo();
      machineId=info.machineId||machineId;
      licensed=!!info.licensed;
    }catch(e){
      console.error('Machine ID generation failed:', e);
      error.textContent='Unable to read Machine ID';
    }
  }

  hwIdEl.textContent=machineId;
  if(licensed){unlockApp();return;}
  gate.classList.remove('hidden');
  setTimeout(()=>input.focus(),0);
  \$('activation-copy').onclick=async()=>{
    try{
      await navigator.clipboard.writeText(machineId);
      error.textContent='Machine ID copied';
    }catch(e){
      error.textContent='Copy failed';
    }
  };
  const tryActivate=async()=>{
    if(!window.license){
      error.textContent='License check requires the desktop app';
      return;
    }
    try{
      const result=await window.license.validate(input.value);
      if(result.ok){
        error.textContent='';
        unlockApp();
        return;
      }
    }catch(e){
      console.error('License validation failed:', e);
    }
    error.textContent='Invalid license key';
    input.select();
  };
  \$('activation-btn').onclick=tryActivate;
  input.onkeydown=e=>{if(e.key==='Enter')tryActivate();};
}
initActivationGate();

/*━━ COLOR ALGORITHMS ━━*/
function countUnique(d){const s=new Set();for(let i=0;i<d.length;i+=4)if(d[i+3]>10)s.add((d[i]<<16)|(d[i+1]<<8)|d[i+2]);return s.size;}
function samplePx(d,max=5000){const o=[],t=d.length/4,st=Math.max(1,Math.floor(t/max));for(let i=0;i<t;i+=st){const x=i*4;if(d[x+3]>128)o.push([d[x],d[x+1],d[x+2]]);}return o;}
function kMeans(px,k,it=12){
  if(!px.length)return Array.from({length:k},()=>[128,128,128]);
  const c=[px[Math.floor(Math.random()*px.length)]];
  while(c.length<k){const ds=px.map(p=>Math.min(...c.map(cc=>cdist(p,cc))));const s=ds.reduce((a,b)=>a+b,0);let r=Math.random()*s,ch=px[px.length-1];for(let j=0;j<px.length;j++){r-=ds[j];if(r<=0){ch=px[j];break;}}c.push(ch);}
  let a=new Array(px.length).fill(0);
  for(let i=0;i<it;i++){
    for(let j=0;j<px.length;j++){let b=0,bd=1e9;for(let q=0;q<k;q++){const d=cdist(px[j],c[q]);if(d<bd){bd=d;b=q;}}a[j]=b;}
    const s=Array.from({length:k},()=>[0,0,0,0]);
    for(let j=0;j<px.length;j++){const cc=a[j];s[cc][0]+=px[j][0];s[cc][1]+=px[j][1];s[cc][2]+=px[j][2];s[cc][3]++;}
    for(let j=0;j<k;j++)if(s[j][3]>0)c[j]=[Math.round(s[j][0]/s[j][3]),Math.round(s[j][1]/s[j][3]),Math.round(s[j][2]/s[j][3])];
  }
  return c;
}
function extractAllUnique(d){
  const map=new Map();
  for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const k=(d[i]<<16)|(d[i+1]<<8)|d[i+2];if(!map.has(k))map.set(k,[d[i],d[i+1],d[i+2]]);}
  return[...map.values()];
}
function applyPal(d,pal){const o=new Uint8ClampedArray(d);for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const p=[d[i],d[i+1],d[i+2]];let b=0,bd=1e9;for(let j=0;j<pal.length;j++){const dd=cdist(p,pal[j]);if(dd<bd){bd=dd;b=j;}}o[i]=pal[b][0];o[i+1]=pal[b][1];o[i+2]=pal[b][2];o[i+3]=d[i+3];}return o;}
function sortByCoverage(pal,imageData){
  // Count pixels matching each palette entry in imageData
  const d=imageData.data,counts=new Array(pal.length).fill(0);
  let total=0;
  for(let i=0;i<d.length;i+=4){
    if(d[i+3]<128)continue;total++;
    const p=[d[i],d[i+1],d[i+2]];
    let best=0,bd=1e9;
    for(let j=0;j<pal.length;j++){const dd=cdist(p,pal[j]);if(dd<bd){bd=dd;best=j;}}
    counts[best]++;
  }
  // Sort palette high→low by count; attach coverage % to each entry
  const indexed=pal.map((c,i)=>({c,count:counts[i],pct:total>0?(counts[i]/total*100):0}));
  indexed.sort((a,b)=>b.count-a.count);
  // Return sorted palette array + coverage map
  return{sorted:indexed.map(x=>x.c),pcts:indexed.map(x=>x.pct)};
}
function measureUsage(pal){const d=CR.getContext('2d').getImageData(0,0,CR.width,CR.height).data,counts=new Array(pal.length).fill(0);let total=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;total++;const p=[d[i],d[i+1],d[i+2]];let b=0,bd=1e9;for(let j=0;j<pal.length;j++){const dd=cdist(p,pal[j]);if(dd<bd){bd=dd;b=j;}}counts[b]++;}return{counts,total};}
function replacePxColor(old,nw,canvas){
  canvas=canvas||CR;const ctx=canvas.getContext('2d'),id=ctx.getImageData(0,0,canvas.width,canvas.height),d=id.data,tol=0;
  for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;if(Math.abs(d[i]-old[0])<=tol&&Math.abs(d[i+1]-old[1])<=tol&&Math.abs(d[i+2]-old[2])<=tol){d[i]=nw[0];d[i+1]=nw[1];d[i+2]=nw[2];}}
  ctx.putImageData(id,0,0);
}


function floodFill(px,py,fillRgb,canvas){
  canvas=canvas||CR;const ctx=canvas.getContext('2d'),id=ctx.getImageData(0,0,canvas.width,canvas.height),d=id.data,w=canvas.width,h=canvas.height;
  const idx=(py*w+px)*4,tr=d[idx],tg=d[idx+1],tb=d[idx+2],[fr,fg,fb]=fillRgb;
  if(tr===fr&&tg===fg&&tb===fb)return;
  const tol=0,visited=new Uint8Array(w*h),stack=[py*w+px];
  while(stack.length){const pos=stack.pop();if(visited[pos])continue;const x=pos%w,y=Math.floor(pos/w);if(x<0||x>=w||y<0||y>=h)continue;const i=pos*4;if(Math.abs(d[i]-tr)>tol||Math.abs(d[i+1]-tg)>tol||Math.abs(d[i+2]-tb)>tol)continue;visited[pos]=1;d[i]=fr;d[i+1]=fg;d[i+2]=fb;if(x+1<w)stack.push(pos+1);if(x-1>=0)stack.push(pos-1);if(y+1<h)stack.push(pos+w);if(y-1>=0)stack.push(pos-w);}
  ctx.putImageData(id,0,0);
}

/*━━ LIBRARY STATE ━━*/
let libraryFolderPath = '';

function libLoad() {
  try {
    if (window.paletteLibrary) {
      const result = window.paletteLibrary.load();
      if (!result.ok) throw new Error(result.error || 'Unable to load palette library');
      libraryFolderPath = result.folder || '';
      return result.library;
    }
    return JSON.parse(localStorage.getItem('bms_lib5') || 'null');
  } catch (e) {
    console.error('Library load failed:', e);
    return null;
  }
}

async function libSave() {
  try {
    if (window.paletteLibrary) {
      const result = await window.paletteLibrary.save(library);
      libraryFolderPath = result.folder || libraryFolderPath;
    } else {
      localStorage.setItem('bms_lib5', JSON.stringify(library));
    }
  } catch (e) {
    console.error('Library save failed:', e);
  }
}

async function initLibraryFolder() {
  try {
    const loaded = libLoad();
    if (loaded) {
      library = loaded;
      libMigrate(library);
      buildLibPanel_right();
    }
    libShowStatus('Folder connected ✓', 'ok');
  } catch (e) {
    console.error('Library folder load failed:', e);
    libShowStatus('Folder load failed', 'err');
  }
}

/*━━ LIBRARY FILE I/O ━━*/
// Save → downloads a .sdlib (JSON) file to disk
function libSaveFile(){
  const payload={
    version:1,
    app:'ColorReduction',
    saved:new Date().toISOString(),
    groups:library
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  const ts=new Date().toISOString().slice(0,19).replace(/[T:]/g,'-');
  a.download='ColorLibrary_'+ts+'.sdlib';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  libShowStatus('Saved ✓','ok');
}
// Load → replaces current library entirely
function libLoadFile(file,merge){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      let data=JSON.parse(ev.target.result);
      // Support both raw array and wrapped {groups:[...]} format
      const groups=Array.isArray(data)?data:(data.groups||null);
      if(!groups||!Array.isArray(groups))throw new Error('Invalid format');
      libMigrate(groups); // ensure {hex,name,opacity}
      if(merge){
        // Merge: add groups that don't already exist by name
        let added=0;
        groups.forEach(g=>{
          if(!library.find(x=>x.name===g.name)){
            library.push({...g,id:uid()});added++;
          } else {
            // Merge colors into existing group (skip duplicates)
            const existing=library.find(x=>x.name===g.name);
            g.colors.forEach(c=>{
              if(!existing.colors.find(x=>x.hex===c.hex)){existing.colors.push(c);}
            });
          }
        });
        libSave();
        libShowStatus('Merged ✓','ok');
      } else {
        library=groups;
        libSave();
        libShowStatus('Loaded ✓','ok');
      }
      // Rebuild the panel if window is open
      if(\$('lm-ov').classList.contains('open')){
        buildLibPanel(\$('lm-body'),libCurrentMode,
          (libCurrentMode==='pick'&&libFillMode)?(h)=>{if(libPickCallback)libPickCallback(h);}:null,
          (libCurrentMode==='pick'&&!libFillMode)?(h)=>{if(libPickCallback)libPickCallback(h);closeLibWindow();}:null
        );
      }
    }catch(err){
      libShowStatus('Error: invalid file','err');
    }
  };
  reader.readAsText(file);
}
let _libStatusTimer=null;
function libShowStatus(msg,type){
  const el=\$('lm-file-status');
  el.textContent=msg;el.className=type;
  clearTimeout(_libStatusTimer);
  _libStatusTimer=setTimeout(()=>{el.className='';el.textContent='';},3000);
}
function libMigrate(lib){
  // Migrate old plain-hex-string format → {hex,name,opacity} objects
  lib.forEach(g=>{g.colors=g.colors.map(c=>typeof c==='string'?{hex:c,name:'',opacity:100}:Object.assign({opacity:100},c));});
  return lib;
}
let library=libLoad();
if(library)libMigrate(library);
if(!library){library=[
  {id:uid(),name:'Warm',colors:[
    {hex:'#ff6b35',name:'Flame',opacity:100},    {hex:'#e63946',name:'Crimson',opacity:100},
    {hex:'#f4a261',name:'Sandy',opacity:100},    {hex:'#e76f51',name:'Coral',opacity:100},
    {hex:'#ffb703',name:'Amber',opacity:100},    {hex:'#fb8500',name:'Tangerine',opacity:100}
  ]},
  {id:uid(),name:'Cool',colors:[
    {hex:'#023e8a',name:'Navy',opacity:100},     {hex:'#0096c7',name:'Ocean',opacity:100},
    {hex:'#48cae4',name:'Sky',opacity:100},      {hex:'#ade8f4',name:'Ice',opacity:100},
    {hex:'#90e0ef',name:'Frost',opacity:100}
  ]},
  {id:uid(),name:'Earthy',colors:[
    {hex:'#606c38',name:'Moss',opacity:100},     {hex:'#283618',name:'Forest',opacity:100},
    {hex:'#dda15e',name:'Wheat',opacity:100},    {hex:'#bc6c25',name:'Bark',opacity:100},
    {hex:'#a7c957',name:'Lime',opacity:100}
  ]},
  {id:uid(),name:'Skin',colors:[
    {hex:'#ffe0bd',name:'Porcelain',opacity:100},{hex:'#ffcd94',name:'Peach',opacity:100},
    {hex:'#e8ac69',name:'Tan',opacity:100},      {hex:'#d4845a',name:'Caramel',opacity:100},
    {hex:'#c06a3c',name:'Bronze',opacity:100},   {hex:'#8d4a2d',name:'Mahogany',opacity:100}
  ]},
  {id:uid(),name:'Grey',colors:[
    {hex:'#ffffff',name:'White',opacity:100},    {hex:'#d0d0d0',name:'Silver',opacity:100},
    {hex:'#a0a0a0',name:'Grey',opacity:100},     {hex:'#707070',name:'Slate',opacity:100},
    {hex:'#404040',name:'Graphite',opacity:100}, {hex:'#101010',name:'Charcoal',opacity:100}
  ]},
  {id:uid(),name:'Custom',colors:[]}
];libSave();}

/*━━ APP STATE ━━*/
const CO=\$('co'),CR=\$('cr'),CH=\$('ch');
const VP=\$('vp'),SSP=\$('ssp'),CWRAP=\$('cwrap');
let imgInfo=null,curTab='orig',cntVal='',cntErr='';
let palette=[],palOrig=[],palPcts=[];
let reducedData=null;   // ImageData backup of single-tile reduced image
let reducedW=0,reducedH=0; // dimensions of single reduced image
let busy=false,pickerOn=false,sampled=[];
let zoom=1;const zoomRef={v:1};
let gridOn=false;
let tileActive=false;
let activeTool=null,fillMode='single';
let hlColors=[]; // array of [r,g,b] — palette multi-selection
let hlOpacity=80; // % darkness of the non-highlighted overlay
let hlMode=false; // true = click on swatch activates highlight
let activeToolColor='#000000'; // shared color for fill/paint/outline tools

function updateActiveToolColor(hex){
  activeToolColor=hex;
  // Update all tool preview swatches
  ['fill','paint','outline'].forEach(id=>{
    const el=\$(id+'-active-sw');if(el)el.style.background=hex;
  });
}
const MAX_HIST=100;
let undoStack=[],redoStack=[];
let tileDebounce=null;

/*━━ UNDO/REDO ━━*/
function pushUndo(){
  if(!imgInfo)return;
  undoStack.push({data:CR.getContext('2d').getImageData(0,0,CR.width,CR.height),w:CR.width,h:CR.height,tiled:tileActive});
  if(undoStack.length>MAX_HIST)undoStack.shift();
  redoStack=[];updateHistUI();
}
function doUndo(){
  if(!undoStack.length)return;
  const cur={data:CR.getContext('2d').getImageData(0,0,CR.width,CR.height),w:CR.width,h:CR.height,tiled:tileActive};
  redoStack.push(cur);if(redoStack.length>MAX_HIST)redoStack.shift();
  restoreEntry(undoStack.pop());updateHistUI();
}
function doRedo(){
  if(!redoStack.length)return;
  const cur={data:CR.getContext('2d').getImageData(0,0,CR.width,CR.height),w:CR.width,h:CR.height,tiled:tileActive};
  undoStack.push(cur);if(undoStack.length>MAX_HIST)undoStack.shift();
  restoreEntry(redoStack.pop());updateHistUI();
}
function restoreEntry(e){
  tileActive=e.tiled;
  CR.width=e.w;CR.height=e.h;
  CR.getContext('2d').putImageData(e.data,0,0);
  if(tileActive){
    \$('tile-badge').classList.add('on');
  } else {
    \$('tile-badge').classList.remove('on');
  }
  updateSize();
}
function updateHistUI(){
  \$('btn-undo').disabled=!undoStack.length;
  \$('btn-redo').disabled=!redoStack.length;
  \$('hist-cnt').textContent=undoStack.length+'/'+MAX_HIST;
}

/*━━ CANVAS LAYOUT ━━*/
function setZoom(z){zoom=z;zoomRef.v=z;\$('zpct').textContent=Math.round(z*100)+'%';updateSize();renderGrid();}

/*━━ PIXEL GRID OVERLAY ━━*/
const CGRID=\$('cgrid');
function renderGrid(){
  if(!imgInfo||!gridOn||zoom<2){
    CGRID.style.display='none';
    return;
  }
  const cw=CR.width||imgInfo.w, ch=CR.height||imgInfo.h;
  const pw=cw*zoom, ph=ch*zoom;
  // Use device pixel ratio for sharp lines
  const dpr=window.devicePixelRatio||1;
  CGRID.width=Math.round(pw*dpr);
  CGRID.height=Math.round(ph*dpr);
  CGRID.style.width=pw+'px';
  CGRID.style.height=ph+'px';
  CGRID.style.display='block';
  const ctx=CGRID.getContext('2d');
  ctx.clearRect(0,0,CGRID.width,CGRID.height);
  // Line style — more subtle at lower zooms
  const alpha=zoom>=6?0.25:zoom>=4?0.18:0.12;
  ctx.strokeStyle=\`rgba(0,0,0,\${alpha})\`;
  ctx.lineWidth=1;
  ctx.beginPath();
  // Vertical lines
  for(let x=0;x<=cw;x++){
    const px=Math.round(x*zoom*dpr)+0.5;
    ctx.moveTo(px,0);ctx.lineTo(px,CGRID.height);
  }
  // Horizontal lines
  for(let y=0;y<=ch;y++){
    const py=Math.round(y*zoom*dpr)+0.5;
    ctx.moveTo(0,py);ctx.lineTo(CGRID.width,py);
  }
  ctx.stroke();
}
function updateSize(){
  if(!imgInfo){SSP.style.width='100%';SSP.style.height='100%';return;}
  const cw=CR.width||imgInfo.w, ch=CR.height||imgInfo.h;
  SSP.style.width=Math.max(cw*zoom+60,VP.clientWidth)+'px';
  SSP.style.height=Math.max(ch*zoom+60,VP.clientHeight)+'px';
  CO.style.width=(imgInfo.w*zoom)+'px';
  CO.style.height=(imgInfo.h*zoom)+'px';
  CR.style.width=(cw*zoom)+'px';
  CR.style.height=(ch*zoom)+'px';
  // CH always matches CR size
  CH.style.width=(cw*zoom)+'px';
  CH.style.height=(ch*zoom)+'px';
  if(CS){ 
    CS.style.width=(cw*zoom)+'px';
    CS.style.height=(ch*zoom)+'px';
    if(typeof drawSelectionOverlay === 'function') drawSelectionOverlay();
  }
  if(CH.width!==cw||CH.height!==ch){
    CH.width=cw;CH.height=ch;
    if(hlColors.length)renderHL();
  } else if(hlColors.length){
    // zoom changed — just re-sync CSS size (pixel data unchanged)
  }
  renderGrid();
}
function showCanvas(){CWRAP.style.visibility='visible';\$('empty').style.display='none';updateSize();}
function switchTab(t){
  curTab=t;
  CO.style.display=t==='orig'?'block':'none';
  CR.style.display=t==='reduced'?'block':'none';
  CH.style.display=(t==='reduced'&&hlColors.length)?'block':'none';
  document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
  if(imgInfo){
    if(t==='reduced'&&imgInfo.reducedUnique!=null){
      \$('su').textContent=imgInfo.reducedUnique.toLocaleString();
    } else {
      \$('su').textContent=imgInfo.originalUnique.toLocaleString();
    }
  }
  updateVpCursor();
}
function updateVpCursor2_NOOP(){}

/*━━ MODE BADGE ━━*/
function updateMode(){
  const mode=sampled.length>0?'A':cntVal&&!cntErr?'B':'C';
  const mb=\$('mode-badge'),br=\$('btn-reduce');
  if(imgInfo&&!busy){
    mb.style.display='block';
    const autoLabel=imgInfo&&imgInfo.originalUnique>256?'Auto · cap to 256':'Auto · keep all colors';
    const labels={A:\`Picker · \${sampled.length} color\${sampled.length>1?'s':''}\`,B:\`Count · reduce to \${cntVal}\`,C:autoLabel};
    mb.textContent=labels[mode];
    br.disabled=false;
  }else{mb.style.display='none';if(!imgInfo||busy)br.disabled=true;}
}

/*━━ COLOR PICKER POP WINDOW ━━*/
let cpMinimized=false,cpMaximized=false,cpRestoreRect=null;

function openCpWindow(){
  const win=\$('cp-win');
  \$('cp-ov').classList.add('open');
  renderSampled();
  updateCpEyeBtn();
  updateCpReduceBtn();
}
function closeCpWindow(){
  \$('cp-ov').classList.remove('open');
  if(pickerOn){pickerOn=false;updateCpEyeBtn();updateVpCursor();\$('etip').style.display='none';\$('eye-live').style.display='none';}
}
function updateCpEyeBtn(){
  const on=pickerOn;
  \$('cp-eye-btn').textContent=on?'◉ Eyedrop ON':'◎ Eyedrop';
  \$('cp-eye-btn').classList.toggle('on',on);
  \$('cp-use-hint').style.display=on?'block':'none';
}
function updateCpReduceBtn(){
  const btn=\$('cp-reduce-btn'),msg=\$('cp-reduce-msg');
  const n=parseInt(\$('cp-reduce-inp').value);
  const hasColors=sampled.length>0;
  const hasImg=!!imgInfo;
  if(!hasImg){btn.disabled=true;msg.textContent='Load image first';msg.style.color='#aaa';return;}
  if(hasColors){
    btn.disabled=false;
    msg.textContent=sampled.length+' picked color'+(sampled.length>1?'s':'');
    msg.style.color='#0078d4';
  } else if(!isNaN(n)&&n>=2&&n<=256){
    btn.disabled=false;
    msg.textContent='→ '+n+' colors';msg.style.color='#388e3c';
  } else {
    btn.disabled=false;
    const lbl=imgInfo.originalUnique>256?'cap 256':'all '+imgInfo.originalUnique;
    msg.textContent=lbl;msg.style.color='#888';
  }
}

// Minimize / Maximize / Restore
function cpMinimize(){
  const win=\$('cp-win');
  if(cpMinimized){
    // Restore
    win.classList.remove('minimized');
    cpMinimized=false;
    \$('cp-btn-min').title='Minimize';
    \$('cp-btn-min').textContent='—';
  } else {
    win.classList.add('minimized');
    cpMinimized=true;
    \$('cp-btn-min').title='Restore';
    \$('cp-btn-min').textContent='▢';
  }
}
function cpMaximize(){
  const win=\$('cp-win');
  if(cpMaximized){
    // Restore from max
    if(cpRestoreRect){
      win.style.left=cpRestoreRect.left;win.style.top=cpRestoreRect.top;
      win.style.width=cpRestoreRect.width;win.style.height=cpRestoreRect.height;
    }
    win.classList.remove('minimized');cpMinimized=false;cpMaximized=false;
    \$('cp-btn-max').title='Maximize';\$('cp-btn-max').textContent='⤢';
    \$('cp-resize').style.display='block';
  } else {
    // Save current and go full screen area
    const r=win.getBoundingClientRect();
    cpRestoreRect={left:win.style.left||r.left+'px',top:win.style.top||r.top+'px',width:win.style.width||r.width+'px',height:win.style.height||r.height+'px'};
    win.style.left='0';win.style.top='0';
    win.style.width='100vw';win.style.height='100vh';
    win.classList.remove('minimized');cpMinimized=false;cpMaximized=true;
    \$('cp-btn-max').title='Restore';\$('cp-btn-max').textContent='❐';
    \$('cp-resize').style.display='none';
  }
}

// Drag
(function(){
  const win=\$('cp-win'),hdr=\$('cp-hdr');
  let drag=false,ox=0,oy=0,wx=0,wy=0;
  hdr.addEventListener('mousedown',e=>{
    if(e.target.classList.contains('cp-wbtn'))return;
    if(e.button!==0||cpMaximized)return;
    const r=win.getBoundingClientRect();
    win.style.transform='none';win.style.right='auto';
    if(!win.style.left||win.style.left==='auto'){win.style.left=r.left+'px';win.style.top=r.top+'px';}
    drag=true;ox=e.clientX;oy=e.clientY;wx=parseFloat(win.style.left)||0;wy=parseFloat(win.style.top)||0;
    e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!drag)return;
    win.style.left=clamp(wx+(e.clientX-ox),0,window.innerWidth-80)+'px';
    win.style.top=clamp(wy+(e.clientY-oy),0,window.innerHeight-40)+'px';
  });
  document.addEventListener('mouseup',()=>{drag=false;});
  hdr.addEventListener('dblclick',e=>{if(!e.target.classList.contains('cp-wbtn'))cpMaximize();});
})();

// Resize from SE corner
(function(){
  const win=\$('cp-win'),handle=\$('cp-resize');
  let resizing=false,sx=0,sy=0,sw=0,sh=0;
  handle.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    resizing=true;sx=e.clientX;sy=e.clientY;
    const r=win.getBoundingClientRect();sw=r.width;sh=r.height;
    e.preventDefault();e.stopPropagation();
  });
  document.addEventListener('mousemove',e=>{
    if(!resizing)return;
    const nw=Math.max(240,sw+(e.clientX-sx));
    const nh=Math.max(140,sh+(e.clientY-sy));
    win.style.width=nw+'px';win.style.height=nh+'px';
  });
  document.addEventListener('mouseup',()=>{resizing=false;});
})();

// Palette strip resize — drag top handle upward to grow
(()=>{
  const rpal=\$('rpal'),handle=\$('rpal-resize-handle');
  let resizing=false,startY=0,startH=0;
  handle.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    resizing=true;startY=e.clientY;startH=rpal.offsetHeight;
    e.preventDefault();e.stopPropagation();
  });
  document.addEventListener('mousemove',e=>{
    if(!resizing)return;
    const delta=startY-e.clientY;
    const nh=Math.min(400,Math.max(52,startH+delta));
    rpal.style.height=nh+'px';
  });
  document.addEventListener('mouseup',()=>{resizing=false;});
})();

\$('cp-btn-min').onclick=cpMinimize;
\$('cp-btn-max').onclick=cpMaximize;
\$('cp-btn-close').onclick=closeCpWindow;
\$('btn-open-cp').onclick=()=>{
  const isOpen=\$('cp-ov').classList.contains('open');
  if(isOpen){if(cpMinimized)cpMinimize();else closeCpWindow();}
  else openCpWindow();
};
\$('cp-eye-btn').onclick=()=>{
  pickerOn=!pickerOn;updateCpEyeBtn();updateVpCursor();
  if(!pickerOn){\$('etip').style.display='none';\$('eye-live').style.display='none';}
};
\$('cp-clear-btn').onclick=()=>{sampled=[];renderSampled();updateCpReduceBtn();updateMode();};
\$('cp-reduce-inp').oninput=updateCpReduceBtn;
\$('cp-reduce-btn').onclick=()=>{
  // Sync cnt-inp with whatever is in the picker reduce input, then run reduce
  const n=parseInt(\$('cp-reduce-inp').value);
  if(!isNaN(n)&&n>=2&&n<=256){cntVal=String(n);\$('cnt-inp').value=n;validateCount(cntVal);}
  else{cntVal='';\$('cnt-inp').value='';}
  doReduce();
};

/*━━ SAMPLED COLORS ━━*/
function renderSampled(){
  const grid=\$('cp-sampled-grid');
  grid.innerHTML='';
  const empty=\$('cp-empty'),badge=\$('cp-count-badge');
  badge.textContent=sampled.length+' color'+(sampled.length!==1?'s':'');
  \$('cp-clear-btn').disabled=!sampled.length;
  if(!sampled.length){empty.style.display='block';updateCpReduceBtn();return;}
  empty.style.display='none';
  sampled.forEach((c,i)=>{
    const wrap=document.createElement('div');wrap.className='cp-sw-wrap';
    const sw=document.createElement('div');sw.className='cp-sw';sw.style.background=c.hex;sw.title=c.hex;
    const del=document.createElement('div');del.className='cp-sw-del';del.textContent='✕';
    del.onclick=e=>{e.stopPropagation();sampled.splice(i,1);renderSampled();updateCpReduceBtn();updateMode();};
    const lbl=document.createElement('div');lbl.className='cp-sw-lbl';lbl.textContent=c.hex.slice(1).toUpperCase();
    sw.appendChild(del);wrap.appendChild(sw);wrap.appendChild(lbl);
    sw.onclick=()=>navigator.clipboard?.writeText(c.hex).then(()=>{sw.title='Copied!';setTimeout(()=>{sw.title=c.hex;},1200);});
    grid.appendChild(wrap);
  });
  // Sidebar status
  const status=\$('cp-sidebar-status');
  status.textContent=sampled.length+' color'+(sampled.length!==1?'s':'')+' picked';
  status.style.display=sampled.length?'block':'none';
  updateCpReduceBtn();
  updateMode();
}

/*━━ PALETTE STRIP ━━*/
function colorsMatch(a,b,tol=0){return Math.abs(a[0]-b[0])<=tol&&Math.abs(a[1]-b[1])<=tol&&Math.abs(a[2]-b[2])<=tol;}
function isHlActive(c){return hlColors.some(h=>colorsMatch(h,c));}
function isColorInLib(hex){
  return library.some(g=>g.colors.some(e=>(e.hex||e).toLowerCase()===hex.toLowerCase()));
}
// Return shade name from library for a hex, or '' if not found
function getLibColorName(hex){
  for(const g of library){
    for(const e of g.colors){
      if((e.hex||e).toLowerCase()===hex.toLowerCase())return e.name||'';
    }
  }
  return '';
}
// Pre-fill the Library Add bar with the clicked palette color
function prefillLibAddBar(hex){
  setAddBarMode(); // reset to add mode
  \$('lp-add-ci').value=hex;
  
  \$('lp-add-ni').value='';
  rtpSwitch('lib');
  setTimeout(()=>{
    const addBar=\$('lp-add-bar');
    if(addBar){addBar.style.background='#e8f3fd';addBar.style.borderTopColor='#0078d4';}
    \$('lp-add-ni').focus();
    setTimeout(()=>{if(addBar){addBar.style.background='';addBar.style.borderTopColor='';}},1200);
  },50);
}

function renderPalette(pal,pcts){
  const rpal=\$('rpal'),scroll=\$('rpal-scroll'),clearBtn=\$('rpal-clear');
  if(!pal||!pal.length){rpal.classList.remove('on');return;}
  rpal.classList.add('on');
  scroll.innerHTML='';
  pal.forEach((c,i)=>{
    const h=toHex(c);
    const pct=pcts&&pcts[i]!=null?pcts[i]:null;
    const inLib=isColorInLib(h);
    const item=document.createElement('div');
    item.className='rp-item'+(isHlActive(c)?' hl-on':'')+(inLib?' in-lib':'');
    item.title=h+(pct!=null?' · '+pct.toFixed(2)+'%':'')
      +(inLib?'\n★ Already in Library':'\nClick to send to Library Add bar')
      +(hlMode?' | Highlight mode ON':' | Double-click to replace');
    // Index number on left
    const idx=document.createElement('div');idx.className='rp-idx';idx.textContent=(i+1);
    // Swatch
    const body=document.createElement('div');body.className='rp-body';
    const sw=document.createElement('div');sw.className='rp-swatch';sw.style.background=h;sw.style.position='relative';
    // Library indicator dot + shade name
    if(inLib){
      const dot=document.createElement('div');dot.className='rp-in-lib-dot';dot.textContent='★';
      sw.appendChild(dot);
    }
    const pl=document.createElement('div');pl.className='rp-pct';
    pl.textContent=pct!=null?(pct>=0.1?pct.toFixed(1)+'%':'<0.1%'):'';
    // Shade name from library
    const shadeName=getLibColorName(h);
    const nm=document.createElement('div');nm.className='rp-shade';
    nm.textContent=shadeName;nm.title=shadeName;nm.style.display=shadeName?'block':'none';
    body.appendChild(sw);body.appendChild(pl);body.appendChild(nm);
    item.appendChild(idx);item.appendChild(body);
    item.onclick=()=>{
      if(hlMode){toggleHlColor(c);}
      else{
        updateActiveToolColor(h);
        prefillLibAddBar(h);
      }
    };
    // Double-click → open Library to replace this color
    item.addEventListener('dblclick',e=>{
      e.stopPropagation();
      const targetIdx=i;const oldRgb=c;
      lcFillMode=false;
      lcCallback=(newHex)=>{
        const newRgb=hexToRgb(newHex);
        pushUndo();
        replacePxColor(oldRgb,newRgb,CR);
        palette[targetIdx]=newRgb;
        const imgData=CR.getContext('2d').getImageData(0,0,CR.width,CR.height);
        const{sorted,pcts}=sortByCoverage(palette,imgData);
        palette=sorted;palOrig=palette.map(c=>[...c]);palPcts=pcts;
        renderPalette(palette,palPcts);
        if(hlColors.length)renderHL();
        closeLibWindow();
      };
      openLibWindow('pick',false,lcCallback);
    });
    // Drag-from-library → drop to replace
    item.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';item.classList.add('drag-over');});
    item.addEventListener('dragleave',()=>item.classList.remove('drag-over'));
    item.addEventListener('drop',e=>{
      e.preventDefault();item.classList.remove('drag-over');
      const newHex=e.dataTransfer.getData('text/plain');
      if(!isHex(newHex))return;
      const newRgb=hexToRgb(newHex);
      pushUndo();
      replacePxColor(c,newRgb,CR);
      palette[i]=newRgb;
      const imgData=CR.getContext('2d').getImageData(0,0,CR.width,CR.height);
      const{sorted,pcts}=sortByCoverage(palette,imgData);
      palette=sorted;palOrig=palette.map(cc=>[...cc]);palPcts=pcts;
      renderPalette(palette,palPcts);
      if(hlColors.length)renderHL();
    });
    // Right-click → context menu
    item.addEventListener('contextmenu',e=>{
      e.preventDefault();
      showRpalCtx(e,c,i,pct);
    });
    scroll.appendChild(item);
  });
  clearBtn.style.display=hlColors.length?'block':'none';
}

/*━━ PALETTE SWATCH CONTEXT MENU ━━*/
let _ctxPalIdx=null,_ctxPalRgb=null;

function showRpalCtx(e,rgb,palIdx,pct){
  _ctxPalIdx=palIdx;_ctxPalRgb=rgb;
  const h=toHex(rgb);
  \$('ctx-sw').style.background=h;
  \$('ctx-hex').textContent=h.toUpperCase();
  \$('ctx-pct').textContent=pct!=null?(pct>=0.1?pct.toFixed(2)+'% coverage':'<0.1% coverage'):'';
  // Highlight/unhighlight label
  \$('ctx-hl').querySelector('.ctx-ico').textContent=isHlActive(rgb)?'✕':'🔦';
  \$('ctx-hl').lastChild.textContent=isHlActive(rgb)?' Remove Highlight':' Highlight on Canvas';
  const ctx=\$('rpal-ctx');
  ctx.classList.add('open');
  // Position near cursor, clamp to viewport
  let x=e.clientX+2,y=e.clientY+2;
  if(x+200>window.innerWidth)x=e.clientX-200;
  if(y+160>window.innerHeight)y=e.clientY-160;
  ctx.style.left=x+'px';ctx.style.top=y+'px';
}
function closeRpalCtx(){\$('rpal-ctx').classList.remove('open');}

// Close on any click outside
document.addEventListener('mousedown',e=>{
  if(!\$('rpal-ctx').contains(e.target))closeRpalCtx();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeRpalCtx();
});

// Copy Hex
\$('ctx-copy').onclick=()=>{
  if(_ctxPalRgb)navigator.clipboard?.writeText(toHex(_ctxPalRgb).toUpperCase());
  closeRpalCtx();
};

// Highlight/unhighlight
\$('ctx-hl').onclick=()=>{
  if(_ctxPalRgb)toggleHlColor(_ctxPalRgb);
  closeRpalCtx();
};

// Replace from Library
\$('ctx-lib').onclick=()=>{
  closeRpalCtx();
  if(_ctxPalIdx===null||!imgInfo)return;
  const targetIdx=_ctxPalIdx;
  const oldRgb=palette[targetIdx];
  lcFillMode=false;
  lcCallback=(newHex)=>{
    const newRgb=hexToRgb(newHex);
    pushUndo();
    replacePxColor(oldRgb,newRgb,CR);
    palette[targetIdx]=newRgb;
    // Recalculate coverage after replacement
    const imgData=CR.getContext('2d').getImageData(0,0,CR.width,CR.height);
    const{sorted,pcts}=sortByCoverage(palette,imgData);
    palette=sorted;palOrig=palette.map(c=>[...c]);palPcts=pcts;
    renderPalette(palette,palPcts);
    if(hlColors.length)renderHL();
    closeLibWindow();
  };
  openLibWindow('pick',false,lcCallback);
};

/*━━ HIGHLIGHT OVERLAY — multi-selection ━━*/
function toggleHlColor(rgb){
  const idx=hlColors.findIndex(h=>colorsMatch(h,rgb));
  if(idx>=0)hlColors.splice(idx,1); else hlColors.push(rgb);
  updateSize();renderHL();
  renderPalette(palette,palPcts);
  if(curTab==='reduced')CH.style.display=hlColors.length?'block':'none';
}
function clearHL(){
  hlColors=[];
  CH.getContext('2d').clearRect(0,0,CH.width,CH.height);
  CH.style.display='none';
  renderPalette(palette,palPcts);
  // Reset highlight mode button
  hlMode=false;
  const btn=\$('btn-hl-mode');
  if(btn){btn.style.background='#e1e1e1';btn.style.borderColor='#adadad';btn.style.color='#555';btn.style.fontWeight='400';}
}
function renderHL(){
  if(!hlColors.length||!imgInfo){CH.style.display='none';return;}
  const cw=CR.width,ch=CR.height;
  if(CH.width!==cw||CH.height!==ch){CH.width=cw;CH.height=ch;}
  const ctx=CH.getContext('2d');
  const src=CR.getContext('2d').getImageData(0,0,cw,ch);
  const d=src.data,out=ctx.createImageData(cw,ch),od=out.data;
  const tol=0;
  const alpha=Math.round(clamp(hlOpacity,0,100)/100*255);
  for(let i=0;i<d.length;i+=4){
    if(d[i+3]<10)continue;
    const match=hlColors.some(([hr,hg,hb])=>
      Math.abs(d[i]-hr)<=tol&&Math.abs(d[i+1]-hg)<=tol&&Math.abs(d[i+2]-hb)<=tol
    );
    if(!match){od[i]=0;od[i+1]=0;od[i+2]=0;od[i+3]=alpha;}
  }
  ctx.putImageData(out,0,0);
  CH.style.width=(cw*zoom)+'px';CH.style.height=(ch*zoom)+'px';
  if(curTab==='reduced')CH.style.display='block';
}

/*━━ COUNT VALIDATE ━━*/
function validateCount(v){
  const n=parseInt(v,10);
  if(!v){cntErr='';return false;}
  if(isNaN(n)||n<2){cntErr='Min 2';return false;}
  if(n>256){cntErr='Max 256 colors allowed';return false;}
  if(imgInfo&&n>=imgInfo.originalUnique){cntErr='Must be less than '+imgInfo.originalUnique;return false;}
  cntErr='';return true;
}
function applyCountUI(){
  const inp=\$('cnt-inp'),msg=\$('cnt-msg');
  inp.classList.toggle('err',!!cntErr);inp.classList.toggle('ok',!cntErr&&!!cntVal);
  msg.className=cntErr?'err':cntVal&&imgInfo?'ok':'';
  msg.textContent=cntErr?cntErr:(cntVal&&imgInfo?\`\${imgInfo.originalUnique.toLocaleString()} → \${cntVal} colors\`:'');
  updateMode();
}

/*━━ FILE LOAD ━━*/
function loadFile(file){
  if(!file)return;const reader=new FileReader();
  reader.onload=ev=>{const img=new Image();img.onload=()=>{
    const w=img.naturalWidth,h=img.naturalHeight;
    CO.width=w;CO.height=h;const ctx=CO.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(img,0,0,w,h);
    CR.width=w;CR.height=h;CR.getContext('2d').clearRect(0,0,w,h);
    CH.width=w;CH.height=h;
    const unique=countUnique(ctx.getImageData(0,0,w,h).data);
    imgInfo={w,h,name:file.name,unique,originalUnique:unique,reducedUnique:null};
    palette=[];palOrig=[];reducedData=null;reducedW=0;reducedH=0;
    sampled=[];cntVal='';cntErr='';
    undoStack=[];redoStack=[];tileActive=false;activeTool=null;
    \$('tile-x').value=1;\$('tile-y').value=1;\$('tile-info').textContent='';
    \$('drop').innerHTML='<div id="drop-icon" style="font-size:18px;opacity:.25;margin-bottom:2px">📄</div><div style="font-size:11px;color:#555">'+file.name+'</div>';
    \$('fstats').style.display='flex';\$('ss').textContent=w+'×'+h;\$('su').textContent=unique.toLocaleString();
    const inp=\$('cnt-inp');inp.disabled=false;inp.value='';inp.max=256;inp.placeholder='2–'+Math.min(256,unique-1);inp.className='win-inp';
    if(unique>256){
      \$('cnt-msg').textContent='⚠ '+unique.toLocaleString()+' colors — max 256. Enter count or reduce will use 256.';
      \$('cnt-msg').className='err';
    } else {
      \$('cnt-msg').textContent='Original: '+unique.toLocaleString()+' colors · leave blank to keep all';
      \$('cnt-msg').className='';
    }
    renderSampled();renderPalette(null);
    document.querySelector('.tb[data-tab="reduced"]').disabled=true;
    \$('btn-exp').style.display='none';\$('btn-cmap').style.display='none';
    \$('tools-sec').style.display='none';\$('undo-row').classList.remove('on');
    \$('tile-badge').classList.remove('on');
    \$('btn-pan').classList.add('visible');
    updateHistUI();setActiveTool(null);
    switchTab('orig');setZoom(1);showCanvas();CO.style.display='block';CR.style.display='none';CH.style.display='none';
    updateMode();
  };img.onerror=()=>alert('Cannot decode image');img.src=ev.target.result;};
  reader.onerror=()=>alert('Cannot read file');reader.readAsDataURL(file);
}

/*━━ REDUCE ━━*/
async function doReduce(){
  if(!imgInfo||busy)return;busy=true;\$('btn-reduce').disabled=true;\$('mode-badge').style.display='none';
  tileActive=false;\$('tile-badge').classList.remove('on');
  \$('tile-x').value=1;\$('tile-y').value=1;\$('tile-info').textContent='';
  hlColors=[];CH.getContext('2d').clearRect(0,0,CH.width,CH.height);CH.style.display='none';
  const sl=\$('status');sl.style.display='block';await pause(30);
  const ctx=CO.getContext('2d'),imgData=ctx.getImageData(0,0,imgInfo.w,imgInfo.h);let pal;
  if(sampled.length>0){
    sl.textContent='Using '+sampled.length+' picked color'+(sampled.length>1?'s':'')+'…';await pause(30);pal=sampled.map(c=>c.rgb);
  } else if(cntVal&&!cntErr&&parseInt(cntVal,10)>=2){
    const k=Math.min(256,parseInt(cntVal,10));sl.textContent='Running K-Means++ (k='+k+')…';await pause(30);pal=kMeans(samplePx(imgData.data),k);
  } else if(imgInfo.originalUnique<=256){
    sl.textContent='Extracting all '+imgInfo.originalUnique+' unique colors…';await pause(30);pal=extractAllUnique(imgData.data);
  } else {
    sl.textContent='Image has '+imgInfo.originalUnique+' colors — capping to 256 via K-Means…';await pause(30);pal=kMeans(samplePx(imgData.data),256);
  }
  sl.textContent='Applying palette…';await pause(30);
  const red=applyPal(imgData.data,pal);
  // Restore CR to original single-image dimensions first
  CR.width=imgInfo.w;CR.height=imgInfo.h;
  CR.getContext('2d').putImageData(new ImageData(red,imgInfo.w,imgInfo.h),0,0);
  // Save backup for tiling
  reducedData=CR.getContext('2d').getImageData(0,0,imgInfo.w,imgInfo.h);
  reducedW=imgInfo.w;reducedH=imgInfo.h;
  // Deduplicate palette (kMeans may return near-identical clusters)
  const palDeduped=[];const seen=new Set();
  pal.forEach(c=>{const k=(c[0]<<16)|(c[1]<<8)|c[2];if(!seen.has(k)){seen.add(k);palDeduped.push(c);}});
  // Sort by pixel coverage high→low
  const reduced=CR.getContext('2d').getImageData(0,0,imgInfo.w,imgInfo.h);
  const{sorted,pcts}=sortByCoverage(palDeduped,reduced);
  palette=sorted;palOrig=palette.map(c=>[...c]);palPcts=pcts;
  renderPalette(palette,palPcts);
  // Track reduced unique count separately — never overwrite originalUnique
  const actualUnique=countUnique(CR.getContext('2d').getImageData(0,0,imgInfo.w,imgInfo.h).data);
  imgInfo.reducedUnique=actualUnique;
  \$('su').textContent=actualUnique.toLocaleString();
  sl.style.display='none';busy=false;
  document.querySelector('.tb[data-tab="reduced"]').disabled=false;
  \$('btn-exp').style.display='block';\$('btn-cmap').style.display='block';
  \$('tools-sec').style.display='block';\$('undo-row').classList.add('on');
  undoStack=[];redoStack=[];updateHistUI();
  switchTab('reduced');updateMode();
}

/*━━ EXPORT BMP ━━*/
function canvasToBmp(canvas,filename){
  const w=canvas.width,h=canvas.height,d=canvas.getContext('2d').getImageData(0,0,w,h).data;
  const rs=Math.floor((w*3+3)/4)*4,ps=rs*h,fs=54+ps,buf=new ArrayBuffer(fs),view=new DataView(buf);
  view.setUint8(0,0x42);view.setUint8(1,0x4D);view.setUint32(2,fs,true);view.setUint32(6,0,true);view.setUint32(10,54,true);view.setUint32(14,40,true);view.setInt32(18,w,true);view.setInt32(22,-h,true);view.setUint16(26,1,true);view.setUint16(28,24,true);view.setUint32(30,0,true);view.setUint32(34,ps,true);view.setInt32(38,2835,true);view.setInt32(42,2835,true);
  let off=54;for(let y=0;y<h;y++){for(let x=0;x<w;x++){const s=(y*w+x)*4;view.setUint8(off++,d[s+2]);view.setUint8(off++,d[s+1]);view.setUint8(off++,d[s]);}for(let p=0;p<(rs-w*3);p++)view.setUint8(off++,0);}
  const blob=new Blob([buf],{type:'image/bmp'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename||'output.bmp';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportBmp(){canvasToBmp(curTab==='reduced'?CR:CO,\`reduced_\${palette.length}colors.bmp\`);}

/*━━ EYEDROPPER ━━*/
function pickAt(e,commit){
  if(!pickerOn||!imgInfo)return;
  const can=curTab==='orig'?CO:CR,rect=can.getBoundingClientRect();
  const sx=can.width/rect.width,sy=can.height/rect.height;
  const cx=Math.floor((e.clientX-rect.left)*sx),cy=Math.floor((e.clientY-rect.top)*sy);
  if(cx<0||cy<0||cx>=can.width||cy>=can.height)return;
  const p=can.getContext('2d').getImageData(cx,cy,1,1).data,rgb=[p[0],p[1],p[2]],hex=toHex(rgb);
  if(commit){
    if(!sampled.find(x=>x.hex===hex)){sampled=[...sampled,{hex,rgb}];renderSampled();}
  } else {
    // Update floating tooltip
    \$('et-sw').style.background=hex;\$('et-hex').textContent=hex.toUpperCase();\$('et-rgb').textContent='rgb('+rgb.join(',')+')';
    \$('etip').style.cssText='display:flex;left:'+(e.clientX+14)+'px;top:'+(e.clientY-36)+'px;';
    \$('eye-live').style.display='flex';\$('el-sw').style.background=hex;\$('el-hex').textContent=hex.toUpperCase();\$('el-rgb').textContent='rgb('+rgb.join(',')+')';
    // Update live bar in Color Picker window
    \$('cp-live-sw').style.background=hex;
    \$('cp-live-hex').textContent=hex.toUpperCase();
    \$('cp-live-rgb').textContent='rgb('+rgb.join(', ')+')';
  }
}

/*━━ WHEEL ZOOM ━━*/
VP.addEventListener('wheel',e=>{
  e.preventDefault();const oldZ=zoomRef.v;
  const newZ=e.deltaY<0?(ZSTEPS.find(s=>s>oldZ)||12):([...ZSTEPS].reverse().find(s=>s<oldZ)||0.1);
  if(newZ===oldZ)return;const r=VP.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,cx=VP.scrollLeft+mx,cy=VP.scrollTop+my,sc=newZ/oldZ;
  setZoom(newZ);requestAnimationFrame(()=>{VP.scrollLeft=cx*sc-mx;VP.scrollTop=cy*sc-my;});
},{passive:false});

/*━━ TOOL SWITCHER ━━*/
/*━━ TOOL POPUP SYSTEM ━━*/

// Tool label map
const TOOL_LABELS={tile:'⊞ Tile',fill:'🪣 Fill',paint:'🖌 Paint',outline:'⬜ Outline',move:'✥ Move'};

function openToolPopup(name){
  const popup=\$('popup-'+name);
  if(!popup)return;
  const panel=\$('sb-tool-panel');
  const panelBody=\$('sb-tool-panel-body');
  // Move the actual .tp content node into the panel body so all IDs/events stay live
  const tp=popup.querySelector('.tp');
  if(tp){
    panelBody.innerHTML='';
    panelBody.appendChild(tp);
    tp.style.display='block';
    tp.style.padding='0';
  }
  panel.classList.add('open');
}
function closeToolPopup(name){
  // Return the .tp node back to its popup before closing
  _returnTpToPopup(name);
  \$('sb-tool-panel').classList.remove('open');
  if(activeTool===name){activeTool=null;\$('ttab-'+name).classList.remove('on');updateVpCursor();}
}
function _returnTpToPopup(name){
  const popup=\$('popup-'+name);
  if(!popup)return;
  const panelBody=\$('sb-tool-panel-body');
  const tp=panelBody.querySelector('.tp');
  if(tp){
    const popupBody=popup.querySelector('.tool-popup-body');
    if(popupBody)popupBody.appendChild(tp);
  }
}

function setActiveTool(name){
  const prev=activeTool;
  activeTool=activeTool===name?null:name;
  ['tile','fill','paint','outline'].forEach(t=>{
    const el=\$('ttab-'+t);if(el)el.classList.toggle('on',activeTool===t);
  });
  \$('btn-pan').classList.toggle('on',activeTool==='pan');
  // Return previous tool's .tp node to its popup before switching
  if(prev&&prev!=='pan')_returnTpToPopup(prev);
  // Open sidebar panel for new tool, close if deactivated
  if(activeTool&&activeTool!=='pan')openToolPopup(activeTool);
  else \$('sb-tool-panel').classList.remove('open');
  updateVpCursor();
}

function updateVpCursor(){
  VP.classList.remove('fill-cur','cross','pan-cur','move-cur','move-dragging','paint-cur','outline-pick');
  if(pickerOn){VP.classList.add('cross');return;}
  if(activeTool==='pan'){VP.classList.add('pan-cur');return;}
  if(activeTool==='move'){VP.classList.add('move-cur');return;}
  if(activeTool==='paint'&&curTab==='reduced'){VP.classList.add('paint-cur');return;}
  if(activeTool==='outline'&&curTab==='reduced'){VP.classList.add('outline-pick');return;}
  if(activeTool==='fill'&&curTab==='reduced')VP.classList.add('fill-cur');
}

/*━━ TILING (live on input) ━━*/
/*━━ TILING — draws directly into CR ━━*/
function updateTileInfo(){
  if(!imgInfo||!reducedData)return;
  const rx=clamp(parseInt($('tile-x').value)||1,1,16);
  const ry=clamp(parseInt($('tile-y').value)||1,1,16);
  if(rx===1&&ry===1)$('tile-info').textContent='';
  else $('tile-info').textContent=`${reducedW*rx} × ${reducedH*ry} px (${rx}×${ry})`;
}
function liveApplyTile(){
  if(!imgInfo||!reducedData)return;
  const rx=clamp(parseInt($('tile-x').value)||1,1,16);
  const ry=clamp(parseInt($('tile-y').value)||1,1,16);

  if (!tileActive) {
      reducedData = CR.getContext('2d').getImageData(0,0,CR.width,CR.height);
      reducedW = CR.width;
      reducedH = CR.height;
  } else {
      reducedData = CR.getContext('2d').getImageData(0,0,reducedW,reducedH);
  }

  if(rx===1&&ry===1){
    // reset back to single image
    tileActive=false;
    CR.width=reducedW;CR.height=reducedH;
    CR.getContext('2d').putImageData(reducedData,0,0);
    $('tile-badge').classList.remove('on');
    updateSize();return;
  }
  // Tile directly into CR
  const newW=reducedW*rx, newH=reducedH*ry;
  // Use an offscreen temp canvas built from reducedData
  const tmp=document.createElement('canvas');tmp.width=reducedW;tmp.height=reducedH;
  tmp.getContext('2d').putImageData(reducedData,0,0);
  CR.width=newW;CR.height=newH;
  const ctx=CR.getContext('2d');ctx.imageSmoothingEnabled=false;
  for(let ty=0;ty<ry;ty++)
    for(let tx=0;tx<rx;tx++)
      ctx.drawImage(tmp,tx*reducedW,ty*reducedH);
  tileActive=true;
  $('tile-badge-txt').textContent=`⊞ ${rx}×${ry}`;
  $('tile-badge').classList.add('on');
  updateSize();
  if(hlColors.length)renderHL();
  if(curTab==='reduced')requestAnimationFrame(()=>{VP.scrollLeft=0;VP.scrollTop=0;});
}
function resetTile(){
  if(!reducedData)return;
  tileActive=false;
  CR.width=reducedW;CR.height=reducedH;
  CR.getContext('2d').putImageData(reducedData,0,0);
  \$('tile-x').value=1;\$('tile-y').value=1;\$('tile-info').textContent='';
  \$('tile-badge').classList.remove('on');
  updateSize();
  if(hlColors.length)renderHL();
}
function onTileInput(){
  updateTileInfo();
  clearTimeout(tileDebounce);
  tileDebounce=setTimeout(liveApplyTile,300);
}
\$('tile-x').oninput=onTileInput;
\$('tile-y').oninput=onTileInput;
\$('tile-x').onchange=liveApplyTile;
\$('tile-y').onchange=liveApplyTile;
\$('tile-badge-rst').onclick=resetTile;

/*━━ MAGIC FILL ━━*/
\$('fmode-single').onclick=()=>{fillMode='single';\$('fmode-single').classList.add('on');\$('fmode-similar').classList.remove('on');};
\$('fmode-similar').onclick=()=>{fillMode='similar';\$('fmode-similar').classList.add('on');\$('fmode-single').classList.remove('on');};

let magicMode='single';
\$('mmode-single').onclick=()=>{magicMode='single';\$('mmode-single').classList.add('on');\$('mmode-similar').classList.remove('on');};
\$('mmode-similar').onclick=()=>{magicMode='similar';\$('mmode-similar').classList.add('on');\$('mmode-single').classList.remove('on');};

// Helper: set fill color
function setFillColor(hex){updateActiveToolColor(hex);}

// FROM LIBRARY button — opens library window; clicking color fills canvas directly
let lcFillMode=false; // true when opened from Fill panel
let lcLastCanvasEvent=null; // last mousedown on canvas while library open

// Fill/Paint/Outline colors now come from right panel library (openLibForTool)

// Allow canvas clicks to be captured even when library is open in fill mode
VP.addEventListener('mousedown',e=>{
  if((lcFillMode||libFillMode)&&activeTool==='fill'&&curTab==='reduced'){
    lcLastCanvasEvent=e;
    // immediately fill with current fill color
    doFillAt(e,activeToolColor);
  }
},{capture:true});
function getCanvasPx(e,canvas){
  const rect=canvas.getBoundingClientRect(),sx=canvas.width/rect.width,sy=canvas.height/rect.height;
  const cx=Math.floor((e.clientX-rect.left)*sx),cy=Math.floor((e.clientY-rect.top)*sy);
  return(cx>=0&&cy>=0&&cx<canvas.width&&cy<canvas.height)?{x:cx,y:cy}:null;
}
function doFillAt(e,hexColor){
  if(!imgInfo||curTab!=='reduced')return;
  const pos=getCanvasPx(e,CR);if(!pos)return;
  const fillRgb=hexToRgb(hexColor);
  const px=CR.getContext('2d').getImageData(pos.x,pos.y,1,1).data;
  pushUndo();
  if(fillMode==='single')floodFill(pos.x,pos.y,fillRgb,CR);
  else replacePxColor([px[0],px[1],px[2]],fillRgb,CR);
  if(hlColors.length)renderHL();
}
function doFill(e){
  doFillAt(e,activeToolColor);
}

/*━━ UNIVERSAL PAN — right-click hold+drag OR middle-click from any tool ━━*/
let _mvDragging=false,_mvLX=0,_mvLY=0,_mvMoved=false;

VP.addEventListener('mousedown',e=>{
  if(!imgInfo)return;
  if(e.button===1||e.button===2){
    _mvDragging=true;_mvMoved=true;
    _mvLX=e.clientX;_mvLY=e.clientY;
    VP.classList.add('move-dragging');
    e.preventDefault();e.stopPropagation();
  }
},{capture:true,passive:false});

VP.addEventListener('contextmenu',e=>{if(_mvMoved)e.preventDefault();});

window.addEventListener('mousemove',e=>{
  if(!_mvDragging)return;
  VP.scrollLeft-=(e.clientX-_mvLX);
  VP.scrollTop -=(e.clientY-_mvLY);
  _mvLX=e.clientX;_mvLY=e.clientY;
});

window.addEventListener('mouseup',e=>{
  if(e.button===1||e.button===2){
    if(_mvDragging)VP.classList.remove('move-dragging');
    _mvDragging=false;
    setTimeout(()=>{_mvMoved=false;},50);
  }
});


let _panActive=false,_panLastX=0,_panLastY=0;

function _startPan(e){
  _panActive=true;_panLastX=e.clientX;_panLastY=e.clientY;
  VP.classList.add('panning');e.preventDefault();
}
VP.addEventListener('mousedown',e=>{
  // Left-click in pan mode OR middle-mouse anywhere
  const isPan=(e.button===0&&activeTool==='pan'&&!pickerOn)||e.button===1;
  if(!isPan)return;
  _startPan(e);
},{capture:false});
window.addEventListener('mousemove',e=>{
  if(!_panActive)return;
  VP.scrollLeft-=(e.clientX-_panLastX);
  VP.scrollTop -=(e.clientY-_panLastY);
  _panLastX=e.clientX;_panLastY=e.clientY;
});
window.addEventListener('mouseup',e=>{
  if(!_panActive)return;
  _panActive=false;VP.classList.remove('panning');
});

/*━━ PAINT TOOL — freehand brush ━━*/
/*━━ PAINT TOOL — freehand pencil brush ━━*/
let paintBrushSize=1;
// Always connected — Bresenham line always used
let _paintDown=false,_paintLastPx=null;
let _paintBuf=null; // persistent ImageData buffer across the stroke

\$('paint-size-inp').oninput=function(){
  let v=parseInt(this.value)||1;
  paintBrushSize=Math.max(1,Math.min(64,v));
};
// Always connected stroke

// Paint from lib handled by right panel

// Write brush square directly into buffer (no getImageData/putImageData)
function _brushToBuffer(cx,cy,rgb,buf,w,h){
  const s=paintBrushSize,half=Math.floor(s/2),d=buf.data;
  for(let dy=0;dy<s;dy++)for(let dx=0;dx<s;dx++){
    const px=cx-half+dx,py=cy-half+dy;
    if(px<0||py<0||px>=w||py>=h)continue;
    const i=(py*w+px)*4;
    d[i]=rgb[0];d[i+1]=rgb[1];d[i+2]=rgb[2];d[i+3]=255;
  }
}

// Bresenham into buffer
function _lineToBuffer(x0,y0,x1,y1,rgb,buf,w,h){
  const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
  const sx=x0<x1?1:-1,sy=y0<y1?1:-1;
  let err=dx-dy,x=x0,y=y0;
  while(true){
    _brushToBuffer(x,y,rgb,buf,w,h);
    if(x===x1&&y===y1)break;
    const e2=2*err;
    if(e2>-dy){err-=dy;x+=sx;}
    if(e2<dx){err+=dx;y+=sy;}
  }
}

// MOUSEDOWN — snapshot canvas into buffer, start stroke
VP.addEventListener('mousedown',e=>{
  if(activeTool!=='paint'||curTab!=='reduced'||e.button!==0)return;
  const pos=getCanvasPx(e,CR);if(!pos)return;
  e.preventDefault();e.stopPropagation();
  pushUndo();
  // Clone current canvas into working buffer
  _paintBuf=CR.getContext('2d').getImageData(0,0,CR.width,CR.height);
  const rgb=hexToRgb(activeToolColor);
  _brushToBuffer(pos.x,pos.y,rgb,_paintBuf,CR.width,CR.height);
  CR.getContext('2d').putImageData(_paintBuf,0,0);
  _paintDown=true;
  _paintLastPx={x:pos.x,y:pos.y};
  if(hlColors.length)renderHL();
},{capture:true});

// MOUSEMOVE — write into buffer, flush once
window.addEventListener('mousemove',e=>{
  if(!_paintDown||activeTool!=='paint'||!_paintBuf)return;
  const pos=getCanvasPx(e,CR);if(!pos)return;
  const rgb=hexToRgb(activeToolColor);
  if(_paintLastPx){
    // Always connected — Bresenham fills between positions, smooth continuous stroke
    _lineToBuffer(_paintLastPx.x,_paintLastPx.y,pos.x,pos.y,rgb,_paintBuf,CR.width,CR.height);
  } else {
    _brushToBuffer(pos.x,pos.y,rgb,_paintBuf,CR.width,CR.height);
  }
  // Single putImageData per mousemove — fast!
  CR.getContext('2d').putImageData(_paintBuf,0,0);
  _paintLastPx={x:pos.x,y:pos.y};
  if(hlColors.length)renderHL();
});

// MOUSEUP — finalize
window.addEventListener('mouseup',()=>{
  if(!_paintDown)return;
  _paintDown=false;_paintLastPx=null;_paintBuf=null;
});

/*━━ OUTLINE TOOL ━━*/
const EDGE_DIRS={tl:[-1,-1],t:[0,-1],tr:[1,-1],l:[-1,0],r:[1,0],bl:[-1,1],b:[0,1],br:[1,1]};

// Read per-direction pixel values from direction grid inputs
function getOutlineDirPx(){
  const result={};
  document.querySelectorAll('.ol-dir-inp[data-dir]').forEach(inp=>{
    result[inp.dataset.dir]=Math.max(0,parseInt(inp.value)||0);
  });
  return result;
}

// Build offset coordinates for one direction — always pixel-by-pixel stepping
function buildOffsets(dirKey,px){
  const[dx,dy]=EDGE_DIRS[dirKey];
  const offsets=[];
  if(px<=0)return offsets;
  for(let s=1;s<=px;s++)offsets.push([dx*s,dy*s]);
  return offsets;
}

// Click canvas → pick source color → apply outline
/*━━ OUTLINE COLOR GROUP ━━*/
let olColorGroup=[]; // array of {hex, rgb, clicks:[{x,y,mask}]} — one entry per unique color

function olGroupKey(rgb){return(rgb[0]<<16)|(rgb[1]<<8)|rgb[2];}

function olAddToGroup(pos, rgb, mask){
  const key=olGroupKey(rgb);
  const hex=toHex(rgb);
  let entry=olColorGroup.find(e=>e.key===key);
  if(!entry){
    entry={key,hex,rgb,clicks:[]};
    olColorGroup.push(entry);
  }
  // In Single mode: store each click's mask separately; Similar mode: no mask needed
  entry.clicks.push({x:pos.x,y:pos.y,mask});
  olRenderStrip();
}

function olRenderStrip(){
  const strip=\$('ol-group-strip');
  if(!strip)return;
  strip.innerHTML='';
  if(!olColorGroup.length){
    const em=document.createElement('span');
    em.className='ol-grp-empty';em.textContent='No colors yet — click canvas';
    strip.appendChild(em);return;
  }
  olColorGroup.forEach((entry,idx)=>{
    const sw=document.createElement('div');
    sw.className='ol-grp-sw';
    sw.style.background=entry.hex;
    sw.title=entry.hex.toUpperCase()+' ('+entry.clicks.length+' click'+(entry.clicks.length>1?'s':'')+')\nClick to remove';
    sw.onclick=()=>{olColorGroup.splice(idx,1);olRenderStrip();};
    strip.appendChild(sw);
  });
}

function olClearGroup(){olColorGroup=[];olRenderStrip();}

function olApplyGroupOutline(){
  if(!olColorGroup.length){showOlStatus('Add colors first — click canvas','#d32f2f');return;}
  if(!imgInfo||curTab!=='reduced'){showOlStatus('Switch to Reduced tab first','#d32f2f');return;}
  const isSimilar=document.getElementById('ol-area-all').checked;
  pushUndo();
  let totalPx=0;
  for(const entry of olColorGroup){
    if(isSimilar){
      // Similar: outline all pixels of this color everywhere, no mask
      totalPx+=applyOutlineGroup([entry.rgb],null,true);
    } else {
      // Single: outline each connected click region separately
      for(const click of entry.clicks){
        totalPx+=applyOutlineGroup([entry.rgb],click.mask,true);
      }
    }
  }
  if(hlColors.length)renderHL();
  showOlStatus('✓ '+totalPx.toLocaleString()+' px outlined ('+olColorGroup.length+' color'+(olColorGroup.length>1?'s':'')+')', '#388e3c');
}

function doOutlineAt(e){
  if(!imgInfo||curTab!=='reduced')return;
  const pos=getCanvasPx(e,CR);if(!pos)return;
  const px=CR.getContext('2d').getImageData(pos.x,pos.y,1,1).data;
  if(px[3]<10)return;
  const srcRgb=[px[0],px[1],px[2]];
  const isSimilar=document.getElementById('ol-area-all').checked;
  const mask=isSimilar?null:buildConnectedMask(pos.x,pos.y,srcRgb);
  olAddToGroup(pos,srcRgb,mask);
  // Visual feedback: flash the canvas pixel area
  showOlStatus('+ Color added to group ('+olColorGroup.length+' total)','#0078d4');
}

// Returns pixel count painted — works on current CR ImageData in-place
function applyOutlineGroup(srcRgbs, connectedMask=null, skipPush=false){
  if(!imgInfo||curTab!=='reduced')return 0;
  const typeInside=document.getElementById('ol-type-inside').checked;
  const dirPx=getOutlineDirPx();
  const hasAny=Object.values(dirPx).some(v=>v>0);
  if(!hasAny){showOlStatus('Set at least one direction > 0','#d32f2f');return 0;}

  const ctx=CR.getContext('2d');
  const idata=ctx.getImageData(0,0,CR.width,CR.height);
  const d=idata.data,w=CR.width,h=CR.height;
  const outlineRgb=hexToRgb(activeToolColor);
  const tol=12;

  // All grouped RGBs (every color in the group, not just current srcRgbs)
  const allGroupRgbs=olColorGroup.map(e=>e.rgb);

  function matchesRgbList(x,y,rgbList){
    const i=(y*w+x)*4;
    if(d[i+3]<10)return false;
    for(const rgb of rgbList){
      if(Math.abs(d[i]-rgb[0])<=tol&&Math.abs(d[i+1]-rgb[1])<=tol&&Math.abs(d[i+2]-rgb[2])<=tol)return true;
    }
    return false;
  }

  function matchesSrc(x,y){
    const i=(y*w+x)*4;
    if(d[i+3]<10)return false;
    for(const srcRgb of srcRgbs){
      if(Math.abs(d[i]-srcRgb[0])<=tol&&Math.abs(d[i+1]-srcRgb[1])<=tol&&Math.abs(d[i+2]-srcRgb[2])<=tol){
        if(connectedMask&&!connectedMask[y*w+x])continue;
        return true;
      }
    }
    return false;
  }

  // Returns true if pixel (x,y) is a different grouped color (not srcRgbs)
  function isOtherGroupColor(x,y){
    if(x<0||x>=w||y<0||y>=h)return false;
    if(matchesSrc(x,y))return false; // same src color — not "other"
    return matchesRgbList(x,y,allGroupRgbs);
  }

  const marked=new Uint8Array(w*h);
  for(const[dirKey,px] of Object.entries(dirPx)){
    if(px<=0)continue;
    const offsets=buildOffsets(dirKey,px);
    if(typeInside){
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        if(!matchesSrc(x,y))continue;
        for(const[ox,oy]of offsets){
          // Wrap coords — image repeats like tiles so edges connect to opposite side
          const nx=((x+ox)%w+w)%w, ny=((y+oy)%h+h)%h;
          if(!matchesSrc(nx,ny)){
            if(isOtherGroupColor(nx,ny))break;
            marked[y*w+x]=1;break;
          }
        }
      }
    } else {
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const i=(y*w+x)*4;
        if(d[i+3]>10&&matchesSrc(x,y))continue;
        if(isOtherGroupColor(x,y))continue;
        for(const[ox,oy]of offsets){
          // Outside: negate offset — look back toward src from outward direction
          const nx=((x-ox)%w+w)%w, ny=((y-oy)%h+h)%h;
          if(matchesSrc(nx,ny)){marked[y*w+x]=1;break;}
        }
      }
    }
  }

  const out=new Uint8ClampedArray(d);
  let count=0;
  for(let i=0;i<marked.length;i++){
    if(!marked[i])continue;count++;
    const p=i*4;out[p]=outlineRgb[0];out[p+1]=outlineRgb[1];out[p+2]=outlineRgb[2];out[p+3]=255;
  }
  ctx.putImageData(new ImageData(out,w,h),0,0);
  return count;
}

// BFS connected region mask — same as flood fill boundary detection
function buildConnectedMask(sx,sy,srcRgb){
  const ctx=CR.getContext('2d');
  const d=ctx.getImageData(0,0,CR.width,CR.height).data;
  const w=CR.width,h=CR.height,tol=12;
  function matches(i){return d[i+3]>10&&Math.abs(d[i]-srcRgb[0])<=tol&&Math.abs(d[i+1]-srcRgb[1])<=tol&&Math.abs(d[i+2]-srcRgb[2])<=tol;}
  const mask=new Uint8Array(w*h),visited=new Uint8Array(w*h);
  const stack=[sy*w+sx];visited[sy*w+sx]=1;
  while(stack.length){
    const pos=stack.pop();
    if(!matches(pos*4))continue;
    mask[pos]=1;
    const x=pos%w,y=Math.floor(pos/w);
    if(x>0&&!visited[pos-1]){visited[pos-1]=1;stack.push(pos-1);}
    if(x<w-1&&!visited[pos+1]){visited[pos+1]=1;stack.push(pos+1);}
    if(y>0&&!visited[pos-w]){visited[pos-w]=1;stack.push(pos-w);}
    if(y<h-1&&!visited[pos+w]){visited[pos+w]=1;stack.push(pos+w);}
  }
  return mask;
}

function applyOutlineAll(){
  const ctx=CR.getContext('2d');
  const d=ctx.getImageData(0,0,CR.width,CR.height).data;
  const seen=new Set(),srcs=[];
  for(let i=0;i<d.length;i+=4){if(d[i+3]<10)continue;const k=(d[i]<<16)|(d[i+1]<<8)|d[i+2];if(!seen.has(k)){seen.add(k);srcs.push([d[i],d[i+1],d[i+2]]);}}
  pushUndo();for(const src of srcs)applyOutline(src,null,true);
  if(hlColors.length)renderHL();showOlStatus('✓ Outline applied to all colors','#388e3c');
}

function applyOutline(srcRgb, connectedMask=null, skipPush=false){
  if(!imgInfo||curTab!=='reduced')return;
  const typeInside=document.getElementById('ol-type-inside').checked;
  const dirPx=getOutlineDirPx();
  const hasAny=Object.values(dirPx).some(v=>v>0);
  if(!hasAny){showOlStatus('Set at least one direction > 0','#d32f2f');return;}

  const ctx=CR.getContext('2d');
  const idata=ctx.getImageData(0,0,CR.width,CR.height);
  const d=idata.data,w=CR.width,h=CR.height;
  const outlineRgb=hexToRgb(activeToolColor);
  const tol=12;

  function matchesSrc(x,y){
    const i=(y*w+x)*4;
    if(d[i+3]<10)return false;
    if(Math.abs(d[i]-srcRgb[0])>tol||Math.abs(d[i+1]-srcRgb[1])>tol||Math.abs(d[i+2]-srcRgb[2])>tol)return false;
    // Single mode: also must be in connected mask
    if(connectedMask&&!connectedMask[y*w+x])return false;
    return true;
  }

  const marked=new Uint8Array(w*h);

  for(const[dirKey,px] of Object.entries(dirPx)){
    if(px<=0)continue;
    const offsets=buildOffsets(dirKey,px);
    if(typeInside){
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        if(!matchesSrc(x,y))continue;
        for(const[ox,oy]of offsets){
          // Wrap — image repeats like tiles, edges connect to opposite side
          const nx=((x+ox)%w+w)%w, ny=((y+oy)%h+h)%h;
          if(!matchesSrc(nx,ny)){marked[y*w+x]=1;break;}
        }
      }
    } else {
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const i=(y*w+x)*4;
        if(d[i+3]>10&&matchesSrc(x,y))continue;
        for(const[ox,oy]of offsets){
          // Outside: negate offset — look back toward src
          const nx=((x-ox)%w+w)%w, ny=((y-oy)%h+h)%h;
          if(matchesSrc(nx,ny)){marked[y*w+x]=1;break;}
        }
      }
    }
  }

  const out=new Uint8ClampedArray(d);
  let count=0;
  for(let i=0;i<marked.length;i++){
    if(!marked[i])continue;count++;
    const p=i*4;out[p]=outlineRgb[0];out[p+1]=outlineRgb[1];out[p+2]=outlineRgb[2];out[p+3]=255;
  }
  if(!skipPush)pushUndo();
  ctx.putImageData(new ImageData(out,w,h),0,0);
  if(!skipPush){if(hlColors.length)renderHL();showOlStatus('✓ '+count.toLocaleString()+' px outlined','#388e3c');}
}

function showOlStatus(msg,col){
  const el=\$('outline-status');el.textContent=msg;el.style.color=col;el.style.display='block';
  setTimeout(()=>el.style.display='none',2800);
}

/*━━ VP CLICK ━━*/
VP.onclick=e=>{
  if(_panActive||_mvMoved||_paintDown)return;
  if(pickerOn){pickAt(e,true);}
  else if(activeTool==='fill')doFill(e);
  else if(activeTool==='outline')doOutlineAt(e);
};
VP.onmousemove=e=>{if(pickerOn)pickAt(e,false);};
VP.onmouseleave=()=>{\$('etip').style.display='none';};

/*━━ COLOR MAP ━━*/
let lcCallback=null;
function openColorMap(){if(!palette.length)return;\$('cm-ov').classList.add('open');buildCmRows();}
function closeColorMap(){\$('cm-ov').classList.remove('open');}
function buildCmRows(){
  const list=\$('cm-list');list.innerHTML='';
  if(!palette.length){list.innerHTML='<div class="cm-empty">Reduce an image first</div>';return;}
  \$('cm-badge').textContent=palette.length+' color'+(palette.length>1?'s':'');
  const{counts,total}=measureUsage(palette);const maxC=Math.max(...counts,1);
  const order=[...palette.keys()].sort((a,b)=>counts[b]-counts[a]);
  let rCount=0;
  order.forEach((palIdx,rowIdx)=>{
    const origRgb=palette[palIdx],hex=toHex(origRgb),px=counts[palIdx]||0,pct=total>0?(px/total*100):0;
    const row=document.createElement('div');row.className='cmr';
    const sw=document.createElement('div');sw.className='cm-sw';sw.style.background=hex;sw.title='Copy '+hex;sw.onclick=()=>navigator.clipboard?.writeText(hex);
    const info=document.createElement('div');info.innerHTML='<div class="cm-hex">'+hex.toUpperCase()+'</div><div class="cm-rgb">rgb('+origRgb.join(', ')+')</div>';
    const pw=document.createElement('div');const bt=document.createElement('div');bt.className='cm-bar-track';const bf=document.createElement('div');bf.className='cm-bar-fill';bf.style.background=hex;bt.appendChild(bf);const pl=document.createElement('div');pl.className='cm-pct-line';pl.innerHTML='<span class="cm-pct-big">'+pct.toFixed(1)+'%</span><span class="cm-pct-sm">coverage</span><span class="cm-px"> · '+px.toLocaleString()+' px</span>';pw.appendChild(bt);pw.appendChild(pl);
    requestAnimationFrame(()=>setTimeout(()=>{bf.style.width=(px/maxC*100).toFixed(1)+'%';},40+rowIdx*14));
    const rep=document.createElement('div');rep.className='cm-rep';
    const rlbl=document.createElement('div');rlbl.className='cm-rep-lbl';rlbl.textContent='Replace';
    const ci=document.createElement('input');ci.type='color';ci.className='ci';ci.style.cssText='width:28px;height:26px;';ci.value=hex;
    const lb=document.createElement('button');lb.className='cm-lib-btn';lb.title='From library';lb.textContent='📚';
    const ab=document.createElement('button');ab.className='cm-apply-btn';ab.textContent='Apply';
    const doApply=()=>{
      if(ab.classList.contains('done'))return;const newHex=ci.value,newRgb=hexToRgb(newHex);
      if(newHex.toLowerCase()===toHex(palette[palIdx]).toLowerCase())return;
      pushUndo();replacePxColor(palette[palIdx],newRgb);palette[palIdx]=newRgb;
      sw.style.background=newHex;info.innerHTML='<div class="cm-hex">'+newHex.toUpperCase()+'</div><div class="cm-rgb">rgb('+newRgb.join(', ')+')</div>';
      bf.style.background=newHex;ab.textContent='✓ Done';ab.classList.add('done');row.classList.add('replaced');
      renderPalette(palette,palPcts);rCount++;\$('cm-fnote').textContent=rCount+' replaced';
    };
    ab.onclick=doApply;lb.onclick=()=>{lcFillMode=false;lcCallback=h=>{ci.value=h;};openLcModal();};
    rep.appendChild(rlbl);rep.appendChild(ci);rep.appendChild(lb);rep.appendChild(ab);
    row.appendChild(sw);row.appendChild(info);row.appendChild(pw);row.appendChild(rep);list.appendChild(row);
  });
  \$('cm-fnote').textContent=palette.length+' colors · by coverage';
}
\$('cm-apply-all').onclick=()=>document.querySelectorAll('.cm-apply-btn:not(.done)').forEach(b=>b.click());
\$('cm-reset').onclick=()=>{
  if(!imgInfo||!palOrig.length)return;
  pushUndo();
  const red=applyPal(CO.getContext('2d').getImageData(0,0,imgInfo.w,imgInfo.h).data,palOrig);
  CR.width=imgInfo.w;CR.height=imgInfo.h;
  CR.getContext('2d').putImageData(new ImageData(red,imgInfo.w,imgInfo.h),0,0);
  reducedData=CR.getContext('2d').getImageData(0,0,imgInfo.w,imgInfo.h);
  reducedW=imgInfo.w;reducedH=imgInfo.h;
  tileActive=false;\$('tile-badge').classList.remove('on');
  \$('tile-x').value=1;\$('tile-y').value=1;\$('tile-info').textContent='';
  palette=palOrig.map(c=>[...c]);renderPalette(palette,palPcts);buildCmRows();updateSize();
};
\$('cm-close').onclick=closeColorMap;
\$('cm-ov').onclick=e=>{if(e.target===\$('cm-ov'))closeColorMap();};

/*━━ UNIFIED LIBRARY WINDOW ━━*/
let libCurrentMode='manage'; // 'manage' | 'pick'
let libFillMode=false;
let libPickCallback=null;

function openLibWindow(mode,fillMode,callback){
  libCurrentMode=mode;libFillMode=fillMode||false;libPickCallback=callback||null;
  const isPick=mode==='pick';
  \$('lm-title').innerHTML=(isPick?(fillMode?'Library — Click Color to Apply':'Choose from Color Library'):'Color Library')
    +'<span id="lm-mode-badge" style="font-size:10px;color:#888;font-weight:400;margin-left:6px">'+(isPick?'[pick]':'[manage]')+'</span>';
  \$('lm-fill-hint').style.display=(isPick&&fillMode)?'block':'none';
  \$('lm-sel-bar').style.display=isPick?'flex':'none';
  if(isPick){\$('lm-sel-sw').style.background='#e0e0e0';\$('lm-sel-hex').textContent='— select a color —';\$('lm-use-btn').disabled=true;}
  // Reset window state if minimized
  if(lmMinimized){\$('lm-win').classList.remove('minimized');lmMinimized=false;\$('lm-btn-min').textContent='—';}
  buildLibPanel(\$('lm-body'),mode,
    (isPick&&fillMode)?(h)=>{if(libPickCallback)libPickCallback(h);}:null,
    (isPick&&!fillMode)?(h)=>{if(libPickCallback)libPickCallback(h);closeLibWindow();}:null
  );
  \$('lm-ov').classList.add('open');
}
function closeLibWindow(){\$('lm-ov').classList.remove('open');libFillMode=false;libPickCallback=null;lcLastCanvasEvent=null;}
// Legacy aliases
function openLcModal(){openLibWindow('pick',lcFillMode,lcCallback);}
function closeLcModal(){closeLibWindow();}
function openLibGroupCreator(){
  openLibWindow('pick',false);
  setTimeout(()=>{
    const inp=document.querySelector('#lm-body .lib-create-row input');
    if(inp){inp.focus();inp.select();}
  },30);
}

/*━━ LIBRARY MANAGER ━━*/
function openLibManager(){openLibWindow('manage');}
function closeLibManager(){closeLibWindow();}

// Traffic-light buttons
let lmMinimized=false,lmMaximized=false,lmRestoreRect=null;
function lmMinimize(){
  const win=\$('lm-win');
  if(lmMinimized){
    win.classList.remove('minimized');lmMinimized=false;
    \$('lm-btn-min').title='Minimize';\$('lm-btn-min').textContent='—';
  } else {
    win.classList.add('minimized');lmMinimized=true;
    \$('lm-btn-min').title='Restore';\$('lm-btn-min').textContent='▢';
  }
}
function lmMaximize(){
  const win=\$('lm-win');
  if(lmMaximized){
    if(lmRestoreRect){win.style.left=lmRestoreRect.left;win.style.top=lmRestoreRect.top;win.style.width=lmRestoreRect.width;win.style.height=lmRestoreRect.height;}
    win.classList.remove('minimized');lmMinimized=false;lmMaximized=false;
    \$('lm-btn-max').title='Maximize';\$('lm-btn-max').textContent='⤢';
    \$('lm-resize').style.display='block';
  } else {
    const r=win.getBoundingClientRect();
    lmRestoreRect={left:win.style.left||r.left+'px',top:win.style.top||r.top+'px',width:win.style.width||r.width+'px',height:win.style.height||r.height+'px'};
    win.style.left='0';win.style.top='0';win.style.transform='none';
    win.style.width='100vw';win.style.height='100vh';
    win.classList.remove('minimized');lmMinimized=false;lmMaximized=true;
    \$('lm-btn-max').title='Restore';\$('lm-btn-max').textContent='❐';
    \$('lm-resize').style.display='none';
  }
}
\$('lm-btn-min').onclick=lmMinimize;
\$('lm-btn-max').onclick=lmMaximize;
\$('lm-btn-close').onclick=closeLibManager;
\$('lm-ov').onclick=e=>{if(e.target===\$('lm-ov'))closeLibManager();};

// Drag
(function(){
  const win=\$('lm-win'),hdr=\$('lm-hdr');
  let drag=false,ox=0,oy=0,wx=0,wy=0;
  hdr.addEventListener('mousedown',e=>{
    if(e.target.classList.contains('lm-wbtn'))return;
    if(e.button!==0||lmMaximized)return;
    const r=win.getBoundingClientRect();
    win.style.transform='none';
    if(!win.style.left||win.style.left===''){win.style.left=r.left+'px';win.style.top=r.top+'px';}
    drag=true;ox=e.clientX;oy=e.clientY;wx=parseFloat(win.style.left)||0;wy=parseFloat(win.style.top)||0;
    e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!drag)return;
    win.style.left=clamp(wx+(e.clientX-ox),0,window.innerWidth-80)+'px';
    win.style.top=clamp(wy+(e.clientY-oy),0,window.innerHeight-40)+'px';
  });
  document.addEventListener('mouseup',()=>{drag=false;});
  hdr.addEventListener('dblclick',e=>{if(!e.target.classList.contains('lm-wbtn'))lmMaximize();});
})();

// Resize from SE corner
(function(){
  const win=\$('lm-win'),handle=\$('lm-resize');
  let resizing=false,sx=0,sy=0,sw=0,sh=0;
  handle.addEventListener('mousedown',e=>{
    if(e.button!==0)return;
    resizing=true;sx=e.clientX;sy=e.clientY;
    const r=win.getBoundingClientRect();sw=r.width;sh=r.height;
    e.preventDefault();e.stopPropagation();
  });
  document.addEventListener('mousemove',e=>{
    if(!resizing)return;
    win.style.width=Math.max(420,sw+(e.clientX-sx))+'px';
    win.style.height=Math.max(200,sh+(e.clientY-sy))+'px';
  });
  document.addEventListener('mouseup',()=>{resizing=false;});
})();

/*━━ SHARED LIBRARY PANEL ━━*/
function buildLibPanel(container,mode,onClickPick,onUsePick){
  container.innerHTML='';
  let selGrpId=library.length?library[0].id:null;
  let renamingId=null,deletingId=null,selHex=null,editingColorIdx=null;
  const gcol=document.createElement('div');gcol.className='lib-gcol';
  const ghdr=document.createElement('div');ghdr.className='lib-gcol-hdr';ghdr.textContent='Groups';gcol.appendChild(ghdr);
  const glist=document.createElement('div');glist.className='lib-glist';gcol.appendChild(glist);
  const ccol=document.createElement('div');ccol.className='lib-ccol';
  const noSel=document.createElement('div');noSel.className='lib-no-sel';noSel.innerHTML='<div>📁</div><div>Select a group</div>';ccol.appendChild(noSel);
  const ccHdr=document.createElement('div');ccHdr.className='lib-ccol-hdr';ccHdr.style.display='none';
  const grpTitle=document.createElement('div');grpTitle.className='lib-grp-title';ccHdr.appendChild(grpTitle);
  // Delete Group button — always visible in all modes
  const dBtn=document.createElement('button');dBtn.className='del-grp-btn';dBtn.textContent='🗑 Delete Group';
  dBtn.onclick=()=>{deletingId=selGrpId;renamingId=null;renderAll();};ccHdr.appendChild(dBtn);
  ccol.appendChild(ccHdr);
  const cgrid=document.createElement('div');cgrid.className='lib-cgrid';cgrid.style.display='none';ccol.appendChild(cgrid);
  const emptyG=document.createElement('div');emptyG.className='lib-empty-grp';emptyG.style.display='none';emptyG.innerHTML='<div>🎨</div><div>Group is empty</div>';ccol.appendChild(emptyG);

  // ── Single unified Color Control Bar (New + Edit in one) ──
  const colorBar=document.createElement('div');colorBar.className='lib-color-bar';colorBar.style.display='none';
  const colorBarLbl=document.createElement('div');colorBarLbl.className='lib-color-bar-lbl';colorBarLbl.textContent='✚ New Color';
  const colorBarCi=document.createElement('input');colorBarCi.type='color';colorBarCi.className='ci';colorBarCi.style.cssText='width:30px;height:28px;flex-shrink:0;';colorBarCi.value='#0078d4';
  const colorBarHi=document.createElement('input');colorBarHi.type='text';colorBarHi.className='lib-hex-inp';colorBarHi.placeholder='#0078d4';colorBarHi.maxLength=7;colorBarHi.value='#0078d4';colorBarHi.style.width='72px';colorBarHi.style.flexShrink='0';
  colorBarCi.oninput=()=>colorBarHi.value=colorBarCi.value;
  colorBarHi.oninput=()=>{if(isHex(colorBarHi.value))colorBarCi.value=colorBarHi.value;};
  const colorBarNi=document.createElement('input');colorBarNi.type='text';colorBarNi.className='lib-name-inp';colorBarNi.placeholder='Shade name…';colorBarNi.maxLength=20;
  // Opacity wrap
  const colorBarOWrap=document.createElement('div');colorBarOWrap.className='lib-opacity-wrap';
  const colorBarOLbl=document.createElement('label');colorBarOLbl.textContent='Opacity';
  const colorBarOi=document.createElement('input');colorBarOi.type='number';colorBarOi.className='lib-opacity-inp';colorBarOi.min=0;colorBarOi.max=100;colorBarOi.value=100;colorBarOi.title='Transparency 0% = fully transparent · 100% = solid';
  const colorBarOPct=document.createElement('span');colorBarOPct.textContent='%';colorBarOPct.style.cssText='font-size:11px;color:#666;';
  colorBarOWrap.appendChild(colorBarOLbl);colorBarOWrap.appendChild(colorBarOi);colorBarOWrap.appendChild(colorBarOPct);
  const colorBarBtn=document.createElement('button');colorBarBtn.className='lib-add-btn';colorBarBtn.textContent='Add';
  const colorBarCancel=document.createElement('button');colorBarCancel.className='lib-edit-cancel';colorBarCancel.textContent='Cancel';colorBarCancel.style.display='none';
  colorBarBtn.onclick=()=>{
    const g=library.find(g=>g.id===selGrpId);if(!g)return;
    let h=colorBarHi.value.trim();if(!isHex(h))h=colorBarCi.value;if(!isHex(h))return;
    const n=colorBarNi.value.trim();
    const op=Math.max(0,Math.min(100,parseInt(colorBarOi.value)||100));
    if(editingColorIdx!==null){
      g.colors[editingColorIdx]={hex:h,name:n,opacity:op};libSave();
      editingColorIdx=null;setBarNewMode();renderColors();renderGroups();
    } else {
      if(g.colors.some(c=>(c.hex||c)===h))return;
      g.colors.push({hex:h,name:n,opacity:op});libSave();setBarNewMode();renderAll();
    }
  };
  colorBarCancel.onclick=()=>{editingColorIdx=null;setBarNewMode();renderColors();};
  function setBarNewMode(){
    colorBarLbl.textContent='✚ New Color';
    colorBarBtn.textContent='Add';colorBarBtn.style.background='#0078d4';colorBarBtn.style.borderColor='#005a9e';
    colorBarCancel.style.display='none';
    colorBarCi.value='#0078d4';colorBarHi.value='#0078d4';colorBarNi.value='';colorBarOi.value=100;
  }
  function setBarEditMode(hex,name,opacity){
    colorBarLbl.textContent='✏ Edit Color';
    colorBarBtn.textContent='Update';colorBarBtn.style.background='#388e3c';colorBarBtn.style.borderColor='#2e7d32';
    colorBarCancel.style.display='';
    colorBarCi.value=hex;colorBarHi.value=hex;colorBarNi.value=name||'';colorBarOi.value=opacity!=null?opacity:100;
    setTimeout(()=>{colorBarNi.focus();},20);
  }
  colorBar.appendChild(colorBarLbl);colorBar.appendChild(colorBarCi);colorBar.appendChild(colorBarHi);colorBar.appendChild(colorBarNi);colorBar.appendChild(colorBarOWrap);colorBar.appendChild(colorBarBtn);colorBar.appendChild(colorBarCancel);
  ccol.appendChild(colorBar);
  container.appendChild(gcol);container.appendChild(ccol);

  function renderAll(){renderGroups();renderColors();}
  document.addEventListener('lm-refresh',renderAll);
  function renderGroups(){
    glist.innerHTML='';
    library.forEach(g=>{
      if(deletingId===g.id){
        const dc=document.createElement('div');dc.className='lib-del-confirm';dc.innerHTML='<span>Delete "'+g.name+'"?</span>';
        const yes=document.createElement('button');yes.className='del-yes';yes.textContent='Delete';
        const no=document.createElement('button');no.className='del-no';no.textContent='Cancel';
        yes.onclick=()=>{library=library.filter(x=>x.id!==g.id);libSave();if(selGrpId===g.id)selGrpId=library.length?library[0].id:null;deletingId=null;renderAll();};
        no.onclick=()=>{deletingId=null;renderAll();};dc.appendChild(yes);dc.appendChild(no);glist.appendChild(dc);return;
      }
      if(renamingId===g.id){
        const rr=document.createElement('div');rr.className='lib-gi-rename';
        const inp=document.createElement('input');inp.value=g.name;inp.maxLength=32;
        const ok=document.createElement('button');ok.className='ok';ok.textContent='✓';
        const cx=document.createElement('button');cx.className='cx';cx.textContent='✕';
        const save=()=>{const nm=inp.value.trim();if(nm){g.name=nm;libSave();}renamingId=null;renderAll();};
        ok.onclick=save;cx.onclick=()=>{renamingId=null;renderAll();};inp.onkeydown=e=>{if(e.key==='Enter')save();if(e.key==='Escape'){renamingId=null;renderAll();}};
        rr.appendChild(inp);rr.appendChild(ok);rr.appendChild(cx);glist.appendChild(rr);setTimeout(()=>{inp.focus();inp.select();},10);return;
      }
      const item=document.createElement('div');item.className='lib-gi'+(g.id===selGrpId?' sel':'');
      const name=document.createElement('div');name.className='lib-gi-name';name.textContent=g.name;
      const cnt=document.createElement('div');cnt.className='lib-gi-cnt';cnt.textContent=g.colors.length;
      item.appendChild(name);item.appendChild(cnt);
      // Rename + Delete icons — always shown on hover in all modes
      const acts=document.createElement('div');acts.className='lib-gi-acts';
      const rn=document.createElement('button');rn.className='lib-gi-act';rn.title='Rename group';rn.textContent='✏';rn.onclick=e=>{e.stopPropagation();renamingId=g.id;selGrpId=g.id;deletingId=null;renderAll();};
      const dl=document.createElement('button');dl.className='lib-gi-act del';dl.title='Delete group';dl.textContent='🗑';dl.onclick=e=>{e.stopPropagation();deletingId=g.id;renamingId=null;renderAll();};
      acts.appendChild(rn);acts.appendChild(dl);item.appendChild(acts);
      item.onclick=()=>{selGrpId=g.id;renamingId=null;deletingId=null;editingColorIdx=null;setBarNewMode();renderAll();};glist.appendChild(item);
    });
    // ── Add Group row ──
    const cr2=document.createElement('div');cr2.className='lib-create-row';
    const addGrpInp=document.createElement('input');addGrpInp.placeholder='New group name…';addGrpInp.maxLength=32;
    const addGrpBtn=document.createElement('button');addGrpBtn.title='Add Group';addGrpBtn.textContent='+';
    const doCreate=()=>{
      const nm=addGrpInp.value.trim();if(!nm)return;
      const g={id:uid(),name:nm,colors:[]};library.push(g);
      window.libPanelPreferredGroupId=g.id;
      libSave();
      selGrpId=g.id;addGrpInp.value='';renderAll();
    };
    addGrpBtn.onclick=doCreate;
    addGrpInp.onkeydown=e=>{if(e.key==='Enter')doCreate();};
    cr2.appendChild(addGrpInp);cr2.appendChild(addGrpBtn);glist.appendChild(cr2);
  }
  function renderColors(){
    const g=library.find(g=>g.id===selGrpId);
    if(!g){noSel.style.display='flex';ccHdr.style.display='none';cgrid.style.display='none';emptyG.style.display='none';
      colorBar.style.display='none';return;}
    noSel.style.display='none';ccHdr.style.display='flex';
    colorBar.style.display='flex';
    grpTitle.textContent=g.name;cgrid.innerHTML='';
    if(!g.colors.length){cgrid.style.display='none';emptyG.style.display='flex';}else{cgrid.style.display='flex';emptyG.style.display='none';}
    g.colors.forEach((entry,i)=>{
      const hex=entry.hex||entry;
      const shadeName=entry.name||'';
      const opacity=entry.opacity!=null?entry.opacity:100;
      const [r,gb2,b]=hexToRgb(hex);
      const rgbaFill=\`rgba(\${r},\${gb2},\${b},\${opacity/100})\`;
      const wrap=document.createElement('div');wrap.className='lib-csw'+(mode==='pick'&&hex===selHex?' sel':'')+(editingColorIdx===i?' editing':'');
      // Box with checkerboard + color fill overlay
      const box=document.createElement('div');box.className='lib-csw-box';box.title=hex+(shadeName?' · '+shadeName:'')+(opacity<100?' · '+opacity+'%':'');
      const fill=document.createElement('div');fill.className='lib-csw-color-fill';fill.style.background=rgbaFill;
      box.appendChild(fill);
      // Opacity badge (only shown when < 100%)
      if(opacity<100){const ab=document.createElement('div');ab.className='lib-csw-alpha';ab.textContent=opacity+'%';box.appendChild(ab);}
      // Shade name label
      const nlbl=document.createElement('div');nlbl.className='lib-csw-name'+(shadeName?'':' unnamed');nlbl.textContent=shadeName||'unnamed';nlbl.title=shadeName||'';
      // Hex label
      const hlbl=document.createElement('div');hlbl.className='lib-csw-lbl';hlbl.textContent=hex.slice(1).toUpperCase();
      wrap.appendChild(box);wrap.appendChild(nlbl);wrap.appendChild(hlbl);
      // Edit button — hover to reveal
      const editBtn=document.createElement('div');editBtn.className='lib-csw-edit';editBtn.textContent='✏';editBtn.title='Edit color';
      editBtn.onclick=e=>{
        e.stopPropagation();
        editingColorIdx=i;
        setBarEditMode(hex,shadeName,opacity);
        renderColors();
      };
      wrap.appendChild(editBtn);
      // Delete button — all modes
      const del=document.createElement('div');del.className='lib-csw-del';del.textContent='✕';del.title='Delete color';
        del.onclick=e=>{
          e.stopPropagation();g.colors.splice(i,1);libSave();
          if(editingColorIdx===i){editingColorIdx=null;setBarNewMode();}
          renderColors();renderGroups();
        };
        wrap.appendChild(del);
      wrap.onclick=()=>{
        if(mode==='pick'){
          selHex=hex;
          \$('lm-sel-sw').style.background=rgbaFill;
          \$('lm-sel-hex').textContent=hex.toUpperCase()+(shadeName?' · '+shadeName:'')+(opacity<100?' · '+opacity+'%':'');
          \$('lm-use-btn').disabled=false;
          renderColors();
          if(onClickPick)onClickPick(hex);
        } else navigator.clipboard?.writeText(hex);
      };
      cgrid.appendChild(wrap);
    });
    if(mode==='pick')\$('lm-use-btn').onclick=()=>{if(selHex&&onUsePick)onUsePick(selHex);};
  }
  renderAll();
}

\$('hl-clear').onclick=clearHL;
\$('rpal-clear').onclick=clearHL;

// Highlight Mode toggle button
\$('btn-hl-mode').onclick=function(){
  hlMode=!hlMode;
  this.style.background=hlMode?'#cce4f7':'#e1e1e1';
  this.style.borderColor=hlMode?'#0078d4':'#adadad';
  this.style.color=hlMode?'#005a9e':'#555';
  this.style.fontWeight=hlMode?'700':'400';
  this.title=hlMode?'Highlight Mode ON — click a swatch to highlight':'Toggle Highlight Mode — then click a swatch to highlight it on canvas';
};

/*━━ RIGHT TABBED PANEL ━━*/
function rtpSwitch(tab){
  ['lib','cp'].forEach(t=>{
    \$('rtp-tab-'+t).classList.toggle('on',t===tab);
    \$('rtp-pane-'+t).classList.toggle('on',t===tab);
  });
}

/*━━ RIGHT PANEL: COLOR PICKER PANE ━━*/
function rtpRenderSampled(){
  const grid=\$('rtp-cp-swatches'),empty=\$('rtp-cp-empty'),count=\$('rtp-count');
  grid.innerHTML='';
  count.textContent=sampled.length;
  empty.style.display=sampled.length?'none':'block';
  sampled.forEach((c,i)=>{
    const wrap=document.createElement('div');wrap.className='rtp-sw-wrap';
    const sw=document.createElement('div');sw.className='rtp-sw';sw.style.background=c.hex;sw.title=c.hex;
    const del=document.createElement('div');del.className='rtp-sw-del';del.textContent='✕';
    del.onclick=e=>{e.stopPropagation();sampled.splice(i,1);rtpRenderSampled();updateCpReduceBtn();updateMode();};
    sw.appendChild(del);
    const lbl=document.createElement('div');lbl.className='rtp-sw-lbl';lbl.textContent=c.hex.slice(1).toUpperCase();
    wrap.appendChild(sw);wrap.appendChild(lbl);
    sw.onclick=()=>navigator.clipboard?.writeText(c.hex);
    grid.appendChild(wrap);
  });
  rtpUpdateReduceBtn();
}
function rtpUpdateReduceBtn(){
  const btn=\$('rtp-reduce-btn'),msg=\$('rtp-reduce-msg');
  if(!imgInfo){btn.disabled=true;msg.textContent='Load image first';return;}
  btn.disabled=false;
  if(sampled.length>0){msg.textContent=sampled.length+' picked';}
  else{const n=parseInt(\$('rtp-reduce-inp').value);msg.textContent=(!isNaN(n)&&n>=2)?'→ '+n:'auto';}
}
\$('rtp-reduce-inp').oninput=rtpUpdateReduceBtn;
\$('rtp-reduce-btn').onclick=()=>{
  const n=parseInt(\$('rtp-reduce-inp').value);
  if(!isNaN(n)&&n>=2&&n<=256){cntVal=String(n);\$('cnt-inp').value=n;validateCount(cntVal);}
  else{cntVal='';\$('cnt-inp').value='';}
  doReduce();
};
\$('rtp-eye-btn').onclick=()=>{
  pickerOn=!pickerOn;
  \$('rtp-eye-btn').textContent=pickerOn?'◉':'◎';
  \$('rtp-eye-btn').classList.toggle('on',pickerOn);
  updateVpCursor();
  if(!pickerOn){\$('etip').style.display='none';\$('eye-live').style.display='none';}
};
\$('rtp-clear-btn').onclick=()=>{sampled=[];rtpRenderSampled();updateCpReduceBtn();updateMode();};

// Keep rtp picker in sync with main sampled state
const _origRenderSampled=renderSampled;
window.renderSampled=function(){_origRenderSampled();rtpRenderSampled();};

// Forward live eyedrop preview to rtp panel
const _origPickAt=pickAt;
window.pickAt=function(e,commit){
  _origPickAt(e,commit);
  if(!commit&&pickerOn&&imgInfo){
    const can=curTab==='orig'?CO:CR;
    const rect=can.getBoundingClientRect();
    const sx=can.width/rect.width,sy=can.height/rect.height;
    const cx=Math.floor((e.clientX-rect.left)*sx),cy=Math.floor((e.clientY-rect.top)*sy);
    if(cx>=0&&cy>=0&&cx<can.width&&cy<can.height){
      const p=can.getContext('2d').getImageData(cx,cy,1,1).data;
      const hex=toHex([p[0],p[1],p[2]]);
      \$('rtp-cp-sw').style.background=hex;
      \$('rtp-cp-hex').textContent=hex.toUpperCase();
      \$('rtp-cp-rgb').textContent='rgb('+p[0]+','+p[1]+','+p[2]+')';
    }
  }
};
/*━━ TOOL → LIBRARY COLOR PICKER ━━*/
window.libPanelPreferredGroupId=null;
function buildLibPanel_right(){
  const grpSel=\$('lib-panel-grp');
  const prevId=grpSel.value; // remember current selection
  grpSel.innerHTML='';
  library.forEach(g=>{
    const o=document.createElement('option');o.value=g.id;o.textContent=g.name;grpSel.appendChild(o);
  });
  // restore previous selection if it still exists
  if(prevId&&grpSel.querySelector('option[value="'+prevId+'"]')){
    grpSel.value=prevId;
  }
  if(window.libPanelPreferredGroupId&&grpSel.querySelector('option[value="'+window.libPanelPreferredGroupId+'"]')){
    grpSel.value=window.libPanelPreferredGroupId;
    window.libPanelPreferredGroupId=null;
  }
  renderLibPanel_right(grpSel.value);
}
let _lpEditTarget=null; // {grp, idx}
function renderLibPanel_right(selGrpId){
  const scroll=\$('lib-panel-scroll');scroll.innerHTML='';
  const groups=library.filter(g=>g.id===selGrpId);
  if(!groups.length&&library.length){
    // fallback to first group if selGrpId not found
    renderLibPanel_right(library[0].id);return;
  }
  groups.forEach(g=>{
    g.colors.forEach((entry,idx)=>{
      const hex=entry.hex||entry;
      const name=entry.name||'';
      const op=entry.opacity!=null?entry.opacity:100;
      const wrap=document.createElement('div');wrap.className='lp-wrap';
      // Swatch
      const sw=document.createElement('div');sw.className='lp-swatch';
      sw.style.background=\`rgba(\${hexToRgb(hex).join(',')},\${op/100})\`;
      sw.title=(name?name+' — ':'')+hex.toUpperCase()+'\nDrag to palette to replace';
      sw.draggable=true;
      sw.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',hex);e.dataTransfer.effectAllowed='copy';sw.classList.add('dragging');});
      sw.addEventListener('dragend',()=>sw.classList.remove('dragging'));
      // Name label
      const nm=document.createElement('div');nm.className='lp-name';nm.textContent=name||hex.slice(1).toUpperCase();
      // Action buttons
      const acts=document.createElement('div');acts.className='lp-acts';
      // Click: prefill add bar with this color (and update active tool color)
      sw.onclick=e=>{
        e.stopPropagation();
        updateActiveToolColor(hex);
        setEditBarMode(hex,name,g,idx);
      };
      const delBtn=document.createElement('button');delBtn.className='lp-act del';delBtn.textContent='✕';delBtn.title='Delete';
      delBtn.onclick=e=>{
        e.stopPropagation();
        g.colors.splice(idx,1);libSave();
        if(_lpEditTarget&&_lpEditTarget.grp.id===g.id&&_lpEditTarget.idx===idx)setAddBarMode();
        renderLibPanel_right(\$('lib-panel-grp').value);
      };
      acts.appendChild(delBtn);
      sw.appendChild(acts);
      wrap.appendChild(sw);wrap.appendChild(nm);
      scroll.appendChild(wrap);
    });
  });
}
// Group selector change
\$('lib-panel-grp').onchange=function(){
  _lpEditTarget=null;setAddBarMode();
  renderLibPanel_right(this.value);
};
\$('lib-panel-new-grp').onclick=openLibGroupCreator;

// Unified Add / Edit bar wiring
function setAddBarMode(){
  _lpEditTarget=null;
  \$('lp-add-btn').textContent='+ Add';
  \$('lp-add-btn').classList.remove('edit-mode');
  \$('lp-edit-cancel').style.display='none';
}
function setEditBarMode(hex,name,grp,idx){
  _lpEditTarget={grp,idx};
  \$('lp-add-ci').value=hex;
  
  \$('lp-add-ni').value=name||'';
  \$('lp-add-btn').textContent='✓ Update';
  \$('lp-add-btn').classList.add('edit-mode');
  \$('lp-edit-cancel').style.display='block';
  setTimeout(()=>\$('lp-add-ni').focus(),10);
}
\$('lp-add-ci').oninput=function(){};

\$('lp-add-btn').onclick=()=>{
  const h=\$('lp-add-ci').value;if(!isHex(h))return;
  const n=\$('lp-add-ni').value.trim();
  if(_lpEditTarget){
    // Edit mode — check duplicates excluding self
    const grp=_lpEditTarget.grp;
    const selfIdx=_lpEditTarget.idx;
    const dupHex=grp.colors.some((e,i)=>i!==selfIdx&&(e.hex||e).toLowerCase()===h.toLowerCase());
    const dupName=n&&grp.colors.some((e,i)=>i!==selfIdx&&(e.name||'').toLowerCase()===n.toLowerCase());
    if(dupHex||dupName)return;
    const op=grp.colors[selfIdx].opacity||100;
    grp.colors[selfIdx]={hex:h,name:n,opacity:op};
    libSave();setAddBarMode();renderLibPanel_right(\$('lib-panel-grp').value);
    if(\$('lm-ov').classList.contains('open')){
      const evt=new Event('lm-refresh');document.dispatchEvent(evt);
    }
  } else {
    // Add mode — check duplicates
    const selId=\$('lib-panel-grp').value;
    const g=library.find(x=>x.id===selId)||library[0];
    if(!g)return;
    const dupHex=g.colors.some(e=>(e.hex||e).toLowerCase()===h.toLowerCase());
    const dupName=n&&g.colors.some(e=>(e.name||'').toLowerCase()===n.toLowerCase());
    if(dupHex||dupName)return;
    g.colors.push({hex:h,name:n,opacity:100});
    libSave();renderLibPanel_right(selId);
    \$('lp-add-ci').value='#0078d4';\$('lp-add-ni').value='';
  }
};
\$('lp-edit-cancel').onclick=()=>{setAddBarMode();renderLibPanel_right(\$('lib-panel-grp').value);};

// Initial render and re-render whenever library changes
buildLibPanel_right();
// Hook into libSave to keep panel in sync
const _origLibSave=libSave;
window.libSave=function(){_origLibSave();buildLibPanel_right();};
\$('rpal-dim-inp').oninput=function(){
  hlOpacity=Math.max(0,Math.min(100,parseInt(this.value)||0));
  if(hlColors.length)renderHL();
};
\$('hl-opacity-inp').oninput=function(){
  hlOpacity=Math.max(0,Math.min(100,parseInt(this.value)||0));
  if(hlColors.length)renderHL();
};

/*━━ KEYBOARD ━━*/
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!e.shiftKey){e.preventDefault();doUndo();}
  if((e.ctrlKey||e.metaKey)&&(e.key==='y'||(e.key==='z'&&e.shiftKey))){e.preventDefault();doRedo();}
  if(e.key==='Escape'&&hlColors.length)clearHL();
  // H = toggle hand/pan tool
  if(e.key==='h'||e.key==='H'){
    const tag=document.activeElement.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA')return;
    if(imgInfo)setActiveTool(activeTool==='pan'?null:'pan');
  }
  // SPACE = commit hovered canvas color to active tool (fill/paint/outline)
  if(e.key===' '||e.key==='Spacebar'){
    const tag=document.activeElement.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    if(['fill','paint','outline'].includes(activeTool)&&_toolHoverHex&&imgInfo&&curTab==='reduced'){
      e.preventDefault();
      updateActiveToolColor(_toolHoverHex);
      _flashSwatchPicked();
    }
  }
});

/*━━ TOOL HOVER COLOR TRACKING ━━*/
let _toolHoverHex=null;
let _toolSwatchPickMode=false;

const TOOL_SW_IDS={fill:'fill-active-sw',paint:'paint-active-sw',outline:'outline-active-sw'};

function _getToolCanvas(){return curTab==='reduced'?CR:(curTab==='orig'?CO:null);}

function _updateToolHover(hex){
  _toolHoverHex=hex;
}
function _clearToolHover(){
  _toolHoverHex=null;
}
function _flashSwatchPicked(){
  const swId=activeTool&&TOOL_SW_IDS[activeTool];if(!swId)return;
  const sw=\$(swId);if(!sw)return;
  sw.style.borderColor='#388e3c';sw.style.boxShadow='0 0 0 2px #c8e6c9';
  setTimeout(()=>{sw.style.borderColor='';sw.style.boxShadow='';},600);
}

// Hover tracking on VP
VP.addEventListener('mousemove',e=>{
  if(!imgInfo||!['fill','paint','outline'].includes(activeTool))return;
  const can=_getToolCanvas();if(!can)return;
  const rect=can.getBoundingClientRect();
  const sx=can.width/rect.width,sy=can.height/rect.height;
  const cx=Math.floor((e.clientX-rect.left)*sx),cy=Math.floor((e.clientY-rect.top)*sy);
  if(cx<0||cy<0||cx>=can.width||cy>=can.height){_clearToolHover();return;}
  const p=can.getContext('2d').getImageData(cx,cy,1,1).data;
  const hex=toHex([p[0],p[1],p[2]]);
  _updateToolHover(hex);
  // In pick mode: live-preview the hovered color on the swatch
  if(_toolSwatchPickMode){const swId=TOOL_SW_IDS[activeTool];if(swId)\$(swId).style.background=hex;}
});
VP.addEventListener('mouseleave',()=>{if(!_toolSwatchPickMode)_clearToolHover();});

// Canvas click in pick mode → commit color
VP.addEventListener('mousedown',e=>{
  if(!_toolSwatchPickMode||!['fill','paint','outline'].includes(activeTool)||!imgInfo||e.button!==0)return;
  const can=_getToolCanvas();if(!can)return;
  const rect=can.getBoundingClientRect();
  const sx=can.width/rect.width,sy=can.height/rect.height;
  const cx=Math.floor((e.clientX-rect.left)*sx),cy=Math.floor((e.clientY-rect.top)*sy);
  if(cx<0||cy<0||cx>=can.width||cy>=can.height)return;
  const p=can.getContext('2d').getImageData(cx,cy,1,1).data;
  const hex=toHex([p[0],p[1],p[2]]);
  updateActiveToolColor(hex);
  _flashSwatchPicked();
  _exitSwatchPickMode();
  e.stopPropagation();e.preventDefault();
},{capture:true});

function _enterSwatchPickMode(){
  if(!imgInfo)return;
  _toolSwatchPickMode=true;
  ['fill-active-sw','paint-active-sw','outline-active-sw'].forEach(id=>{const el=\$(id);if(el)el.classList.add('picking');});
  VP.style.cursor='crosshair';
}
function _exitSwatchPickMode(){
  _toolSwatchPickMode=false;
  ['fill-active-sw','paint-active-sw','outline-active-sw'].forEach(id=>{const el=\$(id);if(el)el.classList.remove('picking');});
  VP.style.cursor='';
  updateVpCursor();
  _clearToolHover();
}

// Swatch click → enter/exit canvas pick mode (event delegation since node moves to sidebar)
document.addEventListener('click',e=>{
  const id=e.target&&e.target.id;
  if(!['fill-active-sw','paint-active-sw','outline-active-sw'].includes(id))return;
  if(!['fill','paint','outline'].includes(activeTool)||!imgInfo)return;
  if(_toolSwatchPickMode){_exitSwatchPickMode();}else{_enterSwatchPickMode();}
});

// Esc → exit swatch pick mode
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&_toolSwatchPickMode){e.stopPropagation();_exitSwatchPickMode();}
},{capture:true});

/*━━ BINDINGS ━━*/
const dropEl=\$('drop');
dropEl.onclick=()=>{ const inp=\$('file-inp'); inp.value=''; inp.click(); };
dropEl.ondragover=e=>{e.preventDefault();dropEl.classList.add('drag');};
dropEl.ondragleave=()=>dropEl.classList.remove('drag');
dropEl.ondrop=e=>{e.preventDefault();dropEl.classList.remove('drag');loadFile(e.dataTransfer.files[0]);};
\$('file-inp').onchange=e=>loadFile(e.target.files[0]);
\$('cnt-inp').oninput=function(){cntVal=this.value;validateCount(cntVal);applyCountUI();};
document.querySelectorAll('.tb').forEach(b=>b.onclick=()=>{if(!b.disabled)switchTab(b.dataset.tab);});
\$('btn-reduce').onclick=doReduce;
\$('btn-exp').onclick=exportBmp;
\$('btn-cmap').onclick=openColorMap;
\$('btn-lib').onclick=()=>openLibWindow('manage');

/*━━ LIBRARY FILE BUTTON WIRING ━━*/
\$('lm-btn-save').onclick=libSaveFile;
\$('lm-btn-load').onclick=()=>{
  const inp=\$('lm-file-inp');inp.dataset.mode='load';inp.value='';inp.click();
};
\$('lm-btn-merge').onclick=()=>{
  const inp=\$('lm-file-inp');inp.dataset.mode='merge';inp.value='';inp.click();
};
\$('lm-file-inp').onchange=function(){
  libLoadFile(this.files[0],this.dataset.mode==='merge');
};
\$('btn-undo').onclick=doUndo;
\$('btn-redo').onclick=doRedo;
// Outline group buttons (event delegation — node moves to sidebar)
document.addEventListener('click',e=>{
  if(e.target&&e.target.id==='ol-group-apply')olApplyGroupOutline();
  if(e.target&&e.target.id==='ol-group-clear')olClearGroup();
});
// Render strip whenever outline tool panel opens
const _origOpenToolPopup=openToolPopup;
openToolPopup=function(name){
  _origOpenToolPopup(name);
  if(name==='outline')setTimeout(()=>olRenderStrip(),0);
};
['tile','fill','paint','outline'].forEach(t=>\$('ttab-'+t).onclick=()=>setActiveTool(t));
\$('btn-pan').onclick=()=>{if(imgInfo)setActiveTool(activeTool==='pan'?null:'pan');};
\$('btn-zo').onclick=()=>setZoom([...ZSTEPS].reverse().find(s=>s<zoomRef.v)||0.1);
\$('btn-zi').onclick=()=>setZoom(ZSTEPS.find(s=>s>zoomRef.v)||12);
\$('btn-z1').onclick=()=>{setZoom(1);requestAnimationFrame(()=>{if(imgInfo){VP.scrollLeft=Math.max(0,(imgInfo.w-VP.clientWidth)/2);VP.scrollTop=Math.max(0,(imgInfo.h-VP.clientHeight)/2);}});};
\$('btn-grid').onclick=()=>{
  gridOn=!gridOn;
  \$('btn-grid').classList.toggle('on',gridOn);
  renderGrid();
};
window.addEventListener('resize',()=>{if(imgInfo)updateSize();});` }} />
  );
}
