const products = [
  {
    id: "gn-royal-56",
    name: "GN Royal 56",
    brand: "GN Fans",
    model: "GN-R56",
    category: "Ceiling Fan",
    image: "./assets/ceiling fan 1.png",
    description:
      "A modern ceiling fan designed for everyday airflow in residential and commercial spaces.",
    specifications: {
      "Fan Type": "Ceiling Fan",
      "Blade Size": "56 inch",
      "Motor": "High Efficiency Motor",
      "Speed": "3 Speed",
      "Control": "Wall Control",
      "Application": "Residential / Commercial"
    },
    features: [
      {
        title: "Efficient Airflow",
        text: "Designed to provide consistent airflow for everyday spaces."
      },
      {
        title: "Modern Design",
        text: "A clean design that fits naturally into different interiors."
      },
      {
        title: "Everyday Use",
        text: "Suitable for regular residential and commercial applications."
      }
    ]
  },

  {
    id: "gn-classic-52",
    name: "GN Classic 52",
    brand: "GN Fans",
    model: "GN-C52",
    category: "Ceiling Fan",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    description:
      "A classic ceiling fan option focused on practical airflow and everyday use.",
    specifications: {
      "Fan Type": "Ceiling Fan",
      "Blade Size": "52 inch",
      "Motor": "Standard Motor",
      "Speed": "3 Speed",
      "Control": "Wall Control",
      "Application": "Residential"
    },
    features: [
      {
        title: "Classic Design",
        text: "A simple design suitable for a wide range of interiors."
      },
      {
        title: "Balanced Airflow",
        text: "Designed to distribute airflow across everyday living spaces."
      },
      {
        title: "Practical Choice",
        text: "Suitable for regular home applications."
      }
    ]
  },

  {
    id: "gfc-breeze-56",
    name: "GFC Breeze 56",
    brand: "GFC Fans",
    model: "GFC-B56",
    category: "Ceiling Fan",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=85",
    description:
      "A ceiling fan designed to combine practical airflow with a clean modern appearance.",
    specifications: {
      "Fan Type": "Ceiling Fan",
      "Blade Size": "56 inch",
      "Motor": "High Efficiency Motor",
      "Speed": "3 Speed",
      "Control": "Wall Control",
      "Application": "Residential / Commercial"
    },
    features: [
      {
        title: "Smooth Airflow",
        text: "Designed for comfortable and consistent air circulation."
      },
      {
        title: "Clean Appearance",
        text: "A minimal design suitable for contemporary spaces."
      },
      {
        title: "Versatile Application",
        text: "Suitable for both residential and commercial environments."
      }
    ]
  },

  {
    id: "gfc-pedestal-18",
    name: "GFC Power 18",
    brand: "GFC Fans",
    model: "GFC-P18",
    category: "Pedestal Fan",
    image: "https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=1200&q=85",
    description:
      "A portable pedestal fan designed for flexible airflow across different spaces.",
    specifications: {
      "Fan Type": "Pedestal Fan",
      "Blade Size": "18 inch",
      "Motor": "High Performance Motor",
      "Speed": "3 Speed",
      "Control": "Manual Control",
      "Application": "Residential / Commercial"
    },
    features: [
      {
        title: "Portable Design",
        text: "Can be positioned in different areas according to airflow requirements."
      },
      {
        title: "Adjustable Airflow",
        text: "Designed for flexible airflow direction and speed."
      },
      {
        title: "Practical Use",
        text: "Suitable for homes, offices and other everyday spaces."
      }
    ]
  },

  {
    id: "al-ahmed-exhaust-10",
    name: "Al Ahmed Exhaust 10",
    brand: "Al Ahmed Fans",
    model: "AA-E10",
    category: "Exhaust Fan",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85",
    description:
      "An exhaust fan designed for ventilation in enclosed areas and everyday spaces.",
    specifications: {
      "Fan Type": "Exhaust Fan",
      "Blade Size": "10 inch",
      "Motor": "Ventilation Motor",
      "Speed": "Single Speed",
      "Control": "Wall Switch",
      "Application": "Residential / Commercial"
    },
    features: [
      {
        title: "Ventilation",
        text: "Designed to help circulate and remove stale air from enclosed spaces."
      },
      {
        title: "Compact Design",
        text: "A compact format suitable for different ventilation areas."
      },
      {
        title: "Everyday Application",
        text: "Suitable for kitchens, utility areas and other enclosed spaces."
      }
    ]
  },

  {
    id: "yunas-wall-16",
    name: "Yunas Air 16",
    brand: "Yunas Fans",
    model: "YN-W16",
    category: "Wall Fan",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=85",
    description:
      "A wall-mounted fan designed to provide flexible airflow while saving floor space.",
    specifications: {
      "Fan Type": "Wall Fan",
      "Blade Size": "16 inch",
      "Motor": "Standard Motor",
      "Speed": "3 Speed",
      "Control": "Manual Control",
      "Application": "Residential / Commercial"
    },
    features: [
      {
        title: "Wall Mounted",
        text: "Designed to provide airflow without taking up floor space."
      },
      {
        title: "Flexible Direction",
        text: "Suitable for spaces where directional airflow is required."
      },
      {
        title: "Compact Design",
        text: "A practical option for smaller and medium-sized spaces."
      }
    ]
  },

  {
    id: "belvin-industrial-24",
    name: "Belvin Industrial 24",
    brand: "Belvin Fans",
    model: "BL-I24",
    category: "Industrial Fan",
    image: "https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=1200&q=85",
    description:
      "An industrial fan concept designed for spaces that require strong and continuous air circulation.",
    specifications: {
      "Fan Type": "Industrial Fan",
      "Blade Size": "24 inch",
      "Motor": "Industrial Motor",
      "Speed": "3 Speed",
      "Control": "Manual Control",
      "Application": "Industrial / Commercial"
    },
    features: [
      {
        title: "Strong Airflow",
        text: "Designed for environments where increased air circulation is required."
      },
      {
        title: "Industrial Design",
        text: "Built around a practical format for commercial and industrial spaces."
      },
      {
        title: "Wide Application",
        text: "Suitable for workshops, commercial areas and larger spaces."
      }
    ]
  }
];