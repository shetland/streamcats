(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Help"],{"0789":function(t,e,s){"use strict";s.d(e,"c",(function(){return d})),s.d(e,"d",(function(){return h})),s.d(e,"a",(function(){return f})),s.d(e,"b",(function(){return p}));s("99af");var a=s("d9f7");function i(){for(var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],s=arguments.length,a=new Array(s>1?s-1:0),i=1;i<s;i++)a[i-1]=arguments[i];return(t=Array()).concat.apply(t,[e].concat(a))}function r(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top center 0",s=arguments.length>2?arguments[2]:void 0;return{name:t,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:s},origin:{type:String,default:e}},render:function(e,s){var r="transition".concat(s.props.group?"-group":""),n={props:{name:t,mode:s.props.mode},on:{beforeEnter:function(t){t.style.transformOrigin=s.props.origin,t.style.webkitTransformOrigin=s.props.origin}}};return s.props.leaveAbsolute&&(n.on.leave=i(n.on.leave,(function(t){return t.style.position="absolute"}))),s.props.hideOnLeave&&(n.on.leave=i(n.on.leave,(function(t){return t.style.display="none"}))),e(r,Object(a["a"])(s.data,n),s.children)}}}function n(t,e){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"in-out";return{name:t,functional:!0,props:{mode:{type:String,default:s}},render:function(s,i){return s("transition",Object(a["a"])(i.data,{props:{name:t},on:e}),i.children)}}}var o=s("ade3"),l=s("80d2"),c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=e?"width":"height",a="offset".concat(Object(l["A"])(s));return{beforeEnter:function(t){t._parent=t.parentNode,t._initialStyle=Object(o["a"])({transition:t.style.transition,visibility:t.style.visibility,overflow:t.style.overflow},s,t.style[s])},enter:function(e){var i=e._initialStyle,r="".concat(e[a],"px");e.style.setProperty("transition","none","important"),e.style.visibility="hidden",e.style.visibility=i.visibility,e.style.overflow="hidden",e.style[s]="0",e.offsetHeight,e.style.transition=i.transition,t&&e._parent&&e._parent.classList.add(t),requestAnimationFrame((function(){e.style[s]=r}))},afterEnter:r,enterCancelled:r,leave:function(t){t._initialStyle=Object(o["a"])({transition:"",visibility:"",overflow:t.style.overflow},s,t.style[s]),t.style.overflow="hidden",t.style[s]="".concat(t[a],"px"),t.offsetHeight,requestAnimationFrame((function(){return t.style[s]="0"}))},afterLeave:i,leaveCancelled:i};function i(e){t&&e._parent&&e._parent.classList.remove(t),r(e)}function r(t){var e=t._initialStyle[s];t.style.overflow=t._initialStyle.overflow,null!=e&&(t.style[s]=e),delete t._initialStyle}},d=(r("carousel-transition"),r("carousel-reverse-transition"),r("tab-transition"),r("tab-reverse-transition"),r("menu-transition"),r("fab-transition","center center","out-in"),r("dialog-transition"),r("dialog-bottom-transition"),r("fade-transition")),h=(r("scale-transition"),r("scroll-x-transition"),r("scroll-x-reverse-transition"),r("scroll-y-transition"),r("scroll-y-reverse-transition"),r("slide-x-transition")),f=(r("slide-x-reverse-transition"),r("slide-y-transition"),r("slide-y-reverse-transition"),n("expand-transition",c())),p=n("expand-x-transition",c("",!0))},4177:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 39.69 39.69"}},[s("defs",[s("clipPath",{attrs:{id:"a",clipPathUnits:"userSpaceOnUse"}},[s("path",{attrs:{d:"M1.98 5.54l3.36 12.53c-.23.94-.35 1.9-.36 2.85 0 7.33 6.66 12.46 14.86 12.46S34.7 28.25 34.7 20.92c0-.95-.13-1.9-.36-2.83L37.7 5.54l-11.96 3.2a16.39 16.39 0 00-11.77 0zm11.53 8.9c1.63 0 2.95 1.9 2.95 4.24 0 2.34-1.32 4.25-2.95 4.25-1.62 0-2.94-1.9-2.94-4.25 0-2.34 1.32-4.24 2.94-4.24zm12.66 0c1.62 0 2.94 1.9 2.94 4.24 0 2.34-1.32 4.25-2.94 4.25-1.63 0-2.94-1.9-2.94-4.25 0-2.34 1.31-4.24 2.94-4.24zm-8.79 8.46h4.92l-2.46 2.83z",fill:"gray","stroke-width":"1.06","paint-order":"markers fill stroke"}})])]),s("g",{attrs:{"clip-path":"url(#a)",transform:"translate(0 .86)","paint-order":"markers fill stroke"}},[s("path",{attrs:{fill:"#ff2a2a",d:"M1.98 5.52h35.71v3.25H1.98z"}}),s("path",{attrs:{fill:"#ffb416",d:"M1.98 8.77h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#ffea00",d:"M1.98 11.6h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#7fff2a",d:"M1.98 14.42h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#00fff4",d:"M1.98 17.25h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#0cf",d:"M1.98 20.08h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#2a7fff",d:"M1.98 22.9h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#d5f",d:"M1.98 25.73h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#f5d",d:"M1.98 28.56h35.71v2.83H1.98z"}}),s("path",{attrs:{fill:"#ff2a7f",d:"M1.98 31.38h35.71v2.83H1.98z"}})])])},i=[],r=s("2877"),n={},o=Object(r["a"])(n,a,i,!1,null,null,null);e["a"]=o.exports},"7d13":function(t,e,s){"use strict";var a=s("eec4"),i=s.n(a);i.a},"8adc":function(t,e,s){},"9d26":function(t,e,s){"use strict";var a=s("132d");e["a"]=a["a"]},ae7c:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"text-center allText"},[t.homeLink?s("router-link",{attrs:{to:"/"}},[s("cat-head-color",{staticClass:"colorCat"})],1):t._e(),s("br"),t._t("default"),s("div",[t._v("contact us at:")]),t._m(0),s("div",[s("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://twitter.com/hey__bert"}},[s("v-icon",{attrs:{size:"46"}},[t._v("mdi-twitter")])],1),s("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://www.instagram.com/hey__bert/"}},[s("v-icon",{attrs:{size:"46"}},[t._v("mdi-instagram")])],1),s("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://www.reddit.com/user/hey__bert"}},[s("v-icon",{attrs:{size:"46"}},[t._v("mdi-reddit")])],1)]),s("br"),s("br"),s("p",{staticClass:"subText"},[t._v(" Brett Hiebert © 2020 ")]),s("div",{staticClass:"bottomPad"})],2)},i=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[s("a",{attrs:{href:"mailto:streamcatsinfo@gmail.com"}},[t._v("streamcatsinfo@gmail.com")])])}],r=s("4177"),n={name:"BottomLinks",components:{CatHeadColor:r["a"]},props:{homeLink:Boolean}},o=n,l=(s("7d13"),s("2877")),c=s("6544"),d=s.n(c),h=s("132d"),f=Object(l["a"])(o,a,i,!1,null,"dffcfd28",null);e["a"]=f.exports;d()(f,{VIcon:h["a"]})},b022:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 79.375 26"}},[s("path",{attrs:{fill:"#d5f6ff",d:"M40.892 23.015h-2.41l1.205-2.087z","paint-order":"markers fill stroke"}}),s("g",{attrs:{id:"S2",fill:"#ff2a7f",stroke:"#ff2a7f"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319L67.885 10.7M39.687 22.319L72.2 10.69M72.87 5.513l-1.654.76M68.278 4.122l-1.266.937M65.204 10.31l2.656-1.358M68.137 7.524L65.204 9.05"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M71.272 10.756c1.274 0 2.044-.613 2.044-1.739V7.98c0-1.106-.612-1.501-1.54-1.64l-1.472-.197c-.168-.02-.267-.138-.267-.316s.099-.297.267-.297h2.301c.247 0 .356-.108.356-.355V3.999c0-.247-.109-.355-.356-.355H69.84c-1.284 0-2.044.612-2.044 1.738V6.42c0 1.107.602 1.502 1.53 1.64l1.482.208c.168.02.257.108.257.335 0 .158-.089.287-.257.287H68.15c-.247 0-.355.109-.355.355V10.4c0 .247.108.356.355.356z"}})]),s("g",{attrs:{id:"T2",fill:"#f5d",stroke:"#f5d"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{d:"M60.275 6.213l.874-.763"}}),s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l23.31-11.637M39.687 22.319l25.394-11.593M60.578 7.218l2.308-1.668M66.607 5.55l-1.403.874M59.823 5.079l1.302-1.353"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M64.849 10.756c.247 0 .355-.109.355-.356V5.55h1.452c.247 0 .356-.108.356-.355V3.999c0-.247-.109-.355-.356-.355h-5.215c-.247 0-.356.108-.356.355v1.196c0 .247.109.355.356.355h1.452v4.85c0 .247.109.356.355.356z"}})]),s("g",{attrs:{id:"S",fill:"#ff2a2a",stroke:"#ff2a2a"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319L6.104 10.766"}}),s("path",{attrs:{d:"M11.057 6.64l2.91 1.64"}}),s("path",{attrs:{"stroke-width":".15",d:"M11.15 5.414l2.817 1.66"}}),s("path",{attrs:{d:"M11.114 3.612l1.051.773"}}),s("path",{attrs:{"stroke-width":".15",d:"M6.83 7.884l2.437.908M39.687 22.319L11.342 9.955"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M9.536 10.756c1.274 0 2.044-.613 2.044-1.739V7.98c0-1.106-.612-1.501-1.54-1.64l-1.472-.197c-.168-.02-.267-.138-.267-.316s.099-.297.267-.297h2.301c.247 0 .356-.108.356-.355V3.999c0-.247-.109-.355-.356-.355H8.103c-1.284 0-2.044.612-2.044 1.738V6.42c0 1.107.602 1.502 1.53 1.64l1.482.208c.168.02.257.108.257.335 0 .158-.089.287-.257.287H6.414c-.247 0-.355.109-.355.355V10.4c0 .247.108.356.355.356z"}})]),s("g",{attrs:{id:"T",fill:"#ffb416",stroke:"#ffb416"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l-25.634-11.61M39.687 22.319l-23.44-11.661"}}),s("path",{attrs:{d:"M12.5 5.586l1.467.865"}}),s("path",{attrs:{"stroke-width":".15",d:"M16.278 5.55l2.768 1.983M18.02 5.404l1.027.802"}}),s("path",{attrs:{d:"M18.032 3.677l1.003.986"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M15.923 10.756c.247 0 .355-.109.355-.356V5.55h1.452c.247 0 .356-.108.356-.355V3.999c0-.247-.109-.355-.356-.355h-5.215c-.247 0-.356.108-.356.355v1.196c0 .247.109.355.356.355h1.452v4.85c0 .247.109.356.356.356z"}})]),s("g",{attrs:{id:"R",fill:"#ffea00",stroke:"#ffea00"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l-20.573-11.63M39.687 22.319L21.181 10.653M39.687 22.319l-16.54-11.63M39.687 22.319l-14.49-11.657M21.279 8.464l1.758 1.324M21.279 5.422l1.116 1.024"}}),s("path",{attrs:{d:"M25.074 7.349l1.304 1.353M24.303 4.076l2.075 2.47"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M21.279 5.422h.74c.347 0 .435.197.435.464v.336c0 .267-.088.464-.434.464h-.741zm-.356 5.334c.247 0 .356-.109.356-.356V8.464h1.383c.276 0 .375.129.375.425V10.4c0 .247.109.356.356.356h1.53c.248 0 .357-.109.357-.356V8.306c0-.83-.475-1.353-1.196-1.432.415-.178.553-.573.553-1.126v-.455c0-.978-.464-1.65-1.945-1.65h-3.29c-.247 0-.355.11-.355.356V10.4c0 .247.108.356.355.356z"}})]),s("g",{attrs:{id:"E",fill:"#7fff2a",stroke:"#7fff2a"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{d:"M30.926 7.937l.71 1.11"}}),s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l-13.26-11.655M39.687 22.319L31.555 10.68M39.687 22.319l-8.06-13.314M28.59 5.51l.502.76M28.59 8.04l.66.85"}}),s("path",{attrs:{d:"M31.66 3.731l1.194 2.732M31.57 5.405l1.164 2.239M30.872 6.463l1.82 3.211"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M31.317 10.756c.247 0 .355-.109.355-.356V9.244c0-.246-.108-.355-.355-.355H28.59v-.85h1.927c.247 0 .355-.108.355-.355V6.627c0-.247-.108-.356-.355-.356H28.59v-.76h2.727c.247 0 .355-.109.355-.356V4c0-.247-.108-.355-.355-.355h-4.584c-.247 0-.355.108-.355.355V10.4c0 .247.108.356.355.356z"}})]),s("g",{attrs:{id:"A",fill:"#00fff4",stroke:"#00fff4"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l-.859-11.677M39.687 22.319L32.837 10.7M39.687 22.319l-4.91-11.648M39.687 22.319l-3.014-11.662M39.687 22.319L34.914 9.017"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M35.419 5.718c.05-.118.109-.168.188-.168h.247c.079 0 .138.05.187.168l.464 1.502h-1.55zm-.563 4.682V9.017h1.748V10.4c0 .247.119.356.385.356h1.492c.247 0 .356-.109.356-.356V7.792c0-.395-.119-.889-.386-1.58l-.859-2.242c-.079-.227-.237-.326-.494-.326h-2.657c-.267 0-.425.099-.504.326l-.86 2.242c-.266.691-.384 1.185-.384 1.58V10.4c0 .247.108.356.355.356H34.5c.247 0 .356-.109.356-.356z"}})]),s("g",{attrs:{id:"A2",fill:"#d5f",stroke:"#d5f"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319L54.594 10.7M39.687 22.319L60.431 10.73M39.687 22.319L58.496 10.66M39.687 22.319L56.515 10.72M58.424 9.017l-1.748 1.242M55.8 3.864L51.527 8.87"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M57.239 5.718c.05-.118.108-.168.187-.168h.247c.08 0 .139.05.188.168l.464 1.502h-1.55zm-.563 4.682V9.017h1.748V10.4c0 .247.119.356.385.356h1.492c.247 0 .355-.109.355-.356V7.792c0-.395-.118-.889-.385-1.58l-.86-2.242c-.078-.227-.236-.326-.493-.326h-2.657c-.267 0-.425.099-.504.326l-.86 2.242c-.266.691-.384 1.185-.384 1.58V10.4c0 .247.108.356.355.356h1.452c.247 0 .356-.109.356-.356z"}})]),s("g",{attrs:{id:"C",fill:"#2a7fff",stroke:"#2a7fff"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M53.325 5.501L50.784 8.73M48.42 4.854l-1.34 2.908M39.687 22.319l13.634-11.584M39.687 22.319L48.89 10.2"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M53.18 10.756c.247 0 .356-.109.356-.356V9.225c0-.247-.11-.356-.356-.356h-1.986c-.414 0-.602-.148-.602-.474v-2.35c0-.337.188-.495.602-.495h1.986c.247 0 .356-.108.356-.355V3.999c0-.247-.11-.355-.356-.355h-2.41c-1.66 0-2.43.642-2.43 2.025V8.74c0 1.373.77 2.015 2.43 2.015z"}})]),s("g",{attrs:{id:"M",fill:"#0cf",stroke:"#0cf"}},[s("g",{attrs:{"stroke-linecap":"round","stroke-width":".15","paint-order":"markers fill stroke"}},[s("path",{attrs:{"stroke-width":".15",d:"M39.687 22.319l.401-11.676M39.687 22.319l2.484-11.654M39.687 22.319l5.217-11.662M39.687 22.319l7.267-11.63M39.687 22.319l4.408-14.123M39.687 22.319l3.34-14.082"}})]),s("path",{staticStyle:{"line-height":"1.25"},attrs:{"stroke-width":".3",d:"M41.884 10.756c.247 0 .355-.109.355-.356V6.923L42.822 8c.119.227.267.316.524.316h.395c.256 0 .405-.089.523-.316l.583-1.077V10.4c0 .247.099.356.356.356h1.52c.248 0 .356-.109.356-.356V4c0-.248-.108-.356-.355-.356h-1.6c-.208 0-.336.079-.455.296l-.879 1.61c-.07.119-.099.168-.178.168h-.089c-.079 0-.108-.05-.177-.168l-.89-1.61c-.118-.217-.246-.296-.454-.296h-1.59c-.247 0-.356.108-.356.355V10.4c0 .247.109.356.356.356z"}})])])},i=[],r=s("2877"),n={},o=Object(r["a"])(n,a,i,!1,null,null,null);e["a"]=o.exports},c3ef:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("v-container",{staticClass:"setWidth"},[s("div",{staticClass:"text-center"},[s("div",[s("stream-cats",{staticClass:"scTitle"})],1),t._l(t.lessons,(function(e,a){return s("div",{key:"l-"+a},[t.lessonIndex>=6&&6===a?s("div",{staticClass:"lessonBtn addShadow"},[s("v-btn-toggle",{attrs:{rounded:""}},[s("v-btn",{attrs:{"min-width":"30px",width:"44",height:"36",small:""}},[t._v("1")]),s("v-btn",{staticClass:"sortBtn",attrs:{height:"36",small:""}},[t._v("RATED")]),s("v-btn",{staticClass:"sortBtn",attrs:{height:"36",small:""}},[t._v("NAME")]),s("v-btn",{staticClass:"sortBtn",attrs:{height:"36",small:""}},[t._v("IMDB")]),s("v-btn",{staticClass:"sortBtn",attrs:{height:"36",small:""}},[t._v("YEAR")]),s("v-btn",{staticClass:"sortBtn",attrs:{"min-width":"30px",width:"40",height:"36",small:""},on:{click:function(e){t.sortDesc=!t.sortDesc}}},[s("v-icon",{directives:[{name:"show",rawName:"v-show",value:t.sortDesc,expression:"sortDesc"}],attrs:{small:""}},[t._v("mdi-chevron-down")]),s("v-icon",{directives:[{name:"show",rawName:"v-show",value:!t.sortDesc,expression:"!sortDesc"}],attrs:{small:""}},[t._v("mdi-chevron-up")])],1)],1),t.lessonIndex>5?s("div",[s("v-icon",[t._v("mdi-menu-down")])],1):t._e()],1):t._e(),t.lessonIndex>=8&&8===a?s("div",[s("v-expansion-panels",{staticClass:"scWrapper",attrs:{value:t.open,focusable:"",accordion:""}},[s("v-expansion-panel",[s("v-expansion-panel-header",{attrs:{"hide-actions":""}},[s("v-container",{staticClass:"titleContainer",attrs:{fluid:""}},[s("v-row",{attrs:{justify:"space-between"}},[s("v-col",{staticClass:"titleText"},[s("span",[t._v("Galaxy Wars")])]),s("v-col",{staticClass:"infoText"},[s("span",[t._v("PG-13 | 9.9 | 2293")])])],1),s("v-row",{attrs:{justify:"space-between"}},[s("span",[s("span",[s("v-chip",{staticClass:"genreTags",attrs:{"x-small":"",color:"red"}},[t._v("ACTION")]),s("v-chip",{staticClass:"genreTags",attrs:{"x-small":"",color:"blue"}},[t._v("SCIFI")]),s("v-chip",{staticClass:"genreTags",attrs:{"x-small":"",color:"purple"}},[t._v("HORROR")])],1)])])],1)],1),s("v-expansion-panel-content",[s("v-row",[s("div",{staticClass:"descText"},[t._v(" Did you ever hear the tragedy of Darth Plagueis The Wise? I thought not. It's not a story the Jedi would tell you. It's a Sith legend. ")])]),s("br"),s("v-row",{attrs:{justify:"space-between"}},[s("div",[s("v-btn",{attrs:{outlined:"",small:"",target:"_blank",rounded:"",color:"#FBC02D",href:"https://imdb.com"}},[t._v(" IMDB:"),s("v-icon",{attrs:{small:""}},[t._v("mdi-exit-to-app")])],1)],1),s("div",[s("v-btn",{attrs:{outlined:"",small:"",target:"_blank",rounded:"",color:"red",href:"https://netflix.com"}},[t._v(" NETFLIX:"),s("v-icon",{attrs:{small:""}},[t._v("mdi-exit-to-app")])],1)],1)])],1)],1)],1),t.lessonIndex>7?s("div",[s("v-icon",[t._v("mdi-menu-down")])],1):t._e()],1):t._e(),a<=t.lessonIndex?s("v-btn",{staticClass:"lessonBtn",attrs:{outlined:a===t.lessonIndex,color:a!==t.lessonIndex&&0===a?"#fff":e.color,rounded:""},on:{click:function(e){return t.updateLesson(a)}}},[5===a?s("v-btn",{attrs:{small:"",icon:""}},[s("v-icon",{attrs:{color:a<t.lessonIndex?"#222":e.color,size:"14",dense:""}},[t._v("mdi-minus")])],1):s("span",{staticClass:"spacer"}),s("span",{class:a<t.lessonIndex?"darkText":"colorText"},[t._v(" "+t._s(0===a&&t.lessonIndex>0?"Tap to close":e.text)+" ")]),s("v-btn",{class:a<t.lessonIndex?"darkText subGenreBtn":"subGenreBtn",attrs:{icon:""}},[a<t.lessonIndex?s("v-icon",{attrs:{color:a<t.lessonIndex?"#222":e.color,size:"18",dense:""}},[t._v("mdi-close ")]):s("v-icon",{attrs:{color:t.getPlusColor(a),size:"18",dense:""}},[t._v("mdi-plus ")])],1)],1):t._e(),s("div",[a<t.lessonIndex&&10!==a?s("v-icon",[t._v("mdi-menu-down")]):t._e()],1)],1)})),s("br"),s("br"),s("br"),s("br")],2),s("div",{directives:[{name:"show",rawName:"v-show",value:t.lessonIndex>=1,expression:"lessonIndex >= 1"}],staticClass:"bottomPad"}),t.lessonIndex>=1?s("bottom-links",{attrs:{homeLink:!0}},[s("div",[t._v("Questions or issues?")])]):t._e()],1)],1)},i=[],r=s("b022"),n=s("ae7c"),o={name:"Help",components:{StreamCats:r["a"],BottomLinks:n["a"]},data:function(){return{sortDesc:!0,open:null,lessonIndex:0,lessons:[{text:"Tap for tutorial",color:""},{text:"On the homepage, tap a streaming service",color:"#ff2a2a"},{text:"Tap MOVIES or TV",color:"#FFAA22"},{text:"Tap any GENRE",color:"#FFDD22"},{text:"Tap any additional SUBGENRES that should be included",color:"#7fff2a"},{text:"Tap the MINUS sign on SUBGENRES that should be filtered",color:"#00fff4"},{text:"Sort the RESULTS by NAME, RATING, IMDB score, or YEAR",color:"#0cf"},{text:"Scroll down to see the search RESULTS",color:"#2a7fff"},{text:"Tap a title to see a summary and its links",color:"#d5f"},{text:"Use the links to learn more or to add the title to your watchlist",color:"#f5d"},{text:"That's it! Want more? Check out the cat picks page!",color:"#ff2a7f"}]}},methods:{updateLesson:function(t){t<this.lessonIndex?this.lessonIndex=t:this.lessonIndex=t+1,8===t&&(this.open=0),t<8&&(this.open=null),10===t&&this.$router.push({path:"/cat-picks"})},toPicks:function(){console.log("clicked picks")},getPlusColor:function(t){return 0!==this.lessonIndex||this.$vuetify.theme.dark?t<this.lessonIndex?"#222":this.lessons[t].color:"#222"}}},l=o,c=(s("cac0"),s("2877")),d=s("6544"),h=s.n(d),f=s("8336"),p=s("a609"),u=s("cc20"),v=s("62ad"),m=s("a523"),g=s("cd55"),k=s("49e2"),b=s("c865"),w=s("0393"),M=s("132d"),x=s("0fd9"),y=Object(c["a"])(l,a,i,!1,null,"004292af",null);e["default"]=y.exports;h()(y,{VBtn:f["a"],VBtnToggle:p["a"],VChip:u["a"],VCol:v["a"],VContainer:m["a"],VExpansionPanel:g["a"],VExpansionPanelContent:k["a"],VExpansionPanelHeader:b["a"],VExpansionPanels:w["a"],VIcon:M["a"],VRow:x["a"]})},cac0:function(t,e,s){"use strict";var a=s("f86f"),i=s.n(a);i.a},cc20:function(t,e,s){"use strict";s("4de4"),s("4160");var a=s("3835"),i=s("5530"),r=(s("8adc"),s("58df")),n=s("0789"),o=s("9d26"),l=s("a9ad"),c=s("4e82"),d=s("7560"),h=s("f2e7"),f=s("1c87"),p=s("af2b"),u=s("d9bd");e["a"]=Object(r["a"])(l["a"],p["a"],f["a"],d["a"],Object(c["a"])("chipGroup"),Object(h["b"])("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return Object(i["a"])(Object(i["a"])(Object(i["a"])(Object(i["a"])({"v-chip":!0},f["a"].options.computed.classes.call(this)),{},{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses),this.sizeableClasses),this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(f["a"].options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var t=this,e=[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]];e.forEach((function(e){var s=Object(a["a"])(e,2),i=s[0],r=s[1];t.$attrs.hasOwnProperty(i)&&Object(u["a"])(i,r,t)}))},methods:{click:function(t){this.$emit("click",t),this.chipGroup&&this.toggle()},genFilter:function(){var t=[];return this.isActive&&t.push(this.$createElement(o["a"],{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(n["b"],t)},genClose:function(){var t=this;return this.$createElement(o["a"],{staticClass:"v-chip__close",props:{right:!0,size:18},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("click:close"),t.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(t){var e=[this.genContent()],s=this.generateRouteLink(),a=s.tag,r=s.data;r.attrs=Object(i["a"])(Object(i["a"])({},r.attrs),{},{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:r.attrs.tabindex}),r.directives.push({name:"show",value:this.active}),r=this.setBackgroundColor(this.color,r);var n=this.textColor||this.outlined&&this.color;return t(a,this.setTextColor(n,r),e)}})},eec4:function(t,e,s){},f86f:function(t,e,s){}}]);