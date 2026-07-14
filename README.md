# Piggy App — Landing Page

Repositorio de la página de inicio (Landing Page) oficial de **Piggy App**, una plataforma Agro-Fintech de engorde porcino digital.

Este sitio web está diseñado con un enfoque estético premium, moderno, optimizado para conversión (landing de desplazamiento vertical con scroll suave) y adaptabilidad completa a dispositivos móviles (responsive web design).

## Stack Tecnológico

- **Vite** para desarrollo y empaquetado optimizado en producción.
- **HTML5 Semántico** enfocado en estructura y SEO.
- **Vanilla CSS** con variables semánticas (design tokens) y animaciones nativas.
- **Javascript Moderno** (ES Modules) e **Intersection Observer** para interacción y transiciones fluidas.

## Estructura del Proyecto

```text
├── public/
│   └── assets/
│       ├── logo.png          # Logotipo oficial
│       └── hero-phone.png    # Teléfono mockup con el cerdito en 3D
├── index.html                # Estructura y optimización SEO
├── style.css                 # Diseño, variables y media-queries responsive
├── main.js                  # Lógica interactiva y animaciones al scroll
├── package.json              # Configuración y dependencias (Vite)
└── vite.config.js            # Configuración de compilación de Vite
```

## Desarrollo Local

Para correr el proyecto localmente y verificar los cambios:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Levantar el servidor de desarrollo
```bash
npm run dev
```
El servidor se abrirá en `http://localhost:3000`.

### 3. Compilar para producción
```bash
npm run build
```
Los archivos optimizados y empaquetados se generarán en la carpeta `dist`.

## Despliegue

Cualquier cambio empujado a la rama `main` de este repositorio en GitHub (`amsterdamlab/piggy-landing`) se despliega automáticamente en producción a través de **Vercel**.
