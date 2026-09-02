// ============================================================
// VIDYGO - MAIN.JS (Version corrigée - sans conflit)
// Développé par Yv Laroch / GraphyNdot
// ============================================================

// On utilise une variable différente pour éviter le conflit avec la page
// La page (boutique.html, index.html) définit son propre client Supabase
// Ici, on va utiliser une fonction qui crée un client localement

// Éléments du DOM
const productGrid = document.getElementById('productGrid');

// Fonction qui charge les produits - elle attend un client Supabase en paramètre
async function loadProducts(supabaseClient) {
    if (!supabaseClient) {
        console.error('❌ Supabase client non fourni à loadProducts()');
        if (productGrid) {
            productGrid.innerHTML = `
                <div class="product-card placeholder">
                    <p>⚠️ Erreur de configuration.</p>
                    <p style="font-size:0.8rem; color:var(--text-muted);">Le client Supabase n'est pas disponible.</p>
                </div>
            `;
        }
        return;
    }

    try {
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) throw error;

        if (!products || products.length === 0) {
            if (productGrid) {
                productGrid.innerHTML = `
                    <div class="product-card placeholder">
                        <p>Aucun produit disponible pour le moment.</p>
                        <p style="font-size:0.9rem; color:var(--text-muted);">
                            <a href="admin/ajouter-produit.html" style="color:var(--primary);">Publiez le premier produit !</a>
                        </p>
                    </div>
                `;
            }
            return;
        }

        // Génération du HTML pour chaque produit
        if (productGrid) {
            productGrid.innerHTML = products.map(product => {
                const link = `https://vidygo.com/p/${product.slug || 'produit'}`;
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
        }

    } catch (err) {
        console.error('Erreur chargement produits :', err);
        if (productGrid) {
            productGrid.innerHTML = `
                <div class="product-card placeholder">
                    <p>⚠️ Impossible de charger les produits.</p>
                    <p style="font-size:0.8rem; color:var(--text-muted);">Vérifie ta connexion ou la configuration Supabase.</p>
                </div>
            `;
        }
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

    // On ne charge plus les produits ici car la page doit fournir le client
    // La page appelera loadProducts(supabase) après avoir défini son client
});
