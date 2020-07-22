var cols = 25;
var rows = 25;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];

var start;
var end;
var path = [];

var w, h;

/*
function removeFromArray(arr, elt) {
  for(var i = arr.length-1; i>=0; i--) {
    if(arr[i] === elt) {
      arr.splice(i,1);
    }
  }
}
*/
function heurisitic(a, b) {
  var d = abs(a.i - b.i) + abs(a.j-b.j);
  return d;
}

function setup() {
  createCanvas(400,400);
  w = (width / cols);
  h = (height / rows);
  for(var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for(var i = 0; i < cols; i++) {
    for(var j = 0;j < rows; j++) {
      grid[i][j] = new Spot(i,j);
    }
  }
  for(var i = 0; i < cols; i++) {
    for(var j = 0;j < rows; j++) {
      grid[i][j].addNeighbors();
    }
  }
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);

}

function draw() {
  if(openSet.length > 0) {
    var winner = 0;
    for( var i = 0; i < openSet.length; i++) {
      if(openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];
    if(current === end) {
      console.log("DONE!");
      noLoop();

    }
    openSet.splice(winner,1);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for(var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if(!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;
        var newPath = false;
        if(openSet.includes(neighbor)) {
          if(tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          newPath = true;
        }
        if(newPath) {
          neighbor.h = heurisitic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h ;
          neighbor.previous = current;
        }
      }
    }
  } else {
    console.log('no solution');
    noLoop();
    return;
  }

  background(0);

  for(var i = 0; i < cols; i++) {
    for(var j = 0; j< rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for(var i=0;i<closedSet.length;i++) {
      closedSet[i].show(color(255,0,0));
  }

  for(var i=0;i<openSet.length;i++) {
    openSet[i].show(color(0,255,0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for(var i=0;i<path.length;i++) {
    path[i].show(color(0,0,255));
  }
  noFill();
  stroke(255);
  beginShape();

  for(var i=0;i<path.length;i++) {
    vertex(path[i].i*w+w/2,path[i].j*h+h/2);
  }

  endShape();
}
