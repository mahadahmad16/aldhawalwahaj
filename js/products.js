const productsGrid =
  document.getElementById("productsGrid");

const noProducts =
  document.getElementById("noProducts");

const productsCount =
  document.getElementById("productsCount");

const filterStatus =
  document.getElementById("filterStatus");

const sortProducts =
  document.getElementById("sortProducts");

const resetProducts =
  document.getElementById("resetProducts");

const productCatalogueStateKey =
  "productCatalogueState";

const params =
  new URLSearchParams(
    window.location.search
  );

const category =
  params.get("category");

const brand =
  params.get("brand");


function saveCatalogueState(scrollY = window.scrollY) {

  sessionStorage.setItem(
    productCatalogueStateKey,
    JSON.stringify({
      sort: sortProducts.value,
      scrollY
    })
  );

}

function getUniqueSizes(product) {

  const sizes =
    (product.specifications.Size || "")
      .match(/\d+(?:\.\d+)?/g) || [];

  return [...new Set(sizes)]
    .map(size => `${size}"`)
    .join(", ");

}


function renderProducts(productList) {

  productsGrid.innerHTML = "";

  productsCount.textContent =
    `${productList.length} ${
      productList.length === 1
        ? "product"
        : "products"
    }`;

  if (productList.length === 0) {

    noProducts.classList.add("show");

    return;
  }

  noProducts.classList.remove("show");


  productList.forEach(product => {

    const card =
      document.createElement("a");
    const productDisplayName =
      getProductDisplayName(product);

    card.href =
      `product-details.html?id=${product.id}`;

    card.className =
      `catalogue-product-card${
        product.isAccessory ? " accessory-card" : ""
      }`;

    const brandLogo =
      product.isAccessory
        ? ""
        : `
          <span class="catalogue-brand-logo">
            <img
              src="${brandLogos[product.brand]}"
              alt="${product.brand}"
            >
          </span>
        `;

        const sizeText =
      getUniqueSizes(product);

    const model =
      product.isAccessory
        ? ""
        : product.model
        ? `<p>Model: ${product.model}</p>`
        : sizeText
        ? `<p>Size: ${sizeText}</p>`
        : "";

    card.innerHTML = `
      <div class="catalogue-product-image">

        <img
          src="${product.image}"
          alt="${productDisplayName}"
        >

        ${brandLogo}

      </div>

      <div class="catalogue-product-content">

        <small>
          ${product.category}
        </small>

        <h3>
          ${productDisplayName}
        </h3>

        ${model}

        <strong>
          View product →
        </strong>

      </div>
    `;

    productsGrid.appendChild(card);

  });

}


function applyFilters() {
  saveCatalogueState();

  let filtered =
    products.filter(product => {

      const matchesCategory =
        !category || product.category === category;


      const matchesBrand =
        !brand || product.brand === brand;


      return (
        matchesCategory &&
        matchesBrand
      );

    });


  const sort =
    sortProducts.value;


  if (sort === "name-asc") {

    filtered.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  }


  if (sort === "name-desc") {

    filtered.sort((a, b) =>
      b.name.localeCompare(a.name)
    );

  }


  if (sort === "brand") {

    filtered.sort((a, b) =>
      (a.brand || "").localeCompare(b.brand || "")
    );

  }


  filterStatus.textContent =
    category || brand
      ? `Showing ${category || brand}`
      : "Showing all products";


  renderProducts(filtered);

}


function clearAllFilters() {
  sortProducts.value = "default";

  window.location.href =
    window.location.pathname;

}

sortProducts.addEventListener(
  "change",
  applyFilters
);


resetProducts.addEventListener(
  "click",
  clearAllFilters
);


let savedCatalogueState = null;
const savedCatalogueStateJson =
  sessionStorage.getItem(productCatalogueStateKey);

if (savedCatalogueStateJson) {

  try {

    savedCatalogueState =
      JSON.parse(savedCatalogueStateJson);

  } catch (error) {

    console.error(
      "Unable to restore the saved product catalogue filters.",
      error
    );

  }

}

if (savedCatalogueState) {
  sortProducts.value =
    savedCatalogueState.sort || "default";
}


applyFilters();

const navigationEntry =
  performance.getEntriesByType("navigation")[0];

if (
  (
    navigationEntry?.type === "back_forward" ||
    document.referrer.includes("product-details.html")
  ) &&
  Number.isFinite(savedCatalogueState?.scrollY)
) {

  requestAnimationFrame(() => {
    window.scrollTo(0, savedCatalogueState.scrollY);
  });

}

productsGrid.addEventListener(
  "click",
  event => {

    if (event.target.closest("a.catalogue-product-card")) {
      saveCatalogueState(window.scrollY);
    }

  }
);
