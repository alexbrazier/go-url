(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{122:function(e,a,t){e.exports=t(156)},155:function(e,a,t){},156:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),l=t(9),c=t.n(l),o=t(26),i=t(111),s=t(215),u=t(51),m=t(32),d=t(17),h=t(95),f=t.n(h),E=t(68),b=t(97),g=t.n(b),p=t(210),O=t(77),v=t.n(O),j=t(114),y=t(205),w=t(209),k=t(208),S=t(206),C=t(207),N=t(204),x=t(219),F=t(203),_=t(200),A=t(201),L=t(199),R=t(216),I=function(e){return{type:"FLASH_MESSAGE",variant:"error",message:e}},W=t(217),H=Object(W.a)({textField:{marginTop:10},actions:{marginTop:15}}),D={displayFlashSuccess:function(e){return{type:"FLASH_MESSAGE",variant:"success",message:e}},displayFlashError:I},K=Object(o.b)(null,D)(function(e){var a=e.edit,t=e.urlKey,l=void 0===t?"":t,c=e.url,o=void 0===c?"":c,i=e.onClose,s=e.displayFlashSuccess,u=e.displayFlashError,m=Object(n.useState)(l),h=Object(d.a)(m,2),f=h[0],E=h[1],b=Object(n.useState)(o),g=Object(d.a)(b,2),p=g[0],O=g[1],v=Object(n.useState)(),j=Object(d.a)(v,2),y=j[0],w=j[1],k=H({});return Object(n.useEffect)(function(){y&&(s("Successfully set ".concat(y.urlKey," to ").concat(y.url)),i())},[y,s,u,i,a]),r.a.createElement(x.a,{open:!0,onClose:i,"data-e2e":"modal"},r.a.createElement(L.a,null,a?"Edit ".concat(f):"Add new url"),r.a.createElement(_.a,null,r.a.createElement(A.a,null,a?'You are editing the link for "'.concat(f,'". Please remember that this will change the url for everyone, so only do so if the url is wrong.'):"Enter key and url to add new link"),!a&&r.a.createElement(R.a,{id:"key",label:"Key",type:"text",className:k.textField,fullWidth:!0,autoComplete:"off",onChange:function(e){return E(e.target.value)},value:f}),r.a.createElement(R.a,{id:"url",label:"Url",type:"text",className:k.textField,fullWidth:!0,autoComplete:"off",onChange:function(e){return O(e.target.value)},value:p})),r.a.createElement(F.a,{className:k.actions},r.a.createElement(N.a,{onClick:i,color:"secondary","data-e2e":"cancel"},"Cancel"),r.a.createElement(N.a,{onClick:function(){return w({urlKey:f,url:p})},color:"primary","data-e2e":"submit"},a?"Update":"Add")))}),T=t(37),U=Object(W.a)(function(e){return{paper:{padding:15,overflowX:"auto"},url:{color:"grey",textDecoration:"none","&:hover":{textDecoration:"underline"}},launchIcon:{width:10},edit:{color:"grey"},editIcon:{padding:3},tableRow:{height:"initial"},urlCell:Object(T.a)({overflowWrap:"break-word",wordWrap:"break-word",maxWidth:300},e.breakpoints.down("xs"),{maxWidth:100})}}),G=function(e){var a=e.data,t=e.title,l=Object(n.useState)(null),c=Object(d.a)(l,2),o=c[0],i=c[1],s=Object(n.useCallback)(function(){return i(null)},[]),u=U({});return r.a.createElement("div",null,o&&r.a.createElement(K,{edit:!0,urlKey:o.key,url:o.url||o.alias.join(","),onClose:s}),r.a.createElement(j.a,{className:u.paper,"data-e2e":t},r.a.createElement("h3",null,t),a.length?r.a.createElement(y.a,{size:"small"},r.a.createElement(S.a,null,r.a.createElement(C.a,null,r.a.createElement(k.a,null,"Key"),r.a.createElement(k.a,null,"Url"),r.a.createElement(k.a,{align:"right"},"Views"),r.a.createElement(k.a,{align:"right"},"Edit"))),r.a.createElement(w.a,null,a.map(function(e){return r.a.createElement(C.a,{key:e.key,className:u.tableRow},r.a.createElement(k.a,null,e.key),r.a.createElement(k.a,{className:u.urlCell},e.alias&&e.alias.length?e.alias.map(function(e){return r.a.createElement("a",{key:e,className:u.url,href:a.find(function(a){return a.key===e}).url},e,r.a.createElement(v.a,{className:u.launchIcon}))}):r.a.createElement("a",{className:u.url,href:"".concat(e.url)},e.url,r.a.createElement(v.a,{className:u.launchIcon}))),r.a.createElement(k.a,{align:"right"},e.views),r.a.createElement(k.a,{align:"right"},r.a.createElement(p.a,{className:u.editIcon,onClick:function(){return i(e)}},r.a.createElement(g.a,{className:u.edit}))))}))):r.a.createElement("p",null,"No results found. Help others by adding it.")))},V=Object(W.a)({container:{maxWidth:800,margin:"20px auto"}}),X={displayFlashError:I},z=Object(E.a)(Object(o.b)(function(e){return{flash:e.flash,search:e.search}},X),m.g)(function(e){var a=e.search,l=e.match,c=e.location,o=e.displayFlashError,i=Object(n.useState)(),s=Object(d.a)(i,2),u=s[0],m=s[1],h=Object(n.useState)(),E=Object(d.a)(h,2),b=E[0],g=E[1],p=V({});return Object(n.useEffect)(function(){t.e(0).then(t.t.bind(null,223,3)).then(function(e){return g(e.default)})},[]),Object(n.useEffect)(function(){var e=c.search,a=f.a.parse(e.slice(1)).message;a&&o(a)},[c.search,o]),Object(n.useEffect)(function(){var e=l.params.query;e&&t.e(0).then(t.t.bind(null,223,3)).then(function(a){return a.default.filter(function(a){return a.key.includes(e)||a.url.includes(e)})}).then(function(e){return m(e)})},[l.params.query]),r.a.createElement("div",null,(a.results||u)&&r.a.createElement("div",{className:p.container},r.a.createElement(G,{data:a.results||u,title:"Search Results"})),b&&r.a.createElement("div",{className:p.container},r.a.createElement(G,{data:b,title:"Most Popular"})))}),M=t(110),q=t.n(M),P=t(214),B=t(220),J=t(100),Y=t.n(J),Q=t(211),Z=t(212),$=t(82),ee=t(222),ae=t(101),te=t.n(ae),ne=t(80),re=Object(W.a)(function(e){return{search:Object(T.a)({position:"relative",borderRadius:e.shape.borderRadius,backgroundColor:Object(ne.fade)(e.palette.common.white,.15),"&:hover":{backgroundColor:Object(ne.fade)(e.palette.common.white,.25)},marginLeft:0,width:"100%"},e.breakpoints.up("sm"),{marginLeft:e.spacing(1),width:"auto"}),searchIcon:{width:e.spacing(9),height:"100%",position:"absolute",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"center"},inputRoot:{color:"inherit",width:"100%"},inputInput:Object(T.a)({paddingTop:e.spacing(1),paddingRight:e.spacing(1),paddingBottom:e.spacing(1),paddingLeft:e.spacing(10),transition:e.transitions.create("width"),width:"100%"},e.breakpoints.up("sm"),{width:300,"&:focus":{width:400}})}}),le=function(e){var a=e.onSearch,t=Object(n.useState)(""),l=Object(d.a)(t,2),c=l[0],o=l[1],i=re({});return r.a.createElement("div",{className:i.search},r.a.createElement("div",{className:i.searchIcon},r.a.createElement(te.a,null)),r.a.createElement(ee.a,{placeholder:"Search\u2026",onChange:function(e){return o(e.target.value)},value:c,onKeyPress:function(e){return"Enter"===e.key&&a(c)},classes:{root:i.inputRoot,input:i.inputInput}}))},ce=Object(W.a)({grow:{flexGrow:1},name:{marginLeft:20,fontWeight:500},link:{textDecoration:"none",padding:10,color:"white",marginLeft:30,fontWeight:600}}),oe=function(e){var a=e.onSearch,t=Object(n.useState)(""),l=Object(d.a)(t,2),c=l[0],o=l[1];Object(n.useEffect)(function(){var e=Y.a.get("user");e&&o(e)},[]);var i=ce({});return r.a.createElement(r.a.Fragment,null,r.a.createElement(Q.a,{position:"static",style:{backgroundColor:"#fcf8e3",color:"#8a6d3b",textAlign:"center",fontWeight:"bold",padding:10}},"This is a static demo app, so nothing can be added or edited."),r.a.createElement(Q.a,{position:"static"},r.a.createElement(Z.a,null,r.a.createElement("a",{className:i.link,href:"#"},r.a.createElement($.a,{variant:"h6",color:"inherit"},"Go")),r.a.createElement("a",{className:i.link,href:"https://github.com/alexbrazier/go-url"},"Help"),r.a.createElement("div",{className:i.grow}),r.a.createElement(le,{onSearch:a}),c&&r.a.createElement("span",{className:i.name},c))))},ie=t(221),se=t(112),ue=t(81),me=t.n(ue),de=t(104),he=t.n(de),fe=t(108),Ee=t.n(fe),be=t(106),ge=t.n(be),pe=t(107),Oe=t.n(pe),ve=t(213),je=t(105),ye=t.n(je),we=t(103),ke=t.n(we),Se=t(102),Ce=t.n(Se),Ne=Object(W.a)(function(e){return{success:{backgroundColor:Ce.a[600]},error:{backgroundColor:e.palette.error.dark},info:{backgroundColor:e.palette.primary.dark},warning:{backgroundColor:ke.a[700]},icon:{fontSize:20},iconVariant:{opacity:.9,marginRight:e.spacing(1)},message:{display:"flex",alignItems:"center"}}}),xe={success:he.a,warning:ye.a,error:ge.a,info:Oe.a},Fe=function(e){var a=e.className,t=e.message,n=e.onClose,l=e.variant,c=Object(se.a)(e,["className","message","onClose","variant"]),o=xe[l],i=Ne(e);return r.a.createElement(ve.a,Object.assign({className:me()(i[l],a),"aria-describedby":"client-snackbar",message:r.a.createElement("span",{id:"client-snackbar",className:i.message},r.a.createElement(o,{className:me()(i.icon,i.iconVariant)}),t),action:[r.a.createElement(p.a,{key:"close","aria-label":"Close",color:"inherit",onClick:n},r.a.createElement(Ee.a,{className:i.icon}))]},c))},_e={clearFlash:function(){return{type:"FLASH_CLEAR"}}},Ae=Object(o.b)(null,_e)(function(e){var a=e.variant,t=e.message,n=e.clearFlash,l=function(e,a){return"clickaway"===a&&n()};return r.a.createElement(ie.a,{"data-e2e":"alert",anchorOrigin:{vertical:"top",horizontal:"center"},open:!0,autoHideDuration:6e3,onClose:l},r.a.createElement(Fe,{onClose:l,variant:a,message:t}))}),Le=Object(W.a)({button:{position:"fixed",right:23,bottom:23}}),Re=Object(E.a)(Object(o.b)(function(e){return{flash:e.flash}}),m.g)(function(e){var a=e.children,t=e.history,l=e.flash,c=e.location,o=Object(n.useState)(!1),i=Object(d.a)(o,2),s=i[0],u=i[1],m=Object(n.useState)(),h=Object(d.a)(m,2),f=h[0],E=h[1],b=Le({}),g=Object(n.useCallback)(function(){return u(!1)},[]),p=c.search.includes("message=")&&c.pathname.slice(1);return Object(n.useEffect)(function(){void 0!==f&&t.push("/".concat(f))},[f,t]),r.a.createElement("div",null,l.message&&r.a.createElement(Ae,{variant:l.variant,message:l.message}),s&&r.a.createElement(K,{onClose:g,urlKey:p||void 0}),r.a.createElement(oe,{onSearch:E}),a,r.a.createElement(B.a,{title:"Add New URL"},r.a.createElement(P.a,{"data-e2e":"add-button",color:"secondary","aria-label":"Add",className:b.button,onClick:function(){return u(!0)}},r.a.createElement(q.a,null))))}),Ie=function(){return r.a.createElement(u.a,null,r.a.createElement(Re,null,r.a.createElement(m.d,null,r.a.createElement(m.b,{exact:!0,path:"/:query?",component:z}),r.a.createElement(m.a,{to:"/"}))))},We=t(41),He=t(48),De={},Ke=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Object(He.a)({},De),a=arguments.length>1?arguments[1]:void 0;switch(a.type){case"FLASH_MESSAGE":return{variant:a.variant,message:a.message};case"FLASH_CLEAR":return Object(He.a)({},De);default:return e}},Te={},Ue=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Object(He.a)({},Te),a=arguments.length>1?arguments[1]:void 0;switch(a.type){case"SEARCH":return{results:a.data};default:return e}},Ge=Object(We.b)({flash:Ke,search:Ue}),Ve=Object(We.c)(Ge,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__()),Xe=(t(154),t(155),Object(i.a)()),ze=r.a.createElement(o.a,{store:Ve},r.a.createElement(s.a,{theme:Xe},r.a.createElement(Ie,null)));c.a.render(ze,document.getElementById("root"))}},[[122,2,3]]]);
//# sourceMappingURL=main.36346f1f.chunk.js.map