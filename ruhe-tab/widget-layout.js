"use strict";

(() => {
  const KEY = "ruhe-tab-widget-windows-v1";
  const LEGACY_KEY = "ruhe-tab-widget-layout-v1";
  const definitions = [
    ["clock", ".clock-widget", "Uhr und Datum", 360, 180, 90],
    ["greeting", ".greeting-widget", "Begrüßung", 520, 180, 90],
    ["goal", ".goal-section", "Tagesziel", 460, 200, 140],
    ["tasks", ".tasks-panel", "Aufgabenliste", 310, 220, 180],
    ["links", ".shortcuts", "Webseiten-Verknüpfungen", 600, 200, 140],
    ["calendar", ".calendar-widget", "Kalender und Termine", 330, 260, 240]
  ];
  const stage = document.querySelector("main");
  const settings = document.getElementById("personalization");
  const toggle = document.getElementById("edit-widget-layout");
  const finish = document.getElementById("finish-widget-layout");
  const clamp = (value, low, high) => Math.max(low, Math.min(Math.max(low, high), value));
  let current, editing = false, gesture = null, raf = 0, front = 0;
  const defaults = () => ({version:1, positions:null, sizes:{}, visible:Object.fromEntries(definitions.map(([name])=>[name,true]))});
  function status(message, error = false) {
    document.getElementById("layout-status").textContent = message;
    const feedback = document.getElementById("layout-feedback");
    feedback.textContent = error ? message : ""; feedback.hidden = !error;
  }
  const widgets = definitions.map(([name, selector, label, width, minWidth, minHeight]) => {
    const node = document.querySelector(selector), marker = document.createComment(`window-${name}`);
    node.before(marker);
    const frame = document.createElement("div"); frame.className = "layout-frame"; frame.dataset.widget = name;
    const toolbar = document.createElement("div"); toolbar.className = "layout-toolbar";
    const handle = document.createElement("button"); handle.type = "button"; handle.className = "layout-handle"; handle.textContent = `↕ ${label}`;
    handle.setAttribute("aria-label", `${label} verschieben`); handle.setAttribute("aria-describedby", "layout-help");
    const hide = document.createElement("button"); hide.type = "button"; hide.className = "widget-hide"; hide.textContent = "×";
    hide.setAttribute("aria-label", `${label} ausblenden`); hide.title = "Ausblenden – Inhalte bleiben erhalten";
    toolbar.append(handle, hide); frame.append(toolbar);
    const grips = ["n","s","e","w","ne","nw","se","sw"].map(edge => {
      const grip = document.createElement("button"); grip.type = "button"; grip.className = `resize-grip resize-${edge}`; grip.dataset.edge = edge;
      grip.setAttribute("aria-label", `${label}: Fenstergröße an ${edge.toUpperCase()}-Kante ändern`); grip.setAttribute("aria-describedby", "layout-help");
      grip.tabIndex = ["e","s"].includes(edge) ? 0 : -1; frame.append(grip); return grip;
    });
    return {name,node,marker,frame,handle,hide,grips,width,minWidth,minHeight,checkbox:document.getElementById(`visible-${name}`)};
  });
  function parsePositions(value) {
    if (value === null) return null;
    if (!value || typeof value !== "object") throw new Error("Ungültige Positionen");
    return Object.fromEntries(widgets.map(({name}) => {
      const p = value[name] ?? (name === "calendar" ? {x:0.65,y:0.4} : null);
      if (!p || typeof p.x !== "number" || !Number.isFinite(p.x) || typeof p.y !== "number" || !Number.isFinite(p.y)) throw new Error("Ungültige Position");
      return [name,{x:clamp(p.x,0,1),y:clamp(p.y,0,1)}];
    }));
  }
  function read() {
    const raw = localStorage.getItem(KEY), value = raw === null ? null : JSON.parse(raw), state = defaults();
    if (value !== null) {
      if (value.version !== 1) throw new Error("Ungültige Fenstereinstellungen");
      state.positions = parsePositions(value.positions);
      for (const {name} of widgets) {
        if (value.visible?.[name] !== undefined) {
          if (typeof value.visible[name] !== "boolean") throw new Error("Ungültige Sichtbarkeit");
          state.visible[name] = value.visible[name];
        }
        const size = value.sizes?.[name];
        if (size !== undefined) {
          if (typeof size.w !== "number" || !Number.isFinite(size.w) || size.w <= 0 || typeof size.h !== "number" || !Number.isFinite(size.h) || size.h <= 0) throw new Error("Ungültige Fenstergröße");
          state.sizes[name] = {w:Math.min(50000,size.w),h:Math.min(50000,size.h),custom:size.custom === true};
        }
      }
    } else {
      const oldRaw = localStorage.getItem(LEGACY_KEY);
      if (oldRaw) {
        const old = JSON.parse(oldRaw);
        if (old?.version !== 1) throw new Error("Ungültige alte Anordnung");
        state.positions = parsePositions(old.positions);
        try { state.legacyWidths = JSON.parse(localStorage.getItem("ruhe-tab-widget-sizes-v1")) || {}; } catch { state.legacyWidths = {}; }
      }
    }
    return state;
  }
  function sizeStage() {
    const margin = innerWidth <= 640 ? 12 : 24;
    const top = Math.max(0, document.querySelector("header").getBoundingClientRect().bottom) + 8;
    const bottom = document.querySelector("footer").getBoundingClientRect().height + 12;
    stage.style.setProperty("--layout-top", `${top}px`); stage.style.setProperty("--layout-left", `${margin}px`);
    stage.style.setProperty("--layout-width", `${Math.max(1,innerWidth-2*margin)}px`); stage.style.setProperty("--layout-height", `${Math.max(32,innerHeight-top-bottom)}px`);
  }
  function bounds(widget) {
    return {aw:stage.clientWidth,ah:stage.clientHeight,w:widget.frame.offsetWidth,h:widget.frame.offsetHeight,minW:Math.min(widget.minWidth,stage.clientWidth),minH:Math.min(widget.minHeight,stage.clientHeight)};
  }
  function rect(widget) { const b = bounds(widget); return {x:parseFloat(widget.frame.style.left)||0,y:parseFloat(widget.frame.style.top)||0,w:b.w,h:b.h}; }
  function place(widget, value) {
    const b = bounds(widget), x = clamp(value.x,0,b.aw-b.w), y = clamp(value.y,0,b.ah-b.h);
    widget.frame.style.left = `${x}px`; widget.frame.style.top = `${y}px`; return {x,y,w:b.w,h:b.h};
  }
  function arrange() {
    if (!current?.positions) return;
    sizeStage();
    for (const widget of widgets) {
      if (!current.visible[widget.name]) continue;
      const b = bounds(widget), size = current.sizes[widget.name];
      const legacy = current.legacyWidths?.[widget.name];
      const multiplier = typeof legacy === "number" && Number.isFinite(legacy) ? clamp(legacy,75,150)/100 : 1;
      widget.frame.style.width = `${clamp(size?.w || widget.width*multiplier,b.minW,b.aw)}px`;
      widget.frame.style.height = size ? `${clamp(size.h,b.minH,b.ah)}px` : "";
      widget.frame.dataset.sized = String(Boolean(size));
    }
    for (const widget of widgets) {
      if (!current.visible[widget.name]) continue;
      if (!current.sizes[widget.name]) {
        const b = bounds(widget);
        current.sizes[widget.name] = {w:b.w,h:clamp(b.h,b.minH,b.ah),custom:false};
        widget.frame.style.height = `${current.sizes[widget.name].h}px`; widget.frame.dataset.sized = "true";
      }
      const p = current.positions[widget.name]; place(widget,{x:p.x*stage.clientWidth,y:p.y*stage.clientHeight});
    }
    delete current.legacyWidths;
  }
  function schedule() {
    if (!current?.positions || raf) return;
    raf = requestAnimationFrame(()=>{raf=0;if(!gesture)arrange()});
  }
  function markEditing(value) {
    editing = value; document.body.classList.toggle("layout-editing",editing);
    toggle.setAttribute("aria-pressed",String(editing)); toggle.textContent = editing ? "Layout beenden" : "Layout bearbeiten"; finish.hidden = !editing;
    for (const widget of widgets) for (const button of [widget.handle,widget.hide,...widget.grips]) button.disabled = !editing || !current?.visible[widget.name];
  }
  function apply(state) {
    cancelGesture(); current=state; document.body.classList.toggle("layout-free",Boolean(state.positions));
    for (const widget of widgets) {
      widget.node.hidden = !state.visible[widget.name]; widget.frame.hidden = !state.visible[widget.name]; widget.checkbox.checked = state.visible[widget.name];
      if (state.positions) { if(widget.node.parentElement!==widget.frame)widget.frame.append(widget.node);if(widget.frame.parentElement!==stage)stage.append(widget.frame); }
      else { widget.marker.after(widget.node);widget.frame.remove(); }
    }
    document.querySelector(".focus").hidden = !["clock","greeting","goal"].some(name=>state.visible[name]);
    document.getElementById("widgets-empty").hidden = widgets.some(widget=>state.visible[widget.name]);
    markEditing(Boolean(state.positions) && editing); arrange();
  }
  function restore() {
    try { apply(read()); }
    catch { apply(defaults());status("Die Fenstereinstellungen konnten nicht gelesen werden. Standardwerte werden angezeigt; deine Inhalte wurden nicht gelöscht.",true); }
  }
  function latest() { try { return read(); } catch { return current || defaults(); } }
  function commit(state,message) {
    try { apply(state);localStorage.setItem(KEY,JSON.stringify(current));status(message);return true; }
    catch { restore();status("Die Änderung konnte nicht gespeichert werden. Die zuletzt gespeicherten Fenstereinstellungen werden angezeigt.",true);return false; }
  }
  function raise(widget) { widget.frame.style.zIndex=String(++front); }
  function cancelGesture() {
    if(!gesture)return;
    const old=gesture;gesture=null;old.widget.frame.classList.remove("is-dragging","is-resizing");
    if(old.control.hasPointerCapture(old.id))old.control.releasePointerCapture(old.id);
    arrange();
  }
  function seedPositions(original) {
    const visible=widgets.filter(widget=>current.visible[widget.name]), gap=16, points={};
    let x=0,y=0,rowHeight=0,usedWidth=0;
    for(const widget of visible) {
      const b=bounds(widget);
      if(x && x+b.w>stage.clientWidth){y+=rowHeight+gap;x=0;rowHeight=0}
      points[widget.name]={x,y};usedWidth=Math.max(usedWidth,x+b.w);x+=b.w+gap;rowHeight=Math.max(rowHeight,b.h);
    }
    const totalHeight=y+rowHeight, fits=totalHeight<=stage.clientHeight;
    for(const widget of widgets) {
      let p=points[widget.name] || {x:0,y:0};
      if(fits){p={x:p.x+(stage.clientWidth-usedWidth)/2,y:p.y+(stage.clientHeight-totalHeight)/2}}
      else if(original?.[widget.name]){const area=stage.getBoundingClientRect();p={x:original[widget.name].left-area.left,y:original[widget.name].top-area.top}}
      else {const index=widgets.indexOf(widget);p={x:(index%2)*stage.clientWidth*.55,y:Math.floor(index/2)*stage.clientHeight*.28}}
      const actual=place(widget,p);
      current.positions[widget.name]={x:actual.x/Math.max(1,stage.clientWidth),y:actual.y/Math.max(1,stage.clientHeight)};
    }
  }
  function endEditing(){cancelGesture();markEditing(false);arrange();settings.querySelector("summary").focus()}
  function startEditing() {
    if(!current.positions) {
      window.scrollTo(0,0);
      const original=Object.fromEntries(widgets.map(widget=>[widget.name,widget.node.getBoundingClientRect()]));
      const state=latest();state.positions=Object.fromEntries(widgets.map(({name})=>[name,{x:0,y:0}]));apply(state);seedPositions(original);
      if(!commit(current,"Freie Anordnung lokal gespeichert."))return;
    }
    markEditing(true);arrange();settings.open=false;(widgets.find(widget=>current.visible[widget.name])?.handle || finish).focus();
  }
  function setVisible(widget,value,fromClose=false) {
    const state=latest();state.visible[widget.name]=value;
    if(commit(state,value?"Widget wieder hinzugefügt. Inhalte und Einstellungen bleiben erhalten.":"Widget ausgeblendet. Inhalte und Einstellungen bleiben erhalten.") && fromClose) {
      (widgets.find(item=>current.visible[item.name])?.handle || finish).focus();
    }
  }
  function changedRect(start,edge,dx,dy,widget) {
    const b=bounds(widget), r={...start};
    if(edge==="move"){r.x=clamp(start.x+dx,0,b.aw-start.w);r.y=clamp(start.y+dy,0,b.ah-start.h);return r}
    if(edge.includes("e"))r.w=clamp(start.w+dx,b.minW,b.aw-start.x);
    if(edge.includes("s"))r.h=clamp(start.h+dy,b.minH,b.ah-start.y);
    if(edge.includes("w")){r.x=clamp(start.x+dx,0,start.x+start.w-b.minW);r.w=start.x+start.w-r.x}
    if(edge.includes("n")){r.y=clamp(start.y+dy,0,start.y+start.h-b.minH);r.h=start.y+start.h-r.y}
    return r;
  }
  function preview(widget,r,edge) {
    if(edge!=="move"){widget.frame.style.width=`${r.w}px`;widget.frame.style.height=`${r.h}px`;widget.frame.dataset.sized="true"}
    place(widget,r);
  }
  function commitRect(widget,r,resized) {
    const state=latest();
    state.positions ||= current.positions;
    state.positions={...state.positions,[widget.name]:{x:clamp(r.x/Math.max(1,stage.clientWidth),0,1),y:clamp(r.y/Math.max(1,stage.clientHeight),0,1)}};
    state.sizes[widget.name]=resized?{w:r.w,h:r.h,custom:true}:current.sizes[widget.name];
    commit(state,resized?"Fenstergröße lokal gespeichert.":"Position lokal gespeichert.");
  }
  for(const widget of widgets) {
    widget.checkbox.addEventListener("change",()=>setVisible(widget,widget.checkbox.checked));
    widget.hide.addEventListener("click",()=>setVisible(widget,false,true));
    widget.frame.addEventListener("pointerdown",()=>raise(widget));widget.frame.addEventListener("focusin",()=>raise(widget));
    for(const control of [widget.handle,...widget.grips]) {
      const edge=control.dataset.edge || "move";
      control.addEventListener("pointerdown",event=>{
        if(!editing || !current.positions || event.button!==0 || !event.isPrimary)return;
        event.preventDefault();cancelGesture();control.focus();raise(widget);
        gesture={widget,control,edge,id:event.pointerId,x:event.clientX,y:event.clientY,start:rect(widget)};
        widget.frame.classList.add(edge==="move"?"is-dragging":"is-resizing");control.setPointerCapture(event.pointerId);
      });
      control.addEventListener("pointermove",event=>{if(gesture?.control===control && gesture.id===event.pointerId)preview(widget,changedRect(gesture.start,edge,event.clientX-gesture.x,event.clientY-gesture.y,widget),edge)});
      control.addEventListener("pointerup",event=>{
        if(gesture?.control!==control || gesture.id!==event.pointerId)return;
        const r=rect(widget);gesture=null;widget.frame.classList.remove("is-dragging","is-resizing");if(control.hasPointerCapture(event.pointerId))control.releasePointerCapture(event.pointerId);commitRect(widget,r,edge!=="move");
      });
      for(const type of ["pointercancel","lostpointercapture"])control.addEventListener(type,event=>{if(gesture?.control===control && gesture.id===event.pointerId)cancelGesture()});
      control.addEventListener("keydown",event=>{
        if(!editing || !current.positions)return;
        if(event.key==="Escape"){event.preventDefault();if(gesture)cancelGesture();else endEditing();return}
        if(event.key==="Enter"){event.preventDefault();endEditing();return}
        const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
        if(!direction || gesture)return;
        const dx=(edge==="move" || /[ew]/.test(edge))?direction[0]*(event.shiftKey?1:10):0;
        const dy=(edge==="move" || /[ns]/.test(edge))?direction[1]*(event.shiftKey?1:10):0;
        if(!dx && !dy)return;event.preventDefault();const r=changedRect(rect(widget),edge,dx,dy,widget);preview(widget,r,edge);commitRect(widget,r,edge!=="move");
      });
    }
  }
  toggle.addEventListener("click",()=>editing?endEditing():startEditing());finish.addEventListener("click",endEditing);
  document.getElementById("reset-widget-layout").addEventListener("click",()=>{
    const state=latest(), custom=Object.fromEntries(Object.entries(state.sizes).filter(([,size])=>size.custom));
    state.sizes=custom;
    if(Object.keys(custom).length){state.positions=Object.fromEntries(widgets.map(({name})=>[name,{x:0,y:0}]));apply(state);seedPositions();commit(current,"Standardanordnung hergestellt. Eigene Fenstergrößen, Schrift und Inhalte bleiben erhalten.")}
    else {state.positions=null;commit(state,"Standardanordnung hergestellt. Sichtbarkeit, Schrift und Inhalte bleiben erhalten.")}
  });
  document.getElementById("reset-window-sizes").addEventListener("click",()=>{const state=latest();state.sizes={};commit(state,"Standardfenstergrößen hergestellt. Positionen, Schrift und Inhalte bleiben erhalten.")});
  document.getElementById("show-widget-settings").addEventListener("click",event=>{event.stopPropagation();settings.open=true;document.querySelector(".widget-manager").scrollIntoView({block:"start"});widgets[0].checkbox.focus()});
  window.addEventListener("resize",()=>{cancelGesture();schedule()});window.addEventListener("blur",cancelGesture);
  window.addEventListener("pagehide",()=>{cancelGesture();if(raf)cancelAnimationFrame(raf);raf=0});window.addEventListener("pageshow",schedule);
  window.addEventListener("storage",event=>{if(event.key!==KEY && event.key!==LEGACY_KEY && event.key!==null)return;status("");restore()});
  document.addEventListener("ruhe-widget-sizes-change",()=>{cancelGesture();schedule()});
  const observer=new ResizeObserver(schedule);
  for(const widget of widgets)observer.observe(widget.frame);
  observer.observe(document.querySelector("header"));observer.observe(document.querySelector("footer"));
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",restore,{once:true});else restore();
})();
