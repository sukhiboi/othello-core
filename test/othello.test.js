const assert = require('assert');
const { createBoard, placeCoin } = require("../othello")
const { printBoardOnCmd } = require("../utils/utils")

const players = {
  player1: { name: "player1", symbol: "b" },
  player2: { name: "player2", symbol: "w" },
}

const assertCoinPlacement = (board, placements) => {
  placements.forEach(([[x, y], symbol]) => {
    assert.equal(board[x][y], symbol)
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
    it("should flank the white coin when black coin is placed on left of it", () => {
      const board = createBoard({ players });
      const result = placeCoin({ board, player: players.player1 }, [3, 2])

      assertCoinPlacement(result, [
        [[3, 2], "b"],
        [[3, 3], "b"],
        [[3, 4], "b"],
        [[4, 4], "w"],
        [[4, 3], "b"],
      ])
    })

    it("should flank the white coin when black coin is placed on top of it", () => {
      const board = createBoard({ players });
      const result = placeCoin({ board, player: players.player1 }, [2, 3])

      assertCoinPlacement(result, [
        [[2, 3], "b"],
        [[3, 3], "b"],
        [[3, 4], "b"],
        [[4, 4], "w"],
        [[4, 3], "b"],
      ])
    })

    it("should flank the white coin when black coin is placed on right of it", () => {
      const board = createBoard({ players });
      const result = placeCoin({ board, player: players.player1 }, [4, 5])

      assertCoinPlacement(result, [
        [[4, 5], "b"],
        [[3, 3], "w"],
        [[3, 4], "b"],
        [[4, 4], "b"],
        [[4, 3], "b"],
      ])
    })

    it("should flank the white coin when black coin is placed on bottom of it", () => {
      const board = createBoard({ players });
      const result = placeCoin({ board, player: players.player1 }, [5, 4])

      assertCoinPlacement(result, [
        [[5, 4], "b"],
        [[3, 3], "w"],
        [[3, 4], "b"],
        [[4, 4], "b"],
        [[4, 3], "b"],
      ])
    })
  })
})
