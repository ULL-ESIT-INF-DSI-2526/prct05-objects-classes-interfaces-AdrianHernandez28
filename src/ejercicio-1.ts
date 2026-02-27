export enum Filter {
  TITLE = 'TITLE',
  AUTHORS = 'AUTHORS',
  DATE = 'DATE',
  EDITORIAL = 'EDITORIAL',
  KEYWORDS = 'KEYWORDS'
}

export interface BibliographicItems {
  title: string;
  authors: string[];
  keywords: string[];
  resume: string;
  publicationDate: Date; 
  pages: number; 
  editorial: string;
}

export interface BibliographicItemsMagazines {
  numberMagazine: number;
  numberVolumes: number;
}

export function formatAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  
  return authors.join(', ');
}

export class BibliographicArticle implements BibliographicItems {
  constructor(public title: string,
              public authors: string[],
              public keywords: string[],
              public resume: string,
              public publicationDate: Date, 
              public pages: number, 
              public editorial: string) {}

  getIEEE() {
    return `${formatAuthors(this.authors)}, "${this.title}," ${this.editorial}` +
            `, pp. ${this.pages}, ${this.publicationDate.getFullYear()}`;
  }
}

export class Magazine extends BibliographicArticle implements BibliographicItemsMagazines {
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

  getIEEE() {
    return `${formatAuthors(this.authors)}, "${this.title}," ${this.editorial}, ` +
           `vol. ${this.numberVolumes}, no. ${this.numberMagazine}, ` +
           `pp. ${this.pages}, ${this.publicationDate.getFullYear()}`;
  }
}

export class ArchiveBibliography {
  public archive: BibliographicArticle[] = [];

  constructor(...articles: BibliographicArticle[]) {
    this.archive = articles;
  }

  addArticles(...articles: BibliographicArticle[]) {
    articles.forEach(item => {
      this.archive.push(item);
    });
  }

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

  printResults(results: BibliographicArticle[]) {
    console.table(results);
  }

  searchIEEE(filt: Filter, value: string) {
    return this.search(filt, value).map(item => item.getIEEE());
  }

  print() {
    console.table(this.archive);
  }
}