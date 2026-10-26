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
  product.brand
    ? product.brand.replace(/\s+Fans?$/i, "")
    : "Accessories";


document.title =
  product.isAccessory
    ? `${productDisplayName} | Al Dhaw Al Wahaj`
    : `${productDisplayName} | ${brandName} | Al Dhaw Al Wahaj`;


const productBrandLogo =
  document.getElementById("productBrandLogo");

if (product.isAccessory) {
  productBrandLogo.closest(".product-brand-display").hidden = true;
} else {
  productBrandLogo.src =
    brandLogos[product.brand];

  productBrandLogo.alt =
    `${brandName} logo`;
}


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


const productModel =
  document.getElementById("productModel");

productModel.textContent =
  product.model || "Not listed in catalog";

if (product.isAccessory) {
  productModel.parentElement.hidden = true;
}


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

if (product.isAccessory) {
  document.querySelector(".product-detail-heading").hidden = true;
  specifications.hidden = true;
}

const fallbackSizes =
  (product.specifications.Size.match(/\d+(?:\.\d+)?/g) || [])
    .map(size => `${size}"`);

const sizeVariants =
  product.sizeVariants ||
  (fallbackSizes.length
    ? fallbackSizes.map(size => ({ size }))
    : null);

const specificationEntries =
  Object.entries(
    product.specifications
  );

const standardSpecificationKeys = [
  "mm",
  "Volts",
  "Watts",
  "Hz",
  "Rpm",
  "Cfm"
];

const variantSpecificationKeys =
  sizeVariants
    ? sizeVariants.flatMap(variant => Object.keys(variant))
    : [];

const availableSpecificationKeys =
  new Set([
    ...specificationEntries.map(([key]) => key),
    ...variantSpecificationKeys
  ]);

const additionalSpecificationKeys =
  [...availableSpecificationKeys]
    .filter(
      key =>
        key !== "Size" &&
        key !== "size" &&
        key !== "mm" &&
        !standardSpecificationKeys.includes(key)
    );

const specificationKeys = [
  ...standardSpecificationKeys.filter(
    key =>
      variantSpecificationKeys.includes(key) ||
      specificationEntries.some(
        ([entryKey, value]) =>
        entryKey === key && value !== "—"
    )
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
    replaceAndWithAmpersand(
      key === "mm" ? "mm" : key
    );

  tableRow.appendChild(heading);

  if (
    key === "Available Colors" &&
    values.length > 1 &&
    values.every(valueText => valueText === values[0])
  ) {
    const value =
      tableRow.insertCell();

    value.colSpan =
      values.length;

    value.textContent =
      replaceAndWithAmpersand(values[0]);

    return;
  }

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

if (product.id === "gn-fans-gn-industrial-suction-fan") {

  const industrialSuctionColumns = [
    ["Size (mm)", "Size (mm)"],
    ["Volts", "Volts"],
    ["Watts", "Watts"],
    ["Hz", "Hz"],
    ["Kg", "Kg"],
    ["Rpm", "Rpm"],
    ["m³/h", "m³/h"],
    ["Blade Size (inch)", "Blade Size (inch)"]
  ];

  specificationTable.innerHTML = "";
  specificationTable.className =
    "specifications-table specifications-industrial-suction";

  const industrialSuctionHead =
    specificationTable.createTHead().insertRow();

  industrialSuctionColumns.forEach(([label]) => {

    const heading =
      document.createElement("th");

    heading.scope = "col";
    heading.textContent = label;
    industrialSuctionHead.appendChild(heading);

  });

  const industrialSuctionBody =
    specificationTable.createTBody();

  sizeVariants.forEach(variant => {

    const row =
      industrialSuctionBody.insertRow();

    industrialSuctionColumns.forEach(([, key]) => {

      const cell =
        row.insertCell();

      cell.textContent =
        variant[key] || "—";

    });

  });

}

if (product.id === "gn-fans-gn-duct-fan") {

  specificationTable.innerHTML = "";

  const ductSizeHead =
    specificationTable.createTHead().insertRow();

  [
    "Size",
    ...sizeVariants.map(variant => variant.size)
  ].forEach(label => {

    const heading =
      document.createElement("th");

    heading.scope = "col";
    heading.textContent = label;
    ductSizeHead.appendChild(heading);

  });

}

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

  const relatedBrand =
    item.isAccessory
      ? ""
      : `
        <span class="related-product-brand">
          <img
            src="${brandLogos[item.brand]}"
            alt="${item.brand}"
          >
        </span>
      `;

  card.innerHTML = `
    <div class="related-product-image">

      <img
        src="${item.image}"
        alt="${relatedProductDisplayName}"
      >

    </div>

    <div class="related-product-content">

      ${relatedBrand}

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
