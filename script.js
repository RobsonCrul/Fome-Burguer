const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

//Abrir modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal()
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionar no carrinho
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){
    const existingItems = cart.find(item => item.name === name)

    if(existingItems){
        existingItems.quantity += 1;
    } else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualizar carrinho
function updateCartModal(){
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-betwenn", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `

        total += item.price * item.quantity; 

        cartItemContainer.appendChild(cartItemElement)
    }) 

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

//Função para remover o item do carrinho
cartItemContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== 1){
        const item = cart[index]
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()   
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        
        Toastify({
            text: "Ops! Restaurante fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
  },
        }).showToast()

        return
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressInput.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido para api do whatsapp
    const cartItem = cart.map((item) => {
        return (
            `${item.name} \nQuantidade: (${item.quantity}) \nPreço: RS${item.price} | \n`
        )
    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "4298564575" //número fictício

    window.open(`https://wa.me/${phone}?text=${message} \nEndereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()

})

//Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
    //true = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}