const d3 = require("d3");

const CONSTANTS = require("../constants");

const utils = require("../utils");

const barChartGeneration = () => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];

    const [dataValues = [], dataLabels = []] = data;

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    grafieks.legend.data = [dataLabels[0]];

    const { height } = grafieks.chartsConfig;

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

    const xAxis = (options = {}, g) => {
        const chartsMargins = window.grafieks.chartsConfig.margins;
        let { textAnchor = "middle", translateY = height - chartsMargins.bottom } = options;
        // Adding rotating margin to xAxis so that when it is rotated things are visible fine
        const ticks = g
            .attr("transform", `translate(0,${translateY - (chartsMargins.rotatingMargin || 0)})`)
            .call(d3.axisBottom(grafieks.utils.xScale).tickSizeOuter(0))
            .selectAll("text");

        // If ticking config is vertical -> rotating the tick to 90 degrees
        if (grafieks.chartsConfig.ticksStyle == CONSTANTS.TICK_VERTICAL) {
            ticks.attr("dx", "-.8em").attr("dy", "-0.5em").attr("transform", "rotate(-90)");
            textAnchor = "end";
        }

        ticks.attr("text-anchor", textAnchor);

        return ticks;
    };

    const yAxis = (g) => {
        const chartsMargins = window.grafieks.chartsConfig.margins;
        return g.attr("transform", `translate(${chartsMargins.left},0)`).call(
            d3
                .axisLeft(grafieks.utils.yScale)
                .tickSize(0) // To remove the tick marks (The dashed solid lines)
                .ticks(utils.getNumberOfTicks())
                .tickFormat(d3.format(".2s"))
        );
    };

    const svg = utils.getSvg();
    // .call(zoom);

    svg.append("g").attr("class", "x-axis").call(xAxis.bind(this, {}));
    svg.append("g").attr("class", "y-axis").call(yAxis);

    const { d3ColorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

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
