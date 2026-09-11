import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY || 'abc_prod_fLYhfaYWKZyXYBD1yCFHnQF6';

// List of Admin Emails
const ADMIN_EMAILS = [
  'jomamilionarios@gmail.com',
  'admin@momentosfotosia.com.br',
  'contato@momentosfotosia.com.br',
];

// In-Memory Database for Customer Orders with persistent structure
interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    photos: number;
    imageKey: string;
  };
  quantity: number;
}

interface PhotoRecord {
  id: string;
  name: string;
  size: number;
  dataUrl?: string;
  url?: string;
  uploadedAt: string;
}

interface OrderRecord {
  id: string;
  code: string;
  name: string;
  email: string;
  whatsapp: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'card';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  pixId?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  uploadedPhotos: PhotoRecord[];
  customerPhotos?: PhotoRecord[];
  aiDeliveryLink?: string;
  aiDeliveryStatus?: 'pending' | 'delivered';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Database for Customer Orders (Empty by default, only real orders)
let ordersDatabase: OrderRecord[] = [];

// Products In-Memory Database initialized with default products
let productsDatabase: any[] = [
  {
    id: 'p1',
    slug: 'album-aniversario-20-fotos-black',
    name: 'Álbum Aniversário — 20 Fotos Black',
    category: 'aniversario',
    cat: 'aniversario',
    price: 29.90,
    originalPrice: 59.90,
    photos: 20,
    photoCount: 20,
    deliveryHours: 2,
    badge: 'MAIS ACESSÍVEL',
    badgeType: 'cheap',
    isPopular: true,
    isPromo: true,
    sold: 3120,
    rating: 4.8,
    reviews: 203,
    reviewsCount: 203,
    imageKey: 'aniBlack',
    coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
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
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041_1.jpg?v=1787629477',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041.jpg?v=1787629477',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_para_poses_de_aniversario__202608250041.jpg?v=1787629477',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_for_birthday_photography___202608250041.jpg?v=1787629477'
    ],
    gallery: [
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041_1.jpg?v=1787629477'
    ],
    tags: ['Aniversário', 'Black', 'Balões', 'Comemoração']
  },
  {
    id: 'p2',
    slug: 'album-aniversario-50-fotos-luxury',
    name: 'Álbum Aniversário — 50 Fotos Luxury',
    category: 'aniversario',
    cat: 'aniversario',
    price: 49.90,
    originalPrice: 99.90,
    photos: 50,
    photoCount: 50,
    deliveryHours: 2,
    badge: 'MAIS VENDIDO',
    badgeType: 'best',
    isPopular: true,
    isPromo: true,
    sold: 5480,
    rating: 4.9,
    reviews: 512,
    reviewsCount: 512,
    imageKey: 'aniLux',
    coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
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
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034.jpg?v=1787628862',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_2.jpg?v=1787628862',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033.jpg?v=1787628862',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_1.jpg?v=1787628862'
    ],
    gallery: [
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862'
    ],
    tags: ['Luxury', 'Aniversário', 'Alta Resolução', 'Champanhe']
  },
  {
    id: 'p3',
    slug: 'album-casal-25-fotos',
    name: 'Álbum Casal — 25 Fotos',
    category: 'casal',
    cat: 'casal',
    price: 39.90,
    originalPrice: 79.90,
    photos: 25,
    photoCount: 25,
    deliveryHours: 2,
    badge: 'POPULAR',
    badgeType: 'new',
    isPopular: true,
    isPromo: false,
    sold: 2210,
    rating: 4.9,
    reviews: 264,
    reviewsCount: 264,
    imageKey: 'casal25',
    coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
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
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Romantic_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106_1.jpg?v=1787630860',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106.jpg?v=1787630860',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106_1.jpg?v=1787630861'
    ],
    gallery: [
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860'
    ],
    tags: ['Casal', 'Romântico', 'Golden Hour', 'Dia dos Namorados']
  },
  {
    id: 'p4',
    slug: 'album-turismo-paris-20-fotos',
    name: 'Álbum Turismo — Paris 20 Fotos',
    category: 'turismo',
    cat: 'turismo',
    price: 34.90,
    originalPrice: 69.90,
    photos: 20,
    photoCount: 20,
    deliveryHours: 2,
    badge: 'NOVO',
    badgeType: 'new',
    isPopular: false,
    isPromo: true,
    sold: 1450,
    rating: 4.8,
    reviews: 178,
    reviewsCount: 178,
    imageKey: 'paris20',
    coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
    desc: '20 fotos em Paris: Torre Eiffel, cafés charmosos de Montmartre e margens do Rio Sena. A sua viagem dos sonhos registrada com riqueza de detalhes e luz natural impecável.',
    description: '20 fotos em Paris: Torre Eiffel, cafés charmosos de Montmartre e margens do Rio Sena. A sua viagem dos sonhos registrada com riqueza de detalhes e luz natural impecável.',
    features: [
      '20 fotografias com monumentos icônicos de Paris',
      'Atmosfera de viagem europeia cinematográfica',
      'Vários ângulos e roupas de inverno/primavera',
      'Fidelidade facial e proporção anatômica perfeitas',
      'Download em alta definição'
    ],
    galleryImages: [
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_3.jpg?v=1787630354',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_2.jpg?v=1787630354',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_1.jpg?v=1787630354',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058.jpg?v=1787630354'
    ],
    gallery: [
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
      'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354'
    ],
    tags: ['Turismo', 'Paris', 'Viagem', 'Torre Eiffel']
  }
];

// Helper to normalize product format
function normalizeProduct(p: any) {
  const cover = p.coverImage || (p.galleryImages && p.galleryImages[0]) || (p.gallery && p.gallery[0]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
  const gallery = Array.isArray(p.galleryImages) && p.galleryImages.length > 0 
    ? p.galleryImages 
    : (Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : [cover]);

  const cat = (p.category || p.cat || 'Geral').toString().trim();

  return {
    id: p.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: p.name || 'Ensaio Digital IA',
    cat: cat,
    category: cat,
    price: Number(p.price) || 29.90,
    originalPrice: Number(p.originalPrice) || (Number(p.price) ? Number(p.price) * 1.5 : 59.90),
    photos: Number(p.photos) || Number(p.photoCount) || 20,
    photoCount: Number(p.photos) || Number(p.photoCount) || 20,
    deliveryHours: Number(p.deliveryHours) || 2,
    badge: p.badge || null,
    badgeType: p.badgeType || null,
    isPopular: Boolean(p.isPopular),
    isPromo: Boolean(p.isPromo),
    sold: Number(p.sold) || 120,
    rating: Number(p.rating) || 4.9,
    reviews: Number(p.reviews) || Number(p.reviewsCount) || 48,
    reviewsCount: Number(p.reviews) || Number(p.reviewsCount) || 48,
    imageKey: p.imageKey || 'aniBlack',
    coverImage: cover,
    desc: p.desc || p.description || '',
    description: p.desc || p.description || '',
    features: Array.isArray(p.features) ? p.features : ['Fotos em alta resolução', 'Entrega rápida'],
    galleryImages: gallery,
    gallery: gallery,
    tags: Array.isArray(p.tags) ? p.tags : []
  };
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/auth/google/url - Construct Google OAuth 2.0 Authorization URL
app.get('/api/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl}/auth/callback`;

  if (!clientId) {
    return res.json({
      success: false,
      configured: false,
      message: 'Google Client ID not yet configured in environment variables.',
      redirectUri,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent select_account',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.json({
    success: true,
    configured: true,
    url: authUrl,
    redirectUri,
  });
});

// OAuth Callback Route handler for popup postMessage communication
app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
  const { code, error } = req.query;

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Google OAuth - Momentos Fotos IA</title>
      </head>
      <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #FAF9F7;">
        <div style="text-align: center; padding: 24px; background: white; border-radius: 16px; border: 1px solid #EAE8E4; max-width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="font-size: 24px; margin-bottom: 8px;">🔐</div>
          <h3 style="margin: 0 0 8px 0; color: #111;">Autenticação Concluída</h3>
          <p style="margin: 0; font-size: 13px; color: #666;">Retornando para o Momentos Fotos IA...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              code: ${JSON.stringify(code || '')},
              error: ${JSON.stringify(error || '')}
            }, '*');
            setTimeout(() => { window.close(); }, 400);
          } else {
            window.location.href = '/#/login';
          }
        </script>
      </body>
    </html>
  `);
});

// Google Authentication Route
app.post('/api/auth/google-login', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'E-mail obrigatório para login.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

    let defaultName = cleanEmail.split('@')[0];
    if (cleanEmail === 'jomamilionarios@gmail.com') {
      defaultName = 'Administrador Joma';
    } else {
      defaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    }

    const user = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      name: name && name.trim() ? name.trim() : defaultName,
      email: cleanEmail,
      avatar: avatar || (cleanEmail === 'jomamilionarios@gmail.com' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : undefined),
      isAdmin,
      role: isAdmin ? 'ADMIN' : 'LEAD_USER',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Erro no login' });
  }
});

// GET /api/orders - Fetch orders (all for Admin or filtered by email for Lead User)
app.get('/api/orders', (req, res) => {
  try {
    const { email } = req.query;
    let list = [...ordersDatabase];
    if (email && typeof email === 'string') {
      list = list.filter((o) => o.email.toLowerCase() === email.trim().toLowerCase());
    }
    const sorted = list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ success: true, orders: sorted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders - Create or update an order with photos and payment status
app.post('/api/orders', (req, res) => {
  try {
    const {
      id,
      code,
      name,
      email,
      whatsapp,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      paymentStatus,
      pixId,
      pixQrCode,
      pixQrCodeBase64,
      uploadedPhotos,
      customerPhotos,
      notes,
    } = req.body;

    if (!name || !email || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Dados incompletos do pedido.' });
    }

    // Normalize customer uploaded photos so both dataUrl and url are always populated
    const rawPhotos = Array.isArray(uploadedPhotos) && uploadedPhotos.length > 0 
      ? uploadedPhotos 
      : (Array.isArray(customerPhotos) ? customerPhotos : []);

    const sanitizedPhotos: PhotoRecord[] = rawPhotos.map((p: any) => ({
      id: p.id || `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: p.name || 'foto-cliente.jpg',
      size: Number(p.size) || 0,
      dataUrl: p.dataUrl || p.url || '',
      url: p.url || p.dataUrl || '',
      uploadedAt: p.uploadedAt || new Date().toISOString(),
    }));

    const orderCode = code || `MFIA-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = id || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Check if order already exists (by code or pixId)
    const existingIndex = ordersDatabase.findIndex(
      (o) => o.code === orderCode || (pixId && o.pixId === pixId) || (id && o.id === id)
    );

    if (existingIndex !== -1) {
      const existing = ordersDatabase[existingIndex];
      const updatedOrder: OrderRecord = {
        ...existing,
        name: String(name).trim(),
        email: String(email).trim(),
        whatsapp: String(whatsapp || existing.whatsapp || '').trim(),
        items: Array.isArray(items) ? items : existing.items,
        subtotal: Number(subtotal) || existing.subtotal,
        discount: Number(discount) !== undefined ? Number(discount) : existing.discount,
        total: Number(total) || existing.total,
        paymentMethod: paymentMethod === 'card' ? 'card' : 'pix',
        paymentStatus: paymentStatus || existing.paymentStatus,
        pixId: pixId || existing.pixId,
        pixQrCode: pixQrCode || existing.pixQrCode,
        pixQrCodeBase64: pixQrCodeBase64 || existing.pixQrCodeBase64,
        uploadedPhotos: sanitizedPhotos.length > 0 ? sanitizedPhotos : existing.uploadedPhotos,
        customerPhotos: sanitizedPhotos.length > 0 ? sanitizedPhotos : existing.customerPhotos,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: new Date().toISOString(),
      };

      ordersDatabase[existingIndex] = updatedOrder;

      return res.json({
        success: true,
        order: updatedOrder,
      });
    }

    const newOrder: OrderRecord = {
      id: orderId,
      code: orderCode,
      name: String(name).trim(),
      email: String(email).trim(),
      whatsapp: String(whatsapp || '').trim(),
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      paymentMethod: paymentMethod === 'card' ? 'card' : 'pix',
      paymentStatus: paymentStatus || (paymentMethod === 'card' ? 'PAID' : 'PENDING'),
      pixId: pixId || undefined,
      pixQrCode: pixQrCode || undefined,
      pixQrCodeBase64: pixQrCodeBase64 || undefined,
      uploadedPhotos: sanitizedPhotos,
      customerPhotos: sanitizedPhotos,
      aiDeliveryLink: '',
      aiDeliveryStatus: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insert at beginning
    ordersDatabase.unshift(newOrder);

    return res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, error: error.message || 'Erro ao salvar pedido.' });
  }
});

// PATCH /api/orders/:id/status - Update payment status
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'PAID', 'FAILED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Status de pagamento inválido.' });
    }

    const orderIndex = ordersDatabase.findIndex((o) => o.id === id || o.code === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
    }

    ordersDatabase[orderIndex].paymentStatus = status;
    ordersDatabase[orderIndex].updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      order: ordersDatabase[orderIndex],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders/:id/delivery - Update AI Delivery link
app.post('/api/orders/:id/delivery', (req, res) => {
  try {
    const { id } = req.params;
    const { aiDeliveryLink, aiDeliveryStatus, notes } = req.body;

    const orderIndex = ordersDatabase.findIndex((o) => o.id === id || o.code === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
    }

    if (aiDeliveryLink !== undefined) {
      ordersDatabase[orderIndex].aiDeliveryLink = aiDeliveryLink;
    }
    if (aiDeliveryStatus !== undefined) {
      ordersDatabase[orderIndex].aiDeliveryStatus = aiDeliveryStatus;
    }
    if (notes !== undefined) {
      ordersDatabase[orderIndex].notes = notes;
    }
    ordersDatabase[orderIndex].updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      order: ordersDatabase[orderIndex],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/orders/:id/sync-abacatepay - Query AbacatePay for order's pixId and sync
app.post('/api/orders/:id/sync-abacatepay', async (req, res) => {
  try {
    const { id } = req.params;
    const orderIndex = ordersDatabase.findIndex((o) => o.id === id || o.code === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
    }

    const order = ordersDatabase[orderIndex];
    if (!order.pixId) {
      return res.status(400).json({ success: false, error: 'Este pedido não possui ID Pix AbacatePay associado.' });
    }

    const { AbacatePay } = await import('@abacatepay/sdk');
    const client = AbacatePay({ secret: ABACATEPAY_API_KEY });
    const response = await client.pix.status(order.pixId);

    if (response && response.success && response.data) {
      const pixStatus = String(response.data.status);
      if (pixStatus === 'PAID' || pixStatus === 'COMPLETED') {
        ordersDatabase[orderIndex].paymentStatus = 'PAID';
        ordersDatabase[orderIndex].updatedAt = new Date().toISOString();
      }
      return res.json({
        success: true,
        abacateData: response.data,
        order: ordersDatabase[orderIndex],
      });
    }

    return res.json({
      success: true,
      order: ordersDatabase[orderIndex],
    });
  } catch (error: any) {
    console.error('Error syncing with AbacatePay:', error);
    return res.status(500).json({ success: false, error: error.message || 'Erro ao sincronizar com AbacatePay' });
  }
});

// DELETE /api/orders/:id - Remove order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = ordersDatabase.length;
    ordersDatabase = ordersDatabase.filter((o) => o.id !== id && o.code !== id);

    if (ordersDatabase.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
    }

    return res.json({ success: true, message: 'Pedido excluído com sucesso.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PRODUCTS REST API (Admin CRUD & Public Catalog)
// ==========================================

// GET /api/products - List all products
app.get('/api/products', (req, res) => {
  try {
    const { category, promo } = req.query;
    let list = [...productsDatabase];

    if (category && typeof category === 'string' && category !== 'todos' && category !== 'all') {
      const catLower = category.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.category && p.category.toLowerCase().trim() === catLower) ||
          (p.cat && p.cat.toLowerCase().trim() === catLower)
      );
    }

    if (promo === 'true') {
      list = list.filter((p) => p.isPromo === true);
    }

    return res.json({
      success: true,
      products: list,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Erro ao carregar produtos.' });
  }
});

// GET /api/products/:idOrSlug - Get single product
app.get('/api/products/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const found = productsDatabase.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
    }
    return res.json({ success: true, product: found });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products - Create new product
app.post('/api/products', (req, res) => {
  try {
    const data = req.body;
    if (!data.name || data.price === undefined) {
      return res.status(400).json({ success: false, error: 'Nome e Preço são obrigatórios.' });
    }

    const newProduct = normalizeProduct(data);
    productsDatabase.push(newProduct);

    return res.status(201).json({
      success: true,
      product: newProduct,
      message: 'Produto cadastrado com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Erro ao criar produto.' });
  }
});

// PUT /api/products/:id - Update existing product
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = productsDatabase.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado para edição.' });
    }

    const updated = normalizeProduct({
      ...productsDatabase[index],
      ...req.body,
      id, // Preserve ID
    });

    productsDatabase[index] = updated;

    return res.json({
      success: true,
      product: updated,
      message: 'Produto atualizado com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = productsDatabase.length;
    productsDatabase = productsDatabase.filter((p) => p.id !== id);

    if (productsDatabase.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
    }

    return res.json({
      success: true,
      message: 'Produto removido com sucesso!',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products/reset - Reset to factory defaults
app.post('/api/products/reset', (req, res) => {
  try {
    // Reset database to initial items
    productsDatabase = [
      {
        id: 'p1',
        slug: 'album-aniversario-20-fotos-black',
        name: 'Álbum Aniversário — 20 Fotos Black',
        category: 'aniversario',
        cat: 'aniversario',
        price: 29.90,
        originalPrice: 59.90,
        photos: 20,
        photoCount: 20,
        deliveryHours: 2,
        badge: 'MAIS ACESSÍVEL',
        badgeType: 'cheap',
        isPopular: true,
        isPromo: true,
        sold: 3120,
        rating: 4.8,
        reviews: 203,
        reviewsCount: 203,
        imageKey: 'aniBlack',
        coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
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
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041_1.jpg?v=1787629477',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250041.jpg?v=1787629477',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_para_poses_de_aniversario__202608250041.jpg?v=1787629477',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Prompt_for_birthday_photography___202608250041.jpg?v=1787629477'
        ],
        gallery: [
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250054.jpg?v=1787630087',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Woman_holding_birthday_cake_202608250042.jpg?v=1787629477'
        ],
        tags: ['Aniversário', 'Black', 'Balões', 'Comemoração']
      },
      {
        id: 'p2',
        slug: 'album-aniversario-50-fotos-luxury',
        name: 'Álbum Aniversário — 50 Fotos Luxury',
        category: 'aniversario',
        cat: 'aniversario',
        price: 49.90,
        originalPrice: 99.90,
        photos: 50,
        photoCount: 50,
        deliveryHours: 2,
        badge: 'MAIS VENDIDO',
        badgeType: 'best',
        isPopular: true,
        isPromo: true,
        sold: 5480,
        rating: 4.9,
        reviews: 512,
        reviewsCount: 512,
        imageKey: 'aniLux',
        coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
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
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034.jpg?v=1787628862',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_2.jpg?v=1787628862',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033.jpg?v=1787628862',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250033_1.jpg?v=1787628862'
        ],
        gallery: [
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Hand_holding_birthday_photo_album_202608250053.jpg?v=1787630055',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_birthday_photoshoot_prompt_202608250034_1.jpg?v=1787628862'
        ],
        tags: ['Luxury', 'Aniversário', 'Alta Resolução', 'Champanhe']
      },
      {
        id: 'p3',
        slug: 'album-casal-25-fotos',
        name: 'Álbum Casal — 25 Fotos',
        category: 'casal',
        cat: 'casal',
        price: 39.90,
        originalPrice: 79.90,
        photos: 25,
        photoCount: 25,
        deliveryHours: 2,
        badge: 'POPULAR',
        badgeType: 'new',
        isPopular: true,
        isPromo: false,
        sold: 2210,
        rating: 4.9,
        reviews: 264,
        reviewsCount: 264,
        imageKey: 'casal25',
        coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
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
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Romantic_couple_photoshoot_prompt_202608250106.jpg?v=1787630860',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106_1.jpg?v=1787630860',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106.jpg?v=1787630860',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Luxury_Valentine_couple_photosho__202608250106_1.jpg?v=1787630861'
        ],
        gallery: [
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Creating_birthday_photo_album_la__202608250109.jpg?v=1787630958',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Valentine_couple_photoshoot_prompt_202608250106.jpg?v=1787630860'
        ],
        tags: ['Casal', 'Romântico', 'Golden Hour', 'Dia dos Namorados']
      },
      {
        id: 'p4',
        slug: 'album-turismo-paris-20-fotos',
        name: 'Álbum Turismo — Paris 20 Fotos',
        category: 'turismo',
        cat: 'turismo',
        price: 34.90,
        originalPrice: 69.90,
        photos: 20,
        photoCount: 20,
        deliveryHours: 2,
        badge: 'NOVO',
        badgeType: 'new',
        isPopular: false,
        isPromo: true,
        sold: 1450,
        rating: 4.8,
        reviews: 178,
        reviewsCount: 178,
        imageKey: 'paris20',
        coverImage: 'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
        desc: '20 fotos em Paris: Torre Eiffel, cafés charmosos de Montmartre e margens do Rio Sena. A sua viagem dos sonhos registrada com riqueza de detalhes e luz natural impecável.',
        description: '20 fotos em Paris: Torre Eiffel, cafés charmosos de Montmartre e margens do Rio Sena. A sua viagem dos sonhos registrada com riqueza de detalhes e luz natural impecável.',
        features: [
          '20 fotografias com monumentos icônicos de Paris',
          'Atmosfera de viagem europeia cinematográfica',
          'Vários ângulos e roupas de inverno/primavera',
          'Fidelidade facial e proporção anatômica perfeitas',
          'Download em alta definição'
        ],
        galleryImages: [
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_3.jpg?v=1787630354',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_2.jpg?v=1787630354',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058_1.jpg?v=1787630354',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250058.jpg?v=1787630354'
        ],
        gallery: [
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Person_holding_birthday_photo_album_202608250100.jpg?v=1787630426',
          'https://cdn.shopify.com/s/files/1/0850/5167/0763/files/Couple_photoshoot_in_Paris_202608250059.jpg?v=1787630354'
        ],
        tags: ['Turismo', 'Paris', 'Viagem', 'Torre Eiffel']
      }
    ];

    return res.json({
      success: true,
      products: productsDatabase,
      message: 'Catálogo de produtos restaurado para o padrão original!',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Create Pix QR Code via AbacatePay
app.post('/api/abacatepay/pix/create', async (req, res) => {
  try {
    const { amount, description, customer } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valor inválido para o Pix (amount em centavos obrigatório).',
      });
    }

    // Lazy load AbacatePay SDK
    const { AbacatePay } = await import('@abacatepay/sdk');
    const client = AbacatePay({ secret: ABACATEPAY_API_KEY });

    const payload: any = {
      amount: Math.round(amount),
      description: description || 'Momentos Fotos IA - Ensaio Digital',
    };

    // If customer has a valid taxId (CPF/CNPJ), include it, otherwise exclude to avoid schema validation failure
    if (customer && customer.name && customer.email && customer.cellphone && customer.taxId) {
      const cleanTaxId = String(customer.taxId).replace(/\D/g, '');
      if (cleanTaxId.length === 11 || cleanTaxId.length === 14) {
        payload.customer = {
          name: customer.name,
          email: customer.email,
          cellphone: customer.cellphone.replace(/\D/g, ''),
          taxId: cleanTaxId,
        };
      }
    }

    const response = await client.pix.create(payload as any);

    if (!response || !response.success) {
      console.error('AbacatePay Pix Create Error:', response?.error);
      return res.status(400).json({
        success: false,
        error: response?.error || 'Erro ao gerar Pix no AbacatePay',
      });
    }

    const pixData: any = response.data || {};
    let generatedQrCodeBase64 = pixData.brCodeBase64 || pixData.qrCodeUrl || '';

    // If brCode EMV string exists, generate crisp base64 Data URL using QRCode library
    if (pixData.brCode) {
      try {
        generatedQrCodeBase64 = await QRCode.toDataURL(pixData.brCode, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 480,
          color: {
            dark: '#111111',
            light: '#FFFFFF',
          },
        });
      } catch (qrErr) {
        console.error('QRCode generation error:', qrErr);
      }
    }

    const enrichedPixData = {
      ...pixData,
      brCodeBase64: generatedQrCodeBase64,
      qrCodeUrl: generatedQrCodeBase64 || pixData.qrCodeUrl || '',
    };

    return res.json({
      success: true,
      data: enrichedPixData,
    });
  } catch (error: any) {
    console.error('Server error creating AbacatePay Pix:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar Pix.',
    });
  }
});

// Check Pix status via AbacatePay
app.get('/api/abacatepay/pix/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID do Pix não fornecido.' });
    }

    const { AbacatePay } = await import('@abacatepay/sdk');
    const client = AbacatePay({ secret: ABACATEPAY_API_KEY });

    const response = await client.pix.status(id);

    if (!response || !response.success) {
      return res.status(400).json({
        success: false,
        error: response?.error || 'Erro ao verificar status do Pix.',
      });
    }

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error('Server error checking Pix status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao consultar status.',
    });
  }
});

// Vite middleware & SPA fallback
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Momentos Fotos IA server running on port ${PORT}`);
  });
}

setupVite();
