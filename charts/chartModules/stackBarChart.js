const d3 = require("d3");

const CONSTANTS = require("../constants");

const utils = require("../utils");

const getMaximumValue = (data) => {
    // if (window.limit) {
        return d3.max(data, function (d) {
            try {
                const value = d.components.map((d1) => {
                    return d1.y0;
                });
                return d3.max(value);
            } catch (error) {
                console.log("error", d, error);
                return 0;
            }
        });
    // } else {
    //     return 2000;
    // }
};

const getMinimumValue = (data) => {
    if (!window.limit) {
        let minValue =
            d3.min(data, function (d) {
                try {
                    const value = d.components.map((d1) => {
                        return d1.y1;
                    });
                    const min = d3.min(value);
                    console.log(min);
                    return min;
                } catch (error) {
                    console.log("error", d, error);
                    return 0;
                }
            }) || 0;
        if (minValue > 0) {
            minValue = 0;
        }
        return minValue;
    } else {
        return 0;
    }
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

    let { dataValues = {}, legendsData = [], axisTextValues = [], dataLabels = [] } = data;
    const { dataColumns = {} } = grafieks.plotConfiguration;
    const { xAxisColumnDetails = [] } = dataColumns;

    let isDateTransforming = false;
    if (xAxisColumnDetails[0].itemType == "Date") {
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
                // console.log("y0_negative",y0_negative)
                return {
                    key,
                    mainKey,
                    // y0: y0_negative,
                    y0: 6,
                    y1: (y0_negative += d[key] || 0)
                };
            }
        });
    });

    const minValue = getMinimumValue(dataValues);
    const maxValue = getMaximumValue(dataValues);

    // Setting yScale
    const yDomain = [minValue, maxValue];
    const yRange = utils.getYRange();
    const yScale = utils.getYScale(yDomain, yRange);

    // Setting xScale

    const xDomain = axisTextValues;
    const xRange = utils.getXRange();
    const xScale = utils.getXScale(xDomain, xRange);

    // Setting center line
    const center = d3.scaleLinear().range(xRange);
    const centerLine = d3.axisTop(center).ticks(0);

    const { d3colorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

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

        return ticks;
    };

    svg.append("g").attr("class", "x-axis").call(xAxis.bind(this, {}));
    svg.append("g").attr("class", "y-axis").call(yAxis);
    svg.append("g")
        .attr("class", "centerline")
        .attr("transform", "translate(0," + yScale(0) + ")")
        .call(centerLine.tickSize(0));
    if (!window.limit) {
        drawD3StackBarCharts();
    }

    // TODO:
    // ---------------------
    window.wdd = xScale.bandwidth();
    function drawD3StackBarCharts() {
        const color = d3.scaleOrdinal().domain(legendsData).range(d3colorPalette);

        const entry = svg
            .selectAll(".entry")
            .data(dataValues)
            .enter()
            .append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + xScale(d.key) + ", 0)";
            });

        entry
            .selectAll("rect")
            .data(function (d) {
                return d.components;
            })
            .enter()
            .append("rect")
            .attr("class", "bar visualPlotting")
            .attr("width", xScale.bandwidth())
            .attr("y", function (d) {
                return yScale(d.y0);
            })
            .attr("height", function (d) {
                this.setAttribute("data-value-x1", d.mainKey);
                this.setAttribute("data-value-x2", d.key);

                var yValue = d.y0 - d.y1;
                if (d.y1 < 0) {
                    yValue = d.y1 - d.y0;
                }
                this.setAttribute("data-value-y1", Math.round(yValue));

                return Math.abs(yScale(d.y0) - yScale(d.y1));
            })
            .style("fill", function (d) {
                return color(d.key);
            });
    }

    
    // ----------------

    return svg;
};
module.exports = chartGeneration;

/*
    [[["Bookcases","Furniture",114880.0078125],["Bookcases","Office Supplies",0],["Bookcases","Technology",0],["Chairs","Furniture",328449.21875],["Chairs","Office Supplies",0],["Chairs","Technology",0],["Labels","Furniture",0],["Labels","Office Supplies",12486.3125],["Labels","Technology",0],["Tables","Furniture",206965.5625],["Tables","Office Supplies",0],["Tables","Technology",0],["Storage","Furniture",0],["Storage","Office Supplies",223843.703125],["Storage","Technology",0],["Furnishings","Furniture",91705.3046875],["Furnishings","Office Supplies",0],["Furnishings","Technology",0],["Art","Furniture",0],["Art","Office Supplies",27118.76953125],["Art","Technology",0],["Phones","Furniture",0],["Phones","Office Supplies",0],["Phones","Technology",330006.6875],["Binders","Furniture",0],["Binders","Office Supplies",203413],["Binders","Technology",0],["Appliances","Furniture",0],["Appliances","Office Supplies",107532.1328125],["Appliances","Technology",0],["Paper","Furniture",0],["Paper","Office Supplies",78479.1953125],["Paper","Technology",0],["Accessories","Furniture",0],["Accessories","Office Supplies",0],["Accessories","Technology",167380.234375],["Envelopes","Furniture",0],["Envelopes","Office Supplies",16476.404296875],["Envelopes","Technology",0],["Fasteners","Furniture",0],["Fasteners","Office Supplies",3024.280029296875],["Fasteners","Technology",0],["Supplies","Furniture",0],["Supplies","Office Supplies",46673.5390625],["Supplies","Technology",0],["Machines","Furniture",0],["Machines","Office Supplies",0],["Machines","Technology",189238.53125],["Copiers","Furniture",0],["Copiers","Office Supplies",0],["Copiers","Technology",149528.015625]],["Bookcases","Chairs","Labels","Tables","Storage","Furnishings","Art","Phones","Binders","Appliances","Paper","Accessories","Envelopes","Fasteners","Supplies","Machines","Copiers"],["Furniture","Office Supplies","Technology"],["Category","Sales","Sub-Category"]]
*/
/*
    [
        [
            ["South", "Furniture", 117298.7109375],
            ["South", "Office Supplies", 125651.3125],
            ["South", "Technology", 148771.828125],
            ["West", "Furniture", 252612.984375],
            ["West", "Office Supplies", 220853.28125],
            ["West", "Technology", 251991.546875],
            ["Central", "Furniture", 163797.15625],
            ["Central", "Office Supplies", 167026.515625],
            ["Central", "Technology", 170416.28125],
            ["East", "Furniture", 208291.125],
            ["East", "Office Supplies", 205516.15625],
            ["East", "Technology", 264973.8125],
        ],  // Data 
        ["South", "West", "Central", "East"], // Sub Groups
        ["Furniture", "Office Supplies", "Technology"], // Groups
        ["Category", "Sales", "Region"],
    ];

*/
