# Audit de Sécurité : Sentinel API Infrastructure

## 1. Pipelines CI/CD (GitHub Actions)

### Points Positifs
- Utilisation de secrets GitHub pour les credentials sensibles.
- Séparation des étapes de build et de déploiement.
- Nettoyage des images Docker (`prune`) après déploiement.

### Recommandations
- **Moindre Privilège** : S'assurer que la clé SSH utilisée pour le déploiement a des permissions restreintes sur le VPS.
- **Scan de Vulnérabilités** : Ajouter une étape `docker scout` ou `trivy` pour scanner l'image API avant de la pusher.
- **Épinglage des Versions** : Utiliser des versions spécifiques pour les actions GitHub (ex: `uses: actions/checkout@v3.5.2`) au lieu de `@v3`.

## 2. Docker Compose (Production & Monitoring)

### Points Positifs
- **Réseau Isolé** : Utilisation d'un réseau `bridge` externe pour limiter la visibilité des services.
- **Services Sensibles Cachés** : `db`, `redis`, `loki`, `prometheus`, et `phpmyadmin` n'exposent aucun port sur l'hôte.
- **Accès par Tunnel SSH** : Seul le trafic légitime via SSH peut atteindre les bases de données et outils d'administration.
- **Sécurisation de Grafana** : Désactivation de l'auto-inscription et utilisation de variables d'environnement pour l'admin.

### Recommandations
- **Limitation de Ressources** : Sur Oracle Free Tier, ajouter des `deploy.resources.limits` pour éviter qu'un container n'étouffe le système.
- **Utilisateur Non-Root** : Configurer l'image Docker de l'API pour s'exécuter avec un utilisateur non-privilégié.
- **Read-Only Root Filesystem** : Pour les containers comme Redis ou Prometheus, monter le FS en lecture seule là où c'est possible.

## 3. Monitoring & Administration

### Points Positifs
- **Logs Centralisés** : Loki et Promtail permettent d'analyser les incidents sans accès direct aux fichiers du VPS.
- **Métriques Systèmes** : Node Exporter et cAdvisor donnent une visibilité sur la consommation de l'instance Oracle.
- **phpMyAdmin Sécurisé** : L'outil est présent mais invisible pour toute personne n'ayant pas la clé SSH du VPS.

### Résumé de la Stratégie d'Accès
- **API (3000)** : Public
- **Grafana (3001)** : Public (Protégé par Login/Pass)
- **Autres (DB, Redis, PMA, Loki, Prom)** : Privé (Tunnel SSH Requis)
