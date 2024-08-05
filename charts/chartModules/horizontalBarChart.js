const d3 = require("d3");

const CONSTANTS = require("../constants");
const { isDateFormat } = require("../modules/dataTransformation");

const utils = require("../utils");

const chartGeneration = (svg) => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];
    const { chartName, dataColumns: { xAxisColumnDetails = [], yAxisColumnDetails = [] } = {} } =
    grafieks.plotConfiguration;
    console.log("yAxisColumnDetails",yAxisColumnDetails)
    let itemType = yAxisColumnDetails[0].itemType;
    // debugger;
    let { dataValues = [], dataLabels = [] } = data;
    console.log("grafieks.dataUtils.dataCombined",grafieks.dataUtils.dataCombined)
    if (isDateFormat(itemType)) {
        // const { dataValuess = [], dataLabels = [] } = data;
         dataValues = grafieks.dataUtils.dataCombined;
        grafieks.dataUtils.dataLabels = dataLabels;
        grafieks.legend.data = [dataLabels.yAxisLabel];
    } else {
        // let { dataValues = [], dataLabels = [] } = data;

        grafieks.dataUtils.dataValues = dataValues;
        grafieks.dataUtils.dataLabels = dataLabels;
        grafieks.dataUtils.dataLabelValues = dataValues[1];
        grafieks.legend.data = [dataLabels.yAxisLabel];
    }
    // const { dataValues = [], dataLabels = [] } = data;

    // grafieks.dataUtils.dataValues = dataValues;
    // grafieks.dataUtils.dataLabels = dataLabels;

    grafieks.dataUtils.dataLabelValues = dataValues[1];

    // grafieks.legend.data = [dataLabels[0]];

    const { height } = grafieks.chartsConfig;
    console.log("dataValues",dataValues)
    const numericalValues = dataValues.map((d) => d[1]);
    const minValue = utils.getMinimumValue(numericalValues);
    const maxValue = utils.getMaximumValue(numericalValues);

    // Setting yScale
    const yDomain = dataValues.map((d) => d[0]);
    const yRange = utils.getYRange();
    const yScale = utils.getYScale(yDomain, yRange);

    // Setting xScale
    const xDomain = [minValue, maxValue];
    const xRange = utils.getXRange();
    const xScale = utils.getXScale(xDomain, xRange);

    // Exposing to utils, to be used in other places, like legend, tooltip, datalabels, axis etc.
    grafieks.utils.yScale = yScale;
    grafieks.utils.xScale = xScale;

    const xAxis = (options = {}, g) => {
        const {
            xTickfontSize = CONSTANTS.defaultValues.fontSize,
            xTickfontFamily = CONSTANTS.defaultValues.fontFamily,
            xTickfontColor = CONSTANTS.defaultValues.fontColor
        } = window.grafieks.plotConfiguration;
        const chartsMargins = window.grafieks.chartsConfig.margins;

        const ticks = g
            .attr("transform", `translate(${chartsMargins.left + chartsMargins.horizontalLeft},0)`)
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(0) // To remove the tick marks (The dashed solid lines)
                    .ticks(utils.getNumberOfTicks())
            )
            .selectAll("text");

        ticks.attr("font-size", xTickfontSize);
        ticks.attr("font-family", xTickfontFamily);
        ticks.attr("fill", xTickfontColor);

        return ticks;
    };

    const yAxis = (options = {}, g) => {
        const {
            yTickfontSize = CONSTANTS.defaultValues.fontSize,
            yTickfontFamily = CONSTANTS.defaultValues.fontFamily,
            yTickfontColor = CONSTANTS.defaultValues.fontColor
        } = window.grafieks.plotConfiguration;
        const chartsMargins = window.grafieks.chartsConfig.margins;

        let { textAnchor = "middle", translateY = height - chartsMargins.bottom } = options;
        // Adding rotating margin to xAxis so that when it is rotated things are visible fine
        const ticks = g
            .attr("transform", `translate(0,${translateY - (chartsMargins.rotatingMargin || 0)})`)
            .call(d3.axisBottom(xScale).ticks(utils.getNumberOfTicks()).tickSizeOuter(0).tickFormat(d3.format(".2s")))
            .selectAll("text");

        // If ticking config is vertical -> rotating the tick to 90 degrees
        if (grafieks.chartsConfig.ticksStyle == CONSTANTS.TICK_VERTICAL) {
            let yTickfontSizeTemp = yTickfontSize / 2;
            if (yTickfontSize < 16) {
                yTickfontSizeTemp -= 2;
            }
            ticks.attr("dx", "-.8em").attr("dy", `-0.${yTickfontSizeTemp}em`).attr("transform", "rotate(-90)");
            textAnchor = "end";
        }

        ticks.attr("text-anchor", textAnchor);
        ticks.attr("font-size", yTickfontSize);
        ticks.attr("font-family", yTickfontFamily);
        ticks.attr("fill", yTickfontColor);

        return ticks;
    };

    svg.append("g").attr("class", "x-axis").call(yAxis.bind(this, {}));
    svg.append("g").attr("class", "y-axis").call(xAxis.bind(this, {}));

    const { d3colorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

    svg.append("g")
        .attr("class", "bars")
        .attr("fill", d3colorPalette[0])
        .selectAll("rect")
        .data(dataValues)
        .join("rect")
        .attr("class", "visualPlotting")
        .attr("x", function (d) {
            const value = d[1];
            if (minValue > 0) {
                return 0;
            }
            this.setAttribute("data-value-y1", value);
            return xScale(Math.min(0, value));
        })
        .attr("y", function (d) {
            const xValue = d[0];
            this.setAttribute("data-value-x1", xValue);
            return yScale(xValue);
        })
        .attr("width", function (d, i) {
            const value = d[1];
            var width = Math.abs(xScale(0) - xScale(Math.abs(value)));
            if (!width) {
                width = 0.1;
            }
            return width;
        })
        .attr("height", yScale.bandwidth());

    return svg;
};
module.exports = chartGeneration;
