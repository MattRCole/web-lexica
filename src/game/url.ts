import * as R from 'ramda'

import { Duration, toSeconds } from 'duration-fns'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { utf8ToB64 } from '../util/base-64'
import { HighestSupportedMinimumVersion } from '../util/compatibility-android'
import { parseURLSearch } from '../util/url'
import { ScoreType } from './score'
import { sort } from './words'

export enum GameParamMap {
  Board = 'b',
  Language = 'l',
  Time = 't',
  Score = 's',
  MinimumWordLength = 'm',
  MinimumVersion = 'mv',
  Version = 'v',
  TimeAttack = 'ta'
}

export const encodeBoard = (board: string[]): string => {
  const stringified = board.join(',')

  return utf8ToB64(stringified).replace(/=+$/, '')
}

export type GetSearchStringArgs = {
  board: string[],
  language: string,
  time: Duration,
  score: ScoreType,
  minimumWordLength: number
  timeAttack?: number
}

export const getSearchString = ({
  board: boardArray,
  language,
  time: duration,
  score,
  minimumWordLength,
  timeAttack
}: GetSearchStringArgs) => {
  const board = encodeBoard(boardArray)
  const time = toSeconds(duration)

  const keyValuePairs: ([string, string | number])[] = [
    [GameParamMap.Board, board],
    [GameParamMap.Language, language],
    [GameParamMap.Time, time],
    [GameParamMap.Score, score],
    [GameParamMap.MinimumWordLength, minimumWordLength],
    [GameParamMap.MinimumVersion, HighestSupportedMinimumVersion],
    [GameParamMap.Version, HighestSupportedMinimumVersion]
  ]

  timeAttack && keyValuePairs.push([GameParamMap.TimeAttack, timeAttack])

  return `${keyValuePairs.map(kv => kv.join('=')).join('&')}`
}

export type GameURLParams = {
  b: string,
  l: string,
  t: string,
  s: ScoreType,
  m: string,
  mv: string,
  v: string,
  ta?: string
}

const parseGameParameters = (urlParams: GameURLParams) => {
  const language = urlParams[GameParamMap.Language]
  const minimumVersion = parseInt(urlParams[GameParamMap.MinimumVersion])
  const timeAttack = urlParams?.ta && parseInt(urlParams.ta)

  return {
    board: urlParams[GameParamMap.Board],
    language,
    time: parseInt(urlParams[GameParamMap.Time]),
    score: urlParams[GameParamMap.Score],
    minimumWordLength: parseInt(urlParams[GameParamMap.MinimumWordLength]),
    minimumVersion,
    version: parseInt(urlParams[GameParamMap.Version]),
    timeAttack
  }
}

export const useGameUrlParameters = () => {
  const location = useLocation()
  return useMemo(() => parseGameParameters(parseURLSearch<GameURLParams>(location.search)), [location.search])
}

const repackageBits = (originalNumbers: number[], originalBits: number, toBits: number = 6): number[] => {
  const totalNumbers = originalNumbers.length
  const totalBits = totalNumbers*originalBits

  const bitmap: boolean[] = []

  for(let i = 0; i < totalNumbers; i++) {
    let currentNumber = originalNumbers[i]
    for (let j = 0; j < originalBits; j++) bitmap.push(false)
    for(let j = originalBits - 1; j >= 0; j--) {
      const shiftedNumber = (currentNumber >>> 1) << 1
      const bitmapIndex = (i*originalBits)+j
      bitmap[bitmapIndex] = shiftedNumber < currentNumber ? true : false
      currentNumber = currentNumber >>> 1
    }
  }

  const totalResultNumbers = Math.ceil(totalBits / toBits)
  const results = R.times(index => {
    const  bitRangeStart = index*toBits
    const  bitRangeEnd = (index+1)*toBits

    let resultNumber = 0

    for (let i = bitRangeStart; i < Math.min(bitRangeEnd, totalBits); i++) {
      const bit = bitmap[i]
      resultNumber = resultNumber << 1
      if (bit) {
        resultNumber = resultNumber | 1
      }
    }

    if (bitRangeEnd > totalBits) {
      resultNumber = resultNumber << (bitRangeEnd - totalBits) // zero-pack the bits
    }
    return resultNumber
  }, totalResultNumbers)
  return results
}

const getMinimumNeededBitsToRepresentNumber = (numberToRepresent: number) => {
  let count = 1
  let shifts = 0
  while(count < numberToRepresent) {
    count = count << 1
    shifts = shifts + 1
  }
  return shifts
}

const customEncodeMap = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8',
  '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
  'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-',
  '_'
]


/**
 * given a board and the letters in a given language, will encode the index of each letter in the board using
 * a url-safe numbering system
 * @param line 
 * @param letters 
 */
export const customEncodeBoard = (line: string[], letters: string[]) => {
  const sortedLetters = sort.alphabetically(letters)
  const indexes = line.map(letter => sortedLetters.indexOf(letter))
  const minBits = getMinimumNeededBitsToRepresentNumber(sortedLetters.length)

  const repackagedIndexes = repackageBits(indexes, minBits)
  return repackagedIndexes.map(index => customEncodeMap[index]).join('')
}

export const __test = {
  repackageBits
}

export const customDecodeBoard = (encodedBoard: string, letters: string[]) => {
  const sortedLetters = sort.alphabetically(letters)

  const minBits = getMinimumNeededBitsToRepresentNumber(sortedLetters.length)
  const encodedIndexes = encodedBoard.split('').map(encodedIndex => customEncodeMap.indexOf(encodedIndex))

  const indexes = repackageBits(encodedIndexes, 6, minBits)
  const letterCount = Math.pow(Math.floor(Math.sqrt(indexes.length)), 2)

  return indexes.map(i => sortedLetters[i]).slice(0, letterCount)
}
