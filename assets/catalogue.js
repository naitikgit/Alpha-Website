(()=>{
const grid=document.querySelector('[data-catalogue-grid]');
if(!grid)return;
const search=document.querySelector('[data-catalogue-search]');
const brand=document.querySelector('[data-catalogue-brand]');
const type=document.querySelector('[data-catalogue-type]');
const result=document.querySelector('[data-catalogue-result]');
const empty=document.querySelector('[data-catalogue-empty]');
const reset=document.querySelector('[data-catalogue-reset]');
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const placeholder='<div class="catalogue-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16.5 5 10l2-2h10l2 2 2 6.5v2H3z"/><path d="M5 16h14M7 8l1-3h8l1 3M6 18.5h2m8 0h2"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/></svg><span>Photo not supplied</span></div>';
function fillSelect(select,values,allText){
 for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value;select.append(option)}
}
function card(product){
 const image=product.image?`<img src="${esc(product.image)}" alt="${esc(product.title)}" loading="lazy" decoding="async">`:placeholder;
 const message=encodeURIComponent(`Hi Alpha Automation, I’m interested in ${product.code} — ${product.title}. Please share pricing, availability and fitment details.`);
 const wa=`https://wa.me/919920009010?text=${message}`;
 return `<article class="product-card catalogue-card"><div class="catalogue-image">${image}<span class="catalogue-code">${esc(product.code)}</span><span class="catalogue-category">${esc(product.category)}</span></div><div class="catalogue-card-body"><div class="catalogue-card-meta">${esc(product.group)}</div><h3>${esc(product.title)}</h3>${product.detail?`<p>${esc(product.detail)}</p>`:''}<div class="catalogue-card-foot"><span>Price on enquiry</span><a href="${wa}" target="_blank" rel="noopener noreferrer">Ask about this <span class="sr-only">${esc(product.title)}</span>${arrow}</a></div></div></article>`;
}
function update(products){
 const query=(search.value||'').trim().toLocaleLowerCase();
 const selectedBrand=brand.value,selectedType=type.value;
 const visible=products.filter(item=>(selectedBrand==='all'||item.group===selectedBrand)&&(selectedType==='all'||item.category===selectedType)&&(!query||`${item.code} ${item.group} ${item.category} ${item.title} ${item.detail}`.toLocaleLowerCase().includes(query)));
 grid.innerHTML=visible.map(card).join('');
 empty.hidden=visible.length!==0;
 result.textContent=visible.length===products.length?`Showing all ${products.length} products`:`Showing ${visible.length} of ${products.length} products`;
}
fetch('assets/catalogue-products.json').then(response=>{if(!response.ok)throw new Error('Catalogue data unavailable');return response.json()}).then(products=>{
 const groups=[...new Set(products.map(item=>item.group))].sort((a,b)=>a.localeCompare(b));
 const types=[...new Set(products.map(item=>item.category))].sort((a,b)=>a.localeCompare(b));
 fillSelect(brand,groups);fillSelect(type,types);update(products);
 search.addEventListener('input',()=>update(products));brand.addEventListener('change',()=>update(products));type.addEventListener('change',()=>update(products));
 reset.addEventListener('click',()=>{search.value='';brand.value='all';type.value='all';update(products);search.focus()});
}).catch(()=>{result.textContent='The catalogue could not be loaded. Please refresh the page.';grid.innerHTML='';});
})();
