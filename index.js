const gridMap = document.querySelector('.grid-map');
const selectBox = document.querySelector('.algorithms-drop-down');
const runButton = document.querySelector('.btn-run');
const clearButton = document.querySelector('.btn-clear');
const addWallButton = document.querySelector('.add-wall');

let startNode, endNode;

let startNodePressed = false;
let endNodePressed = false;
let addWallPressed = false;
let addWall = false;

const gridRows = 16;
const gridCols = 54;
makeRows(gridRows, gridCols);
let gridCells = document.querySelectorAll('.grid-cell');
initializeStartEnd();

function makeRows(rows, cols) {
    gridMap.style.setProperty('--grid-rows', rows);
    gridMap.style.setProperty('--grid-cols', cols);
    for (let c=0; c<rows*cols; c++){
        let cell = document.createElement("div");
        cell.setAttribute('cell-value', c);
        gridMap.appendChild(cell).className = "grid-cell";
        cell.addEventListener('mousedown', () => {
            onMouseDown(cell);
        });
        cell.addEventListener('mouseenter', () => {
            onMouseHover(cell);
        });
        cell.addEventListener('mouseup', () => {
            onMouseUp(cell);
        });
    };
}

function initializeStartEnd(){
    startNode = gridCols*(gridRows/2 - 1) + Math.floor(gridCols/4);
    // startNode = gridCols * (Math.floor((2*gridRows + 1)/4));
    endNode = gridCols*(gridRows/2 - 1) + 3*Math.floor(gridCols/4);

    gridCells[startNode].classList.add('grid-cell-start');
    gridCells[endNode].classList.add('grid-cell-end');

}

// TODO Read the article.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValid(x, y) {
    if (x < 0 || y < 0 || x >=gridRows || y>=gridCols)
        return false;
    
    return true;
}


function markVisited(val) {
    let cl = gridCells[val].classList;
    cl.add('grid-cell-visited');
    if (cl.contains('grid-cell-tovisit')){
        cl.remove('grid-cell-tovisit');
    }
}

function markToVisit(val) {
    gridCells[val].classList.add('grid-cell-tovisit');
}



async function bfs(startNode, endNode, animationTime) {
    const step = [-gridCols, gridCols, -1, 1];
    const stepX = [-1 , 1, 0, 0];
    const stepY = [0, 0, -1, 1];

    let queue = [];
    let [visited, pred] = getVisited();

    queue.push(startNode);
    visited[startNode] = true;

    while (queue.length > 0) {
        let currNode = queue.shift();
        if (currNode != startNode && currNode != endNode)
            markVisited(currNode);
        if (currNode == endNode) {
            printPath(endNode, pred, animationTime*6);
            break;
        }
        for (let c = 0; c < 4; c++) {
            let nextNode = currNode + step[c];
            let x = Math.floor(currNode/gridCols) + stepX[c];
            let y = Math.floor(currNode%gridCols) + stepY[c];

            if (isValid(x, y) && !visited[nextNode]){
                visited[nextNode] = true;
                if (nextNode != endNode)
                    markToVisit(nextNode);
                queue.push(nextNode);
                pred[nextNode] = currNode;
                await sleep(animationTime);
            }
        }
    }
}
