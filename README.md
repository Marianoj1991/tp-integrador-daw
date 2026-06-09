# Sistema de Gestión de Proyectos - Trabajo Final Integrador 2026 - UNER-FCAD

Este proyecto consiste en un **Sistema de Gestión de Proyectos** simple y eficiente, desarrollado como Trabajo Final Integrador para la asignatura **Desarrollo de Aplicaciones Web** de la **Tecnicatura Universitaria en Desarrollo Web**.

El sistema permite gestionar usuarios, clientes, proyectos y sus respectivas tareas asociadas, cumpliendo con un diseño de arquitectura limpia, robusta y escalable.

---

## 👥 Integrantes del equipo
- **Mariano Jimenez** (@Marianoj1991)  
- **Luciano Cirvini** (@Luciano7786)  
- **Macarena Schefer** (@MacaSchefer)  
- **Sofía Guardia** (@guardiasofia)  

---


## 🚀 Tecnologías Utilizadas

El proyecto está compuesto por las siguientes tecnologías:

* **Backend:** NestJS (Framework de Node.js)
* **Frontend:** Angular
* **ORM:** TypeORM
* **Base de Datos:** PostgreSQL
* **Servidor Web y Proxy Inverso:** Nginx
* **Gestor de Procesos:** PM2

---

## 📋 Requerimientos del Sistema

El sistema implementa de forma estricta las reglas de negocio solicitadas:

* **Acceso y Autenticación:** Ingreso mediante credenciales de usuario (Usuario, Clave y Estado Activo/Baja).
* **Gestión de Proyectos:** Alta y modificación de proyectos (Nombre y Estado: Activo, Finalizado, Baja), visualización de tareas asociadas y asignación de clientes.
* **Gestión de Clientes:** Alta y modificación de clientes (Nombre y Estado: Activo/Baja). Solo se permite asignar clientes "Activos" y las bajas están restringidas si el cliente posee proyectos asociados.
* **Gestión de Tareas:** CRUD completo de tareas dentro de un proyecto (Descripción y Estado: Pendiente, Finalizado, Baja).
* **Restricciones de Visibilidad:** Todos los datos son globales y visibles para cualquier usuario autenticado en la instalación.

---

## ✨ Funcionalidades Adicionales (Individuales)

Como parte de los requisitos de autoría e individualidad del TP, se integraron las siguientes funcionalidades:

* **Exportación de Datos:** Opción en el backend y frontend para descargar reportes e información relevante del sistema en formato **CSV**.
* *-- Espacio para agregar las funcionalidades --*

---

## 🛠️ Configuración e Instalación Local

### Requisitos Previos
* Node.js (versión LTS recomendada)
* PostgreSQL corriendo localmente o mediante Docker

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Marianoj1991/tp-integrador-daw.git](https://github.com/Marianoj1991/tp-integrador-daw.git)
cd tp-integrador-daw
