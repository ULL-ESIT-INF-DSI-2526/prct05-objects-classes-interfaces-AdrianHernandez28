/**
 * Define los diferentes criterios de búsqueda y filtrado disponibles.
 */
export enum Filter {
  /** Filtrar por nombre de chef */
  CHEFS = 'CHEFS',
  /** Filtrar por nombre de receta */
  RECIPES = 'RECIPES',
  /** Filtrar por descripción de los pasos de una receta */
  STEPS = 'STEPS'
}

/**
 * Representa la estructura de datos básicos de una receta.
 */
export interface RecipeData {
  /** Nombre de la receta */
  name: string;
  /** Fecha de publicación o creación de la receta */
  date: Date;
  /** Lista de pasos necesarios para completar la receta */
  steps: Step[];
}

/**
 * Representa un paso individual dentro del proceso de elaboración de una receta.
 */
export interface Step {
  /** Descripción detallada del paso */
  description: string;
  /** Duración del paso en segundos */
  duration: number; 
  /** Etiqueta o número identificador del paso */
  label: number;
  /** Indica si el paso es opcional (`true`) o de realización obligatoria (`false`) */
  optionalStep: boolean;
  /** Número de veces que este paso ha sido completado */
  timesCompleted: number;
}

/**
 * Gestiona un archivo global de chefs, permitiendo almacenar y buscar información.
 */
export class RecipesArchive {
  /**
   * Crea una instancia del archivo de recetas.
   * @param archive - Un array opcional de chefs para inicializar el archivo. Por defecto es un array vacío.
   */
  constructor(public archive: Chef[] = []) {}

  /**
   * Añade un nuevo chef al archivo.
   * @param chef - El objeto {@link Chef} que se va a añadir.
   */
  addChef(chef: Chef): void {
    this.archive.push(chef);
  }

  /**
   * Busca en el archivo basándose en un criterio de filtrado y una palabra clave.
   * @param filt - El criterio de filtrado a utilizar ({@link Filter}).
   * @param keyword - La palabra clave a buscar.
   * @returns Un array de objetos {@link Chef} que coinciden con los criterios de búsqueda.
   */
  search(filt: Filter, keyword: string): Chef[] {
    const consKeyword = keyword.toLowerCase();
    return this.archive.filter(item => {
      switch(filt) {
        case Filter.CHEFS:
          return item.name.toLowerCase().includes(consKeyword);
        case Filter.RECIPES:
          return item.recipes.archive.some(recipe =>
            recipe.name.toLowerCase().includes(consKeyword)
          );
        case Filter.STEPS:
          return item.recipes.archive.some(recipe =>
            recipe.steps.some(step =>
              step.description.toLowerCase().includes(consKeyword)
            )
          );
      }
    });
  }

  /**
   * Realiza una búsqueda y muestra los resultados formateados en la consola.
   * Si no se encuentran resultados, muestra un mensaje de advertencia.
   * @param filt - El criterio de filtrado a utilizar ({@link Filter}).
   * @param keyword - La palabra clave a buscar.
   */
  printSearch(filt: Filter, keyword: string): void {
    const results = this.search(filt, keyword);
    if (results.length === 0) {
      console.log("No results found");
    } else {
      console.table(results.map(chef => chef.name));
    }
  }
}

/**
 * Representa a un Chef profesional o creador de recetas.
 */
export class Chef {
  /**
   * Crea una instancia de un Chef.
   * @param name - Nombre del chef.
   * @param followers - Número de seguidores del chef.
   * @param recipes - El libro de recetas ({@link RecipeBook}) asociado al chef.
   */
  constructor(
    public name: string, 
    public followers: number,
    public recipes: RecipeBook
  ) {}
  
  /**
   * Imprime en consola la información básica del chef y las recetas de su libro.
   */
  printInfo(): void {
    console.log(`Chef name: ${this.name}\n`);
    console.log(`Number of followers: ${this.followers}\n`);
    this.recipes.printInfo();
  }
}

/**
 * Representa una colección o libro de recetas asociadas normalmente a un chef.
 */
export class RecipeBook {
  /**
   * Crea una instancia de un libro de recetas.
   * @param archive - Array opcional de recetas para inicializar el libro. Por defecto es un array vacío.
   */
  constructor(public archive: Recipe[] = []) {}
  
  /**
   * Añade una nueva receta al libro.
   * @param recipe - El objeto {@link Recipe} que se va a añadir.
   */
  addRecipe(recipe: Recipe): void {
    this.archive.push(recipe);
  }

  /**
   * Imprime en consola la información de todas las recetas contenidas en el libro.
   */
  printInfo(): void {
    this.archive.forEach(item => {
      item.printInfo();
    });
  }
}

/**
 * Representa una receta individual y concreta. Implementa la interfaz {@link RecipeData}.
 */
export class Recipe implements RecipeData {
  /**
   * Crea una instancia de una receta.
   * @param name - Nombre descriptivo de la receta.
   * @param date - Fecha en la que se publica o crea la receta.
   * @param steps - Array opcional de pasos ({@link Step}) para elaborar la receta.
   */
  constructor(
    public name: string,
    public date: Date,
    public steps: Step[] = []
  ) {}

  /**
   * Añade un nuevo paso de elaboración a la receta.
   * @param desc - Descripción textual del paso a realizar.
   * @param durat - Duración estimada en segundos.
   * @param lab - Etiqueta o identificador numérico del paso.
   * @param optional - Indica si el paso es opcional.
   * @param times - Número de veces que se ha completado.
   */
  addStep(desc: string, durat: number, lab: number, optional: boolean, times: number): void {
    // Creamos un nuevo paso con las especificaciones introducidas
    let newStep: Step = {
      description: desc,
      duration: durat, // En segundos
      label: lab,
      optionalStep: optional,
      timesCompleted: times,
    }

    this.steps.push(newStep);
  }

  /**
   * Muestra en consola la información completa de la receta, incluyendo sus pasos,
   * tiempos mínimo/máximo de elaboración y cantidad de pasos totales.
   */
  printInfo(): void {
    console.log(`Recipe name: ${this.name}\n`);
    console.log(`Year of publication: ${this.date.getFullYear()}\n`);    
    console.table(this.steps);
    const totalTime = this.recipeTotalTime();
    console.log(`Tiempo total de elaboración min${totalTime[0]} - max${totalTime[1]}`);
    console.log(`Número total de pasos: ${this.stepsNumber()}` )
  }

  /**
   * Obtiene la cantidad total de pasos definidos en la receta.
   * @returns El número de elementos en el array de pasos.
   */
  stepsNumber(): number {
    return this.steps.length;
  }

  /**
   * Calcula el tiempo total de elaboración de la receta, proporcionando un rango entre el tiempo mínimo 
   * (excluyendo pasos opcionales) y el tiempo máximo (incluyendo todos los pasos).
   * @returns Una tupla (array) con dos números: `[tiempoMinimo, tiempoMaximo]`, calculados en segundos.
   */
  recipeTotalTime(): number[] {
    let minTime = 0;
    let maxTime = 0;

    this.steps.forEach(step => {
      maxTime += step.duration;

      if (!step.optionalStep) {
        minTime += step.duration;
      }
    });

    return [minTime, maxTime];
  }
}