const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const ratingFilter = document.getElementById("ratingFilter");
const colorFilter = document.getElementById("colorFilter");
const sizeFilter = document.getElementById("sizeFilter");
const searchInput = document.getElementById("searchInput")
const sortFilter = document.getElementById("sortFilter");
const priceValue = document.getElementById("priceValue");
const productContainer = document.getElementById("productContainer");

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
        productContainer.innerHTML = `<p class="col-span-full text-centter text-gray-500">No Products Found</p>`;
        return;
    }
    productContainer.innerHTML = items.map(p => `
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img src="${p.image}" alt="${p.image}" class="w-full h-40 object-cover mb-2 rounded" />
        <h3 class="font-semibold">${p.name}</h3>
        <p class="text-gray-600">${'$' + p.price}</p>
        <p class="text-yellow-500">${'★'.repeat(Math.floor(p.rating))}</p>
        <p class="text-gray-500 text-sm">Color: ${p.color} | Size: ${p.size}</p>
        </div>
        `).join("");
}

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
    if(sortFilter.value === "ratingHigh") filter.sort((a,b) => b.rating - a.rating);

    displayProducts(filtered);
}

//Initial load
displayProducts(products);