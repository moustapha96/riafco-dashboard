# Documentation des Paramètres Serveur - RIAFCO

## 📋 Table des matières
1. [Accès VPN](#accès-vpn)
2. [Accès Serveur](#accès-serveur)
3. [Accès Base de Données](#accès-base-de-données)
4. [Gestion des Services](#gestion-des-services)
5. [Comptes Utilisateurs](#comptes-utilisateurs)

---

## 🔐 Accès VPN

### Informations de connexion
- **URL VPN** : `vpn.senumsa.sn`
- **Nom d'utilisateur** : `abraham.riafco_adm`
- **Mot de passe** : `P@ssw0rd1K5`

### Utilisation
1. Se connecter au VPN via l'URL fournie
2. Utiliser les identifiants ci-dessus pour l'authentification
3. Une fois connecté, vous aurez accès au réseau interne du serveur

---

## 🖥️ Accès Serveur

### Informations de connexion SSH
- **Adresse IP** : `10.121.222.65`
- **Port SSH** : `3333`
- **Utilisateur** : `adminadie` ou `root`
- **Mot de passe** : `ToChangeRC2025@`

### Commandes de connexion
```bash
# Connexion SSH avec l'utilisateur adminadie
ssh -p 3333 adminadie@10.121.222.65

# Connexion SSH avec l'utilisateur root
ssh -p 3333 root@10.121.222.65

# Pour passer en root depuis adminadie (après connexion)
su -
```

### ⚠️ Note importante
Le mot de passe root doit être changé pour des raisons de sécurité : `ToChangeRC2025@`

---

## 🗄️ Accès Base de Données PostgreSQL

### Informations de connexion
- **Nom de la base de données** : `riafco`
- **Utilisateur** : `riafco`
- **Mot de passe** : `Riafco@2025`
- **Hôte** : `localhost` (depuis le serveur)

### Commandes utiles

#### Connexion à la base de données
```bash
# Connexion directe à la base riafco
psql -h localhost -U riafco -d riafco

# Vous serez invité à saisir le mot de passe : Riafco@2025
```

#### Création du rôle utilisateur (si nécessaire)
```bash
# Créer le rôle riafco avec les permissions appropriées
psql -c "CREATE ROLE riafco WITH LOGIN CREATEDB PASSWORD 'Riafco@2025';"
```

### Comptes PostgreSQL
- **Utilisateur postgres** : 
  - Mot de passe : `Riafco@2025`
- **Utilisateur riafco** : 
  - Mot de passe : `Riafco@2025`

---

## 👥 Comptes Utilisateurs

### Compte Kheweul
- **Nom d'utilisateur** : `kheweul`
- **Email** : `mareme.ndiaye@adm.gouv.sn`
- **Mot de passe** : `Ri@fco2025`

---

## ⚙️ Gestion des Services

### PM2 - Process Manager

PM2 est utilisé pour gérer les processus Node.js de l'application backend.

#### Commandes principales

```bash
# Vérifier l'état de tous les processus PM2
pm2 status

# Voir les logs du backend (100 dernières lignes)
pm2 logs back-riafco --lines 100

# Voir les logs en temps réel
pm2 logs back-riafco

# Redémarrer le service backend
pm2 restart back-riafco

# Arrêter le service backend
pm2 stop back-riafco

# Démarrer le service backend
pm2 start back-riafco

# Voir les informations détaillées d'un processus
pm2 show back-riafco
```

---

## 🔒 Sécurité et Bonnes Pratiques

### ⚠️ Recommandations importantes

1. **Changement de mots de passe** :
   - Le mot de passe root doit être changé régulièrement
   - Utiliser des mots de passe forts et uniques

2. **Accès SSH** :
   - Préférer l'utilisation de clés SSH plutôt que des mots de passe
   - Limiter l'accès SSH par IP si possible

3. **Base de données** :
   - Ne jamais exposer les identifiants de base de données dans le code
   - Utiliser des variables d'environnement pour les credentials

4. **VPN** :
   - Se déconnecter du VPN après utilisation
   - Ne partager les identifiants qu'avec les personnes autorisées

5. **Logs** :
   - Surveiller régulièrement les logs pour détecter des activités suspectes
   - Conserver les logs importants pour audit

---

## 📝 Notes Techniques

### Architecture du système
- **Serveur** : Linux (distribution non spécifiée)
- **Base de données** : PostgreSQL
- **Process Manager** : PM2
- **Application** : Node.js (backend)

### Ports utilisés
- **SSH** : `3333`
- **PostgreSQL** : `5432` (par défaut)
- **Application Backend** : (à vérifier selon la configuration)

---

## 🆘 Support et Dépannage

### En cas de problème de connexion

1. **VPN** :
   - Vérifier que le VPN est accessible
   - Vérifier les identifiants
   - Contacter l'administrateur réseau si nécessaire

2. **SSH** :
   - Vérifier que le port 3333 est ouvert
   - Vérifier que le service SSH est actif sur le serveur
   - Tester la connexion avec : `ssh -v -p 3333 adminadie@10.121.222.65`

3. **Base de données** :
   - Vérifier que PostgreSQL est en cours d'exécution : `systemctl status postgresql`
   - Vérifier les permissions de l'utilisateur riafco
   - Tester la connexion avec psql

4. **PM2** :
   - Si le service ne démarre pas, vérifier les logs : `pm2 logs back-riafco --err`
   - Vérifier la configuration PM2 : `pm2 show back-riafco`
   - Redémarrer PM2 si nécessaire : `pm2 kill && pm2 resurrect`

---

## 📅 Historique des modifications

- **Date de création** : 2025-01-XX
- **Dernière mise à jour** : 2025-01-XX

---

## ⚠️ AVERTISSEMENT

**Ce document contient des informations sensibles.**
- Ne pas partager ce document publiquement
- Ne pas commiter ce fichier dans un dépôt Git public
- Utiliser un gestionnaire de mots de passe sécurisé
- Changer régulièrement les mots de passe
- Limiter l'accès à ce document aux personnes autorisées uniquement

---

*Le projet RIAFCO - Administration*
