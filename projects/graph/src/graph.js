/**
 * Edge
 */
export class Edge {
  constructor(node, weight) {
    this.connection = node;
    this.weight = weight;
  }
}

/**
 * Vertex
 */
export class Vertex {
  constructor(value = "default", pos = { x: -1, y: -1 }, color = "white") {
    this.edges = [];
    this.value = value;
    this.pos = pos;
    this.color = color;
  }
}

/**
 * Graph
 */
export class Graph {
  constructor() {
    this.vertexes = [];
  }

  /**
   * Create a random graph
   */
  randomize(width, height, pxBox, probability = 0.6) {
    console.log("Randomize graph called");
    // Helper function to set up two-way edges
    function connectVerts(v0, v1) {
      const weight = 1 + Math.floor(Math.random() * Math.floor(10));
      v0.edges.push(new Edge(v1, weight));
      v1.edges.push(new Edge(v0, weight));
    }

    let count = 0;

    // Build a grid of verts
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let v = new Vertex();
        //v.value = 'v' + x + ',' + y;
        v.value = "v" + count++;
        row.push(v);
      }
      grid.push(row);
    }

    // Go through the grid randomly hooking up edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Connect down
        if (y < height - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y + 1][x]);
          }
        }

        // Connect right
        if (x < width - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y][x + 1]);
          }
        }
      }
    }

    // Last pass, set the x and y coordinates for drawing
    const boxBuffer = 0.8;
    const boxInner = pxBox * boxBuffer;
    const boxInnerOffset = (pxBox - boxInner) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].pos = {
          x: (x * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
          y: (y * pxBox + boxInnerOffset + Math.random() * boxInner) | 0
        };
      }
    }

    // Finally, add everything in our grid to the vertexes in this Graph
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.vertexes.push(grid[y][x]);
      }
    }
  }

  /**
   * Dump graph data to the console
   */
  dump() {
    let s;

    for (let v of this.vertexes) {
      if (v.pos) {
        s = v.value + " (" + v.pos.x + "," + v.pos.y + "):";
      } else {
        s = v.value + ":";
      }

      for (let e of v.edges) {
        s += ` ${e.destination.value}`;
      }
      console.log(s);
    }
  }

  /**
   * BFS
   */
  bfs(start) {
    let queue = [];
    let component = [];

    start.color = "gray";
    queue.push(start);
    while (queue.length > 0) {
      const u = queue[0];

      for (let v of u.edges) {
        if (v.connection.color === "white") {
          v.connection.color = "gray";
          queue.push(v.connection);
        }
      }
      queue.shift();
      u.color = "black";
      component.push(u);
    }
    return component;
  }

  /**
   * Get the connected components
   */
  getConnectedComponents() {
    let connectedComponents = [];
    for (let v of this.vertexes) {
      v.color = "white";
    }
    for (let v of this.vertexes) {
      if (v.color === "white") {
        const component = this.bfs(v);
        connectedComponents.push(component);
      }
    }
    return connectedComponents;
  }
}
