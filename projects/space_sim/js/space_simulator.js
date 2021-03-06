// admittedly not my best work this is my first time using javascript

var ground_colors = 	[{r:67 , g:211, b:100}, {r:232, g:74 , b:244}, {r:193, g:31 , b:13 }, {r:189, g:207, b:251}, {r:79, g:54, b:47}];
var water_colors = 		[{r:120, g:109, b:254}, {r:164, g:221, b:192}, {r:255, g:133, b:60 }, {r:149, g:175, b:247}, {r:56, g:38, b:33}];
var deep_water_colors = [{r:72 , g:57 , b:253}, {r:67 , g:182, b:124}, {r:183, g:69 , b:0  }, {r:149, g:175, b:247}, {r:56, g:38, b:33}];
var sand_colors =		[{r:237, g:201, b:175}, {r:235, g:101, b:245}, {r:235, g:52 , b:52 }, {r:189, g:207, b:251}, {r:79, g:54, b:47}];

var timerLife = 0;
var timerX = 0;
var timerY = 0;


function set_lava_planet()
{
	simplex_color = 2;
}



function set_smoothing(value)
{
	ctx.mozImageSmoothingEnabled = value;
	ctx.webkitImageSmoothingEnabled = value;
	ctx.msImageSmoothingEnabled = value;
	ctx.imageSmoothingEnabled = value;
}

function reset(){
	ship.x = 200;
	ship.y = 300;
	ship.vX = 0;
	ship.vY = 1;
}

function draw_circle(x,y,radius,color, ctx)
{
	ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function draw_ship(ship, ctx)
{
	
	draw_circle(ship.x, ship.y, ship.mass, "#555555", ctx);
	
}

function set_pixel(x, y, r, g, b, a, size, ctx)
{
	var id = ctx.createImageData(size, size); // only do this once per page
	var d  = id.data;                        // only do this once per page	
	for (var i=0;i<d.length;i+=4)
    	{
	   d[i+0]=r;
	   d[i+1]=g;
	   d[i+2]=b;
	   d[i+3]=a;
    	}
	ctx.putImageData( id, x, y );    
}

var sp_timer = 0;
var sp_timer_max = 30 / 15;
var cached_image = [];

var scrollX = 0;
var scrollY = 0;

var ground_color = 0;
var water_color = 0;
var deep_water_color = 0;
var sand_color = 0;
var simplex_color = 0;

function reset_planet_colors()
{
	ground_color = Math.floor(Math.random() * ground_colors.length);
	water_color = Math.floor(Math.random() *  water_colors.length);
	deep_water_color = Math.floor(Math.random() * deep_water_colors.length);
	sand_color = Math.floor(Math.random() * sand_colors.length);

	simplex_color = Math.floor(Math.random() * ground_colors.length); //using ground_colors to measure colors

	//use the opportunity to reset planet scroll
	scrollX = 0;
	scrollY = 0;
}

function update_planet_speed()
{
	var x = document.getElementById("simplex_timer");
	var text = x.value;
	var num = parseFloat(text, 10);
	if (num == 0)
	{
		alert("Cannot divide by zero please choose another number");
	}else{
	sp_timer_max = 30 / num;
	}
}

function draw_simplex_planet(planet, ctx)
{
	//loop through rectangle area
	cache_index = 0;

	if (sp_timer == 0){
		cached_image = [];
	}

	for (var x = 0; x < planet.mass * 2; x++)
	{
		for (var y = 0; y < planet.mass * 2; y++)
		{
			//calculate distance
			var dX = x - (planet.mass);
			var dY = y - (planet.mass);
			var dist = Math.sqrt( (dX * dX) + (dY * dY) );

			if (dist <= planet.mass / 2)
			{
				if (sp_timer == 0)
				{
					var color = noise.simplex2((x/planet.mass) + scrollX,(y/planet.mass) + scrollY);
					color = (color + 1);
				
					//push to cache
					cached_image.push(color);

					var r = 0;
					var g = 0;
					var b = 0;
					if (color > 1.3)
					{
						r = ground_colors[simplex_color].r;
						g = ground_colors[simplex_color].g;
						b = ground_colors[simplex_color].b;
					}else if (color > 1.0)
					{
						r = sand_colors[simplex_color].r;
						g = sand_colors[simplex_color].g;
						b = sand_colors[simplex_color].b;
					}else if (color > 0.5){
						r = water_colors[simplex_color].r;
						g = water_colors[simplex_color].g;
						b = water_colors[simplex_color].b;
					}else{
						r = deep_water_colors[simplex_color].r;
						g = deep_water_colors[simplex_color].g;
						b = deep_water_colors[simplex_color].b;
					}

					color /= 2;

					set_pixel((x * 2) + planet.x - (planet.mass * 2), (y * 2) + planet.y - (planet.mass * 2), r * color, g * color, b * color, 255, 2, ctx);
				}else{
					var color = cached_image[cache_index];
					var r = 0;
					var g = 0;
					var b = 0;
					if (color > 1.3)
					{
						r = ground_colors[simplex_color].r;
						g = ground_colors[simplex_color].g;
						b = ground_colors[simplex_color].b;
					}else if (color > 1.0)
					{
						r = sand_colors[simplex_color].r;
						g = sand_colors[simplex_color].g;
						b = sand_colors[simplex_color].b;
					}else if (color > 0.5){
						r = water_colors[simplex_color].r;
						g = water_colors[simplex_color].g;
						b = water_colors[simplex_color].b;
					}else{
						r = deep_water_colors[simplex_color].r;
						g = deep_water_colors[simplex_color].g;
						b = deep_water_colors[simplex_color].b;
					}

					color /= 2;

					set_pixel((x * 2) + planet.x - (planet.mass * 2), (y * 2) + planet.y - (planet.mass * 2), r * color, g * color, b * color, 255, 2, ctx);
					cache_index++;
				}

			}
		}
	}

	if (sp_timer == 0)
	{
		sp_timer = sp_timer_max;
		scrollX += 0.01;
		scrollY += 0.005;
	}else{
		sp_timer--;
	}
}

var planet_id = 1

function draw_planet(planet, ctx)
{
	/**/var image = document.getElementById("planet_"+planet_id);

	set_smoothing(false);

	ctx.drawImage(image, planet.x - planet.mass, planet.y - planet.mass, planet.mass * 2, planet.mass * 2);
	
	// draw blue background
	/*/
	ctx.fillStyle = planet.bg_color;
	ctx.beginPath();
	ctx.arc(planet.x, planet.y, planet.mass,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	/**/
}

function draw_timer(ctx)
{
	if (timerLife > 0)
	{
		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.arc(timerX, timerY, timerLife,0,2*Math.PI);
		ctx.fill(); 
		ctx.stroke();
		timerLife -= 1;
	}
}

function draw(obj, ctx) {
	
	ctx.fillStyle = obj.color;
	ctx.beginPath();
	ctx.arc(obj.x, obj.y,obj.mass,0,2*Math.PI);
	ctx.fill();	
	ctx.stroke();
}

function apply_gravity(obj1, obj2)
{
	var dX = obj2.x - obj1.x;
	var dY = obj2.y - obj1.y;

	var distance = Math.sqrt( (dX * dX) + (dY * dY) );
	var force = (obj1.mass * obj2.mass) / distance;

	var angle = Math.atan2(dY, dX);

	obj1.vX += Math.cos(angle) * force * 0.01;
	obj1.vY += Math.sin(angle) * force * 0.01;	
}

function check_planet_bounds(obj1, obj2)
{
	var dX = obj2.x - obj1.x;
	var dY = obj2.y - obj1.y;

	var distance = Math.sqrt( (dX * dX) + (dY * dY) );

	if (distance + 3 <= obj2.mass + (obj1.mass) )
	{;
		//spawn explosion
		timerLife = 25;
		timerX = obj1.x;
		timerY = obj1.y;

		reset();
	}

}

var simplex_mode = true;

function update(ctx) {
	
	ctx.fillStyle = "#2f2f2f";
	ctx.fillRect(0,0,800,600);

	apply_gravity(ship, planet);
	check_planet_bounds(ship, planet);


	//apply velocity
	ship.x += ship.vX;
	ship.y += ship.vY;



	//apply key controls
	var speed = 0.1 *  0.05;
	if (v_up){
		ship.vY -= speed;
		draw_circle(ship.x, ship.y + 4, 4, "yellow", ctx);
	}
	if (v_down) {
		ship.vY += speed;
		draw_circle(ship.x, ship.y - 4, 4, "yellow", ctx);
	}
	if (v_left) {
		ship.vX -= speed;
		draw_circle(ship.x + 4, ship.y, 4, "yellow", ctx);
	}
	if (v_right) {
		ship.vX += speed;
		draw_circle(ship.x - 4, ship.y, 4, "yellow", ctx);
	}
	//draw everything
	//draw(planet, ctx);
	draw_ship(ship, ctx);
	
	if (!simplex_mode)
	{	
		draw_planet(planet, ctx);
	}else{
		draw_simplex_planet(planet, ctx);
	}

	draw_timer(ctx);
}

function on_key_down(key_code)
{
	if (key_code.key == "w")
	{
		v_up = true;;
	}

	if (key_code.key == "a")
	{
		v_left = true;
	}

	if (key_code.key == "s")
	{
		v_down = true;
	}

	if (key_code.key == "d")
	{
		v_right = true;
	}

	if (key_code.key == "m")
	
	{
		simplex_mode = !simplex_mode;
		console.log("Simplex Mode is now " + simplex_mode);

		planet_id = Math.floor(Math.random() * 8) + 1
	}

	if (key_code.key == "r")
	{
		reset();
	}

	if (key_code.key == "n")
	{
		planet_id = Math.floor(Math.random() * 8) + 1;
		reset_planet_colors();
	}
}


function on_key_up(key_code)
{
	if (key_code.key == "w")
	{
		v_up = false;
	}

	if (key_code.key == "a")
	{
		v_left = false;
	}

	if (key_code.key == "s")
	{
		v_down = false;
	}

	if (key_code.key == "d")
	{
		v_right = false;
	}
}

var v_up = false;
var v_down = false;
var v_left = false;
var v_right = false;

var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
window.addEventListener('keydown', on_key_down, false);
window.addEventListener('keyup', on_key_up, false);


noise.seed(Math.random());
planet_id = Math.floor(Math.random() * 8) + 1;
reset_planet_colors();



var splotch = {x:0, y:0, radius: 20, color: "#00FF00"};
var planet = {x: 400, y: 300, mass: 50, vX: 0, vY: 0, bg_color: "#0000FF", splotches: [splotch]}
var ship = {x: 200, y: 300, mass: 5, vX: 0, vY: 1, color: "#FF0000"};

var FPS = 60;
setInterval(function() {
	  update(ctx); 
}, 1000/FPS);

