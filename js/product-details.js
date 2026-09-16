const params =
  new URLSearchParams(
    window.location.search
  );

const productId =
  params.get("id") ||
  "gn-royal-56";


const product =
  products.find(
    item => item.id === productId
  ) || products[0];


document.title =
  `${product.name} | Al Dhaw Al Wahaj`;


document.getElementById(
  "breadcrumbProduct"
).textContent =
  product.name;


document.getElementById(
  "productBrand"
).textContent =
  product.brand;


document.getElementById(
  "productName"
).textContent =
  product.name;


document.getElementById(
  "productDescription"
).textContent =
  product.description;


document.getElementById(
  "productType"
).textContent =
  product.category;


document.getElementById(
  "productModel"
).textContent =
  product.model;


document.getElementById(
  "productCategory"
).textContent =
  product.category;


const productImage =
  document.getElementById(
    "productImage"
  );


productImage.src =
  product.image;


productImage.alt =
  product.name;


const thumbnailImage =
  document.getElementById(
    "thumbnailImage"
  );


thumbnailImage.src =
  product.image;


thumbnailImage.alt =
  `${product.name} thumbnail`;


const specifications =
  document.getElementById(
    "specifications"
  );


specifications.innerHTML = "";


Object.entries(
  product.specifications
).forEach(([key, value]) => {

  const item =
    document.createElement("div");

  item.className =
    "specification-row";

  item.innerHTML = `
    <span>
      ${key}
    </span>

    <strong>
      ${value}
    </strong>
  `;

  specifications.appendChild(item);

});


const features =
  document.getElementById(
    "productFeatures"
  );


features.innerHTML = "";


product.features.forEach(
  (feature, index) => {

    const item =
      document.createElement("article");

    item.className =
      "product-feature-card";

    item.innerHTML = `
      <span>
        0${index + 1}
      </span>

      <h3>
        ${feature.title}
      </h3>

      <p>
        ${feature.text}
      </p>
    `;

    features.appendChild(item);

  }
);


const relatedProducts =
  document.getElementById(
    "relatedProducts"
  );


relatedProducts.innerHTML = "";


const related =
  products
    .filter(item =>
      item.id !== product.id &&
      (
        item.brand === product.brand ||
        item.category === product.category
      )
    )
    .slice(0, 3);


related.forEach(item => {

  const card =
    document.createElement("a");

  card.href =
    `product-details.html?id=${item.id}`;

  card.className =
    "related-product-card";

  card.innerHTML = `
    <div class="related-product-image">

      <img
        src="${item.image}"
        alt="${item.name}"
      >

    </div>

    <div class="related-product-content">

      <span>
        ${item.brand}
      </span>

      <h3>
        ${item.name}
      </h3>

      <p>
        ${item.category}
      </p>

      <strong>
        View product →
      </strong>

    </div>
  `;

  relatedProducts.appendChild(card);

});