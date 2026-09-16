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

    card.href =
      `product-details.html?id=${product.id}`;

    card.className =
      "catalogue-product-card";

    card.innerHTML = `
      <div class="catalogue-product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <span>
          ${product.brand}
        </span>

      </div>

      <div class="catalogue-product-content">

        <small>
          ${product.category}
        </small>

        <h3>
          ${product.name}
        </h3>

        <p>
          Model: ${product.model}
        </p>

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


  let filtered =
    products.filter(product => {

      const matchesSearch =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.brand
          .toLowerCase()
          .includes(search) ||
        product.model
          .toLowerCase()
          .includes(search) ||
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


if (category) {

  document
    .querySelectorAll(".category-filter")
    .forEach(input => {

      input.checked =
        input.value === category;

    });

}


if (brand) {

  document
    .querySelectorAll(".brand-filter")
    .forEach(input => {

      input.checked =
        input.value === brand;

    });

}


applyFilters();