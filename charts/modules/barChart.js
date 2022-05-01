const d3 = require("d3");

const {
    chartsMargins: axisMargins,
    d3ColorPalette: defaultColorPalette,
    fontSize: defaultFontSize
} = require("../constants");

const utils = require("../utils");

const barChartGeneration = () => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];

    const [dataValues = [], dataLabels = []] = data;

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    const width = window.innerWidth;
    const height = window.innerHeight;

    grafieks.chartsConfig.width = width;
    grafieks.chartsConfig.height = height;

    const chartsMargins = { ...axisMargins };

    const {
        yAxisConfig: { yLabelfontSize = defaultFontSize, yaxisStatus = true } = {},
        xAxisConfig: { xLabelfontSize = defaultFontSize, xaxisStatus = true } = {},
        d3ColorPalette = defaultColorPalette
    } = grafieks.plotConfiguration;

    // If xAxisLabel needs to be shown then add the 1.5 times the fontSize of xLabel to bottom margin
    if (xaxisStatus) {
        chartsMargins.bottom = chartsMargins.bottom + xLabelfontSize * 1.5;
    }

    // If yAxisLabel needs to be shown then add the 1.5 times the fontSize of yLabel to bottom margin
    if (yaxisStatus) {
        chartsMargins.left = chartsMargins.left + yLabelfontSize * 1.5;
    }

    // Setting margins to grafieks object to use it further
    grafieks.chartsConfig.margins = chartsMargins;

    const minValue = utils.getMinimumValue(dataValues[1]);
    const maxValue = utils.getMaximumValue(dataValues[1]);

    // Setting yScale
    const yDomain = [minValue, maxValue];
    const yRange = utils.getYRange();
    const yScale = utils.getYScale(yDomain, yRange);

    // Setting xScale
    const xDomain = dataValues[0];
    const xRange = utils.getXRange();
    const xScale = utils.getXScale(xDomain, xRange);

    // Exposing to utils, to be used in other places, like legend, tooltip, datalabels, axis etc.
    grafieks.utils.yScale = yScale;
    grafieks.utils.xScale = xScale;

    const xAxis = (g) =>
        g
            .attr("transform", `translate(0,${height - chartsMargins.bottom})`)
            .call(d3.axisBottom(grafieks.utils.xScale).tickSizeOuter(0))
            .selectAll("text")
            .style("text-anchor", "middle");

    // .attr("dx", "-.8em")
    // .attr("dy", "-0.5em")
    // .attr("transform", "rotate(-90)");

    const yAxis = (g) =>
        g.attr("transform", `translate(${chartsMargins.left},0)`).call(
            d3
                .axisLeft(grafieks.utils.yScale)
                .tickSize(0)
                // .tickSize(-utils.getAxisWidth())
                .ticks(utils.getNumberOfTicks())
                .tickFormat(d3.format(".2s"))
        );

    const svg = utils.getSvg();
    // .call(zoom);

    svg.append("g").attr("class", "x-axis").call(xAxis);
    svg.append("g").attr("class", "y-axis").call(yAxis);

    svg.append("g")
        .attr("class", "bars")
        .attr("fill", d3ColorPalette[0])
        .selectAll("rect")
        .data(dataValues[0])
        .join("rect")
        .attr("class", "visualPlotting")
        .attr("x", function (_, i) {
            const xValue = dataValues[0][i];
            this.setAttribute("data-value-x1", xValue);
            return xScale(xValue);
        })
        .attr("y", function (_, i) {
            const value = dataValues[1][i];
            let yValue = null;
            if (value < 0) {
                yValue = yScale(0);
            } else {
                yValue = yScale(value);
            }
            this.setAttribute("data-value-y1", value);
            return yValue;
        })
        .attr("height", function (_, i) {
            const value = dataValues[1][i];
            var height = Math.abs(yScale(0) - yScale(Math.abs(value)));
            if (!height) {
                height = 0.1;
            }
            return height;
        })
        .attr("width", xScale.bandwidth());

    return svg;
};
module.exports = barChartGeneration;
