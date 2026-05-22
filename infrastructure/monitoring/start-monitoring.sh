#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Démarrage de la stack de monitoring Sentinel...${NC}"

# Aller dans le dossier du projet (ajuster si le chemin diffère sur le VPS)
cd ~/sentinel/infrastructure/monitoring

# Vérifier si le fichier d'environnement existe
if [ ! -f "../../.env.docker" ]; then
    echo -e "\033[0;31m❌ Erreur: Le fichier ../../.env.docker est introuvable.${NC}"
    echo "Assurez-vous que le déploiement via GitHub Actions a bien été effectué."
    exit 1
fi

# Lancer Docker Compose avec le fichier d'environnement de la racine
docker compose --env-file ../../.env.docker -f docker-compose.monitor.yaml up -d

echo -e "${GREEN}✅ Stack de monitoring lancée avec succès !${NC}"
echo -e "${BLUE}📊 Grafana : http://vps_ip:3001${NC}"
echo -e "${BLUE}🛠️  Accès phpMyAdmin (via tunnel) : ssh -L 8080:sentinel_phpmyadmin:80 user@vps_ip${NC}"
