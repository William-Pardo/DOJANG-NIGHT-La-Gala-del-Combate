# DOJANG NIGHT - La Gala del Combate

Dossier visual estatico para presentar **DOJANG NIGHT - La Gala del Combate** ante instituciones, auditorios, colegios, universidades, centros culturales o aliados.

El sitio explica de forma autosuficiente el concepto creativo, tecnico, logistico y operativo de una gala deportiva, cultural y familiar de taekwondo. La direccion visual evita una percepcion de lujo o produccion costosa: busca sentirse organizada, sobria, calida, marcial, familiar e institucional.

## Objetivo del sitio

Permitir que una institucion entienda el evento haciendo scroll, sin requerir explicacion verbal adicional.

El dossier cubre:

- Concepto: no sera un torneo, sera una gala marcial.
- Escala aproximada: 200 estudiantes, 3 bloques, 70 estudiantes por grupo, 2 horas por bloque, 6 horas de jornada.
- Experiencia escenica: presentacion de combate, arbitro, jueces, mesa tecnica, marcador sencillo, maestro de ceremonia y break freestyle.
- Experiencia familiar: reconocimientos para todos, memoria fotografica y enfoque en el proceso.
- Operacion logistica: manillas por color, flujo de grupos, salida, limpieza rapida e ingreso del siguiente bloque.
- Viabilidad institucional: espacio, montaje, personal, control de aforo, orden y seguridad deportiva.
- Complemento cultural: zona gastronomica asiatica/coreana fuera del teatro.

## Estructura de archivos

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
├── ASSET_MAP.md
└── assets/
    ├── img/
    │   ├── 01_HERO_ENTRADA_AL_EVENTO.webp
    │   ├── 02_PRESENTACION_COMBATE.webp
    │   ├── 03_COMBATE_CONTROLADO.webp
    │   ├── 04_RECONOCIMIENTO_HABILIDAD_TAEKWONDO.webp
    │   ├── 06_CAMBIO_DE_GRUPO_FLUJO_INFOGRAFICO.webp
    │   ├── 07_CONTROL_MANILLAS_INGRESO.webp
    │   ├── 08_FREESTYLE_BREAK.webp
    │   ├── 09_MESA_TECNICA_JUECES_PUNTOS.webp
    │   ├── 10_ZONA_GASTRONOMICA_EXTERNA.webp
    │   ├── 11_FOTO_FAMILIAR_RECONOCIMIENTO.webp
    │   ├── 12_DESOCUPACION_AUDITORIO.webp
    │   └── 13_RESUMEN_VISUAL_OPERACION.webp
    └── logos/
        ├── logo-gajog-principal.png
        └── logo-dojang-night.png
```

La carpeta `img/` conserva archivos originales de trabajo. La interfaz usa las versiones normalizadas ubicadas en `assets/img/` y `assets/logos/`.

## Imagenes requeridas

Todas estas imagenes deben existir en `assets/img/`:

- `01_HERO_ENTRADA_AL_EVENTO.webp`
- `02_PRESENTACION_COMBATE.webp`
- `03_COMBATE_CONTROLADO.webp`
- `04_RECONOCIMIENTO_HABILIDAD_TAEKWONDO.webp`
- `06_CAMBIO_DE_GRUPO_FLUJO_INFOGRAFICO.webp`
- `07_CONTROL_MANILLAS_INGRESO.webp`
- `08_FREESTYLE_BREAK.webp`
- `09_MESA_TECNICA_JUECES_PUNTOS.webp`
- `10_ZONA_GASTRONOMICA_EXTERNA.webp`
- `11_FOTO_FAMILIAR_RECONOCIMIENTO.webp`
- `12_DESOCUPACION_AUDITORIO.webp`
- `13_RESUMEN_VISUAL_OPERACION.webp`

Los logos deben existir en `assets/logos/`:

- `logo-gajog-principal.png`
- `logo-dojang-night.png`

## Como correr localmente

No requiere build, frameworks ni dependencias externas.

Opcion 1: abrir `index.html` directamente en el navegador.

Opcion 2: servir la carpeta con un servidor estatico:

```bash
python -m http.server 8080
```

Luego abrir:

```text
http://127.0.0.1:8080
```

## Publicacion en GitHub Pages

1. Subir `index.html`, `styles.css`, `script.js`, `README.md`, `ASSET_MAP.md` y la carpeta `assets/` al repositorio.
2. En GitHub, abrir **Settings** del repositorio.
3. Entrar a **Pages**.
4. En **Build and deployment**, seleccionar **Deploy from a branch**.
5. Elegir la rama principal, normalmente `main`.
6. Elegir la carpeta `/root`.
7. Guardar.
GitHub generará una URL pública cuando termine el despliegue. Este repositorio no activa GitHub Pages automáticamente desde el código.

## Motion y accesibilidad

El sitio usa JavaScript puro para:

- Reveal on scroll (revelado al hacer scroll).
- Parallax sutil en el hero.
- Contadores animados.
- Navegación activa.
- Scroll suave.
- Botón volver arriba.
- Timeline interactivo con expansión fluida.
- Storytelling logístico sticky en desktop.

En dispositivos móviles, la experiencia logística se apila verticalmente de forma adaptada. El sitio respeta 100% la directiva de accesibilidad `prefers-reduced-motion`.

## Pendientes

Actualmente no faltan imágenes requeridas para la interfaz final. Si se reemplazan assets en el futuro, se deben conservar exactamente los nombres normalizados esperados en `assets/img/` y `assets/logos/`.

## Notas de Seguridad y Calidad

> [!WARNING]
> **Integridad del Repositorio**: Bajo ninguna circunstancia se deben borrar o alterar los assets gráficos de la carpeta `assets/img/` o `assets/logos/`, ya que rompería el flujo narrativo del dossier digital.

> [!IMPORTANT]
> **Normas de Modificación**:
> 1. No se deben utilizar frameworks de JS (como React, Angular) ni dependencias externas de CSS (como Tailwind) para conservar el dossier nativo y de carga ultra rápida.
> 2. Todas las correcciones ortográficas están alineadas con los más altos estándares editoriales en español para garantizar el rigor y profesionalismo ante instituciones.
> 3. No ejecutar comandos de terminal destructivos ni utilizar modos automáticos ("modo turbo") que alteren la estructura modular del proyecto.
