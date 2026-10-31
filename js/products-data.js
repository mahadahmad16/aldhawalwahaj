const formatUnitValue = (value, unit) =>
  value
    ? value
        .replace(new RegExp(`\\s*${unit}\\b`, "gi"), "")
        .trim()
    : "—";

const createSizeVariants = (sourceSpecifications, specifications) => {
  const sizeText =
    sourceSpecifications.Size ||
    sourceSpecifications["Available Sizes"] ||
    sourceSpecifications["Available Blade Sizes"] ||
    "";

  const sizes =
    sizeText.match(/\d+(?:\.\d+)?/g) || [];

  if (!sizes.length) {
    return null;
  }

  const variantLabels = sizes.map((size, index) => {
    const duplicateIndex =
      sizes.slice(0, index).filter(value => value === size).length;

    return `${size}"${
      duplicateIndex
        ? ` (${duplicateIndex + 1})`
        : ""
    }`;
  });

  const valuesBySpecification = {
    Volts: specifications.Volts,
    Watts: specifications.Watts,
    Hz: specifications.Hz,
    Rpm: specifications.Rpm,
    Cfm: specifications.Cfm,
    ...Object.fromEntries(
      Object.entries(specifications).filter(
        ([key]) =>
          !["Size", "mm", "Volts", "Watts", "Hz", "Rpm", "Cfm"].includes(key)
      )
    )
  };

  return sizes.map((size, variantIndex) => {
    const variant = {
      size: variantLabels[variantIndex],
      mm:
        (specifications.mm || "").split(/\s*,\s*/)[variantIndex] ||
        "—"
    };

    Object.entries(valuesBySpecification).forEach(([key, value]) => {
      if (!value || value === "—") {
        variant[key] = "—";
        return;
      }

      const segments = value
        .split(/\s*;\s*/)
        .map(segment => segment.trim())
        .filter(Boolean);

      const matchingSegments = segments.filter(segment => {
        const annotatedSizes = [
          ...segment.matchAll(/\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/gi)
        ].map(match => match[1]);

        return annotatedSizes.length
          ? annotatedSizes.includes(size)
          : true;
      });

      variant[key] =
        matchingSegments.length
          ? matchingSegments.join("; ")
          : "—";
    });

    return variant;
  });
};

const getProductDisplayName = product => {
  if (!product.brand) {
    return product.name;
  }

  const brandName =
    product.brand.replace(/\s+Fans?$/i, "");

  return product.name
    .replace(new RegExp(`^${brandName}\\s+`, "i"), "")
    .replace(/\d+(?:[.,]\d+)*(?:\s*(?:v|w|rpm|cfm))?/gi, "")
    .replace(/\band\b/gi, "")
    .replace(/\s*[-–—,]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const brandLogos = {
  "Belvin Fans": "../assets/Logos/Logo Belvin.png",
  "Classic Fans": "../assets/Logos/Logo Classic.png",
  "GFC Fans": "../assets/Logos/Logo GFC.png",
  "GN Fans": "../assets/Logos/Logo GN.png",
  "Khaitan Fans": "../assets/Logos/Logo Khaitan.png",
  "Yunas Fans": "../assets/Logos/Logo Yunas.png",
  "Pak MI": "../assets/Logos/Logo Pak MI.png"
};

const createProduct = (
  name,
  brand,
  category,
  image,
  specifications = {},
  model = null,
  sizeVariants = null
) => {
  const size =
    specifications.Size ||
    specifications["Available Sizes"] ||
    specifications["Available Blade Sizes"] ||
    "";

  const sizes =
    size.match(/\d+(?:\.\d+)?/g) || [];

  const normalizedSpecifications = {
    Size: sizes.length
      ? sizes.map(value => `${value}"`).join(", ")
      : "—",
    ...(specifications.mm ? { mm: specifications.mm } : {}),
    Volts: formatUnitValue(specifications.Voltage, "V"),
    Watts: formatUnitValue(specifications.Power, "W"),
    Hz: formatUnitValue(specifications.Frequency, "Hz"),
    Rpm: formatUnitValue(specifications.Speed, "RPM"),
    Cfm:
      specifications.Airflow &&
      /\bCFM\b/i.test(specifications.Airflow)
        ? formatUnitValue(specifications.Airflow, "CFM")
        : "—",
    ...Object.fromEntries(
      Object.entries(specifications).filter(
        ([key]) =>
          ![
            "Size",
            "Available Sizes",
            "Available Blade Sizes",
            "mm",
            "Voltage",
            "Power",
            "Frequency",
            "Speed",
            "Airflow"
          ].includes(key)
      )
    ),
    ...(specifications.Airflow &&
    !/\bCFM\b/i.test(specifications.Airflow)
      ? { Airflow: specifications.Airflow }
      : {})
  };

  return {
    id: `${brand || "accessory"}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name,
    brand,
    isAccessory: !brand,
    model,
    category,
    image: `../assets/Fans/${image}`,
    hasSpecifications: Object.keys(specifications).length > 0,
    description: !brand
      ? "Accessory product. Contact us for availability and compatibility details."
      : Object.keys(specifications).length
      ? "Technical details listed below are taken from the supplied product catalog."
      : "The supplied catalog does not list technical specifications for this product. Contact us to confirm its details.",
    sizeVariants: sizeVariants
      ? sizeVariants.map((variant, index) => ({
          ...variant,
          mm:
            variant.mm ||
            (specifications.mm || "").split(/\s*,\s*/)[index] ||
            "—"
        }))
      : createSizeVariants(specifications, normalizedSpecifications),
    specifications: normalizedSpecifications,
    features: []
  };
};

const products = [

  /* =========================
     GFC FANS
     ========================= */

  createProduct(
    "GFC Axial Blower 8, 10 and 12",
    "GFC Fans",
    "Axial Blower",
    "GFC/Axial Blower/GFC Axial Blower 8 10 12.png",
    {
      "Available Sizes": "8, 10, 12 and 12 inch",
      mm: "200, 250, 300, 300",
      Voltage: "220-240 V (8, 10 and 12 inch); 110 V (12 inch)",
      Power: "250 W (8 inch); 320 W (10 inch); 520 W (12 inch)",
      Frequency: "50/60 Hz (8, 10 and 12 inch); 60 Hz (110 V option)",
      Speed: "2900/3300 RPM (8, 10 and 12 inch); 3300 RPM (110 V option)",
      Airflow: "850 CFM (8 inch); 1520 CFM (10 inch); 2295 CFM (12 inch)"
    },
    null,
    [
      {
        size: '8"',
        mm: "200",
        Volts: "220-240 V",
        Watts: "250 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "850 CFM"
      },
      {
        size: '10"',
        mm: "250",
        Volts: "220-240 V",
        Watts: "320 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "1520 CFM"
      },
      {
        size: '12"',
        mm: "300",
        Volts: "220-240 V",
        Watts: "520 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "2295 CFM"
      },
      {
        size: '12"',
        mm: "300",
        Volts: "110 V",
        Watts: "520 W",
        Hz: "60 Hz",
        Rpm: "3300 RPM",
        Cfm: "2295 CFM"
      }
    ]
  ),
  createProduct(
    "GFC Axial Blower 16 and 18",
    "GFC Fans",
    "Axial Blower",
    "GFC/Axial Blower/GFC Axial Blower 16 18.png",
    {
      "Available Sizes": "16, 16 and 18 inch",
      mm: "400, 400, 450",
      Voltage: "220-240 V (16 and 18 inch); 110 V (16 inch)",
      Power: "1100 W (16 inch); 1500 W (18 inch)",
      Frequency: "50/60 Hz (220-240 V); 60 Hz (110 V)",
      Speed: "2900/3300 RPM (220-240 V); 3300 RPM (110 V)",
      Airflow: "3390 CFM (16 inch); 5720 CFM (18 inch)"
    },
    null,
    [
      {
        size: '16"',
        mm: "400",
        Volts: "220-240",
        Watts: "1100",
        Hz: "50/60",
        Rpm: "2900/3300",
        Cfm: "3390"
      },
      {
        size: '16"',
        mm: "400",
        Volts: "110",
        Watts: "1100",
        Hz: "60",
        Rpm: "3300",
        Cfm: "3390"
      },
      {
        size: '18"',
        mm: "450",
        Volts: "220-240",
        Watts: "1500",
        Hz: "50/60",
        Rpm: "2900/3300",
        Cfm: "5720"
      }
    ]
  ),
  createProduct(
    "GFC Axial Blower 24",
    "GFC Fans",
    "Axial Blower",
    "GFC/Axial Blower/GFC Axial Blower 24.png",
    {
      "Available Sizes": "20 and 24 inch",
      mm: "500, 600",
      Voltage: "220 V (20 and 24 inch); 380 V (24 inch option)",
      Power: "2000 W (20 inch); 2200 W (24 inch)",
      Frequency: "50 Hz",
      Speed: "3300 RPM (20 inch); 1400 RPM (24 inch)",
      Airflow: "6800 CFM (20 inch); 10250 CFM (24 inch)"
    },
    null,
    [
      {
        size: '20"',
        mm: "500",
        Volts: "220",
        Watts: "2000",
        Hz: "50",
        Rpm: "3300",
        Cfm: "6800"
      },
      {
        size: '24"',
        mm: "600",
        Volts: "220",
        Watts: "2200",
        Hz: "50",
        Rpm: "1400",
        Cfm: "10250"
      },
      {
        size: '24"',
        mm: "600",
        Volts: "380",
        Watts: "2200",
        Hz: "50",
        Rpm: "1400",
        Cfm: "10250"
      }
    ]
  ),
  createProduct(
    "GFC AC/DC Ceiling Fan",
    "GFC Fans",
    "Ceiling Fan",
    "GFC/Ceiling/GFC Ceiling AC DC.png",
    {
      Size: "56 inch",
      mm: "1400",
      Voltage: "220 V AC / 12 V DC",
      Power: "30 W",
      Speed: "330 RPM (AC); 325 RPM (DC)",
      Airflow: "8825 CFM",
      "Available Colors": "White, Brown and Black"
    }, "Awami", [
      {
        size: "AC",
        mm: "1400",
        Volts: "220 V",
        Watts: "30 W",
        Rpm: "330 RPM",
        Cfm: "8825 CFM",
        "Available Colors": "White, Brown and Black"
      },
      {
        size: "DC",
        mm: "1400",
        Volts: "12 V",
        Watts: "30 W",
        Rpm: "325 RPM",
        Cfm: "8825 CFM",
        "Available Colors": "White, Brown and Black"
      }
    ]
  ),
  createProduct(
    "GFC Ceiling Fan Awami",
    "GFC Fans",
    "Ceiling Fan",
    "GFC/Ceiling/GFC Ceiling Awami.png",
    {
      Size: "56 inch",
      mm: "1400",
      Voltage: "220 V",
      Power: "80 W",
      Frequency: "50 Hz",
      Speed: "330 RPM",
      Airflow: "8825 CFM"
    },
    "Awami"
  ),
  createProduct(
    "GFC Ceiling Fan Galaxy",
    "GFC Fans",
    "Ceiling Fan",
    "GFC/Ceiling/GFC Ceiling Galaxy.png",
    {
      Size: "56 inch",
      mm: "1400",
      Voltage: "220 V",
      Power: "80 W",
      Frequency: "50 Hz",
      Speed: "330 RPM",
      Airflow: "8825 CFM"
    },
    "Galaxy"
  ),
  createProduct(
    "GFC Ceiling Fan VIP Old Plus",
    "GFC Fans",
    "Ceiling Fan",
    "GFC/Ceiling/GFC Ceiling VIP.png",
    {
      Size: "56 inch",
      mm: "1400",
      Voltage: "220 V",
      Power: "80 W",
      Frequency: "50 Hz",
      Speed: "330 RPM",
      Airflow: "8825 CFM"
    },
    "VIP Old Plus"
  ),
  createProduct(
    "GFC Circumatic Fan",
    "GFC Fans",
    "Circumatic Fan",
    "GFC/Cirumatic/GFC Circumatic.png",
    {
      "Available Sizes": "16 and 18 inch",
      mm: "400, 460"
    },
    null,
    [
      {
        size: '16"',
        mm: "400",
        Volts: "230",
        Watts: "55",
        Hz: "50",
        Rpm: "1475",
        Cfm: "1589"
      },
      {
        size: '18"',
        mm: "460",
        Volts: "230",
        Watts: "65",
        Hz: "50",
        Rpm: "1475",
        Cfm: "2473"
      }
    ]
  ),
  createProduct(
    "GFC False Ceiling Fan",
    "GFC Fans",
    "False Ceiling Fan",
    "GFC/Ceiling/False Ceiling Fan.jpeg",
    {
      Lighting: "With or without LED"
    }
  ),
  createProduct(
    "GFC PVC Flexible Duct",
    "GFC Fans",
    "Axial Blower",
    "GFC/Axial Blower/Flexible Duct.jpeg",
    {
      "Available Sizes": "8, 10, 12, 16, 18, 20 and 24 inch"
    }
  ),
  createProduct(
    "GFC Air Cooler 6600",
    "GFC Fans",
    "Air Cooler",
    "GFC/Cooler & Mist/GFC Cooler 6600.png",
    {
      Volts: "220-240",
      Watts: "255",
      Hz: "50/60",
      Rpm: "1400",
      Cfm: "7850",
      "Water Tank": "65 L"
    },
    "6600"
  ),
  createProduct(
    "GFC Air Cooler 7700",
    "GFC Fans",
    "Air Cooler",
    "GFC/Cooler & Mist/GFC Cooler 7700.png",
    {
      Voltage: "220-240 V",
      Power: "255 W",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "7850 CFM",
      "Water Tank": "85 L"
    },
    "7700"
  ),
  createProduct(
    "GFC Misting Pedestal Fan",
    "GFC Fans",
    "Mist Fan",
    "GFC/Cooler & Mist/GFC Mist Pedestal.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "150 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "6200 CFM",
      "Water Tank": "25 L"
    }
  ),
  createProduct(
    "GFC Industrial Exhaust Fan",
    "GFC Fans",
    "Exhaust Fan",
    "GFC/Exhaust/GFC Exhaust Industrial.png",
    {
      "Available Sizes": "9, 12, 16, 18 and 24 inch",
      mm: "230, 300, 400, 460, 600",
      Voltage: "220-240 V; 380 V (24 inch option)",
      Power: "50 W (9 inch); 100 W (12 inch); 165 W (16 inch); 230 W (18 inch); 700 W (24 inch)",
      Frequency: "50 Hz (9 inch); 50/60 Hz (other sizes)",
      Speed: "1400 RPM",
      Airflow: "530 CFM (9 inch); 1060 CFM (12 inch); 1695 CFM (16 inch); 2895 CFM (18 inch); 6920 CFM (24 inch)"
    },
    null,
    [
      { size: '9"', mm: "230", Volts: "220-240", Watts: "50", Hz: "50/60", Rpm: "1400", Cfm: "530" },
      { size: '12"', mm: "300", Volts: "220-240", Watts: "100", Hz: "50/60", Rpm: "1400", Cfm: "1060" },
      { size: '16"', mm: "400", Volts: "220-240", Watts: "165", Hz: "50/60", Rpm: "1400", Cfm: "1695" },
      { size: '18"', mm: "460", Volts: "220-240", Watts: "230", Hz: "50/60", Rpm: "1400", Cfm: "2895" },
      { size: '24"', mm: "600", Volts: "220-240", Watts: "700", Hz: "50/60", Rpm: "1400", Cfm: "6920" },
      { size: '24"', mm: "600", Volts: "380", Watts: "700", Hz: "50/60", Rpm: "1400", Cfm: "6920" }
    ]
  ),
  createProduct(
    "GFC Metal Exhaust Fan",
    "GFC Fans",
    "Exhaust Fan",
    "GFC/Exhaust/GFC Exhaust Metal.png",
    {
      "Available Sizes": "12, 16, 18 and 24 inch",
      mm: "300, 400, 460, 600",
      Voltage: "220-240 V",
      Power: "100 W (12 inch); 150 W (16 inch); 175 W (18 inch); 230 W (24 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "1060 CFM (12 inch); 1525 CFM (16 inch); 2495 CFM (18 inch); 5340 CFM (24 inch)"
    },
    null,
    [
      { size: '12"', mm: "300", Volts: "220-240", Watts: "100", Hz: "50/60", Rpm: "1400", Cfm: "1060" },
      { size: '16"', mm: "400", Volts: "220-240", Watts: "150", Hz: "50/60", Rpm: "1400", Cfm: "1525" },
      { size: '18"', mm: "460", Volts: "220-240", Watts: "175", Hz: "50/60", Rpm: "1400", Cfm: "2495" },
      { size: '24"', mm: "600", Volts: "220-240", Watts: "230", Hz: "50/60", Rpm: "1400", Cfm: "5340" }
    ]
  ),
  createProduct(
    "GFC Louver Pedestal Fan",
    "GFC Fans",
    "Pedestal Fan",
    "GFC/Louver/GFC Louver Pedestal.png",
    {
      Size: "14 inch",
      mm: "355",
      Voltage: "220 V",
      Power: "60 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "2030 CFM",
      "Control options": "Manual or with remote"
    }
  ),
  createProduct(
    "GFC Louver Wall Fan",
    "GFC Fans",
    "Wall Fan",
    "GFC/Louver/GFC Louver Wall.png",
    {
      Size: "14 inch",
      mm: "355",
      Voltage: "220 V",
      Power: "60 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "2030 CFM",
      "Control options": "Manual or with remote"
    }
  ),
  createProduct(
    "GFC Pedestal Fan 110V",
    "GFC Fans",
    "Pedestal Fan",
    "GFC/Pedestal/GFC Pedestal 110.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "110 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "6000 CFM"
    }
  ),
  createProduct(
    "GFC Industrial Pedestal Fan",
    "GFC Fans",
    "Pedestal Fan",
    "GFC/Pedestal/GFC Pedestal Industrial.png",
    {
      "Available Sizes": "24, 26 and 30 inch",
      mm: "600, 650, 760",
      Voltage: "220-240 V",
      Power: "150 W (24 inch); 230 W (26 inch); 350 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "6380 CFM (24 inch); 7068 CFM (26 inch); 10000 CFM (30 inch)"
    }
  ),
  createProduct(
    "GFC Pedestal Fan Special",
    "GFC Fans",
    "Pedestal Fan",
    "GFC/Pedestal/GFC Pedestal Special.png",
    {
      "Available Sizes": "24 and 30 inch",
      mm: "600, 760",
      Voltage: "220 V",
      Power: "125 W (24 inch); 280 W (30 inch)",
      Frequency: "50 Hz",
      Speed: "1475 RPM (24 inch); 1350 RPM (30 inch)",
      Airflow: "6003 CFM (24 inch); 12500 CFM (30 inch)"
    }
  ),
  createProduct(
    "GFC Pedestal Fan",
    "GFC Fans",
    "Pedestal Fan",
    "GFC/Pedestal/GFC Pedestal.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "4875 CFM"
    }
  ),
  createProduct(
    "GFC Industrial Wall Fan",
    "GFC Fans",
    "Wall Fan",
    "GFC/Wall/GFC Wall Inusdtrial.png",
    {
      "Available Sizes": "18, 24, 26 and 30 inch",
      mm: "460, 600, 650, 760",
      Voltage: "220-240 V",
      Power: "130 W (18 inch); 150 W (24 inch); 230 W (26 inch); 350 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "4175 CFM (18 inch); 6380 CFM (24 inch); 7068 CFM (26 inch); 10000 CFM (30 inch)"
    }
  ),
  createProduct(
    "GFC Wall Fan Myga",
    "GFC Fans",
    "Wall Fan",
    "GFC/Wall/GFC Wall Myga.png",
    {
      "Available Sizes": "24 and 30 inch",
      mm: "600, 760",
      Voltage: "220 V",
      Power: "125 W (24 inch); 280 W (30 inch)",
      Frequency: "50 Hz",
      Speed: "1475 RPM (24 inch); 1350 RPM (30 inch)",
      Airflow: "6003 CFM (24 inch); 12500 CFM (30 inch)"
    },
    "Myga"
  ),
  createProduct(
    "GFC Wall Fan",
    "GFC Fans",
    "Wall Fan",
    "GFC/Wall/GFC Wall.png",
    {
      "Available Sizes": "16 and 18 inch",
      mm: "400, 460",
      Voltage: "230 V",
      Power: "55 W (16 inch); 65 W (18 inch)",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "1589 CFM (16 inch); 2473 CFM (18 inch)"
    }
  ),


  /* =========================
     GN FANS
     ========================= */

  createProduct(
    "GN Drum Fan",
    "GN Fans",
    "Drum Fan",
    "GN/GN Drum.png",
    {
      "Available Sizes": "24, 30, 36 and 48 inch",
      mm: "600, 750, 915, 1200",
      Voltage: "220-240 V",
      Power: "250 W (24 inch); 400 W (30 inch); 500 W (36 inch); 600 W (48 inch)",
      Frequency: "50/60 Hz",
      Speed: "1250 RPM (24 inch); 1000 RPM (30 inch); 885 RPM (36 inch); 445 RPM (48 inch)",
      "m³/h": "11462 (24 inch); 17243 (30 inch); 18880 (36 inch); 20100 (48 inch)"
    },
    null,
    [
      { size: '24"', mm: "600", Volts: "220-240", Watts: "250", Hz: "50/60", Rpm: "1250", "m³/h": "11462" },
      { size: '30"', mm: "750", Volts: "220-240", Watts: "400", Hz: "50/60", Rpm: "1000", "m³/h": "17243" },
      { size: '36"', mm: "915", Volts: "220-240", Watts: "500", Hz: "50/60", Rpm: "885", "m³/h": "18880" },
      { size: '48"', mm: "1200", Volts: "220-240", Watts: "600", Hz: "50/60", Rpm: "445", "m³/h": "20100" }
    ]
  ),
  createProduct(
    "GN Floor Fan",
    "GN Fans",
    "Floor Fan",
    "GN/GN Floor.png",
    {
      "Available Sizes": "12, 16, 18 and 20 inch",
      mm: "300, 400, 450, 500",
      Voltage: "220-240 V",
      Power: "60 W (12 inch); 100 W (16 inch); 120 W (18 inch); 150 W (20 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "1275 CFM (12 inch); 2675 CFM (16 inch); 3355 CFM (18 inch); 3885 CFM (20 inch)"
    },
    null,
    [
      { size: '12"', mm: "300", Volts: "220-240", Watts: "60", Hz: "50/60", Rpm: "1400", Cfm: "1275" },
      { size: '16"', mm: "400", Volts: "220-240", Watts: "100", Hz: "50/60", Rpm: "1400", Cfm: "2675" },
      { size: '18"', mm: "450", Volts: "220-240", Watts: "120", Hz: "50/60", Rpm: "1400", Cfm: "3355" },
      { size: '20"', mm: "500", Volts: "220-240", Watts: "150", Hz: "50/60", Rpm: "1400", Cfm: "3885" }
    ]
  ),
  createProduct(
    "GN Inline Duct Fan",
    "GN Fans",
    "Axial Blower",
    "GN/GN Inline.png",
    {
      "Available Sizes": "4 and 6 inch",
      mm: "100, 150",
      Voltage: "220-240 V",
      Power: "40 W (4 inch); 50 W (6 inch)",
      Frequency: "50/60 Hz",
      Speed: "2800 RPM",
      Airflow: "310 CFM (4 inch); 540 CFM (6 inch)"
    },
    null,
    [
      { size: '4"', mm: "100", Volts: "220-240", Watts: "40", Hz: "50/60", Rpm: "2800", Cfm: "310" },
      { size: '6"', mm: "150", Volts: "220-240", Watts: "50", Hz: "50/60", Rpm: "2800", Cfm: "540" }
    ]
  ),
  createProduct(
    "GN Misting Pedestal Fan",
    "GN Fans",
    "Mist Fan",
    "GN/GN Mist Pedestal.png",
    {
      Size: "26 inch",
      mm: "660",
      Voltage: "110 V",
      Power: "260 W",
      Frequency: "60 Hz",
      Speed: "1400 RPM",
      Airflow: "8710 CFM",
      "Water Tank": "41 L"
    }
  ),
  createProduct(
    "GN Industrial Suction Fan",
    "GN Fans",
    "Suction Fan",
    "GN/GN Suction.png",
    {
      "Available Blade Sizes": "28, 30, 32, 42 and 48 inch",
      Voltage: "220 V (28 and 30 inch); 380 V (32, 42 and 48 inch)",
      Power: "250 W (28 inch); 275 W (30 inch); 365 W (32 inch); 370 W (42 inch); 750 W (48 inch)",
      Frequency: "50/60 Hz (28 and 30 inch); 50 Hz (32, 42 and 48 inch)",
      Speed: "550 RPM (28, 30 and 32 inch); 400 RPM (42 and 48 inch)",
      "Size (mm)": "800x800x350 (28 inch); 900x900x350 (30 inch); 1000x1000x400 (32 inch); 1220x1220x400 (42 inch); 1380x1380x400 (48 inch)",
      Kg: "22.0 (28 inch); 25.0 (30 inch); 27.6 (32 inch); 35.1 (42 inch); 42.6 (48 inch)",
      "m³/h": "13600 (28 inch); 19480 (30 inch); 22550 (32 inch); 37720 (42 inch); 45365 (48 inch)",
      "Blade Size (inch)": "28 (28 inch); 30 (30 inch); 32 (32 inch); 42 (42 inch); 48 (48 inch)"
    },
    null,
    [
      { size: '28"', "Size (mm)": "800x800x350", Volts: "220", Watts: "250", Hz: "50/60", Kg: "22.0", Rpm: "550", "m³/h": "13600", "Blade Size (inch)": "28" },
      { size: '30"', "Size (mm)": "900x900x350", Volts: "220", Watts: "275", Hz: "50/60", Kg: "25.0", Rpm: "550", "m³/h": "19480", "Blade Size (inch)": "30" },
      { size: '32"', "Size (mm)": "1000x1000x400", Volts: "380", Watts: "365", Hz: "50", Kg: "27.6", Rpm: "550", "m³/h": "22550", "Blade Size (inch)": "32" },
      { size: '42"', "Size (mm)": "1220x1220x400", Volts: "380", Watts: "370", Hz: "50", Kg: "35.1", Rpm: "440", "m³/h": "37720", "Blade Size (inch)": "42" },
      { size: '48"', "Size (mm)": "1380x1380x400", Volts: "380", Watts: "750", Hz: "50", Kg: "42.6", Rpm: "400", "m³/h": "45365", "Blade Size (inch)": "48" }
    ]
  ),
  createProduct(
    "GN Axial Blower 12",
    "GN Fans",
    "Axial Blower",
    "GN/Axial Blower/GN Axial Blower 12.png",
    {
      Size: "12 inch",
      mm: "300",
      Voltage: "220-240 V",
      Power: "550 W",
      Frequency: "50/60 Hz",
      Speed: "2800 RPM",
      Airflow: "2300 CFM (220-240 V); 2720 CFM (110 V option)"
    },
    null,
    [
      { size: '12"', mm: "300", Volts: "220-240", Watts: "550", Hz: "50/60", Rpm: "2800", Cfm: "2300" },
      { size: '12"', mm: "300", Volts: "110", Watts: "520", Hz: "60", Rpm: "3300", Cfm: "2720" }
    ]
  ),
  createProduct(
    "GN Axial Blower 16 and 18",
    "GN Fans",
    "Axial Blower",
    "GN/Axial Blower/GN Axial Blower 16 18.png",
    {
      "Available Sizes": "16 and 18 inch",
      mm: "400, 450",
      Voltage: "220-240 V (16 and 18 inch); 110 V (16 inch)",
      Power: "1100 W (16 inch); 1800 W (18 inch); 750 W (18 inch alternative)",
      Frequency: "50/60 Hz (220-240 V); 60 Hz (110 V)",
      Speed: "2800 RPM (220-240 V); 3300 RPM (110 V); 1720 RPM (18 inch alternative)",
      Airflow: "4950 CFM (16 inch); 5410 CFM (16 inch, 110 V); 7070 CFM (18 inch); 4240 CFM (18 inch alternative)"
    },
    null,
    [
      { size: '16"', mm: "400", Volts: "220-240", Watts: "1100", Hz: "50/60", Rpm: "2800", Cfm: "4950" },
      { size: '16"', mm: "400", Volts: "110", Watts: "1100", Hz: "60", Rpm: "3300", Cfm: "5410" },
      { size: '18"', mm: "450", Volts: "220-240", Watts: "1800", Hz: "50/60", Rpm: "2800", Cfm: "7070" },
      { size: '18"', mm: "450", Volts: "220-240", Watts: "750", Hz: "50/60", Rpm: "1720", Cfm: "4240" }
    ]
  ),
  createProduct(
    "GN Axial Blower 24",
    "GN Fans",
    "Axial Blower",
    "GN/Axial Blower/GN Axial Blower 24.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220-240 V; 110 V; 380 V",
      Power: "2200 W",
      Frequency: "50/60 Hz (220-240 and 380 V); 60 Hz (110 V)",
      Speed: "1450 RPM",
      Airflow: "10250 CFM"
    },
    null,
    [
      { size: '24"', mm: "600", Volts: "220-240", Watts: "2200", Hz: "50/60", Rpm: "1450", Cfm: "10250" },
      { size: '24"', mm: "600", Volts: "110", Watts: "2200", Hz: "60", Rpm: "1450", Cfm: "10250" },
      { size: '24"', mm: "600", Volts: "380", Watts: "2200", Hz: "50/60", Rpm: "1450", Cfm: "10250" }
    ]
  ),
  createProduct(
    "GN Axial Blower 32",
    "GN Fans",
    "Axial Blower",
    "GN/Axial Blower/GN Axial Blower 32.png",
    {
      Size: "32 inch",
      mm: "800",
      Voltage: "380 V",
      Power: "4000 W",
      Frequency: "50/60 Hz",
      Speed: "1450 RPM",
      Airflow: "13780 CFM"
    }
  ),
  createProduct(
    "GN Duct Fan",
    "GN Fans",
    "Axial Blower",
    "GN/Axial Blower/GN Duct.png",
    {
      "Available Sizes": "12, 16, 18, 24, 32"
    }
  ),
  createProduct(
    "GN Air Cooler 120",
    "GN Fans",
    "Air Cooler",
    "GN/Cooler/GN Cooler 120.png",
    {
      Voltage: "220-240 V",
      Power: "280 W",
      Frequency: "50 Hz",
      Speed: "1400 RPM",
      Airflow: "8800 CFM",
      "Water Tank": "120 L"
    },
    "120"
  ),
  createProduct(
    "GN Air Cooler 140",
    "GN Fans",
    "Air Cooler",
    "GN/Cooler/GN Cooler 140.png",
    {
      Voltage: "220-240",
      Power: "1100",
      Frequency: "50/60",
      "m³/h": "23500",
      "Water Tank": "140 L",
      Weight: "70 kg"
    },
    "140"
  ),
  createProduct(
    "GN False Ceiling Fan",
    "GN Fans",
    "False Ceiling Fan",
    "GN/False Ceiling/GN False Ceiling.png",
    {
      Lighting: "With or without LED"
    }
  ),
  createProduct(
    "GN False Ceiling Surface Fan",
    "GN Fans",
    "False Ceiling Fan",
    "GN/False Ceiling/GN False Ceiling Surface.png",
    {
      Lighting: "LED"
    }
  ),
  createProduct(
    "GN Industrial Pedestal Fan",
    "GN Fans",
    "Pedestal Fan",
    "GN/Pedestal/GN Pedestal Industrial 24 30.png",
    {
      "Available Sizes": "24, 24 and 30 inch",
      mm: "600, 600, 760",
      Voltage: "110 V (24 inch); 220-240 V (24 and 30 inch)",
      Power: "150 W (24 inch); 350 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "6380 CFM (24 inch); 10000 CFM (30 inch)"
    },
    null,
    [
      { size: '24"', mm: "600", Volts: "110", Watts: "150", Hz: "60", Rpm: "1400", Cfm: "6380" },
      { size: '24"', mm: "600", Volts: "220-240", Watts: "150", Hz: "50/60", Rpm: "1400", Cfm: "6380" },
      { size: '30"', mm: "760", Volts: "220-240", Watts: "350", Hz: "50/60", Rpm: "1400", Cfm: "10000" }
    ]
  ),
  createProduct(
    "GN Industrial Pedestal Fan 26",
    "GN Fans",
    "Pedestal Fan",
    "GN/Pedestal/GN Pedestal Industrial 26.png",
    {
      Size: "26 inch",
      mm: "660",
      Voltage: "220-240 V",
      Power: "230 W",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "7068 CFM"
    }
  ),
  createProduct(
    "GN Pedestal Fan",
    "GN Fans",
    "Pedestal Fan",
    "GN/Pedestal/GN Pedestal.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "4525 CFM"
    }
  ),
  createProduct(
    "GN Industrial Wall Fan 24 and 30",
    "GN Fans",
    "Wall Fan",
    "GN/Wall/GN Wall 24 30.png",
    {
      "Available Sizes": "24 and 30 inch",
      mm: "600, 760",
      Voltage: "220-240 V",
      Power: "150 W (24 inch); 350 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "6380 CFM (24 inch); 10000 CFM (30 inch)"
    }
  ),
  createProduct(
    "GN Industrial Wall Fan 26",
    "GN Fans",
    "Wall Fan",
    "GN/Wall/GN Wall 26.png",
    {
      Size: "26 inch",
      mm: "660",
      Voltage: "220-240 V",
      Power: "230 W",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "7068 CFM"
    }
  ),


  /* =========================
     YUNAS FANS
     ========================= */

  createProduct(
    "Yunas Pedestal Fan 18",
    "Yunas Fans",
    "Pedestal Fan",
    "Yunas Pedestal 18.png",
    {
      Size: "18 inch",
      mm: "460",
      Voltage: "220",
      Power: "65",
      Hz: "50",
      Speed: "1475 RPM",
      Airflow: "2473 CFM"
    }
  ),
  createProduct(
    "Yunas Pedestal Fan 24",
    "Yunas Fans",
    "Pedestal Fan",
    "Yunas Pedestal 24.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "4875 CFM"
    }
  ),
  createProduct(
    "Yunas Pedestal Fan 36",
    "Yunas Fans",
    "Pedestal Fan",
    "Yunas Pedestal 36.png",
    {
      Size: "36 inch",
      mm: "915",
      Voltage: "220 V",
      Power: "750 W",
      Frequency: "50/60 Hz",
      Speed: "1450 RPM",
      Airflow: "12725 CFM"
    }
  ),


  /* =========================
     KHAITAN FANS
     ========================= */

  createProduct(
    "Khaitan Air Cooler Cruze-45",
    "Khaitan Fans",
    "Air Cooler",
    "Khaitan/Khaitan Cooler Cruze.png",
    {
      Voltage: "230 V",
      Power: "130 W",
      Frequency: "50 Hz",
      Speed: "2550 RPM",
      "m³/h": "2525",
      "Water Tank": "46 L"
    },
    "Cruze-45"
  ),
  createProduct(
    "Khaitan Air Cooler Everest",
    "Khaitan Fans",
    "Air Cooler",
    "Khaitan/Khaitan Cooler Everset.png",
    {
      Voltage: "230 V",
      Power: "850 W",
      Frequency: "50 Hz",
      Speed: "1250 RPM",
      "m³/h": "14400",
      "Water Tank": "130 L"
    },
    "Everest"
  ),
  createProduct(
    "Khaitan Air Cooler Polo",
    "Khaitan Fans",
    "Air Cooler",
    "Khaitan/Khaitan Cooler Polo.png",
    {
      Voltage: "230 V",
      Power: "205 W",
      Frequency: "50 Hz",
      Speed: "1360 RPM",
      "m³/h": "4020",
      "Water Tank": "110 L"
    },
    "Polo"
  ),
  createProduct(
    "Khaitan Exhaust Fan",
    "Khaitan Fans",
    "Exhaust Fan",
    "Khaitan/Khaitan Exhaust.png",
    {
      "Available Sizes": "12, 15, 18 and 24 inch",
      mm: "300, 380, 450, 600",
      Voltage: "220-240 V",
      Power: "90 W (12 inch); 160 W (15 inch); 370 W (18 inch); 550 W (24 inch)",
      Frequency: "50 Hz",
      Speed: "1400 RPM (12, 15 and 18 inch); 900 RPM (24 inch)",
      Airflow: "1010 CFM (12 inch); 1915 CFM (15 inch); 3605 CFM (18 inch); 5535 CFM (24 inch)"
    },
    null,
    [
      { size: '12"', mm: "300", Volts: "220-240", Watts: "90", Hz: "50", Rpm: "1400", Cfm: "1010" },
      { size: '15"', mm: "380", Volts: "220-240", Watts: "160", Hz: "50", Rpm: "1400", Cfm: "1915" },
      { size: '18"', mm: "450", Volts: "220-240", Watts: "370", Hz: "50", Rpm: "1400", Cfm: "3605" },
      { size: '24"', mm: "600", Volts: "220-240", Watts: "550", Hz: "50", Rpm: "900", Cfm: "5535" }
    ]
  ),
  createProduct(
    "Khaitan Industrial Pedestal Fan",
    "Khaitan Fans",
    "Pedestal Fan",
    "Khaitan/Khaitan Pedestal.png",
    {
      "Available Sizes": "18, 24 and 30 inch",
      mm: "450, 600, 750",
      Voltage: "220-240 V",
      Power: "100 W (18 inch); 200 W (24 inch); 250 W (30 inch)",
      Frequency: "50 Hz",
      Speed: "1400 RPM",
      Airflow: "5300 CFM (18 inch); 9540 CFM (24 inch); 13075 CFM (30 inch)"
    }
  ),
  createProduct(
    "Khaitan Wall Fan",
    "Khaitan Fans",
    "Wall Fan",
    "Khaitan/Khaitan Wall.png",
    {
      "Available Sizes": "18, 24 and 30 inch",
      mm: "450, 600, 750",
      Voltage: "220-240 V",
      Power: "100 W (18 inch); 200 W (24 inch); 250 W (30 inch)",
      Frequency: "50 Hz",
      Speed: "1400 RPM",
      Airflow: "5300 CFM (18 inch); 9540 CFM (24 inch); 13075 CFM (30 inch)"
    }
  ),


  /* =========================
     CLASSIC FANS
     ========================= */

  createProduct(
    "Classic Misting Pedestal Fan",
    "Classic Fans",
    "Mist Fan",
    "Classic Mist Pedestal.png",
    {
      "Available Sizes": "26 inch and 30 inch",
      mm: "660, 750",
      Voltage: "220-240 V",
      Power: "250 W (26 inch); 300 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "7800 CFM (26 inch); 9800 CFM (30 inch)",
      "Water Tank": "41 L"
    }
  ),
  createProduct(
    "Classic Misting Wall Fan",
    "Classic Fans",
    "Mist Fan",
    "Classic Mist Wall.png",
    {
      Size: "26 inch",
      mm: "660",
      Voltage: "220-240 V",
      Power: "250 W",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "7800 CFM",
      "Water Tank": "10 L"
    }
  ),
  createProduct(
    "Classic Pedestal Fan",
    "Classic Fans",
    "Pedestal Fan",
    "Classic Pedestal.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "4275 CFM"
    }
  ),


  /* =========================
     BELVIN FANS
     ========================= */

  createProduct(
    "Belvin Circumatic Fan",
    "Belvin Fans",
    "Circumatic Fan",
    "Belvin/Circumatic/Belvin Circumatic.png",
    {
      Size: "18 inch",
      mm: "460",
      Volts: "220",
      Watts: "65",
      Hz: "50",
      Rpm: "1475",
      Cfm: "2473",
      Finish: "Off white"
    }
  ),
  createProduct(
    "Belvin Circumatic Fan Black",
    "Belvin Fans",
    "Circumatic Fan",
    "Belvin/Circumatic/Belvin Circumatic Black.png",
    {
      Size: "18 inch",
      mm: "460",
      Volts: "220",
      Watts: "65",
      Hz: "50",
      Rpm: "1475",
      Cfm: "2473",
      Finish: "Off white"
    }
  ),
  createProduct(
    "Belvin Pedestal Fan",
    "Belvin Fans",
    "Pedestal Fan",
    "Belvin/Pedestal/Belvin Pedestal.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1350 RPM",
      Airflow: "6996 CFM"
    }
  ),
  createProduct(
    "Belvin Pedestal Fan Black",
    "Belvin Fans",
    "Pedestal Fan",
    "Belvin/Pedestal/Belvin Pedestal Black.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1350 RPM",
      Airflow: "6996 CFM",
      Finish: "Black"
    }
  ),
  createProduct(
    "Belvin Industrial Wall Fan",
    "Belvin Fans",
    "Wall Fan",
    "Belvin/Wall/Belvin Wall Industrial.png",
    {
      Size: "24 inch",
      mm: "600",
      Voltage: "220 V",
      Power: "125 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "6003 CFM"
    }
  ),
  createProduct(
    "Belvin Wall Fan Black",
    "Belvin Fans",
    "Wall Fan",
    "Belvin/Wall/Belvin Wall Black.png",
    {
      Size: "18 inch",
      mm: "460",
      Voltage: "220 V",
      Power: "50 W",
      Speed: "1475 RPM",
      Airflow: "2473 CFM",
      Finish: "Black"
    }
  ),
  createProduct(
    "Belvin Wall Fan Silver",
    "Belvin Fans",
    "Wall Fan",
    "Belvin/Wall/Belvin Wall Silver.png",
    {
      Size: "18 inch",
      Voltage: "220 V",
      Power: "65 W",
      Frequency: "50 Hz",
      Speed: "1475 RPM",
      Airflow: "2473 CFM",
      Finish: "Silver"
    }
  ),


  /* =========================
     ACCESSORIES
     ========================= */

  createProduct(
    "Dimmer",
    "",
    "Accessories",
    "Aces/Dimmer.png"
  ),
  createProduct(
    "Bird Doorbell",
    "",
    "Accessories",
    "Aces/Door Bell Bird.png"
  ),
  createProduct(
    "Ding Dong Doorbell",
    "",
    "Accessories",
    "Aces/Door Bell Ding Dong.png"
  ),
  createProduct(
    "Dark Hut Doorbell",
    "",
    "Accessories",
    "Aces/Door Bell Hut Dark.png"
  ),
  createProduct(
    "Light Hut Doorbell",
    "",
    "Accessories",
    "Aces/Door Bell Hut Light.png"
  ),
  createProduct(
    "White Hut Doorbell",
    "",
    "Accessories",
    "Aces/Door Bell Hut White.png"
  ),
  createProduct(
    "Batten Holder",
    "",
    "Accessories",
    "Aces/Holder Batten.png"
  ),
  createProduct(
    "Fancy Gold Holder",
    "",
    "Accessories",
    "Aces/Holder Fancy Gold.png"
  ),
  createProduct(
    "Fancy Silver Holder",
    "",
    "Accessories",
    "Aces/Holder Fancy Silver.png"
  ),
  createProduct(
    "Pendant Holder",
    "",
    "Accessories",
    "Aces/Holder Pendent.png"
  )
];