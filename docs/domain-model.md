# Modelo de Dominio

## Información del Documento

| Campo                    | Valor                     |
| ------------------------ | ------------------------- |
| **Módulo** | Carga de Horas y Finanzas |
| **Tribu** | F                         |
| **Fecha de creación** | 30/11/2025                |
| **Última actualización** | 30/11/2025                |

## Diagrama del Modelo de Dominio

![Modelo de Dominio](modelo-de-dominio-tribu.png)

_Diagrama del modelo de dominio para el módulo de Carga de Horas y Finanzas_

## Entidades del Dominio

### Carga
- **Descripción:** Registro detallado del tiempo invertido.
- **Responsabilidades:** Almacenar la cantidad de horas, la fecha y el detalle del trabajo realizado para su posterior imputación de costos.
- **Atributos principales:** `id`, `Cantidad de Horas`, `Fecha`, `Detalle`.

### Costo proyecto mensual
- **Descripción:** Entidad que agrupa los costos financieros imputados a un proyecto para un mes específico.
- **Responsabilidades:** Consolidar el costo mensual acumulado basándose en las cargas horarias.
- **Atributos principales:** `proyecto_id`, `mes`, `costo_mensual`.

### Costo rol mensual
- **Descripción:** Define el valor monetario (tarifario) de un rol específico en un mes determinado.
- **Responsabilidades:** Establecer el costo por hora base para los cálculos financieros del periodo.
- **Atributos principales:** `rol_id`, `mes`, `costo_hora`.

### Resumen Costo Proyecto
- **Descripción:** Entidad de reporte o vista agregada.
- **Responsabilidades:** Calcular y mostrar los totales financieros en un rango de fechas.
- **Atributos principales:** `Mes de Inicio`, `Mes Fin`, `/Costo total por mes`, `/Costo total`.

## Relaciones entre Entidades

| Entidad Origen         | Relación             | Entidad Destino        | Descripción                                                                 |
| ---------------------- | -------------------- | ---------------------- | --------------------------------------------------------------------------- |
| **Carga** | Utiliza              | **Costo proy mensual** | Las cargas de horas contribuyen al cálculo y acumulación del costo mensual. |
| **Costo proy mensual** | usa                  | **Costo rol mensual** | El cálculo del costo mensual utiliza la tarifa del rol definida para ese mes.|
| **Costo rol mensual** | consume              | **Resumen Costo Proy** | El reporte de resumen consume los costos de roles para proyectar totales.   |

## Diccionario de Datos

| Entidad                | Atributo              | Descripción                                       | Tipo Primitivo |
| ---------------------- | --------------------- | ------------------------------------------------- | -------------- |
| **Carga** | id                    | Identificador único de la carga.                  | Integer (PK)   |
| **Carga** | Cantidad de Horas     | Tiempo dedicado a la tarea.                       | Decimal        |
| **Carga** | Fecha                 | Día en que se realizó la carga.                   | Date           |
| **Carga** | Detalle               | Descripción textual del trabajo realizado.        | String         |
| **Costo proy mensual** | proyecto_id           | ID del proyecto externo asociado.                 | Integer (FK)   |
| **Costo proy mensual** | mes                   | Mes y año al que corresponde el costo.            | Date/String    |
| **Costo proy mensual** | costo_mensual         | Valor monetario acumulado del mes.                | Money/Decimal  |
| **Costo rol mensual** | rol_id                | ID del rol externo asociado.                      | Integer (FK)   |
| **Costo rol mensual** | mes                   | Mes de vigencia del costo.                        | Date/String    |
| **Costo rol mensual** | costo_hora            | Valor de la hora para ese rol en ese mes.         | Money/Decimal  |
| **Resumen Costo Proy** | Mes de Inicio         | Inicio del rango de reporte.                      | Date           |
| **Resumen Costo Proy** | Mes Fin               | Fin del rango de reporte.                         | Date           |
| **Resumen Costo Proy** | /Costo total por mes  | Atributo derivado. Sumatoria calculada por mes.   | Money/Decimal  |
| **Resumen Costo Proy** | /Costo total          | Atributo derivado. Sumatoria total del rango.     | Money/Decimal  |

## Notas Adicionales

1.  **Referencias Externas:** Las entidades `Proyecto`, `Tarea`, `Recurso` y `Rol` se consideran externas a este dominio. Solo se conservan sus identificadores (`ids`) como claves foráneas para mantener la integridad de los datos financieros.
2.  **Atributos Derivados:** Los atributos marcados con `/` en la entidad `Resumen Costo Proyecto` son calculados en tiempo de ejecución.

---

**Versión:** 1.1  
**Estado:** En revisión