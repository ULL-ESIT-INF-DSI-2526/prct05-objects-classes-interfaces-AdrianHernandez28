import { describe, test, expect, beforeEach } from 'vitest';
import { Filter, RecipesArchive, Chef, RecipeBook, Recipe, Step } from '../src/ejercicio-3'; // Ajusta la ruta

let recipe: Recipe;
let recipeBook: RecipeBook;
let chef: Chef;
let archive: RecipesArchive;

beforeEach(() => {
  // Creamos receta
  recipe = new Recipe('Tortilla', new Date('2023-01-01'));
  recipe.addStep('Batir huevos', 60, 1, false, 0);
  recipe.addStep('Freír', 120, 2, false, 0);
  recipe.addStep('Servir', 30, 3, true, 0);

  // Creamos RecipeBook
  recipeBook = new RecipeBook();
  recipeBook.addRecipe(recipe);

  // Creamos Chef
  chef = new Chef('Juan', 1000, recipeBook);

  // Creamos RecipesArchive
  archive = new RecipesArchive();
  archive.addChef(chef);
});


// ---------------------- Recipe ----------------------
describe('Recipe', () => {
  test('should add steps correctly', () => {
    expect(recipe.steps.length).toBe(3);
    expect(recipe.steps[0].description).toBe('Batir huevos');
  });

  test('should calculate stepsNumber correctly', () => {
    expect(recipe.stepsNumber()).toBe(3);
  });

  test('should calculate recipeTotalTime correctly', () => {
    const [min, max] = recipe.recipeTotalTime();
    expect(min).toBe(180); // solo pasos obligatorios
    expect(max).toBe(210); // todos los pasos
  });
});


// ---------------------- RecipeBook ----------------------
describe('RecipeBook', () => {
  test('should add recipes correctly', () => {
    expect(recipeBook.archive.length).toBe(1);
    expect(recipeBook.archive[0].name).toBe('Tortilla');
  });

  test('printInfo should not throw', () => {
    expect(() => recipeBook.printInfo()).not.toThrow();
  });

  test('should allow searching recipes by name', () => {
    const results = recipeBook.archive.filter(r => r.name.toLowerCase().includes('tortilla'));
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Tortilla');
  });
});


// ---------------------- Chef ----------------------
describe('Chef', () => {
  test('should have correct name and followers', () => {
    expect(chef.name).toBe('Juan');
    expect(chef.followers).toBe(1000);
  });

  test('should have correct RecipeBook', () => {
    expect(chef.recipes).toBe(recipeBook);
    expect(chef.recipes.archive[0].name).toBe('Tortilla');
  });

  test('printInfo should not throw', () => {
    expect(() => chef.printInfo()).not.toThrow();
  });
});


// ---------------------- RecipesArchive ----------------------
describe('RecipesArchive', () => {
  test('should add chefs correctly', () => {
    expect(archive.archive.length).toBe(1);
    expect(archive.archive[0].name).toBe('Juan');
  });

  test('search by CHEFS should find correct chef', () => {
    const results = archive.search(Filter.CHEFS, 'juan');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Juan');
  });

  test('search by RECIPES should find chef with matching recipe', () => {
    const results = archive.search(Filter.RECIPES, 'tortilla');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Juan');
  });

  test('search by STEPS should find chef with matching step', () => {
    const results = archive.search(Filter.STEPS, 'freír');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Juan');
  });

  test('search should return empty array when no match', () => {
    const results = archive.search(Filter.CHEFS, 'pedro');
    expect(results.length).toBe(0);
  });

  test('printSearch should not throw', () => {
    expect(() => archive.printSearch(Filter.CHEFS, 'juan')).not.toThrow();
  });

});

describe('RecipesArchive.printSearch - no results', () => {
  let capturedLogs: string[] = [];

  test('should print "No results found" when search returns empty', () => {
    // Redirigimos temporalmente console.log
    const originalLog = console.log;
    console.log = (msg: string) => {
      capturedLogs.push(msg);
    };

    archive.printSearch(Filter.CHEFS, 'Pedro'); // No existe ningún chef llamado Pedro

    // Comprobamos que se imprimió "No results found"
    expect(capturedLogs).toContain('No results found');

    // Restauramos console.log
    console.log = originalLog;
  });
});