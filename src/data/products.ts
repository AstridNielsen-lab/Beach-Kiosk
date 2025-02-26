export const products = [
  // Bebidas Alcoólicas - Destilados
  {
    id: 'drink-1',
    name: 'Caipirinha',
    description: 'Tradicional coquetel brasileiro com limão e cachaça Velho Barreiro',
    price: 25.00,
    category: 'destilados',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/capirinha%20sol.jpg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'drink-2',
    name: 'Whisky Red Label (Dose)',
    description: 'Dose de Johnnie Walker Red Label com gelo',
    price: 28.00,
    category: 'destilados',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/red.jpeg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'drink-3',
    name: 'Vodka Absolut (Dose)',
    description: 'Dose de Vodka Absolut com energético ou suco',
    price: 30.00,
    category: 'destilados',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/absolut.jpeg?auto=format&fit=crop&q=80&w=500',
  },

  // Bebidas Alcoólicas - Cervejas
  {
    id: 'beer-1',
    name: 'Cerveja Heineken Long Neck',
    description: 'Cerveja premium 330ml, servida gelada',
    price: 14.00,
    category: 'cervejas',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/heineken-1.jpg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'beer-2',
    name: 'Cerveja Stella Artois Long Neck',
    description: 'Cerveja premium 330ml, servida gelada',
    price: 14.00,
    category: 'cervejas',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/cerveja-stella.jpg?auto=format&fit=crop&q=80&w=500',
  },

  // Vinhos
  {
    id: 'wine-1',
    name: 'Vinho Tinto Chileno (Taça)',
    description: 'Taça de vinho tinto seco chileno',
    price: 28.00,
    category: 'vinhos',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=500',
  },

  // Bebidas Não Alcoólicas
  {
    id: 'soft-1',
    name: 'Água Mineral',
    description: 'Garrafa 500ml (com ou sem gás)',
    price: 6.00,
    category: 'nao_alcoolicas',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/%C3%A1gua-mineral.jpg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'soft-2',
    name: 'Refrigerantes',
    description: 'Coca-Cola, Guaraná Antarctica, Sprite (350ml)',
    price: 8.00,
    category: 'nao_alcoolicas',
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'soft-3',
    name: 'Suco Natural',
    description: 'Laranja, abacaxi, limão ou maracujá',
    price: 12.00,
    category: 'nao_alcoolicas',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=500',
  },

  // Pratos Principais
  {
    id: 'food-1',
    name: 'Peixe Grelhado',
    description: 'Robalo grelhado com arroz, legumes e farofa',
    price: 89.00,
    category: 'pratos_principais',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/peixe-grelhado.jpg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'food-2',
    name: 'Moqueca de Peixe',
    description: 'Tradicional moqueca capixaba com arroz e pirão',
    price: 120.00,
    category: 'pratos_principais',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/moqueca_vegana.jpg?auto=format&fit=crop&q=80&w=500',
  },

  // Porções
  {
    id: 'porcao-1',
    name: 'Batata Frita',
    description: 'Porção grande com molho especial da casa',
    price: 35.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'porcao-2',
    name: 'Frango a Passarinho',
    description: 'Crocante e temperado, serve 2 pessoas',
    price: 45.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'porcao-3',
    name: 'Isca de Peixe',
    description: 'Peixe empanado com molho tártaro',
    price: 55.00,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&q=80&w=500',
  },

  // Saladas
  {
    id: 'salad-1',
    name: 'Salada de Camarão',
    description: 'Mix de folhas, camarão grelhado, manga e molho citrico',
    price: 65.00,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'salad-2',
    name: 'Salada Caesar',
    description: 'Alface romana, frango grelhado, croutons e molho caesar',
    price: 45.00,
    category: 'saladas',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500',
  },

  // Molhos Extras
  {
    id: 'sauce-1',
    name: 'Molho Tártaro',
    description: 'Molho caseiro ideal para peixes e frutos do mar',
    price: 8.00,
    category: 'molhos',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/tartaro.jpg?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'sauce-2',
    name: 'Molho de Pimenta',
    description: 'Molho de pimenta caseiro',
    price: 5.00,
    category: 'molhos',
    image: 'https://raw.githubusercontent.com/AstridNielsen-lab/Beach-Kiosk/refs/heads/index/src/hot-tomato.jpg?auto=format&fit=crop&q=80&w=500',
  },
] as const;
