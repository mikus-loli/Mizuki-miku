class h{visibleBlocks;pendingThemeUpdate;codeBlockObserver;hideCodeBlocksDuringTransition;isOptimizing;heavySelectors;useViewTransition;tempStyleSheet;hiddenElements;compositedElements;constructor(){this.visibleBlocks=new Set,this.pendingThemeUpdate=null,this.codeBlockObserver=null,this.hideCodeBlocksDuringTransition=!0,this.initFromConfig(),this.isOptimizing=!1,this.heavySelectors=[".float-panel","#navbar",".music-player","#mobile-toc-panel","#nav-menu-panel","#search-panel",".dropdown-content",".widget",".post-card",".custom-md"],this.useViewTransition=!1,this.tempStyleSheet=null,this.hiddenElements=null,this.compositedElements=null,this.init()}init(){this.initFromConfig(),this.initCodeBlockOptimization(),this.interceptThemeSwitch(),this.applyCodeBlockTransitionBehavior(),this.setupSwupHooks(),document.dispatchEvent(new CustomEvent("themeOptimizerReady"))}setupSwupHooks(){const e=()=>window.swup?(window.swup.hooks.on("page:view",()=>{setTimeout(()=>{this.observeCodeBlocks(),this.applyCodeBlockTransitionBehavior(),this.forceApplyThemeTransitionStyles()},100)}),window.swup.hooks.on("content:replace",()=>{setTimeout(()=>{this.applyCodeBlockTransitionBehavior(),this.forceApplyThemeTransitionStyles()},50)}),!0):!1;if(!e()){document.addEventListener("swup:enable",()=>{e()});const t=setInterval(()=>{e()&&clearInterval(t)},100);setTimeout(()=>{clearInterval(t)},2e3)}}forceApplyThemeTransitionStyles(){const e=document.querySelectorAll(".expressive-code");e.forEach(i=>{const s=i;this.hideCodeBlocksDuringTransition?s.classList.add("hide-during-transition"):s.classList.remove("hide-during-transition"),s.offsetWidth}),document.documentElement.classList.contains("is-theme-transitioning")?e.forEach(i=>{const s=i;s.classList.contains("hide-during-transition")&&(s.style.setProperty("content-visibility","hidden","important"),s.style.setProperty("opacity","0.99","important"))}):e.forEach(i=>{const s=i;s.style.removeProperty("content-visibility"),s.style.removeProperty("opacity")})}initFromConfig(){try{const e=document.getElementById("config-carrier");e&&e.dataset.hideCodeBlocksDuringTransition!==void 0&&(this.hideCodeBlocksDuringTransition=e.dataset.hideCodeBlocksDuringTransition==="true")}catch{this.hideCodeBlocksDuringTransition=!0}}applyCodeBlockTransitionBehavior(){document.querySelectorAll(".expressive-code").forEach(t=>{this.hideCodeBlocksDuringTransition?t.classList.add("hide-during-transition"):t.classList.remove("hide-during-transition")}),this.updateTempStyleSheet()}updateTempStyleSheet(){if(this.tempStyleSheet){let e=this.tempStyleSheet.textContent;e&&!e.includes(".is-theme-transitioning .expressive-code")&&(e+=`
`+`.is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* 避免闪烁 */
        opacity: 0.99;
      }`+`
`+`.is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* 保持代码块可见，但禁用过渡效果 */
        content-visibility: visible !important;
        opacity: 1 !important;
      }`,this.tempStyleSheet.textContent=e)}}initCodeBlockOptimization(){this.codeBlockObserver=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?(this.visibleBlocks.add(t.target),this.pendingThemeUpdate&&this.applyThemeToBlock(t.target,this.pendingThemeUpdate)):this.visibleBlocks.delete(t.target)})},{rootMargin:"50px 0px",threshold:.01}),this.observeCodeBlocks(),this.setupThemeListener(),window.swup&&window.swup.hooks.on("page:view",()=>{setTimeout(()=>this.observeCodeBlocks(),100)})}observeCodeBlocks(){this.visibleBlocks.clear(),requestAnimationFrame(()=>{document.querySelectorAll(".expressive-code").forEach(t=>{this.codeBlockObserver.observe(t),this.hideCodeBlocksDuringTransition?t.classList.add("hide-during-transition"):t.classList.remove("hide-during-transition")})})}setupThemeListener(){new MutationObserver(t=>{for(const i of t)if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.handleThemeChange(s);break}}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}handleThemeChange(e){this.pendingThemeUpdate=e;const t=Array.from(this.visibleBlocks);t.length!==0&&this.batchUpdateBlocks(t,e)}batchUpdateBlocks(e,t){let s=0;const o=()=>{const n=e.slice(s,s+3);requestAnimationFrame(()=>{n.forEach(r=>{this.applyThemeToBlock(r,t)}),s+=3,s<e.length&&setTimeout(o,0)})};o()}applyThemeToBlock(e,t){e.dataset.themeUpdated=t}interceptThemeSwitch(){new MutationObserver(t=>{for(const i of t)if(i.type==="attributes"&&i.attributeName==="class"&&i.target===document.documentElement){const s=document.documentElement.classList,o=s.contains("is-theme-transitioning"),n=s.contains("use-view-transition");o&&!this.isOptimizing?this.optimizeThemeSwitch(n):!o&&this.isOptimizing&&this.restoreAfterThemeSwitch(n)}}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}optimizeThemeSwitch(e=!1){this.isOptimizing=!0,this.useViewTransition=e,!e&&(this.disableHeavyAnimations(),this.hideOffscreenHeavyElements(),this.forceCompositing())}disableHeavyAnimations(){this.tempStyleSheet||(this.tempStyleSheet=document.createElement("style"),this.tempStyleSheet.id="theme-optimizer-temp",document.head.appendChild(this.tempStyleSheet)),this.tempStyleSheet.textContent=`
      /* 临时禁用重型元素的过渡和动画 */
      .is-theme-transitioning .float-panel:not(.float-panel-closed),
      .is-theme-transitioning .music-player,
      .is-theme-transitioning .widget,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning #navbar *,
      .is-theme-transitioning .dropdown-content,
      .is-theme-transitioning .custom-md * {
        transition: none !important;
        animation: none !important;
      }

      /* 强制隔离渲染上下文 */
      .is-theme-transitioning .float-panel,
      .is-theme-transitioning .post-card,
      .is-theme-transitioning .widget {
        contain: layout style paint !important;
      }

      /* 隐藏装饰性元素 */
      .is-theme-transitioning .gradient-overlay,
      .is-theme-transitioning .decoration,
      .is-theme-transitioning .animation-element {
        visibility: hidden !important;
      }

      /* 在主题切换期间临时隐藏代码块以提升性能 */
      /* 这个行为可以通过配置文件中的 expressiveCodeConfig.hideDuringThemeTransition 控制 */
      .is-theme-transitioning .expressive-code {
        content-visibility: hidden !important;
        /* 避免闪烁 */
        opacity: 0.99;
      }

      /* 当禁用隐藏代码块功能时（通过JavaScript动态控制） */
      .is-theme-transitioning .expressive-code:not(.hide-during-transition) {
        /* 保持代码块可见，但禁用过渡效果 */
        content-visibility: visible !important;
        opacity: 1 !important;
      }

      /* 确保打开的TOC面板在主题切换期间保持可点击 */
      .is-theme-transitioning .float-panel:not(.float-panel-closed) {
        pointer-events: auto !important;
      }
    `}hideOffscreenHeavyElements(){const e=window.innerHeight,t=window.scrollY;this.hiddenElements=[],this.heavySelectors.forEach(i=>{document.querySelectorAll(i).forEach(o=>{const n=o,r=n.getBoundingClientRect(),a=r.top+t;if(a+r.height<t-200||a>t+e+200){const l=n.style.contentVisibility;n.style.contentVisibility="hidden",this.hiddenElements.push({element:n,originalVisibility:l})}})})}forceCompositing(){const e=document.querySelectorAll(`
      .expressive-code,
      .post-card,
      .widget,
      #navbar
    `);this.compositedElements=[],e.forEach(t=>{const i=t,s=i.style.transform;i.style.transform="translateZ(0)",i.style.willChange="transform",this.compositedElements.push({element:i,original:s})})}restoreAfterThemeSwitch(e=!1){if(this.isOptimizing=!1,e){this.useViewTransition=!1;return}requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.tempStyleSheet&&this.tempStyleSheet.parentNode&&(this.tempStyleSheet.remove(),this.tempStyleSheet=null),this.hiddenElements&&(this.hiddenElements.forEach(({element:t,originalVisibility:i})=>{t.style.contentVisibility=i||""}),this.hiddenElements=null),this.compositedElements&&(this.compositedElements.forEach(({element:t,original:i})=>{t.style.transform=i||"",t.style.willChange=""}),this.compositedElements=null)})})}destroy(){this.codeBlockObserver&&this.codeBlockObserver.disconnect(),this.visibleBlocks.clear()}}const c=new h;window.themeOptimizer=c;
