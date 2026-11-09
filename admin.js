const API_URL = "http://localhost:8080/api/products";

const tableBody = document.getElementById("products-table-body");
const productCount = document.getElementById("product-count");

function formatPrice(priceCents) {
    return (priceCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

function createActionsCell(productId) {
    const cell = document.createElement("td");
    const button = document.createElement("button");

    button.textContent = "EXCLUIR";
    button.className = "btn btn-danger";
    button.dataset.id = productId;

    cell.appendChild(button);
    return cell;
}

function renderProducts(products) {
    tableBody.innerHTML = "";

    if (products.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="5">NENHUM PRODUTO CADASTRADO.</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");

        row.append(
            createCell(product.id),
            createCell(product.name),
            createCell(formatPrice(product.priceCents)),
            createCell(product.stock),
            createActionsCell(product.id)
        );

        tableBody.appendChild(row);
    });
}

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const products = await response.json();

        productCount.textContent = `${products.length} PRODUTOS`;
        renderProducts(products);

    } catch (error) {
        console.error(error);
        productCount.textContent = "ERRO";
        tableBody.innerHTML =
            '<tr><td colspan="5">ERRO AO CARREGAR OS PRODUTOS.</td></tr>';
    }
}

loadProducts();

const form = document.getElementById("product-form");
const message = document.getElementById("message");

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseInt(document.getElementById("stock").value, 10);

    const product = {
        name,
        description,
        priceCents: Math.round(price * 100),
        stock
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar produto");
        }

        showMessage("Produto cadastrado com sucesso!", "success");
        form.reset();
        loadProducts();

    } catch (error) {
        console.error(error);
        showMessage("Não foi possível cadastrar o produto.", "error");
    }
});

tableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-id]");

    if (!button) {
        return;
    }

    const id = button.dataset.id;

    if (!confirm(`Excluir o produto ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.status === 404) {
            showMessage("Produto não encontrado. Talvez já tenha sido excluído.", "error");
            loadProducts();
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao excluir produto");
        }

        showMessage("Produto excluído com sucesso!", "success");
        loadProducts();

    } catch (error) {
        console.error(error);
        showMessage("Não foi possível excluir o produto.", "error");
    }
});