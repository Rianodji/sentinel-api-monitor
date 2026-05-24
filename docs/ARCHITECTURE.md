# Architecture de Sentinel API

Sentinel API repose sur une **architecture hexagonale** (Ports & Adapteurs) renforcée par le pattern **CQRS** et une approche **DDD** (Domain Driven Design).

## 1. Bounded Contexts
Le projet est divisé en contextes isolés :
* **IAM (Identity & Access Management)** : Gestion des utilisateurs et authentification (JWT).
* **Monitoring** : Logique métier de surveillance des endpoints et calculs de disponibilité (SLA).
* **Notification** : Gestion des alertes via un moteur multi-canal et multi-tenant.

## 2. Système de Notification (SaaS & Strategy)
Le système de notification a été conçu pour être 100% modulaire et isolé par utilisateur :
* **Pattern Strategy** : Utilisation de l'interface `INotificationChannel`. L'ajout d'un canal (Slack, Telegram, SMS) n'impacte pas le code métier.
* **Registry de Canaux** : Les canaux actifs sont injectés dynamiquement via une liste de providers.
* **Multi-tenancy** : L'entité `NotificationSettings` permet à chaque utilisateur de définir ses propres Webhooks et d'activer/désactiver ses canaux indépendamment des autres clients.

## 3. CQRS & Communication
* Le contexte `Monitoring` publie des événements via `EventBus` (`EndpointStatusChangedEvent`, `SslCertificateExpiringEvent`).
* Le contexte `Notification` réagit via `EventsHandler` sans dépendre directement du monitoring.
* Cette isolation garantit que chaque contexte peut évoluer indépendamment.

## 4. Infrastructure & Monitoring
* **Stack Monitoring** : Loki, Promtail, Prometheus, Grafana, Node Exporter, cAdvisor.
* **Sécurité** : 
    * Isolation réseau (Docker Bridge).
    * Aucun port sensible exposé (DB, Redis, PMA).
    * Accès privilégié uniquement via tunnel SSH.
* **Déploiement** : CI/CD automatisée avec GitHub Actions.
