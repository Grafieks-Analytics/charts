const d3 = require("d3");
const CONSTANTS = require("../constants");
const { getNumberOfTicks, getAxisWidth, getYRange } = require("../utils");

const makeYaxisGridLines = (scale) => {
    return d3.axisLeft(scale).ticks(getNumberOfTicks()).tickSize(-getAxisWidth()).tickFormat(d3.format(".2s"));
};

const makeXaxisGridLines = (scale) => {
    const yRange = getYRange();
    return d3
        .axisBottom(scale)
        .tickSize(yRange[0] - yRange[1])
        .tickFormat("")
        .ticks(getNumberOfTicks());
};

const isExceptionChart = () => {
    const exceptionCharts = [CONSTANTS.HEAT_MAP];

    let { chartName } = grafieks.plotConfiguration;

    if (exceptionCharts.indexOf(chartName) > -1) {
        return true;
    }
    return false;
};

const setGrids = (svg, chartsGrid) => {
    if (isExceptionChart()) {
        return;
    }

    const grafieks = window.grafieks;
    console.log(grafieks)
    const chartsMargins = grafieks.chartsConfig.margins;

    let transformValue = `translate(${chartsMargins.left},0)`;
    let scale = makeYaxisGridLines(grafieks.utils.yScale);
    if (grafieks.plotConfiguration.isHorizontalGraph) {
        scale = makeXaxisGridLines(grafieks.utils.xScale);
        transformValue = `translate(0,${chartsMargins.top})`;
    }

    const gridDash = chartsGrid.gridDash;
    const strokeWidth = chartsGrid.strokeWidth;

    svg.append("g")
        .lower() // lower() Works like Prepend in jquery
        .attr("class", "grid")
        .attr("transform", transformValue)
        .style("stroke-width", strokeWidth) //this is not user selectable
        .attr("stroke-dasharray", gridDash ? "5,5": "0,0") //Dash Size, Dash Gap Size
        .call(scale)
        .selectAll('.tick text').filter(function() { return d3.select(this).text() === '0.0'}).each(function() {
            d3.select(this.parentNode).remove();
        });
};

module.exports = {
    setGrids
};
