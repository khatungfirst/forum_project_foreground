import{aa as _,e as v,ab as F,J as f,R as m,c as n,S as c,Z as d,M as o,L as a}from"./vue-05c01b0c.js";import{_ as k}from"./_plugin-vue_export-helper-361d09b5.js";import{e as D}from"./ui-cbe5f1a1.js";const B=_({id:"dev",state:()=>({count:0}),getters:{getCountData:u=>"\u83B7\u53D6\u5230count"+u.count},actions:{saveCountData(u){this.count=u}}}),E={setup(){const u=B(),l=v({get:()=>u.count,set:C=>{u.count=C}}),r=()=>{l.value++},t=()=>{l.value--},s=()=>{l.value+=10},i=()=>{u.$reset()},{count:e}=F(u);return{store:u,count1:l,add1:r,reduce1:t,decrease1:s,resetCount1:i,count:e,add2:()=>{e.value++},reduce2:()=>{e.value--},decrease2:()=>{e.value+=10},resetCount2:()=>{u.$reset()}}}},h=c("div",{style:{height:"30px"}},null,-1),p=c("p",null,"\u65B9\u5F0F\u4E00\uFF1A\u901A\u8FC7\u8BA1\u7B97\u5C5E\u6027\u83B7\u53D6store,\u5E76\u66F4\u65B0store",-1),b=c("div",{style:{height:"30px"}},null,-1),A=c("p",null,"\u65B9\u5F0F\u4E8C\uFF1A\u901A\u8FC7pinia \u5185\u7F6E\u65B9\u6CD5storeToRefs()\u89E3\u6784store,\u5E76\u66F4\u65B0store",-1);function g(u,l,r,t,s,i){const e=D;return f(),m("div",null,[n(" \u4F7F\u7528\u6587\u6863\uFF1Asrc/config/store/dev/README.md "),h,p,c("div",null,d(t.count1),1),o(e,{"aria-label":"Increment value",onClick:t.add1},{default:a(()=>[n("\u589E\u52A0")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.reduce1},{default:a(()=>[n("\u51CF\u5C11")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.decrease1},{default:a(()=>[n("\u6B65\u8FDB")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.resetCount1},{default:a(()=>[n("\u91CD\u7F6E")]),_:1},8,["onClick"]),b,A,c("div",null,d(t.count),1),o(e,{"aria-label":"Increment value",onClick:t.add2},{default:a(()=>[n("\u589E\u52A0")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.reduce2},{default:a(()=>[n("\u51CF\u5C11")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.decrease2},{default:a(()=>[n("\u6B65\u8FDB")]),_:1},8,["onClick"]),o(e,{"aria-label":"Decrement value",onClick:t.resetCount2},{default:a(()=>[n("\u91CD\u7F6E")]),_:1},8,["onClick"])])}const I=k(E,[["render",g]]);export{I as default};
