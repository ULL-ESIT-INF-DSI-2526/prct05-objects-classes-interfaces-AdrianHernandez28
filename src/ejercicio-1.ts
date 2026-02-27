/**
 * Enum que define los tipos de filtros posibles para búsquedas
 * en el gestor bibliográfico.
 */
export enum Filter {
  TITLE = 'TITLE',
  AUTHORS = 'AUTHORS',
  DATE = 'DATE',
  EDITORIAL = 'EDITORIAL',
  KEYWORDS = 'KEYWORDS'
}

/**
 * Interfaz que define los elementos mínimos de un artículo bibliográfico.
 */
export interface BibliographicItems {
  title: string;
  authors: string[];
  keywords: string[];
  resume: string;
  publicationDate: Date; 
  pages: number; 
  editorial: string;
}

/**
 * Interfaz adicional para artículos de revistas, que incluyen
 * número de revista y volúmenes.
 */
export interface BibliographicItemsMagazines {
  numberMagazine: number;
  numberVolumes: number;
}

/**
 * Formatea la lista de autores en una cadena separada por comas.
 * @param authors - Lista de autores
 * @returns Cadena con autores separados por coma
 */
export function formatAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  
  return authors.join(', ');
}

/**
 * Clase que representa un artículo bibliográfico genérico.
 * Implementa la interfaz BibliographicItems.
 */
export class BibliographicArticle implements BibliographicItems {
  /**
   * @param title - Título del artículo
   * @param authors - Lista de autores
   * @param keywords - Lista de palabras clave
   * @param resume - Resumen del artículo
   * @param publicationDate - Fecha de publicación
   * @param pages - Número de páginas
   * @param editorial - Editorial del artículo
   */
  constructor(public title: string,
              public authors: string[],
              public keywords: string[],
              public resume: string,
              public publicationDate: Date, 
              public pages: number, 
              public editorial: string) {}

  /**
   * Devuelve la referencia bibliográfica en formato IEEE.
   * @returns Cadena con la referencia IEEE del artículo
   */
  getIEEE() {
    return `${formatAuthors(this.authors)}, "${this.title}," ${this.editorial}` +
            `, pp. ${this.pages}, ${this.publicationDate.getFullYear()}`;
  }
}

/**
 * Clase que representa un artículo de revista.
 * Extiende BibliographicArticle e implementa BibliographicItemsMagazines.
 */
export class Magazine extends BibliographicArticle implements BibliographicItemsMagazines {
  /**
   * @param title - Título de la revista
   * @param authors - Lista de autores
   * @param keywords - Lista de palabras clave
   * @param resume - Resumen del artículo
   * @param publicationDate - Fecha de publicación
   * @param pages - Número de páginas
   * @param editorial - Editorial de la revista
   * @param numberMagazine - Número de la revista
   * @param numberVolumes - Número de volúmenes
   */
  constructor(public title: string,
              public authors: string[],
              public keywords: string[],
              public resume: string,
              public publicationDate: Date, 
              public pages: number, 
              public editorial: string,
              public numberMagazine: number,
              public numberVolumes: number) {
    super(title, authors, keywords, resume, publicationDate, pages, editorial);

  }

  /**
   * Devuelve la referencia bibliográfica en formato IEEE
   * incluyendo número de volúmenes y número de revista.
   * @returns Cadena con la referencia IEEE
   */
  getIEEE() {
    return `${formatAuthors(this.authors)}, "${this.title}," ${this.editorial}, ` +
           `vol. ${this.numberVolumes}, no. ${this.numberMagazine}, ` +
           `pp. ${this.pages}, ${this.publicationDate.getFullYear()}`;
  }
}

/**
 * Clase que representa el archivo bibliográfico completo.
 * Permite almacenar artículos, buscarlos y exportarlos.
 */
export class ArchiveBibliography {
  /** Lista de artículos almacenados */
  public archive: BibliographicArticle[] = [];

  /**
   * Constructor del archivo bibliográfico
   * @param articles - Lista inicial de artículos
   */
  constructor(...articles: BibliographicArticle[]) {
    this.archive = articles;
  }

  /**
   * Añade uno o varios artículos al archivo.
   * @param articles - Artículos a añadir
   */
  addArticles(...articles: BibliographicArticle[]) {
    articles.forEach(item => {
      this.archive.push(item);
    });
  }

    /**
   * Busca artículos en el archivo según un filtro y un valor de búsqueda.
   * @param filt - Tipo de filtro a aplicar
   * @param value - Valor a buscar
   * @returns Array de artículos que coinciden con el filtro
   */
  search(filt: Filter, value: string) {
    const searchValue = value.toLowerCase();
    return this.archive.filter(article => {
      switch(filt) {
        case Filter.TITLE:
          return article.title.toLowerCase().includes(searchValue);
        case Filter.AUTHORS:
          return article.authors.some(auth => auth.toLowerCase().includes(searchValue));
        case Filter.DATE:
          return article.publicationDate.getFullYear()
                 .toString().includes(searchValue);
        case Filter.EDITORIAL:
          return article.editorial.toLowerCase().includes(searchValue);
        case Filter.KEYWORDS:
          return article.keywords.some(key => key.toLowerCase().includes(searchValue));
        default:
          return false;
      }
    });
  }

  
  /**
   * Muestra en consola una lista de artículos en formato tabla.
   * @param results - Array de artículos a mostrar
   */
  printResults(results: BibliographicArticle[]) {
    console.table(results);
  }

  /**
   * Busca artículos y devuelve sus referencias en formato IEEE.
   * @param filt - Tipo de filtro a aplicar
   * @param value - Valor a buscar
   * @returns Array de referencias IEEE de los artículos encontrados
   */
  searchIEEE(filt: Filter, value: string) {
    return this.search(filt, value).map(item => item.getIEEE());
  }

  /**
   * Muestra en consola todos los artículos del archivo en formato tabla.
   */
  print() {
    console.table(this.archive);
  }
}