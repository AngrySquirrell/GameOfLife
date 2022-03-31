const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resolution = 10;
canvas.width = Math.floor((screen.width*.98)/10)*10;
canvas.height = Math.floor((screen.height*.90)/10)*10;
console.log(canvas.height);
console.log(canvas.width);

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


class Cell {
    constructor(){
        this.currentstate = Math.floor(Math.random()*2)
        this.total = 0;
    }
    setState(state){ // Chaques fois qu'une cellule devient vivante, sont indice augmente
        this.currentstate = state;
        this.total += state;
    }
}

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
        .map(() => new Cell()));
        
}

let grid = buildGrid();

requestAnimationFrame(update);

function update() {
    //console.log(`Actual grid : ${grid}`);
    grid = nextGen(grid);
    //console.log(`Next grid : ${grid}`);
    render(grid);
    requestAnimationFrame(update);
}

function nextGen(grid) {
    //const nextGen = grid.map(arr => [...arr]);
    const currentGen = grid.map(arr => arr.map(cell => cell.currentstate));

    for (let col = 0; col < currentGen.length; col++) {
        for (let row = 0; row < currentGen[col].length; row++) {
            const cell = currentGen[col][row];
            let numNeighbors = 0;
            for (let i = -1; i < 2; i++){ // Boucle sur les cellules voisines (x)
                for (let j = -1; j < 2; j++){ // Boucle sur les cellules voisines (y)
                    if (i === 0 && j === 0) continue; // Si la cellule courante est la cellule centrale, on passe à la suivante
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if (x_cell >= 0 && y_cell >= 0  && x_cell < COLS && y_cell < ROWS) { // Si la cellule est dans le tableau (gère les bords)
                        const currentNeighbor = currentGen[col + i][row + j]; // On récupère la cellule voisine
                        numNeighbors += currentNeighbor; // On compte le nombre de cellules voisines
                    }

                }
            }

            //Règles du jeu :
            if (cell === 1 && numNeighbors < 2 ) { // Si la cellule est vivante et qu'il n'y a pas 2 cellules voisines, elle meurt
                grid[col][row].setState(0) ; // La cellule meurt
            } else if (cell === 1 && numNeighbors > 3) { // Si la cellule est morte et qu'il y a plus de 3 cellules voisines, elle meurt
                grid[col][row].setState(0); // La cellule meurt
            } else if (cell === 0 && numNeighbors === 3) { // Si la cellule est morte et qu'il y a 3 cellules voisines, elle nait
                grid[col][row].setState(1); // La cellule nait
            } else {
                grid[col][row].setState(grid[col][row].currentstate); // Sinon, la cellule reste la même et on incrémente son indice
            
            }

        }
    }  
    return grid; 
}

function render(grid){
    let maxTotal = 0;
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            if (cell.total > maxTotal) {
                maxTotal = cell.total;
            }
        }
    }

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid [col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution); // x, y, width, height
            //ctx.fillStyle = cell.currentstate ? '#000' : '#fff';
            const normalised = cell.total / maxTotal;
            const h = (1 - normalised) * 240;
            ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
            ctx.fill()
        }
    }

}

// //Make a function that convert csv files into JSON ones
// function csvToJson(csv){
//     const lines = csv.split('\n');
//     const result = [];
//     const headers = lines[0].split(',');
//     for (let i = 1; i < lines.length; i++) {
//         const obj = {};
//         const currentline = lines[i].split(',');
//         for (let j = 0; j < headers.length; j++) {
//             obj[headers[j]] = currentline[j];
//         }
//         result.push(obj);
//     }
//     return result;
// }