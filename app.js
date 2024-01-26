const B = "B";
const R = "R";
const O = "O";
const Y = "Y";
const G = "G";
const EMPTY = 0;
const COLORS = [B, R, O, Y, G];
const SIZE = 5;
const tables = [[
    [B, 0, 0, R, O],
    [0, 0, 0, Y, 0],
    [0, 0, Y, 0, 0],
    [0, R, O, 0, G],
    [0, B, G, 0, 0]
],
[
    [0, Y, B, G, 0],
    [0, 0, 0, R, 0],
    [0, 0, R, 0, 0],
    [Y, 0, 0, O, 0],
    [B, 0, O, G, 0]
],
[
    [0, 0, 0, R, G],
    [0, 0, B, G, 0],
    [R, 0, 0, 0, 0],
    [O, B, 0, Y, O],
    [0, 0, 0, 0, Y]
],
[
    [R, 0, G, 0, Y],
    [0, 0, B, 0, O],
    [0, 0, 0, 0, 0],
    [0, G, 0, Y, 0],
    [0, R, B, O, 0]
],
[
    [0, 0, 0, 0, 0],
    [O, R, 0, R, O],
    [Y, 0, 0, 0, 0],
    [0, B, 0, G, 0],
    [Y, G, 0, B, 0]
],
[
    [R, 0, G, Y, B],
    [B, 0, 0, 0, 0],
    [0, 0, G, 0, 0],
    [0, 0, R, Y, 0],
    [0, 0, 0, 0, 0]
],
[
    [0, G, 0, 0, 0],
    [0, B, 0, R, 0],
    [G, 0, O, 0, 0],
    [Y, O, R, 0, 0],
    [0, Y, B, 0, 0]
],
[
    [G, Y, 0, Y, O],
    [0, 0, 0, 0, 0],
    [R, 0, O, B, 0],
    [0, 0, 0, G, 0],
    [0, 0, 0, R, B]
]
];
// returns neighbor variables of variable at coordinate row,col
function findNeighbors(table, row, col) {
    let neighbors = [];
    if (row - 1 >= 0)
        neighbors.push(table[row - 1][col]);
    if (row + 1 < SIZE)
        neighbors.push(table[row + 1][col]);
    if (col - 1 >= 0)
        neighbors.push(table[row][col - 1]);
    if (col + 1 < SIZE)
        neighbors.push(table[row][col + 1]);

    for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i] != EMPTY)
            neighbors[i] = neighbors[i].toLowerCase();
    }
    return neighbors;
}
// returns all ColorDots with their coordinates
function getAllDotsCordinates(table) {
    let DotsCordinates = [];
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE; j++)
            if (COLORS.includes(table[i][j]))
                DotsCordinates.push({ color: table[i][j], row: i, col: j })
    return DotsCordinates;
}
// checks that if we assign val to table[row][col] then its make a Dot isolated from empty spaces and Same Color pipes.
// isolated dot has no connection or possibility of connection to another same color dot or same color pipes. 
function isGeneratesIsolatedDots(table, val, row, col) {
    let dots = getAllDotsCordinates(table);
    table[row][col] = val;
    for (let i = 0; i < dots.length; i++) {
        let dotRow = dots[i].row;
        let dotCol = dots[i].col;
        let dotColor = dots[i].color;
        let neighbors = findNeighbors(table, dotRow, dotCol);
        if (!neighbors.includes(EMPTY))
            if (!neighbors.includes(dotColor) && !neighbors.includes(dotColor.toLowerCase())) {
                table[row][col] = EMPTY;
                return true;
            }
    }
    table[row][col] = EMPTY;
    return false;
}
// checks that if we assign val to table[row][col] then table is completely assigned,
// everything is fine and all pipes are connected to same color dots and the problem solved.
function checkFullConnections(table, val, row, col) {
    table[row][col] = val;
    if (isTableNeedsToSolve(table)) {
        table[row][col] = EMPTY;
        return true;
    }
    else {
        for (var i = 0; i < SIZE; i++)
            for (var j = 0; j < SIZE; j++) {
                let neighbors = findNeighbors(table, i, j);
                let countFriends = 0;
                neighbors.forEach(neighbor => {
                    if (neighbor.toLowerCase() == table[i][j].toLowerCase())
                        countFriends += 1;
                });
                if (COLORS.includes(table[i][j])) {
                    if (countFriends < 1) {
                        table[row][col] = EMPTY;
                        return false;
                    }
                } else {
                    if (countFriends < 2) {
                        table[row][col] = EMPTY;
                        return false;
                    }
                }
            }
        table[row][col] = EMPTY;
        return true;
    }
}
// checks if we assign val to table[row][col] then this assignment doesn't cut a future pipe path from a dot to another.
// in other word this assignment doesn't block a pipe.
function checkSemiConnections(table, val, row, col) {
    table[row][col] = val;
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE; j++) {
            if (COLORS.includes(table[i][j]) || table[i][j] == EMPTY)
                continue;

            let neighbors = findNeighbors(table, i, j);
            let countFriends = 0;
            let countEMPTYs = 0;
            neighbors.forEach(neighbor => {
                if (neighbor == EMPTY)
                    countEMPTYs += 1;
                else if (neighbor.toLowerCase() == table[i][j].toLowerCase())
                    countFriends += 1;
            });
            if (countFriends + countEMPTYs < 2) {
                table[row][col] = EMPTY;
                return false;
            }
        }
    table[row][col] = EMPTY;
    return true;
}
// check all constraints of flow free csp. some of Constraints are checkFullConnection ,checkSemiConnection ,isGeneratedIsolatedDots
function CheckFlowFreeConstraintsFor(table, val, row, col, debug) {
    if (isGeneratesIsolatedDots(table, val, row, col)) {
        if (debug)
            console.log("isolated");
        return false;
    }
    if (!checkSemiConnections(table, val, row, col)) {
        if (debug)
            console.log("Not SemiConnected");
        return false;
    }
    if (!checkFullConnections(table, val, row, col)) {
        if (debug)
            console.log("Not FullyConnected");
        return false;
    }
    return true;
}
// checks that is there empty space in table or not
function isTableNeedsToSolve(table) {
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE; j++) {
            if (table[i][j] == EMPTY) {
                return true;
            }
        }
    return false;
}
// selects and returns coordinate of best unassigned variable to assign next time 
function TheBestZeroChoiceXY(table) {
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE; j++)
            if (table[i][j] == EMPTY)
                return [i, j];
}
// solve flow free using Backtracking
function FlowFreeSolverSimple(table) {
    if (isTableNeedsToSolve(table)) {
        let zeroPozXY = TheBestZeroChoiceXY(table);
        for (var k = 0; k < COLORS.length; k++) {
            let selectedColor = COLORS[k].toLowerCase();
            console.log("we want to check following table:");
            printTable(table);
            console.log(zeroPozXY[0], zeroPozXY[1], selectedColor);
            if (CheckFlowFreeConstraintsFor(table, selectedColor, zeroPozXY[0], zeroPozXY[1], 1)) {
                table[zeroPozXY[0]][zeroPozXY[1]] = selectedColor;
                console.log("done\n");
                if (FlowFreeSolverSimple(table)) {
                    return true;
                }
                table[zeroPozXY[0]][zeroPozXY[1]] = EMPTY;
                console.log("backtracked\n");
            }
        }
        console.log("bega")
        return false;
    } else {
        return true;
    }
}
// prints table of the game
function printTable(table) {
    let innerHTMLtxt = `<div></div><table class="table">`;
    let Class = "";
    for (let i = 0; i < SIZE; i++) {
        innerHTMLtxt += "<tr>";
        for (let j = 0; j < SIZE; j++) {
            if (COLORS.includes(table[i][j]))
                Class = "dot " + table[i][j].toLowerCase();
            else if (table[i][j] != EMPTY)
                Class = "pipe " + table[i][j];
            innerHTMLtxt += `<td class="${Class}"></td>`;
            Class = "";
        }
        innerHTMLtxt += "</tr>";
    }
    innerHTMLtxt += "</table></div>";
    InputControl.innerHTML = innerHTMLtxt;

}


function solve() {
    setMessage("", "");
    if (Gtable != null) {
        setMessage("tipWait", "Loading...");
        var startTime = performance.now();
        setTimeout(() => {
            let isSolved = false;
            isSolved = FlowFreeSolverSimple(Gtable);
            if (isSolved) {
                var endTime = performance.now();
                let timerMS = (endTime - startTime).toFixed(2);
                CtrlretryBtn(1);
                console.log("done");
                setMessage("tipSucess", "solved in " + timerMS + "ms");
                printTable(Gtable);
                CtrlRunBox(0);
            } else {
                setMessage("tipError", "not solvable!");
            }
        }, 1);
    }
}

function setMessage(className, info) {
    if (className) tipbox.classList = [className];
    else tipbox.classList = [];
    tipbox.innerHTML = info;
}

function CtrlRunBox(show) {
    if (show) {
        if (runBox.classList.contains("hideSolveBtn"))
            runBox.classList.remove("hideSolveBtn");
    } else {
        if (!runBox.classList.contains("hideSolveBtn"))
            runBox.classList.add("hideSolveBtn");
    }
}

function CtrlretryBtn(show) {
    if (show) {
        if (retryBtn.classList.contains("hideSolveBtn"))
            retryBtn.classList.remove("hideSolveBtn");
    } else {
        if (!retryBtn.classList.contains("hideSolveBtn"))
            retryBtn.classList.add("hideSolveBtn");
    }
}

function selectAGameBoard() {
    let index = Math.floor(Math.random() * tables.length);
    let selectedTable = tables[index];
    Gtable = [];
    for (let i = 0; i < SIZE; i++) {
        let row = [];
        for (let j = 0; j < SIZE; j++)
            row.push(selectedTable[i][j]);
        Gtable.push(row);
    }
}

var Gtable = null;
const runBtn = document.getElementById("run");
const retryBtn = document.getElementById("retry");
const runBox = document.getElementById("runBox");
const tipbox = document.getElementById("tip");
const InputControl = document.getElementById("inputControl");
retryBtn.addEventListener("click", () => {
    selectAGameBoard();
    CtrlretryBtn(0);
    setMessage("", "");
    printTable(Gtable);
    CtrlRunBox(1);
});
runBtn.addEventListener("click", () => {
    solve();
});

selectAGameBoard();
printTable(Gtable);