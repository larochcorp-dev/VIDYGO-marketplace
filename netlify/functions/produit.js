// ============================================================
// VIDYGO - Page produit dynamique (Netlify Function)
// Développé par Yv Laroch / GraphyNdot
// ============================================================

const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase (à remplacer par tes vraies clés)
const SUPABASE_URL = 'https://skwjegapurcdtpbpijdw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_DiikoWVwaZ39vbiHWwCbUw_NE9LndE7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
    try {
        // 1. Récupérer le slug depuis l'URL
        // Exemple : /p/robe-longue-fleurie-1
        const pathParts = event.path.split('/');
        const slug = pathParts[pathParts.length - 1];

        if (!slug) {
            return {
                statusCode: 404,
                body: 'Produit non trouvé'
            };
        }

        // 2. Chercher le produit dans Supabase
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !product) {
            console.error('Erreur Supabase :', error);
            return {
                statusCode: 404,
                body: 'Produit non trouvé'
            };
        }

        // 3. Construction de la page HTML
        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
    <title>${product.name} - Vidygo</title>

    <!-- ===== OPEN GRAPH (pour Facebook, WhatsApp, TikTok) ===== -->
    <meta property="og:title" content="${product.name} - ${product.price.toLocaleString()} Ar" />
    <meta property="og:description" content="Achetez ${product.name} sur Vidygo. Vendu par ${product.seller_name || 'un vendeur de confiance'}." />
    <meta property="og:image" content="${product.photo_url}" />
    <meta property="og:url" content="https://vidygo.com/p/${product.slug}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Vidygo" />

    <!-- ===== TWITTER CARD ===== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${product.name} - ${product.price.toLocaleString()} Ar" />
    <meta name="twitter:description" content="Achetez ${product.name} sur Vidygo." />
    <meta name="twitter:image" content="${product.photo_url}" />

    <!-- ===== STYLES ===== -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap" rel="stylesheet" />
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Space Grotesk', -apple-system, sans-serif;
            background: #f0f2f5;
            display: flex;
            justify-content: center;
            padding: 20px 12px;
            min-height: 100vh;
        }
        .container {
            max-width: 420px;
            width: 100%;
            background: white;
            border-radius: 20px;
            padding: 24px 20px 32px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .product-image {
            width: 100%;
            border-radius: 16px;
            margin-bottom: 16px;
            background: #eee;
        }
        .product-name {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .product-price {
            font-size: 26px;
            font-weight: 700;
            color: #25D366;
            margin-bottom: 4px;
        }
        .product-seller {
            font-size: 14px;
            color: #888;
            margin-bottom: 16px;
        }
        .product-stock {
            font-size: 14px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 50px;
            display: inline-block;
            margin-bottom: 20px;
            background: #e8f5e9;
            color: #2e7d32;
        }
        .product-stock.out { background: #ffebee; color: #c62828; }
        .btn-commander {
            display: block;
            width: 100%;
            padding: 16px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            box-shadow: 0 4px 12px rgba(37,211,102,0.3);
            transition: 0.2s;
        }
        .btn-commander:active { transform: scale(0.97); background: #1da855; }
        .btn-commander.disabled {
            background: #ccc;
            box-shadow: none;
            pointer-events: none;
        }
        .footer-credit {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 11px;
            color: #999;
        }
        .footer-credit strong { color: #666; }
        .back-link {
            display: inline-block;
            margin-top: 12px;
            color: #25D366;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
        }
    </style>
</head>
<body>

<div class="container">
    <img src="${product.photo_url}" alt="${product.name}" class="product-image" />
    
    <div class="product-name">${product.name}</div>
    <div class="product-price">${product.price.toLocaleString()} Ar</div>
    <div class="product-seller">👤 Vendu par ${product.seller_name || 'Vendeur'}</div>
    
    <div class="product-stock ${product.stock > 0 ? '' : 'out'}">
        ${product.stock > 0 ? '✅ En stock' : '❌ Rupture de stock'}
    </div>

    ${product.stock > 0 ? `
        <button class="btn-commander" id="commanderBtn">🛒 Commander via WhatsApp</button>
    ` : `
        <button class="btn-commander disabled">❌ Indisponible</button>
    `}

    <a href="https://vidygo.com/boutique.html" class="back-link">← Retour à la boutique</a>

    <div class="footer-credit">
        Site développé par <strong>Yv Laroch</strong> / <strong>GraphyNdot</strong>
    </div>
</div>

${product.stock > 0 ? `
<script>
    // ============================================================
    // BOUTON COMMANDER - Ouvre WhatsApp avec message pré-rempli
    // ============================================================
    document.getElementById('commanderBtn').addEventListener('click', () => {
        const message = encodeURIComponent(
            'Bonjour 👋\\n\\n' +
            'Je souhaite commander le produit suivant via Vidygo :\\n' +
            '📦 ${product.name}\\n' +
            '💰 ${product.price.toLocaleString()} Ar\\n' +
            '🆔 Référence : ${product.slug}\\n\\n' +
            'Merci de me contacter pour la livraison.'
        );
        const phone = '${product.seller_whatsapp || '261341234567'}';
        const url = 'https://wa.me/' + phone + '?text=' + message;
        window.open(url, '_blank');
    });
</script>
` : ''}

</body>
</html>
        `;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            },
            body: html
        };

    } catch (error) {
        console.error('Erreur fatale :', error);
        return {
            statusCode: 500,
            body: 'Erreur interne du serveur'
        };
    }
};
