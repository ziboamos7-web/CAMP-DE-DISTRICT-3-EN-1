# Camp de District 3 en 1

Application web mobile du **Camp de District 3 en 1** (Garango 2026), développer par l'entreprise SIAMS avec le chef de projet PDG ZIBO DETOH AMOS, à destination des campeurs, des chefs et des supporters. Elle regroupe en un seul endroit l'inscription, le programme, l'actualité du camp et la compétition **CUFLB** (Coupe d'Unité Flambeaux-Lumières de Bouaflé).

L'application est un **fichier unique** (`index.html`) : HTML, CSS et JavaScript, sans étape de build. Les données sont stockées dans **Supabase** (projet « SITE DU CAMP »).

- Site en ligne : https://camp-de-district-3-en-1-2026.vercel.app/
- Tableau de bord des organisateurs : voir [`README-admin.md`](README-admin.md)

## Fonctionnalités

### Accueil et programme
- **À la UNE** : mise en avant de la CUFLB et des annonces importantes.
- **Calendriers** : séminaire, camp et petits, présentés en animation tournante (une attente de 2 h avant de relancer un autre calendrier).
- **Programme d'évangélisation** : du 28 octobre au 1er novembre 2026, à Garango.
- **Cloche** de notifications.

### Inscription et profil
- **Parcours d'inscription en 4 étapes**, avec émission d'un **ticket**.
- Comptes avec confirmation par e-mail (message personnalisé aux couleurs du camp).
- **Mon profil** : photo de couverture, onglets, bouton **Scan My** et bouton **Se déconnecter** (avec confirmation).
- **Scan My ticket** : présentation du ticket à scanner aux points de contrôle.

### Vie du camp
- **Fil d'actualité** : publications, mentions « j'aime » et commentaires.
- **Nos intervenants** : orateurs du séminaire des chefs, par module, avec leur photo et leur thème.
- **Partenaires** et sponsors.
- **Nos troupes** : les troupes du district et leurs chefs de troupe, avec les **cartes de commissaires** (logo du district en filigrane).

### CUFLB
- **Équipes et poules**, **calendrier** et **résultats**.
- **Classement** et **direct** (score, minute, buteurs en temps réel).
- **Page équipe** : en-tête (logo, nom, stade), onglets Résultats, Calendrier, Classements, Actualités et Effectif.
- **Fiches de match** à partager (formats carré 1:1 et portrait 4:5), pour un match ou pour toute la journée.
- **Licence joueur** : carte de licence, avec les informations du joueur au clic sur sa photo dans l'effectif.
  - Code d'activation à 4 chiffres remis par la fédération avant l'inscription.
  - Une fois inscrit, le joueur voit directement sa licence et sa carte.
  - **Créer licence** : création de la licence d'un joueur sans téléphone, avec un **Historique** des licences créées et leur téléchargement.

> Le paiement des tickets et de la carte n'est pas encore traité dans l'application.

## Données

Supabase gère l'authentification, la base de données et le stockage des fichiers (bucket public `assets` pour les logos et les images).

Tables principales : `profiles`, `registrations`, `payments`, `scans`, `matchs`, `cuflb_poules`, `public_players`, `proxy_registrations`, `fil_likes`, `fil_comments`, `publications`, `troupes`, `districts`.

## Lancer l'application

1. Héberger `index.html` sur un hébergement statique (le site actuel est sur Vercel), ou l'essayer en local :
   ```bash
   python3 -m http.server 8080
   ```
2. Ouvrir `http://localhost:8080`.

Dans Supabase, sous **Authentication → URL Configuration**, renseigner l'adresse du site comme *Site URL*. Sans cela, le lien de confirmation par e-mail redirige vers `localhost:3000`.

> La caméra et le scan exigent un contexte sécurisé : **HTTPS** ou `localhost`.

## Notes pour les développeurs

- La clé Supabase intégrée au fichier est une clé publique (`anon`). La protection des données repose sur les règles **RLS** : à vérifier avant toute mise en production.
- Les mêmes URL et clé Supabase sont utilisées par le tableau de bord admin, qui lit les mêmes tables.
- Les versions successives du fichier portent un numéro (ex. `Camp_District_3_en_1_V230.html`) ; la version en ligne est livrée sous le nom `index.html`.

- ## Développer contact

- WhatsApp assistant : 0506172317
- E-mail : serviceclientsiams.ci@gmail.com

- Toujours a vos côtés.
