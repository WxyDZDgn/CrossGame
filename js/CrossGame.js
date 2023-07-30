const size_of_map = 10;
const map_display_scale = 7 / 10;
const elements_square_size = 40 * map_display_scale;
const diameter_of_circle = 10 * map_display_scale;
const margin = (elements_square_size - diameter_of_circle) / 2;
const players_colors = ["red", "blue"];

const map = Array.from(Array(size_of_map * 2 + 1), () => new Array(size_of_map * 2 + 1));

var current_player = 0;

var isWin = false;

function getDefaultStyleString() {
	return `width: ${elements_square_size}px; height: ${elements_square_size}px; background-color: black;`
}
function getHCrossStyleString(color) {
	return `width: ${elements_square_size * 2 + diameter_of_circle}px; height: ${diameter_of_circle}px; border: 1px solid ${color}; background-color: ${color}; position: absolute; transform: translate(-${margin + diameter_of_circle}px, -${diameter_of_circle / 2}px);`;
}
function getVCrossStyleString(color) {
	return `height: ${elements_square_size * 2 + diameter_of_circle}px; width: ${diameter_of_circle}px; border: 1px solid ${color}; background-color: ${color}; position: absolute; transform: translate(${margin}px, -${elements_square_size + diameter_of_circle / 2}px);`;
}
function getPointStyleString(color) {
	return `width: ${diameter_of_circle}px; height: ${diameter_of_circle}px; margin: ${margin}px; border: 1px solid ${color}; border-radius: 50%; background-color: ${color};`;
}

function setCurrentHighlight() {
	document.getElementById("currentPlayer").innerHTML = "#" + current_player;
	document.getElementById("currentPlayer").style.color = players_colors[current_player];
	
	for(var i = 1; i < size_of_map * 2; ++ i) {
		for(var j = 1; j < size_of_map * 2; ++ j) {
			let id = `select_${i}_${j}`;
			if(map[i][j] >= 0) {
				var node = document.getElementById(id);
				if(node) node.style.cursor = "not-allowed";
				continue;
			}
			var res;
			if(current_player == 0 && i % 2 == 1 || current_player == 1 && i % 2 == 0) {
				res = getVCrossStyleString(players_colors[current_player]);
			} else if(current_player == 0 && i % 2 == 0 || current_player == 1 && i % 2 == 1) {
				res = getHCrossStyleString(players_colors[current_player]);
			}
			document.getElementById(id).style = res + "opacity: 0; cursor: pointer;";
		}
	}
}
function mouseOverHighlight(node) {
	if(isWin) return;
	let temp = node.id.split('_');
	let i = parseInt(temp[1]);
	let j = parseInt(temp[2]);
	if(map[i][j] >= 0) return;
	node.style.opacity = 0.5;
}
function mouseLeaveHighlight(node) {
	if(isWin) return;
	let temp = node.id.split('_');
	let i = parseInt(temp[1]);
	let j = parseInt(temp[2]);
	if(map[i][j] >= 0) return;
	node.style.opacity = 0.0;
}
function mouseClickedHighlight(node) {
	if(isWin) return;
	node.style.opacity = 1.0;
}
function selectChoice(node) {
	if(isWin) return;
	let temp = node.id.split('_');
	let i = parseInt(temp[1]);
	let j = parseInt(temp[2]);
	if(map[i][j] >= 0) return;
	
	map[i][j] = current_player;
	mouseClickedHighlight(node);
	
	if(checkWhetherWin(i, j)) {
		alert(`Player ${current_player} WINS!!!`);
		isWin = true;
		return;
	}
	
	current_player = 1 - current_player;
	
	setCurrentHighlight();
}
function checkWhetherWin(fromI, fromJ) {
	const vis = Array.from(Array(size_of_map * 2 + 1), () => new Array(size_of_map * 2 + 1));
	for(var i = 0; i <= size_of_map * 2; ++ i) {
		for(var j = 0; j <= size_of_map * 2; ++ j) {
			vis[i][j] = false;
		}
	}
	
	console.log(vis);
	const queue = [[parseInt(fromI), parseInt(fromJ)]];
	var ul = false, dr = false;
	while(queue.length > 0) {
		let size = queue.length;
		for(var i = 0; i < size; ++ i) {
			let temp = queue.shift();
			if(temp[0] == 0 || temp[1] == 0 || temp[0] == size_of_map * 2 || temp[1] == size_of_map * 2) {
				if(temp[0] == 0 || temp[1] == 0) ul = true;
				if(temp[0] == size_of_map * 2 || temp[1] == size_of_map * 2) dr = true;
				if(ul && dr) return true;
				continue;
			}
			if(vis[temp[0]][temp[1]]) continue;
			vis[temp[0]][temp[1]] = true;
			if(temp[0] > 0 && map[temp[0] - 1][temp[1]] == current_player && !vis[temp[0] - 1][temp[1]]) {
				queue.push([temp[0] - 1, temp[1]]);
			}
			// console.log(temp[0] > 0);
			// console.log(map[temp[0] - 1][temp[1]] == current_player);
			// console.log(vis[temp[0] - 1][temp[1]] == 0);
			if(temp[0] < size_of_map * 2 && map[temp[0] + 1][temp[1]] == current_player && !vis[temp[0] + 1][temp[1]]) {
				queue.push([temp[0] + 1, temp[1]]);
			}
			if(temp[1] > 0 && map[temp[0]][temp[1] - 1] == current_player && !vis[temp[0]][temp[1] - 1]) {
				queue.push([temp[0], temp[1] - 1]);
			}
			if(temp[1] < size_of_map * 2 && [temp[0]][temp[1] + 1] == current_player && !vis[temp[0]][temp[1] + 1]) {
				queue.push([temp[0], temp[1] + 1]);
			}
		}
		console.log(queue);
	}
	return ul && dr;
}

function init() {
	for(var i = 0; i <= size_of_map * 2; ++ i) {
		for(var j = 0; j <= size_of_map * 2; ++ j) {
			map[i][j] = -1;
		}
	}
	
	var s = "";
	
	for(var i = 0; i <= size_of_map * 2; ++ i) {
		s += "<tr>";
		for(var j = 0; j <= size_of_map * 2; ++ j) {
			s += "<td>";
			if((i + j) % 2 == 1) {
				let player = i % 2;
				let color = players_colors[i % 2];
				s += `<div style="${getPointStyleString(color)}"></div>`;
				map[i][j] = player;
			} else if(i == 0 || i == size_of_map * 2) {
				if(0 < j && j < 2 * size_of_map) {
					let player = 0;
					map[i][j] = player;
					s += `<div style="${getHCrossStyleString(players_colors[player])}"></div>`;
				}
			} else if(j == 0 || j == size_of_map * 2) {
				if(0 < i && i < 2 * size_of_map) {
					let player = 1;
					map[i][j] = player;
					s += `<div style="${getVCrossStyleString(players_colors[player])}"></div>`;
				}
			} else if(i != 0 && i != size_of_map * 2 && j != 0 && j != size_of_map * 2) {
				s += `<div id="select_${i}_${j}" style="${getDefaultStyleString()}" onmouseover="mouseOverHighlight(this)" onmouseleave="mouseLeaveHighlight(this)" onclick="selectChoice(this)"></div>`;
			}
			s += "</td>";
		}
		s += "</tr>"
	}
	
	document.getElementById("map").innerHTML = s;
	
	setCurrentHighlight();
}
