const assert = require('assert');
const { createBoard, placeCoin } = require("../othello")
const { printBoardOnCmd, printBoardOnCmd2 } = require("../utils/utils");
const { describe } = require('test');

const players = {
  player1: { name: "player1", symbol: "b" },
  player2: { name: "player2", symbol: "w" },
}

const assertCoinPlacement = (board, placements) => {
  const o = Object.fromEntries(placements.map(x => [x[0].join("_"), x[1]]))

  board.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      const key = `${rowIdx}_${cellIdx}`
      if (o[key]) {
        assert.equal(o[key], board[rowIdx][cellIdx])
      } else {
        assert.equal(board[rowIdx][cellIdx], undefined)
      }
    })
  })
}

describe("Othello core", () => {
  it("should create board and put initial coins at correct place", () => {
    const board = createBoard({ players })

    assertCoinPlacement(board, [
      [[3, 3], "w"],
      [[3, 4], "b"],
      [[4, 4], "w"],
      [[4, 3], "b"],
    ])
  })

  describe("Moves", () => {
    describe("Horizontal", () => {
      it("should flank the white coin when black coin is placed on left of it", () => {
        const board = createBoard({ players });
        const result = placeCoin({ board, player: players.player1 }, [3, 2])

        printBoardOnCmd2(board, result)

        assertCoinPlacement(result, [
          [[3, 2], "b"],
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 4], "w"],
          [[4, 3], "b"],
        ])
      })

      it("should flank the white coin when black coin is placed on right of it", () => {
        const board = createBoard({ players });
        const result = placeCoin({ board, player: players.player1 }, [4, 5])

        printBoardOnCmd2(board, result)

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
        const board = createBoard({ players });
        const result = placeCoin({ board, player: players.player1 }, [2, 3])

        printBoardOnCmd2(board, result)

        assertCoinPlacement(result, [
          [[2, 3], "b"],
          [[3, 3], "b"],
          [[3, 4], "b"],
          [[4, 4], "w"],
          [[4, 3], "b"],
        ])
      })

      it("should flank the white coin when black coin is placed on bottom of it", () => {
        const board = createBoard({ players });
        const result = placeCoin({ board, player: players.player1 }, [5, 4])

        printBoardOnCmd2(board, result)

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
        const board = createBoard({ players });
        const result1 = placeCoin({ board, player: players.player1 }, [5, 5])
        const result2 = placeCoin({ board: result1, player: players.player1 }, [2, 2])

        printBoardOnCmd2(board, result1, result2)

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
        const board = createBoard({ players });
        const result1 = placeCoin({ board, player: players.player2 }, [5, 2])
        const result2 = placeCoin({ board: result1, player: players.player2 }, [2, 5])

        printBoardOnCmd2(board, result1, result2)

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
        const board = createBoard({ players });
        const result1 = placeCoin({ board, player: players.player1 }, [2, 2])
        const result2 = placeCoin({ board: result1, player: players.player1 }, [5, 5])

        printBoardOnCmd2(board, result1, result2)

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
        const board = createBoard({ players });
        const result1 = placeCoin({ board, player: players.player2 }, [2, 5])
        const result2 = placeCoin({ board: result1, player: players.player2 }, [5, 2])

        printBoardOnCmd2(board, result1, result2)

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
})
