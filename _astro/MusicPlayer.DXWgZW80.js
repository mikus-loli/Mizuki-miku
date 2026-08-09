import{o as Ct,b as St,p as $,a as A,f as Bt,s as B,c as Tt}from"./props.EiI-NYj1.js";import{a as Ft,i as At}from"./legacy.CZSe5ewO.js";import{ah as Nt,E as Kt,bn as jt,bo as Xt,U as Ot,u as Wt,bp as Ut,bq as qt,P as Yt,bm as nt,br as Et,a1 as et,_ as pt,Z as Gt,a4 as d,x as o,a6 as k,a5 as c,$ as P,a0 as rt,a2 as bt,a3 as T,aa as ot,ab as tt,a7 as R,a8 as Y,ad as I,ac as gt,L as Zt,ae as Jt,bs as Qt,ag as $t,D as mt}from"./utils.jwP4-Gfn.js";import{a as te,s as O}from"./render.sGhB3qAJ.js";import{i as F}from"./if.p0YskRTD.js";import{I as V}from"./Icon.SyJlccCz.js";import{m as ft}from"./config.DZ3ppRub.js";import{m as _}from"./musicPlayerStore.D9BfiJnh.js";import{S as ee,a as re,b as ie,c as ne,d as ae,C as yt,P as oe,e as le,N as se}from"./SidebarTrackInfo.DDhCC1ol.js";import{I as J}from"./zh_TW.DQhvB9P3.js";import{i as Q}from"./translation.DlbXdEZS.js";import{s as ue}from"./snippet.BfyS9E_X.js";import{e as ce,i as de}from"./each.BNKTeNQK.js";const ge=()=>performance.now(),q={tick:r=>requestAnimationFrame(r),now:()=>ge(),tasks:new Set};function Mt(){const r=q.now();q.tasks.forEach(t=>{t.c(r)||(q.tasks.delete(t),t.f())}),q.tasks.size!==0&&q.tick(Mt)}function ve(r){let t;return q.tasks.size===0&&q.tick(Mt),{promise:new Promise(e=>{q.tasks.add(t={c:r,f:e})}),abort(){q.tasks.delete(t)}}}function dt(r,t){Et(()=>{r.dispatchEvent(new CustomEvent(t))})}function me(r){if(r==="float")return"cssFloat";if(r==="offset")return"cssOffset";if(r.startsWith("--"))return r;const t=r.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function wt(r){const t={},e=r.split(";");for(const s of e){const[a,l]=s.split(":");if(!a||l===void 0)break;const m=me(a.trim());t[m]=l.trim()}return t}const fe=r=>r;function Lt(r,t,e,s){var a=(r&Ut)!==0,l="both",m,g=t.inert,w=t.style.overflow,i,u;function v(){return Et(()=>m??=e()(t,s?.()??{},{direction:l}))}var b={is_global:a,in(){t.inert=g,i=ht(t,v(),u,1,()=>{dt(t,"introend"),i?.abort(),i=m=void 0,t.style.overflow=w})},out(S){t.inert=!0,u=ht(t,v(),i,0,()=>{dt(t,"outroend"),S?.()})},stop:()=>{i?.abort(),u?.abort()}},y=Nt;if((y.nodes.t??=[]).push(b),te){var p=a;if(!p){for(var n=y.parent;n&&(n.f&Kt)!==0;)for(;(n=n.parent)&&(n.f&jt)===0;);p=!n||(n.f&Xt)!==0}p&&Ot(()=>{Wt(()=>b.in())})}}function ht(r,t,e,s,a){var l=s===1;if(qt(t)){var m,g=!1;return Yt(()=>{if(!g){var S=t({direction:l?"in":"out"});m=ht(r,S,e,s,a)}}),{abort:()=>{g=!0,m?.abort()},deactivate:()=>m.deactivate(),reset:()=>m.reset(),t:()=>m.t()}}if(e?.deactivate(),!t?.duration&&!t?.delay)return dt(r,l?"introstart":"outrostart"),a(),{abort:nt,deactivate:nt,reset:nt,t:()=>s};const{delay:w=0,css:i,tick:u,easing:v=fe}=t;var b=[];if(l&&e===void 0&&(u&&u(0,1),i)){var y=wt(i(0,1));b.push(y,y)}var p=()=>1-s,n=r.animate(b,{duration:w,fill:"forwards"});return n.onfinish=()=>{n.cancel(),dt(r,l?"introstart":"outrostart");var S=e?.t()??1-s;e?.abort();var h=s-S,L=t.duration*Math.abs(h),C=[];if(L>0){var f=!1;if(i)for(var E=Math.ceil(L/16.666666666666668),D=0;D<=E;D+=1){var G=S+h*v(D/E),lt=wt(i(G,1-G));C.push(lt),f||=lt.overflow==="hidden"}f&&(r.style.overflow="hidden"),p=()=>{var it=n.currentTime;return S+h*v(it/L)},u&&ve(()=>{if(n.playState!=="running")return!1;var it=p();return u(it,1-it),!0})}n=r.animate(C,{duration:L,fill:"forwards"}),n.onfinish=()=>{p=()=>s,u?.(s,1-s),a()}},{abort:()=>{n&&(n.cancel(),n.effect=null,n.onfinish=nt)},deactivate:()=>{a=nt},reset:()=>{s===0&&u?.(1,0)},t:()=>p()}}function be(r){const t=r-1;return t*t*t+1}function zt(r){const t=r-1;return t*t*t+1}function kt(r){const t=typeof r=="string"&&r.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return t?[parseFloat(t[1]),t[2]||"px"]:[r,"px"]}function ye(r,{delay:t=0,duration:e=400,easing:s=zt,x:a=0,y:l=0,opacity:m=0}={}){const g=getComputedStyle(r),w=+g.opacity,i=g.transform==="none"?"":g.transform,u=w*(1-m),[v,b]=kt(a),[y,p]=kt(l);return{delay:t,duration:e,easing:s,css:(n,S)=>`
			transform: ${i} translate(${(1-n)*v}${b}, ${(1-n)*y}${p});
			opacity: ${w-u*S}`}}function he(r,{delay:t=0,duration:e=400,easing:s=zt,axis:a="y"}={}){const l=getComputedStyle(r),m=+l.opacity,g=a==="y"?"height":"width",w=parseFloat(l[g]),i=a==="y"?["top","bottom"]:["left","right"],u=i.map(h=>`${h[0].toUpperCase()}${h.slice(1)}`),v=parseFloat(l[`padding${u[0]}`]),b=parseFloat(l[`padding${u[1]}`]),y=parseFloat(l[`margin${u[0]}`]),p=parseFloat(l[`margin${u[1]}`]),n=parseFloat(l[`border${u[0]}Width`]),S=parseFloat(l[`border${u[1]}Width`]);return{delay:t,duration:e,easing:s,css:h=>`overflow: hidden;opacity: ${Math.min(h*20,1)*m};${g}: ${h*w}px;padding-${i[0]}: ${h*v}px;padding-${i[1]}: ${h*b}px;margin-${i[0]}: ${h*y}px;margin-${i[1]}: ${h*p}px;border-${i[0]}-width: ${h*n}px;border-${i[1]}-width: ${h*S}px;min-${g}: 0`}}var xe=T('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function pe(r,t){et(t,!0);let e=pt(Gt(_.getState())),s=pt(!1);function a(E){const D=E;D.detail&&bt(e,D.detail,!0)}Ct(()=>{window.addEventListener("music-sidebar:state",a)}),St(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",a)});function l(){_.toggle()}function m(){_.prev()}function g(){_.next()}function w(){_.toggleMode()}function i(){bt(s,!o(s))}function u(E){_.playIndex(E)}function v(E){_.seek(E)}function b(){_.toggleMute()}function y(E){_.setVolume(E)}var p=xe(),n=d(p),S=d(n);ee(S,{get currentSong(){return o(e).currentSong},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading}});var h=k(S,2);re(h,{get currentSong(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get volume(){return o(e).volume},get isMuted(){return o(e).isMuted},onToggleMute:b,onSetVolume:y}),c(n);var L=k(n,2);ie(L,{get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},onSeek:v});var C=k(L,2);ne(C,{get isPlaying(){return o(e).isPlaying},get isShuffled(){return o(e).isShuffled},get repeatMode(){return o(e).isRepeating},onToggleMode:w,onPrev:m,onNext:g,onTogglePlay:l,onTogglePlaylist:i});var f=k(C,2);ae(f,{get playlist(){return o(e).playlist},get currentIndex(){return o(e).currentIndex},get isPlaying(){return o(e).isPlaying},get show(){return o(s)},onClose:i,onPlaySong:u}),c(p),P(r,p),rt()}var we=T('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),ke=T('<div class="text-xs text-30 mt-1"> </div>'),_e=T('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function _t(r,t){et(t,!0);const e=$(t,"showTime",3,!1),s=$(t,"size",3,"mini");function a(i){if(!Number.isFinite(i)||i<0)return"0:00";const u=Math.floor(i/60),v=Math.floor(i%60);return`${u}:${v.toString().padStart(2,"0")}`}var l=ot(),m=tt(l);{var g=i=>{var u=we(),v=d(u),b=d(v,!0);c(v);var y=k(v,2),p=d(y,!0);c(y),c(u),R(()=>{O(b,t.song.title),O(p,t.song.artist)}),P(i,u)},w=i=>{var u=_e(),v=d(u),b=d(v,!0);c(v);var y=k(v,2),p=d(y,!0);c(y);var n=k(y,2);{var S=h=>{var L=ke(),C=d(L);c(L),R((f,E)=>O(C,`${f??""} / ${E??""}`),[()=>a(t.currentTime),()=>a(t.duration)]),P(h,L)};F(n,h=>{e()&&h(S)})}c(u),R(()=>{O(b,t.song.title),O(p,t.song.artist)}),P(i,u)};F(m,i=>{s()==="mini"?i(g):i(w,-1)})}P(r,l),rt()}var Pe=T('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),Ce=T('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),Se=T("<!> <!> <!>",1),Te=T("<div><!></div>");function Dt(r,t){et(t,!0);const e=$(t,"size",3,"mini"),s=$(t,"showControls",3,!1),a=$(t,"showPlaylist",3,!1);var l=Te(),m=d(l);{var g=i=>{var u=Pe(),v=tt(u);yt(v,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",interactive:!0,get onclick(){return t.onCoverClick}});var b=k(v,2),y=d(b);_t(y,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},size:"mini"}),c(b);var p=k(b,2),n=d(p),S=d(n);V(S,{icon:"material-symbols:visibility-off",class:"text-lg"}),c(n);var h=k(n,2),L=d(h);V(L,{icon:"material-symbols:expand-less",class:"text-lg"}),c(h),c(p),R((C,f)=>{B(b,"aria-label",C),B(n,"title",f)},[()=>Q(J.musicPlayerExpand),()=>Q(J.musicPlayerHide)]),I("click",b,function(...C){t.onInfoClick?.apply(this,C)}),I("keydown",b,C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),t.onInfoClick?.())}),I("click",n,C=>{C.stopPropagation(),t.onHideClick?.()}),I("click",h,C=>{C.stopPropagation(),t.onExpandClick?.()}),P(i,u)},w=i=>{var u=Se(),v=tt(u);yt(v,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded"});var b=k(v,2);_t(b,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},showTime:!0,size:"expanded"});var y=k(b,2);{var p=n=>{var S=Ce(),h=d(S),L=d(h);V(L,{icon:"material-symbols:visibility-off",class:"text-lg"}),c(h);var C=k(h,2);let f;var E=d(C);V(E,{icon:"material-symbols:queue-music",class:"text-lg"}),c(C),c(S),R((D,G)=>{B(h,"title",D),f=A(C,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,f,{"text-[var(--primary)]":a()}),B(C,"title",G)},[()=>Q(J.musicPlayerHide),()=>Q(J.musicPlayerPlaylist)]),I("click",h,function(...D){t.onHideClick?.apply(this,D)}),I("click",C,function(...D){t.onPlaylistClick?.apply(this,D)}),P(n,S)};F(y,n=>{s()&&n(p)})}P(i,u)};F(m,i=>{e()==="mini"?i(g):i(w,-1)})}c(l),R(()=>A(l,1,Bt(e()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),P(r,l),rt()}Y(["click","keydown"]);var Ee=T("<div><!></div>");function Me(r,t){var e=Ee();let s;var a=d(e);Dt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",get onCoverClick(){return t.onCoverClick},get onInfoClick(){return t.onInfoClick},get onHideClick(){return t.onHideClick},get onExpandClick(){return t.onExpandClick}}),c(e),R(()=>s=A(e,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,s,{"mini-enter":!t.isHidden,"mini-leave":t.isHidden,"pointer-events-none":t.isHidden})),P(r,e)}var Le=T("<button><!></button>"),ze=T("<button><!></button>");function Pt(r,t){const e=$(t,"repeatMode",3,0),s=$(t,"disabled",3,!1);var a=ot(),l=tt(a);{var m=w=>{var i=Le();let u;var v=d(i);V(v,{icon:"material-symbols:shuffle",class:"text-lg"}),c(i),R(()=>{u=A(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive}),i.disabled=s()}),I("click",i,function(...b){t.onclick?.apply(this,b)}),P(w,i)},g=w=>{var i=ze();let u;var v=d(i);{var b=n=>{V(n,{icon:"material-symbols:repeat-one",class:"text-lg"})},y=n=>{V(n,{icon:"material-symbols:repeat",class:"text-lg"})},p=n=>{V(n,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};F(v,n=>{e()===1?n(b):e()===2?n(y,1):n(p,-1)})}c(i),R(()=>u=A(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive})),I("click",i,function(...n){t.onclick?.apply(this,n)}),P(w,i)};F(l,w=>{t.mode==="shuffle"?w(m):w(g,-1)})}P(r,a)}Y(["click"]);var De=T('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function Ie(r,t){var e=De(),s=d(e);Pt(s,{mode:"shuffle",get isActive(){return t.isShuffled},get onclick(){return t.onShuffleClick}});var a=k(s,2);oe(a,{get onclick(){return t.onPrevClick},disabled:!1});var l=k(a,2);le(l,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get onclick(){return t.onPlayClick}});var m=k(l,2);se(m,{get onclick(){return t.onNextClick},disabled:!1});var g=k(m,2);{let w=gt(()=>t.isRepeating>0);Pt(g,{mode:"repeat",get isActive(){return o(w)},get repeatMode(){return t.isRepeating},get onclick(){return t.onRepeatClick}})}c(e),P(r,e)}var Re=T('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function Ve(r,t){et(t,!0);var e=Re(),s=d(e);c(e),R(a=>{B(e,"aria-label",a),B(e,"aria-valuenow",t.duration>0?t.currentTime/t.duration*100:0),Tt(s,`width: ${t.duration>0?t.currentTime/t.duration*100:0}%`)},[()=>Q(J.musicPlayerProgress)]),I("click",e,function(...a){t.onclick?.apply(this,a)}),I("keydown",e,function(...a){t.onkeydown?.apply(this,a)}),P(r,e),rt()}Y(["click","keydown"]);var He=T('<div class="progress-section mb-4"><!></div>');function Be(r,t){var e=He(),s=d(e);Ve(s,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onclick(){return t.onProgressClick},get onkeydown(){return t.onProgressKeyDown}}),c(e),P(r,e)}var Fe=T('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function Ae(r,t){var e=Fe(),s=d(e);{var a=g=>{V(g,{icon:"material-symbols:volume-off",class:"text-lg"})},l=g=>{V(g,{icon:"material-symbols:volume-down",class:"text-lg"})},m=g=>{V(g,{icon:"material-symbols:volume-up",class:"text-lg"})};F(s,g=>{t.isMuted||t.volume===0?g(a):t.volume<.5?g(l,1):g(m,-1)})}c(e),I("click",e,function(...g){t.onclick?.apply(this,g)}),P(r,e)}Y(["click"]);var Ne=T('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function Ke(r,t){var e=Ne(),s=d(e);let a;c(e),Ft(e,l=>t.volumeBarRef?.(l)),R(()=>{B(e,"aria-label",t.ariaLabel),B(e,"aria-valuenow",t.volume*100),a=A(s,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,a,{"duration-100":!t.isVolumeDragging,"duration-0":t.isVolumeDragging}),Tt(s,`width: ${t.volume*100}%`)}),I("pointerdown",e,function(...l){t.onpointerdown?.apply(this,l)}),I("keydown",e,function(...l){t.onkeydown?.apply(this,l)}),P(r,e)}Y(["pointerdown","keydown"]);var je=T('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function Xe(r,t){var e=je(),s=d(e);Ae(s,{get volume(){return t.volume},get isMuted(){return t.isMuted},get onclick(){return t.onVolumeButtonClick}});var a=k(s,2);{let m=gt(()=>t.isMuted?0:t.volume);Ke(a,{get volume(){return o(m)},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onpointerdown(){return t.onSliderPointerDown},get onkeydown(){return t.onSliderKeyDown},get ariaLabel(){return t.ariaLabel}})}var l=k(a,2);ue(l,()=>t.children??nt),c(e),P(r,e)}var Oe=T('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),We=T("<div><!> <!> <!> <!></div>");function Ue(r,t){et(t,!0);var e=We();let s;var a=d(e);Dt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return t.showPlaylist},get onHideClick(){return t.onHideClick},get onPlaylistClick(){return t.onPlaylistClick}});var l=k(a,2);Be(l,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onProgressClick(){return t.onProgressClick},get onProgressKeyDown(){return t.onProgressKeyDown}});var m=k(l,2);Ie(m,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get isShuffled(){return t.isShuffled},get isRepeating(){return t.isRepeating},get onPlayClick(){return t.onPlayClick},get onPrevClick(){return t.onPrevClick},get onNextClick(){return t.onNextClick},get onShuffleClick(){return t.onShuffleClick},get onRepeatClick(){return t.onRepeatClick}});var g=k(m,2);{const w=u=>{var v=Oe(),b=d(v);V(b,{icon:"material-symbols:expand-more",class:"text-lg"}),c(v),R(y=>B(v,"title",y),[()=>Q(J.musicPlayerCollapse)]),I("click",v,function(...y){t.onCollapseClick?.apply(this,y)}),P(u,v)};let i=gt(()=>Q(J.musicPlayerVolume));Xe(g,{get volume(){return t.volume},get isMuted(){return t.isMuted},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onVolumeButtonClick(){return t.onVolumeButtonClick},get onSliderPointerDown(){return t.onSliderPointerDown},get onSliderKeyDown(){return t.onSliderKeyDown},get ariaLabel(){return o(i)},children:w})}c(e),R(()=>s=A(e,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,s,{"opacity-0":t.isHidden,"scale-95":t.isHidden,"pointer-events-none":t.isHidden})),P(r,e),rt()}Y(["click"]);var qe=T('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ye=T('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function Ge(r,t){et(t,!0);const e=$(t,"lazy",3,!0);function s(f){return f.startsWith("http://")||f.startsWith("https://")?f.includes("126.net")?f+"?param=64y64":f:f.startsWith("/")?f:`/${f}`}var a=Ye();let l;var m=d(a),g=d(m);{var w=f=>{V(f,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=f=>{V(f,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},u=f=>{var E=qe(),D=d(E,!0);c(E),R(()=>O(D,t.index+1)),P(f,E)};F(g,f=>{t.isCurrent&&t.isPlaying?f(w):t.isCurrent?f(i,1):f(u,-1)})}c(m);var v=k(m,2),b=d(v);c(v);var y=k(v,2),p=d(y);let n;var S=d(p,!0);c(p);var h=k(p,2);let L;var C=d(h,!0);c(h),c(y),c(a),R(f=>{l=A(a,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,l,{"bg-[var(--btn-plain-bg)]":t.isCurrent,"text-[var(--primary)]":t.isCurrent}),B(a,"aria-label",`播放 ${t.song.title??""} - ${t.song.artist??""}`),B(b,"src",f),B(b,"alt",t.song.title),B(b,"loading",e()?"lazy":"eager"),n=A(p,1,"font-medium truncate",null,n,{"text-[var(--primary)]":t.isCurrent,"text-90":!t.isCurrent}),O(S,t.song.title),L=A(h,1,"text-sm text-[var(--content-meta)] truncate",null,L,{"text-[var(--primary)]":t.isCurrent}),O(C,t.song.artist)},[()=>s(t.song.cover)]),I("click",a,function(...f){t.onclick?.apply(this,f)}),I("keydown",a,f=>{(f.key==="Enter"||f.key===" ")&&(f.preventDefault(),t.onclick())}),P(r,a),rt()}Y(["click","keydown"]);var Ze=T('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Je(r,t){et(t,!0);var e=ot(),s=tt(e);{var a=l=>{var m=Ze(),g=d(m),w=d(g),i=d(w,!0);c(w);var u=k(w,2),v=d(u);V(v,{icon:"material-symbols:close",class:"text-lg"}),c(u),c(g);var b=k(g,2);ce(b,21,()=>t.playlist,de,(y,p,n)=>{{let S=gt(()=>n===t.currentIndex);Ge(y,{get song(){return o(p)},index:n,get isCurrent(){return o(S)},get isPlaying(){return t.isPlaying},onclick:()=>t.onPlaySong(n),lazy:n!==0})}}),c(b),c(m),R(y=>O(i,y),[()=>Q(J.musicPlayerPlaylist)]),I("click",u,function(...y){t.onClose?.apply(this,y)}),Lt(3,m,()=>he,()=>({duration:300,axis:"y"})),P(l,m)};F(s,l=>{t.show&&l(a)})}P(r,e),rt()}Y(["click"]);var Qe=T('<div class="fixed bottom-20 right-4 z-[60] max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),$e=T('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),tr=T("<div><div><!></div> <!> <!> <!></div>"),er=T(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (max-width: 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (max-width: 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function fr(r,t){et(t,!1);let e=Zt(_.getState());const s=ft.showFloatingPlayer,l=(ft.floatingEntryMode??"default")==="fab",m=s&&ft.enable;let g;function w(){_.toggle()}function i(){_.prev()}function u(){_.next()}function v(){_.toggleShuffle()}function b(){_.toggleRepeat()}function y(x){_.playIndex(x)}function p(x){const z=x.currentTarget;if(!z)return;const W=z.getBoundingClientRect(),j=(x.clientX-W.left)/W.width;_.setProgress(j)}function n(x){(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),_.setProgress(.5))}function S(){_.toggleMute()}function h(){_.toggleMute()}function L(x){const z=x.currentTarget;if(!z)return;const W=M=>{const N=z.getBoundingClientRect();if(N.width<=0)return;const K=Math.max(0,Math.min(1,(M-N.left)/N.width));_.setVolume(K)};W(x.clientX);const j=x.pointerId;z.setPointerCapture(j);const st=M=>{M.pointerId===j&&W(M.clientX)},ut=()=>{z.removeEventListener("pointermove",st),z.removeEventListener("pointerup",ct),z.removeEventListener("pointercancel",H),z.hasPointerCapture(j)&&z.releasePointerCapture(j)},ct=M=>{M.pointerId===j&&(W(M.clientX),ut())},H=M=>{M.pointerId===j&&ut()};z.addEventListener("pointermove",st),z.addEventListener("pointerup",ct),z.addEventListener("pointercancel",H)}function C(x){return x instanceof HTMLElement?!!x.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'):!1}function f(x,z=!1){if(!(z&&C(x.target))){if(x.key==="ArrowLeft"||x.key==="ArrowDown"){x.preventDefault(),_.setVolume(o(e).volume-.05);return}if(x.key==="ArrowRight"||x.key==="ArrowUp"){x.preventDefault(),_.setVolume(o(e).volume+.05);return}(x.key==="Enter"||x.key===" "||x.key==="m"||x.key==="M")&&(x.preventDefault(),S())}}function E(){_.togglePlaylist()}function D(){_.toggleExpanded()}function G(){_.toggleHidden()}function lt(){_.hideError()}function it(x){}function It(){return _.canSkip()}Ct(()=>{g=_.subscribe(x=>{bt(e,x)}),_.initialize()}),St(()=>{g&&g(),_.destroy()}),At();var xt=ot();Jt("keydown",Qt,x=>f(x,!0));var Rt=tt(xt);{var Vt=x=>{var z=er(),W=tt(z);{var j=H=>{var M=Qe(),N=d(M),K=d(N);V(K,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var U=k(K,2),Z=d(U,!0);c(U);var X=k(U,2),at=d(X);V(at,{icon:"material-symbols:close",class:"text-lg"}),c(X),c(N),c(M),R(()=>O(Z,o(e).errorMessage)),I("click",X,lt),P(H,M)};F(W,H=>{o(e).showError&&H(j)})}var st=k(W,2);{var ut=H=>{var M=ot(),N=tt(M);{var K=U=>{var Z=$e(),X=d(Z),at=d(X);pe(at,{}),c(X),c(Z),Lt(3,X,()=>ye,()=>({y:16,duration:280,opacity:.12,easing:be})),P(U,Z)};F(N,U=>{o(e).isExpanded&&U(K)})}P(H,M)},ct=H=>{var M=tr();let N;var K=d(M),U=d(K);yt(U,{get cover(){return o(e).currentSong.cover},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},size:"orb",onclick:G}),c(K);var Z=k(K,2);{let vt=mt(()=>o(e).isExpanded||o(e).isHidden);Me(Z,{get song(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},get isHidden(){return o(vt)},onCoverClick:w,onInfoClick:D,onHideClick:G,onExpandClick:D})}var X=k(Z,2);{let vt=mt(It),Ht=mt(()=>!o(e).isExpanded);Ue(X,{get song(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},get isShuffled(){return o(e).isShuffled},get isRepeating(){return o(e).isRepeating},get showPlaylist(){return o(e).showPlaylist},get canSkip(){return o(vt)},get volume(){return o(e).volume},get isMuted(){return o(e).isMuted},isVolumeDragging:!1,get isHidden(){return o(Ht)},volumeBarRef:it,onPlayClick:w,onPrevClick:i,onNextClick:()=>u(),onShuffleClick:v,onRepeatClick:b,onProgressClick:p,onProgressKeyDown:n,onVolumeButtonClick:h,onSliderPointerDown:L,onSliderKeyDown:f,onHideClick:G,onPlaylistClick:E,onCollapseClick:D})}var at=k(X,2);Je(at,{get playlist(){return o(e).playlist},get currentIndex(){return o(e).currentIndex},get isPlaying(){return o(e).isPlaying},get show(){return o(e).showPlaylist},onClose:E,onPlaySong:y}),c(M),R(()=>{N=A(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,N,{expanded:o(e).isExpanded,"hidden-mode":o(e).isHidden}),A(K,1,`orb-player-container ${o(e).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),P(H,M)};F(st,H=>{l?H(ut):H(ct,-1)})}$t(2),P(x,z)};F(Rt,x=>{m&&x(Vt)})}P(r,xt),rt()}Y(["click"]);export{fr as default};
