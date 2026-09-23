
(()=>{
 const data=window.RESEARCH_OUTPUTS||[];
 const list=document.querySelector('#outputList'); if(!list) return;
 const q=document.querySelector('#outputSearch'); const buttons=[...document.querySelectorAll('[data-filter]')];
 let filter='all';
 function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function card(o){const tag=o.category==='peer'?'Submitted / review':o.category==='current'?'Current':o.category==='books'?'Monograph':o.category==='conferences'?'Conference':o.category==='disclosures'?(o.family||'Disclosure'):'Historical corpus';return `<article class="output-item" data-cat="${o.category}" data-text="${esc((o.title+' '+o.detail+' '+(o.doi||'')).toLowerCase())}"><div class="output-index">${esc(tag)}<br>#${o.number}</div><div><h3>${esc(o.title)}</h3><p>${esc(o.detail)}</p></div><div class="output-actions">${o.doi?`<a href="${o.doiUrl}" target="_blank" rel="noopener">${esc(o.doi)} ↗</a>`:`<span class="no-doi">DOI not listed in current CV</span>`}</div></article>`}
 list.innerHTML=data.map(card).join('');
 function apply(){const term=(q.value||'').trim().toLowerCase();[...list.children].forEach(el=>{const okF=filter==='all'||el.dataset.cat===filter; const okQ=!term||el.dataset.text.includes(term);el.classList.toggle('hidden',!(okF&&okQ))}); const visible=[...list.children].filter(x=>!x.classList.contains('hidden')).length;document.querySelector('#visibleCount').textContent=visible}
 q.addEventListener('input',apply);buttons.forEach(b=>b.onclick=()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;apply()});apply();
})();
