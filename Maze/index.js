const { World, Bodies, Engine, Runner, Render } = Matter;

const width = 600;
const height = 600;
const cells = 5;
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height,
    },
});
Render.run(render);
Runner.run(Runner.create(), engine);

const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));

verticles = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        counter--;
        const randomIndex = Math.floor(Math.random() * counter);
        [arr[counter], arr[randomIndex]] = [arr[randomIndex], arr[counter]];
    }
    return arr;
};

const stepThroughCell = (row, column) => {
    //if cell[row, column] is already visited return;
    if (grid[row][column]) return;

    //else mark this cell as visited
    grid[row][column] = true;

    //find all list of neighbours and randonly order them
    const neighbours = shuffle([
        [row, column - 1, "left"],
        [row, column + 1, "right"],
        [row - 1, column, "up"],
        [row + 1, column, "down"],
    ]);

    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;
        // if neighbour is out of bound, continue to next
        if (
            nextRow < 0 ||
            nextRow >= cells ||
            nextColumn < 0 ||
            nextColumn >= cells
        ) {
            continue;
        }

        // if neighbour is visited, continue skip it and check next neighbour
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        //remove the wall when you enter the cell, either horizontal or vertical
        if (direction === "up") {
            horizontals[row - 1][column] = true;
        } else if (direction === "down") {
            horizontals[row][column] = true;
        } else if (direction === "left") {
            verticles[row][column - 1] = true;
        } else if (direction === "right") {
            verticles[row][column] = true;
        }

        //visit this new cell by callign this function recursively again.
        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return;

        const xAxis = columnIndex * unitLength + unitLength / 2;
        const yAxis = rowIndex * unitLength + unitLength;
        const wall = Bodies.rectangle(xAxis, yAxis, unitLength, 5, {
            isStatic: true,
        });

        World.add(world, wall);
    });
});

verticles.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) return;

        const xAxis = columnIndex * unitLength + unitLength;
        const yAxis = rowIndex * unitLength + unitLength / 2;
        const wall = Bodies.rectangle(xAxis, yAxis, 5, unitLength, {
            isStatic: true,
        });

        World.add(world, wall);
    });
});
