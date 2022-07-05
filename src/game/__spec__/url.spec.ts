import * as R from 'ramda'

import { customDecodeBoard, customEncodeBoard, __test } from '../url'
import { getRandomNumberGenerator, randomInt } from '../../util/random'

const {
  repackageBits
} = __test

describe('custom encoding for lexica boards', () => {
  const englishAlphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'qu', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z'
  ]
  const japaneseAlphabet = [
    'む', 'め', 'も', 'ゃ', 'や', 'ゅ', 'ゆ', 'ょ',
    'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'ゎ', 'わ',
    'ゐ', 'ゑ', 'を', 'ん', 'ゔ', '〜', 'ぁ', 'あ',
    'ぃ', 'い', 'ぅ', 'う', 'ぇ', 'え', 'ぉ', 'お',
    'か', 'が', 'き', 'ぎ', 'く', 'ぐ', 'け', 'げ',
    'こ', 'ご', 'さ', 'ざ', 'し', 'じ', 'す', 'ず',
    'せ', 'ぜ', 'そ', 'ぞ', 'た', 'だ', 'ち', 'ぢ',
    'っ', 'つ', 'づ', 'て', 'で', 'と', 'ど', 'な',
    'に', 'ぬ', 'ね', 'の', 'は', 'ば', 'ぱ', 'ひ',
    'び', 'ぴ', 'ふ', 'ぶ', 'ぷ', 'へ', 'べ', 'ぺ',
    'ほ', 'ぼ', 'ー', 'ぽ', 'ま', 'み'
  ]
  describe('#repackageBits', () => {
    it('can take a 5 bit number, repackaging it into a 6 bit number', () => {
      const result = repackageBits([5], 5, 6)
      expect(result).toEqual([10])
    })
    it('can repackage two 5 bit numbers into a list of 6 bit numbers', () => {
      const result = repackageBits([0, 1], 5, 6)
      expect(result).toEqual([0, 4])
    })
    it('can take a 6 bit numbe,r repackaging it into a 5 bit number', () => {
      const result = repackageBits([10], 6, 5)
      expect(result).toEqual([5, 0])
    })
  })
  
  describe('#customEncodeBoard', () => {
    it('can succinctly encode a board with a basic alphabet', () => {
      const board = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'l', 'm', 'n', 'o'
      ]

      const result = customEncodeBoard(board, englishAlphabet)
      expect(result).toEqual('04gO5ct2lbmNHw')
    })
    it('can verbosely encode a board with a complex alphabet', () => {
      const board = japaneseAlphabet.slice(0, 16)
      const result = customEncodeBoard(board, japaneseAlphabet)
      expect(result).toEqual('wgoke95zhV4ClbCjpQY')
    })
  })
  describe('#customDecodeBoard', () => {
    it('can successfully decode a board with a basic alphabet', () => {
      const expected = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'l', 'm', 'n', 'o'
      ]
      const result = customDecodeBoard('04gO5ct2lbmNHw', englishAlphabet)
      expect(result).toEqual(expected)
    })
    it('can successfully decode a board with a complex alphabet', () => {
      const expected = japaneseAlphabet.slice(0, 16)
      const result = customDecodeBoard('wgoke95zhV4ClbCjpQY', japaneseAlphabet)
      expect(result).toEqual(expected)
    })
  })
  describe('randomized testing', () => {
    const seed = `${Date.now()}`
    const rng = getRandomNumberGenerator(seed)

    const getTestMatrix = (alphabet: string[]) => R.times(() => {
      const alphabetLength = alphabet.length
      const callCountPreTest = rng.callCount
      const totalBoardLength = 6*6
      const board = R.times(
        () => alphabet[randomInt({ max: alphabetLength, wholeNumber: true, generator: rng })],
        totalBoardLength
      )
      return [seed, callCountPreTest, ...board] as [seed: string, callCount: number, ...board: string[]]
    }, 100)

    const englishTestMatrix = getTestMatrix(englishAlphabet)
    const japaneseTestMatrix = getTestMatrix(japaneseAlphabet)

    // should allow tests to be repeatable because we're using a seeded generator with a known state
    // If you see something weird, make a generator with the same seed, and call it until it's callCount
    // is equal to what is printed in the failed test, then you can re-create the board that caused the
    // error
    test.each(englishTestMatrix)(
      'test english alphabet. RNG seed: %s, RNG call count: %i',
      (_: any, __: any, ...board: string[]) => {
        const encodedBoard = customEncodeBoard(board, englishAlphabet)
        const result = customDecodeBoard(encodedBoard, englishAlphabet)
        expect(result).toEqual(board)
      }
    )

    test.each(japaneseTestMatrix)(
      'test japanese alphabet. RNG seed: %s, RNG call count: %i',
      (_: any, __: any, ...board: string[]) => {
        const encodedBoard = customEncodeBoard(board, japaneseAlphabet)
        const result = customDecodeBoard(encodedBoard, japaneseAlphabet)
        expect(result).toEqual(board)
      }
    )

  })
})
