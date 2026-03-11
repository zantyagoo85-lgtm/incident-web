# 🌐 Frontend de Gestión de Incidentes

Frontend desarrollado con **Angular 21** para la visualización y gestión de incidentes. Enfocado en una arquitectura modular, mantenible y altamente testeable.

---

## 🛠️ Cómo Ejecutar el Proyecto

### Requisitos previos
- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [Angular CLI](https://angular.dev/tools/cli)

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configuración de Variables de Entorno
Copia el archivo de ejemplo y ajusta los valores:
```bash
cp src/environments/environment.ts.example src/environments/environment.ts
```

Variables necesarias:
- `apiBaseUrl`: La dirección de tu API Backend (ej: https://localhost:2021/api).
- `dockerApiBaseUrl`: URL del API cuando se ejecuta en Docker (ej: http://incident-api:8080/api).
- `isDocker`: Bandera para indicar si la aplicación se ejecuta en contenedor Docker.

### 3. Ejecución en desarrollo
```bash
npm start
# o
ng serve
```
Accede a http://localhost:4200.

### 4. Construcción para producción
```bash
npm run build:prod
```

---

## 🏗️ Decisiones de Arquitectura

| Decisión | Justificación | Trade-off |
|----------|---------------|-----------|
| **Estructura Feature-First** | Organización por dominios de negocio (Features) para escalar. | Requiere disciplina para mover componentes a shared. |
| **RxJS + Observables** | Manejo de flujos de datos asíncronos en tiempo real. | Curva de aprendizaje alta para evitar memory leaks. |
| **Standalone Components** | Menos boilerplate y mejor rendimiento. | Cambio de paradigma respecto a módulos tradicionales. |
| **Angular Material + CDK** | Componentes UI robustos y accesibles con diseño consistente. | Mayor bundle size inicial. |
| **Vitest + Playwright** | Testing moderno y rápido con e2e integrado. | Configuración inicial más compleja que Karma. |
| **ESLint + Prettier** | Código consistente y calidad automatizada. | Configuración de reglas personalizada necesaria. |
| **Husky + lint-staged** | Pre-commit hooks para mantener calidad de código. | Ligera sobrecarga en cada commit. |

---

## 🧪 Testing

### Pruebas unitarias
Ejecuta la suite de pruebas unitarias para validar la lógica de los componentes y servicios:
```bash
npm run test          # Modo watch
npm run test:ci       # Para CI/CD (sin watch, Chrome headless)
```

### Pruebas e2e con Playwright
```bash
npm run test:e2e      # Ejecutar pruebas end-to-end
```

### Validación de código
```bash
npm run validate      # Ejecuta lint, format check y type-check
npm run lint          # Revisión de código
npm run format        # Formateo automático
npm run type-check    # Verificación de tipos TypeScript
```

---

## 🔍 Probar Endpoints desde el Frontend

Para validar la integración sin usar la UI, puedes capturar las peticiones desde la pestaña Network de tu navegador (F12) o utilizar este comando curl para verificar que tu servicio recibe los datos correctamente:

```bash
curl -X POST https://localhost:2021/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT>" \
  -d '{
    "title": "Test desde Front",
    "description": "Incidente de prueba",
    "severity": "MEDIUM",
    "status": "OPEN",
    "serviceId": "svc-01"
  }'
```

### Endpoints principales
- `GET /api/incidents` - Listar incidentes
- `POST /api/incidents` - Crear nuevo incidente
- `GET /api/incidents/:id` - Obtener incidente específico
- `PUT /api/incidents/:id` - Actualizar incidente
- `DELETE /api/incidents/:id` - Eliminar incidente

---

## 🚧 Pendientes (Trabajo Futuro)

- **Migración completa a Vitest**: Reemplazar completamente Karma por Vitest para mejorar la velocidad de ejecución de tests.
- **State Management**: Implementar NgRx o Signal Store si la complejidad del estado de la UI aumenta.
- **PWA**: Añadir soporte de Service Workers para acceso offline básico.
- **i18n**: Implementar internacionalización para soporte multi-idioma.
- **Component Library**: Crear librería de componentes reutilizables para proyectos futuros.
- **Performance Monitoring**: Integrar herramientas de monitoreo de rendimiento.
- **Error Boundary**: Implementar manejo global de errores con componentes específicos.

---

## 📝 Changelog

### v1.0.0
- Setup inicial con arquitectura Feature-First.
- Configuración de Angular Material para UI consistente.
- Implementación de módulo de autenticación.
- Gestión de incidentes CRUD básico.

### v1.1.0
- Implementación de servicios de consumo API.
- Unit testing básico con Vitest.
- Configuración de ESLint y Prettier.
- Integración con Husky para calidad de código.

### v1.2.0
- Migración a Angular 21 con standalone components.
- Configuración de Playwright para testing e2e.
- Optimización para despliegue en Docker.

---

## 🐳 Soporte Docker

Para ejecutar la aplicación en Docker:
```bash
# Construir imagen
docker build -t incident-web .

# Ejecutar contenedor
docker run -p 4200:80 incident-web
```

La configuración de Docker utiliza automáticamente las variables de entorno de `environment.prod.ts`.

---

## 📊 Estructura del Proyecto

```
src/app/
├── core/           # Servicios singleton e inyección de dependencias
├── features/       # Módulos por dominio de negocio
│   ├── auth/       # Autenticación y autorización
│   └── incidents/  # Gestión de incidentes
├── models/         # Interfaces y tipos de datos
├── shared/         # Componentes y utilidades reutilizables
├── app.config.ts   # Configuración de la aplicación
└── app.routes.ts   # Definición de rutas
```

---

## 🔧 Scripts Disponibles

- `npm start` - Iniciar servidor de desarrollo
- `npm run build` - Construir para desarrollo
- `npm run build:prod` - Construir para producción
- `npm run test` - Ejecutar pruebas unitarias (watch)
- `npm run test:ci` - Ejecutar pruebas en CI/CD
- `npm run lint` - Revisión de código
- `npm run format` - Formatear código
- `npm run validate` - Validación completa del código

---

## 🔄 Pipeline CI/CD

Este proyecto incluye un pipeline completo de Integración Continua y Despliegue Continuo utilizando GitHub Actions.

### 📋 Workflows Automatizados

- **CI Pipeline**: Validación completa en cada push y PR
- **PR Validation**: Validación específica para Pull Requests  
- **Release**: Creación automática de releases

### 🔍 Calidad de Código Automatizada

- ✅ Formato (Prettier)
- 🔍 Linting (ESLint + Angular ESLint)
- 🔷 Type checking (TypeScript)
- 🧪 Tests unitarios con cobertura
- 🏗️ Build automatizado

### 🔄 Pre-commit Hooks

El proyecto utiliza Husky + lint-staged para garantizar calidad antes de cada commit:

```bash
# Formateo y linting automático en cada commit
git add .
git commit -m "feat: nueva funcionalidad"
# Los hooks se ejecutan automáticamente
```

### 📊 Scripts Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run watch          # Build con watch

# Calidad de código
npm run lint          # Ejecuta ESLint
npm run lint:fix       # Corrige problemas de linting
npm run format        # Formatea código con Prettier
npm run format:check   # Verifica formato
npm run type-check    # Type checking con TypeScript

# Tests
npm test              # Ejecuta tests en modo watch
npm run test:ci       # Ejecuta tests para CI (headless + coverage)
npm run test:watch    # Tests en modo interactivo

# Build
npm run build         # Build de desarrollo
npm run build:prod    # Build de producción
```

📖 **Documentación completa**: [CI-CD.md](./CI-CD.md)

## �� Despliegue con Docker

### Build de imagen
```bash
docker build -t incident-web .
```

### Ejecutar contenedor
```bash
docker run -p 80:80 incident-web
```

### Con Docker Compose (recomendado)
Desde el repositorio `incident-infra`:
```bash
docker compose up --build
```

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── core/                 # Servicios y utilidades core
│   │   ├── services/         # Servicios HTTP y negocio
│   │   └── constants/        # Constantes y configuraciones
│   ├── features/             # Características por dominio
│   │   └── incidents/        # Módulo de incidentes
│   │       ├── pages/        # Páginas (listado, crear, detalle)
│   │       └── services/     # Servicios específicos
│   ├── models/               # Modelos de datos
│   └── environments/         # Configuración por entorno
├── styles.scss               # Estilos globales
└── index.html                # Template principal
```

## 📡 API Integration

La aplicación consume los siguientes endpoints del backend API:

### Incidentes
- `GET /incidents` - Listar incidentes con filtros y paginación
- `POST /incidents` - Crear nuevo incidente
- `GET /incidents/{id}` - Obtener detalle con timeline
- `PATCH /incidents/{id}/status` - Actualizar estado

### Filtros soportados
- `status`: Estado del incidente (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `severity`: Severidad (LOW, MEDIUM, HIGH, CRITICAL)
- `serviceId`: ID del servicio
- `q`: Búsqueda por título (contains)
- `page`: Número de página
- `pageSize`: Tamaño de página
- `sort`: Ordenamiento (ej: createdAt_desc)

## 🎨 UI/UX

### Diseño
- **Material Design** con Angular Material
- **Paleta de colores** coherente y accesible
- **Iconos intuitivos** para acciones
- **Feedback visual** en todas las interacciones

### Responsividad
- **Mobile-first** approach
- **Grid system** adaptable
- **Touch-friendly** interactions
- **Optimized** para tablets y móviles

## 🧪 Testing

### Tests Unitarios
- **Servicios**: Cobertura de lógica de negocio
- **Componentes**: Comportamiento de UI
- **Utilidades**: Funciones puras

### Ejecución
```bash
# Todos los tests
ng test

# Con cobertura
ng test --coverage

# Watch mode
ng test --watch
```

## 🔧 Configuración

### Variables de Entorno
```typescript
// development
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};

// production  
export const environment = {
  production: true,
  apiBaseUrl: '/api'  // Proxy a través de Nginx
};
```

### Build Optimizations
```bash
# Producción
ng build --configuration production

# Con source maps (debug)
ng build --configuration production --source-map
```

## 📊 Performance

### Optimizaciones implementadas
- **Lazy loading** de componentes
- **Tree shaking** automático
- **Bundle splitting** por ruta
- **Image optimization** en assets
- **Service Worker** para caché (opcional)

### Métricas
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s  
- **Bundle size**: < 500KB gzipped

## 🚀 Despliegue

### Producción
```bash
# Build optimizado
ng build --configuration production

# Docker build
docker build -t incident-web .

# Deploy
docker push registry/incident-web:latest
```

### CDN
Los assets estáticos están optimizados para servirse desde CDN:
- JS/CSS minificados y gzipped
- Imágenes optimizadas
- Cache headers configurados

## 🔒 Seguridad

### Implementaciones
- **Content Security Policy** headers
- **XSS Protection** activado
- **HTTPS enforcement** en producción
- **Secure cookies** si aplica

### Best Practices
- **Sanitización** de inputs
- **Validación** en frontend y backend
- **Error handling** seguro
- **No secrets** en el cliente

## 🤝 Contribución

### Flujo de trabajo
1. **Feature branch** desde `main`
2. **Commits atómicos** y descriptivos
3. **PR con tests** incluidos
4. **Code review** obligatorio
5. **Merge** con squash

### Standards
- **TypeScript** strict mode
- **ESLint** configurado
- **Prettier** para formato
- **Husky** para pre-commit hooks

## 📝 TODOs

### Mejoras planeadas
- [ ] **Autenticación** con JWT
- [ ] **Notificaciones** real-time (WebSocket)
- [ ] **Offline support** con PWA
- [ ] ** Internacionalización** (i18n)
- [ ] **Dashboard** con métricas
- [ ] **Export** a PDF/Excel

### Bugs conocidos
- [ ] **Scroll** en mobile en ciertos componentes
- [ ] **Performance** en listados grandes (>1000 items)

## 📞 Soporte

### Issues
Reportar bugs y feature requests en [GitHub Issues](https://github.com/tu-org/incident-web/issues)

### Documentación
- [Angular Docs](https://angular.dev)
- [Material Design](https://material.io/design)
- [API Documentation](./docs/api.md)

---

**Desarrollado con ❤️ siguiendo principios SOLID y mejores prácticas Angular**
