import { Product, CategoryInfo } from '../types';

export const DEFAULT_IMAGES: Record<string, string> = {
  logo: '/logo_s.svg',
  cameraLogo: '/logo_s.svg',
  
  // Hero Floating Cards
  heroAni: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
  heroCas: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
  heroTur: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',
  heroRet: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862',
  heroFam: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',

  // Story / Believe section
  believe: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hands_holding_printed_photographs_202608242110.jpg',

  // Category Banners
  catTodos: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Open_photobook_on_wooden_table_202608242203.jpg?v=1787619907',
  catAni: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
  catTur: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
  catCas: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',

  // Products Gallery - Product 1: Álbum Aniversário 20 Fotos Black
  aniBlackA: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
  aniBlackB: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
  aniBlackC: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041_1.jpg?v=1787629477',
  aniBlackD: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041.jpg?v=1787629477',
  aniBlackE: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_para_poses_de_aniversario__202608250041.jpg?v=1787629477',
  aniBlackF: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_for_birthday_photography___202608250041.jpg?v=1787629477',

  // Products Gallery - Product 2: Álbum Aniversário 50 Fotos Luxury
  aniLuxA: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
  aniLuxB: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862',
  aniLuxC: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034.jpg?v=1787628862',
  aniLuxD: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_2.jpg?v=1787628862',
  aniLuxE: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033.jpg?v=1787628862',
  aniLuxF: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_1.jpg?v=1787628862',

  // Products Gallery - Product 3: Álbum Casal 25 Fotos
  casal25A: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
  casal25B: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
  casal25C: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Romantic_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
  casal25D: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106_1.jpg?v=1787630860',
  casal25E: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106.jpg?v=1787630860',
  casal25F: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106_1.jpg?v=1787630861',

  // Products Gallery - Product 4: Álbum Turismo Paris 20 Fotos
  paris20A: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
  paris20B: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',
  paris20C: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_3.jpg?v=1787630354',
  paris20D: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_2.jpg?v=1787630354',
  paris20E: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_1.jpg?v=1787630354',
  paris20F: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058.jpg?v=1787630354',

  // Before & After Comparisons
  ba1: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250133.jpg?v=1787632459',
  ba1Antes: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/faca_essa_mulher_comum_normal_202608250134.jpg',
  
  ba2: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
  ba2Antes: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/faca_essa_mulher_comum_normal_202608250134.jpg',
  
  ba3: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',
  ba3Antes: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/faca_essa_mulher_comum_normal_202608250134.jpg',

  // Final CTA floating photos
  cta1: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
  cta2: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862',
  cta3: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
  cta4: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',

  // Testimonials avatars
  tst1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=85',
  tst2: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=85',
  tst3: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=85',
  tst4: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85',
};

// Helper to get image with local storage overrides fallback
export function getImage(key: string, fallbackWidth = 800, fallbackHeight = 800): string {
  try {
    const custom = localStorage.getItem(`mfia_img_${key}`);
    if (custom && custom.trim().length > 0) return custom.trim();
  } catch (e) {
    // Local storage unavailable
  }

  return DEFAULT_IMAGES[key] || `https://picsum.photos/seed/${key}/${fallbackWidth}/${fallbackHeight}.jpg`;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'album-aniversario-20-fotos-black',
    name: 'Álbum Aniversário — 20 Fotos Black',
    cat: 'aniversario',
    category: 'Aniversário',
    price: 29.90,
    originalPrice: 59.90,
    photos: 20,
    photoCount: 20,
    deliveryHours: 12,
    badge: 'MAIS ACESSÍVEL',
    badgeType: 'cheap',
    isPromo: true,
    sold: 3120,
    rating: 4.8,
    reviews: 203,
    reviewsCount: 203,
    imageKey: 'aniBlack',
    coverImage: getImage('aniBlackA'),
    desc: '20 fotos de aniversário com inteligência artificial. Descreva a comemoração, o estilo e o clima da festa — a IA devolve um ensaio completo, com acabamento black e iluminação cinematográfica de estúdio.',
    description: '20 fotos de aniversário com inteligência artificial. Descreva a comemoração, o estilo e o clima da festa — a IA devolve um ensaio completo, com acabamento black e iluminação cinematográfica de estúdio.',
    features: [
      '20 fotografias em altíssima resolução',
      'Download instantâneo no e-mail',
      'Acabamento estético Black & Gold',
      'Pose e expressões personalizadas',
      'Compatível para redes sociais e impressão'
    ],
    galleryImages: [
      getImage('aniBlackA'),
      getImage('aniBlackB'),
      getImage('aniBlackC'),
      getImage('aniBlackD'),
      getImage('aniBlackE'),
      getImage('aniBlackF')
    ],
    gallery: [
      getImage('aniBlackA'),
      getImage('aniBlackB'),
      getImage('aniBlackC'),
      getImage('aniBlackD'),
      getImage('aniBlackE'),
      getImage('aniBlackF')
    ],
    tags: ['Aniversário', 'Black', 'Individual', 'Festa']
  },
  {
    id: 'p2',
    slug: 'album-aniversario-50-fotos-luxury',
    name: 'Álbum Aniversário — 50 Fotos Luxury',
    cat: 'aniversario',
    category: 'Aniversário',
    price: 49.90,
    originalPrice: 99.90,
    photos: 50,
    photoCount: 50,
    deliveryHours: 24,
    badge: 'MAIS VENDIDO',
    badgeType: 'best',
    isPromo: true,
    isPopular: true,
    sold: 5480,
    rating: 4.9,
    reviews: 512,
    reviewsCount: 512,
    imageKey: 'aniLux',
    coverImage: getImage('aniLuxA'),
    desc: '50 fotos de aniversário com IA em versão Luxury: direção de arte premium, cenários variados e refinamento editorial em cada imagem. O álbum mais completo e desejado da loja.',
    description: '50 fotos de aniversário com IA em versão Luxury: direção de arte premium, cenários variados e refinamento editorial em cada imagem. O álbum mais completo e desejado da loja.',
    features: [
      '50 fotografias com direção editorial completa',
      'Download imediato e link permanente',
      'Múltiplos cenários de luxo e trocas de figurino',
      'Iluminação de revista e pós-produção IA hiper-realista',
      'Guia de prompts exclusivo incluído'
    ],
    galleryImages: [
      getImage('aniLuxA'),
      getImage('aniLuxB'),
      getImage('aniLuxC'),
      getImage('aniLuxD'),
      getImage('aniLuxE'),
      getImage('aniLuxF')
    ],
    gallery: [
      getImage('aniLuxA'),
      getImage('aniLuxB'),
      getImage('aniLuxC'),
      getImage('aniLuxD'),
      getImage('aniLuxE'),
      getImage('aniLuxF')
    ],
    tags: ['Aniversário', 'Luxury', 'Editorial', 'Premium']
  },
  {
    id: 'p3',
    slug: 'album-casal-25-fotos',
    name: 'Álbum Casal — 25 Fotos',
    cat: 'casal',
    category: 'Casal',
    price: 39.90,
    originalPrice: 79.90,
    photos: 25,
    photoCount: 25,
    deliveryHours: 12,
    badge: 'POPULAR',
    badgeType: 'new',
    isPromo: true,
    sold: 2210,
    rating: 4.9,
    reviews: 264,
    reviewsCount: 264,
    imageKey: 'casal25',
    coverImage: getImage('casal25A'),
    desc: '25 fotos de casal com IA: vocês dois em múltiplas locações, luzes do pôr do sol e climas aconchegantes. Um ensaio romântico e emocionante completo sem sair de casa.',
    description: '25 fotos de casal com IA: vocês dois em múltiplas locações, luzes do pôr do sol e climas aconchegantes. Um ensaio romântico e emocionante completo sem sair de casa.',
    features: [
      '25 fotografias do casal em harmonia perfeita',
      'Locações românticas ao redor do mundo',
      'Iluminação natural dourada (Golden Hour)',
      'Renderização facial de alta fidelidade dos dois',
      'Entrega digital sem custos de frete'
    ],
    galleryImages: [
      getImage('casal25A'),
      getImage('casal25B'),
      getImage('casal25C'),
      getImage('casal25D'),
      getImage('casal25E'),
      getImage('casal25F')
    ],
    gallery: [
      getImage('casal25A'),
      getImage('casal25B'),
      getImage('casal25C'),
      getImage('casal25D'),
      getImage('casal25E'),
      getImage('casal25F')
    ],
    tags: ['Casal', 'Romântico', 'Namorados', 'Golden Hour']
  },
  {
    id: 'p4',
    slug: 'album-turismo-20-fotos-paris',
    name: 'Álbum Turismo — 20 Fotos de Paris',
    cat: 'turismo',
    category: 'Turismo',
    price: 39.90,
    originalPrice: 79.90,
    photos: 20,
    photoCount: 20,
    deliveryHours: 12,
    badge: 'DESTINO DOS SONHOS',
    badgeType: 'best',
    isPromo: true,
    sold: 2650,
    rating: 4.9,
    reviews: 321,
    reviewsCount: 321,
    imageKey: 'paris20',
    coverImage: getImage('paris20A'),
    desc: '20 fotos de Paris com IA. A Torre Eiffel, os bistrôs clássicos, as ruas charmosas de Montmartre e as margens do Sena como cenário — com você no centro da cena.',
    description: '20 fotos de Paris com IA. A Torre Eiffel, os bistrôs clássicos, as ruas charmosas de Montmartre e as margens do Sena como cenário — com você no centro da cena.',
    features: [
      '20 fotos em pontos icônicos de Paris',
      'Cenários diurnos e noturnos com a Torre iluminada',
      'Estilo fotográfico cinematográfico francês',
      'Ajustes de look de inverno ou verão à sua escolha',
      'Acesso instantâneo aos arquivos digitais'
    ],
    galleryImages: [
      getImage('paris20A'),
      getImage('paris20B'),
      getImage('paris20C'),
      getImage('paris20D'),
      getImage('paris20E'),
      getImage('paris20F')
    ],
    gallery: [
      getImage('paris20A'),
      getImage('paris20B'),
      getImage('paris20C'),
      getImage('paris20D'),
      getImage('paris20E'),
      getImage('paris20F')
    ],
    tags: ['Turismo', 'Paris', 'Viagem', 'Europa']
  }
];

export const CATEGORIES: Record<string, CategoryInfo> = {
  todos: {
    id: 'todos',
    name: 'Todos os Produtos',
    tag: 'Veja todos os nossos produtos',
    desc: 'Encontre o ensaio perfeito para transformar sua ideia em uma memória inesquecível criada com IA.',
    image: getImage('catTodos'),
    headline: 'Todos os <em class="text-[#A6825B] not-italic">produtos</em>'
  },
  aniversario: {
    id: 'aniversario',
    name: 'Aniversário',
    tag: 'Essa data especial com IA',
    desc: 'Seu aniversário merece uma foto inesquecível. Versões Black e Luxury do ensaio de aniversário com acabamento de alta costura.',
    image: getImage('catAni'),
    headline: 'Seu aniversário merece uma foto <em class="text-[#A6825B] not-italic">inesquecível.</em>'
  },
  turismo: {
    id: 'turismo',
    name: 'Turismo',
    tag: 'Fotos IA com cidades turísticas',
    desc: 'Fotos IA com as cidades mais desejadas do mundo como cenário, dos cafés parisienses aos monumentos mundiais.',
    image: getImage('catTur'),
    headline: 'O mundo inteiro como <em class="text-[#A6825B] not-italic">cenário.</em>'
  },
  casal: {
    id: 'casal',
    name: 'Casal',
    tag: 'Fotos de casal em cidades',
    desc: 'Fotos de casal em cidades ao redor do mundo, com clima cinematográfico e emoção genuína.',
    image: getImage('catCas'),
    headline: 'Vocês dois em qualquer <em class="text-[#A6825B] not-italic">cidade.</em>'
  }
};

export const UPCOMING_CATEGORIES = [
  'Gestante',
  'Família',
  'Profissional',
  'Formatura',
  'Casamento',
  'Beleza',
  'Fitness',
  'Fashion',
  'Natal',
  'Dia das Mães',
  'Dia dos Pais'
];
