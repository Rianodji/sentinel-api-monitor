# 🛡️ Sentinel API

Sentinel API est une solution de monitoring intelligente pour services web, basée sur une architecture hexagonale robuste et sécurisée.

## 🚀 Fonctionnalités
* **Monitoring** : Multi-endpoints avec planification flexible.
* **Alertes** : Notifications email automatiques (via SMTP/Mailtrap).
* **Architecture** : Hexagonale, DDD, CQRS.
* **Monitoring Stack** : Loki (Logs), Prometheus (Métrique), Grafana (Dashboards).
* **Sécurité** : Services sensibles isolés, accès via tunnel SSH.

## 🛠️ Architecture & Stack
* **Backend** : NestJS, TypeORM, BullMQ, CQRS.
* **Infrastructure** : Docker, PostgreSQL, Redis.
* **Monitoring** : Loki, Promtail, Grafana, Node Exporter, cAdvisor.

## 📦 Installation (Local)

1. **Cloner** : `git clone ...`
2. **Configurer** : `cp .env.example .env` (ajoutez vos accès SMTP/Grafana).
3. **Lancer** : `docker compose up -d`
4. **Monitoring** : Accédez à Grafana sur `http://localhost:3001` (login/pass dans `.env`).

## 🔐 Sécurité & Accès
Les services sensibles (`db`, `redis`, `phpmyadmin`) ne sont **pas exposés**. Pour y accéder :
* **PostgreSQL (5433)** : `ssh -L 5433:localhost:5432 user@vps_ip`
* **phpMyAdmin** : `ssh -L 8080:sentinel_phpmyadmin:80 user@vps_ip`

## 🚢 Déploiement
Déploiement automatique via GitHub Actions sur VPS Oracle Cloud.
Pour activer le monitoring sur le VPS :
```bash
cd ~/sentinel/infrastructure/monitoring
./start-monitoring.sh
```

---
*Développé par Dicard RIANODJI.*
