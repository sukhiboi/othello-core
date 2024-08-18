const BOARD_SIZE = 8;

const createBoard = ({ players: { player1, player2 } }) => {
  const board = [];

  for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx++) {
    const row = [];
    for (let cellIdx = 0; cellIdx < BOARD_SIZE; cellIdx++) {
      row[cellIdx] = undefined;
    }
    board[rowIdx] = row;
  }

  const initialPlacements = [
    [3, 4],
    [3, 3],
    [4, 3],
    [4, 4]
  ]

  initialPlacements.forEach(([x, y], i) => {
    board[x][y] = i % 2 == 0 ? player1.symbol : player2.symbol
  })

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

const computeCoinsToChange = (coin, nextSameCoint, { x, y }) => {
  let numberOfCoins = 0
  if (x > 0 && y > 0) {
    numberOfCoins = Math.max(coin[0] - 1 + nextSameCoint.rowIdx, coin[1] - 1 + nextSameCoint.cellIdx)
  } else {
    numberOfCoins = Math.max(nextSameCoint.rowIdx - 1 - coin[0], nextSameCoint.cellIdx - 1 - coin[1])
  }

  return Array.from({ length: numberOfCoins }).reduce((coins, _) => {
    const lastCoin = coins[coins.length - 1];
    return [...coins, [lastCoin[0] + x, lastCoin[1] + y]];
  }, [[coin[0] + x, coin[1] + y]])
}

const highEndCond = ([rowIdx, cellIdx]) => {
  return rowIdx === 8 || cellIdx === 8
}

const lowEndCond = ([rowIdx, cellIdx]) => {
  return rowIdx < 0 || cellIdx < 0
}

const updateCoins = (board, coin, { x, y }, symbol) => {
  if (highEndCond([coin[0] + x, coin[1] + y])) return board;
  if (lowEndCond([coin[0] + x, coin[1] + y])) return board;

  let nextSameCoin = undefined
  let currentSearchPlace = [coin[0] + x, coin[1] + y];


  while (!highEndCond(currentSearchPlace) && !lowEndCond(currentSearchPlace)) {
    if (board[currentSearchPlace[0]][currentSearchPlace[1]] === symbol) {
      if (currentSearchPlace[0] - x === coin[0] && currentSearchPlace[1] - y === coin[1]) { break; }
      nextSameCoin = { rowIdx: currentSearchPlace[0], cellIdx: currentSearchPlace[1] };
      break;
    }
    if (board[currentSearchPlace[0]][currentSearchPlace[1]] === undefined) break;
    currentSearchPlace = [currentSearchPlace[0] + x, currentSearchPlace[1] + y]
  }

  if (nextSameCoin === undefined) return board;

  computeCoinsToChange(coin, nextSameCoin, { x, y }).forEach(coin1 => {
    board[coin1[0]][coin1[1]] = symbol;
  })

  return board;
}

const placeCoin = ({ board, player: { symbol } }, coin) => {
  board[coin[0]][coin[1]] = symbol;
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

module.exports = { createBoard, isInvalidTurn, areAllCoinsUsed, placeCoin, findWinner }
