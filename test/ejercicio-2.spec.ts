import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { ConectFour } from '../src/ejercicio-2';

describe('ConectFour', () => {
  let game: ConectFour;
  
  // Variables para guardar las funciones originales y no romper otros tests
  let originalConsoleLog: any;
  let originalRandom: any;
  let logs: string[] = [];

  beforeEach(() => {
    game = new ConectFour();
    
    // 1. Guardamos el estado original
    originalConsoleLog = console.log;
    originalRandom = Math.random;
    
    // 2. Interceptamos console.log para guardar los mensajes en el array 'logs' y silenciar la terminal
    logs = [];
    console.log = (msg: string) => { logs.push(msg); };
  });

  afterEach(() => {
    // Restauramos las funciones originales al terminar cada test
    console.log = originalConsoleLog;
    Math.random = originalRandom;
  });

  describe('Método dropPiece', () => {
    test('debe insertar una ficha correctamente y devolver true', () => {
      expect(game.dropPiece(1, 0)).toBe(true);
      expect(game.board[5][0]).toBe(1); // La ficha cae al fondo (fila 5)
    });

    test('debe devolver false si la columna está llena', () => {
      // Llenamos la columna 0 (6 filas)
      for (let i = 0; i < 6; i++) {
        expect(game.dropPiece(1, 0)).toBe(true);
      }
      // El intento número 7 debe fallar
      expect(game.dropPiece(2, 0)).toBe(false);
    });
  });

  describe('Verificación de victorias (checkWinner)', () => {
    test('debe devolver 0 cuando no hay ganador', () => {
      game.dropPiece(1, 0);
      game.dropPiece(1, 1);
      game.dropPiece(1, 2);
      expect(game.checkWinner()).toBe(0);
    });

    test('debe devolver 1 cuando el Jugador 1 gana horizontalmente', () => {
      game.dropPiece(1, 0);
      game.dropPiece(1, 1);
      game.dropPiece(1, 2);
      game.dropPiece(1, 3);
      expect(game.checkWinner()).toBe(1);
    });

    test('debe devolver 2 cuando el Jugador 2 gana verticalmente', () => {
      game.dropPiece(2, 0);
      game.dropPiece(2, 0);
      game.dropPiece(2, 0);
      game.dropPiece(2, 0);
      expect(game.checkWinner()).toBe(2);
    });
  });

  describe('Flujo del juego (startGame)', () => {
    test('debe gestionar un juego donde el Jugador 1 gana', () => {
      const moves = [0, 1, 0, 1, 0, 1, 0];
      let i = 0;
      
      // Sobrescribimos Math.random manualmente
      Math.random = () => moves[i++] / 7;

      game.startGame();

      // Comprobamos si el mensaje de victoria se guardó en nuestros logs
      expect(logs).toContain('\nEl jugador 1 ha ganado!!\n');
    });

    test('debe gestionar columnas llenas y terminar en empate sin bucles infinitos', () => {
      // Sustituimos temporalmente checkWinner para que devuelva siempre 0 (nadie gana)
      const originalCheckWinner = game.checkWinner;
      game.checkWinner = () => 0;

      // Secuencia para llenar el tablero sin causar un bucle infinito
      const moves = [
        0, 0, 0, 0, 0, 0, // Llena la columna 0
        0,                // Intenta meter en la col 0, falla y pide otro número
        1, 1, 1, 1, 1, 1, // Llena la columna 1
        2, 2, 2, 2, 2, 2, 
        3, 3, 3, 3, 3, 3, 
        4, 4, 4, 4, 4, 4, 
        5, 5, 5, 5, 5, 5, 
        6, 6, 6, 6, 6, 6  // Llena la columna 6 -> Fin del juego
      ];

      let i = 0;
      Math.random = () => moves[i++] / 7;

      game.startGame();

      // Restauramos checkWinner
      game.checkWinner = originalCheckWinner;

      // Verificamos los logs
      expect(logs).toContain('La columna 1 está llena, buscando otra...\n');
      expect(logs).toContain('\nEmpate!');
    });
  });
});