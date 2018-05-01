function labyrinthgenerator(rows, cols)
{
	var adjacency = [];
	for(var i = 0; i < rows*cols; i++)
		adjacency[i] = new Array(rows*cols);
	var visitedCells = [1];
	var siz = [rows, cols];
	
	var cellOrder = [];
	for(var i = 0; i < rows*cols; i++)
		cellOrder[i] = i;
	cellOrder = shuffleArray(cellOrder);	

	for(var cellCounter = 0; cellCounter < rows*cols; cellCounter++)
	{
		var currentCell = cellOrder[cellCounter];
		var cellsInPath = [currentCell];
		
		while(visitedCells.indexOf(currentCell) < 0)
		{
			var currentRow = Math.floor(currentCell/rows);
			var currentCol = currentCell % cols;
			var candidates = [];
			
			if(currentCol > 0)
			{
				var leftCell = currentCell-1;
				if(cellsInPath.indexOf(leftCell) < 0)
					candidates.push(leftCell);
			}
			if(currentCol < cols-1)
			{
				var rightCell = currentCell+1;
				if(cellsInPath.indexOf(rightCell) < 0)
					candidates.push(rightCell);
			}
			if(currentRow > 0)
			{
				var aboveCell = currentCell - cols;
				if(cellsInPath.indexOf(aboveCell) < 0)
					candidates.push(aboveCell);
			}
			if(currentRow < rows-1)
			{
				var belowCell = currentCell + cols;
				if(cellsInPath.indexOf(belowCell) < 0)
					candidates.push(belowCell);
			}
			
			var nCandidates = candidates.length;
			var nextCell = -1;
			if(nCandidates)
			{
				candidates = shuffleArray(candidates);
				for(var i = 0; i < nCandidates; i++)
				{
					if(visitedCells.indexOf(candidates[i]) >= 0)
					{
						if(Math.random() < 0.05)
						{
							nextCell = candidates[i];
							break;
						}
					}
					else
					{
						nextCell = candidates[i];
						break;
					}
				}
				if(nextCell > 0)
				{
					//console.log(currentCell + "-" + nextCell);
					cellsInPath.push(nextCell);
					adjacency[nextCell][currentCell] = true;
					adjacency[currentCell][nextCell] = true;
					currentCell = nextCell;
				}
				else
					break;
			}
			else
				break;
		}
		visitedCells = visitedCells.concat(cellsInPath);
	}
	
	var visibleCells = cellsInCluster(adjacency, 1, rows, cols);
	for(var i = 0; i < rows*cols; i++)
	{
		if(visibleCells.indexOf(i) < 0)
		{
			adjacency = openCluster(adjacency, visibleCells, rows, cols);
			visibleCells = cellsInCluster(adjacency, i, rows, cols);
		}
	}
	return adjacency;
}

function cellsInCluster(adjacency, cell, rows, cols)
{
	var activeCells = [cell];
	var deadCells = [];
	
	while(activeCells.length)
	{
		var currentCell = activeCells[0];
		var currentRow = Math.floor(currentCell/rows);
		var currentCol = currentCell % rows;
		if(currentCol > 0)
		{
			var leftCell = currentCell-1;
			if(adjacency[activeCells[0]][leftCell] && deadCells.indexOf(leftCell) < 0)
				activeCells.push(leftCell);
		}
		if(currentCol < cols-1)
		{
			var rightCell = currentCell+1;
			if(adjacency[activeCells[0]][rightCell] && deadCells.indexOf(rightCell) < 0)
				activeCells.push(rightCell);
		}
		if(currentRow > 0)
		{
			var aboveCell = currentCell - cols;
			if(adjacency[activeCells[0]][aboveCell] && deadCells.indexOf(aboveCell) < 0)
				activeCells.push(aboveCell);
		}
		if(currentRow < rows-1)
		{
			var belowCell = currentCell + cols;
			if(adjacency[activeCells[0]][belowCell] && deadCells.indexOf(belowCell) < 0)
				activeCells.push(belowCell);
		}
		deadCells.push(activeCells.shift());
	}
	return deadCells;
}

function openCluster(adjacency, clusterCells, rows, cols)
{
	var nCells = clusterCells.length;
	clusterCells = shuffleArray(clusterCells);
	
	for(var i = 0; i < clusterCells.length; i++)
	{
		var currentCell = clusterCells[i];
		var currentRow = Math.floor(currentCell/rows);
		var currentCol = currentCell % cols;
		var candidates = [];
		
		if(currentCol > 0)
		{
			var leftCell = currentCell-1;
			if(clusterCells.indexOf(leftCell) < 0)
				candidates.push(leftCell);
		}
		if(currentCol < cols-1)
		{
			var rightCell = currentCell+1;
			if(clusterCells.indexOf(rightCell) < 0)
				candidates.push(rightCell);
		}
		if(currentRow > 0)
		{
			var aboveCell = currentCell - cols;
			if(clusterCells.indexOf(aboveCell) < 0)
				candidates.push(aboveCell);
		}
		if(currentRow < rows-1)
		{
			var belowCell = currentCell + cols;
			if(clusterCells.indexOf(belowCell) < 0)
				candidates.push(belowCell);
		}

		var nCandidates = candidates.length;		
		if(nCandidates)
		{
			candidates = shuffleArray(candidates);
			//console.log(currentCell + "-" + candidates[0]);			
			if(isEdgeCell(candidates[0], rows, cols))
			{
				if(nCandidates > 0)
				{
					adjacency[candidates[0]][currentCell] = true;
					adjacency[currentCell][candidates[0]] = true;
					break;
				}
			}
			else if(nCandidates > 1)
			{
				adjacency[candidates[0]][currentCell] = true;
				adjacency[currentCell][candidates[0]] = true;
				break;
			}
		}
	}
	return adjacency;
}

function isEdgeCell(cell, rows, cols)
{
	var cellRow = Math.floor(cell/rows);
	var cellCol = cell % cols;
	return cellRow == 0 || cellRow == rows-1 || cellCol == 0 || cellCol == cols-1;
}

function shuffleArray(arr)
{
	for(var i = 0; i < arr.length; i++)
	{
		var id = Math.floor(Math.random()*arr.length-i);
		var temp = arr[i+id];
		arr[i+id] = arr[i];
		arr[i] = temp;
	}
	return arr;
}
