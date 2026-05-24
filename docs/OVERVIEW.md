# 🛡️ Sentinel API - Documentation Technique

## 1. Vision et Objectifs
Sentinel API est une solution de monitoring intelligente et distribuée, conçue pour assurer la haute disponibilité des services web. Contrairement à des outils basiques, Sentinel combine monitoring proactif, alertes intelligentes et diagnostic approfondi.

## 2. Architecture
Le projet suit une **Architecture Hexagonale (DDD)** :
*   **Contextes (BC)** : 
    *   `IAM` : Gestion des identités et accès (Authentification, Sécurité).
    *   `Monitoring` : Cœur métier (Health Checks, Scheduler, Historique).
    *   `Notification` : Système d'alerting découplé via CQRS et Événements.
*   **Communication** : Pattern CQRS pour le découplage asynchrone.
*   **Monitoring Stack** : Observabilité complète avec Loki (logs), Prometheus (métriques) et Grafana (visualisation).

## 3. User Stories (Backlog)

### Bounded Context: Monitoring
*   **US-MON-01** : Enregistrer un endpoint pour monitoring.
*   **US-MON-02** : Visualiser l'historique de santé d'un endpoint.
*   **US-MON-03** : Configurer la fréquence des checks.
*   **US-MON-04 (Performance)** : Alerting sur latence critique (> 500ms).

### Bounded Context: Notification
*   **US-NOT-01** : Recevoir une alerte par email lors d'un changement de statut (UP/DOWN).
*   **US-NOT-02 (Multi-canal)** : Choisir entre Email, Slack ou Webhook.
*   **US-NOT-03 (SSL)** : Alerte expiration SSL (30 jours).

### Bounded Context: Management
*   **US-MGMT-01** : Générer un rapport de disponibilité (SLA) mensuel.
*   **US-MGMT-02** : Suspendre le monitoring (Maintenance).

## 4. Évolutions Futures (Vision IA)
*   **Analyse Prédictive** : Utiliser l'IA pour prédire les pannes avant qu'elles n'arrivent en analysant les tendances de logs et de latence.
*   **Diagnostic Auto-Assisté** : Un agent IA qui analyse les logs d'erreurs (4xx/5xx) et propose une solution de correction au développeur.
*   **Optimisation des Fréquences** : Ajustement dynamique de la fréquence de monitoring basé sur la criticité et l'historique du service.

## 5. Roadmap de Développement
| Branche | Fonctionnalité | Priorité |
| :--- | :--- | :--- |
| `feat/ssl-monitoring` | Alerte expiration SSL | Haute |
| `feat/slack-integration` | Alerting Slack | Moyenne |
| `feat/sla-reporting` | Génération rapport SLA | Moyenne |
| `feat/ai-diagnostic` | Analyse IA des logs (POC) | Basse |

---
*Documentation maintenue par Sentinel API Engine.*
