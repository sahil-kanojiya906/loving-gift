/* ===== Edit these ===== */
var CFG={
  name:"Bestie",
  passcode:"0101",
  hint:"Hint: the day we became best friends",
  message:["Happy birthday! I hope this year brings you everything you’ve been wishing for.","Thank you for the laughs, the talks, and for being someone who makes every day better.","You’re really special to me, and I wanted to make today special for you too."],
  memories:[
    {t:"Our first trip",d:"Add your date",e:"🌸"},
    {t:"Best day ever",d:"Add your date",e:"🍦"},
    {t:"That silly night",d:"Add your date",e:"✨"},
    {t:"Us being us",d:"Add your date",e:"🎈"}
  ]
};
/* ====================== */
var $=function(i){return document.getElementById(i)};
function show(n){document.querySelectorAll(".screen").forEach(function(s){s.classList.remove("on")});$("s"+n).classList.add("on")}

/* Lock */
var code="";
["1","2","3","4","5","6","7","8","9","⌫","0","?"].forEach(function(k){
  var b=document.createElement("button");b.textContent=k;b.setAttribute("aria-label",k==="⌫"?"Delete":k==="?"?"Hint":k);
  b.onclick=function(){
    if(k==="⌫")code=code.slice(0,-1);
    else if(k==="?"){$("hint").textContent=CFG.hint;return}
    else if(code.length<4)code+=k;
    draw();
    if(code.length===4)setTimeout(check,200);
  };
  $("pad").appendChild(b);
});
function draw(){[].forEach.call($("dots").children,function(d,i){d.className=i<code.length?"f":""})}
function check(){
  if(code===CFG.passcode){show(2);confetti(60)}
  else{var d=$("s1");d.classList.add("shake");$("hint").textContent="Not quite. Tap ? for a hint.";setTimeout(function(){d.classList.remove("shake")},400);code="";draw()}
}

/* Ask: the No button dodges */
var tries=0,faces=["😄","🙈","😅","😂"];
function dodge(e){
  if(e&&e.preventDefault)e.preventDefault();
  tries++;
  var b=$("no"),r=b.parentNode.getBoundingClientRect();
  b.style.position="absolute";
  b.style.left=Math.max(0,Math.random()*(r.width-90))+"px";
  b.style.top=(Math.random()*160-80)+"px";
  $("face").textContent=faces[Math.min(tries,3)];
  $("askP").textContent=["Are you sure you want to see it?","Wrong button, try again.","That one is broken. Press Yes.","Okay, okay… it’s a good one, promise."][Math.min(tries,3)];
}
$("no").addEventListener("mouseenter",dodge);
$("no").addEventListener("touchstart",dodge,{passive:false});
$("no").onclick=dodge;
$("yes").onclick=function(){buildMem();show(3);confetti(40)};

/* Memories */
function buildMem(){
  var t=$("track");t.innerHTML="";
  CFG.memories.forEach(function(m,i){addPol(m,null,i)});
}
function addPol(m,src,i){
  var p=document.createElement("div");p.className="pol";p.style.setProperty("--r",((i%2?1:-1)*(1+(i%3)))+"deg");
  p.innerHTML='<div class="ph">'+(src?'<img alt="">':m.e)+'</div><b></b><small></small>';
  if(src)p.querySelector("img").src=src;
  p.querySelector("b").textContent=m.t;p.querySelector("small").textContent=m.d;
  $("track").appendChild(p);
}
$("addph").onclick=function(){$("file").click()};
$("file").onchange=function(e){
  [].forEach.call(e.target.files,function(f,i){
    var r=new FileReader();
    r.onload=function(){addPol({t:"A memory with you",d:""},r.result,$("track").children.length+i)};
    r.readAsDataURL(f);
  });
};
$("toMsg").onclick=function(){
  $("hb").textContent="Happy birthday, "+CFG.name+"!";
  $("msg").innerHTML="";
  CFG.message.forEach(function(l){var p=document.createElement("p");p.textContent=l;$("msg").appendChild(p)});
  show(4);confetti(120);
};

/* Cake */
var QS=["Friends like you make even ordinary days feel like a party.","A best friend is the sibling life forgot to give me.","Tum ho toh sab mast hai. 😄","With you, even silly moments become my favourite memories.","Friends are the family we choose, and I’m so glad I chose you.","You’re the kind of friend everyone wishes for, and I’m lucky I got you."],qi=0;
function nextQ(){$("qc").textContent=QS[qi%QS.length];qi++}
$("start").onclick=function(){show(1);confetti(30)};
$("toCake").onclick=function(){nextQ();show(6)};
$("nq").onclick=nextQ;
$("toWish").onclick=function(){buildCake();show(5)};
function buildCake(){
  var c=$("cake");[].slice.call(c.querySelectorAll(".cd")).forEach(function(x){x.remove()});
  $("done").style.display=$("again").style.display=$("toNote").style.display="none";$("wishP").style.display="";
  [-30,-10,10,30].forEach(function(x){
    var d=document.createElement("div");d.className="cd";d.style.left="calc(50% + "+x+"px)";
    d.setAttribute("role","button");d.setAttribute("aria-label","Candle");d.tabIndex=0;
    function out(){d.classList.add("out");if(!c.querySelector(".cd:not(.out)")){$("done").style.display=$("again").style.display=$("toNote").style.display="";$("wishP").style.display="none";confetti(200)}}
    d.onclick=out;d.onkeydown=function(e){if(e.key==="Enter"||e.key===" ")out()};
    c.appendChild(d);
  });
}
$("toNote").onclick=function(){show(7)};
$("ans1").onclick=function(){$("note").textContent="Thank you, sach me. 🥹 Chalo phir, ab baat karte hain.";$("note2").style.display=$("ansRow").style.display="none";confetti(220)};
$("ans2").onclick=function(){$("note").textContent="Bilkul, koi jaldi nahi hai. Tum apna time lo, hum pehle jaise best friends hi rahenge. 🤍";$("note2").style.display=$("ansRow").style.display="none"};
$("again").onclick=function(){code="";draw();$("no").style.position="";tries=0;show(0)};

/* Confetti */
var cv=$("cv"),cx=cv.getContext("2d"),ps=[],run=false;
function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener("resize",size);
function confetti(n){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var cols=["#ff5d8f","#b78cff","#ffc83d","#6fd6ff","#7be0a0"];
  for(var i=0;i<n;i++)ps.push({x:Math.random()*cv.width,y:-10-Math.random()*cv.height*.3,vx:Math.random()*2-1,vy:2+Math.random()*3,s:5+Math.random()*6,c:cols[i%5],r:Math.random()*6});
  if(!run){run=true;tick()}
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  ps=ps.filter(function(p){p.x+=p.vx;p.y+=p.vy;p.r+=.1;return p.y<cv.height+20});
  ps.forEach(function(p){cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
  if(ps.length)requestAnimationFrame(tick);else run=false;
}
