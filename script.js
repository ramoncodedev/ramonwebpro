(function () {
  'use strict';
  var root = document.documentElement, body = document.body;
  var header = document.querySelector('.header');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  /* ---------- Preloader com contador ---------- */
  var loader = document.getElementById('loader');
  function finishLoader() {
    if (!loader) return;
    loader.classList.add('is-done');
    try { sessionStorage.setItem('rm-loaded', '1'); } catch (e) {}
    setTimeout(function () { loader.style.display = 'none'; }, 900);
  }
  if (loader && !root.classList.contains('no-loader')) {
    var n = document.getElementById('loaderN'), bar = document.getElementById('loaderBar');
    var start = null, dur = 450;
    (function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      n.textContent = Math.round(p * 100);
      bar.style.width = (p * 100) + '%';
      if (p < 1) requestAnimationFrame(tick); else finishLoader();
    })(performance.now());
    setTimeout(finishLoader, 1500); // segurança
  }

  /* ---------- Header ---------- */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu em tela cheia ---------- */
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.classList.toggle('is-locked', open);
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Idioma BR | EN ---------- */
  var i18n = document.querySelectorAll('[data-en]');
  i18n.forEach(function (el) { el._pt = el.innerHTML; });
  var meta = {
    pt: { title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content },
    en: { title: 'Website Development & SEO in Eunápolis, Brazil | Ramon · RM SITES',
          desc: 'Ramon builds strategic, professional websites in HTML, CSS and JS with SEO to help your business get found on Google. Based in Eunápolis, Bahia, serving all of Brazil.' }
  };
  function setLang(l) {
    i18n.forEach(function (el) { el.innerHTML = l === 'en' ? el.getAttribute('data-en') : el._pt; });
    root.lang = l === 'en' ? 'en' : 'pt-BR';
    document.title = meta[l].title;
    var d = document.querySelector('meta[name="description"]'); if (d && meta[l].desc) d.content = meta[l].desc;
    document.querySelectorAll('.lang button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === l;
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('rm-lang', l); } catch (e) {}
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try { if (localStorage.getItem('rm-lang') === 'en') setLang('en'); } catch (e) {}

  /* ---------- Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- Prévias dos projetos ---------- */
  function scaleScreens() {
    document.querySelectorAll('.screen').forEach(function (s) {
      var f = s.querySelector('iframe'); if (f) f.style.setProperty('--s', (s.clientWidth / 1280).toFixed(4));
    });
  }
  scaleScreens(); window.addEventListener('resize', scaleScreens);
  var frames = document.querySelectorAll('iframe[data-src]');
  function loadFrame(f) {
    f.addEventListener('load', function () { f.classList.add('is-ready'); });
    f.src = f.getAttribute('data-src'); f.removeAttribute('data-src');
  }
  if ('IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { loadFrame(en.target); fo.unobserve(en.target); } });
    }, { rootMargin: '300px 0px' });
    frames.forEach(function (f) { fo.observe(f); });
  } else { frames.forEach(loadFrame); }

  var ano = document.getElementById('ano'); if (ano) ano.textContent = new Date().getFullYear();
})();

/* texto imersivo: palavras acendem conforme a rolagem */
(function(){
  var t=document.querySelector('.scrolltxt'); if(!t) return;
  var render=function(){ t.querySelectorAll('.w').forEach(function(w){w.classList.add('on')}); };
  var walk=function(node,out){node.childNodes.forEach(function(n){
    if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(function(p){ if(!p) return; if(/^\s+$/.test(p)){out.appendChild(document.createTextNode(' '));} else {var s=document.createElement('span');s.className='w';s.textContent=p;out.appendChild(s);} });}
    else{out.appendChild(n.cloneNode(true));} });};
  var split=function(){ var out=document.createElement('span'); out.setAttribute('aria-label',t.textContent); walk(t,out); t.innerHTML=''; t.appendChild(out); Array.prototype.forEach.call(t.querySelectorAll('.w'),function(w){w.setAttribute('aria-hidden','true')}); };
  split(); t.querySelectorAll('.w').forEach(function(w){ if(w.textContent.indexOf('claro')===0) w.classList.add('hl'); });
  var ws=t.querySelectorAll('.w'), last=['claro'];
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){render();return;}
  var upd=function(){ var r=t.getBoundingClientRect(),vh=innerHeight; var p=(vh*0.85-r.top)/(r.height+vh*0.35); p=Math.max(0,Math.min(1,p)); var n=Math.round(p*ws.length); ws.forEach(function(w,i){w.classList.toggle('on',i<n)}); };
  addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd); upd();
})();

/* simulador comum x RM SITES */
(function(){
  var sim=document.getElementById('sim'); if(!sim) return;
  var en=function(){return document.documentElement.lang==='en'};
  var D={slow:{n:52,c:'#ff9f1a',acc:97,bp:96,seo:100,
      pt:['Demora para carregar no celular','Visitante confuso, sem saber o que fazer','Pouco preparado para gerar contatos'],
      en:['Slow to load on mobile','Confused visitor, unsure what to do','Not built to generate leads']},
    fast:{n:97,c:'#2A9BE2',acc:98,bp:100,seo:100,
      pt:['Carrega em instantes, até no 4G','Mensagem clara logo na primeira tela','Botão de WhatsApp sempre à vista, pronto para vender'],
      en:['Loads instantly, even on 4G','Clear message on the first screen','WhatsApp button always in view, ready to sell']}};
  var fg=document.getElementById('gfg'),num=document.getElementById('gnum'),list=document.getElementById('slist'),pill=sim.querySelector('.sim__pill'),tabs=sim.querySelectorAll('[role=tab]');
  var cur=0,raf;
  var count=function(to){cancelAnimationFrame(raf);var from=cur,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1100);cur=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));num.textContent=cur;if(p<1)raf=requestAnimationFrame(f);})(t0);};
  var minis=sim.querySelectorAll('.sim__mini i');
  var apply=function(m){var d=D[m];sim.dataset.mode=m;sim.style.setProperty('--c',d.c);fg.style.strokeDashoffset=100-d.n;count(d.n);
    minis[0].textContent=d.acc;minis[1].textContent=d.bp;minis[2].textContent=d.seo;
    list.innerHTML='';(en()?d.en:d.pt).forEach(function(s,i){var li=document.createElement('li');li.textContent=s;li.style.animationDelay=(i*.12+.15)+'s';list.appendChild(li);});
    tabs.forEach(function(b){b.setAttribute('aria-selected',b.dataset.m===m)});
    var b=sim.querySelector('[data-m='+m+']');pill.style.width=b.offsetWidth+'px';pill.style.transform='translateX('+(b.offsetLeft-5)+'px)';};
  tabs.forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.m)})});
  var started=false,seq=function(){apply('slow');setTimeout(function(){apply('fast')},2600);};
  if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!started){started=true;seq();o.disconnect();}},{threshold:.35}).observe(sim);}else{apply('fast');}
  addEventListener('resize',function(){var b=sim.querySelector('[aria-selected=true]');pill.style.width=b.offsetWidth+'px';pill.style.transform='translateX('+(b.offsetLeft-5)+'px)';});
})();

/* contadores */
(function(){
  var els=document.querySelectorAll('.stat b[data-to]'); if(!els.length) return;
  var run=function(b){var to=+b.dataset.to,suf=b.dataset.suf||'',pre=b.dataset.pre||'',t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1400);b.textContent=pre+Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f);})(t0);};
  if(!('IntersectionObserver' in window)){els.forEach(function(b){b.textContent=(b.dataset.pre||'')+b.dataset.to+(b.dataset.suf||'')});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);io.unobserve(e.target);}})},{threshold:.6});
  els.forEach(function(b){io.observe(b)});
})();

(function(){
var sec=document.querySelector('#processo');if(!sec)return;
var pin=sec.querySelector('.flow__pin'),grid=sec.querySelector('.flow__grid'),svg=sec.querySelector('.flow__svg'),track=svg.querySelector('.flow__track'),fill=svg.querySelector('.flow__fill'),st=[].slice.call(sec.querySelectorAll('.fs')),cnt=document.getElementById('fc');
var total=1,dist=[],mob=false,mq=matchMedia('(max-width:860px)');
function build(){
 mob=mq.matches;var g=grid.getBoundingClientRect(),W=g.width,H=g.height;
 svg.setAttribute('viewBox','0 0 '+W+' '+H);
 var c=st.map(function(s){var r=s.querySelector('.fs__n').getBoundingClientRect();return{x:r.left-g.left+r.width/2,y:r.top-g.top+r.height/2}});
 var d;
 if(mob){d='M'+c[0].x+' '+c[0].y+' V'+c[5].y;dist=c.map(function(p){return p.y-c[0].y});total=c[5].y-c[0].y}
 else{var r=(c[3].y-c[0].y)/2,xr=W-r;
  d='M'+c[0].x+' '+c[0].y+' H'+xr+' A'+r+' '+r+' 0 0 1 '+xr+' '+c[3].y+' H'+c[5].x;
  var a=xr-c[0].x,arc=Math.PI*r;
  dist=[0,c[1].x-c[0].x,c[2].x-c[0].x,a+arc+(xr-c[3].x),a+arc+(xr-c[4].x),a+arc+(xr-c[5].x)];total=dist[5]}
 track.setAttribute('d',d);fill.setAttribute('d',d);fill.style.strokeDasharray=total;
 upd();
}
function upd(){
 var vh=innerHeight,p;
 if(mob){var gr=grid.getBoundingClientRect();p=(vh*.62-gr.top)/gr.height}
 else{var pr=pin.getBoundingClientRect();p=-pr.top/(pr.height-vh)/.9}
 p=Math.max(0,Math.min(1,p));var L=p*total,cur=0;
 fill.style.strokeDashoffset=total-L;
 st.forEach(function(s,i){var on=L>=dist[i]-.5;s.classList.toggle('on',on);if(on)cur=i});
 st.forEach(function(s,i){s.classList.toggle('cur',i===cur&&!mob)});
 if(cnt)cnt.textContent='0'+(cur+1);
 sec.classList.toggle('done',p>=.995||mob);
}
addEventListener('scroll',upd,{passive:true});addEventListener('resize',build);addEventListener('load',build);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(build);
build();
})();

(function(){
var box=document.querySelector('.ecg');if(!box)return;
var svg=box.querySelector('svg'),tr=svg.querySelector('.ecg__track'),ha=svg.querySelector('.ecg__halo'),ln=svg.querySelector('.ecg__line'),dot=svg.querySelector('.ecg__dot'),ring=svg.querySelector('.ecg__ring'),cards=[].slice.call(document.querySelectorAll('.stmt .rs'));
var total=1,dist=[],wide=true;
function build(){
 var b=box.getBoundingClientRect(),W=b.width,H=b.height,m=H/2;wide=innerWidth>1100;
 svg.setAttribute('viewBox','0 0 '+W+' '+H);
 var cx=[];
 if(wide){var ol=document.querySelector('.stmt__cols').getBoundingClientRect();cards.forEach(function(c){var r=c.getBoundingClientRect();cx.push(r.left-b.left+r.width/2)})}
 else{var n=innerWidth>640?2:1;for(var i=0;i<(n===1?3:2);i++)cx.push(W*(i+.5)/(n===1?3:2))}
 var u=Math.min(1,W/900),d='M0 '+m;
 cx.forEach(function(x){
  d+=' L'+(x-70*u)+' '+m+' q'+(10*u)+' '+(-14*u)+' '+(22*u)+' 0 L'+(x-14*u)+' '+m+' L'+(x-4*u)+' '+(m+8*u)+' L'+x+' '+(m-H*.42)+' L'+(x+9*u)+' '+(m+H*.38)+' L'+(x+16*u)+' '+m+' q'+(14*u)+' '+(-20*u)+' '+(30*u)+' 0';
 });
 d+=' L'+W+' '+m;
 [tr,ha,ln].forEach(function(p){p.setAttribute('d',d)});
 total=ln.getTotalLength();[ha,ln].forEach(function(p){p.style.strokeDasharray=total});
 dist=[];if(wide){cards.forEach(function(c,i){var r=c.getBoundingClientRect(),x0=r.left-b.left+r.width*.12,L=0;while(L<total&&ln.getPointAtLength(L).x<x0)L+=3;dist.push(L)})}
 upd();
}
function upd(){
 var vh=innerHeight,r=box.getBoundingClientRect();
 var p=(vh*.9-r.top)/(vh*.55);p=Math.max(0,Math.min(1,p));
 var L=p*total;[ha,ln].forEach(function(e){e.style.strokeDashoffset=total-L});
 var pt=ln.getPointAtLength(L);dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);ring.setAttribute('cx',pt.x);ring.setAttribute('cy',pt.y);
 var cur=-1;
 cards.forEach(function(c,i){var on;if(wide)on=L>=dist[i];else on=c.getBoundingClientRect().top<vh*.8;c.classList.toggle('on',on);if(on)cur=i});
 cards.forEach(function(c,i){c.classList.toggle('cur',wide&&i===cur&&p<1)});
}
addEventListener('scroll',upd,{passive:true});addEventListener('resize',build);addEventListener('load',build);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(build);
build();
})();

(function(){
var rows=[].slice.call(document.querySelectorAll('.sv__row'));if(!rows.length)return;
var hov=matchMedia('(hover:hover) and (pointer:fine)');
function set(r,on){r.classList.toggle('open',on);r.querySelector('button').setAttribute('aria-expanded',on?'true':'false')}
function openOnly(r){rows.forEach(function(x){set(x,x===r)})}
rows.forEach(function(r){
 var b=r.querySelector('button');
 b.addEventListener('click',function(){if(hov.matches){openOnly(r)}else{var o=r.classList.contains('open');rows.forEach(function(x){set(x,false)});set(r,!o)}});
 r.addEventListener('mouseenter',function(){if(hov.matches)openOnly(r)});
});
})();

(function(){
var s=document.getElementById('diferencas');if(!s)return;
var opts=[].slice.call(s.querySelectorAll('.cmp__opt')),touched=false;
function set(m){s.dataset.mode=m;opts.forEach(function(o){o.setAttribute('aria-pressed',o.dataset.mode===m?'true':'false')})}
opts.forEach(function(o){o.addEventListener('click',function(){touched=true;set(o.dataset.mode)});o.addEventListener('mouseenter',function(){if(matchMedia('(hover:hover)').matches){touched=true;set(o.dataset.mode)}})});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){setTimeout(function(){if(!touched)set('custom')},1500);io.disconnect()}})},{threshold:.55});io.observe(s.querySelector('.cmp__win'))}else set('custom');
})();

/* ===== modal de cases ===== */
(function(){
var cards=[].slice.call(document.querySelectorAll('.pc a[data-case]'));if(!cards.length)return;
var D={
vagalume:{pt:{seg:'Produtora audiovisual · Casamentos de luxo',d:'Mostrar o nível do trabalho logo de cara e fazer casais de outras cidades confiarem na produtora antes do primeiro contato.',a:'Casais que planejam casamentos à beira-mar em destinos como Trancoso, Arraial d\'Ajuda e Caraíva, de todo o Brasil.',p:['Abertura cinematográfica que apresenta o estilo dos filmes','Animações suaves que acompanham o ritmo da leitura','SEO e blog para ser encontrada nos destinos de casamento','Contato direto por WhatsApp em qualquer ponto da página'],t:['Design sob medida','Animações','SEO','Blog','Mobile']},
 en:{seg:'Audiovisual production · Luxury weddings',d:'Show the quality of the work right away and make couples from other cities trust the studio before the first contact.',a:'Couples planning seaside weddings in destinations such as Trancoso, Arraial d\'Ajuda and Caraíva, from all over Brazil.',p:['A cinematic opening that presents the style of the films','Smooth animations that follow the reading rhythm','SEO and blog to be found in wedding destinations','Direct WhatsApp contact from anywhere on the page'],t:['Custom design','Animations','SEO','Blog','Mobile']}},
construforte:{pt:{seg:'Construtora · Trancoso',d:'Site com pouco conteúdo e baixa performance, enquanto a empresa dependia de anúncios para ser encontrada.',a:'Pessoas e empresas que querem construir ou reformar na região e pesquisam no Google antes de escolher.',p:['Estrutura clara de serviços e obras para transmitir segurança','Código leve e rápido, sem plataforma pronta','Blog para a construtora ser achada de forma orgânica, sem depender de anúncios','Contato sempre à vista'],t:['Redesign','SEO','Blog','Performance']},
 en:{seg:'Construction company · Trancoso',d:'A site with little content and low performance, while the company relied on ads to be found.',a:'People and companies who want to build or renovate in the region and search on Google before choosing.',p:['A clear structure of services and works to convey trust','Lightweight, fast code, no ready-made platform','A blog so the company is found organically, without depending on ads','Contact always in sight'],t:['Redesign','SEO','Blog','Performance']}},
silva:{pt:{seg:'Advocacia',d:'Transmitir confiança e profissionalismo para quem busca orientação jurídica e ainda não conhece a advogada.',a:'Pessoas que procuram um escritório de advocacia e comparam opções antes de entrar em contato.',p:['Visual limpo e premium, alinhado à identidade do escritório','Áreas de atuação e diferenciais explicados de forma simples','Etapas do atendimento claras para reduzir a insegurança','Botão para agendar consulta sempre acessível'],t:['Design sob medida','Copy','SEO','Mobile']},
 en:{seg:'Law firm',d:'Convey trust and professionalism to people seeking legal guidance who do not yet know the lawyer.',a:'People looking for a law firm and comparing options before getting in touch.',p:['A clean, premium look aligned with the firm\'s identity','Practice areas and strengths explained simply','Clear service steps to reduce uncertainty','A book-a-consultation button always within reach'],t:['Custom design','Copywriting','SEO','Mobile']}},
isadora:{pt:{seg:'Advocacia criminal e de família',d:'Unir acolhimento e autoridade para clientes que procuram ajuda em momentos delicados.',a:'Pessoas que precisam de defesa criminal ou de orientação em questões de família.',p:['Identidade visual da marca aplicada ao site, com a fonte Sora','Tom sóbrio e premium que passa segurança','Textos diretos e sem jargão para quem está em um momento difícil','Contato rápido e discreto por WhatsApp'],t:['Design sob medida','Identidade','Copy','Mobile']},
 en:{seg:'Criminal and family law',d:'Combine warmth and authority for clients seeking help in delicate moments.',a:'People who need criminal defense or guidance on family matters.',p:['The brand\'s visual identity applied to the site, with the Sora typeface','A sober, premium tone that conveys security','Direct, jargon-free copy for someone going through a hard time','Quick, discreet contact via WhatsApp'],t:['Custom design','Identity','Copywriting','Mobile']}},
odontoriso:{pt:{seg:'Clínica odontológica',d:'Apresentar a clínica de forma profissional e mostrar o cuidado com o paciente antes da primeira consulta.',a:'Pacientes da região que procuram uma clínica de confiança para cuidar do sorriso.',p:['Identidade visual e logo da clínica em todo o site','Design premium e acolhedor','Tratamentos apresentados de forma clara','Agendamento direto pelo WhatsApp'],t:['Design sob medida','Identidade','SEO','Mobile']},
 en:{seg:'Dental clinic',d:'Present the clinic professionally and show care for the patient before the first appointment.',a:'Local patients looking for a trusted clinic to care for their smile.',p:['The clinic\'s visual identity and logo throughout the site','A premium, welcoming design','Treatments presented clearly','Direct booking via WhatsApp'],t:['Custom design','Identity','SEO','Mobile']}}
};
var L={pt:{kick:'Case · 2026',d:'O desafio',a:'Público',p:'O que foi pensado',t:'Entregas',visit:'Ver site no ar',quote:'Quero um site assim',close:'Fechar',prev:'Projeto anterior',next:'Próximo projeto'},
 en:{kick:'Case · 2026',d:'The challenge',a:'Audience',p:'What was designed',t:'Delivered',visit:'Visit live site',quote:'I want a site like this',close:'Close',prev:'Previous project',next:'Next project'}};
var m=document.createElement('div');m.className='cm';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-hidden','true');
m.innerHTML='<div class="cm__dlg"><button type="button" class="cm__x" aria-label="Fechar">✕</button><div class="cm__stage"><div class="cm__frame"><div class="cm__bar"><span class="cm__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="cm__url"></span></div><div class="cm__shot"></div></div><div class="cm__nav"><button type="button" data-d="-1" aria-label="Projeto anterior">←</button><span></span><button type="button" data-d="1" aria-label="Próximo projeto">→</button></div></div><div class="cm__side"><p class="kicker"></p><h3 class="cm__title" id="cmT"></h3><p class="cm__seg"></p><div class="cm__blk" data-k="d"><h4></h4><p></p></div><div class="cm__blk" data-k="a"><h4></h4><p></p></div><div class="cm__blk" data-k="p"><h4></h4><ul></ul></div><div class="cm__blk" data-k="t"><h4></h4><div class="cm__chips"></div></div><div class="cm__act"><a class="pill pill--w cm__quote" target="_blank" rel="noopener"><span></span><i aria-hidden="true">↗</i></a></div></div></div>';
m.setAttribute('aria-labelledby','cmT');document.body.appendChild(m);
var $=function(s){return m.querySelector(s)},cur=0,last=null;
function lang(){return document.documentElement.lang==='en'?'en':'pt'}
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function fill(i){
 cur=(i+cards.length)%cards.length;var a=cards[cur],k=a.dataset.case,c=D[k][lang()],l=L[lang()];
 var name=a.querySelector('h3').textContent,media=a.querySelector('.pc__media'),img=media.querySelector('img'),href=a.getAttribute('href');
 m.querySelector('.cm__stage').style.setProperty('--bg',media.style.getPropertyValue('--bg')||'#111');
 var shot=$('.cm__shot');shot.innerHTML='';
 if(img){var im=new Image();im.src=img.src;im.alt=img.alt;im.className='cm__poster';shot.appendChild(im)}
 var f=document.createElement('iframe');f.src=href;f.title=name;f.setAttribute('loading','eager');shot.appendChild(f);
 var sc=function(){var s=shot.clientWidth/1280;f.style.transform='scale('+s+')';f.style.height=(shot.clientHeight/s)+'px'};sc();setTimeout(sc,60);setTimeout(sc,400);
 f.addEventListener('load',function(){f.classList.add('is-on')});
 var hint=document.createElement('span');hint.className='cm__hint';hint.textContent=lang()==='en'?'Scroll to explore':'Role para explorar';shot.appendChild(hint);
 var hide=function(){hint.classList.add('is-off')};shot.addEventListener('wheel',hide,{once:true,passive:true});shot.addEventListener('touchstart',hide,{once:true,passive:true});setTimeout(hide,5000);
 $('.cm__side .kicker').textContent=l.kick;$('.cm__title').textContent=name;$('.cm__seg').textContent=c.seg;
 [['d',c.d],['a',c.a]].forEach(function(x){var b=m.querySelector('[data-k="'+x[0]+'"]');b.querySelector('h4').textContent=l[x[0]];b.querySelector('p').textContent=x[1]});
 var bp=m.querySelector('[data-k="p"]');bp.querySelector('h4').textContent=l.p;bp.querySelector('ul').innerHTML=c.p.map(function(t){return'<li>'+esc(t)+'</li>'}).join('');
 var bt=m.querySelector('[data-k="t"]');bt.querySelector('h4').textContent=l.t;bt.querySelector('.cm__chips').innerHTML=c.t.map(function(t){return'<span>'+esc(t)+'</span>'}).join('');
 var q=$('.cm__quote');q.querySelector('span').textContent=l.quote;q.href='https://wa.me/5573981598854?text='+encodeURIComponent((lang()==='en'?'Hi Ramon! I saw the '+name+' project and want a site like this.':'Olá Ramon! Vi o projeto '+name+' e quero um site assim.'));
 $('.cm__x').setAttribute('aria-label',l.close);m.querySelectorAll('.cm__nav button')[0].setAttribute('aria-label',l.prev);m.querySelectorAll('.cm__nav button')[1].setAttribute('aria-label',l.next);
 $('.cm__nav span').textContent=(cur+1)+' / '+cards.length;$('.cm__side').scrollTop=0;
}
function open(i,from){last=from;fill(i);m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('is-locked');setTimeout(function(){$('.cm__x').focus()},50)}
function close(){m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('is-locked');if(last)last.focus();setTimeout(function(){if(!m.classList.contains('is-open'))$('.cm__shot').innerHTML=''},400)}
cards.forEach(function(a,i){a.addEventListener('click',function(e){if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;e.preventDefault();open(i,a)})});
$('.cm__x').addEventListener('click',close);
m.addEventListener('click',function(e){if(e.target===m)close()});
m.querySelectorAll('.cm__nav button').forEach(function(b){b.addEventListener('click',function(){fill(cur+(+b.dataset.d))})});
document.addEventListener('keydown',function(e){if(!m.classList.contains('is-open'))return;
 if(e.key==='Escape')close();else if(e.key==='ArrowRight')fill(cur+1);else if(e.key==='ArrowLeft')fill(cur-1);
 else if(e.key==='Tab'){var f=[].slice.call(m.querySelectorAll('button,a[href]')).filter(function(x){return x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
addEventListener('resize',function(){var f=m.querySelector('.cm__shot iframe'),s0=m.querySelector('.cm__shot');if(f){var s=s0.clientWidth/1280;f.style.transform='scale('+s+')';f.style.height=(s0.clientHeight/s)+'px'}});
})();
