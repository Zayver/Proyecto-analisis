import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { Observable, min, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpuService {

  private maxDepth = 0
  private maxPlayer = ""
  private minPlayer = ""

  private readonly dif = [
    {
      name: "Dummy",
      depth: 0
    },
    {
      name: "Easy",
      depth: 1
    },
    {
      name: "Medium",
      depth: 3
    },
    {
      name: "Hard",
      depth: 5
    },
    {
      name: "Impossible",
      depth: 500
    }
  ]

  readonly difName = [
    "Dummy", "Easy", "Medium", "Hard", "Impossible"
  ]

  constructor(private gameS: GameService) { }

  init(dif: string, max: string, min: string) {
    this.maxDepth = this.dif.find((t) => {
      return t.name == dif
    })!.depth
    this.maxPlayer = max
    this.minPlayer = min
  }

  play(squares: string[][]) : [number, number]{
    return this.maxDepth == 0 ? this.dummy(squares): this.ai(squares)
  }

  private dummy(squares: readonly string[][]): [number, number] {
    const size = squares.length
    let boardId = 0
    let id = 0
    do {
      boardId = this.getRand(size)
      id = this.getRand(size ** 2)
    } while (squares[boardId][id] !== null)
    return [boardId, id]
  }

  private getRand(max: number): number {
    return Math.floor(Math.random() * max)
  }

  
  private ai(squares: any[][]): [number, number]{
    let bestEval = Number.NEGATIVE_INFINITY;
    let bestMove: [number, number] = [-1, -1]

    squares.forEach((board, boardId, _) =>{
      board.forEach((value, valueId, _) =>{
        if(value === null){
          squares[boardId][valueId] = this.maxPlayer
          const evaluation = this.minimax(squares, this.maxDepth, false, boardId, valueId)
          squares[boardId][valueId] = null

          if(evaluation > bestEval){
            bestEval = evaluation
            bestMove = [boardId, valueId]
          }
        }
      })
    })
    return bestMove

  }

  private minimax(squares: any[][], depth: number, max: boolean,
    boardId: number, valueId: number): number {

    if(this.gameS.checkWinner(squares, valueId, boardId) !== null
      || depth === 0){
        return this.evaluate(squares, boardId, valueId)
    }

    let evaluate = 0

    if(max){
      evaluate = Number.NEGATIVE_INFINITY
      squares.forEach((board, boardId, _) =>{
        board.forEach((value, valueId, _) =>{
          if(value === null){
            squares[boardId][valueId] = this.maxPlayer
            const evaluation = this.minimax(squares, depth-1, false, boardId, valueId)
            squares[boardId][valueId] = null
            evaluate = Math.max(evaluate, evaluation)
          }
        })
      })
    }
    else{
      evaluate = Number.POSITIVE_INFINITY
      squares.forEach((board, boardId, _) =>{
        board.forEach((value, valueId, _) =>{
          if(value === null){
            squares[boardId][valueId] = this.minPlayer
            const evaluation = this.minimax(squares, depth-1, true, boardId, valueId)
            squares[boardId][valueId] = null
            evaluate = Math.min(evaluate, evaluation)
          }
        })
      })
    }
    return evaluate
  }


  private evaluate(squares: readonly any[][], boardId: number, valueId: number): number{
    const player = this.gameS.checkWinner(squares, valueId, boardId);
    if(player === this.maxPlayer){
      return 10
    }
    else if(player === this.minPlayer){
      return -10
    }
    else{
      return 0
    }
  }


}
