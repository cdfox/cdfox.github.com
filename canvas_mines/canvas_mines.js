var size = 25; // length of one side of a square on the game board

$(main);
 
function main() {
	$(".difficulty").click(fill_in_default);
	$("button#new_game").click(new_game);
}
 
function fill_in_default() {
	var rows = $("input#rows");
	var columns = $("input#columns");
	var mines = $("input#mines");
	
	if (this.id == "easy") {
		rows.val(9);
		columns.val(9);
		mines.val(10);
	} else if (this.id == "medium") {
		rows.val(16);
		columns.val(16);
		mines.val(40);	
	} else if (this.id == "hard") {
		rows.val(16);
		columns.val(30);
		mines.val(99);	
	}
}
 
function new_game() {
	var row_input = $("input#rows");
	var column_input = $("input#columns");
	var mine_input = $("input#mines");

	var rows = parseInt(row_input.val());
	var columns = parseInt(column_input.val());
	var mines = parseInt(mine_input.val());
	
	var canvas = $("canvas")[0];
	
	board = new Board(canvas, rows, columns, mines);
	board.draw();	
}

function Board(canvas, rows, columns, mines) {
	var board = this;

	canvas.width = columns * size;
	canvas.height = rows * size;

	this.flagImg = new Image();
	this.flagImg.src = "flag.png";
	this.mineImg = new Image();
	this.mineImg.src = "mine.png";
	this.explosionImg = new Image();
	this.explosionImg.src = "explosion.png";

	this.canvas = canvas
	this.ctx = canvas.getContext('2d');
	this.rows = rows;
	this.columns = columns;
	this.mines = mines;
	this.squares_revealed = 0;
	
	this.squares = [];
	var squares_left = rows * columns;
	for (var i = 0; i < rows; i++) {
		var row = [];
		for (var j = 0; j < columns; j++) {
			var square = {
				mine: false, 
				flag: false, 
				revealed: false,
				exploded: false,
				number: 0
			};

			// distribute mines uniformly at random
			if (mines > 0 && Math.random() < mines / squares_left) {
				square.mine = true;
				mines--;
			}
			squares_left--;

			row.push(square)
		}
		this.squares.push(row);
	}
	
	this.canvas.onclick = function(event) {
		var x = event.offsetX;
		var y = event.offsetY;

		var column = Math.floor(x / size);
		var row = Math.floor(y / size);

		var square = board.squares[row][column];
		if (!square.revealed) {
			if (event.shiftKey) {
				square.flag = !square.flag;
			} else {
				if (square.mine) {
					square.exploded = true;
					board.reveal_all();
				} else {
					board.sweep(row, column);
				}
			}
			board.draw();		
		}
	};
	
	this.draw = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.columns; j++) {

				var square = this.squares[i][j];
				if (square.revealed) {
					this.ctx.fillStyle = "silver";
					this.ctx.fillRect(j * size, i * size, size, size);
					if (square.mine) {
						if (square.exploded) {
							this.ctx.drawImage(
								this.explosionImg, 
								j * size, 
								i * size
							);
						}
						else {  // not exploed
							this.ctx.drawImage(
								this.mineImg, 
								j * size, 
								i * size
							);
						}
					} else {  // no mine
						if (square.number > 0) {
							this.ctx.fillStyle = "blue";
							this.ctx.font = "20px sans-serif";
							this.ctx.fillText(
								square.number, 
								j * size + 7, 
								i * size + 20
							);
						}
					} 
				} else {  // not revealed
					this.ctx.fillStyle = "gray";
					this.ctx.fillRect(j * size, i * size, size, size);
					if (square.flag) {
						this.ctx.drawImage(this.flagImg, j * size, i * size);
					}
				}

				this.ctx.strokeStyle = "black";
				this.ctx.strokeRect(j * size, i * size, size, size);
			}
		}
	};

	this.reveal_all = function() {
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.columns; j++) {
				this.squares[i][j].revealed = true;
			}
		}
	};

	this.sweep = function(row, column) {
		var stack = [];
		stack.push({
			row: row, 
			column: column
		});

		while (stack.length > 0) {
			var position = stack.pop();
			var row = position.row;
			var column = position.column;

			var mines = 0;
			var neighbors = [];
			for (var i = row - 1; i <= row + 1; i++) {
				for (var j = column - 1; j <= column + 1; j++) {
					if (i >= 0 && i < this.rows &&  // row within bounds
						j >= 0 && j < this.columns &&  // column within bounds
						!(i == row && j == column )) {  // not this square
						var square = this.squares[i][j];
						if (square.mine) {
							mines++;
						}
						if (!square.revealed) {
							neighbors.push({
								row: i, 
								column: j
							});
						}
					}
				}
			}

			this.squares[row][column].revealed = true;
			if (mines > 0) {
				this.squares[row][column].number = mines;
			} else {  // no mines, so add unexplored neigbhors to stack
				while (neighbors.length > 0) {
					stack.push(neighbors.pop());
				}
			}
		}

		var win = true;
		for (var i = 0; i < this.rows; i++) {
			for (var j = 0; j < this.columns; j++) {
				var square = this.squares[i][j];
				if (!square.revealed) {
					win = win && square.mine;
				}
			}
		}
		if (win) {
			this.reveal_all();
		}
	};
}
