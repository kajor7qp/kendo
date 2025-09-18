---
title: 🚀 KendoReact Minesweeper Challenge - Modern Gaming Dashboard
published: true
description: A modern Minesweeper game built with 11+ KendoReact components featuring analytics, player profiles, and smooth animations
tags: devchallenge, kendoreactchallenge, webdev, react
cover_image: # Optional: Screenshot deiner App
---

# 🚀 KendoReact Minesweeper Challenge

I built a modern Minesweeper game using 11+ KendoReact free components for the DEV Challenge!

## 🎮 What I Built

A complete gaming dashboard featuring:
- Classic Minesweeper gameplay with 3 difficulty levels
- Real-time analytics and statistics
- Player profile management
- Modern glassmorphism UI design

## 🔗 Links

- **🌐 Live Demo**: [Your-App-URL]
- **💻 Source Code**: [Your-GitLab-URL]

## ✨ Features

### Core Gameplay
- Classic Minesweeper mechanics (left-click reveal, right-click flag)
- Three difficulty levels: Easy (9x9), Medium (16x16), Hard (16x30)
- Real-time timer and mine counter
- Smart first-click protection

### Modern Dashboard
- **Analytics Tab**: Win/Loss charts and difficulty statistics
- **Player Profile**: Name input and game date tracking
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Hover effects and transitions

## 🛠️ KendoReact Components Used (11+)

1. **Button** - Level selection and game actions
2. **DropDownList** - Difficulty level selection
3. **Grid** - Game statistics table
4. **Chart** - Analytics visualization (2 different charts)
5. **Card** - Structured layout sections
6. **TabStrip** - Navigation between game/stats/profile
7. **Notification** - Game over/win alerts
8. **Input** - Player name input
9. **Calendar** - Date selection in profile
10. **Loader** - Loading animations
11. **NotificationGroup** - Notification management

## 🎨 Technical Highlights

- **Modern UI**: Glassmorphism design with gradient backgrounds
- **State Management**: Complex game state with React hooks
- **Game Logic**: Complete Minesweeper algorithm implementation
- **Statistics**: Real-time game tracking and analytics
- **Responsive**: Mobile-friendly responsive design

## 🚀 Getting Started
``` bash
git clone [your-gitlab-url]
cd [your-project-name]
npm install
npm run dev
``` 

# React + Vite

## Projekt aufsetzen

```
npm create vite@latest kendo-vite-app -- --template react 
```
``` 
cd kendo-vite-app
```
``` 
npm install
```

```Kendoo Installieren
npm install @progress/kendo-react-grid @progress/kendo-react-dateinputs @progress/kendo-react-charts @progress/kendo-react-buttons @progress/kendo-react-inputs @progress/kendo-react-dropdowns @progress/kendo-react-notification @progress/kendo-react-layout @progress/kendo-react-indicators @progress/kendo-theme-default
```

``` Start
npm run dev
```

----
## Git Projekt

### Im Gitbash
```
cd Pfad\zu\deinem\Verzeichnis
```
```
git init
```
```
git add .
```
```
git commit -m "Initialer Commit"
```
```
git remote add origin https://gitlab.com/benutzername/projektname.git
```
```
git push --set-upstream origin master
```
[readme.md](../../git/readme.md)

---- 

## Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
