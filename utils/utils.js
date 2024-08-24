const printBoardOnCmd = (board) => {
  board.forEach(row => {
    console.log(row.map(c => c === undefined ? "-" : c).join(" "))
  })
};

const printBoardOnCmd2 = (...boards) => {

  const spaceBoard = Array.from({ length: 8 }).map(() => {
    return Array.from({ length: 4 }).map(() => " ")
  })

  const newBoards = boards.flatMap(board => {
    return [spaceBoard, board]
  }).slice(1)


  let x = [];

  for (i = 0; i < 8; i++) {
    x[i] = newBoards.flatMap(b => b[i])
  }

  printBoardOnCmd(x)
};

module.exports = { printBoardOnCmd, printBoardOnCmd2 };
