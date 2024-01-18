const B = "B";
const R = "R";
const O = "O";
const Y = "Y";
const G = "G";
var COLORS = [B, R, O, Y, G];

function findNeighbors(table, row, col)
{
    let neighbors = [];
    if (row - 1 >= 0)
        neighbors.push(table[row - 1][col]);
    if (row + 1 < SIZE)
        neighbors.push(table[row + 1][col]);
    if (col - 1 >= 0)
        neighbors.push(table[row][col - 1]);
    if (col + 1 < SIZE)
        neighbors.push(table[row][col + 1]);

    for(let i = 0; i < neighbors.length ; i++)
    {
        if (neighbors[i] != 0)
        {
            neighbors[i] = neighbors[i].toLowerCase();
        }
    }
    return neighbors;
}

function CheckFlowFreeConstraintsFor(table, val, row, col) {
    let neighbors = findNeighbors(table, row, col);
    if (!neighbors.includes(val))
        return false;
    return true;
}

function isTableNeedsToSolve(table) {
    for (var i = 0; i < SIZE; i++)
        for (var j = 0; j < SIZE; j++) {
            if (table[i][j] == 0) {
                return true;
            }
        }
    return false;
}

// function MRV_H(table, row, col) {
//     let MRV_V = 0;
//     for (var n = 1; n < 10; n++) {
//         if (CheckSudokuConstraintsFor(table, n, row, col)) {
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

function TheBestZeroChoiceXY(table, needsDegree) {
    let finalX, finalY;
    for (let i = 0; i < SIZE; i++)
        for (let j = 0; j < SIZE; j++) {
            if (table[i][j] == 0) {
                finalX = i;
                finalY = j;
                return [finalX, finalY];
            }
        }
    // let minPossibleNumbers = 10;
    // for (var i = 0; i < 9; i++) {
    //     for (var j = 0; j < 9; j++) {
    //         if (table[i][j] == 0) {
    //             let possibleNumbersForIJ = MRV_H(table, i, j);
    //             if (minPossibleNumbers > possibleNumbersForIJ) {
    //                 minPossibleNumbers = possibleNumbersForIJ;
    //                 finalX = i;
    //                 finalY = j;
    //             } else if (minPossibleNumbers == possibleNumbersForIJ && needsDegree) {
    //                 let CurrentPosDegree = degree_H(table, finalX, finalY);
    //                 let NewPosDegree = degree_H(table, i, j);
    //                 if (NewPosDegree > CurrentPosDegree) {
    //                     finalX = i;
    //                     finalY = j;
    //                 }
    //             }
    //         }
    //     }
    // }
    // return [finalX, finalY];
}

function FlowFreeSolverSimple(table) {
    if (isTableNeedsToSolve(table)) {
        let zeroPozXY = TheBestZeroChoiceXY(table, 0);
        for (var k = 0; k < COLORS.length; k++) {
            let selectedColor = COLORS[k].toLowerCase();
            if (CheckFlowFreeConstraintsFor(table, selectedColor, zeroPozXY[0], zeroPozXY[1])) {
                table[zeroPozXY[0]][zeroPozXY[1]] = selectedColor;
                printTable(table);
                if (FlowFreeSolverSimple(table)) {
                    return true;
                }
                table[zeroPozXY[0]][zeroPozXY[1]] = 0;
            }
        }
        return false;
    } else {
        return true;
    }
}

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
let table = [
    [B, 0, 0, R, O],
    [0, 0, 0, Y, 0],
    [0, 0, Y, 0, 0],
    [0, R, O, 0, G],
    [0, B, G, 0, 0]
];
var SIZE = 5;
printTable(table);
FlowFreeSolverSimple(table);