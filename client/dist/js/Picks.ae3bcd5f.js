(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Picks"],{"44a4":function(t,s,e){},"7d13":function(t,s,e){"use strict";var a=e("eec4"),i=e.n(a);i.a},ae7c:function(t,s,e){"use strict";var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"text-center allText"},[t.homeLink?e("router-link",{attrs:{to:"/"}},[e("cat-head-color",{staticClass:"colorCat"})],1):t._e(),e("br"),t._t("default"),e("div",[t._v("contact us at:")]),t._m(0),e("div",[e("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://twitter.com/hey__bert"}},[e("v-icon",{attrs:{size:"46"}},[t._v("mdi-twitter")])],1),e("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://www.instagram.com/hey__bert/"}},[e("v-icon",{attrs:{size:"46"}},[t._v("mdi-instagram")])],1),e("a",{staticClass:"socialLinks",attrs:{target:"_blank",href:"https://www.reddit.com/user/hey__bert"}},[e("v-icon",{attrs:{size:"46"}},[t._v("mdi-reddit")])],1)]),e("br"),e("br"),e("p",{staticClass:"subText"},[t._v(" Brett Hiebert © 2020 ")]),e("div",{staticClass:"bottomPad"})],2)},i=[function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("p",[e("a",{attrs:{href:"mailto:streamcatsinfo@gmail.com"}},[t._v("streamcatsinfo@gmail.com")])])}],r=e("4177"),n={name:"BottomLinks",components:{CatHeadColor:r["a"]},props:{homeLink:Boolean}},o=n,c=(e("7d13"),e("2877")),l=e("6544"),d=e.n(l),v=e("132d"),p=Object(c["a"])(o,a,i,!1,null,"dffcfd28",null);s["a"]=p.exports;d()(p,{VIcon:v["a"]})},cdfa:function(t,s,e){"use strict";var a=e("44a4"),i=e.n(a);i.a},eec4:function(t,s,e){},f716:function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("v-container",{staticClass:"setWidth"},[e("div",{staticClass:"text-center"},[e("stream-cats",{staticClass:"scTitle"}),e("div",[e("v-btn",{staticClass:"picksBtn",attrs:{color:t.$vuetify.theme.dark?"":"#fff",rounded:""},on:{click:function(s){return t.bubbleUpPicks()}}},[e("span",{staticClass:"picksBtnText"},[t._v("CAT PICKS")]),e("v-icon",{attrs:{dense:"",size:"14px"}},[t._v("mdi-content-duplicate")])],1)],1)],1),e("div",{staticClass:"text-center "},[t._l(t.items,(function(s,a){return e("div",{key:s.imgSrc,attrs:{id:s.linkId}},[e("div",{staticClass:"pickCard",attrs:{rounded:"xl"}},[e("v-container",{staticClass:"text-left titleWrapper"},[e("div",{staticClass:"d-flex justify-space-between align-start"},[e("span",{staticClass:"titleText text-left"},[e("span",[t._v(t._s(s.title))])]),e("span",{staticClass:"infoText text-right"},[e("span",[t._v(" "+t._s(s.rating)+" "),e("span",{staticClass:"dividerLine"},[t._v("|")]),t._v(" "+t._s(s.imdbScore)+" "),e("span",{staticClass:"dividerLine"},[t._v("|")]),t._v(" "+t._s(s.year)+" ")])])]),e("div",t._l(s.subgenres,(function(a){return e("span",{key:a,staticClass:"genreTags"},[e("v-chip",{attrs:{"x-small":"",color:t.getColor(s.cat,a)}},[t._v(t._s(a))])],1)})),0)]),e("div",{staticClass:"imgWrapper"},[e("img",{staticClass:"cardImg",attrs:{src:s.imgSrc,alt:s.title}}),e("div",{staticClass:"imgCredOver"},[t._v(t._s(s.imgCred))])]),e("v-container",{staticClass:"descWrapper"},[e("div",{staticClass:"d-flex justify-space-between align-center",on:{click:function(s){return t.showMore(a)}}},[e("span",{staticClass:"subheadingText"},[t._v(" "+t._s(s.subheading)),e("span",[t._v(t._s(s.showAll?".":"..."))])]),e("v-btn",{staticClass:"moreBtn",attrs:{width:52,small:"",text:""}},[e("span",[t._v(" "+t._s(s.showAll?"less":"more")+" ")]),e("v-icon",{attrs:{size:"17"}},[t._v(" "+t._s(s.showAll?"mdi-chevron-up":"mdi-chevron-down")+" ")])],1)],1),e("v-expand-transition",[s.showAll?e("div",[e("div",{staticClass:"descText",domProps:{innerHTML:t._s(s.review)}}),e("br"),e("div",{staticClass:"d-flex justify-space-between postText"},[e("span",[t._v(t._s(s.author))]),t._v(" "),e("span",{staticClass:"text-right"},[t._v(t._s(s.date))])])]):t._e()])],1),e("v-divider"),e("div",{staticClass:"cardActions"},[e("v-container",{staticClass:"d-flex justify-space-between"},[e("div",[e("v-btn",{attrs:{small:"",outlined:"",target:"_blank",rounded:"",color:"#FBC02D",href:s.imdbHref}},[t._v(" IMDB:"),e("v-icon",{attrs:{small:""}},[t._v("mdi-exit-to-app")])],1)],1),e("v-btn",{attrs:{height:"28",text:"",rounded:""},on:{click:function(s){return t.copyPickLink("#pLink-"+a)}}},[e("v-icon",{attrs:{size:"20",color:"grey"}},[t._v("mdi-share-variant")])],1),e("div",[e("v-btn",{attrs:{small:"",outlined:"",target:"_blank",rounded:"",color:t.catColors[s.cat],href:s.href}},[t._v(" "+t._s(s.cat+": ")+" "),e("v-icon",{attrs:{small:""}},[t._v("mdi-exit-to-app")])],1)],1)],1),e("textarea",{staticClass:"postLink",attrs:{readonly:"readonly",id:"pLink-"+a},domProps:{value:t.baseUrl+"/cat-picks#"+s.linkId}})],1)],1),e("br"),e("div",{staticClass:"d-flex justify-center"},[e("v-expand-transition",[t.noteCopy?e("div",{staticClass:"snackNote"},[t._v(" "+t._s(t.copyIssue?"Oops, URL not copied...":"POST URL COPIED")+" ")]):t._e()])],1)])})),e("br"),e("br"),e("br"),e("br")],2),e("bottom-links",{directives:[{name:"show",rawName:"v-show",value:t.picksLoaded,expression:"picksLoaded"}],attrs:{homeLink:!0}},[t._v(" For StreamCats news and updates ")])],1)],1)},i=[],r=e("b022"),n=e("ae7c"),o=e("bb0d"),c=e("a588"),l=e("bc3a"),d=e.n(l),v={name:"About",components:{StreamCats:r["a"],BottomLinks:n["a"]},data:()=>({items:[],catColors:{netflix:"red",hulu:"green lighten-2"},genreColors:{hulu:o,netflix:c},noteCopy:!1,copyIssue:!1,picksLoaded:!1,baseUrl:"https://streamcats.com"}),created(){this.getPicks()},methods:{getColor(t,s){return this.genreColors[t][s]},copyPickLink(t){let s=document.querySelector(t);s?(this.noteCopy=!0,s.select(),document.execCommand("copy"),setTimeout(()=>{this.noteCopy=!1},800)):(this.copyIssue=!0,this.noteCopy=!0,setTimeout(()=>{this.noteCopy=!1,this.copyIssue=!1},800))},showMore(t){this.items[t].showAll=!this.items[t].showAll},scrollToLink(){if(this.$router.history.current.hash){let t=document.querySelector(this.$router.history.current.hash);t&&t.scrollIntoView({behavior:"smooth"})}},bubbleUpPicks(){let t=this.items,s=t.pop();t.unshift(s),this.items=t,this.$forceUpdate()},async getPicks(){try{const t=await d.a.get("https://streamcats.com/api/cat/picks");this.items=t.data,this.picksLoaded=!0,setTimeout(()=>{this.scrollToLink()},800)}catch(t){console.log(t)}}}},p=v,u=(e("cdfa"),e("2877")),m=e("6544"),h=e.n(m),_=e("8336"),C=e("cc20"),f=e("a523"),b=e("ce7e"),k=e("0789"),g=e("132d"),x=Object(u["a"])(p,a,i,!1,null,"7312b02a",null);s["default"]=x.exports;h()(x,{VBtn:_["a"],VChip:C["a"],VContainer:f["a"],VDivider:b["a"],VExpandTransition:k["a"],VIcon:g["a"]})}}]);