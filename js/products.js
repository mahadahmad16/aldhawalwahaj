const productsGrid =
  document.getElementById("productsGrid");

const noProducts =
  document.getElementById("noProducts");

const productsCount =
  document.getElementById("productsCount");

const filterStatus =
  document.getElementById("filterStatus");

const productSearch =
  document.getElementById("productSearch");

const sortProducts =
  document.getElementById("sortProducts");

const clearFilters =
  document.getElementById("clearFilters");

const resetProducts =
  document.getElementById("resetProducts");

const productCatalogueStateKey =
  "productCatalogueState";


function saveCatalogueState(scrollY = window.scrollY) {

  sessionStorage.setItem(
    productCatalogueStateKey,
    JSON.stringify({
      search: productSearch.value,
      categories: getSelectedValues(".category-filter"),
      brands: getSelectedValues(".brand-filter"),
      sort: sortProducts.value,
      scrollY
    })
  );

}


function renderFilterOptions(containerId, className, values) {

  const container =
    document.getElementById(containerId);

  values.forEach(value => {

    const label =
      document.createElement("label");

    label.className =
      "filter-option";

    const input =
      document.createElement("input");

    input.type =
      "checkbox";

    input.className =
      className;

    input.value =
      value;

    const text =
      document.createElement("span");

    text.textContent =
      value;

    label.append(input, text);
    container.appendChild(label);

  });

}


renderFilterOptions(
  "categoryFilterOptions",
  "category-filter",
  [...new Set(products.map(product => product.category))]
    .sort((a, b) => a.localeCompare(b))
);

renderFilterOptions(
  "brandFilterOptions",
  "brand-filter",
  [...new Set(
    products
      .map(product => product.brand)
      .filter(Boolean)
  )]
    .sort((a, b) => a.localeCompare(b))
);


function getSelectedValues(selector) {

  return Array.from(
    document.querySelectorAll(
      `${selector}:checked`
    )
  ).map(input => input.value);

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

    const model =
      product.isAccessory
        ? ""
        : `
          <p>
            Model: ${product.model || "Not listed in catalog"}
          </p>
        `;

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

  const search =
    productSearch.value
      .trim()
      .toLowerCase();

  const selectedCategories =
    getSelectedValues(".category-filter");

  const selectedBrands =
    getSelectedValues(".brand-filter");

  saveCatalogueState();

  let filtered =
    products.filter(product => {

      const matchesSearch =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        (product.brand || "")
          .toLowerCase()
          .includes(search) ||
        (product.model &&
          product.model
            .toLowerCase()
            .includes(search)) ||
        product.category
          .toLowerCase()
          .includes(search);


      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(
          product.category
        );


      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(
          product.brand
        );


      return (
        matchesSearch &&
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
      a.brand.localeCompare(b.brand)
    );

  }


  const statusParts = [];


  if (search) {

    statusParts.push(
      `Search: "${productSearch.value.trim()}"`
    );

  }


  if (selectedCategories.length) {

    statusParts.push(
      `${selectedCategories.length} category filter${
        selectedCategories.length > 1
          ? "s"
          : ""
      }`
    );

  }


  if (selectedBrands.length) {

    statusParts.push(
      `${selectedBrands.length} brand filter${
        selectedBrands.length > 1
          ? "s"
          : ""
      }`
    );

  }


  filterStatus.textContent =
    statusParts.length
      ? statusParts.join(" • ")
      : "Showing all products";


  renderProducts(filtered);

}


function clearAllFilters() {

  productSearch.value = "";

  document
    .querySelectorAll(
      ".category-filter, .brand-filter"
    )
    .forEach(input => {
      input.checked = false;
    });

  sortProducts.value = "default";

  applyFilters();

}


productSearch.addEventListener(
  "input",
  applyFilters
);


sortProducts.addEventListener(
  "change",
  applyFilters
);


document
  .querySelectorAll(
    ".category-filter, .brand-filter"
  )
  .forEach(input => {

    input.addEventListener(
      "change",
      applyFilters
    );

  });


clearFilters.addEventListener(
  "click",
  clearAllFilters
);


resetProducts.addEventListener(
  "click",
  clearAllFilters
);


const params =
  new URLSearchParams(
    window.location.search
  );


const category =
  params.get("category");

const brand =
  params.get("brand");

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

  productSearch.value =
    savedCatalogueState.search || "";

  sortProducts.value =
    savedCatalogueState.sort || "default";

  document
    .querySelectorAll(".category-filter")
    .forEach(input => {

      input.checked =
        Array.isArray(savedCatalogueState.categories) &&
        savedCatalogueState.categories.includes(input.value);

    });

  document
    .querySelectorAll(".brand-filter")
    .forEach(input => {

      input.checked =
        Array.isArray(savedCatalogueState.brands) &&
        savedCatalogueState.brands.includes(input.value);

    });

}


if (category || brand) {

  document
    .querySelectorAll(".category-filter")
    .forEach(input => {

      input.checked =
        Boolean(category) &&
        input.value
          .toLowerCase()
          .includes(category.toLowerCase());

    });

  document
    .querySelectorAll(".brand-filter")
    .forEach(input => {

      input.checked =
        Boolean(brand) &&
        input.value === brand;

    });

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
