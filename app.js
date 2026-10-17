const productGroups = [
  {category:'green-boys', collection:'Green Boys 2005', color:'#a7cb82', folder:'green-boys', files:[...Array.from({length:18},(_,i)=>`${i+1}.jpg`),'new-1.jpg','new-2.jpg','new-3.jpg','new-4.jpg',...Array.from({length:8},(_,i)=>`oct-${i+1}.jpeg`)]},
  {category:'winners', collection:'Winners 2005', color:'#eb8997', folder:'winners', files:[...Array.from({length:17},(_,i)=>`${i+1}.jpg`),...Array.from({length:20},(_,i)=>`oct-${i+1}.${i<4?'jpg':'jpeg'}`)]},
  {category:'eagles', collection:'Eagles 2006', color:'#8ebbe3', folder:'eagles', files:[...Array.from({length:7},(_,i)=>`${i+1}.jpg`),'new-1.jpg','new-2.jpg','new-3.jpg',...Array.from({length:18},(_,i)=>`oct-${i+1}.jpeg`)]},
  {category:'designed', collection:'Designed Stickers', color:'#f3ad4a', folder:'designed', files:[...Array.from({length:12},(_,i)=>`${i+1}.jpg`),'new-1.jpg','new-2.jpg','new-3.jpg','new-4.jpg',...Array.from({length:9},(_,i)=>`oct-${i+1}.${i<3?'jpg':'jpeg'}`)]},
  {category:'anime', collection:'Anime World', color:'#b8a4d5', folder:'anime', files:Array.from({length:26},(_,i)=>`${i+5}-page-00001.jpg`)},
  {category:'moto', collection:'Moto Stickers', color:'#f7d84b', folder:'moto', files:Array.from({length:3},(_,i)=>`${i+1}.jpg`)}
];
const products = productGroups.flatMap(group => group.files.map((file,index) => ({
  id:`${group.category}-${index + 1}`, name:`${group.collection} — Model ${index + 1}`, category:group.category,
  collection:group.collection, price:15, color:group.color, icon:'✦', shape:'shape-round', image:`assets/images/products/${group.folder}/${file}`
}))).filter(product => product.image !== 'assets/images/products/anime/8-page-00001.jpg' || product.id === 'anime-4');
let cart = JSON.parse(localStorage.getItem('stickzone-cart') || '[]');
cart = cart.filter(item => products.some(product => product.id === item.id));
const productGrid = document.querySelector('#product-grid');
const currency = n => `${n} DH`;
function renderProducts(filter='all'){
  productGrid.innerHTML = products.filter(p=>filter==='all'||p.category===filter).map(p=>`<article class="product-card"><button class="product-visual view-product" data-image="${p.image}" data-name="${p.name}" aria-label="View ${p.name} full size" style="background:${p.color}">${p.image?`<img class="product-photo" src="${p.image}" alt="${p.name}">`:`<span class="product-sticker ${p.shape}">${p.icon}</span>`}</button><div class="product-info"><h3>${p.name}</h3><strong class="price">${currency(p.price)}</strong><p>${p.collection}</p><button class="add-product" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add to cart</button></div></article>`).join('');
}
function saveCart(){localStorage.setItem('stickzone-cart',JSON.stringify(cart));}
function getProduct(id){return products.find(p=>p.id===String(id));}
function cartTotal(){return cart.reduce((sum,i)=>sum + getProduct(i.id).price*i.qty,0);}
function deliveryFee(){return document.querySelector('#delivery-city')?.value === 'other' ? 25 : 10;}
function orderTotal(){return cartTotal()+deliveryFee();}
function renderCart(){
  const area=document.querySelector('.cart-items');
  area.innerHTML=cart.map(i=>{const p=getProduct(i.id);return `<div class="cart-item"><div class="cart-thumb" >${p.image?`<img src="${p.image}" alt="">`:p.icon}</div><div><h3>${p.name}</h3><p>${currency(p.price)}</p><div class="quantity"><button data-action="decrease" data-id="${p.id}">−</button><span>${i.qty}</span><button data-action="increase" data-id="${p.id}">+</button></div></div><button class="remove" data-action="remove" data-id="${p.id}">Remove</button></div>`}).join('');
  document.querySelectorAll('.cart-count').forEach(e=>e.textContent=cart.reduce((n,i)=>n+i.qty,0));
  document.querySelector('.subtotal').textContent=currency(cartTotal());
  document.querySelector('.delivery-price').textContent=currency(deliveryFee());
  document.querySelector('.cart-total').textContent=currency(orderTotal());
  document.querySelector('.checkout-price').textContent=currency(orderTotal());
}
function addToCart(id){const found=cart.find(i=>i.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart();renderCart();showToast('Added to your cart ✦');}
function changeQty(id,action){const i=cart.find(x=>x.id===id);if(action==='increase')i.qty++;if(action==='decrease')i.qty--;if(action==='remove'||i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function showToast(message){const t=document.querySelector('.toast');t.textContent=message;t.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.remove('show'),4500)}
function openCart(){document.querySelector('.cart-panel').classList.add('open');document.querySelector('.cart-panel').setAttribute('aria-hidden','false');document.querySelector('.overlay').classList.add('show')}
function closeCart(){document.querySelector('.cart-panel').classList.remove('open');document.querySelector('.cart-panel').setAttribute('aria-hidden','true');document.querySelector('.overlay').classList.remove('show')}
renderProducts();renderCart();document.querySelector('#year').textContent=new Date().getFullYear();
document.addEventListener('click',e=>{
  const add=e.target.closest('.add-product');if(add)addToCart(add.dataset.id);
  if(e.target.closest('.cart-trigger'))openCart();if(e.target.closest('.close-cart')||e.target.matches('.overlay'))closeCart();
  const action=e.target.dataset.action;if(action)changeQty(e.target.dataset.id,action);
  const filter=e.target.closest('.filter');if(filter){selectCategory(filter.dataset.filter)}
  const category=e.target.closest('.collection-card[data-category]');if(category){selectCategory(category.dataset.category)}
  const productView=e.target.closest('.view-product');if(productView){const viewer=document.querySelector('.image-viewer');const image=document.querySelector('#viewer-image');image.src=productView.dataset.image;image.alt=productView.dataset.name;viewer.showModal()}
  if(e.target.closest('[data-open-custom]'))document.querySelector('.custom-modal').showModal();
  if(e.target.closest('.checkout-button')){if(!cart.length){showToast('Your cart is waiting for a sticker.');return}document.querySelector('#checkout-city').value=document.querySelector('#delivery-city').value==='casa'?'Casablanca':'';closeCart();document.querySelector('.checkout-modal').showModal()}
  if(e.target.closest('.close-modal'))e.target.closest('dialog').close();
  if(e.target.closest('.close-viewer'))document.querySelector('.image-viewer').close();
  if(e.target.closest('.menu-toggle')){const n=document.querySelector('.main-nav');n.classList.toggle('open');e.target.setAttribute('aria-expanded',n.classList.contains('open'))}
  const navLink=e.target.closest('.main-nav a');if(navLink){const target=navLink.getAttribute('href');document.querySelector('.main-nav').classList.remove('open');if(target?.startsWith('#')){e.preventDefault();requestAnimationFrame(()=>document.querySelector(target)?.scrollIntoView({behavior:'smooth',block:'start'}))}}
});
document.querySelector('.image-viewer').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
function selectCategory(category){const labels={all:['ALL','MODELS.'],'green-boys':['GREEN BOYS','2005 MODELS.'],winners:['WINNERS','2005 MODELS.'],eagles:['EAGLES','2006 MODELS.'],designed:['DESIGNED','STICKERS.'],anime:['ANIME','MODELS.'],moto:['MOTO','MODELS.']};const [first,second]=labels[category];document.querySelector('#product-title').innerHTML=`${first}<br><em>${second}</em>`;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===category));renderProducts(category)}
document.querySelector('#design-file').addEventListener('change',e=>{const file=e.target.files[0];const label=document.querySelector('.upload-zone strong');if(file&&file.size>7*1024*1024){e.target.value='';label.textContent='Upload your design';showToast('Please choose a file smaller than 7 MB.');return}label.textContent=file?file.name:'Upload your design'});
document.querySelector('#delivery-city').addEventListener('change',renderCart);
document.querySelector('#checkout-city').addEventListener('input',event=>{const city=event.target.value.trim().toLowerCase();if(!city)return;document.querySelector('#delivery-city').value=city.includes('casa')?'casa':'other';renderCart()});
async function submitToNetlify(form){const fd=new FormData(form);const hasFile=[...form.querySelectorAll('input[type=file]')].some(i=>i.files.length);const opts=hasFile?{method:'POST',body:fd}:{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fd).toString()};const response=await fetch('/',opts);if(!response.ok)throw new Error('Form submission failed: '+response.status);}
function saveLocalOrder(order){const orders=JSON.parse(localStorage.getItem('stickzone-orders')||'[]');orders.push(order);localStorage.setItem('stickzone-orders',JSON.stringify(orders));}
document.querySelector('#custom-form').addEventListener('submit',async e=>{e.preventDefault();const form=e.target;const submitButton=form.querySelector('[type="submit"]');const data=new FormData(form);const file=document.querySelector('#design-file').files[0];submitButton.disabled=true;try{await submitToNetlify(form);const order={id:'CUSTOM-'+Date.now().toString().slice(-6),type:'Custom order',items:[{id:'Custom design',qty:1}],total:'On quote',customer:{fullName:data.get('name'),phone:data.get('phone'),city:'—',address:'—',location:'—',date:'To confirm',time:'To confirm',notes:data.get('notes'),fileName:file?.name||'No file attached'},createdAt:new Date().toISOString(),status:'Pending'};saveLocalOrder(order);e.target.closest('dialog').close();form.reset();document.querySelector('.upload-zone strong').textContent='Upload your design';showToast('Custom request sent to StickZone ✦')}catch(error){showToast('Could not send your request. Please try again.')}finally{submitButton.disabled=false}});
document.querySelector('#checkout-form').addEventListener('submit',async e=>{e.preventDefault();if(!cart.length){showToast('Your cart is empty.');return}const form=e.target;const submitButton=form.querySelector('[type="submit"]');const summary=cart.map(item=>{const product=getProduct(item.id);return `${item.qty} × ${product.name} (${currency(product.price*item.qty)})`}).join(' | ');document.querySelector('#order-summary').value=summary;document.querySelector('#products-total').value=currency(cartTotal());document.querySelector('#delivery-fee').value=currency(deliveryFee());document.querySelector('#order-total').value=currency(orderTotal());const customer=Object.fromEntries(new FormData(form));submitButton.disabled=true;try{await submitToNetlify(form);const order={id:'SZ-'+Date.now().toString().slice(-6),type:'Shop order',items:cart,total:orderTotal(),productsTotal:cartTotal(),delivery:deliveryFee(),customer,createdAt:new Date().toISOString(),status:'Pending'};saveLocalOrder(order);cart=[];saveCart();renderCart();e.target.closest('dialog').close();form.reset();showToast(`Order ${order.id} sent! Thank you ✦`)}catch(error){showToast('Could not send your order. Please try again.')}finally{submitButton.disabled=false}});
