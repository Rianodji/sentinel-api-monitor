# 🛡️ Sentinel API

Sentinel API est une solution de monitoring intelligente conçue pour surveiller la santé de vos services web. Configurez vos endpoints, planifiez vos vérifications et restez serein : Sentinel vous alerte par email au moindre signe de faiblesse.

## 🚀 Fonctionnalités

* **Monitoring Multi-Endpoints** : Gérez et surveillez plusieurs APIs depuis une interface unique.
* **Planification Flexible** : Définissez vos propres cycles de vérification (Health Checks).
* **Alertes Instantanées** : Notification par email automatique en cas d'échec de statut ou de temps de réponse anormal.
* **Architecture Robuste** : Propulsé par NestJS, Redis (pour les tâches planifiées) et PostgreSQL.
* **Déploiement Continu** : Pipeline CI/CD automatisée avec GitHub Actions et Docker.

## 🛠️ Stack Technique

* **Backend** : NestJS (Node.js framework)
* **Base de données** : PostgreSQL
* **Cache & Queue** : Redis (BullMQ pour la planification)
* **Infrastructure** : Docker / Docker Compose
* **Proxy & Sécurité** : Apache / Nginx + SSL (Let's Encrypt)

## 📦 Installation (Développement)

### 1. Cloner le projet
```bash
git clone [https://github.com/Rianodji/sentinel-api-monitor.git](https://github.com/Rianodji/sentinel-api-monitor.git)
cd sentinel-api-monitor
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
# Modifiez le fichier .env avec vos accès DB et Mailer etc...
```

### 3. Lancer avec Docker
```bash
docker compose up -d
```

## 🚢 Déploiement

Le projet est configuré pour un déploiement automatique sur **Oracle Cloud VPS** via GitHub Actions. À chaque push sur la branche `main` :

* **Tests** : Les tests unitaires sont exécutés.
* **Build** : Une nouvelle image Docker est buildée et poussée sur Docker Hub.
* **Update** : Le VPS télécharge la nouvelle image et redémarre les services sans interruption.

## 📫 Contact & Support

Si vous trouvez un bug ou avez une suggestion, n'hésitez pas à ouvrir une **Issue** ou une **Pull Request**.

---
*Développé avec passion pour des services web toujours en ligne.*

## 👤 Auteur

**Dicard RIANODJI**

* **GitHub** : [@RIANODJI](https://github.com/RIANODJI)
* **LinkedIn** : [Dicard RIANODJI](https://www.linkedin.com/in/dicard-rianodji-755196243/)

> "Bâtir des outils robustes pour rendre le web plus fiable."

## ⚖️ Licence

Ce projet est sous licence [MIT](LICENSE).