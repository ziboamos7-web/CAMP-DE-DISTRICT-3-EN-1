# API Mon CAMP (Vercel)

## Installation (3 étapes)
1. Copie le dossier `api/` et `package.json` à la racine de ton dépôt GitHub, à côté de `index.html`.
   Garde ton `vercel.json` actuel (il sert `assetlinks.json`) : ne l'écrase pas.
2. Dans Vercel > ton projet > Settings > Environment Variables, ajoute (Production) :
   - `SUPABASE_URL` : https://pzxpjavylrsmptwjeupi.supabase.co
   - `SUPABASE_SERVICE_KEY` : la clé **service_role** (Supabase > Project Settings > API). Secrète : jamais dans index.html ni sur GitHub.
   - `API_SECRET` : une longue phrase aléatoire (32+ caractères) de ton choix.
3. Redéploie, puis teste : `https://camp-district-3-en-1-2026.vercel.app/api/health`

## Routes
| Route | Rôle |
|---|---|
| GET /api/health | Vérifie que l'API répond |
| POST /api/agent/login `{code}` | Vérifie le code agent, renvoie un jeton valable 8 h (8 essais / 5 min / IP) |
| POST /api/scan `{ticket,phone,sig,manual}` + `Authorization: Bearer <jeton>` | Valide un ticket (fonction SQL submit_scan) |
| GET /api/stats + jeton | Statistiques du camp (fonction SQL camp_stats) |

L'application utilise l'API automatiquement. Si l'API est absente ou injoignable, elle retombe sur l'accès direct Supabase actuel.

## Test rapide
```
curl -X POST https://camp-district-3-en-1-2026.vercel.app/api/agent/login -H "Content-Type: application/json" -d '{"code":"TON_CODE_AGENT"}'
```

## Suite possible
Routes admin (débloquer une inscription en attente, publier au fil d'actualité, fiches de match) : elles demanderont une vérification via la table `admins`.
