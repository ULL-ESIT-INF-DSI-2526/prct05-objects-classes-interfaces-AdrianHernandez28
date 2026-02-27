import { describe, expect, test, beforeEach } from "vitest";
import { ArchiveBibliography, BibliographicArticle, Magazine, Filter } from '../src/ejercicio-1';

// Datos de prueba
let article1: BibliographicArticle;
let article2: BibliographicArticle;
let magazine1: Magazine;
let archive: ArchiveBibliography;

beforeEach(() => {
  article1 = new BibliographicArticle(
    "TypeScript Basics",
    ["Juan Pérez", "Ana López"],
    ["typescript", "programming", "frontend"],
    "Introducción a TypeScript",
    new Date("2024-05-10"),
    12,
    "Editorial A"
  );

  article2 = new BibliographicArticle(
    "Advanced JavaScript",
    ["Carlos Ruiz"],
    ["javascript", "backend"],
    "Conceptos avanzados de JS",
    new Date("2023-11-02"),
    15,
    "Editorial B"
  );

  magazine1 = new Magazine(
    "Frontend Monthly",
    ["Laura Gómez"],
    ["frontend", "css", "html"],
    "Revista de desarrollo web",
    new Date("2025-01-15"),
    20,
    "Editorial C",
    5,
    12
  );

  archive = new ArchiveBibliography(article1, article2, magazine1);
});

// =====================
// Tests BibliographicArticle
// =====================
describe("BibliographicArticle", () => {
  test("Debe almacenar título correctamente", () => {
    expect(article1.title).toBe("TypeScript Basics");
  });

  test("Debe almacenar autores correctamente", () => {
    expect(article1.authors).toContain("Juan Pérez");
    expect(article1.authors).toContain("Ana López");
  });

  test("Debe almacenar keywords correctamente", () => {
    expect(article1.keywords).toContain("typescript");
    expect(article1.keywords).toContain("frontend");
  });

  test("Debe generar referencia IEEE correctamente", () => {
    const ieee = article1.getIEEE();
    expect(ieee).toContain("TypeScript Basics");
    expect(ieee).toContain("Juan Pérez, Ana López");
    expect(ieee).toContain("Editorial A");
    expect(ieee).toContain("12");
    expect(ieee).toContain("2024");
  });
});

// =====================
// Tests Magazine
// =====================
describe("Magazine", () => {
  test("Debe almacenar número de revista y volúmenes", () => {
    expect(magazine1.numberMagazine).toBe(5);
    expect(magazine1.numberVolumes).toBe(12);
  });

  test("Debe generar IEEE con volúmen y número de revista", () => {
    const ieee = magazine1.getIEEE();
    expect(ieee).toContain("Frontend Monthly");
    expect(ieee).toContain("vol. 12");
    expect(ieee).toContain("no. 5");
    expect(ieee).toContain("pp. 20");
    expect(ieee).toContain("2025");
  });

  test("Debe contener keywords correctamente", () => {
    expect(magazine1.keywords).toContain("frontend");
    expect(magazine1.keywords).toContain("css");
    expect(magazine1.keywords).toContain("html");
  });

  test("Debe almacenar autores correctamente", () => {
    expect(magazine1.authors).toContain("Laura Gómez");
  });
});

// =====================
// Tests ArchiveBibliography
// =====================
describe("ArchiveBibliography", () => {
  test("Debe almacenar varios artículos en el archivo", () => {
    expect(archive.archive.length).toBe(3);
    const titles = archive.archive.map(a => a.title);
    expect(titles).toContain("TypeScript Basics");
    expect(titles).toContain("Advanced JavaScript");
    expect(titles).toContain("Frontend Monthly");
  });

  test("Debe permitir añadir artículos nuevos", () => {
    const newArticle = new BibliographicArticle(
      "React Tips",
      ["Miguel Torres"],
      ["react", "javascript", "frontend"],
      "Trucos para React",
      new Date("2024-09-01"),
      10,
      "Editorial D"
    );
    archive.addArticles(newArticle);
    expect(archive.archive.length).toBe(4);
    expect(archive.archive[3].title).toBe("React Tips");
  });

  test("Búsqueda por título funciona correctamente", () => {
    const results = archive.search(Filter.TITLE, "typescript");
    expect(results.length).toBe(1);
    expect(results[0].title).toBe("TypeScript Basics");
  });

  test("Búsqueda por autores funciona correctamente", () => {
    const results = archive.search(Filter.AUTHORS, "carlos");
    expect(results.length).toBe(1);
    expect(results[0].authors).toContain("Carlos Ruiz");
  });

  test("Búsqueda por keywords funciona correctamente", () => {
    const results = archive.search(Filter.KEYWORDS, "frontend");
    expect(results.length).toBe(2); // article1 y magazine1
    const titles = results.map(r => r.title);
    expect(titles).toContain("TypeScript Basics");
    expect(titles).toContain("Frontend Monthly");
  });

  test("Exportación IEEE funciona correctamente", () => {
    const ieeeResults = archive.searchIEEE(Filter.KEYWORDS, "frontend");
    expect(ieeeResults.length).toBe(2);
    expect(ieeeResults[0]).toContain("TypeScript Basics");
    expect(ieeeResults[1]).toContain("Frontend Monthly");
  });

  test("printResults devuelve array correctamente", () => {
    const results = archive.search(Filter.TITLE, "advanced");
    expect(results.length).toBe(1);
    archive.printResults(results); // solo comprobamos que no lanza error
  });
});