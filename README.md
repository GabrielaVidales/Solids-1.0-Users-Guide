# Solids 1.0 — Interactive User Guide

<p align="center">
  <img src="images/Solids.jpg" alt="Solids 1.0" width="180"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Deployed-GitHub%20Pages-222222?style=flat&logo=githubpages&logoColor=white"/>
</p>

---

## Overview

Interactive web-based user guide for **Solids 1.0**, a scientific software package for **crystal structure prediction (CSP)** via global optimization on the potential energy surface (PES). Built as a single-page application with dynamic navigation, smart search, syntax-highlighted code blocks, and lazy-loaded scientific visualizations.

Developed at **CINVESTAV Mérida — TheoChemMérida Lab**, under the supervision of Dr. Filiberto Ortiz-Chi and Dr. Gabriel Merino.

🌐 **Live guide:** [solids-1.0-users-guide](https://GabrielaVidales.github.io/Solids-1.0-Users-Guide)

---

## What is Solids?

**Solids** is a crystal structure prediction tool that explores the potential energy surface of a system to find the most stable (lowest-energy) atomic arrangements. It combines two complementary global optimization strategies:

- **Stochastic Algorithm (SA)** — pre-screens the energy landscape rapidly using random structural perturbations, ideal for broad exploration of configuration space
- **Evolutionary Algorithm (EA)** — builds successive generations of structures using genetic operators (crossover, mutation, niching) to converge toward the global energy minimum

Solids is interfaced with three widely-used quantum chemistry and force-field calculators:

| Calculator | Use case |
|-----------|---------|
| **EMT** (ASE) | Fast prototyping and testing · metallic systems (e.g. Al₁₀) |
| **GULP** | Force-field based optimization · ionic/oxide systems (e.g. TiO₂, MgAl₂O₄, MgSiO₃) |
| **VASP** | DFT-level accuracy · covalent systems (e.g. C₈ diamond/graphite) |

---

## Guide contents

The interactive guide covers:

- **Introduction** — what Solids does, its workflow, installation, and input file structure
- **Theory** — potential energy surfaces, evolutionary algorithms, crossover and mutation operators, structural relaxation, convergence criteria and the putative global minimum
- **Local usage** — step-by-step walkthroughs for each calculator (EMT · GULP · VASP) with annotated input files, expected outputs, and result interpretation
- **Google Colab** — cloud-based usage guide for running Solids without a local HPC setup
- **Output reference** — interpretation of generation summaries, niching results, and final structure files

---

## Web interface features

- Single-page application with hash-based routing — each section has a shareable URL
- Collapsible sidebar navigation with subsection support
- Smart full-text search across all documentation sections
- Syntax-highlighted code blocks for input files and terminal commands
- AOS (Animate On Scroll) transitions for a clean reading experience
- Responsive layout — works on desktop and mobile
- Lazy-loaded high-resolution molecular structure images

---

## Tech stack

| Tech | Purpose |
|------|---------|
| HTML5 + CSS3 | Structure and styling |
| Vanilla JavaScript | Dynamic section rendering, routing, search |
| AOS.js | Scroll animations |
| GitHub Pages | Hosting and deployment |

---

## Local development

```bash
git clone https://github.com/GabrielaVidales/Solids-1.0-Users-Guide.git
cd Solids-1.0-Users-Guide

# No build step needed — open directly in browser
open index.html
```

---

## Related

- [Solids source code](https://github.com/LuisOrz/SmilX) — the Solids package itself
- [TheoChemMérida Lab](https://www.cinvestav.mx) — CINVESTAV Mérida research group
- [ELAYA SMILES](https://github.com/GabrielaVidales/ELAYA_SMILES) — companion AI tool for molecular structure generation

---

## Authors

Developed by **Gabriela Vidales Ayala** ([@GabrielaVidales](https://github.com/GabrielaVidales))  
Research group: TheoChemMérida Lab · CINVESTAV Mérida  
Supervisors: Dr. Filiberto Ortiz-Chi · Dr. Gabriel Merino
