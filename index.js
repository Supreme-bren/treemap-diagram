
const movieUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const req = new XMLHttpRequest();
req.open('GET', movieUrl, true);
req.send();
req.onload = () =>{
    movieData = JSON.parse(req.responseText);
    drawMap();
}

let gameData;
let movieData;
let pledgeData;

const svg = d3.select('#chart');
const hoverTool  = d3.select('#tooltip');

const drawMap  = () =>{
    let hierarchy = d3.hierarchy(movieData, (d) => d['children']).sum((d) => {
        return d['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })
    
    let createTreeMap  = d3.treemap().size([1000,600])
    createTreeMap(hierarchy)
    
    let movieSquare = hierarchy.leaves();


    let title = svg.selectAll('g').data(movieSquare).enter().append('g')
                    .attr('transform', (movie) =>{
                        return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
                    })

    title.append('rect').attr('class', 'tile').attr('fill', (movie) =>{
        let subject = movie['data']['category'];
        if(subject === 'Action'){
            return 'orange'
        }
        else if (subject === 'Drama'){
            return 'lightgreen'
        }
        else if(subject === 'Adventure'){
            return 'coral'
        }
        else if(subject === 'Family'){
            return 'lightblue'
        }
        else if(subject === 'Animation'){
            return 'pink'
        }
        else if(subject === 'Comedy'){
            return 'khaki'
        }
        else if(subject === 'Biography'){
            return 'tan'
        }
    })
    .attr('data-name', (movieData) => movieData['data']['name'])
    .attr('data-category', (movieData) =>{
        return movieData['data']['category']
    })
    .attr('data-value', (movieData) =>{
        return movieData['data']['value']
    })
    .attr('width', (movieData) =>{
        return movieData['x1'] - movieData['x0']   
     })
     .attr('height', (movieData) => {
        return movieData['y1'] - movieData['y0']
     })

     .on('mouseover', (d) =>{
        hoverTool.transition().style('visibility', 'visible')

        let revenueMade = d['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        hoverTool.html(
                '$' + revenueMade + '<hr />' + d['data']['name']
        )
        hoverTool.attr('data-value', d['data']['value'])
        })
     .on('mouseout', (d) => {
        hoverTool.transition().style('visibility', 'hidden')
     })
     title.append('text').text((d) => {
        return d['data']['name']
     })
     .attr('x', 5).attr('y', 20)
}