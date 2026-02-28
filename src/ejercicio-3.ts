export enum Filter {
  CHEFS = 'CHEFS',
  RECIPES = 'RECIPES',
  STEPS = 'STEPS'
}

export interface RecipeData {
  name: string;
  date: Date;
  steps: Step[];
}

export interface Step {
  description: string;
  duration: number; //En segundos
  label: number;
  optionalStep: boolean;
  timesCompleted: number;
}

export class RecipesArchive {
  constructor(public archive: Chef[] = []) {}

  addChef(chef: Chef): void {
    this.archive.push(chef);
  }

  search(filt: Filter, keyword: string) {
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

  printSearch(filt: Filter, keyword: string) {
    const results = this.search(filt, keyword);
    if (results.length === 0) {
      console.log("No results found");
    } else {
      console.table(results.map(chef => chef.name));
    }
  }

}

export class Chef {
  constructor(public name: string, public followers: number,
              public recipes: RecipeBook) {}
  
  printInfo(): void {
    console.log(`Chef name: ${this.name}\n`);
    console.log(`Number of followers: ${this.followers}\n`);
    this.recipes.printInfo();
  }
  
}

export class RecipeBook {
  constructor(public archive: Recipe[] = []) {}
  
  addRecipe(recipe: Recipe): void {
    this.archive.push(recipe);
  }

  printInfo(): void {
    this.archive.forEach(item => {
      item.printInfo();
    });
  }

}

export class Recipe implements RecipeData {
  constructor(public name: string,
              public date: Date,
              public steps: Step[] = []) {}

  addStep(desc: string, durat: number, lab: number,
          optional: boolean, times: number): void {
    //Creamos un nuevo paso con las especificaciones introducidas
    let newStep: Step = {
      description: desc,
      duration: durat, //En segundos
      label: lab,
      optionalStep: optional,
      timesCompleted: times,
    }

    this.steps.push(newStep);
  }

  printInfo(): void {
    console.log(`Recipe name: ${this.name}\n`);
    console.log(`Year of publication: ${this.date.getFullYear()}\n`);    
    console.table(this.steps);
    const totalTime = this.recipeTotalTime();
    console.log(`Tiempo total de elaboración min${totalTime[0]} - max${totalTime[1]}`);
    console.log(`Número total de pasos: ${this.stepsNumber()}` )
  }

  stepsNumber(): number {
    return this.steps.length;
  }

  recipeTotalTime() {
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