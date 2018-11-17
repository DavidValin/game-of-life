/**
 *  Conway's Game of life
 * ------------------------------------------------------------------
 *  By David Valin <hola@davidvalin.com>
 */
class Grid {
  state:Array<Array<GridCell>> // matrix

  constructor(initialState:Array<Array<GridCell>>) {
    this.state = initialState;
  }

  /**
   * Applies rules to the grid and returns a new grid
   */
  applyRules(): void {
    console.log(`\n`);
    let livingNeighbours;

    for(let y=0; y <= this.state.length-1; y++) {
      for(let x=0; x <= this.state[y].length-1; x++) {
        // We got a cell position here
        livingNeighbours = this.getLivingNeighbours(x, y);

        /**
         * Rule 1
         *  Any live cell with fewer than two live neighbors dies, as if by underpopulation.
         */
        if (livingNeighbours < 2) {
          this.state[y][x].state = 0;
          this.state[y][x].nextGenerationState = "dies";
          this.state[y][x].nextGenerationMutationReason = "underpopulation";
        }

        /**
         * Rule 2
         *  Any live cell with two or three live neighbors lives on to the next generation.
         */
        if (livingNeighbours == 2 || livingNeighbours == 3) {
          this.state[y][x].state = 1;
          this.state[y][x].nextGenerationState = "lives";
          this.state[y][x].nextGenerationMutationReason = null;
        }
        
        /**
         * Apply Rule 3
         *  Any live cell with more than three live neighbors dies, as if by overpopulation.
         */
        if (livingNeighbours > 3) {
          this.state[y][x].state = 0;
          this.state[y][x].nextGenerationState = "dies";
          this.state[y][x].nextGenerationMutationReason = "overpopulation";
        }

        /**
         * Apply Rule 4
         *  Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
         */
        if (livingNeighbours === 3) {
          this.state[y][x].state = 1;
          this.state[y][x].nextGenerationState = "lives";
          this.state[y][x].nextGenerationMutationReason = "reproduction";
        }
      }
    }
  }


  /**
   * Retrieves the number of neighbours for a specific cell
   */
  getLivingNeighbours(x:number, y:number) {
    // top left corner (x-1, y-1)
    const topLeftNeighbours = this.getCellLivingState(x-1, y-1);
    // top (x, y-1)
    const topNeighbours = this.getCellLivingState(x, y-1);
    // top right corner (x+1, y-1)
    const topRightNeighbours = this.getCellLivingState(x+1, y-1);
    // left (x-1, y)
    const leftNeighbours = this.getCellLivingState(x-1, y);
    // right (x+1, y)
    const rightNeighbours = this.getCellLivingState(x+1, y);
    // bottom left corner (x-1, y+1)
    const bottomLeftNeighbours = this.getCellLivingState(x-1, y+1);
    // bottom (x, y+1)
    const bottomNeighbours = this.getCellLivingState(x, y+1);
    // bottom right corner (x+1, y+1)
    const bottomRightNeighbours = this.getCellLivingState(x+1, y+1);

    let nNeighbours = 0;
    nNeighbours += (
      topLeftNeighbours +
      topNeighbours +
      topRightNeighbours +
      leftNeighbours +
      rightNeighbours +
      bottomLeftNeighbours +
      bottomNeighbours +
      bottomRightNeighbours
    );
    // process.stdout.write(`\n ---> x: ${x}\ty: ${y}\t\t  -> Total ${nNeighbours} neighbours\n`);
    return nNeighbours;
  }

  getCellLivingState(x:number, y:number) {
    const livingState = (this.state[y] && this.state[y][x] ? this.state[y][x].state : 0);
    // process.stdout.write(`\n -> x: ${x}\ty: ${y}\t\t -> ${livingState===1 ? 'LIVING' : 'death'}`);
    return livingState;
  }

  /**
   * Shows the state of the Grid
   */
  showState() {
    for(let row=0; row<=this.state.length-1; row++) {
      process.stdout.write(`[`);
      for(let column=0; column<=this.state[row].length-1; column++) {
        if (column>0) { process.stdout.write(`, `) }
        process.stdout.write(`${this.state[row][column].state === 1 ? '@' : ' '}`);
      }
      process.stdout.write(`]\n`);
    }
  }
}

/**
 * Grid Cell
 */
class GridCell {
  state:                          0|1
  nextGenerationState:            "lives"           |    "dies" | null = null
  nextGenerationMutationReason:   "underpopulation" |    "overpopulation"  |   "reproduction" | null = null

  constructor(state:0|1) {
    this.state = state;
  }
}

// Sample case: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
const matrix = new Grid([
  [new GridCell(0), new GridCell(0), new GridCell(0), new GridCell(0), new GridCell(0)],
  [new GridCell(0), new GridCell(0), new GridCell(1), new GridCell(0), new GridCell(0)],
  [new GridCell(0), new GridCell(1), new GridCell(0), new GridCell(1), new GridCell(0)],
  [new GridCell(0), new GridCell(0), new GridCell(1), new GridCell(0), new GridCell(0)],
  [new GridCell(0), new GridCell(0), new GridCell(0), new GridCell(0), new GridCell(0)]
]);

setInterval(() => {
  matrix.showState();
  matrix.applyRules();
}, 1000);