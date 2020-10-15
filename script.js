d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
            sortedData = data;
            sortedData.sort((a,b) => b.Population - a.Population);
            console.log('Data', sortedData);
        
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 650 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;       
        
    var svg = d3.select('.chart')
                .append('svg')
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    const xScale = d3.scaleLinear() 
                     .domain([d3.min(sortedData, d => d.Income), d3.max(sortedData, d => d.Income)])
                     .range([0, width]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(sortedData, d => d.LifeExpectancy), d3.max(sortedData, d => d.LifeExpectancy)])
                     .range([height,0]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    const lengthData = sortedData.length;
    const radius = width / lengthData;
    const legendPadding = 5;
    const legendFont = 12;

    const circleScale = d3.scalePow().exponent(0.5)
                          .domain([0, d3.max(sortedData, d => d.Population)])
                          .range([1, radius * 5]);
               
    var circles = svg.selectAll("circle")
                     .data(sortedData)
                     .enter()
                     .append("circle")
                     .attr('cx', d => xScale(d.Income))
                     .attr('cy', d => yScale(d.LifeExpectancy))
                     .attr("fill-opacity", .9)
                     .attr("r", d => circleScale(d.Population))
                     .attr("fill", d => colorScale(d.Region))
                     .on("mouseenter", (event, d) => {
                        const pos = d3.pointer(event, window);
                        
                        var tooltip = d3.select(".tooltip")
                                        .style('top', pos[1] + "px")
                                        .style('left', pos[0] + "px")
                                        .style('display', 'block')
                                        .style('position', 'fixed')
                                        .style("border", "solid")
                                        .style("border-width", "2px")
                                        .style("border-radius", "10px")
                                        .style("padding", "10px")
                                        .style("background-color", "black")
                                        .style("color","white")
                                        .html(
                                            "<p id='tooltip'> Country: " + d.Country + "<br> Region: " + d.Region + "<br> Population: " 
                                            +  d3.format(",d")(d.Population) + "<br> Income: " 
                                            + d3.format(",d")(d.Income) + "<br> Life Expectancy: " + d.LifeExpectancy);
                        })

                     .on("mouseleave", (event, d) => {
                        d3.select('.tooltip').style('display', 'none');
                    });

    const xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5, "s");
                 
    svg.append("g")
       .attr("class", "axis x-axis")
       .call(xAxis)
       .attr("transform", `translate(0, ${height})`);

    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5, "s"); 
    
    svg.append("g")
       .attr("class", "axis y-axis")
       .call(yAxis);                


    var xLabel = svg.append("text")
                    .attr('x', width - 20)
                    .attr('y', height - margin.bottom / 2) 
                    .attr('alignment-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .attr('font-size',18)
                    .text("Income")

    var yLabel = svg.append("text")
                    .attr('x', margin.left + 30)
                    .attr('y', -10)
                    .attr('alignment-baseline', 'middle')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 18)
                    .text("Life Expectancy");

    var legend = svg.append("g")
                    .attr("transform", 'translate(' + 0.78 * width + ',' + 
                    (height - 2.3 * (colorScale.domain().length) * legendFont) + ')')
    
    legend.selectAll('rect')                     
        .data(colorScale.domain())                                   
        .enter()                                                
        .append('rect')                                            
        .attr('class', 'box')
        .attr("height", legendFont) 
        .attr("width", legendFont)
        .attr('x', -20)
        .attr('y', (d,i) => i * 1.8 * legendFont)
        .attr('fill', d => colorScale(d));

    legend.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr('x', legendFont - 15)
        .attr('y', (d,i) => 1 + i * 1.8 * legendFont)
        .attr('font-size', legendFont)
        .attr('text-anchor', 'beginning')
        .attr('alignment-baseline', 'hanging')
        .text(d => d);
        })