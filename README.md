# Aurehal 3D Network

![forthebadge](/assets/forthebadge.svg)

Application de visualisation en graphe 3D de l'ensemble des structures du référentiel Aurehal.

![aurehal-global-network](/assets/screenshot.png)

Le moissonnage exhaustif de toutes les structures via des requêtes sur l'API Hal est effectué en amont de la visualisation, la méthodologie utilisée étant décrite dans le [notebook](https://github.com/azur-scd/Aurehal3DNetwork/blob/main/static/data/harvest_methodo.ipynb) qui accompagne ce repo.

Toutes les données ainsi récupérées sont stockées dans le dossier static/data avec le notebook, le fichier final nodes.csv servant de source pour les noeuds du graphe est dans static/data/nodes/ et celui pour les liens edges.csv dans static/data/edges/

## Démo

Une instance de démo est déployée ici : [http://azur-scd.com/apps/aurehal-3d-network](http://azur-scd.com/apps/aurehal-3d-network)

Le filtre de type range appliqué au nombre de publications concerne les publications affiliées "strictement" à chaque structure et non le nombre de publications cumulées de toutes les structures enfants (mais cette donnée a aussi été recueillie dans le fichier nodes.csv)

Selon le nombre de noeuds et de liens à afficher, le graphe peut parfois mettre quelques secondes à se former.

## Dev

### Installation avec Docker

1. Avec l'image pré-buildée

Une image de ce repo est disponible sur le registre public Docker ici : [https://hub.docker.com/repository/docker/azurscd/aurehal-3d-network](https://hub.docker.com/repository/docker/azurscd/aurehal-3d-network)

Pour l'installer et lancer le container : 

```
docker run --name YOUR_CONTAINER_NAME -d -p 5000:5000 azurscd/aurehal-3d-network:latest

```

2. Builder votre propre image

Vous pouvez également builder votre propre image avec le Dockerfile à la racine du repo.

```
docker build -t YOUR_IMAGE_NAME:TAG .
docker run --name YOUR_CONTAINER_NAME -d -p 5000:5000 YOUR_IMAGE_NAME:TAG
```
Lancer http://localhost:5000

## Installation en local

```
git clone https://github.com/azur-scd/Aurehal3DNetwork.git
```

### Créer un environnement virtuel et installer les dépendances dans ce virtualenv

```
python -m venv YOUR_VENV

# Windows
cd YOUR_VENV/Scripts & activate
# Linux
source VENV_NAME/bin/activate

pip install -r requirements.txt
```
### Lancer l'app

```
python app.py
```

Ouvrir http://VOTRE_IP:5000