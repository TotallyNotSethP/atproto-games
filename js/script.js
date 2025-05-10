import { Chess, BLACK } from 'chess.js'
// import { AtpAgent } from '@atproto/api'

// const agent = new AtpAgent({ service: 'https://bsky.social' })

let board = null;
const game = new Chess();

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.isGameOver()) return false

    // do not pick up pieces if it's not our turn
    if (game.turn() === BLACK) return false

    // do not pick up pieces if the piece has no valid moves
    // if (game.moves({square: source}).length === 0) return false

    // only pick up pieces for White
    if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
    const possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) return

    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx])
    board.position(game.fen())
}

function onDrop (source, target) {
    // see if the move is legal
    try {
        game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
    } catch {
        return 'snapback'
    }

    // make random legal move for black
    window.setTimeout(makeRandomMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = Chessboard('myBoard', config)