import { Board, Coin } from "../../lib/types";

const printBoardOnCmd = (board: Board["places"]) => {
  let boardString = "";
  board.forEach(row => {
    boardString = boardString + "\n" + row.map(c => c === undefined ? "-" : c).join(" ")
  })
  console.log(boardString)
};

export const printBoardOnCmd2 = (...boards: Board[]) => {
  const spaceBoard = Array.from({ length: 8 }).map(() => {
    return Array.from({ length: 4 }).map(() => " ")
  })

  const newBoards = boards.flatMap(board => {
    return [spaceBoard, board.places]
  }).slice(1)


  let x: Board["places"] = [];

  for (let i = 0; i < 8; i++) {
    x[i] = newBoards.flatMap(b => b[i]) as Coin[]
  }


  printBoardOnCmd(x as Board["places"])
};
