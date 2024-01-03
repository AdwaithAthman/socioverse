import{u as H,r as n,a as T,g as te,j as e,k as E,H as ue,L as B,C as L,R as ae,b as l,A as V,c as J,s as X,d as Y,f as pe,Q as w,T as M,e as ge,h as fe,i as je,l as ve,m as Z,n as Q,o as be,M as ne,p as le,B as G,q as W,t as re,v as we,G as Ne,w as ye,x as ke,y as Ce,z as Se,D as oe,E as _e,F as Ie,I as Ue,J as De,K as Fe,N as Me,O as Le,P as Ae,S as xe,U as ie,V as Be,W as Te,X as Oe}from"./index-6d813b4e.js";import{T as ce}from"./index.esm-6fbf03ea.js";import{f as de}from"./index-fe2a000f.js";import{u as Ee,I as He}from"./ImageCropper-301d4019.js";function Ve({handleFollowingAdd:i,handleFollowingRemove:f}){const u=H(t=>{var d;return(d=t==null?void 0:t.auth)==null?void 0:d.user}),[m,j]=n.useState(null),[a,p]=n.useState(),[h,c]=n.useState([]),[b,x]=n.useState(!1),S=()=>x(!b),y=T();n.useEffect(()=>{const t=async()=>{if(!u){const r=await d();j(r)}},d=async()=>{const{user:r}=await J(),{accessToken:g}=X.getState().auth;return y(Y({user:r,accessToken:g})),r};t(),te().then(r=>c(r.suggestions))},[]),n.useEffect(()=>{u&&p(u.following)},[u]);const _=(t,d)=>{pe(t).then(()=>{i(!0),w.dismiss(),w.success(`Following ${d}`,{...M,position:"bottom-left"})}),!(a!=null&&a.includes(t))&&p([...a,t]),y(ge(t))},I=(t,d)=>{fe(t).then(()=>{f(!0),w.dismiss(),w.success(`Unfollowed ${d}`,{...M,position:"bottom-left"})}),p(a==null?void 0:a.filter(r=>r!==t)),y(je(t))},k=()=>{te().then(t=>c(t.suggestions))};return e.jsxs(e.Fragment,{children:[e.jsx(E,{}),e.jsx("div",{className:"flex max-w-2xl flex-col rounded-lg border shadow-lg p-2",children:e.jsx("div",{children:e.jsx("div",{className:"p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"text-2xl",children:e.jsx(ue,{})}),e.jsx("h1",{className:"inline-flex items-center text-lg font-semibold",children:"People you may know"})]}),e.jsx("div",{className:"flex flex-col gap-2 ",children:h.slice(0,5).map(t=>{var d,r;return e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${t._id}`,children:e.jsxs("div",{className:"s) => setLimt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:t.dp?t.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:t==null?void 0:t.name}),e.jsx("span",{className:"text-[11px] font-medium text-gray-500",children:t.username?`@${t.username}`:"@ -"})]})]})}),a!=null&&a.includes(t._id)||u&&((d=t.followers)!=null&&d.includes(u._id))||m&&((r=t.followers)!=null&&r.includes(m._id))?e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group",onClick:()=>I(t._id,t.name),children:e.jsx(ae,{className:"text-xl text-white group-hover:text-red-500"})}):e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:bg-white hover:border-3 group",onClick:()=>_(t._id,t.name),children:e.jsx(ce,{className:"text-xl text-socioverse-500 group-hover:text-blue-gray-500"})})]},t._id)})}),e.jsx("div",{className:"inline-block",children:e.jsxs(l.Button,{variant:"text",className:"flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold",onClick:()=>{k(),S()},disabled:h.length<=5,children:["View More",e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"h-4 w-4",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"})})]})})]})})})}),e.jsxs(l.Dialog,{open:b,size:"xs",handler:S,animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("h1",{className:"text-xl font-semibold",children:"People you may know"}),e.jsx("div",{children:e.jsx(V,{className:"text-3xl cursor-pointer",onClick:S})})]})}),e.jsx(E,{}),e.jsx(l.DialogBody,{className:"flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll",children:e.jsx("div",{className:"flex flex-col gap-2 ",children:h.map(t=>{var d,r;return e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${t._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:t.dp?t.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:t==null?void 0:t.name}),e.jsx("span",{className:"text-[11px] font-medium text-gray-500",children:t.username?`@${t.username}`:"@ -"})]})]})}),a!=null&&a.includes(t._id)||u&&((d=t.followers)!=null&&d.includes(u._id))||m&&((r=t.followers)!=null&&r.includes(m._id))?e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group",onClick:()=>I(t._id,t.name),children:e.jsx(ae,{className:"text-xl text-white group-hover:text-red-500"})}):e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:bg-white hover:border-3 group",onClick:()=>_(t._id,t.name),children:e.jsx(ce,{className:"text-xl text-socioverse-500 group-hover:text-blue-gray-500"})})]},t._id)})})}),e.jsx(l.DialogFooter,{children:void 0})]})]})}function ze({newFollowing:i,handleFollowingAdd:f,removeFollowing:u,handleFollowingRemove:m,socket:j}){const a=T(),p=ve(),h=Z(),[c,b]=n.useState([]),[x,S]=n.useState([]),[y,_]=n.useState(!1),[I,k]=n.useState(!1),t=()=>_(!y),d=()=>k(!I),r=H(s=>s.auth.user);n.useEffect(()=>{r&&(Q(r._id).then(s=>{b(s.following)}),be(r._id).then(s=>{S(s.followers)}))},[r]);const[g,A]=n.useState(1),O=s=>A(g===s?0:s);i&&(r&&Q(r._id).then(s=>{b(s.following)}),f(!1)),u&&(r&&Q(r._id).then(s=>{b(s.following)}),m(!1));const C=async s=>{const U=await de(s);a(re(U.chat)),p.pathname!=="/message"&&h("/message")},F=async s=>{const U=await de(s);a(re(U.chat)),j&&j.emit("call-user",r,U.chat),a(we(!0)),p.pathname!=="/message"&&h("/message")};return e.jsxs(e.Fragment,{children:[e.jsxs(l.Accordion,{open:g===2,className:"mb-5 rounded-lg border px-2 shadow-lg",children:[e.jsxs("div",{onClick:()=>O(2),className:`border-b-0 transition-colors flex items-center justify-between p-4 cursor-pointer 
          `,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-lg font-semibold",children:"Followers"}),e.jsx(l.Chip,{value:x==null?void 0:x.length,size:"sm",variant:"ghost",color:"blue-gray",className:"rounded-full"})]}),e.jsx("div",{className:"text-2xl",children:g===2?e.jsx(ne,{}):e.jsx(le,{})})]}),e.jsx(l.AccordionBody,{className:"pt-0 text-base font-normal",children:e.jsxs("div",{className:"flex flex-col gap-4 px-4",children:[e.jsx("div",{className:"flex flex-col gap-2 ",children:x!=null&&x.length&&x?x.slice(0,5).map((s,U)=>e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out rounded-lg hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${s._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:s.dp?s.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:s.name}),e.jsxs("span",{className:"text-[11px] font-medium text-gray-500",children:["@",s.username]})]})]})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>C(s._id),children:e.jsx(G,{className:"text-md text-socioverse-500 group-hover:text-green-500"})}),e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>F(s._id),children:e.jsx(W,{className:"text-xl text-socioverse-500  group-hover:text-green-500"})})]})]},U)):e.jsx("div",{children:"No followers"})}),x!=null&&x.length?e.jsx("div",{className:"inline-block",children:e.jsxs(l.Button,{variant:"text",className:"flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold",onClick:t,disabled:(x==null?void 0:x.length)<6,children:["View All",e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"h-4 w-4",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"})})]})}):""]})})]}),e.jsxs(l.Accordion,{open:g===3,className:"mb-5 rounded-lg border px-2 shadow-lg",children:[e.jsxs("div",{onClick:()=>O(3),className:`border-b-0 transition-colors flex items-center justify-between p-4 cursor-pointer 
          `,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-lg font-semibold",children:"Following"}),e.jsx(l.Chip,{value:c==null?void 0:c.length,size:"sm",variant:"ghost",color:"blue-gray",className:"rounded-full"})]}),e.jsx("div",{className:"text-2xl",children:g===3?e.jsx(ne,{}):e.jsx(le,{})})]}),e.jsx(l.AccordionBody,{className:"pt-0 text-base font-normal",children:e.jsxs("div",{className:"flex flex-col gap-4 px-4",children:[e.jsx("div",{className:"flex flex-col gap-2 ",children:c!=null&&c.length&&c?c.slice(0,5).map(s=>e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${s._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:s.dp?s.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:s.name}),e.jsxs("span",{className:"text-[11px] font-medium text-gray-500",children:["@",s.username]})]})]})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",children:e.jsx(G,{className:"text-md text-socioverse-500 group-hover:text-green-500",onClick:()=>C(s._id)})}),e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>F(s._id),children:e.jsx(W,{className:"text-xl text-socioverse-500  group-hover:text-green-500"})})]})]},s._id)):e.jsx("div",{children:"No following"})}),c!=null&&c.length?e.jsx("div",{className:"inline-block",children:e.jsxs(l.Button,{variant:"text",className:"flex items-center gap-2 text-black capitalize shadow-none text-sm font-semibold",onClick:d,disabled:(c==null?void 0:c.length)<6,children:["View All",e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",className:"h-4 w-4",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"})})]})}):""]})})]}),e.jsxs(l.Dialog,{open:y,size:"xs",handler:t,animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("h1",{className:"text-xl font-semibold",children:"Followers List"}),e.jsx("div",{children:e.jsx(V,{className:"text-3xl cursor-pointer",onClick:t})})]})}),e.jsx(E,{}),e.jsx(l.DialogBody,{className:"flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll",children:e.jsx("div",{className:"flex flex-col gap-2 ",children:x.map(s=>e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${s._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:s.dp?s.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:s==null?void 0:s.name}),e.jsx("span",{className:"text-[11px] font-medium text-gray-500",children:s.username?`@${s.username}`:"@ -"})]})]})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>C(s._id),children:e.jsx(G,{className:"text-md text-socioverse-500 group-hover:text-green-500"})}),e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>F(s._id),children:e.jsx(W,{className:"text-xl text-socioverse-500  group-hover:text-green-500"})})]})]},s._id))})}),e.jsx(l.DialogFooter,{children:void 0})]}),e.jsxs(l.Dialog,{open:I,size:"xs",handler:d,animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("h1",{className:"text-xl font-semibold",children:"Following List"}),e.jsx("div",{children:e.jsx(V,{className:"text-3xl cursor-pointer",onClick:d})})]})}),e.jsx(E,{}),e.jsx(l.DialogBody,{className:"flex flex-col gap-4 lg:mx-4 lg:my-0 m-2 max-h-[20.5rem] overflow-y-scroll",children:e.jsx("div",{className:"flex flex-col gap-2 ",children:c.map(s=>e.jsxs("div",{className:"flex p-2 items-center justify-between transition duration-100 ease-in-out hover:shadow-md hover:scale-105 hover:rounded-lg",children:[e.jsx(B,{to:`/profile/${s._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:s.dp?s.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-medium text-gray-900",children:s==null?void 0:s.name}),e.jsx("span",{className:"text-[11px] font-medium text-gray-500",children:s.username?`@${s.username}`:"@ -"})]})]})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>C(s._id),children:e.jsx(G,{className:"text-md text-socioverse-500 group-hover:text-green-500"})}),e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group",onClick:()=>F(s._id),children:e.jsx(W,{className:"text-xl text-socioverse-500  group-hover:text-green-500"})})]})]},s._id))})}),e.jsx(l.DialogFooter,{children:void 0})]})]})}function $e(){return e.jsxs("div",{className:"flex w-full flex-row items-center gap-2 rounded-[99px] border shadow-md border-black/40 bg-blue-gray-100/30 p-1 md:p-2",children:[e.jsx(l.Textarea,{rows:1,resize:!1,placeholder:"Start your post here...",className:"min-h-full !border-0 focus:border-transparent",containerProps:{className:"grid h-full"},labelProps:{className:"before:content-none after:content-none"}}),e.jsx("div",{children:e.jsx(l.IconButton,{variant:"text",className:"rounded-full text-blue-gray-700",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,className:"h-5 w-5",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"})})})})]})}function Re(i){return Ne({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"}},{tag:"circle",attr:{cx:"12",cy:"13",r:"4"}}]})(i)}const Ge=()=>{const i=T();return Ee(async f=>await ke(f),{onSuccess:f=>{i(ye(f))}})},We=({open:i,handleOpen:f,setIsLastPage:u,setPostCreated:m})=>{const j=H(o=>o.auth.user),[a,p]=n.useState(!1),[h,c]=n.useState(null),[b,x]=n.useState(null),[S,y]=n.useState(!1),[_,I]=n.useState(null),[k,t]=n.useState(new FormData),[d,r]=n.useState([]),g=H(o=>o.post.image),A=T(),O=()=>p(!a),C=()=>y(!S),F=Ge(),s=async(o,N)=>{if(o.length>0)try{o.forEach((D,K)=>{N.append("files",D,`image${K}.jpg`)})}catch(D){console.error("Upload error:",D)}},U=o=>{r(N=>[...N,{blob:o,image:URL.createObjectURL(o)}]),C()},z=o=>{var N;if((N=o.target.files)!=null&&N.length&&o.target.files[0]){const D=o.target.files[0];D.type.startsWith("image/")?(I(D),y(!0)):w.warn("Only image files are allowed!",M)}},$=async()=>{if(g&&g.length>0){const o=d.map(N=>N.blob);await s(o,k)}if(h&&k.append("description",h),b&&k.append("hashtags",b),!h&&!b&&(!g||g.length===0))w.dismiss(),w.error("All the fields cannot be empty!",M);else try{const o=F.mutateAsync(k);w.promise(o,{pending:"Uploading the post...",success:"Post uploaded successfully",error:"Upload failed!"},{...M,position:"bottom-left",closeButton:!1}),await(o||F.isSuccess)?(u(!1),w.dismiss(),m((await o).post)):w.dismiss(),f(),x(null),c(null),I(null),A(Ie()),r([])}catch{w.dismiss(),w.error("Upload failed!",{...M,position:"bottom-left"})}t(new FormData)},q=o=>{A(Ue(o)),r(N=>N.filter(D=>D.image!==o))};return e.jsxs(e.Fragment,{children:[e.jsxs(l.Dialog,{open:i,size:"md",handler:f,dismiss:{enabled:!1},animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(E,{}),e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("div",{className:"flex items-center justify-between gap-5 transition-transform duration-300 mx-1 px-2 pb-3 rounded-lg cursor-pointer hover:bg-gray-200 hover:scale-105",children:j&&e.jsx(B,{to:`/profile/${j._id}`,children:e.jsxs("div",{className:"mt-3 flex items-center space-x-2",children:[e.jsx("img",{className:"inline-block h-12 w-12 rounded-full",src:j.dp?j.dp:L.DEFAULT_IMG,alt:"user dp"}),e.jsxs("span",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[14px] font-bold text-gray-900",children:j.name}),e.jsx("span",{className:"text-[11px] font-bold text-green-500",children:"Post to Connections"})]})]})})}),e.jsx("div",{children:e.jsx(V,{className:"text-3xl cursor-pointer",onClick:f})})]})}),e.jsxs(l.DialogBody,{className:"flex flex-col gap-4 lg:mx-4 my-0 mx-2 px-4 py-0 md:px-4 md:py-4 max-h-[20.5rem] overflow-y-scroll",children:[e.jsx("div",{className:"w-full mb-20 sm:mb-12",children:e.jsx(Ce,{textValue:h,setTextValue:c})}),a&&e.jsx("div",{className:"w-full",children:e.jsx(l.Input,{label:"Hashtags",value:b||"",onChange:o=>x(o.target.value)})}),g&&g.length>0&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{className:"border border-black/20 py-5 md:py-10 flex flex-col gap-2 md:gap-5",children:g.map((o,N)=>e.jsx("div",{className:"h-56 md:h-[19rem] w-full relative",style:{backgroundImage:`url(${o})`,backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center"},children:e.jsx("div",{className:"absolute flex gap-3 bottom-5 right-4 md:bottom-3 md:right-16",children:e.jsx("div",{className:"flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-500 rounded-full cursor-pointer border-2 border-blue-gray-700 hover:border-red-700 hover:bg-white hover:border-3 group opacity-70 hover:opacity-100",children:e.jsx(Se,{className:"text-xl text-white group-hover:text-red-500",onClick:()=>q(o)})})})},N))}),g.length===5&&e.jsx("em",{className:"text-sm font-light text-right pr-1",children:"* Max of 5 images are allowed!"})]})]}),e.jsx(l.DialogFooter,{children:e.jsxs("div",{className:"float-left mx-4 mb-4 flex justify-between items-center w-full",children:[e.jsxs("div",{className:"flex justify-between items-center gap-3 mx-2",children:[e.jsx("div",{className:oe("flex justify-center items-center border-2 w-8 h-8 rounded-full cursor-pointer hover:border-socioverse-500 group",{"border-socioverse-500":a},{"border-black":!a}),onClick:O,children:e.jsx(_e,{className:oe("text-2xl group-hover:text-socioverse-500",{"text-socioverse-500":a},{"text-black":!a})})}),e.jsx("input",{type:"file",accept:"image/*",id:"image-input",className:"hidden",onChange:z,disabled:(g==null?void 0:g.length)===5}),e.jsx("label",{htmlFor:"image-input",className:"flex justify-center items-center text-black border-black border-2 w-8 h-8 rounded-full cursor-pointer hover:border-socioverse-500 group",children:e.jsx(Re,{className:"text-xl group-hover:text-socioverse-500"})})]}),e.jsx(l.Button,{size:"sm",className:"rounded-full bg-socioverse-500",onClick:$,children:"Post"})]})})]}),e.jsxs(l.Dialog,{open:S,size:"lg",handler:C,animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("div",{className:"text-2xl",children:"Image"}),e.jsx("div",{children:e.jsx(V,{className:"text-3xl cursor-pointer",onClick:C})})]})}),e.jsx(l.DialogBody,{className:"lg:m-4 m-2",children:_?e.jsx("div",{className:"w-auto lg:h-[28rem] h-96 ",children:e.jsx(He,{image:URL.createObjectURL(_),getImage:U,aspectRatio:1.5/1})}):" "})]})]})},qe=({handleUsernameInputPopup:i,usernameInputPopupOpen:f,setIsUsernameAvailable:u})=>{const m=T(),j=De().shape({username:Fe().trim().matches(/^\S+$/,"Username cannot contain whitespace characters").min(3,"Username should be atleast 3 characters").required("Username is required")}),a=Me({initialValues:{username:""},validationSchema:j,onSubmit:async p=>{try{const h=await Le(p.username);h.status==="success"?(m(Ae(p.username)),u(!0),w.success("Username added successfully",{...M,position:"bottom-left"}),u(!0),i()):w.error(h.message,M)}catch(h){if(xe(h)){const c=h;if(c.response&&c.response.status>=400&&c.response.status<=500){const b=c.response.data.message;w.error(b,M)}}}}});return e.jsxs(l.Dialog,{open:f,size:"md",handler:i,dismiss:{enabled:!1},animate:{mount:{scale:1,y:0},unmount:{scale:.9,y:-100}},children:[e.jsx(l.DialogHeader,{children:e.jsxs("div",{className:"flex justify-between items-center w-full",children:[e.jsx("div",{className:"text-2xl",children:"User Info"}),e.jsx("div",{})]})}),e.jsx(E,{}),e.jsx(l.DialogBody,{className:"mx-4 mb-8",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("div",{className:"text-md mb-6 border-2 p-4 rounded-lg bg-green-50 border-green-500",children:"Enter your username to continue, it should be unique!"}),e.jsxs("form",{onSubmit:a.handleSubmit,className:"flex items-start gap-5 justify-center",children:[e.jsx("div",{className:"w-[20rem]",children:e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(l.Input,{type:"text",label:"Username",name:"username",value:a.values.username,onChange:a.handleChange,onBlur:a.handleBlur}),a.touched.username&&a.errors.username&&e.jsx("div",{className:"text-red-500 mt-[0.5rem] text-sm inline",children:a.errors.username})]})}),e.jsx(l.Button,{size:"lg",className:"bg-socioverse-500 hover:scale-105 text-white px-4 py-2 rounded-lg",disabled:!a.values.username,type:"submit",children:"Continue"})]})]})})]})},Ke=({user:i,socket:f})=>{const u=T(),[m,j]=n.useState([]),[a,p]=n.useState(!1),[h,c]=n.useState(1),[b,x]=n.useState(!1),[S,y]=n.useState(null),[_,I]=n.useState(null),[k,t]=n.useState(null),[d,r]=n.useState(null),[g,A]=n.useState(!0),[O,C]=n.useState(!1),F=Z();n.useEffect(()=>{i&&A(!!i.username)},[i]),n.useEffect(()=>{i&&C(!g)},[g,i]);const s=()=>{C(v=>!v)},U=async()=>{const v=await ie(h);j(v.posts),c(h+1),p(!1)};n.useEffect(()=>{U()},[]),n.useEffect(()=>{const v=document.getElementById("sentinel"),R=new IntersectionObserver(async he=>{if(he[0].isIntersecting&&!a&&!b){p(!0);const se=await ie(h);if(se.posts.length===0){x(!0),p(!1);return}else x(!1);j([...m,...se.posts]),c(h+1),p(!1)}});return R.observe(v),()=>{R.unobserve(v)}},[a,m,h,b]),n.useEffect(()=>{i||J().then(v=>{u(Y({user:v.user,accessToken:X.getState().auth.accessToken}))})},[u,i]);const[z,$]=n.useState(!1),q=()=>$(!z),o=()=>{$(!0)},[N,D]=n.useState(!1),[K,me]=n.useState(!1),P=v=>{D(v)},ee=v=>{me(v)};return S&&(j(m.filter(v=>v._id!==S)),y(null)),n.useEffect(()=>{_&&(j(m.filter(v=>v._id!==_)),I(null))},[m,_]),n.useEffect(()=>{k&&(j([{...k,newPostCreated:!0},...m]),t(null))},[k,m]),n.useEffect(()=>{d&&(j(m.map(v=>v._id===d._id?d:v)),r(null))},[d,m]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"lg:flex gap-3 items-start justify-between h-[80vh] lg:h-[85vh]",children:[e.jsx("aside",{className:"hidden lg:block w-3/12 px-3 sticky top-28 overflow-y-auto h-[80vh] no-scrollbar",children:e.jsx(ze,{newFollowing:N,handleFollowingAdd:P,removeFollowing:K,handleFollowingRemove:ee,socket:f})}),e.jsxs("main",{className:"w-full lg:w-6/12 px-3 md:px-6 overflow-x-hidden overflow-y-auto h-[85vh] no-scrollbar flex flex-col items-center p-2",children:[e.jsxs("div",{className:"flex items-center justify-between w-full md:p-2 mb-8 gap-3 md:gap-5 sticky top-0 z-40",children:[e.jsx(l.Avatar,{variant:"circular",alt:"user dp",className:"border h-12 w-12 md:h-14 md:w-14 border-gray-500 p-0.5 cursor-pointer",src:i&&i.dp?i.dp:L.DEFAULT_IMG,onClick:()=>F(`/profile/${i&&i._id}`)}),e.jsx("div",{className:"w-full",onClick:o,children:e.jsx($e,{})})]}),e.jsxs("div",{className:" overflow-y-auto h-[85vh] w-full no-scrollbar flex flex-col items-center",children:[e.jsxs("div",{className:"mb-10 max-w-[30rem] w-full",children:[m.map((v,R)=>e.jsx("div",{className:"mb-10 w-full",children:e.jsx(Be,{postData:v,setDeletedPostId:y,setReportedPostId:I,setPostEdited:r})},R)),a&&e.jsx("div",{className:"w-full px-2",children:e.jsx(Te,{})}),e.jsx(We,{open:z,handleOpen:q,setIsLastPage:x,setPostCreated:t})]}),b&&e.jsx("div",{children:" No posts..."}),e.jsx("div",{id:"sentinel",style:{height:"1px"},className:"w-full mb-4",children:!b&&e.jsx("div",{children:e.jsx("img",{src:Oe,className:"w-20 h-20 mx-auto mt-2 lg:mt-4"})})})]})]}),e.jsx("aside",{className:"hidden lg:block w-3/12 px-3 pb-5 sticky top-28 overflow-hidden",children:e.jsx(Ve,{handleFollowingAdd:P,handleFollowingRemove:ee})})]}),e.jsx(qe,{handleUsernameInputPopup:s,usernameInputPopupOpen:O,setIsUsernameAvailable:A})]})},Qe=({user:i,socket:f})=>e.jsx(e.Fragment,{children:e.jsx(Ke,{user:i,socket:f})}),Pe=({socket:i})=>{const f=H(a=>a.auth),u=Z(),m=T();n.useEffect(()=>{f.isAuthenticated||j()||u("/error")},[f]);const j=async()=>{try{const{user:a}=await J(),{accessToken:p}=X.getState().auth;return m(Y({user:a,accessToken:p})),a}catch(a){if(xe(a)){const p=a;p.response&&p.response.status>=400&&p.response.status<=500&&u("/login")}}};return e.jsx(e.Fragment,{children:e.jsx(Qe,{user:f.user,socket:i})})};export{Pe as default};
