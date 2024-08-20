const d3 = require("d3");

const CONSTANTS = require("../constants");

const utils = require("../utils");
const { sortDates } = require("../modules/dataTransformation");

const getMaximumValue = (data) => {
    return d3.max(data, function (d) {
        return d3.max(
            d.components.map((d1) => {
                return d1.y0;
            })
        );
    });
};

const getMinimumValue = (data) => {
    let minValue =
        d3.min(data, function (d) {
            return d3.min(
                d.components.map((d1) => {
                    return d1.y1;
                })
            );
        }) || 0;

    if (minValue > 0) {
        minValue = 0;
    }
    return minValue;
};

function transformDataValues(dataValues) {
    const dataObject = Object.values(dataValues);
    const keys = Object.keys(dataValues);

    dataObject.forEach((obj, i) => {
        obj.key = keys[i];
    });
    return dataObject;
}

const chartGeneration = (svg) => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];
    console.log("data to be converted",data)
    let { dataValues = {}, legendsData = [], axisTextValues = [], dataLabels = [] } = data;
    const { dataColumns = {}, xaxisConfig: { xaxisStatus }, yaxisConfig: { yaxisStatus } } = grafieks.plotConfiguration;
    const { yAxisColumnDetails = [] } = dataColumns;

    let isDateTransforming = false;
    if (yAxisColumnDetails[0].itemType == "Date") {
        isDateTransforming = true;
    }

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    grafieks.dataUtils.dataLabelValues = dataValues[1];

    const { height } = grafieks.chartsConfig;

    axisTextValues = Object.keys(dataValues);
    dataValues = transformDataValues(dataValues);
    const splitKeys = Array.from(
        new Set(
            dataValues
                .map((d) => {
                    return Object.keys(d);
                })
                .join()
                .split(",")
        )
    ).filter((d) => d != "key");

    legendsData = splitKeys;
    grafieks.legend.data = legendsData;

    dataValues.forEach(function (d) {
        var y0_positive = 0;
        var y0_negative = 0;
        var mainKey = d.key;
        d.components = splitKeys.map(function (key) {
            if (d[key] >= 0) {
                return {
                    key,
                    mainKey,
                    y1: y0_positive,
                    y0: (y0_positive += d[key] || 0)
                };
            } else {
                return {
                    key,
                    mainKey,
                    y0: y0_negative,
                    y1: (y0_negative += d[key] || 0)
                };
            }
        });
    });

    const minValue = getMinimumValue(dataValues);
    const maxValue = getMaximumValue(dataValues);

    // Setting yScale
    const yDomain =  axisTextValues;
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
            .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(d3.format(".2s")))
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

    if(xaxisStatus){
        svg.append("g").attr("class", "x-axis").call(yAxis.bind(this, {}));
    }
    
    if(yaxisStatus){
        svg.append("g").attr("class", "y-axis").call(xAxis.bind(this, {}));
    }
    

    // Setting center line
    const center = d3.scaleLinear().range(yRange);
    const centerLine = d3.axisLeft(center).ticks(0);

    // svg.append("g")
    //     .attr("class", "centerline")
    //     .attr("transform", "translate(0," + xScale(0) + ")")
    //     .call(centerLine.tickSize(0));

    const { d3colorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

    const color = d3.scaleOrdinal().domain(legendsData).range(d3colorPalette);

    const margins = grafieks.chartsConfig.margins;

    const entry = svg
        .selectAll(".entry")
        .data(dataValues)
        .enter()
        .append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
            return "translate(0, 0)";
        });

    entry
        .selectAll("rect")
        .data(function (d) {
            return d.components;
        })
        .enter()
        .append("rect")
        .attr("class", "bar visualPlotting")
        .attr("height", yScale.bandwidth())
        .attr("y", function (d) {
            return yScale(d.mainKey);
        })
        .attr("x", function (d) {
            return xScale(d.y1);
        })
        .attr("width", function (d) {
            this.setAttribute("data-value-x1", d.mainKey);
            this.setAttribute("data-value-x2", d.key);

            var yValue = d.y0 - d.y1;
            if (d.y1 < 0) {
                yValue = d.y1 - d.y0;
            }
            this.setAttribute("data-value-y1", Math.round(yValue));

            return Math.abs(xScale(d.y0) - xScale(d.y1));
        })
        .style("fill", function (d) {
            return color(d.key);
        });

    return svg;
};
module.exports = chartGeneration;