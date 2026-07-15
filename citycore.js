/* ======================================================================
   citycore.js — shared "Growing Skyline" progress system
   Tracks correct answers across every page (localStorage, per-browser)
   and powers the skyline visual on index.html + the badge on every page.
   ====================================================================== */
window.CityProgress = (function(){
  const KEY = 'sc_cityquest_correct_v1';

  function get(){
    const v = parseInt(localStorage.getItem(KEY) || '0', 10);
    return isNaN(v) ? 0 : v;
  }
  function add(n){
    n = n || 1;
    const val = get() + n;
    localStorage.setItem(KEY, String(val));
    document.dispatchEvent(new CustomEvent('cityprogress:update', {detail:{total: val}}));
    return val;
  }
  function reset(){
    localStorage.setItem(KEY, '0');
    document.dispatchEvent(new CustomEvent('cityprogress:update', {detail:{total: 0}}));
  }
  return {get, add, reset, KEY};
})();

/* ---------- Milestones shown in messages / tooltips ---------- */
window.CityMilestones = [
  {at:0,  msg:"Empty plot of land — answer questions correctly to start building!"},
  {at:5,  msg:"🌱 Foundations laid — the site has been cleared."},
  {at:10, msg:"🏗️ First building under construction!"},
  {at:20, msg:"🏘️ A small neighbourhood is taking shape."},
  {at:30, msg:"🌳 A park has been added for the community."},
  {at:40, msg:"🏢 Your first skyscraper is rising!"},
  {at:55, msg:"🚌 Public transport links have been added."},
  {at:70, msg:"☀️ Solar panels installed — going green!"},
  {at:85, msg:"🏥 A hospital now serves your growing population."},
  {at:100,msg:"🎓 A university opens its doors."},
  {at:115,msg:"💧 Water treatment ponds keep your reservoir clean."},
  {at:130,msg:"🌆 The skyline is almost complete!"},
  {at:150,msg:"🏆 Sustainable Megacity complete! Incredible work."}
];

/* ---------- Small live badge injected into the header of every page ---------- */
function initCityBadge(){
  if(document.getElementById('cityProgressBadge')) return;
  const header = document.querySelector('header');
  if(!header) return;
  const badge = document.createElement('a');
  badge.id = 'cityProgressBadge';
  badge.href = 'index.html#skyline';
  badge.style.cssText = 'position:absolute; top:14px; right:14px; z-index:5; background:#fff; color:#123047; ' +
    'font-family:Fredoka,sans-serif; font-weight:600; font-size:0.72rem; padding:7px 12px; border-radius:999px; ' +
    'box-shadow:0 4px 0 rgba(18,48,71,0.15); text-decoration:none; display:flex; align-items:center; gap:5px;';
  badge.innerHTML = '<span style="font-size:0.95rem;">🏗️</span><span id="cityProgressBadgeCount">0</span>';
  header.style.position = header.style.position || 'relative';
  header.appendChild(badge);
  updateBadge();
  document.addEventListener('cityprogress:update', updateBadge);
}
function updateBadge(){
  const el = document.getElementById('cityProgressBadgeCount');
  if(el) el.textContent = window.CityProgress.get();
}
document.addEventListener('DOMContentLoaded', initCityBadge);
