const productsContainer = document.getElementById("products");
const categorySelect = document.getElementById("category");
const seedBtn = document.getElementById("seedBtn");
const clearBtn = document.getElementById("clearBtn");
const seedCount = document.getElementById("seedCount");
const messageBox = document.getElementById("message");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const scrollBottomBtn = document.getElementById("scrollBottomBtn");
const refreshBtn = document.getElementById("refreshBtn");
const dbCountElement = document.getElementById("dbCount");
const shownCountElement = document.getElementById("shownCount");
const nextBtn = document.getElementById("nextBtn");

let nextCursor = null;
let currentPage = 1;
let currentCategory = "";

function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = type;
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 4000);
}

async function loadDatabaseCount() {
  try {
    const response = await fetch("/products/count");
    const data = await response.json();

    dbCountElement.textContent =
      data.count.toLocaleString();
  } catch (error) {
    console.error(error);
  }
}

function updateProductCount() {
  const count =
    productsContainer.querySelectorAll(
      ".product-card"
    ).length;

  shownCountElement.textContent =
    count.toLocaleString();
}

async function fetchProducts(reset = false) {
  try {
    if (reset) {
      productsContainer.innerHTML = "";
      nextCursor = null;
      currentPage = 1;
    }

    let url = "/products?limit=20";

    if (currentCategory) {
      url += `&category=${encodeURIComponent(
        currentCategory
      )}`;
    }

    if (nextCursor) {
      url += `&cursor=${encodeURIComponent(
        nextCursor
      )}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      showMessage(data.message, "error");
      return;
    }

    if (
      !reset &&
      productsContainer.querySelectorAll(
        ".product-card"
      ).length > 0
    ) {
      const divider =
        document.createElement("div");

      divider.className =
        "page-divider";

      divider.innerHTML = `
        <span>
          Page ${++currentPage}
        </span>
      `;

      productsContainer.appendChild(
        divider
      );
    }

    renderProducts(data.products);

    nextCursor = data.nextCursor;

    nextBtn.style.display =
      data.hasMore
        ? "block"
        : "none";

  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderProducts(products) {
  products.forEach((product) => {
    const card =
      document.createElement("div");

    card.className =
      "product-card";

    card.innerHTML = `
      <div class="product-info">
        <h3>${product.name}</h3>

        <div class="product-meta">
          <span class="category">
            ${product.category}
          </span>

          <span>
            ID: ${product.id}
          </span>

          
        </div>
      </div>

      <div class="price">
        ₹${Number(product.price).toFixed(2)}
      </div>
    `;

    productsContainer.appendChild(card);
  });

  updateProductCount();
}

refreshBtn.addEventListener(
  "click",
  () => {
    currentCategory =
      categorySelect.value;

    fetchProducts(true);
  }
);

seedBtn.addEventListener(
  "click",
  async () => {
    try {
      const count =
        Number(seedCount.value);

      const response =
        await fetch(
          "/products/seed",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              count,
            }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        showMessage(
          data.message,
          "error"
        );
        return;
      }

      showMessage(
        `${data.productsCreated} products added`
      );

      await loadDatabaseCount();

      

    } catch (error) {
      showMessage(
        error.message,
        "error"
      );
    }
  }
);


scrollTopBtn.addEventListener(
  "click",
  () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
);

scrollBottomBtn.addEventListener(
  "click",
  () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
);

scrollTopBtn.style.display =
  "none";

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display =
        "block";
    } else {
      scrollTopBtn.style.display =
        "none";
    }
  }
);

nextBtn.addEventListener(
  "click",
  async () => {
    const previousHeight =
      document.body.scrollHeight;

    await fetchProducts();

    setTimeout(() => {
      window.scrollTo({
        top: previousHeight - 300,
        behavior: "smooth",
      });
    }, 100);
  }
);

loadDatabaseCount();
fetchProducts(true);