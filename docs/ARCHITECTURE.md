# Architecture de Sentinel API

Sentinel API repose sur une **architecture hexagonale** (Ports & Adapteurs) renforcée par le pattern **CQRS** et une approche **DDD** (Domain Driven Design).

## 1. Bounded Contexts
Le projet est divisé en contextes isolés :
* **IAM (Identity & Access Management)** : Gestion des utilisateurs et authentification (JWT).
* **Monitoring** : Logique métier de surveillance des endpoints.
* **Notification** : Gestion des alertes email via système d'événements.

## 2. CQRS & Communication
* Le contexte `Monitoring` publie des événements via `EventBus` (`EndpointStatusChangedEvent`).
* Le contexte `Notification` réagit via `EventsHandler` sans dépendre directement du monitoring.
* Cette isolation garantit que chaque contexte peut évoluer indépendamment.

## 3. Infrastructure & Monitoring
* **Stack Monitoring** : Loki, Promtail, Prometheus, Grafana, Node Exporter, cAdvisor.
* **Sécurité** : 
    * Isolation réseau (Docker Bridge).
    * Aucun port sensible exposé.
    * Accès privilégié uniquement via tunnel SSH.
* **Déploiement** : CI/CD automatisée avec GitHub Actions.
