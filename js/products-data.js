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
      size: variantLabels[variantIndex]
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
    id: `${brand}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name,
    brand,
    model,
    category,
    image: `../assets/Fans/${image}`,
    hasSpecifications: Object.keys(specifications).length > 0,
    description: Object.keys(specifications).length
      ? "Technical details listed below are taken from the supplied product catalog."
      : "The supplied catalog does not list technical specifications for this product. Contact us to confirm its details.",
    sizeVariants:
      sizeVariants ||
      createSizeVariants(specifications, normalizedSpecifications),
    specifications: normalizedSpecifications,
    features: []
  };
};

const products = [
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

  createProduct(
    "Yunas Pedestal Fan 18",
    "Yunas Fans",
    "Pedestal Fan",
    "Yunas Pedestal 18.png",
    {
      Size: "18 inch",
      mm: "460",
      Voltage: "220 V",
      Power: "50 W",
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

  createProduct(
    "Belvin Circumatic Fan",
    "Belvin Fans",
    "Circumatic Fan",
    "Belvin/Circumatic/Belvin Circumatic.png",
    { Finish: "Off white" }
  ),
  createProduct(
    "Belvin Circumatic Fan Black",
    "Belvin Fans",
    "Circumatic Fan",
    "Belvin/Circumatic/Belvin Circumatic Black.png",
    { Finish: "Black" }
  ),
  createProduct(
    "Belvin Pedestal Fan",
    "Belvin Fans",
    "Pedestal Fan",
    "Belvin/Pedestal/Belvin Pedestal.png",
    {
      Size: "24 inch",
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
        Volts: "220-240 V",
        Watts: "250 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "850 CFM"
      },
      {
        size: '10"',
        Volts: "220-240 V",
        Watts: "320 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "1520 CFM"
      },
      {
        size: '12" (220-240)',
        Volts: "220-240 V",
        Watts: "520 W",
        Hz: "50/60 Hz",
        Rpm: "2900/3300 RPM",
        Cfm: "2295 CFM"
      },
      {
        size: '12" (110)',
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
    }
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
    }
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
      "Available Colors": "White, Brown & Black"
    }, "Awami"
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
      Size: "18 inch",
      mm: "—"
    }
  ),
  createProduct(
    "GFC Air Cooler 6600",
    "GFC Fans",
    "Air Cooler",
    "GFC/Cooler & Mist/GFC Cooler 6600.png",
    { "Water Tank": "65 L" },
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
    }
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
    }
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
    "GFC Wall Fan Myga",
    "GFC Fans",
    "Wall Fan",
    "GFC/Wall/GFC Wall Myga.png",
    {
      "Available Sizes": "18, 24, 26 and 30 inch",
      mm: "460, 600, 650, 760",
      Voltage: "220-240 V",
      Power: "130 W (18 inch); 150 W (24 inch); 230 W (26 inch); 350 W (30 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "4175 CFM (18 inch); 6380 CFM (24 inch); 7068 CFM (26 inch); 10000 CFM (30 inch)"
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
      Airflow: "11462 m³/h (24 inch); 17243 m³/h (30 inch); 18880 m³/h (36 inch); 20100 m³/h (48 inch)"
    }
  ),
  createProduct(
    "GN Floor Fan",
    "GN Fans",
    "Floor Fan",
    "GN/GN Floor.png",
    {
      "Available Sizes": "12, 16 and 18 inch",
      mm: "300, 400, 450",
      Voltage: "220-240 V",
      Power: "60 W (12 inch); 100 W (16 inch); 120 W (18 inch)",
      Frequency: "50/60 Hz",
      Speed: "1400 RPM",
      Airflow: "1275 CFM (12 inch); 2675 CFM (16 inch); 3355 CFM (18 inch)"
    }
  ),
  createProduct(
    "GN Inline Duct Fan",
    "GN Fans",
    "Duct Fan",
    "GN/GN Inline.png",
    {
      "Available Sizes": "4 and 6 inch",
      mm: "100, 150",
      Voltage: "220-240 V",
      Power: "40 W (4 inch); 100 W (6 inch)",
      Frequency: "50/60 Hz",
      Speed: "2800 RPM",
      Airflow: "310 CFM (4 inch); 540 CFM (6 inch)"
    }
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
      mm: "—",
      Voltage: "220 V (28 and 30 inch); 380 V (32, 42 and 48 inch)",
      Power: "250 W (28 inch); 275 W (30 inch); 365 W (32 inch); 370 W (42 inch); 750 W (48 inch)",
      Frequency: "50/60 Hz (28 and 30 inch); 50 Hz (32, 42 and 48 inch)",
      Speed: "550 RPM (28, 30 and 32 inch); 400 RPM (42 and 48 inch)",
      Airflow: "13600 m³/h (28 inch); 19480 m³/h (30 inch); 22550 m³/h (32 inch); 37720 m³/h (42 inch); 45365 m³/h (48 inch)",
      Weight: "22.0 kg (28 inch); 25.0 kg (30 inch); 27.6 kg (32 inch); 35.1 kg (42 inch); 42.6 kg (48 inch)"
    }
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
      Airflow: "2300 CFM (220-240 V); 2720 CFM (110 V option)",
      "Power options": "550 W (220-240 V); 520 W (110 V)",
      "Frequency options": "50/60 Hz (220-240 V); 60 Hz (110 V)",
      "Speed options": "2800 RPM (220-240 V); 3300 RPM (110 V)"
    }
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
    }
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
    }
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
    "Duct Fan",
    "GN/Axial Blower/GN Duct.png",
    {
      "Available Sizes": "8, 10, 12, 16, 18, 20, 24 and 32 inch",
      mm: "—"
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
      Voltage: "220-240 V",
      Power: "1100 W",
      Frequency: "50/60 Hz",
      Airflow: "23500 m³/h",
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
      "Air Delivery": "2525 m³/h",
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
      "Air Delivery": "14400 m³/h",
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
      "Air Delivery": "4020 m³/h",
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
      "Available Sizes": "12, 18, 24 and 30 inch",
      mm: "300, 450, 600, 750",
      Voltage: "220-240 V",
      Power: "90 W (12 inch); 160 W (18 inch); 370 W (24 inch); 550 W (30 inch)",
      Frequency: "50 Hz",
      Speed: "1400 RPM (12, 18 and 24 inch); 900 RPM (30 inch)",
      Airflow: "1010 CFM (12 inch); 1915 CFM (18 inch); 3605 CFM (24 inch); 5535 CFM (30 inch)"
    }
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
  )
];
