class c{visibleBlocks;pendingThemeUpdate;codeBlockObserver;hideCodeBlocksDuringTransition;isOptimizing;heavySelectors;useViewTransition;tempStyleSheet;hiddenElements;compositedElements;constructor(){this.visibleBlocks=new Set,this.pendingThemeUpdate=null,this.codeBlockObserver=null,this.hideCodeBlocksDuringTransition=!0,this.initFromConfig(),this.isOptimizing=!1,this.heavySelectors=[".float-panel","#navbar",".music-player","#mobile-toc-panel","#nav-menu-panel","#search-panel",".dropdown-content",".widget",".post-card",".custom-md"],this.useViewTransition=!1,this.tempStyleSheet=null,this.hiddenElements=null,this.compositedElements=null,this.init()}init(){this.initFromConfig(),this.initCodeBlockOptimization(),this.interceptThemeSwitch(),this.applyCodeBlockTransitionBehavior(),this.setupSwupHooks(),document.dispatchEvent(new CustomEvent("themeOptimizerReady"))}setupSwupHooks(){const t=()=>window.swup?(window.swup.hooks.on("page:view",()=>{setTimeout(()=>{this.observeCodeBlocks(),this.applyCodeBlockTransitionBehavior(),this.forceApplyThemeTransitionStyles()},100)}),window.swup.hooks.on("content:replace",()=>{setTimeout(()=>{this.applyCodeBlockTransitionBehavior(),this.forceApplyThemeTransitionStyles()},50)}),!0):!1;if(!t()){const e=setInterval(()=>{t()&&clearInterval(e)},100);setTimeout(()=>{clearInterval(e)},2e3)}}forceApplyThemeTransitionStyles(){document.querySelectorAll(".expressive-code").forEach(e=>{const i=e;this.hideCodeBlocksDuringTransition?i.classList.add("hide-during-transition"):i.classList.remove("hide-during-transition")})}initFromConfig(){try{const t=document.getElementById("config-carrier");t&&t.dataset.hideCodeBlocksDuringTransition!==void 0&&(this.hideCodeBlocksDuringTransition=t.dataset.hideCodeBlocksDuringTransition==="true")}catch{this.hideCodeBlocksDuringTransition=!0}}applyCodeBlockTransitionBehavior(){document.querySelectorAll(".expressive-code").forEach(e=>{this.hideCodeBlocksDuringTransition?e.classList.add("hide-during-transition"):e.classList.remove("hide-during-transition")})}initCodeBlockOptimization(){this.codeBlockObserver=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting?(this.visibleBlocks.add(e.target),this.pendingThemeUpdate&&this.applyThemeToBlock(e.target,this.pendingThemeUpdate)):this.visibleBlocks.delete(e.target)})},{rootMargin:"50px 0px",threshold:.01}),this.observeCodeBlocks(),this.setupThemeListener(),window.swup&&window.swup.hooks.on("page:view",()=>{setTimeout(()=>this.observeCodeBlocks(),100)})}observeCodeBlocks(){this.visibleBlocks.clear(),this.codeBlockObserver?.disconnect(),requestAnimationFrame(()=>{document.querySelectorAll(".expressive-code").forEach(e=>{this.codeBlockObserver.observe(e),this.hideCodeBlocksDuringTransition?e.classList.add("hide-during-transition"):e.classList.remove("hide-during-transition")})})}setupThemeListener(){new MutationObserver(e=>{for(const i of e)if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.handleThemeChange(s);break}}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}handleThemeChange(t){this.pendingThemeUpdate=t;const e=Array.from(this.visibleBlocks);e.length!==0&&this.batchUpdateBlocks(e,t)}batchUpdateBlocks(t,e){let s=0;const o=()=>{const n=t.slice(s,s+3);requestAnimationFrame(()=>{n.forEach(r=>{this.applyThemeToBlock(r,e)}),s+=3,s<t.length&&setTimeout(o,0)})};o()}applyThemeToBlock(t,e){t.dataset.themeUpdated=e}interceptThemeSwitch(){new MutationObserver(e=>{for(const i of e)if(i.type==="attributes"&&i.attributeName==="class"&&i.target===document.documentElement){const s=document.documentElement.classList,o=s.contains("is-theme-transitioning"),n=s.contains("use-view-transition");o&&!this.isOptimizing?this.optimizeThemeSwitch(n):!o&&this.isOptimizing&&this.restoreAfterThemeSwitch(n)}}).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}optimizeThemeSwitch(t=!1){this.isOptimizing=!0,this.useViewTransition=t,!t&&(this.disableHeavyAnimations(),this.hideOffscreenHeavyElements(),this.forceCompositing())}disableHeavyAnimations(){this.tempStyleSheet||(this.tempStyleSheet=document.createElement("style"),this.tempStyleSheet.id="theme-optimizer-temp",document.head.appendChild(this.tempStyleSheet)),this.tempStyleSheet.textContent=`
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

      /* 确保打开的TOC面板在主题切换期间保持可点击 */
      .is-theme-transitioning .float-panel:not(.float-panel-closed) {
        pointer-events: auto !important;
      }
    `}hideOffscreenHeavyElements(){const t=window.innerHeight,e=window.scrollY;this.hiddenElements=[],this.heavySelectors.forEach(i=>{document.querySelectorAll(i).forEach(o=>{const n=o,r=n.getBoundingClientRect(),a=r.top+e;if(a+r.height<e-200||a>e+t+200){const l=n.style.contentVisibility;n.style.contentVisibility="hidden",this.hiddenElements.push({element:n,originalVisibility:l})}})})}forceCompositing(){const t=document.querySelectorAll(`
      .expressive-code,
      .post-card,
      .widget,
      #navbar
    `);this.compositedElements=[],t.forEach(e=>{const i=e,s=i.style.contain;i.style.contain="layout style",this.compositedElements.push({element:i,original:s})})}restoreAfterThemeSwitch(t=!1){if(this.isOptimizing=!1,t){this.useViewTransition=!1;return}requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.tempStyleSheet&&this.tempStyleSheet.parentNode&&(this.tempStyleSheet.remove(),this.tempStyleSheet=null),this.hiddenElements&&(this.hiddenElements.forEach(({element:e,originalVisibility:i})=>{e.style.contentVisibility=i||""}),this.hiddenElements=null),this.compositedElements&&(this.compositedElements.forEach(({element:e,original:i})=>{e.style.contain=i||""}),this.compositedElements=null)})})}destroy(){this.codeBlockObserver&&this.codeBlockObserver.disconnect(),this.visibleBlocks.clear()}}const h=new c;window.themeOptimizer=h;
