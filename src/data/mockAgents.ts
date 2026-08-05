import { ResearchAgentTask, TriggeredAlert } from '../types';

export const INITIAL_RESEARCH_AGENTS: ResearchAgentTask[] = [
  {
    id: 'agent-car-01',
    title: 'SUV Audi Q5 / BMW X3 (<80.000 km, <25.000€)',
    topicCategory: 'used_cars',
    userGoals: 'Buscar SUV premium de segunda mano en España (Madrid/Barcelona/Valencia) con menos de 80.000 km, distintivo ambiental C o Eco, y precio inferior a 25.000€. Priorizar mejor relación calidad-precio.',
    searchParams: {
      minPrice: 15000,
      maxPrice: 25000,
      location: 'Madrid, España',
      country: 'España',
      maxDistanceMiles: 100,
      targetPlatforms: ['Coches.net', 'AutoScout24', 'Wallapop', 'Milanuncios'],
      keywords: 'Audi Q5 BMW X3 nacional libro mantenimiento etiqueta Eco',
      excludeKeywords: 'embargado siniestro sin ITV',
      minYear: 2018,
      maxMileage: 85000,
      sortBy: 'deal_grade'
    },
    alertConfig: {
      enabled: true,
      maxPriceThreshold: 22000,
      minDealGrade: 'A',
      requireKeywords: ['Nacional', 'ITV al día'],
      notifyFrequency: 'instant',
      notifyMethod: 'in_app'
    },
    status: 'completed',
    lastRunAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    scrapedCount: 8,
    summary: {
      topicTitle: 'Análisis de Mercado: Audi Q5 y BMW X3 en España',
      executiveSummary: 'Analizados 24 anuncios activos en Coches.net, AutoScout24 y Wallapop en España. El precio medio en mercado nacional para Audi Q5 / BMW X3 (2018-2021) es de 23.850€. Destacan 4 chollos verificados por debajo de 21.500€.',
      marketInsights: [
        'Los modelos Audi Q5 2.0 TDI S-Line con etiqueta C mantienen una demanda un 14% superior en Madrid y Barcelona.',
        'En Wallapop los vendedores particulares publican de media un 9% más barato que los concesionarios oficiales.',
        'El stock de vehículos de ocasión en España ha subido un 7% este mes, permitiendo margen de negociación de 800€–1.500€.'
      ],
      averagePrice: 23850,
      lowestPrice: 19900,
      highestPrice: 24900,
      priceBuckets: [
        { range: '19.000€ - 21.000€', count: 3 },
        { range: '21.000€ - 23.000€', count: 6 },
        { range: '23.000€ - 25.000€', count: 9 },
        { range: '25.000€+', count: 6 }
      ],
      totalListingsFound: 24,
      citations: [
        { title: 'Coches.net Madrid Audi Q5', uri: 'https://www.coches.net', snippet: 'Anuncios revisados de Audi Q5 diésel y gasolina con distintivo C en Madrid.' },
        { title: 'AutoScout24 España BMW X3', uri: 'https://www.autoscout24.es', snippet: 'Catálogo de BMW X3 sDrive/xDrive con garantía europea.' }
      ],
      recommendation: 'Mejor Opción: Audi Q5 2.0 TDI S line 190CV (2019) con 68.400 km listado por 20.900€ en Coches.net (Nota A+, 2.950€ por debajo de la media en España).'
    },
    listings: [
      {
        id: 'car-item-1',
        title: '2019 Audi Q5 2.0 TDI S Line Quattro 190CV - Libro Oficial',
        price: 20900,
        originalPrice: 23850,
        url: 'https://www.coches.net/audi-q5-2019-madrid',
        domain: 'coches.net',
        sourceName: 'Coches.net',
        location: 'Madrid, España',
        country: 'España',
        year: 2019,
        mileage: 68400,
        specs: ['2.0 TDI 190CV', 'Quattro 4x4', 'Acabado S-Line', 'Virtual Cockpit', 'Etiqueta C'],
        dealGrade: 'A+',
        dealReason: 'Oportunidad A+: 2.950€ inferior a la media de mercado en España con historial en taller oficial Audi.',
        pros: ['Único propietario nacional', 'Historial de revisiones en servicio oficial Audi', 'ITV recién pasada'],
        cons: ['Pequeño arañazo en paragolpes trasero'],
        dateFound: 'Hace 2 horas',
        snippet: 'Audi Q5 S Line Quattro en Gris Daytona. 68.400 km reales, nacional, cambio automático S-Tronic y paquete de asistentes.',
        isNewAlert: true,
        isFavorite: true,
        imageUri: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'car-item-2',
        title: '2020 BMW X3 sDrive20i 184CV Steptronic Executive',
        price: 22500,
        originalPrice: 24200,
        url: 'https://www.autoscout24.es/oferta/bmw-x3-2020',
        domain: 'autoscout24.es',
        sourceName: 'AutoScout24',
        location: 'Barcelona, España',
        country: 'España',
        year: 2020,
        mileage: 52100,
        specs: ['2.0i 184CV', 'Garantía BPS 12 meses', 'Navegador Professional', 'Faros LED'],
        dealGrade: 'A',
        dealReason: 'Incluye 12 meses de garantía oficial BMW Premium Selection en toda Europa.',
        pros: ['Garantía oficial europea', 'Excelente estado de neumáticos y frenos', 'Interiores impecables en cuero'],
        cons: ['Precio fijo no negociable por concesionario'],
        dateFound: 'Hace 5 horas',
        snippet: 'BMW X3 sDrive20i en Blanco Alpino. 52.100 km, revisión recién hecha en BNS Barcelona. Distintivo C.',
        isNewAlert: false,
        isFavorite: false,
        imageUri: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'car-item-3',
        title: '2018 Audi Q5 2.0 TFSI 252CV Design S-Tronic',
        price: 19900,
        originalPrice: 21500,
        url: 'https://es.wallapop.com/item/audi-q5-2018-barcelona',
        domain: 'wallapop.com',
        sourceName: 'Wallapop Particular',
        location: 'Valencia, España',
        country: 'España',
        year: 2018,
        mileage: 74200,
        specs: ['2.0 TFSI 252CV', 'Tracción Quattro', 'Techo Panorámico', 'Llantas 19"'],
        dealGrade: 'A',
        dealReason: 'Precio más bajo localizado en un radio de 200 km para versión Quattro 252CV.',
        pros: ['Vendedor particular sin comisiones de concesionario', 'Equipamiento top con techo solar', 'Siempre en garaje'],
        cons: ['Ligeros roces de uso urbano en llantas'],
        dateFound: 'Ayer',
        snippet: 'Particular vende Audi Q5 TFSI 252CV por cambio de coche de empresa. 74.200 km, mantenimiento al día.',
        isNewAlert: false,
        isFavorite: false,
        imageUri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'car-item-4',
        title: '2021 Volkswagen Tiguan 2.0 TDI 150CV R-Line',
        price: 24200,
        originalPrice: 25000,
        url: 'https://www.milanuncios.com/volkswagen-de-segunda-mano/tiguan-2021',
        domain: 'milanuncios.com',
        sourceName: 'Milanuncios',
        location: 'Sevilla, España',
        country: 'España',
        year: 2021,
        mileage: 41000,
        specs: ['2.0 TDI 150CV', 'Acabado R-Line', 'Cockpit Digital', 'Camara 360'],
        dealGrade: 'B',
        dealReason: 'Precio correcto dada la antigüedad (2021) y bajo kilometraje (41.000 km).',
        pros: ['Muy pocos kilómetros', 'Año reciente 2021'],
        cons: ['Acabado exterior sin tracción total'],
        dateFound: 'Ayer',
        snippet: 'VW Tiguan R-Line 2021 en Gris Delfín. 41.000 km. Libro de mantenimiento completo.',
        isNewAlert: false,
        isFavorite: false,
        imageUri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'agent-laptop-02',
    title: 'Apple MacBook Pro M2/M3 Reacondicionado (<1.300€)',
    topicCategory: 'electronics',
    userGoals: 'Rastrear ofertas de MacBook Pro 14" M2 Pro o M3 con 16GB/18GB RAM reacondicionado o km 0 por menos de 1.300€ en BackMarket, Amazon.es, Apple Refurbished y PcComponentes.',
    searchParams: {
      minPrice: 850,
      maxPrice: 1300,
      location: 'España / Europa',
      country: 'España',
      targetPlatforms: ['BackMarket.es', 'Amazon.es Reacondicionados', 'Apple Refurbished ES', 'PcComponentes Outlet'],
      keywords: 'MacBook Pro 14 M2 Pro M3 16GB 18GB RAM',
      sortBy: 'deal_grade'
    },
    alertConfig: {
      enabled: true,
      maxPriceThreshold: 1150,
      minDealGrade: 'A+',
      notifyFrequency: 'instant',
      notifyMethod: 'in_app'
    },
    status: 'completed',
    lastRunAt: new Date(Date.now() - 14400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    scrapedCount: 5,
    summary: {
      topicTitle: 'Inteligencia de Mercado: MacBook Pro 14" M2/M3 en España',
      executiveSummary: 'Monitorizadas 15 ofertas en vendedores autorizados en España y Europa. En BackMarket y Amazon Warehouse se localizan unidades grado "Excelente" con 2 años de garantía europea a partir de 1.099€.',
      marketInsights: [
        'Los modelos M2 Pro 14" con 16GB RAM / 512GB SSD oscilan entre 1.120€ y 1.280€ en el mercado español.',
        'Apple Refurbished España renueva catálogo los martes por la mañana con garantía oficial de 1 año.',
        'Comprar reacondicionado "Excelente" ahorra entre 350€ y 500€ respecto al PVP original.'
      ],
      averagePrice: 1180,
      lowestPrice: 1049,
      highestPrice: 1290,
      priceBuckets: [
        { range: '1.000€ - 1.100€', count: 3 },
        { range: '1.100€ - 1.200€', count: 7 },
        { range: '1.200€ - 1.300€', count: 5 }
      ],
      totalListingsFound: 15,
      citations: [
        { title: 'BackMarket España MacBook Pro 14"', uri: 'https://www.backmarket.es', snippet: 'Portátiles Apple reacondicionados con 2 años de garantía y 30 días de prueba.' },
        { title: 'Amazon.es Second Chance', uri: 'https://www.amazon.es', snippet: 'Productos reacondicionados de Amazon Warehouse en España.' }
      ],
      recommendation: 'Recomendación Top: MacBook Pro 14" M2 Pro (16GB RAM, 512GB SSD) en BackMarket por 1.099€ (Estado Excelente con 24 meses de garantía).'
    },
    listings: [
      {
        id: 'laptop-1',
        title: 'MacBook Pro 14" M2 Pro (16GB RAM, 512GB SSD) Gris Espacial',
        price: 1099,
        originalPrice: 1499,
        url: 'https://www.backmarket.es/es-es/p/macbook-pro-14-2023',
        domain: 'backmarket.es',
        sourceName: 'BackMarket España',
        location: 'España / Envío 24h',
        country: 'España',
        dealGrade: 'A+',
        dealReason: 'Estado "Como Nuevo / Excelente", incluye cargador oficial Apple y 2 años de garantía.',
        pros: ['16GB memoria unificada', '400€ de ahorro sobre PVP', '24 meses de garantía europea'],
        cons: ['Caja reacondicionada neutra'],
        dateFound: 'Hace 3 horas',
        snippet: 'MacBook Pro 14 pulgadas con chip M2 Pro de Apple (CPU 10 núcleos, GPU 16 núcleos), 16GB RAM, 512GB SSD. Batería a más del 92% de salud.',
        isNewAlert: true,
        isFavorite: true,
        imageUri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'laptop-2',
        title: 'Apple Certified Refurbished MacBook Pro 14" M3 (16GB, 512GB)',
        price: 1249,
        originalPrice: 1399,
        url: 'https://www.apple.com/es/shop/refurbished/mac',
        domain: 'apple.com',
        sourceName: 'Apple Refurbished Oficial ES',
        location: 'España',
        country: 'España',
        dealGrade: 'A',
        dealReason: 'Directo de Apple España con carcasa y batería completamente nuevas y 1 año de garantía oficial.',
        pros: ['Batería y carcasa 100% nuevas', 'Admite AppleCare+', 'Caja oficial precintada'],
        cons: ['Precio ligeramente más alto que tiendas multimarca'],
        dateFound: 'Ayer',
        snippet: 'MacBook Pro de 14" reacondicionado por Apple con chip M3, 16GB de memoria unificada y 512GB SSD. Color Plata.',
        isNewAlert: false,
        isFavorite: false,
        imageUri: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

export const INITIAL_ALERTS: TriggeredAlert[] = [
  {
    id: 'alert-001',
    agentId: 'agent-car-01',
    agentTitle: 'SUV Audi Q5 / BMW X3 (<80.000 km, <25.000€)',
    listingId: 'car-item-1',
    listingTitle: '2019 Audi Q5 2.0 TDI S Line Quattro 190CV',
    price: 20900,
    dealGrade: 'A+',
    reason: '¡Alerta activada! El precio (20.900€) bajó de tu umbral de 22.000€ y obtuvo Calificación A+.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    url: 'https://www.coches.net/audi-q5-2019-madrid'
  },
  {
    id: 'alert-002',
    agentId: 'agent-laptop-02',
    agentTitle: 'Apple MacBook Pro M2/M3 Reacondicionado (<1.300€)',
    listingId: 'laptop-1',
    listingTitle: 'MacBook Pro 14" M2 Pro (16GB RAM, 512GB SSD)',
    price: 1099,
    dealGrade: 'A+',
    reason: '¡Nueva oferta detectada! Unidad Excelente por debajo de 1.150€ en BackMarket España.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: true,
    url: 'https://www.backmarket.es/es-es/p/macbook-pro-14-2023'
  }
];

