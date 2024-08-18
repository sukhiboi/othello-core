const printBoardOnCmd = (board) => {
  board.forEach(row => {
    console.log(row.map(c => c === undefined ? "-" : c).join(" "))
  })
};

module.exports = { printBoardOnCmd };
