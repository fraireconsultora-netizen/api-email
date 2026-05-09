## API de Envío de Mails con Express y Nodemailer

Este proyecto es una mini API construida con Express para enviar emails a través de una cuenta de Gmail. Utiliza plantillas HTML almacenadas en la carpeta templates/ y toda la configuración se realiza mediante variables de entorno.

### 📋 Requisitos Previos

Node

- Node.js (>= 14) o nvs/nvm

- npm o Yarn

Cuenta de Gmail con:

- Verificación en Dos Pasos (2FA) habilitada

- Contraseña de Aplicación (App Password) generada para uso con Nodemailer

### 🚀 Instalación y Configuración

1. **Clonar el repositorio**
```
git clone <URL repo>
cd api-send-emails
```

2. **Instalar dependencias**

```
npm install o yarn install
```

3. **Crear archivo de entorno**

Crea un archivo .env en el root del proyecto y agrega y completá los datos que se pueden encontrar en el archivo .env.example.

4. **Configurar contraseña de aplicación en Gmail**

-  Ingresa a **Google Account > Seguridad**
-  Habilita **Verificación en Dos Pasos**
-  En **Contraseñas de aplicaciones**, genera una nueva contraseña:
   - Selecciona **Otro**
   - Ponle un nombre (por ejemplo: `nodemailer`)
    - Copia los 16 dígitos y pégalos en `SMTP_PASS` dentro de tu archivo `.env`

---

### 🛠️ Uso

1. **Levantar el servidor**

```
node index.js
```

2. **Enviar un correo**

Endpoint: POST http://localhost:${process.env.PORT || 3000}/send-email