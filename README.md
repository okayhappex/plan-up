# Modifier plan-up

## Pré-requis

Pour modifier le site, vous aurez besoin de connaissances en HTML et en Javascript.

> Il est extrêmement recommandé d'utiliser VSCode avec les extensions suivantes:
> - Vue (Official)
> - Tailwind CSS IntelliSense


## Ajouter une tâche

Pour ajouter une tâche, il vous suffit d'aller dans le fichier `public/tasks.json`, puis d'ajouter ceci dans la liste `projects`:

```jsonc
{ 
  "id": "...", // N'importe quoi tant que c'est pas utilisée
  "category": "...", // Nom du cours / module / matière
  "title": "...", // Titre du projet
  "icon": "...", // Emoji associé
  "date": "AAAA-MM-JJ", // Date de rendu du projet (ex. 2025-10-31)
  "time": "HH:MM", // [OPTIONNEL] Date de rendu du projet (ex. 20:00)
  "description": "..." // [OPTIONNEL] Description plus longue du projet
}
```

**N'oubliez pas d'ajouter une virgule après le dernier élément de la liste !**


## Modifier l'interface

Le site utilise [Tailwind](https://tailwindcss.com/docs/aspect-ratio) pour générer son CSS. Le principe est d'ajouter des classes comme `text-red-600` ou `h-24` pour nous éviter les galères du CSS natif. Vous trouverez les classes dont vous avez besoin en consultant le lien ci-dessus.

Il n'y a pas d'ordre précis pour les classes, évitez juste les doublons au maximum.