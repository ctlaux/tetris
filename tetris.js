
var colors = ["red", "green", "blue", "grey"];

var bricks = [[[1, 1, 1],
	       [0, 0, 1]],
	      [[1, 1, 0],
	       [0, 1, 1]],
	      [[0, 1, 1],
	       [1, 1, 0]],
	      [[0, 1, 0],
	       [1, 1, 1]],
	      [[1, 1, 1, 1]],
	      [[1, 1],
	       [1, 1]]];
var center = [[0, 1], [0, 1], [0, 1], [1, 1], [0, 1], [-1, -1]];

var field_width = 10;
var field_height = 30;
var field = new Array(field_width);

var width = 20;
var height = 20;

var x = 0;
var y = -2;
var rot = 0;
var type = 0;
var color = 2;

var points = 0;


function setup() {
    for(i = 0; i < field_width; i++) {
	field[i] = new Array(field_height);
	for(j = 0; j < field_height; j++) {
	    field[i][j] = -1;
	}
    }
}

function draw() {
    var canvas = document.getElementById('canvas1');
    canvas.width = field_width * width;
    canvas.height = field_height * height;

    var c = canvas.getContext('2d');
    c.rect(0, 0, canvas.width, canvas.height);
    c.stroke();

    for(i = 0; i < field_width; i++) {
	for(j = 0; j < field_height; j++) {
	    if(field[i][j] != -1) {
		draw_brick(c, i*width, j*height, field[i][j]);
	    }
	}
    }

    draw_block(c, x, y, rot, type);
}

function draw_block(c, center_x, center_y, rot, m) {
    var b = calculate_bricks(rot, m);

    for(i = 0; i < b.length; i++) {
	draw_brick(c, (center_x + b[i][0]) * width, (center_y + b[i][1]) * height, color);
    }
}

function draw_brick(c, x, y, color) {
    c.fillStyle = colors[color];
    c.fillRect(x, y, width, height);
}

function calculate_bricks(rot, m) {
    var ret = [];

    for(i = 0; i < bricks[m].length; i++) {
	for(j = 0; j < bricks[m][0].length; j++) {
	    if(bricks[m][i][j] == 1) {
		k = i - center[m][0];
		l = j - center[m][1];

		switch(rot) {
		case 0:
		    p = k;
		    q = l;
		    break;

		case 1:
		    p = l;
		    q = -k;
		    break;

		case 2:
		    p = -k;
		    q = -l;
		    break;

		case 3:
		    p = -l;
		    q = k;
		    break;
		}

		ret.push([p, q]);
	    }
	}
    }

    return ret;
}

function move() {
    y++;

    var stopped = false;
    b = calculate_bricks(rot, type);
    for(i = 0; i < b.length; i++) {
	if(y + b[i][1] == field_height - 1)
	    stopped = true;
	if(y + b[i][1] >= 0) {
	    if(field[x + b[i][0]][y + b[i][1] + 1] != -1)
		stopped = true;
	}
    }

    if(stopped) {
	for(i = 0; i < b.length; i++) {
	    field[x + b[i][0]][y + b[i][1]] = color;
	}

	remove_full_lines();

	launch();
    }

    draw();
}

function remove_full_lines() {
    for(j = 0; j < field_height; j++) {
	full = true;
	for(i = 0; i < field_width; i++)
	    if(field[i][j] == -1)
		full = false;

	if(full) {
	    for(k = 0; k < field_width; k++) {
		for(l = j; l > 0; l--)
		    field[k][l] = field[k][l-1];
		field[k][0] = -1;
	    }

	    points+= 10;
	}
    }
}

function launch() {
    color = Math.floor(Math.random() * colors.length);
    type = Math.floor(Math.random() * bricks.length);
    rot = Math.floor(Math.random() * 4);

    var start = 0;
    var end = field_width;
    var b = calculate_bricks(rot, type);
    for(i = 0; i < b.length; i++) {
	start = Math.max(start, -b[i][0])
	end = Math.min(end, field_width - b[i][0])
    }

    x = Math.floor(Math.random() * (end - start - 1)) + start;
    y = -2;

    console.log("launching with x = " + x + " and y = " + y);
}


keypress.combo("up", function() {
    if(center[type][0] != -1) {
	rot++;
	if(rot == 4)
	    rot = 0;
	draw();
    }
});

keypress.combo("down", function() {
    move();
});

keypress.combo("right", function() {
    var move = true;
    var b = calculate_bricks(rot, type);
    for(i = 0; i < b.length; i++) {
	if(x + b[i][0] == field_width - 1)
	    move = false;
    }

    if(move) {
	x++;
	draw();
    }
});

keypress.combo("left", function() {
    var move = true;
    var b = calculate_bricks(rot, type);
    for(i = 0; i < b.length; i++) {
	if(x + b[i][0] == 0)
	    move = false;
    }

    if(move) {
	x--;
	draw();
    }
});

$(function() {
    setup();
    interval_id = setInterval(move, 1000);
    launch();
});
