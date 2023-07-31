const MAP_DISPLAY_SCALE = 7 / 10;
const ELEMENTS_SQUARE_SIZE = 40 * MAP_DISPLAY_SCALE;
const DIAMETER_OF_CIRCLE = 10 * MAP_DISPLAY_SCALE;
const MARGIN = (ELEMENTS_SQUARE_SIZE - DIAMETER_OF_CIRCLE) / 2;
const PLAYERS_COLORS = ["red", "blue"];

var size_of_map;
var map;
var current_player;
var current_turn;
var isWin;

function getDefaultStyleString() {
	return `width: ${ELEMENTS_SQUARE_SIZE}px; height: ${ELEMENTS_SQUARE_SIZE}px; background-color: black;`
}
function getHCrossStyleString(color) {
	return `width: ${ELEMENTS_SQUARE_SIZE * 2 + DIAMETER_OF_CIRCLE}px; height: ${DIAMETER_OF_CIRCLE}px; border: 1px solid ${color}; background-color: ${color}; position: absolute; transform: translate(-${MARGIN + DIAMETER_OF_CIRCLE}px, -${DIAMETER_OF_CIRCLE / 2}px);`;
}
function getVCrossStyleString(color) {
	return `height: ${ELEMENTS_SQUARE_SIZE * 2 + DIAMETER_OF_CIRCLE}px; width: ${DIAMETER_OF_CIRCLE}px; border: 1px solid ${color}; background-color: ${color}; position: absolute; transform: translate(${MARGIN}px, -${ELEMENTS_SQUARE_SIZE + DIAMETER_OF_CIRCLE / 2}px);`;
}
function getPointStyleString(color) {
	return `width: ${DIAMETER_OF_CIRCLE}px; height: ${DIAMETER_OF_CIRCLE}px; MARGIN: ${MARGIN}px; border: 1px solid ${color}; border-radius: 50%; background-color: ${color};`;
}

function setCurrentHighlight() {
	document.getElementById("currentPlayer").innerHTML = "#" + current_player;
	document.getElementById("currentPlayer").style.color = PLAYERS_COLORS[current_player];
	document.getElementById("currentTurn").innerHTML = current_turn;
	
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
				res = getVCrossStyleString(PLAYERS_COLORS[current_player]);
			} else if(current_player == 0 && i % 2 == 0 || current_player == 1 && i % 2 == 1) {
				res = getHCrossStyleString(PLAYERS_COLORS[current_player]);
			}
			document.getElementById(id).style = res + "opacity: 0; cursor: pointer;";
		}
	}
}
function mouseOverHighlight(node) {
	if(isWin) return;
	node.style.opacity = 0.5;
}
function mouseLeaveHighlight(node) {
	if(isWin) return;
	node.style.opacity = 0.0;
}
function mouseClickedHighlight(node) {
	if(isWin) return;
	node.onmouseover = null;
	node.onmouseleave = null;
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
	
	++ current_player;
	current_turn += Math.floor(current_player / 2);
	current_player %= 2;
	
	setCurrentHighlight();
}
function checkWhetherWin(fromI, fromJ) {
	const vis = Array.from(Array(size_of_map * 2 + 1), () => new Array(size_of_map * 2 + 1));
	for(var i = 0; i <= size_of_map * 2; ++ i) {
		for(var j = 0; j <= size_of_map * 2; ++ j) {
			vis[i][j] = false;
		}
	}
	
	const queue = [[parseInt(fromI), parseInt(fromJ)]];
	var ul = false, dr = false;
	while(queue.length > 0) {
		let temp = queue.shift();
		if(vis[temp[0]][temp[1]]) continue;
		vis[temp[0]][temp[1]] = true;
		if(temp[0] == 0 || temp[1] == 0 || temp[0] == size_of_map * 2 || temp[1] == size_of_map * 2) {
			if(temp[0] == 0 || temp[1] == 0) ul = true;
			if(temp[0] == size_of_map * 2 || temp[1] == size_of_map * 2) dr = true;
		}
		if(temp[0] > 0 && map[temp[0] - 1][temp[1]] == current_player && !vis[temp[0] - 1][temp[1]]) {
			queue.push([temp[0] - 1, temp[1]]);
		}
		if(temp[0] < size_of_map * 2 && map[temp[0] + 1][temp[1]] == current_player && !vis[temp[0] + 1][temp[1]]) {
			queue.push([temp[0] + 1, temp[1]]);
		}
		if(temp[1] > 0 && map[temp[0]][temp[1] - 1] == current_player && !vis[temp[0]][temp[1] - 1]) {
			queue.push([temp[0], temp[1] - 1]);
		}
		if(temp[1] < size_of_map * 2 && map[temp[0]][temp[1] + 1] == current_player && !vis[temp[0]][temp[1] + 1]) {
			queue.push([temp[0], temp[1] + 1]);
		}
	}
	return ul && dr;
}

function refresh() {
	size_of_map = parseInt(document.getElementById("sizeOfMap").value);
	map = Array.from(Array(size_of_map * 2 + 1), () => new Array(size_of_map * 2 + 1));
	
	current_player = 0;
	current_turn = 1;
	
	isWin = false;
	
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
				let color = PLAYERS_COLORS[i % 2];
				s += `<div style="${getPointStyleString(color)}"></div>`;
				map[i][j] = player;
			} else if(i == 0 || i == size_of_map * 2) {
				if(0 < j && j < 2 * size_of_map) {
					let player = 0;
					map[i][j] = player;
					s += `<div style="${getHCrossStyleString(PLAYERS_COLORS[player])}"></div>`;
				}
			} else if(j == 0 || j == size_of_map * 2) {
				if(0 < i && i < 2 * size_of_map) {
					let player = 1;
					map[i][j] = player;
					s += `<div style="${getVCrossStyleString(PLAYERS_COLORS[player])}"></div>`;
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

function init() {
	var s = "";
	for(var i = 1; i <= 10; ++ i) {
		s += `<option${i >= 10 ? " selected" : ""}>${i}</option>`
	}
	
	document.getElementById("sizeOfMap").innerHTML = s;
	
	refresh();
}
