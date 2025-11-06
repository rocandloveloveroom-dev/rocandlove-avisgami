# 🚀 ROC & LOVE - SYSTÈME DE GAMIFICATION V4.1

**URL finale : https://rocandlove-avisgami.vercel.app**

---

# ✅ CE QUE VOUS DEVEZ FAIRE MAINTENANT

## ÉTAPE 1 : Pusher sur GitHub (2 min)

### Dans votre terminal :

```bash
cd votre-dossier-projet

# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "V4.1 - Système gamification complet"

# Connecter à votre repo GitHub
git remote add origin https://github.com/VOTRE-USERNAME/rocandlove-avisgami.git

# Pusher
git push -u origin main
```

**✅ Fichiers sur GitHub !**

---

## ÉTAPE 2 : Connecter Vercel (2 min)

### 1. Aller sur Vercel

https://vercel.com/dashboard

### 2. Nouveau projet

- Cliquez "Add New..." → "Project"
- "Import Git Repository"
- Sélectionnez votre repo `rocandlove-avisgami`

### 3. Configuration

**Framework Preset :** Other  
**Root Directory :** `./` (laisser par défaut)  
**Build Command :** (laisser vide)  
**Output Directory :** (laisser vide)

### 4. Variables d'environnement

Cliquez "Environment Variables" et ajoutez :

```
DATABASE_URL = postgresql://neondb_owner:npg_gYTtPd25HNvM@ep-tiny-flower-a25248wo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 5. Deploy !

Cliquez **"Deploy"**

⏱️ Attendez 1 minute...

**✅ SITE EN LIGNE !**

---

## ÉTAPE 3 : Vérifier que ça marche (1 min)

### Testez ces URLs :

```
✅ https://rocandlove-avisgami.vercel.app
   → Doit rediriger vers la page client

✅ https://rocandlove-avisgami.vercel.app/gamiavisrocandlove.html
   → Page client avec logo

✅ https://rocandlove-avisgami.vercel.app/gamiavisadmin.html
   → Admin dashboard
   Mot de passe : RocLove2025
```

**Si toutes les pages s'affichent → C'EST BON ! 🎉**

---

## ÉTAPE 4 : Configurer l'admin (2 min)

### Ouvrez l'admin :

https://rocandlove-avisgami.vercel.app/gamiavisadmin.html

**Mot de passe :** `RocLove2025`

### Onglet "⚙️ Config" :

Remplissez :
- 🏨 Lien Booking
- 🏠 Lien Airbnb  
- ⭐ Lien Google Reviews

L'URL du site est **déjà remplie** : `https://rocandlove-avisgami.vercel.app`

**Sauvegardez !**

---

## ÉTAPE 5 : Tester le générateur (1 min)

### Onglet "🪄 Générateur" :

1. Prénom : **Test**
2. Téléphone : **0612345678**
3. Canal : **Direct**
4. Cliquez **"Générer"**

**Vous devez voir :**
- ✅ Le lien complet
- ✅ Le QR Code

**Copiez le lien et ouvrez-le dans un nouvel onglet !**

Vous devez voir :
- ✅ "Merci pour votre séjour Test"
- ✅ Bouton "⭐ Partager sur Google"

**ÇA MARCHE ! 🎊**

---

## ÉTAPE 6 : Ajouter vos assets (optionnel mais recommandé)

### Créez 4 fichiers :

1. **logo.svg** - Votre logo
2. **favicon.png** - Icône (32x32px)
3. **og-image.jpg** - Image SMS (1200x630px)
4. **BrittanySignature.ttf** - Police

### Placez-les dans le dossier `assets/`

### Pushez :

```bash
git add assets/
git commit -m "Ajout des assets"
git push
```

**Vercel redéploie automatiquement !**

Rechargez la page → Votre logo s'affiche ! ✨

---

# 📂 STRUCTURE DU PROJET

```
rocandlove-avisgami/
├── index.html (redirection)
├── gamiavisrocandlove.html (page client)
├── gamiavisadmin.html (dashboard admin)
├── vercel.json (config Vercel)
├── package.json (dépendances)
├── assets/ (vos fichiers)
│   ├── logo.svg
│   ├── favicon.png
│   ├── og-image.jpg
│   └── BrittanySignature.ttf
└── api/ (serverless functions)
    ├── save-participation.js
    └── get-participations.js
```

---

# 🎯 UTILISATION QUOTIDIENNE

## Créer un lien personnalisé

1. **Admin** → Onglet "🪄 Générateur"
2. Remplissez : Prénom, Tél, Canal
3. Cliquez "Générer"
4. **Copiez le lien**
5. **Envoyez par SMS au client !**

## Message SMS type :

```
Bonjour Marie !

Merci pour votre séjour au Roc & Love 💝

Votre surprise vous attend :
👉 https://rocandlove-avisgami.vercel.app/?n=Marie&t=0612345678&s=booking

À très bientôt !
```

---

# 📊 VOIR LES STATISTIQUES

**Admin → Onglet "📊 Stats"**

Vous verrez :
- Total participations
- Avis cliqués
- Taux de conversion
- Stats par canal (Booking/Airbnb/Direct)
- Codes les plus gagnés

**Auto-refresh toutes les 5 secondes !**

---

# 🗂️ HISTORIQUE

**Admin → Onglet "📋 Historique"**

Table avec :
- Date
- Nom client
- Téléphone
- Canal (Booking/Airbnb/Direct)
- Lot gagné
- Code promo
- Avis cliqué (✅/❌)
- Notes (ajoutez vos remarques)

**Export CSV** : Bouton en haut à droite

---

# 🎁 GÉRER LES LOTS

**Admin → Onglet "🎁 Lots"**

### Lots par défaut :

- 🎫 10% de réduction (15%)
- 🎟️ 15% de réduction (5%)
- 🍾 Bouteille Vouvray (50%)
- 💝 Love Box (30%)

**Total = 100%** (obligatoire)

### Ajouter/Modifier :

- Cliquez "➕ Ajouter un lot"
- Remplissez : Emoji, Titre, Description, Code, Probabilité
- Sauvegardez

**Les probabilités doivent totaliser 100% !**

---

# 🔒 SÉCURITÉ

### Changer le mot de passe admin :

1. Admin → Bouton "🔒 Mot de passe"
2. Nouveau mot de passe
3. Confirmer
4. Sauvegarder

**NOTEZ-LE QUELQUE PART !**

---

# ⚠️ SI ÇA NE MARCHE PAS

## Erreur 404 ?

**Cause :** Fichiers pas au bon endroit

**Solution :**
- Vérifiez que les fichiers HTML sont à la RACINE
- Pas dans un dossier `/public/`
- Redéployez

## Logo ne s'affiche pas ?

**Cause :** Fichier logo.svg absent

**Solution :**
- Créez logo.svg
- Placez dans `/assets/`
- Push sur GitHub

## QR Code ne se génère pas ?

**Cause :** Librairie pas chargée

**Solution :**
- Vérifiez votre connexion internet
- Réactualisez la page (F5)
- La librairie charge depuis CDN

## "Cannot connect to database" ?

**Cause :** Variable DATABASE_URL manquante

**Solution :**
1. Vercel Dashboard → Votre projet
2. Settings → Environment Variables
3. Ajoutez DATABASE_URL
4. Redéployez

---

# 🎉 C'EST PRÊT !

Votre système est **100% opérationnel** !

**Ce que vous avez maintenant :**

✅ Site public : https://rocandlove-avisgami.vercel.app  
✅ Admin : https://rocandlove-avisgami.vercel.app/gamiavisadmin.html  
✅ Générateur de liens + QR Codes  
✅ Système multi-canal (Booking/Airbnb/Google)  
✅ Stats temps réel  
✅ Export CSV  
✅ HTTPS automatique  
✅ CDN mondial  

---

# 📞 SUPPORT

**Questions ?** Relisez ce README !

**Modifications futures ?**
1. Modifiez les fichiers en local
2. `git add .`
3. `git commit -m "Description"`
4. `git push`
5. Vercel redéploie automatiquement !

---

**BRAVO ! VOUS ÊTES EN LIGNE ! 🚀**

*README V4.1 - Roc & Love Gamification*
