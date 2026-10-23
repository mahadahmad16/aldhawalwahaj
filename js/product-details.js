const params =
  new URLSearchParams(
    window.location.search
  );

const productId =
  params.get("id");


const product =
  products.find(
    item => item.id === productId
  ) || products[0];

const productDisplayName =
  getProductDisplayName(product);

const brandName =
  product.brand.replace(/\s+Fans?$/i, "");


document.title =
  `${productDisplayName} | ${brandName} | Al Dhaw Al Wahaj`;


const productBrandLogo =
  document.getElementById("productBrandLogo");

productBrandLogo.src =
  brandLogos[product.brand];

productBrandLogo.alt =
  `${brandName} logo`;


document.getElementById(
  "breadcrumbProduct"
).textContent =
  productDisplayName;


document.getElementById(
  "productName"
).textContent =
  productDisplayName;


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
  product.model || "Not listed in catalog";


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

const specificationEntries =
  Object.entries(
    product.specifications
  );

const standardSpecificationKeys = [
  "Volts",
  "Watts",
  "Hz",
  "Rpm",
  "Cfm"
];

const additionalSpecificationKeys =
  specificationEntries
    .map(([key]) => key)
    .filter(
      key =>
        key !== "Size" &&
        key !== "mm" &&
        !standardSpecificationKeys.includes(key)
    );

const specificationKeys = [
  ...standardSpecificationKeys.filter(
    key => specificationEntries.some(([entryKey]) => entryKey === key)
  ),
  ...additionalSpecificationKeys
];

const numericOnlyValue = value => {
  const textWithoutAnnotations =
    String(value).replace(/\([^)]*\)/g, "");

  const numericValues =
    textWithoutAnnotations.match(
      /\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)*|—/g
    );

  return numericValues
    ? numericValues.join(", ").replace(/\s*([-/])\s*/g, "$1")
    : "—";
};

const replaceAndWithAmpersand = value =>
  String(value).replace(/\band\b/gi, "&");

specifications.innerHTML = "";

if (!product.hasSpecifications) {

  const message =
    document.createElement("p");

  message.className =
    "specifications-empty";

  message.textContent =
    "No technical specifications are listed in the supplied catalog.";

  specifications.appendChild(message);

}

const specificationTableWrapper =
  document.createElement("div");

specificationTableWrapper.className =
  "specifications-table-wrapper";

const specificationTable =
  document.createElement("table");

specificationTable.className =
  "specifications-table specifications-size-comparison";

const tableHead =
  specificationTable.createTHead().insertRow();

const fallbackSizes =
  (product.specifications.Size.match(/\d+(?:\.\d+)?/g) || [])
    .map(size => `${size}"`);

const sizeVariants =
  product.sizeVariants ||
  (fallbackSizes.length
    ? fallbackSizes.map(size => ({ size }))
    : null);

const tableHeadings =
  [
    "Size",
    ...(sizeVariants?.map(variant => variant.size) || ["Details"])
  ].map(replaceAndWithAmpersand);

tableHeadings.forEach(label => {

  const heading =
    document.createElement("th");

  heading.scope =
    "col";

  heading.textContent =
    label;

  tableHead.appendChild(heading);

});

const tableBody =
  specificationTable.createTBody();

const tableRows =
  specificationKeys.map(key => [
    key,
    ...(sizeVariants
      ? sizeVariants.map(
          variant => variant[key] || "—"
        )
      : [product.specifications[key] || "—"])
  ]);

tableRows.forEach(([key, ...values]) => {

  const tableRow =
    tableBody.insertRow();

  const heading =
    document.createElement("th");

  heading.scope =
    "row";

  heading.textContent =
    replaceAndWithAmpersand(key);

  tableRow.appendChild(heading);

  values.forEach(valueText => {

    const value =
      tableRow.insertCell();

    value.textContent =
      replaceAndWithAmpersand(
        standardSpecificationKeys.includes(key)
          ? numericOnlyValue(valueText)
          : valueText
      );

  });

});

specificationTableWrapper.appendChild(specificationTable);
specifications.appendChild(specificationTableWrapper);


const features =
  document.getElementById(
    "productFeatures"
  );

const featureSection =
  document.querySelector(
    ".product-features-section"
  );

features.innerHTML = "";

featureSection.hidden =
  product.features.length === 0;

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
  const relatedProductDisplayName =
    getProductDisplayName(item);

  card.href =
    `product-details.html?id=${item.id}`;

  card.className =
    "related-product-card";

  card.innerHTML = `
    <div class="related-product-image">

      <img
        src="${item.image}"
        alt="${relatedProductDisplayName}"
      >

    </div>

    <div class="related-product-content">

      <span class="related-product-brand">
        <img
          src="${brandLogos[item.brand]}"
          alt="${item.brand}"
        >
      </span>

      <h3>
        ${relatedProductDisplayName}
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