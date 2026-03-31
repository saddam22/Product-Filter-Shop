const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const ratingFilter = document.getElementById("ratingFilter");
const colorFilter = document.getElementById("colorFilter");
const sizeFilter = document.getElementById("sizeFilter");
const searchInput = document.getElementById("searchInput")
const sortFilter = document.getElementById("sortFilter");
const priceValue = document.getElementById("priceValue");
const productContainer = document.getElementById("productContainer");
const activeFilters = document.getElementById("activeFilters");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const cartModal = document.getElementById("cartModal");
const wishlistModal = document.getElementById("wishlistModal");
const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");
const cartTotalSpan = document.getElementById("cartTotal");

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("wishlistBtn").addEventListener("click", openWishlist);


//localstorage setup
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
updateCounters();


//Update price Label
priceFilter.addEventListener("input", () =>{
    priceValue.textContent = priceFilter.value;
    filterProducts();
});

//add event Listeners
[categoryFilter, ratingFilter, colorFilter, sizeFilter, searchInput, sortFilter].forEach(e1 =>{
e1.addEventListener("change", filterProducts);
e1.addEventListener("input", filterProducts);
});

// Function to display products
function displayProducts(items){
    if(items.length === 0){
        productContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">No Products Found</p>`;
        return;
    }
    productContainer.innerHTML = items.map(p => `
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img data-src="${p.image}" alt="${p.image}" class="lazy w-full h-40 object-cover mb-2 rounded" />
        <h3 class="font-semibold">${p.name}</h3>
        <p class="text-gray-600">${'$' + p.price}</p>
        <p class="text-yellow-500">${'★'.repeat(Math.floor(p.rating))}</p>
        <p class="text-gray-500 text-sm">Color: ${p.color} | Size: ${p.size}</p>
        <div class="mt-2 flex gap-2">
        <button onclick="addToCart(${p.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Add to Cart</button>
        <button onclick="addToWishlist(${p.id})" class="bg-pink-500 text-white px-2 py-1 rounded">WishList</button>
        </div>
        </div>
        `).join("");
        lazyLoadImages();
        displayActiveFilters();
}

//lazy load images
function lazyLoadImages(){
    const lazyImages = document.querySelectorAll(".lazy");
    lazyImages.forEach(img =>{
        if(img.getAttribute("data-src") && img.getBoundingClientRect().top < window.innerHeight + 100){
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          img.classList.remove("lazy");  
        }
    });
}
window.addEventListener("scroll", lazyLoadImages);

// Filter Function
function filterProducts(){
    let filtered = products.filter(p => {
        return (categoryFilter.value === "all" || p.category === categoryFilter.value) &&
         p.price <= priceFilter.value &&
         p.rating >= ratingFilter.value &&
         (colorFilter.value === "all" || p.color === colorFilter.value) &&
         (sizeFilter.value === "all" || p.size === sizeFilter.value) &&
         p.name.toLowerCase().includes(searchInput.value.toLowerCase());
    });
    
    //Sorting
    if(sortFilter.value === "priceLow") filtered.sort((a,b) => a.price - b.price);
    if(sortFilter.value === "priceHigh") filtered.sort((a,b) => b.price - a.price);
    if(sortFilter.value === "ratingHigh") filtered.sort((a,b) => b.rating - a.rating);

    displayProducts(filtered);
}

//active filters
function displayActiveFilters(){
    const filters = [];
    if(categoryFilter.value!=="all") filters.push(`Category: ${categoryFilter.value}`);
    if(priceFilter.value!=="200") filters.push(`Max Price: ${priceFilter.value}$`);
    if(ratingFilter.value!=="0") filters.push(`Rating: ${ratingFilter.value}+`);
    if(colorFilter.value!=="all") filters.push(`Color: ${colorFilter.value}`);
    if(sizeFilter.value!=="all") filters.push(`Size: ${sizeFilter.value}`);
    if(searchInput.value) filters.push(`Search: "${searchInput.value}"`);

    activeFilters.innerHTML = filters.map(f => `<span class="bg-gray-200 px-2 py-1 rounded text-sm">${f}</span>`).join("");
}

//cart & wishlish functions
function addToCart(id){
    if(!cart.includes(id))
        cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
}
function addToWishlist(id){
    if(!wishlist.includes(id))
    wishlist.push(id);
localStorage.setItem("wishlist", JSON.stringify(wishlist));
updateCounters();
}

function updateCounters(){
cartCount.textContent = cart.length;
wishlistCount.textContent = wishlist.length;
}


//Modal Logic
function openCart(){
    displayCartItems();
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
}
function closeCart(){
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
}
function openWishlist(){
    displayWishlistItems();
    wishlistModal.classList.remove("hidden");
    wishlistModal.classList.add("flex");
}
function closeWishlist(){
wishlistModal.classList.add("hidden");
wishlistModal.classList.remove("flex");   
}

// Display Cart Items
function displayCartItems(){
    if(cart.length === 0){
        cartItems.innerHTML = `<p class="text-gray-500 text-center">Cart is empty</p>`;
        cartTotalSpan.textContent = 0;
        return
    }

    let total = 0;
    cartItems.innerHTML = cart.map(id => {
        const p = products.find(prod => prod.id === id);
        total += p.price;
        return `<div class="flex justify-between items-center border-b pb-1">
        <span>${p.name} (${p.price})</span>
        <button onclick="removeFromCart(${p.id})" class="text-red-500">✖</button>
        </div>`;
    }).join("");
    cartTotalSpan.textContent = total;
}

// Remove from Cart
function removeFromCart(id){
    cart = cart.filter(i => i !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
    displayCartItems();
}

// Checkout Simulation
function checkoutCart(){
if(cart.length === 0){
    alert("Cart is empty!");
    return;
}
alert(`Checkout successful! Total: ${cart.reduce((acc, id) => acc+products.find(p=>p.id===id).price,0)}`);
cart = [];
localStorage.setItem("cart", JSON.stringify(cart));
closeCart();
updateCounters();
displayCartItems();
}

// Display Wishlist Items
function displayWishlistItems(){
    if(wishlist.length === 0){
        wishlistItems.innerHTML = `<p class="text-gray-500 text-center">Wishlist is empty</p>`;
        return;
    }
    wishlistItems.innerHTML = wishlist.map(id =>{
        const p = products.find(prod => prod.id === id);
        return `<div class="flex justify-between items-center border-b pb-1">
        <span>${p.name} (${p.price})</span>
        <button onclick="removeFromWishlist(${p.id})" class="text-red-500">✖</button>
        </div>`;
    }).join("");
}

// Remove from Wishlist
function removeFromWishlist(id){
    wishlist = wishlist.filter(i => i !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateCounters();
    displayWishlistItems();
}


//Initial load
displayProducts(products);