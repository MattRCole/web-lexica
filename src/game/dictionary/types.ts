import { Board, Coordinates } from '../board/types'

export enum WorkerRequest {
  ResolveBoardDictionary = 'board-dictionary',
  ResolveBoardHints = 'board-hints'
}

export type ToWorkerMessage = {
  requestType: WorkerRequest,
  info: ResolveBoardDictionary | ResolveBoardHints,
  requestId: string
}

export type ResolveBoardDictionary = {
  board: Board,
  dictionary: string[],
  minWordLength: number,
}

export type FromWorkerMessage = {
  result?: string[] | { [word:string]: Coordinates[] },
  requestId: string,
  error?: any
}

export type ResolveBoardHints = {
  board: Board,
  wordsOnBoard: string[],
}
