 
console.log("App iniciado!");

const WHATSAPP_NUMBER = "5524988781344"; 
const products = [
    { id: 1, name: "Smash Clássico", description: "Pão brioche, 2 smash's de 60g, cheddar, picles, cebola roxa, catchup e mostarda.", price: 27.90, category: "burguer", image: "./img/smashClassico.jpg", tag: "Clássico" },
    { id: 2, name: "Cheddar Bacon", description: "Pão brioche, 2 smash's de 60g, muito cheddar, bacon crocante e molho da casa.", price: 28.90, category: "burguer", image: "./img/cheddarBacon.jpg", tag: "Mais vendido" },
    { id: 3, name: "Doritos Bacon", description: "Pão brioche, Blend 120g, cheddar, bacon, Doritos e maionese artesanal.", price: 31.90, category: "burguer", image: "./img/doritosBacon.jpg", tag: "Crocante" },
    { id: 4, name: "Triplo Burger", description: "Pão brioche, 3 blends de 120g, 6 fatias de cheddar e maionese.", price: 39.90, category: "burguer", image: "./img/triploBurger.jpg", tag: "Gigante" },
    { id: 5, name: "X-Burger Salada", description: "Pão, carne, queijo, bacon, ovo, salada completa e maionese.", price: 37.90, category: "burguer", image: "./img/xBurger.jpg", tag: "" },
    { id: 6, name: "Onions Burger", description: "Pão brioche, carne 120g, cheddar, anéis de cebola, bacon e cream cheese.", price: 24.90, category: "burguer", image: "./img/onionsBurger.jpg", tag: "" },
    { id: 7, name: "Combo Smash", description: "1 Smash Burger + 1 Batata P + 1 Refri Lata.", price: 35.90, category: "combo", image: "./img/comboSmash.jpg", tag: "Oferta" },
    { id: 8, name: "Combo Casal", description: "2 X-Burgers + 2 Batatas M + 1 Refri 1.5L.", price: 69.90, category: "combo", image: "./img/comboCasal.AVIF", tag: "Para dois" },
    { id: 9, name: "Coca-Cola Lata", description: "350ml bem gelada.", price: 5.90, category: "bebida", image: "./img/cocaLata.webp", tag: "" },
    { id: 10, name: "Guaraná Lata", description: "350ml bem gelada.", price: 5.90, category: "bebida", image: "./img/guaranaAntartica.png", tag: "" },
    { id: 11, name: "Água Mineral", description: "500ml sem gás.", price: 3.50, category: "bebida", image: "./img/aguaMineral.jpg", tag: "" },
    { id: 12, name: "Milkshake Choc", description: "400ml cremoso.", price: 15.90, category: "sobremesa", image: "./img/milkshakeChocolate.jpg", tag: "Delícia" },
    { id: 13, name: "Pudim", description: "Fatia de pudim de leite condensado.", price: 8.90, category: "sobremesa", image: "./img/pudim.jpg", tag: "" }
];

let cart = []; 
let modalProduct = {}; 


const elements = {
    productsList: document.querySelector('#products-list'),
    cartItems: document.querySelector("#cart-items"),
    cartSubtotal: document.querySelector("#cart-subtotal"),
    cartTotal: document.querySelector("#cart-total"),
    cartCount: document.querySelector("#mobile-cart-count"),
    cartEmptyMsg: document.querySelector("#cart-empty"),
    mobileCartBtn: document.querySelector("#mobile-cart-btn"),
    modal: document.getElementById('modal-details'),
    modalImg: document.getElementById('modal-img'),
    modalTitle: document.getElementById('modal-title'),
    modalDesc: document.getElementById('modal-desc'),
    modalPrice: document.getElementById('modal-price'),
    modalBtnTotal: document.getElementById('modal-total-btn'),
    btnCheckout: document.querySelector("#checkout-whatsapp"),
    addressInput: document.getElementById("address"),
    paymentInput: document.getElementById("payment-method"),
    notesInput: document.getElementById("order-notes"),
    dateSpan: document.getElementById("date-span"),
    toast: document.getElementById("toast")
};


function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.className = "show";
    setTimeout(() => { elements.toast.className = elements.toast.className.replace("show", ""); }, 3000);
}

function checkRestaurantOpen() {
    const hora = new Date().getHours();
    return hora >= 10 && hora < 23; 
}


if (checkRestaurantOpen()) {
    elements.dateSpan.style.backgroundColor = "#54CC0A";
} else {
    elements.dateSpan.style.backgroundColor = "#d32f2f";
    elements.dateSpan.textContent = "Fechado - 18h às 23h";
}


function renderProducts(category = "all") {
    const filtered = category === "all" ? products : products.filter(p => p.category === category);
    
    elements.productsList.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-card__top">
                <div class="product-card__info">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__description">${product.description}</p>
                    ${product.tag ? `<span class="product-card__tag">🔥 ${product.tag}</span>` : ''}
                    <p class="product-card__price">${formatCurrency(product.price)}</p>
                </div>
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">
                </div>
            </div>
            <div class="product-card__actions">
                <button class="btn btn--primary btn-add-to-cart" data-id="${product.id}">
                    Adicionar
                </button>
            </div>
        </article>
    `).join('');
}


document.querySelectorAll('.filter-button').forEach(btn => {
    btn.addEventListener("click", function() {
        document.querySelectorAll('.filter-button').forEach(b => b.classList.remove("filter-button--active"));
        this.classList.add("filter-button--active");
        renderProducts(this.getAttribute("data-category"));
    });
});


elements.productsList.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-to-cart");
    if (!btn) return;

    const product = products.find(p => p.id === Number(btn.dataset.id));
    openModal(product);
});

function openModal(product) {
    modalProduct = { ...product, basePrice: product.price }; 
    
    
    elements.modalImg.src = product.image;
    elements.modalTitle.innerText = product.name;
    elements.modalDesc.innerText = product.description;
    elements.modalPrice.innerText = formatCurrency(product.price);

    const modalBody = document.querySelector('.modal-body');

    if (product.category === "burguer") {
        modalBody.style.display = "block";
    } else {
        modalBody.style.display = "none";
    }
    
    document.querySelectorAll('.adicional-item').forEach(el => el.checked = false);
    const defaultRadio = document.querySelector('input[name="ponto"][value="Ao Ponto"]');
    if(defaultRadio) defaultRadio.checked = true;

    updateModalTotal();
    elements.modal.style.display = 'flex';
}


function updateModalTotal() {
    let total = modalProduct.basePrice;
    document.querySelectorAll('.adicional-item:checked').forEach(item => {
        total += parseFloat(item.value);
    });
    elements.modalBtnTotal.innerText = formatCurrency(total);
}


document.querySelectorAll('.adicional-item').forEach(el => {
    el.addEventListener('change', updateModalTotal);
});


document.getElementById('close-modal-btn').addEventListener('click', () => {
    elements.modal.style.display = 'none';
});


document.getElementById('add-to-cart-modal').addEventListener('click', () => {
    
    const pontoEl = document.querySelector('input[name="ponto"]:checked');
    const ponto = pontoEl ? pontoEl.value : "";
    
    
    let extras = [];
    let extraPrice = 0;
    document.querySelectorAll('.adicional-item:checked').forEach(item => {
        extras.push(item.getAttribute('data-name'));
        extraPrice += parseFloat(item.value);
    });

    
    let obsText = "";
    if (ponto) obsText += `Ponto: ${ponto}`;
    if (extras.length > 0) obsText += (obsText ? ", " : "") + `Extras: ${extras.join(', ')}`;

    
    cart.push({
        id: Date.now(),
        name: modalProduct.name,
        price: modalProduct.basePrice + extraPrice,
        quantity: 1,
        obs: obsText
    });

    renderCart();
    elements.modal.style.display = 'none';
    showToast(`${modalProduct.name} adicionado!`);
});


function renderCart() {
    let subtotal = 0;
    let count = 0;

    if (cart.length === 0) {
        elements.cartItems.innerHTML = "";
        elements.cartEmptyMsg.style.display = "block";
        elements.mobileCartBtn.classList.remove("show");
    } else {
        elements.cartEmptyMsg.style.display = "none";
        elements.mobileCartBtn.classList.add("show");

        elements.cartItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            count += item.quantity;
            
            return `
            <div class="cart-item">
                <div class="cart-item__info">
                    <p class="cart-item__name">${item.name}</p>
                    ${item.obs ? `<small style="color:#888; display:block;">${item.obs}</small>` : ''}
                    <p class="cart-item__price">1x ${formatCurrency(item.price)}</p>
                </div>
                <button class="cart-item_btn remove-btn" data-id="${item.id}">🗑️</button>
            </div>`;
        }).join('');
    }

    elements.cartSubtotal.textContent = formatCurrency(subtotal);
    elements.cartTotal.textContent = formatCurrency(subtotal);
    elements.cartCount.textContent = count;
}


elements.cartItems.addEventListener("click", (e) => {
    if (e.target.closest(".remove-btn")) {
        const id = Number(e.target.closest(".remove-btn").dataset.id);
        cart = cart.filter(item => item.id !== id);
        renderCart();
    }
});


document.getElementById('clear-cart').addEventListener('click', () => {
    if(cart.length && confirm("Limpar todo o carrinho?")) {
        cart = [];
        renderCart();
    }
});


elements.btnCheckout.addEventListener("click", () => {
    
    if (!checkRestaurantOpen()) return alert("O restaurante está fechado no momento!");
    if (cart.length === 0) return alert("Seu carrinho está vazio.");
 
    const notes = elements.notesInput.value;


    
    let msg = `*🍔 NOVO PEDIDO - IFOME*\n--------------------------------\n`;
    
    cart.forEach(item => {
        msg += `*1x ${item.name}* \n`;
        if(item.obs) msg += `   ↳ _${item.obs}_\n`;
        msg += `   Valor: ${formatCurrency(item.price)}\n\n`;
    });

    msg += `--------------------------------\n`;
    msg += `*Total: ${elements.cartTotal.innerText}*\n`;
    msg += `--------------------------------\n`;
    if(notes) msg += `📝 *Obs:* ${notes}`;

    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
});

const adminForm = document.querySelector('#admin-form');
document.querySelector('#toggle-admin').addEventListener("click", () => {
    adminForm.style.display = (adminForm.style.display === "block") ? "none" : "block";
});

adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        name: document.querySelector('#admin-name').value,
        description: document.querySelector('#admin-description').value,
        price: parseFloat(document.querySelector('#admin-price').value),
        category: document.querySelector('#admin-category').value,
        image: document.querySelector('#admin-image').value || "./img/padrao.jpg",
        tag: "Novo"
    };
    products.push(newProd);
    renderProducts("all");
    alert("Produto adicionado!");
    adminForm.reset();
});
// Adicione este bloco para ativar a rolagem automática
elements.mobileCartBtn.addEventListener("click", () => {
    const cartSection = document.querySelector(".cart");
    
    cartSection.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
    });
});


renderProducts();


