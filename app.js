// MJKart App — Vanilla JS
(function(){
  const state = {
    allProducts: [],
    filtered: [],
    categories: [
      "Smartphones","Laptops","Headphones","Cameras","Smartwatches",
      "Home Appliances","Mens Fashion","Womens Fashion","Books","Groceries"
    ],
    brandsByCategory: {
      "Smartphones": ["Mi","Samsung","OnePlus","Realme","Apple","Vivo","Oppo","Motorola"],
      "Laptops": ["HP","Dell","Lenovo","Asus","Acer","Apple","MSI","Samsung"],
      "Headphones": ["Sony","JBL","boAt","Sennheiser","OneOdio","Skullcandy","Apple","Boult"],
      "Cameras": ["Canon","Nikon","Sony","Fujifilm","Panasonic","GoPro","DJI","Leica"],
      "Smartwatches": ["Amazfit","Noise","boAt","Apple","Samsung","Fitbit","Fire-Boltt","Fastrack"],
      "Home Appliances": ["LG","Samsung","Whirlpool","Bosch","IFB","Philips","Panasonic","Prestige"],
      "Mens Fashion": ["Nike","Adidas","Puma","Levi's","Woodland","Allen Solly","H&M","U.S. Polo"],
      "Womens Fashion": ["Zara","H&M","Biba","Fabindia","AND","ONLY","Levi's","Forever 21"],
      "Books": ["Penguin","HarperCollins","Hachette","Rupa","Bloomsbury","Pearson","O'Reilly","McGraw Hill"],
      "Groceries": ["Aashirvaad","Fortune","Tata","Patanjali","Amul","Mother Dairy","Dabur","Haldiram"]
    },
    cart: JSON.parse(localStorage.getItem("mj_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("mj_wishlist") || "[]"),
    ui: {
      page: 1,
      perPage: 12,
      activeCategory: "All",
      minPrice: 0,
      maxPrice: 200000,
      rating: 0,
      brands: new Set(),
      sort: "relevance",
      query: ""
    }
  };

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Utils
  const fmt = n => "₹" + n.toLocaleString("en-IN");
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function randomBetween(min, max, seed) {
    const r = (Math.random() + (seed?seededRandom(seed):0)) / (seed?2:1);
    return Math.floor(min + r*(max-min));
  }

  // Build product list
  function buildProducts(){
    const products = [];
    let idCounter = 1000;

    for(const cat of state.categories){
      const brands = state.brandsByCategory[cat];
      for(let i=0;i<10;i++){
        const brand = brands[i % brands.length];
        const model = randomBetween(100,999) + (i%2?" Pro":" Plus");
        const name = `${brand} ${cat === "Books" ? "— " : ""}${cat.replace(/s$/, '')} ${model}`;
        const priceBase = {
          "Smartphones":[9999, 129999],
          "Laptops":[24999, 219999],
          "Headphones":[699, 29999],
          "Cameras":[9999, 239999],
          "Smartwatches":[999, 59999],
          "Home Appliances":[1499, 149999],
          "Mens Fashion":[399, 9999],
          "Womens Fashion":[399, 12999],
          "Books":[199, 2999],
          "Groceries":[49, 2999]
        }[cat];
        const price = randomBetween(priceBase[0], priceBase[1]);
        const mrp = Math.floor(price * randomBetween(110, 160)/100);
        const discountPct = Math.round((1 - price/mrp) * 100);
        const rating = Math.round((3.5 + Math.random()*1.5)*10)/10;
        const reviews = randomBetween(50, 4000);
        const stock = randomBetween(0, 50);
        const id = `P${idCounter++}`;

        const cleanCat = cat.replace(/\s+/g, '').toLowerCase();
        const img = `images/${cleanCat}${i+1}.jpg`;

        const desc = `Premium ${cat.toLowerCase()} by ${brand} with top-notch features. Model ${model}.`;
        products.push({
          id, name, brand, category: cat, price, mrp, discountPct, rating, reviews, stock, img, desc
        });
      }
    }
    return products;
  }

  // Build Brand checkboxes
  function buildBrands(allProducts){
    const set = new Set(allProducts.map(p=>p.brand));
    const brands = Array.from(set).sort();
    const list = $("#brandList");
    list.innerHTML = brands.map(b=>{
      const id = "brand_" + b.replace(/\W+/g,"");
      return `<label><input type="checkbox" value="${b}" id="${id}"> ${b}</label>`;
    }).join("");
    list.querySelectorAll("input[type=checkbox]").forEach(chk => {
      chk.addEventListener("change", () => {
        if(chk.checked) state.ui.brands.add(chk.value);
        else state.ui.brands.delete(chk.value);
        applyFilters();
      });
    });
  }

  // Category pills
  function buildCategories(){
    const bar = $("#categoryBar");
    const pills = [`<button class="cat-pill active" data-cat="All">All</button>`]
      .concat(state.categories.map(c=>`<button class="cat-pill" data-cat="${c}">${c}</button>`));
    bar.innerHTML = pills.join("");
    bar.querySelectorAll(".cat-pill").forEach(btn=>{
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".cat-pill").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        state.ui.activeCategory = btn.dataset.cat;
        state.ui.page = 1;
        applyFilters();
        window.scrollTo({top: 0, behavior:"smooth"});
      });
    });
  }

  // ✅ Banner carousel — fixed (use CSS height instead of inline height)
  function buildCarousel(){
    const slides = [
      "images/banner1.jpg",
      "images/banner2.jpg",
      "images/banner3.jpg"
    ];

    const car = $("#carousel");
    car.insertAdjacentHTML("afterbegin", slides.map((src,i)=>`
      <div class="slide ${i===0?'active':''}" data-index="${i}">
        <img src="${src}" alt="Banner ${i+1}" class="banner-image">
      </div>
    `).join(""));

    // Dots container
    const dotsWrap = document.createElement("div");
    dotsWrap.classList.add("carousel-dots");
    car.appendChild(dotsWrap);
    slides.forEach((_,i)=>{
      const dot = document.createElement("span");
      dot.className = "dot" + (i===0?" active":"");
      dot.addEventListener("click", ()=>show(i));
      dotsWrap.appendChild(dot);
    });

    let idx = 0;
    const show = i => {
      idx = i;
      const slidesEl = car.querySelectorAll(".slide");
      slidesEl.forEach(s=>s.classList.remove("active"));
      slidesEl[i].classList.add("active");
      car.querySelectorAll(".dot").forEach((d,j)=>d.classList.toggle("active", j===i));
    };

    $("#carouselPrev").addEventListener("click", ()=>{ idx = (idx-1+slides.length)%slides.length; show(idx); });
    $("#carouselNext").addEventListener("click", ()=>{ idx = (idx+1)%slides.length; show(idx); });

    setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000);
  }

  // Rendering grid and cards
  function renderGrid(){
    const grid = $("#productGrid");
    const start = (state.ui.page-1)*state.ui.perPage;
    const end = start + state.ui.perPage;
    const items = state.filtered.slice(start, end);
    grid.innerHTML = items.map(renderCard).join("");
    $("#resultsCount").textContent = `${state.filtered.length} results`;
    buildPagination();
    bindCardActions();
  }

  function renderCard(p){
    const inStock = p.stock > 0;
    return `
      <div class="card">
        <div class="thumb">
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="info">
          <div class="title">${p.name}</div>
          <div class="rating">★ ${p.rating} <span style="color:#8ba0bf">(${p.reviews.toLocaleString()})</span></div>
          <div class="price-row">
            <div class="price">${fmt(p.price)}</div>
            <div class="strike">${fmt(p.mrp)}</div>
            <div class="discount">-${p.discountPct}%</div>
          </div>
          <div class="actions">
            <button class="view-btn" data-id="${p.id}">View</button>
            <button class="primary add-btn" data-id="${p.id}" ${inStock?'':"disabled"}>${inStock?"Add to Cart":"Out of stock"}</button>
          </div>
        </div>
      </div>
    `;
  }

  // Pagination
  function buildPagination(){
    const pages = Math.ceil(state.filtered.length / state.ui.perPage);
    const wrapper = $("#pagination");
    if(pages <= 1){ wrapper.innerHTML = ""; return; }
    let html = "";
    for(let i=1; i<=pages; i++){
      html += `<button class="page-btn ${i===state.ui.page?'active':''}" data-p="${i}">${i}</button>`;
    }
    wrapper.innerHTML = html;
    wrapper.querySelectorAll(".page-btn").forEach(b=>{
      b.addEventListener("click", ()=>{
        state.ui.page = Number(b.dataset.p);
        renderGrid();
        window.scrollTo({top: 0, behavior:"smooth"});
      });
    });
  }

  // Card actions (add/view)
  function bindCardActions(){
    $$(".add-btn").forEach(btn=>btn.addEventListener("click", ()=>{
      const p = state.allProducts.find(x=>x.id === btn.dataset.id);
      addToCart(p, 1);
    }));
    $$(".view-btn").forEach(btn=>btn.addEventListener("click", ()=>{
      const p = state.allProducts.find(x=>x.id === btn.dataset.id);
      openProductModal(p);
    }));
  }

  // Filters + search logic
  function applyFilters(){
    let list = state.allProducts.slice();
    const {activeCategory, minPrice, maxPrice, rating, brands, sort, query} = state.ui;

    if(activeCategory !== "All") list = list.filter(p=>p.category === activeCategory);
    list = list.filter(p=>p.price >= minPrice && p.price <= maxPrice);
    if(rating>0) list = list.filter(p=>p.rating >= rating);
    if(brands.size>0) list = list.filter(p=>brands.has(p.brand));
    if(query && query.trim()){
      const q = query.trim().toLowerCase();
      list = list.filter(p=> (p.name + " " + p.brand + " " + p.category).toLowerCase().includes(q));
    }

    if(sort === "price_asc") list.sort((a,b)=>a.price-b.price);
    if(sort === "price_desc") list.sort((a,b)=>b.price-a.price);
    if(sort === "rating_desc") list.sort((a,b)=>b.rating-a.rating);
    if(sort === "discount_desc") list.sort((a,b)=>b.discountPct-a.discountPct);

    state.filtered = list;
    renderGrid();
  }

  // Product modal view
  function openProductModal(p){
    const el = $("#productModal");
    const body = $("#modalBody");
    body.innerHTML = `
      <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:14px">
        <div>
          <img src="${p.img}" alt="${p.name}" style="width:100%; border-radius:12px">
        </div>
        <div>
          <h2>${p.name}</h2>
          <div class="rating">★ ${p.rating} <span style="color:#8ba0bf">(${p.reviews.toLocaleString()} reviews)</span></div>
          <p style="color:#a9b8d6">${p.desc}</p>
          <div class="price-row" style="margin:10px 0">
            <div class="price" style="font-size:20px">${fmt(p.price)}</div>
            <div class="strike">${fmt(p.mrp)}</div>
            <div class="discount">Save ${p.discountPct}%</div>
          </div>
          <div style="display:flex; gap:8px; margin-top:12px">
            <button class="primary" id="modalAdd" ${p.stock>0?'':"disabled"}>${p.stock>0?"Add to Cart":"Out of stock"}</button>
            <button id="buyNow">Buy Now</button>
          </div>
          <div style="margin-top:10px; color:#8ba0bf">Category: ${p.category} • Brand: ${p.brand} • In Stock: ${p.stock}</div>
        </div>
      </div>
    `;
    $("#modalAdd").addEventListener("click", ()=>addToCart(p,1));
    $("#buyNow").addEventListener("click", ()=>{
      addToCart(p,1);
      openCart();
    });
    el.setAttribute("aria-hidden", "false");
    $("#modalBackdrop").addEventListener("click", closeModal);
  }
  function closeModal(){
    $("#productModal").setAttribute("aria-hidden", "true");
  }
  $("#modalClose").addEventListener("click", closeModal);

  // Cart functions
  function saveCart(){
    localStorage.setItem("mj_cart", JSON.stringify(state.cart));
  }
  function updateCartBadge(){
    const count = state.cart.reduce((n,i)=>n+i.qty,0);
    $("#cartCount").textContent = String(count);
  }
  function addToCart(p, qty){
    const idx = state.cart.findIndex(i=>i.id === p.id);
    if(idx === -1) state.cart.push({ id: p.id, name: p.name, price: p.price, mrp: p.mrp, img: p.img, qty: qty });
    else state.cart[idx].qty += qty;
    saveCart();
    updateCartBadge();
    renderCart();
  }
  function incItem(id){ const it = state.cart.find(i=>i.id===id); if(it){ it.qty++; saveCart(); renderCart(); updateCartBadge(); } }
  function decItem(id){ const it = state.cart.find(i=>i.id===id); if(it){ it.qty=Math.max(1,it.qty-1); saveCart(); renderCart(); updateCartBadge(); } }
  function removeItem(id){ state.cart = state.cart.filter(i=>i.id!==id); saveCart(); renderCart(); updateCartBadge(); }

  function renderCart(){
    const wrap = $("#cartItems");
    wrap.innerHTML = state.cart.map(i=>`
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div class="meta">
          <div style="font-weight:700">${i.name}</div>
          <div style="color:#9fb2d1">${fmt(i.price)} <span style="text-decoration:line-through; color:#7186a8; margin-left:6px">${fmt(i.mrp)}</span></div>
          <div class="qty" style="margin-top:6px">
            <button class="page-btn" data-dec="${i.id}">−</button>
            <span>${i.qty}</span>
            <button class="page-btn" data-inc="${i.id}">+</button>
            <button class="linklike" style="margin-left:8px" data-rm="${i.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");
    wrap.querySelectorAll("[data-inc]").forEach(b=>b.addEventListener("click", ()=>incItem(b.dataset.inc)));
    wrap.querySelectorAll("[data-dec]").forEach(b=>b.addEventListener("click", ()=>decItem(b.dataset.dec)));
    wrap.querySelectorAll("[data-rm]").forEach(b=>b.addEventListener("click", ()=>removeItem(b.dataset.rm)));

    const subtotal = state.cart.reduce((s,i)=>s + i.price * i.qty, 0);
    const mrpTotal = state.cart.reduce((s,i)=>s + i.mrp * i.qty, 0);
    const discount = Math.max(0, mrpTotal - subtotal);
    $("#cartSubtotal").textContent = fmt(subtotal);
    $("#cartDiscount").textContent = "−" + fmt(discount);
    $("#cartTotal").textContent = fmt(subtotal);
  }

  function openCart(){
    $("#cartDrawer").classList.add("open");
    $("#cartBackdrop").classList.add("open");
  }
  function closeCart(){
    $("#cartDrawer").classList.remove("open");
    $("#cartBackdrop").classList.remove("open");
  }

  // Search: only when button is clicked
  function runSearch(){
    state.ui.query = $("#searchInput").value;
    state.ui.page = 1;
    applyFilters();
    $("#productsTitle").textContent = state.ui.query ? `Search: "${state.ui.query}"` : "All Products";
  }
  

  // Filters UI binding
  function bindFilters(){
    const minR = $("#minPrice");
    const maxR = $("#maxPrice");
    const minL = $("#minPriceLabel");
    const maxL = $("#maxPriceLabel");
    minR.addEventListener("input", ()=>{ state.ui.minPrice = Number(minR.value); minL.textContent = String(state.ui.minPrice); });
    maxR.addEventListener("input", ()=>{ state.ui.maxPrice = Number(maxR.value); maxL.textContent = String(state.ui.maxPrice); });
    minR.addEventListener("change", applyFilters);
    maxR.addEventListener("change", applyFilters);

    $$("input[name=rating]").forEach(r=>{ r.addEventListener("change", ()=>{ state.ui.rating = Number(r.value); applyFilters(); }); });

    $("#sortSelect").addEventListener("change", e => { state.ui.sort = e.target.value; applyFilters(); });

    $("#clearFilters").addEventListener("click", ()=> {
      state.ui = {...state.ui, minPrice:0, maxPrice:200000, rating:0, brands: new Set(), sort:"relevance", query:""};
      $("#searchInput").value = "";
      $("#minPrice").value = 0; $("#maxPrice").value = 200000;
      $("#minPriceLabel").textContent = "0"; $("#maxPriceLabel").textContent = "200000";
      $("#brandList").querySelectorAll("input[type=checkbox]").forEach(c=>c.checked=false);
      $$("input[name=rating]")[0].checked = true;
      $("#sortSelect").value = "relevance";
      // reset category
      document.querySelectorAll("#categoryBar .cat-pill").forEach(b=>b.classList.remove("active"));
      document.querySelector('#categoryBar .cat-pill[data-cat="All"]').classList.add("active");
      state.ui.activeCategory = "All";
      applyFilters();
      $("#productsTitle").textContent = "All Products";
    });
  }

  // Header actions
  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#cartBackdrop").addEventListener("click", closeCart);
  $("#searchBtn").addEventListener("click", runSearch);
  $("#homeLink").addEventListener("click", ()=>{
    state.ui.activeCategory = "All";
    document.querySelectorAll("#categoryBar .cat-pill").forEach(b=>b.classList.remove("active"));
    document.querySelector('#categoryBar .cat-pill[data-cat="All"]').classList.add("active");
    state.ui.query = "";
    $("#searchInput").value = "";
    $("#productsTitle").textContent = "All Products";
    state.ui.page = 1;
    applyFilters();
    window.scrollTo({top: 0, behavior:"smooth"});
  });

  // Init
  function init(){
    state.allProducts = buildProducts();
    buildCategories();
    buildBrands(state.allProducts);
    buildCarousel();
    bindFilters();
    state.filtered = state.allProducts.slice();
    renderGrid();
    renderCart();
    updateCartBadge();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  init();
})();
