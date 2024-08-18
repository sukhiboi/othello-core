const BOARD_SIZE = 8;

const createBoard = () => {
  const board = [];

  for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx++) {
    const row = [];
    for (let cellIdx = 0; cellIdx < BOARD_SIZE; cellIdx++) {
      row[cellIdx] = undefined;
    }
    board[rowIdx] = row;
  }

  return board;
}

const isInvalidTurn = ({ board }, { rowIdx, cellIdx }) => {
  const invalidConditions = [
    board[rowIdx][cellIdx]
  ];

  return invalidConditions.some(cond => cond)
}

const areAllCoinsUsed = (board) => {
  for (rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx++) {
    for (cellIdx = 0; cellIdx < BOARD_SIZE; cellIdx++) {
      if (board[rowIdx][cellIdx] === undefined) return false
    }
  }

  return true
}

const computeCoinsToChange = ({ rowIdx, cellIdx }, nextSameCoint, { x, y }) => {
  let numberOfCoins = 0
  if (x > 0 && y > 0) {
    numberOfCoins = Math.max(rowIdx - 1 + nextSameCoint.rowIdx, cellIdx - 1 + nextSameCoint.cellIdx)
  } else {
    numberOfCoins = Math.max(nextSameCoint.rowIdx - 1 - rowIdx, nextSameCoint.cellIdx - 1 - cellIdx)
  }

  return Array.from({ length: numberOfCoins }).reduce((coins, _) => {
    const lastCoin = coins[coins.length - 1];
    return [...coins, { rowIdx: lastCoin.rowIdx + x, cellIdx: lastCoin.cellIdx + y }];
  }, [{ rowIdx: rowIdx + x, cellIdx: cellIdx + y }])
}

const highEndCond = ([rowIdx, cellIdx]) => {
  return rowIdx === 8 || cellIdx === 8
}

const lowEndCond = ([rowIdx, cellIdx]) => {
  return rowIdx < 0 || cellIdx < 0
}

const updateCoins = (board, { rowIdx, cellIdx }, { x, y }, symbol) => {
  if (highEndCond([rowIdx + x, cellIdx + y])) return board;
  if (lowEndCond([rowIdx + x, cellIdx + y])) return board;

  let nextSameCoin = undefined
  let currentSearchPlace = [rowIdx + x, cellIdx + y];


  while (!highEndCond(currentSearchPlace) && !lowEndCond(currentSearchPlace)) {
    if (board[currentSearchPlace[0]][currentSearchPlace[1]] === symbol) {
      nextSameCoin = { rowIdx: currentSearchPlace[0], cellIdx: currentSearchPlace[1] };
      break;
    }
    if (board[currentSearchPlace[0]][currentSearchPlace[1]] === undefined) break;
    currentSearchPlace = [currentSearchPlace[0] + x, currentSearchPlace[1] + y]
  }

  if (nextSameCoin === undefined) return board;

  computeCoinsToChange({ rowIdx, cellIdx }, nextSameCoin, { x, y }).forEach(coin => {
    board[coin.rowIdx][coin.cellIdx] = symbol;
  })

  return board;
}

const placeCoin = ({ board, player: { symbol } }, coin) => {
  board[coin.rowIdx][coin.cellIdx] = symbol;
  return [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
  ].reduce((acc, movement) => {
    return updateCoins(acc, coin, movement, symbol)
  }, board)
}

const findWinner = ({ board }, players) => {
  if (!areAllCoinsUsed(board)) return undefined;

  const initialTotal = Object.fromEntries(
    Object.values(players)
      .map(player => player.symbol)
      .map(symbol => ([symbol, 0]))
  )

  const coinCount = board.reduce((total, row) => {
    const rowReduce = row.reduce((rowTotal, cell) => ({
      ...rowTotal,
      [cell]: rowTotal[cell] + 1
    }), initialTotal);

    return Object.fromEntries(
      Object.keys(total)
        .map(symbol => ([
          symbol,
          total[symbol] + rowReduce[symbol]
        ]))
    )
  }, initialTotal)

  const [player1, player2] = Object.values(players);

  const player1CoinCount = coinCount[player1.symbol]
  const player2CoinCount = coinCount[player2.symbol]

  if (player1CoinCount === player2CoinCount) return [player1, player2];
  return player1CoinCount > player2CoinCount ? [player1] : [player2];
}
