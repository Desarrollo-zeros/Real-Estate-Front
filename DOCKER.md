# 🐳 Frontend - Docker Setup

## Servicio Incluido

Este `docker-compose.yml` incluye:

- **Frontend (Next.js)**: Aplicación web (puerto 3000)

## ⚠️ Requisitos Previos

### 1. Backend API

**El backend debe estar corriendo** para que el frontend funcione correctamente.

Puedes:
1. Ejecutar el backend con Docker desde `/back`
2. O ejecutar el backend localmente con `dotnet run`

### 2. Archivo de Variables de Entorno

**🔴 IMPORTANTE:** Debes tener el archivo `.env.production` configurado antes de hacer el build.

Crea o verifica el archivo `.env.production` en la raíz del proyecto frontend:

```bash
# .env.production
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Real Estate Management System
```

**Notas:**
- Asegúrate de que `NEXT_PUBLIC_API_BASE_URL` apunte a la URL correcta de tu backend
- Para producción, cambia `localhost` por tu dominio real
- Este archivo ya está incluido en el repositorio como ejemplo

## 🚀 Inicio Rápido

### **1. Configurar Variables de Entorno**

```bash
# Verificar que .env.production existe
cat .env.production

# Si no existe, créalo
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1" > .env.production
echo "NEXT_PUBLIC_APP_NAME=Real Estate Management System" >> .env.production
```

### **2. Levantar el servicio**

```bash
# Desde la carpeta /front
docker-compose up -d --build
```

### **2. Ver logs**

```bash
docker-compose logs -f frontend
```

### **3. Detener servicio**

```bash
docker-compose down
```

## 📋 Acceso

| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:3000 |

## 🛠️ Comandos Útiles

```bash
# Rebuild del frontend
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f

# Ejecutar comandos en el contenedor
docker exec -it realestate-frontend sh

# Ver estado
docker-compose ps

# Limpiar
docker-compose down
```

## 🔧 Configuración

### Variables de Entorno

Configuradas en `docker-compose.yml`:

- `NODE_ENV`: production
- `NEXT_PUBLIC_API_BASE_URL`: URL del backend API
- `NEXT_PUBLIC_APP_NAME`: Nombre de la aplicación

Para cambiar la URL del API, edita:

```yaml
environment:
  NEXT_PUBLIC_API_BASE_URL: http://localhost:5000/api/v1
```

### Build Args

También puedes cambiar la URL durante el build:

```yaml
build:
  args:
    NEXT_PUBLIC_API_BASE_URL: http://localhost:5000/api/v1
```

## 📦 Desarrollo

Para desarrollo local sin Docker:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

## 🐛 Troubleshooting

### El frontend no puede conectar al backend

Verifica que el backend esté corriendo:
```bash
curl http://localhost:5000/health
```

### Error "ECONNREFUSED"

Asegúrate de que:
1. El backend está corriendo
2. La URL en `NEXT_PUBLIC_API_BASE_URL` es correcta
3. No hay firewall bloqueando el puerto 5000

### El build falla

Limpia y rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Logs de error

Ver logs detallados:
```bash
docker-compose logs -f frontend
```

## 🌐 Variables de Entorno en Producción

Para producción, crea un archivo `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_APP_NAME=Real Estate Management System
```

## 📝 Notas

- El frontend usa **standalone output** para optimizar el tamaño de la imagen
- El build puede tardar 2-3 minutos la primera vez
- La imagen final es ~200MB (optimizada)
