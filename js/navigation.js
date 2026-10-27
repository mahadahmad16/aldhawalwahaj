document.addEventListener("DOMContentLoaded", () => {

  const menuDefinitions = {
    Products: {
      eyebrow: "PRODUCT CATALOGUE",
      queryKey: "category",
      groups: [
        { title: "Fans", links: ["Ceiling Fan", "Circumatic Fan", "Drum Fan", "Exhaust Fan", "False Ceiling Fan", "Floor Fan", "Mist Fan", "Pedestal Fan", "Wall Fan"] },
        { title: "Ventilation", links: ["Axial Blower", "Duct Fan", "Suction Fan"] },
        { title: "Cooling", links: ["Air Cooler"] },
        { title: "More", links: ["Accessories"] }
      ]
    },
    Brands: {
      eyebrow: "OUR BRANDS",
      description: "Explore products from our trusted fan and ventilation brands.",
      allLabel: "View all brands",
      queryKey: "brand",
      groups: [
        { title: "Fan & ventilation brands", links: ["Belvin Fans", "Classic Fans", "GFC Fans", "GN Fans", "Khaitan Fans", "Yunas Fans"] }
      ]
    }
  };

  const closeMegaMenus = () => {
    document.querySelectorAll(".mega-menu-panel.is-open")
      .forEach(panel => panel.classList.remove("is-open"));
    document.querySelectorAll(".mega-menu-link[aria-expanded='true']")
      .forEach(link => link.setAttribute("aria-expanded", "false"));
  };

  document.querySelectorAll(".site-header, .header").forEach((header, headerIndex) => {
    const navigation = header.querySelector(".main-nav, .nav");

    if (!navigation) {
      return;
    }

    navigation.querySelectorAll("a").forEach(link => {
      const label = link.textContent.trim();
      const definition = menuDefinitions[label];

      if (!definition) {
        return;
      }

      const panelId = `mega-menu-${label.toLowerCase()}-${headerIndex}`;
      const destination = link.getAttribute("href");
      const catalogueLink =
        navigation.querySelector('a[href*="products.html"]')
          ?.getAttribute("href") || destination;
      const itemDestination =
        definition.queryKey === "brand"
          ? catalogueLink
          : destination;

      link.classList.add("mega-menu-link");
      link.setAttribute("aria-haspopup", "true");
      link.setAttribute("aria-expanded", "false");
      link.setAttribute("aria-controls", panelId);

      const groups = definition.groups.map(group => `
        <section class="mega-menu-group">
          <h2>${group.title}</h2>
          ${group.links.map(item => `
            <a href="${itemDestination}?${definition.queryKey}=${encodeURIComponent(item)}">${item}</a>
          `).join("")}
        </section>
      `).join("");

      const panel = document.createElement("section");
      panel.id = panelId;
      panel.className =
        `mega-menu-panel mega-menu-panel--${label.toLowerCase()}`;
      panel.setAttribute("aria-label", `${label} menu`);
      panel.innerHTML = `
        <div class="container mega-menu-content">
          <div class="mega-menu-groups">${groups}</div>
        </div>
      `;

      header.appendChild(panel);

      link.addEventListener("click", event => {
        event.preventDefault();

        const willOpen = !panel.classList.contains("is-open");
        closeMegaMenus();

        if (willOpen) {
          panel.classList.add("is-open");
          link.setAttribute("aria-expanded", "true");

          if (window.matchMedia("(max-width: 900px)").matches) {
            navigation.classList.remove("open");
          }
        }
      });
    });
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".mega-menu-link, .mega-menu-panel")) {
      closeMegaMenus();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMegaMenus();
    }
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        if (!link.classList.contains("mega-menu-link")) {
          nav.classList.remove("open");
        }
      });
    });
  }

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNav");

  if (mobileMenuButton && mobileNav) {
    const mainNav =
      document.querySelector(".main-nav");

    mobileNav.hidden = true;

    mobileMenuButton.addEventListener("click", () => {
      mainNav?.classList.toggle("open");
    });
  }
});
