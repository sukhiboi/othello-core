import { createBoard, findWinner, isInvalidTurn, placeCoin } from "../lib/othello"
import { Board, Coin, CoinPlacement, Player } from "../lib/types"

const player1: Player = { symbol: "b" }
const player2: Player = { symbol: "w" }

const assertCoinPlacement = (board: Board, placements: [CoinPlacement, Coin][], size: number = 8) => {
  const o = Object.fromEntries(placements.map(x => [x[0].join("_"), x[1]]))

  board.places.forEach((row, rowIdx) => {
    row.forEach((_, cellIdx) => {
      const key = `${rowIdx}_${cellIdx}`
      if (o[key]) {
        expect(board.places[rowIdx][cellIdx]).toBe(o[key])
      } else {
        expect(board.places[rowIdx][cellIdx]).toBeUndefined()
      }
    })
  })

  expect(board.size).toBe(size);
}

describe("Othello core", () => {
  let board: Board;

  beforeEach(() => {
    board = createBoard(8, [player1, player2])
  })

  describe("creteBoard", () => {
    it("should create board and put initial coins at correct place", () => {
      assertCoinPlacement(board, [
        [[3, 3], "w"],
        [[3, 4], "b"],
        [[4, 4], "w"],
        [[4, 3], "b"],
      ])
    })
  })

  describe("isInvalidTurn", () => {
    it("should return true when the coin is already place on give cell placement", () => {
      expect(isInvalidTurn(board, [3, 3])).toBeTruthy()
    })

    it("should return false when given place is empty", () => {
      expect(isInvalidTurn(board, [3, 7])).toBeFalsy()
    })
  })

  describe("placeCoin", () => {
    describe("Horizontal", () => {
      it("should flank the white coin when black coin is placed on left of it", () => {
        const result = placeCoin({ board, player: player1 }, [3, 2])

        assertCoinPlacement(result, [
          [[3, 2], "b"],
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 4], "w"],
          [[4, 3], "b"],
        ])
      })

      it("should flank the white coin when black coin is placed on right of it", () => {
        const result = placeCoin({ board, player: player1 }, [4, 5])

        assertCoinPlacement(result, [
          [[4, 5], "b"],
          [[3, 3], "w"],
          [[3, 4], "b"],
          [[4, 4], "b"],
          [[4, 3], "b"],
        ])
      })
    })

    describe("Vertical", () => {
      it("should flank the white coin when black coin is placed on top of it", () => {
        const result = placeCoin({ board, player: player1 }, [2, 3])

        assertCoinPlacement(result, [
          [[2, 3], "b"],
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 4], "w"],
          [[4, 3], "b"],
        ])
      })

      it("should flank the white coin when black coin is placed on bottom of it", () => {
        const result = placeCoin({ board, player: player1 }, [5, 4])

        assertCoinPlacement(result, [
          [[5, 4], "b"],
          [[3, 3], "w"],
          [[3, 4], "b"],
          [[4, 4], "b"],
          [[4, 3], "b"],
        ])
      })
    })

    describe("Diagonally", () => {
      it("should flank all coins top-right to bottom-left", () => {
        const result1 = placeCoin({ board, player: player1 }, [5, 5])
        const result2 = placeCoin({ board: result1, player: player1 }, [2, 2])

        assertCoinPlacement(result2, [
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 3], "b"],
          [[4, 4], "b"],
          [[2, 2], "b"],
          [[5, 5], "b"]
        ])
      })

      it("should flank all coins top-left to bottom-right", () => {
        const result1 = placeCoin({ board, player: player2 }, [5, 2])
        const result2 = placeCoin({ board: result1, player: player2 }, [2, 5])

        assertCoinPlacement(result2, [
          [[3, 3], "w"],
          [[3, 4], "w"],
          [[4, 3], "w"],
          [[4, 4], "w"],
          [[2, 5], "w"],
          [[5, 2], "w"]
        ])
      })

      it("should flank all coins bottom-right to top-left", () => {
        const result1 = placeCoin({ board, player: player1 }, [2, 2])
        const result2 = placeCoin({ board: result1, player: player1 }, [5, 5])

        assertCoinPlacement(result2, [
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 3], "b"],
          [[4, 4], "b"],
          [[2, 2], "b"],
          [[5, 5], "b"]
        ])
      })

      it("should flank all coins bottom-left to top-right", () => {
        const result1 = placeCoin({ board, player: player2 }, [2, 5])
        const result2 = placeCoin({ board: result1, player: player2 }, [5, 2])

        assertCoinPlacement(result2, [
          [[3, 3], "w"],
          [[3, 4], "w"],
          [[4, 3], "w"],
          [[4, 4], "w"],
          [[2, 5], "w"],
          [[5, 2], "w"]
        ])
      })
    })
  })

  describe("findWinner", () => {
    it("should return player1 when black coins count is more than white coins coint", () => {
      let tempBoard = board;

      Array.from({ length: 8 }).map((_, rowIdx) => {
        return Array.from({ length: 8 }).map((_, cellIdx) => {
          if (rowIdx <= 5 && cellIdx <= 5) {
            tempBoard = placeCoin({ board: tempBoard, player: player1 }, [rowIdx, cellIdx])
          } else {
            tempBoard = placeCoin({ board: tempBoard, player: player2 }, [rowIdx, cellIdx])
          }
        })
      })

      expect(findWinner(tempBoard, [player1, player2])).toStrictEqual([{ symbol: "w" }])
    })

    it("should return player2 when white coins count is more than black coins coint", () => {
      let tempBoard = board;

      Array.from({ length: 8 }).map((_, rowIdx) => {
        return Array.from({ length: 8 }).map((_, cellIdx) => {
          if (rowIdx <= 5 && cellIdx <= 5) {
            tempBoard = placeCoin({ board: tempBoard, player: player2 }, [rowIdx, cellIdx])
          } else {
            tempBoard = placeCoin({ board: tempBoard, player: player1 }, [rowIdx, cellIdx])
          }
        })
      })

      expect(findWinner(tempBoard, [player1, player2])).toStrictEqual([{ symbol: "b" }])
    })

    it("should return player 1 and player2 when white coins count and black coins coint are same", () => {
      let tempBoard = board;

      Array.from({ length: 8 }).map((_, rowIdx) => {
        return Array.from({ length: 8 }).map((_, cellIdx) => {
          if (rowIdx <= 3 && cellIdx <= 8) {
            tempBoard = placeCoin({ board: tempBoard, player: player2 }, [rowIdx, cellIdx])
          } else {
            tempBoard = placeCoin({ board: tempBoard, player: player1 }, [rowIdx, cellIdx])
          }
        })
      })

      expect(findWinner(tempBoard, [player1, player2])).toStrictEqual([{ symbol: "b" }, { symbol: "w" }])
    })
  })
})
