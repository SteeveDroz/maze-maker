const maze = {}
$(function()
{
    maze.x = $('#maze').data('x')
    maze.y = $('#maze').data('y')
    maze.size = $('#maze').data('size')
    maze.path = []
    maze.canvas = $('<canvas>')
    maze.drawing = maze.canvas[0].getContext('2d')

    maze.drawing.width = maze.x * maze.size
    maze.drawing.height = maze.y * maze.size
    maze.canvas[0].width = maze.drawing.width + maze.size
    maze.canvas[0].height = maze.drawing.height + maze.size

    maze.cells = {}
    for (let i = 0; i < maze.x * maze.y; i++)
    {
        maze.cells[i] = {
            id: i,
            x: i % maze.x,
            y: Math.floor(i / maze.x),
            group: i
        }
    }

    const links = []
    for (let x = 0; x < maze.x; x++)
    {
        for (let y = 0; y < maze.y; y++)
        {
            if (x > 0)
            {
                links.push({
                    x1: x - 1,
                    y1: y,
                    x2: x,
                    y2: y
                })
            }
            if (y > 0)
            {
                links.push({
                    x1: x,
                    y1: y - 1,
                    x2: x,
                    y2: y
                })
            }
        }
    }
    shuffle(links)

    for (let i = 0; i < links.length; i++)
    {
        const link = links[i];
        const cell1 = maze.cells[maze.x * link.y1 + link.x1]
        const cell2 = maze.cells[maze.x * link.y2 + link.x2]

        if (cell1.group != cell2.group)
        {
            groupCells(cell1.group, cell2.group)
            maze.path.push({ start: cell1, end: cell2 })
        }
    }

    maze.drawing.fillStyle = 'black'
    maze.drawing.fillRect(0, 0, maze.drawing.width, maze.drawing.height)

    Object.keys(maze.cells).forEach(function(i)
    {
        const cell = maze.cells[i]

        maze.drawing.fillStyle = 'white'
        maze.drawing.fillRect(cell.x * maze.size + 2, cell.y * maze.size + 2, maze.size - 4, maze.size - 4)
    })

    maze.path.forEach(function(path)
    {
        maze.drawing.beginPath()
        maze.drawing.moveTo(path.start.x * maze.size + maze.size / 2, path.start.y * maze.size + maze.size / 2)
        maze.drawing.lineTo(path.end.x * maze.size + maze.size / 2, path.end.y * maze.size + maze.size / 2)
        maze.drawing.lineWidth = maze.size - 4
        maze.drawing.strokeStyle = 'white'
        maze.drawing.stroke()
    })

    $('body').append(maze.canvas)
})

const shuffle = function(list)
{
    for (let i = list.length; i; i--)
    {
        let j = Math.floor(Math.random() * i)
        const swapper = list[j]
        list[j] = list[i - 1]
        list[i - 1] = swapper
    }
}

const groupCells = function(group1, group2)
{
    Object.keys(maze.cells).forEach(function(key)
    {
        const cell = maze.cells[key]
        if (cell.group == group1)
        {
            cell.group = group2
        }
    })
}
