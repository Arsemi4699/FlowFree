const B = "B";
const R = "R";
const O = "O";
const Y = "Y";
const G = "G";
const EMPTY = 0;
const COLORS = [B, R, O, Y, G];
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
    let outText = "";
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++)
            outText += table[i][j] + " ";
        outText += "\n";
    }
    console.log(outText);
}
//test
let table1 = [
    [B, 0, 0, R, O],
    [0, 0, 0, Y, 0],
    [0, 0, Y, 0, 0],
    [0, R, O, 0, G],
    [0, B, G, 0, 0]
];
let table2 = [
    [0, Y, B, G, 0],
    [0, 0, 0, R, 0],
    [0, 0, R, 0, 0],
    [Y, 0, 0, O, 0],
    [B, 0, O, G, 0]
];

var SIZE = 5;

FlowFreeSolverSimple(table2);
printTable(table2);

// function MRV_H(table, row, col) {
//     let MRV_V = 0;
//     for (var k = 0; k < COLORS.length; k++) {
//         let selectedColor = COLORS[k].toLowerCase();
//         if (CheckFlowFreeConstraintsFor(table, selectedColor, row, col, 0)) {
//             MRV_V += 1;
//         }
//     }
//     return MRV_V;
// }
// function degree_H(table, row, col) {
//     let Deg_V = 0;
//     for (var i = 0; i < 9; i++) {
//         if (table[row][i] == 0 && i != col && (i < parseInt(col / 3) * 3 || i > parseInt(col / 3) * 3 + 2)) {
//             Deg_V += 1;
//         }
//     }
//     for (var i = 0; i < 9; i++) {
//         if (table[i][col] == 0 && i != row && (i < parseInt(row / 3) * 3 || i > parseInt(row / 3) * 3 + 2)) {
//             Deg_V += 1;
//         }
//     }
//     for (var i = parseInt(row / 3) * 3; i < parseInt(row / 3) * 3 + 3; i++)
//         for (var j = parseInt(col / 3) * 3; j < parseInt(col / 3) * 3 + 3; j++)
//             if (table[i][j] == 0 && (i != row || j != col)) {
//                 Deg_V += 1;
//             }

//     return Deg_V;
// }