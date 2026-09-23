const products = [
  {id:1,name:"Humor Sem Filtro",category:"Humor",price:9.90,emoji:"🤣"},
  {id:2,name:"Respostas Improváveis",category:"Frases",price:7.90,emoji:"💬"},
  {id:3,name:"Combo Memes",category:"Combos",price:14.90,emoji:"🔥"},
  {id:4,name:"Cultura Pop",category:"Cultura Pop",price:9.90,emoji:"🎬"},
  {id:5,name:"Só no Deboche",category:"Humor",price:8.90,emoji:"😈"},
  {id:6,name:"Frases de Efeito",category:"Frases",price:6.90,emoji:"😎"},
  {id:7,name:"Combo Gigante",category:"Combos",price:19.90,emoji:"🚀"},
  {id:8,name:"Nostalgia",category:"Cultura Pop",price:8.90,emoji:"📺"}
];
let cart = JSON.parse(localStorage.getItem("packzone_cart") || "[]");
let category = "Todos";

const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const productsEl = document.querySelector("#products");
const searchEl = document.querySelector("#search");

function renderProducts(){
  const q = searchEl.value.toLowerCase().trim();
  const list = products.filter(p => (category==="Todos" || p.category===category) && p.name.toLowerCase().includes(q));
  productsEl.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-cover">${p.emoji}</div>
      <div class="product-body">
        <div class="tag">${p.category.toUpperCase()}</div>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      </div>
    </article>`).join("") || `<p class="muted">Nenhum pack encontrado.</p>`;
}
function addToCart(id){ cart.push(id); save(); openCart(); }
function removeFromCart(index){ cart.splice(index,1); save(); }
function save(){ localStorage.setItem("packzone_cart",JSON.stringify(cart)); renderCart(); renderProducts(); }
function renderCart(){
  const items = cart.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  document.querySelector("#cartCount").textContent=items.length;
  document.querySelector("#cartItems").innerHTML = items.length ? items.map((p,i)=>`
    <div class="cart-line"><div><strong>${p.name}</strong><small>${money(p.price)}</small></div><button class="remove" onclick="removeFromCart(${i})">Remover</button></div>`).join("") : `<p class="muted">Seu carrinho está vazio.</p>`;
  document.querySelector("#cartTotal").textContent=money(items.reduce((s,p)=>s+p.price,0));
}
function openCart(){document.querySelector("#cart").classList.add("open");document.querySelector("#backdrop").classList.add("show")}
function closeCart(){document.querySelector("#cart").classList.remove("open");document.querySelector("#backdrop").classList.remove("show")}
function openModal(){
  const items=cart.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  if(!items.length){alert("Adicione pelo menos um pack.");return}
  document.querySelector("#checkoutSummary").innerHTML=items.map(p=>`<div>${p.name} — <strong>${money(p.price)}</strong></div>`).join("")+`<hr><div><strong>Total: ${money(items.reduce((s,p)=>s+p.price,0))}</strong></div>`;
  document.querySelector("#modalBackdrop").classList.add("show");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;renderProducts()}));
searchEl.addEventListener("input",renderProducts);
document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#backdrop").onclick=closeCart;
document.querySelector("#checkout").onclick=openModal;
document.querySelector("#closeModal").onclick=()=>document.querySelector("#modalBackdrop").classList.remove("show");
document.querySelector("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")e.currentTarget.classList.remove("show")});
document.querySelector("#payButton").onclick = async () => {
  const email = document.querySelector("#email").value.trim();

  if (!email || !email.includes("@")) {
    alert("Digite um e-mail válido.");
    return;
  }

  const itens = cart
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (!itens.length) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const mapa = new Map();

  itens.forEach(item => {
    if (!mapa.has(item.id)) {
      mapa.set(item.id, {
        title: item.name,
        quantity: 1,
        unit_price: Number(item.price)
      });
    } else {
      mapa.get(item.id).quantity++;
    }
  });

  try {
    const resposta = await fetch("/api/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        items: Array.from(mapa.values())
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.error || "Não foi possível iniciar o pagamento.");
      return;
    }

    if (!dados.init_point) {
      alert("O Mercado Pago não retornou o endereço do pagamento.");
      return;
    }

    window.location.href = dados.init_point;

  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o Mercado Pago.");
  }
};
renderProducts();renderCart();
