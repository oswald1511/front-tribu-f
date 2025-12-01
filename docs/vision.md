# Visión Unificada — Carga de Horas & Finanzas

| Campo                    | Valor      |
| ------------------------ | ---------- |
| **Tribu**                | F          |
| **Fecha de creación**    | 30/11/2025 |
| **Última actualización** | 01/12/2025 |

## Resumen Ejecutivo

Esta visión unifica dos módulos complementarios del MVP: el módulo de Carga de Horas (captura y gestión de horas trabajadas por recurso/proyecto/tarea) y el módulo de Finanzas (consumo de esas horas junto con las tarifas por rol para generar reportes de costo).

El objetivo conjunto es permitir un flujo end-to-end: el recurso registra horas en el sistema, esas horas son accesibles por Finanzas y se combinan con las tarifas por rol para producir reportes de costo por recurso y por proyecto. La arquitectura favorece la simplicidad: la información estructural (proyectos, tareas, roles, recursos) proviene de APIs externas y no se replica localmente en el MVP.

## Objetivos Principales

- Capturar horas de trabajo por proyecto/tarea/día con validaciones básicas.
- Mantener una tabla simple de costo por hora por rol y mes junto a otra tabla de las horas totales por proyecto y recurso por mes, con operaciones CRUD mínimas y capacidad para aplicar incrementos masivos.
- Generar reportes consolidando horas y tarifas para obtener costo mensual por proyecto y por recurso.
- Exponer endpoints que permitan consultar costos por proyecto y por rol para integración con otras vistas del frontend.

## Funcionalidades (resumen)

- Registro de horas por proyecto, tarea y fecha con validaciones de integridad básicas (pertenencia de tarea al proyecto, existencia del recurso).
- Visualización y edición de cargas por semana (lun–dom) para el recurso.
- Configuración y edición de costo por hora mensual por rol; mostrar $0 cuando no exista un costo cargado para un rol/mes.
- Aplicación de incrementos porcentuales para ajustar tarifas en bloque.
- Cálculo de costo por proyecto y por recurso: sumar horas × tarifa por mes y exponer detalle mensual (Enero–Diciembre) y total anual.
- Endpoints de consulta para: obtener costos por proyecto (por año), obtener costos por rol (por mes) y listar roles/proyectos desde APIs externas.

## Integración y Dependencias

- API de Proyectos: lista y metadatos de proyectos.
- API de Tareas: tareas asociadas a proyectos.
- API de Roles: catálogo de roles (id, nombre, experiencia).
- API de Recursos: información de los recursos (nombres, asignaciones).

Estas APIs son externas al módulo y no se persisten localmente en el MVP.

## Consideraciones Técnicas

- Backend: servicio REST que almacena la tabla mínima de costos por rol/mes y de horas totales por proyecto/recurso/anioMes, expone endpoints para cálculo y consultas y para horas hechas por proyecto de un determinado recurso en una determinada fecha
- Base de datos relacional ligera para la tabla de costos por hora (rol_id, mes YYYY-MM, costo_hora) que se complementa con la tabla de horas totales por proyecto/recurso/anioMes.
- El frontend consulta APIs externas para obtener datos maestros y llama al backend de Finanzas para obtener costos consolidados.

## Exclusiones (fuera de alcance del MVP)

- Facturación, impuestos, ingresos y costos indirectos.
- Reglas complejas de vigencia y auditoría histórica avanzada.
- Workflows de aprobación extensos, gestión de ausencias o reglas de negocio complejas.

## Supuestos y Convenciones

- Moneda por defecto: ARS.
- Formato de mes: `YYYY-MM`.
- Convención de nombres: snake_case para atributos.
- IDs como strings; montos como números decimales.

---

**Versión:** 2.1  
**Estado:** En revisión
