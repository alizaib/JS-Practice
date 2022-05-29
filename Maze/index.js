const { World, Bodies, Engine, Runner, Render, Body, Events } = Matter;

const width = 600;
const height = 600;
const cells = 5;
const unitLength = width / cells;

const engine = Engine.create();
engine.world.gravity.y = 0;
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

const walls = [
    Bodies.rectangle(width / 2, 0, width, 10, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 10, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 10, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 10, height, { isStatic: true }),
];

World.add(world, walls);

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
            label: "wall",
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
            label: "wall",
        });

        World.add(world, wall);
    });
});

//goal
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * 0.7,
    unitLength * 0.7,
    {
        isStatic: true,
        label: "goal",
    }
);
World.add(world, goal);

//ball
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength * 0.3, {
    label: "ball",
});
World.add(world, ball);

document.addEventListener("keydown", (evt) => {
    const speed = 3;
    const { x, y } = ball.velocity;
    if (evt.keyCode === 38) {
        Body.setVelocity(ball, { x: x, y: y - speed });
    }
    if (evt.keyCode === 39) {
        Body.setVelocity(ball, { x: x + speed, y: y });
    }
    if (evt.keyCode === 40) {
        Body.setVelocity(ball, { x: x, y: y + speed });
    }
    if (evt.keyCode === 37) {
        Body.setVelocity(ball, { x: x - speed, y: y });
    }
});

//Win Condition
Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
        const labels = ["ball", "goal"];
        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            world.gravity.y = 1;
            world.bodies.forEach((body) => {
                if (body.label === "wall") {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});
