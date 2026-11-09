
const productsContainer = document.getElementById("products");
const productCount = document.getElementById("product-count");

async function loadProducts() {
    try {
       const response = await fetch("http://localhost:8080/api/products");

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const products = await response.json();

        productCount.textContent = `${products.length} PRODUTOS`;

        if (products.length === 0) {
            productsContainer.innerHTML = "<p>NENHUM PRODUTO ENCONTRADO.</p>";
            return;
        }

        productsContainer.innerHTML = products.map(product => `
            <article class="product">
                <h4>${product.name}</h4>

                <p>${product.description ?? "Sem descrição."}</p>

                <div class="product-bottom">
                    <span class="price">
                        ${formatPrice(product.priceCents)}
                    </span>

                    <span class="stock">
                        ESTOQUE: ${product.stock}
                    </span>
                </div>
            </article>
        `).join("");

    } catch (error) {
        console.error(error);

        productsContainer.innerHTML =
            "<p>ERRO AO CARREGAR OS PRODUTOS.</p>";

        productCount.textContent = "ERRO";
    }
}

function formatPrice(priceCents) {
    return (priceCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

loadProducts();
