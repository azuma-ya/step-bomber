export const GameConfig = {
  GRID_SIZE: 8,
  CELL_SIZE: 60,
  GRID_COLOR: 0x000000,
  LINE_WIDTH: 2,
  GRID_COLORS: ["#f0d9b5", "#b58863"],
  PIECE_RADIUS: 20,
  PIECE_COLORS: {
    NONE: 0x000000,
    BLACK: 0x000000,
    WHITE: 0xffffff,
  },
  BOMB: {
    RADIUS: 15,
    COLOR: 0xff0000,
    EXPLOSION_COLOR: 0xff4500,
    ANIMATION_DURATION: 500,
  },
} as const;
