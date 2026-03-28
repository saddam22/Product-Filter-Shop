const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const ratingFilter = document.getElementById("ratingFilter");
const priceValue = document.getElementById("priceValue");
const productContainer = document.getElementById("productContainer");

//Update price Label
priceFilter.addEventListener("input", () =>{
    priceValue.textContent = priceFilter.value;
    filterProducts();
});

categoryFilter.addEventListener("change", filterProducts);
ratingFilter.addEventListener("change", filterProducts);

// Function to display products
function displayProducts(items){
    productContainer.innerHTML = items.map(p => `
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img src="${p.image}" alt="${p.image}" class="w-full h-40 object-cover mb-2 rounded" />
        <h3 class="font-semibold">${p.name}</h3>
        <p class="text-gray-600">${'$' + p.price}</p>
        <p class="text-yellow-500">${'★'.repeat(Math.floor(p.rating))}</p>
        </div>
        `).join("");
}

// Filter Function
function filterProducts(){
    const category = categoryFilter.value;
    const maxPrice = Number(priceFilter.value);
    const minRating = Number(ratingFilter.value);

    const filtered = products.filter(p => {
        return (category === "all" || p.category ===category) && 
        p.price <= maxPrice &&
        p.rating >= minRating;
    });

    displayProducts(filtered);
}

//Initial load
displayProducts(products);