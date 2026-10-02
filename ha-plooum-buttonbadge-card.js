(function () {
  'use strict';

  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

  /* ==========================================================================
     CARTE PRINCIPALE : ha-plooum-buttonbadge-card
     ========================================================================== */
  class HaPlooumButtonBadgeCard extends i {
    static get properties() {
      return {
        hass: { type: Object },
        config: { type: Object },
      };
    }

    static getConfigElement() {
      return document.createElement("ha-plooum-buttonbadge-card-editor");
    }

    static getStubConfig() {
      return {
        entity: "light.mon_entite",
        name: "Mon Bouton",
        icon: "mdi:lightbulb",
        active_color: "#fff176",
        inactive_color: "#ffffff",
        tap_action: { action: "toggle" }
      };
    }

    setConfig(config) {
      if (!config) {
        throw new Error("Configuration invalide");
      }
      this.config = { ...config };
    }

    // --- Gestionnaire d'actions ---
    _handleAction(actionConfig, entityId) {
      if (!actionConfig) return;

      const action = actionConfig.action;
      
      if (action === "toggle" && entityId) {
        const domain = entityId.split(".")[0];
        this.hass.callService(domain, "toggle", { entity_id: entityId });
      } 
      else if (action === "navigate" && actionConfig.navigation_path) {
        window.history.pushState(null, "", actionConfig.navigation_path);
        window.dispatchEvent(new CustomEvent("location-changed"));
      } 
      else if (action === "execute_script" && actionConfig.script) {
        const scriptId = actionConfig.script.replace("script.", "");
        this.hass.callService("script", scriptId);
      }
    }

    // --- Événements Clic / Clic Long ---
    _startTimer(e, actionType) {
      this.longPress = false;
      this.timer = setTimeout(() => {
        this.longPress = true;
        const actionConfig = actionType === 'badge' ? this.config.badge_hold_action : this.config.hold_action;
        const entity = actionType === 'badge' ? this.config.badge_entity : this.config.entity;
        this._handleAction(actionConfig, entity);
      }, 500); // 500ms pour déclencher un clic long
    }

    _stopTimer(e, actionType) {
      clearTimeout(this.timer);
      if (!this.longPress) {
        const actionConfig = actionType === 'badge' ? this.config.badge_tap_action : this.config.tap_action;
        const entity = actionType === 'badge' ? this.config.badge_entity : this.config.entity;
        this._handleAction(actionConfig, entity);
      }
    }

    render() {
      if (!this.config || !this.hass) return b``;

      // -- Calculs Bouton Principal --
      const stateObj = this.config.entity ? this.hass.states[this.config.entity] : undefined;
      const isActive = stateObj && stateObj.state !== "off" && stateObj.state !== "unavailable";
      
      const color = isActive 
        ? (this.config.active_color || "#fff176") 
        : (this.config.inactive_color || "#ffffff");

      const showIcon = this.config.icon && this.config.icon !== "";
      const showName = this.config.name && this.config.name !== "";
      
      // Détermination de l'alignement
      const justifyContent = (showIcon && showName) ? "flex-start" : "center";

      // -- Calculs Badge --
      const hasBadge = this.config.badge_entity || this.config.badge_icon;
      let badgeHtml = b``;

      if (hasBadge) {
        const badgeStateObj = this.config.badge_entity ? this.hass.states[this.config.badge_entity] : undefined;
        const isBadgeActive = badgeStateObj && badgeStateObj.state !== "off" && badgeStateObj.state !== "unavailable";
        const badgeBgColor = isBadgeActive 
          ? (this.config.badge_active_color || "#ffa726") 
          : (this.config.badge_inactive_color || "rgba(255, 255, 255, 0.25)");

        badgeHtml = b`
        <div class="badge" 
             style="background: ${badgeBgColor};"
             @mousedown="${(e) => { e.stopPropagation(); this._startTimer(e, 'badge'); }}"
             @mouseup="${(e) => { e.stopPropagation(); this._stopTimer(e, 'badge'); }}"
             @touchstart="${(e) => { e.stopPropagation(); this._startTimer(e, 'badge'); }}"
             @touchend="${(e) => { e.stopPropagation(); this._stopTimer(e, 'badge'); }}">
          ${this.config.badge_icon ? b`<ha-icon icon="${this.config.badge_icon}"></ha-icon>` : ""}
        </div>
      `;
      }

      return b`
      <ha-card class="plooum-card"
               @mousedown="${(e) => this._startTimer(e, 'main')}"
               @mouseup="${(e) => this._stopTimer(e, 'main')}"
               @touchstart="${(e) => this._startTimer(e, 'main')}"
               @touchend="${(e) => this._stopTimer(e, 'main')}">
        
        <div class="content" style="justify-content: ${justifyContent};">
          ${showIcon ? b`<ha-icon icon="${this.config.icon}" style="color: ${color};"></ha-icon>` : ""}
          ${showName ? b`<span style="color: ${color};">${this.config.name}</span>` : ""}
        </div>

        ${badgeHtml}
      </ha-card>
    `;
    }

    static get styles() {
      return i$3`
      .plooum-card {
        background: rgba(0, 0, 0, 0.35);
        border-radius: 20px;
        padding: 4px 10px 4px 6px;
        box-shadow: none;
        border: none;
        position: relative;
        height: 56px;
        overflow: visible;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }
      .content {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        gap: 10px;
      }
      .content ha-icon {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
      }
      .content span {
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        flex-grow: 1;
      }
      .badge {
        position: absolute;
        top: -5px;
        right: -5px;
        z-index: 2;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      .badge ha-icon {
        width: 19px;
        height: 19px;
        color: #ffffff;
      }
    `;
    }
  }

  /* ==========================================================================
     ÉDITEUR VISUEL : ha-plooum-buttonbadge-card-editor
     ========================================================================== */
  class HaPlooumButtonBadgeCardEditor extends i {
    static get properties() {
      return {
        hass: { type: Object },
        _config: { type: Object },
      };
    }

    setConfig(config) {
      this._config = config;
    }

    _valueChanged(ev) {
      if (!this._config || !this.hass) return;
      const target = ev.target;
      const path = target.dataset.path.split(".");
      
      let newValue = target.value;
      // Gérer les cas où le champ est vidé
      if (newValue === "" && target.tagName !== "SELECT") newValue = undefined;

      const newConfig = { ...this._config };
      
      if (path.length === 1) {
        newConfig[path[0]] = newValue;
      } else if (path.length === 2) {
        newConfig[path[0]] = { ...newConfig[path[0]], [path[1]]: newValue };
      }

      // Déclencher l'événement pour Home Assistant
      const event = new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    }

    _renderActionSettings(actionKey, title) {
      const actionObj = this._config[actionKey] || { action: "none" };
      return b`
      <div class="section">
        <h4>${title}</h4>
        <select .value="${actionObj.action}" data-path="${actionKey}.action" @change="${this._valueChanged}">
          <option value="none">Aucune action</option>
          <option value="toggle">Toggle (Inverser)</option>
          <option value="navigate">Naviguer</option>
          <option value="execute_script">Exécuter un script</option>
        </select>
        
        ${actionObj.action === "navigate" ? b`
          <input type="text" placeholder="Chemin (ex: /lovelace/home)" .value="${actionObj.navigation_path || ''}" data-path="${actionKey}.navigation_path" @input="${this._valueChanged}">
        ` : ""}
        
        ${actionObj.action === "execute_script" ? b`
          <input type="text" placeholder="ID Script (ex: script.mon_script)" .value="${actionObj.script || ''}" data-path="${actionKey}.script" @input="${this._valueChanged}">
        ` : ""}
      </div>
    `;
    }

    render() {
      if (!this.hass || !this._config) return b``;

      return b`
      <div class="editor-container">
        <h3>Bouton Principal</h3>
        
        <div class="grid">
          <input type="text" placeholder="Entité (ex: switch.lampe)" .value="${this._config.entity || ''}" data-path="entity" @input="${this._valueChanged}">
          <input type="text" placeholder="Texte affiché" .value="${this._config.name || ''}" data-path="name" @input="${this._valueChanged}">
          <input type="text" placeholder="Icône (ex: mdi:lamp)" .value="${this._config.icon || ''}" data-path="icon" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur actif (ex: #fff176)" .value="${this._config.active_color || ''}" data-path="active_color" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur inactif (ex: #ffffff)" .value="${this._config.inactive_color || ''}" data-path="inactive_color" @input="${this._valueChanged}">
        </div>

        ${this._renderActionSettings('tap_action', 'Action Clic (Bouton)')}
        ${this._renderActionSettings('hold_action', 'Action Clic Long (Bouton)')}

        <hr>

        <h3>Badge (Optionnel)</h3>
        <div class="grid">
          <input type="text" placeholder="Entité du badge" .value="${this._config.badge_entity || ''}" data-path="badge_entity" @input="${this._valueChanged}">
          <input type="text" placeholder="Icône du badge" .value="${this._config.badge_icon || ''}" data-path="badge_icon" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur fond actif" .value="${this._config.badge_active_color || ''}" data-path="badge_active_color" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur fond inactif" .value="${this._config.badge_inactive_color || ''}" data-path="badge_inactive_color" @input="${this._valueChanged}">
        </div>

        ${this._renderActionSettings('badge_tap_action', 'Action Clic (Badge)')}
        ${this._renderActionSettings('badge_hold_action', 'Action Clic Long (Badge)')}
      </div>
    `;
    }

    static get styles() {
      return i$3`
      .editor-container { padding: 16px 0; }
      h3 { margin-top: 0; margin-bottom: 8px; font-size: 1.2em; color: var(--primary-text-color); }
      h4 { margin: 8px 0 4px 0; font-size: 1em; color: var(--secondary-text-color); }
      .grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 16px; }
      .section { border-left: 3px solid var(--primary-color); padding-left: 8px; margin-bottom: 12px; }
      input, select {
        width: 100%; padding: 8px; margin-bottom: 4px; box-sizing: border-box;
        border: 1px solid var(--divider-color); border-radius: 4px;
        background: var(--card-background-color); color: var(--primary-text-color);
      }
      hr { border: none; border-top: 1px solid var(--divider-color); margin: 24px 0; }
    `;
    }
  }

  /* ==========================================================================
     ENREGISTREMENTS HOME ASSISTANT
     ========================================================================== */
  if (!customElements.get('ha-plooum-buttonbadge-card')) {
    customElements.define('ha-plooum-buttonbadge-card', HaPlooumButtonBadgeCard);
  }
  if (!customElements.get('ha-plooum-buttonbadge-card-editor')) {
    customElements.define('ha-plooum-buttonbadge-card-editor', HaPlooumButtonBadgeCardEditor);
  }

  window.customCards = window.customCards || [];
  if (!window.customCards.some(card => card.type === 'ha-plooum-buttonbadge-card')) {
    window.customCards.push({
      type: 'ha-plooum-buttonbadge-card',
      name: 'Ha Plooum Button Badge Card',
      description: 'A custom button card to show a custom badge on it.',
      preview: true, // "true" permet à Home Assistant d'afficher une preview dans la liste
    });
  }

})();
//# sourceMappingURL=ha-plooum-buttonbadge-card.js.map
