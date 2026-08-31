// ============================================================
// VIDYGO - MAIN.JS
// Développé par Yv Laroch / GraphyNdot
// ============================================================

// Configuration Supabase (à remplacer avec tes vraies clés)
const SUPABASE_URL = 'https://ton-projet.supabase.co';
const SUPABASE_ANON_KEY = 'ton_cle_anon_publique';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Éléments du DOM
const productGrid = document.getElementById('productGrid');

// Chargement des produits depuis Supabase
async function loadProducts() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8); // On affiche les 8 derniers produits

        if (error) throw error;

        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div class="product-card placeholder">
                    <p>Aucun produit disponible pour le moment.</p>
                    <p style="font-size:0.9rem; color:var(--text-muted);">
                        <a href="admin/ajouter-produit.html" style="color:var(--primary);">Publiez le premier produit !</a>
                    </p>
                </div>
            `;
            return;
        }

        // Génération du HTML pour chaque produit
        productGrid.innerHTML = products.map(product => {
            const link = `https://vidygo.netlify.app/p/${product.slug || 'produit'}`;
            return `
                <div class="product-card">
                    <img src="${product.photo_url || 'images/placeholder.jpg'}" alt="${product.name}" class="product-image" loading="lazy" />
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">${product.price.toLocaleString()} Ar</div>
                        <div class="product-seller">Vendu par ${product.seller_name || 'Vendeur'}</div>
                        <a href="${link}" style="display:inline-block; margin-top:8px; color:var(--primary); font-weight:600; text-decoration:none;">
                            Voir le produit →
                        </a>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Erreur chargement produits :', err);
        productGrid.innerHTML = `
            <div class="product-card placeholder">
                <p>⚠️ Impossible de charger les produits.</p>
                <p style="font-size:0.8rem; color:var(--text-muted);">Vérifie ta connexion ou la configuration Supabase.</p>
            </div>
        `;
    }
}

// ===== MENU MOBILE =====
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Charger les produits au démarrage
    loadProducts();
});
