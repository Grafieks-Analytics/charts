const d3 = require("d3");

const CONSTANTS = require("../constants");

const utils = require("../utils");
const { isDateFormat } = require("../modules/dataTransformation");

const chartGeneration = (svg) => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];
    const { chartName, dataColumns: { xAxisColumnDetails = [], yAxisColumnDetails = [] }, yAxisConfig: { yaxisStatus }, xAxisConfig: { xaxisStatus } = {} } =
        grafieks.plotConfiguration;
    let itemType = xAxisColumnDetails[0].itemType;
   
    let { dataValues = [], dataLabels = [] } = data;

    if (isDateFormat(itemType)) {
        // const { dataValuess = [], dataLabels = [] } = data;
         dataValues = grafieks.dataUtils.dataCombined;
        grafieks.dataUtils.dataLabels = dataLabels;
        grafieks.legend.data = [dataLabels.xAxisLabel];
    } else {
        // let { dataValues = [], dataLabels = [] } = data;

        grafieks.dataUtils.dataValues = dataValues;
        grafieks.dataUtils.dataLabels = dataLabels;
        grafieks.dataUtils.dataLabelValues = dataValues[1];
        grafieks.legend.data = [dataLabels.xAxisLabel];
    }

    const { height } = grafieks.chartsConfig;

    const numericalValues = dataValues.map((d) => d[1]);
    const minValue = utils.getMinimumValue(numericalValues);
    const maxValue = utils.getMaximumValue(numericalValues);

    // Setting yScale
    const yDomain = [minValue, maxValue];
    const yRange = utils.getYRange();
    const yScale = utils.getYScale(yDomain, yRange);

    // Setting xScale
    const xDomain = dataValues.map((d) => d[0]);
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
        let { textAnchor = "middle", translateY = height - chartsMargins.bottom } = options;
        // Adding rotating margin to xAxis so that when it is rotated things are visible fine
        const ticks = g
            .attr("transform", `translate(0,${translateY - (chartsMargins.rotatingMargin || 0)})`)
            .call(d3.axisBottom(grafieks.utils.xScale).tickSizeOuter(0))
            .selectAll("text");

        // If ticking config is vertical -> rotating the tick to 90 degrees
        if (grafieks.chartsConfig.ticksStyle == CONSTANTS.TICK_VERTICAL) {
            let xTickfontSizeTemp = xTickfontSize / 2;
            if (xTickfontSize < 16) {
                xTickfontSizeTemp -= 2;
            }
            ticks.attr("dx", "-.8em").attr("dy", `-0.${xTickfontSizeTemp}em`).attr("transform", "rotate(-90)");
            textAnchor = "end";
        }

        ticks.attr("text-anchor", textAnchor);
        ticks.attr("font-size", xTickfontSize);
        ticks.attr("font-family", xTickfontFamily);
        ticks.attr("fill", xTickfontColor);

        if(!xaxisStatus){
            g.select(".domain").remove()
        }

        return ticks;
    };

    const yAxis = (g) => {
        const chartsMargins = window.grafieks.chartsConfig.margins;

        const {
            yTickfontSize = CONSTANTS.defaultValues.fontSize,
            yTickfontFamily = CONSTANTS.defaultValues.fontFamily,
            yTickfontColor = CONSTANTS.defaultValues.fontColor
        } = window.grafieks.plotConfiguration;

        const ticks = g
            .attr("transform", `translate(${chartsMargins.left},0)`)
            .call(
                d3
                    .axisLeft(grafieks.utils.yScale)
                    .tickSize(0) // To remove the tick marks (The dashed solid lines)
                    .ticks(utils.getNumberOfTicks())
                    .tickFormat(d3.format(".2s"))
            )
            .selectAll("text");

        ticks.attr("font-size", yTickfontSize);
        ticks.attr("font-family", yTickfontFamily);
        ticks.attr("fill", yTickfontColor);

        if(!yaxisStatus){
            g.select(".domain").remove()
        }

        return ticks;
    };

    svg.append("g").attr("class", "x-axis").call(xAxis.bind(this, {}));
    svg.append("g").attr("class", "y-axis").call(yAxis);

    const { d3colorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

    // normal chart
    console.warn("window.limit", window.limit);
    if (!window.limit) {
        drawD3Charts();
    } else {
        drawD3FCCharts();
    }

    function drawD3Charts() {
        svg.append("g")
            .attr("class", "bars")
            .attr("fill", d3colorPalette[0])
            .selectAll("rect")
            .data(dataValues)
            .join("rect")
            .attr("class", "visualPlotting")
            .attr("x", function (d) {
                const xValue = d[0];
                this.setAttribute("data-value-x1", xValue);
                return xScale(xValue);
            })
            .attr("y", function (d) {
                const value = d[1];
                let yValue = null;
                if (value < 0) {
                    yValue = yScale(0);
                } else {
                    yValue = yScale(value);
                }
                this.setAttribute("data-value-y1", value);
                return yValue;
            })
            .attr("height", function (d, i) {
                const value = d[1];
                var height = Math.abs(yScale(0) - yScale(Math.abs(value)));
                if (!height) {
                    height = 0.1;
                }
                return height;
            })
            .attr("width", xScale.bandwidth());
    }

    function drawD3FCCharts() {
        // d3fc chart

        // Define the range of the y-axis scale
        var yScale = d3.scaleLinear().range([height, 0]); // Adjust the range based on your chart height

        // Alternatively, you can adjust the range dynamically based on the data
        var yMax = d3.max(dataValues, function (d) {
            return d[1];
        }); // Get the maximum data value
        var yScaleDynamic = d3
            .scaleLinear()
            .range([height, 0]) // Adjust the range based on your chart height
            .domain([0, yMax]);

        var barSeries = fc
            .autoBandwidth(fc.seriesCanvasBar())
            .crossValue((d) => d[0])
            .align("left")
            .mainValue((d) => d[1])
            .decorate((context, datum) => {
                context.textAlign = "center";
                context.fillStyle = "#000";
                context.font = "12px Arial";
                // context.fillText(d3.format(".1%")(datum.frequency), 0, -8);
                // context.fillText((datum.frequency), 0, -8);
                // context.fillStyle = "steelblue";
                // context.fillStyle =  "red";
                context.fillStyle = d3colorPalette[0];

                // context.fillStyle = isVowel(datum.letter) ? "indianred" : "steelblue";
            });
        var yExtent = fc
            .extentLinear()
            .accessors([(d) => Number(d[1])])
            // .pad([0, 0.1])
            .include([0]);
        console.log("yExtent(dataValues)", yExtent(dataValues));
        var chart = fc
            .chartCartesian(d3.scaleBand(), d3.scaleLinear())
            .xDomain(dataValues.map((d) => d[0]))
            .xPadding(0.1)
            .yDomain(yExtent(dataValues))
            // .yTicks(10, "%")
            .yOrient("left")
            .canvasPlotArea(barSeries);

        d3.select("#chart").datum(dataValues).call(chart);
    }

    return svg;
};
module.exports = chartGeneration;
