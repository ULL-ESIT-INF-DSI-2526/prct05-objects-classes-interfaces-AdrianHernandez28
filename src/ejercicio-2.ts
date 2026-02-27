/**
 * Número de columnas del tablero de Conecta 4.
 */
const SIZE = 7;

/**
 * Número de filas del tablero de Conecta 4.
 */
const ROWS = 6;

/**
 * Representa una coordenada en el tablero como una tupla de dos números.
 * El primer valor es la fila (Y) y el segundo es la columna (X).
 */
export type Point = [number, number];

/**
 * Clase que representa y gestiona la lógica de una partida de Conecta 4.
 */
export class ConectFour {
  /** * Array que almacena las coordenadas de todas las fichas colocadas por el jugador 1. 
   */
  accessor player1: Point[] = [];

  /** * Array que almacena las coordenadas de todas las fichas colocadas por el jugador 2. 
   */
  accessor player2: Point[] = [];

  /** * Matriz que representa el tablero de juego (6 filas x 7 columnas).
   * Los valores indican: 0 (vacío), 1 (ficha del jugador 1), 2 (ficha del jugador 2).
   */
  accessor board: number[][] = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];

  /**
   * Crea una nueva instancia del juego Conecta 4 con el tablero vacío.
   */
  constructor() {}

  /**
   * Intenta insertar una ficha en la columna especificada para un jugador determinado.
   * La ficha "caerá" hasta la posición vacía más baja de esa columna.
   * * @param player - El jugador que realiza el movimiento (1 o 2).
   * @param column - El índice de la columna donde se quiere soltar la ficha (0 a SIZE-1).
   * @returns `true` si la ficha se insertó con éxito, o `false` si la columna estaba llena.
   */
  dropPiece(player: 1 | 2, column: number): boolean {
    // Si la fila superior de la columna está ocupada, la columna está llena
    if (this.board[0][column] !== 0) return false;

    // Buscamos la primera fila vacía desde abajo hacia arriba
    for (let i = ROWS - 1; i >= 0; i--) {
      if (this.board[i][column] === 0) {
        this.board[i][column] = player;
        
        if (player === 1) {
          this.player1.push([i, column]);
        } else {
          this.player2.push([i, column]);
        }
        return true; // Ficha insertada con éxito
      }
    }
    return false;
  }

  /**
   * Inicia el bucle principal de una partida automática simulada.
   * Los turnos se alternan, eligiendo columnas de forma aleatoria hasta que
   * un jugador gana o el tablero se llena (empate).
   */
  startGame(): void {
    let turn = 1;
    let movesMade = 0;
    const maxMoves = SIZE * ROWS; // 42 casillas en total

    while (movesMade < maxMoves) {
      const currentPlayer = turn % 2 === 0 ? 2 : 1;
      console.log(`Es el turno del jugador ${currentPlayer}...\n`);

      let column: number;
      let validMove = false;

      // Intentamos tirar hasta que encontremos una columna que no esté llena
      do {
        column = Math.floor(Math.random() * SIZE);
        validMove = this.dropPiece(currentPlayer, column);
        
        if (!validMove) {
            console.log(`La columna ${column + 1} está llena, buscando otra...\n`);
        }
      } while (!validMove);

      console.log(this.board);

      const winner = this.checkWinner();
      if (winner !== 0) {
        console.log(`\nEl jugador ${winner} ha ganado!!\n`);
        return; // Salimos directamente de la función
      }

      turn++;
      movesMade++;
    }

    // Si salimos del bucle while es porque hemos llegado a 42 movimientos sin ganador
    console.log("\nEmpate!");
  }

  /**
   * Comprueba si dentro de un conjunto de puntos existe una secuencia de 4 fichas alineadas.
   * Evalúa las direcciones: horizontal, vertical y las dos diagonales.
   * * @param points - Array con las coordenadas de las fichas de un jugador.
   * @returns `true` si se encuentran 4 fichas alineadas, `false` en caso contrario.
   * @private
   */
  #hasFour(points: Point[]): boolean {
    // Convertimos a Set para que el acceso a elementos sea de complejidad O(1)
    const pointSet = new Set(points.map(p => `${p[0]},${p[1]}`));

    const directions: Point[] = [
      [1, 0],   // → Horizontal
      [0, 1],   // ↓ Vertical
      [1, 1],   // ↘ Diagonal hacia abajo
      [1, -1],  // ↙ Diagonal hacia arriba
    ];

    for (const [x, y] of points) {
      for (const [dx, dy] of directions) {
        let count = 1;

        for (let step: number = 1; step < 4; step++) {
          const next = `${x + dx * step},${y + dy * step}`;

          if (pointSet.has(next)) {
            count++;
          } else {
            break;
          }
        }

        if (count === 4) return true;
      }
    }

    return false;
  }

  /**
   * Verifica el estado actual del tablero para determinar si hay un jugador victorioso.
   * * @returns `1` si ha ganado el jugador 1, `2` si ha ganado el jugador 2, o `0` si aún no hay ganador.
   */
  checkWinner(): number {    
    if (this.player1.length >= 4 && this.#hasFour(this.player1)) return 1;
    if (this.player2.length >= 4 && this.#hasFour(this.player2)) return 2;
    return 0;
  }
}