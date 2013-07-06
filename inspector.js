
var original_x = 100;
var original_y = 100;
var rotated_x = 200;
var rotated_y = 100;

var selected = 0;


function on_launch() {
    selected = Math.floor(Math.random() * squares.length);
    while(squares[selected][0] == 0 && squares[selected][1] == 0)
	selected = Math.floor(Math.random() * squares.length);
}

function draw_rotation() {
    var canvas = document.getElementById('canvas2');
    canvas.width = canvas.width;
    var c = canvas.getContext('2d');

    var b = calculate_squares(0, type);
    for(var i = 0; i < b.length; i++) {
	c.beginPath();
	c.strokeStyle = "grey";
	c.rect(original_x + b[i][0] * width, original_y + b[i][1] * height, width, height);
	c.stroke();
    }

    for(var i = 0; i < squares.length; i++) {
	c.beginPath();
	c.strokeStyle = "grey";
	c.rect(rotated_x + squares[i][0] * width, rotated_y + squares[i][1] * height, width, height);
	c.stroke();
    }

    var x1 = original_x + width/2;
    var y1 = original_y + height/2;
    if(b[selected][0] != 0)
	draw_arrow(c, x1, y1, x1 + b[selected][0] * width, y1, "blue");
    if(b[selected][1] != 0)
	draw_arrow(c, x1 + b[selected][0] * width, y1, x1 + b[selected][0] * width, y1 + b[selected][1] * height, "red");

    blue = rotate(rot, b[selected][0], 0);
    red = rotate(rot, b[selected][0], b[selected][1]);

    x1 = rotated_x + width/2;
    y1 = rotated_y + height/2;
    if(blue[0] != 0 || blue[1] != 0)
	draw_arrow(c, x1, y1, x1 + blue[0] * width, y1 + blue[1] * height, "blue");
    if((red[0]-blue[0]) != 0 || (red[1]-blue[1]) != 0)
	draw_arrow(c, x1 + blue[0] * width, y1 + blue[1] * height, x1 + red[0] * width, y1 + red[1] * height, "red");
}

function draw_arrow(c, from_x, from_y, to_x, to_y, color) {
    var head_length = 8;
    var angle = Math.atan2(to_y - from_y, to_x - from_x);

    c.beginPath();
    c.strokeStyle = color;
    c.moveTo(from_x, from_y);
    c.lineTo(to_x, to_y);
    c.lineTo(to_x - head_length*Math.cos(angle-Math.PI/6), to_y - head_length*Math.sin(angle-Math.PI/6));
    c.moveTo(to_x, to_y);
    c.lineTo(to_x - head_length*Math.cos(angle+Math.PI/6), to_y - head_length*Math.sin(angle+Math.PI/6));
    c.stroke();
}
