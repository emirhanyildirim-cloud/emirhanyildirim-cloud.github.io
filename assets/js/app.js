
(()=>{
 const scene=document.querySelector('.scene');
 if(scene){
  const nodes=[...scene.querySelectorAll('.orbit-node')];
  const n=nodes.length;
  function place(t=0){
    nodes.forEach((el,i)=>{
      const a=(i/n)*Math.PI*2+t*0.00012;
      const ring=i%3; const rx=[210,270,310][ring], ry=[105,165,215][ring];
      const x=Math.cos(a)*rx, y=Math.sin(a)*ry, z=Math.sin(a*1.7+i)*140;
      const scale=.72+(z+140)/520;
      el.style.transform=`translate3d(${x}px,${y}px,${z}px) scale(${scale})`;
      el.style.zIndex=String(Math.round(z+200));
      el.style.opacity=String(.46+(z+140)/420);
    });
  }
  let mx=0,my=0; document.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)});
  let start=performance.now(); function tick(now){place(now-start);scene.style.transform=`rotateX(${(-my*8).toFixed(2)}deg) rotateY(${(mx*12).toFixed(2)}deg)`;requestAnimationFrame(tick)} requestAnimationFrame(tick);
 }
 const reveal=[...document.querySelectorAll('[data-reveal]')];
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target)}}),{threshold:.08});reveal.forEach(e=>io.observe(e))}
})();
