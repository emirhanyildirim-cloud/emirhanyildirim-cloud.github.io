(() => {
  const body = document.body;
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.classList.toggle('open');
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false');
    }));
  }
  window.addEventListener('pointermove', e => {
    body.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
    body.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
  }, {passive:true});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('visible'));
  else { const io = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('visible'); io.unobserve(entry.target);}}), {threshold:.12}); reveals.forEach(el => io.observe(el)); }
  const tabs=[...document.querySelectorAll('.tool-tab')], panels=[...document.querySelectorAll('.tool-panel')];
  tabs.forEach(tab => tab.addEventListener('click',()=>{tabs.forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});panels.forEach(p=>p.classList.remove('active'));tab.classList.add('active');tab.setAttribute('aria-selected','true');document.getElementById(tab.dataset.target)?.classList.add('active')}));
  const counters=[...document.querySelectorAll('[data-count]')];
  if (!reduced && 'IntersectionObserver' in window) {const cio=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,end=Number(el.dataset.count),decimals=Number(el.dataset.decimals||0),suffix=el.dataset.suffix||'',start=performance.now(),duration=950;const run=now=>{const p=Math.min(1,(now-start)/duration),eased=1-Math.pow(1-p,3);el.textContent=(end*eased).toFixed(decimals).replace('.',',')+suffix;if(p<1)requestAnimationFrame(run)};requestAnimationFrame(run);cio.unobserve(el)}),{threshold:.7});counters.forEach(el=>cio.observe(el));}
  // 3D ecosystem canvas — native canvas, GitHub Pages safe
  const canvas=document.getElementById('ecosystemCanvas');
  if(canvas && window.ECOSYSTEM){
    const ctx=canvas.getContext('2d'); let rx=-0.22, ry=0.42, targetX=rx,targetY=ry,drag=false,lastX=0,lastY=0,hover=-1;
    const nodes=window.ECOSYSTEM.map((s,i)=>{const a=(i/window.ECOSYSTEM.length)*Math.PI*2;const band=(i%3)-1;return {...s,x:Math.cos(a)*(1.25+.15*band),y:band*.48+Math.sin(a*2)*.12,z:Math.sin(a)*(1.25+.15*band)}});
    function resize(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0)}
    function rot(p){let x=p.x,y=p.y,z=p.z;let cy=Math.cos(ry),sy=Math.sin(ry);[x,z]=[x*cy-z*sy,x*sy+z*cy];let cx=Math.cos(rx),sx=Math.sin(rx);[y,z]=[y*cx-z*sx,y*sx+z*cx];return {x,y,z}}
    let projected=[];
    function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);rx+=(targetX-rx)*.055;ry+=(targetY-ry)*.055;if(!drag&&!reduced)targetY+=.0017;const cx=w*.52,cy=h*.50,scale=Math.min(w,h)*.29;projected=nodes.map((n,i)=>{const p=rot(n),pers=1/(1.9-p.z*.42),x=cx+p.x*scale*pers,y=cy+p.y*scale*pers,s=(.45+pers*.42),alpha=.32+pers*.45;return {...n,px:x,py:y,pz:p.z,s,alpha,i}}).sort((a,b)=>a.pz-b.pz);
      ctx.strokeStyle='rgba(201,255,88,.13)';ctx.lineWidth=1;projected.forEach((p,i)=>{if(i%2===0){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.px,p.py);ctx.stroke()}});
      ctx.beginPath();ctx.arc(cx,cy,36,0,Math.PI*2);ctx.fillStyle='rgba(201,255,88,.98)';ctx.shadowBlur=36;ctx.shadowColor='rgba(201,255,88,.38)';ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#07100b';ctx.font='800 12px ui-monospace,monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('IC',cx,cy);
      projected.forEach(p=>{const r=5.3*p.s;ctx.beginPath();ctx.arc(p.px,p.py,r,0,Math.PI*2);ctx.fillStyle=p.i===hover?'#c9ff58':`rgba(241,244,239,${Math.min(.95,p.alpha)})`;ctx.fill();if(p.i===hover || p.pz>.78){ctx.font=`600 ${Math.max(9,11*p.s)}px ui-monospace,monospace`;ctx.textAlign='left';ctx.fillStyle=p.i===hover?'#c9ff58':`rgba(241,244,239,${Math.min(.72,p.alpha)})`;ctx.fillText(p.name,p.px+r+6,p.py)}});
      requestAnimationFrame(draw)}
    function hit(e){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=-1,dist=22;projected.forEach(p=>{const d=Math.hypot(x-p.px,y-p.py);if(d<dist){dist=d;best=p.i}});hover=best;canvas.style.cursor=best>=0?'pointer':(drag?'grabbing':'grab');return best}
    canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(drag){targetY+=(e.clientX-lastX)*.006;targetX+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY}else{const r=canvas.getBoundingClientRect();targetY=(e.clientX-r.left-r.width/2)/r.width*.7;targetX=(e.clientY-r.top-r.height/2)/r.height*-.4;hit(e)}});canvas.addEventListener('pointerup',e=>{drag=false;canvas.releasePointerCapture?.(e.pointerId);hit(e)});canvas.addEventListener('click',e=>{if(drag)return;const i=hit(e);if(i>=0)window.open(window.ECOSYSTEM[i].url,'_blank','noopener')});canvas.addEventListener('pointerleave',()=>{hover=-1;drag=false});window.addEventListener('resize',resize);resize();draw();
  }
  // Research Library
  const list=document.getElementById('libraryList');
  if(list && window.RESEARCH_OUTPUTS){
    const data=window.RESEARCH_OUTPUTS;const search=document.getElementById('librarySearch'),buttons=[...document.querySelectorAll('.filter-btn')],count=document.getElementById('visibleCount'),empty=document.getElementById('libraryEmpty');let filter='all';
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function row(x,idx){const doi=x.zenodoStatus==='public'&&x.doi?`<a href="${x.doiUrl}" target="_blank" rel="noopener">DOI ${esc(x.doi)} ↗</a><span class="zenodo-status public-status">Public · Zenodo</span>`:`<span class="private-status">Private / not publicly listed on Zenodo</span>`;const fam=x.family?`<span class="output-family">${esc(x.family)}</span>`:'';return `<article class="output-row" data-cat="${esc(x.category)}" data-search="${esc((x.title+' '+x.detail+' '+(x.doi||'')+' '+(x.family||'')).toLowerCase())}"><div class="output-num">${String(idx+1).padStart(3,'0')}</div><div class="output-main"><small>${esc(x.type)} · ${esc(x.year)}</small><h3>${esc(x.title)}</h3><p>${esc(x.detail)}</p></div><div class="output-meta">${doi}${fam}</div></article>`}
    list.innerHTML=data.map(row).join('');
    const rows=[...list.querySelectorAll('.output-row')];
    function apply(){const q=(search?.value||'').trim().toLowerCase();let n=0;rows.forEach(r=>{const ok=(filter==='all'||r.dataset.cat===filter)&&(!q||r.dataset.search.includes(q));r.classList.toggle('hidden',!ok);if(ok)n++});count.textContent=n;empty.style.display=n?'none':'block'}
    buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;apply()}));search?.addEventListener('input',apply);
    const q=new URLSearchParams(location.search).get('q');if(q&&search){search.value=q;apply()}
  }
})();