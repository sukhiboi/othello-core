import { Board, Coin, CoinPlacement, DeltaMovement, GameState, Player } from "./types"

const copyBoard = (oldBoard: Board): Board => {
  const places: Board["places"] = Array.from({ length: oldBoard.size }).map((_, rowIdx) => {
    return Array.from({ length: oldBoard.size }).map((_, cellIdx) => {
      return oldBoard.places[rowIdx][cellIdx]
    })
  })

  return { places, size: oldBoard.size };
}

const isInvalidCoinPlacement = ([x, y]: CoinPlacement, boardSize: number): boolean => [
  x < 0,
  y < 0,
  x > boardSize - 1,
  y > boardSize - 1
].some(cond => cond)

const computeCoinsToChange = (currentCoin: CoinPlacement, nextCoin: CoinPlacement, deltaMove: DeltaMovement, boardSize: number): CoinPlacement[] => {
  const points: CoinPlacement[] = [];
  let runningCoin: CoinPlacement = currentCoin;

  while (!isInvalidCoinPlacement(runningCoin, boardSize)) {
    if (runningCoin[0] === nextCoin[0] && runningCoin[1] === nextCoin[1]) break
    points.push(runningCoin);
    runningCoin = [runningCoin[0] + deltaMove[0], runningCoin[1] + deltaMove[1]];
  }

  return points.slice(1);
}

const highEndCond = ([x, y]: CoinPlacement, boardSize: number): boolean => x === boardSize || y === boardSize

const lowEndCond = ([x, y]: CoinPlacement): boolean => x < 0 || y < 0

const updateCoins = (board: Board, coin: CoinPlacement, [x, y]: DeltaMovement, symbol: Player["symbol"]): Board => {
  if (highEndCond([coin[0] + x, coin[1] + y], board.size)) return board;
  if (lowEndCond([coin[0] + x, coin[1] + y])) return board;

  let nextSameCoin: CoinPlacement;
  let currentSearchPlace: CoinPlacement = [coin[0] + x, coin[1] + y];


  while (!highEndCond(currentSearchPlace, board.size) && !lowEndCond(currentSearchPlace)) {
    if (board.places[currentSearchPlace[0]][currentSearchPlace[1]] === symbol) {
      if (currentSearchPlace[0] - x === coin[0] && currentSearchPlace[1] - y === coin[1]) { break; }
      nextSameCoin = [currentSearchPlace[0], currentSearchPlace[1]];
      break;
    }
    if (board.places[currentSearchPlace[0]][currentSearchPlace[1]] === undefined) break;
    currentSearchPlace = [currentSearchPlace[0] + x, currentSearchPlace[1] + y]
  }

  if (nextSameCoin === undefined) return board;

  const coinsToChange = computeCoinsToChange(coin, nextSameCoin, [x, y], board.size)

  coinsToChange.forEach(coin1 => {
    board.places[coin1[0]][coin1[1]] = symbol;
  })

  return board;
}

export const createBoard = (size: number, [{ symbol: player1Symbol }, { symbol: player2Symbol }]: Player[]): Board => {
  const initialPlacements: { [k: string]: Coin } = {
    "3_4": player1Symbol,
    "3_3": player2Symbol,
    "4_3": player1Symbol,
    "4_4": player2Symbol
  }

  const places: Board["places"] = Array.from({ length: size }).map((_, rowIdx) => {
    return Array.from({ length: size }).map((_, cellIdx) => {
      return initialPlacements[`${rowIdx}_${cellIdx}`]
    })
  })

  return { places, size };
}

export const isInvalidTurn = (board: Board, [x, y]: CoinPlacement): boolean => !!board.places[x][y];

export const areAllPositionsFilled = (board: Board): boolean => board.places.every(row => row.every(cell => cell));

export const placeCoin = ({ board, player: { symbol } }: Pick<GameState, "board" | "player">, coin: CoinPlacement): Board => {
  const newBoard = copyBoard(board);
  newBoard.places[coin[0]][coin[1]] = symbol;
  return [
    [0, 1],
    [1, 0],
    [1, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ].reduce((acc, movement: DeltaMovement) => {
    return updateCoins(acc, coin, movement, symbol)
  }, newBoard)
}

export const findWinner = (board: Board, players: Player[]): Player[] => {
  if (!areAllPositionsFilled(board)) return undefined;

  const initialTotal = Object.fromEntries(
    players.map(player => [player.symbol, 0])
  )

  const coinCount = board.places.reduce((total, row) => {
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

  const [player1, player2] = players;

  const player1CoinCount = coinCount[player1.symbol]
  const player2CoinCount = coinCount[player2.symbol]

  if (player1CoinCount === player2CoinCount) return [player1, player2];
  return player1CoinCount > player2CoinCount ? [player1] : [player2];
}
