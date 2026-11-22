# StudyQuest — Frontend demo v0.1

Prototipo frontend de StudyQuest construido con HTML, CSS y JavaScript puro, siguiendo la referencia visual compartida en la conversación.

## Cómo ejecutarlo

1. Descarga y descomprime la carpeta `StudyQuest-frontend`.
2. Abre `index.html` en un navegador moderno (Chrome, Firefox o Edge).
3. No requiere instalación de dependencias ni servidor para esta versión.

También puedes abrir la carpeta con Visual Studio Code y utilizar la extensión Live Server para recarga automática.

## Qué incluye

- Dashboard con banner, perfil, XP, misiones, materias, racha, logros, mapa e inventario.
- Navegación entre Inicio, Misiones, Materias, Mi personaje, Logros, Mapa, Inventario y Ajustes.
- Crear misiones mediante formulario.
- Completar misiones y recibir XP/monedas de demostración.
- Progresión de nivel y avance de materias de demostración.
- Filtros para misiones e inventario.
- Cambio de nombre y preferencias visuales del personaje.
- Persistencia local mediante `localStorage`.
- Diseño adaptable para escritorio y móvil.

## Estructura

```text
StudyQuest-frontend/
├── index.html
├── styles.css
├── app.js
├── README.md
└── assets/
    ├── hero-witch.png
    ├── avatar-witch.png
    └── world-map.png
```

## Importante

Esta es una demostración frontend. No incluye autenticación real, API, servidor, sincronización entre usuarios ni base de datos MySQL. Los datos son ficticios y se guardan únicamente en el navegador mediante `localStorage`. La conexión con Spring Boot y MySQL se realizará en una etapa posterior.
