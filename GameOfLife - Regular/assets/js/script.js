const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = Math.floor((screen.width*.95)/10)*10;
canvas.height = Math.floor((screen.height*.95)/10)*10;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    console.log(fps);
    refreshLoop();
  });
}

refreshLoop();


function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
        .map(() => Math.floor(Math.random()*2))
        );
    
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
    console.log(`Actual grid : ${grid}`);
    grid = nextGen(grid);
    console.log(`Next grid : ${grid}`);
    render(grid);
    requestAnimationFrame(update);
}

function nextGen(grid) {
    const nextGen = grid.map(arr => [...arr]);

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid [col][row];
            let numNeighbors = 0;
            for (let i = -1; i < 2; i++){ // Boucle sur les cellules voisines (x)
                for (let j = -1; j < 2; j++){ // Boucle sur les cellules voisines (y)
                    if (i === 0 && j === 0) continue; // Si la cellule courante est la cellule centrale, on passe à la suivante
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if (x_cell >= 0 && y_cell >= 0  && x_cell < COLS && y_cell < ROWS) { // Si la cellule est dans le tableau (gère les bords)
                        const currentNeighbor = grid[col + i][row + j]; // On récupère la cellule voisine
                        numNeighbors += currentNeighbor; // On compte le nombre de cellules voisines
                    }

                }
            }

            //Règles du jeu :
            if (cell === 1 && numNeighbors < 2 ) { // Si la cellule est vivante et qu'il n'y a pas 2 cellules voisines, elle meurt
                nextGen[col][row] = 0; // La cellule meurt
            } else if (cell === 1 && numNeighbors > 3) { // Si la cellule est morte et qu'il y a plus de 3 cellules voisines, elle meurt
                nextGen[col][row] = 0; // La cellule meurt
            } else if (cell === 0 && numNeighbors === 3) { // Si la cellule est morte et qu'il y a 3 cellules voisines, elle nait
                nextGen[col][row] = 1; // La cellule nait
            }

        }
    }  
    return nextGen; 
}

function render(grid){
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid [col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution); // x, y, width, height
            ctx.fillStyle = cell ? '#000' : '#fff';
            ctx.fill()
        }
    }
}