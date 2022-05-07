const d3 = require("d3");
const CONSTANTS = require("../constants");

const clearChart = () => {
    d3.select(".charts-div").html(""); // Clear Chart
    d3.select(".tooltip").html(""); // Clear Tooltip
    d3.select(".legend").html(""); // Clear legend
};

const formTooltipRow = (heading, value) => {
    if (!isNaN(value)) {
        value = (+value).toFixed(2);
    }
    return `<div class="tooltip-row">
                <span class="tooltip-heading">${heading}:</span>
                <span class="tooltip-value">${value}</span>
            </div>`;
};

const isAxisBasedChart = (chartName) => {
    return CONSTANTS.axisBasedCharts.includes(chartName);
};

const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const makeYaxisGridLines = (scale) => {
    return d3.axisLeft(scale).ticks(getNumberOfTicks()).tickSize(-getAxisWidth()).tickFormat(d3.format(".2s"));
};

// Getter Functions Starts
const getAxisWidth = () => {
    const margins = window.grafieks.chartsConfig.margins;
    return window.innerWidth - margins.left - margins.right;
};

const getMaximumValue = (array) => {
    let maxValue = d3.max(array);
    if (maxValue < 0) {
        maxValue = 0;
    }
    return maxValue;
};

const getMinimumValue = (array) => {
    let minValue = d3.min(array);
    if (minValue > 0) {
        minValue = 0;
    }
    return minValue;
};

const getNumberOfTicks = () => {
    return Math.floor(window.innerHeight / 70);
};

const getSvg = () => {
    const { width, height } = window.grafieks.chartsConfig;
    return d3.create("svg").attr("width", width).attr("height", height);
    //.attr("viewBox", [0, 0, width, height]);
};

const getToolTopValues = (element) => {
    const dataValues = element.dataset;
    const dataLabels = window.grafieks.dataUtils.dataLabels;
    let tooltipHtmlValue = [];
    switch (window.grafieks.plotConfiguration.chartName) {
        case CONSTANTS.BAR_CHART:
            tooltipHtmlValue.push(formTooltipRow(dataLabels[0], dataValues.valueX1));
            tooltipHtmlValue.push(formTooltipRow(dataLabels[1], dataValues.valueY1));
            break;
    }

    return tooltipHtmlValue.join("");
};

const getXRange = () => {
    const { width, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [chartsMargins.left, width - chartsMargins.right];
};

const getXScale = (domain, range, options = {}) => {
    const { padding = 0.25 } = options;
    return d3.scaleBand().domain(domain).range(range).padding(padding);
};

const getYRange = () => {
    const { height, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [height - chartsMargins.bottom, chartsMargins.top];
};
const getYScale = (domain, range) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

const getLegendDataHtml = () => {
    const legendData = window.grafieks.legend.data;
    const { d3ColorPalette = CONSTANTS.d3ColorPalette } = grafieks.plotConfiguration;

    const legendHtml = legendData
        .map((legend, i) => {
            const color = d3ColorPalette[i % d3ColorPalette.length];
            return `<div class="legend-column"> 
                        <div class="legendBox" style="background: ${color}"></div> 
                        <span>
                            ${legend}
                        </span>
                    </div>`;
        })
        .join("");
    return legendHtml;
};

// Getter Functions Ends

// Setter functions Starts

const setGrids = (svg) => {
    const chartsMargins = grafieks.chartsConfig.margins;
    svg.append("g")
        .lower() // lower() Works like Prepend in jquery
        .attr("class", "grid")
        .attr("transform", `translate(${chartsMargins.left},0)`)
        .style("stroke-width", "1")
        .call(makeYaxisGridLines(window.grafieks.utils.yScale));
};

const setInitialConfig = () => {
    const grafieks = (window.grafieks = window.grafieks || {}); // Setting grafieks's empty object to window

    // utils object will contain utility functions for the charts
    grafieks.utils = {};

    // data utils will contain all the values of data
    // Raw Data
    // Extracted Data
    // For Optmizing we can delete rawData key after extracting data from rawData to dataValues and dataLabels
    grafieks.dataUtils = {};

    // chart configuration will have
    // margins
    // width
    // height
    grafieks.chartsConfig = { margins: CONSTANTS.chartsMargins };

    // legend config; Will have margins to be used in tooltip
    grafieks.legend = {};
};

const setLengend = () => {
    const {
        legendConfig: {
            legendStatus = CONSTANTS.defaultValues.legendStatus,
            legendPosition = CONSTANTS.LEGEND_POSITION.RIGHT
        } = {}
    } = window.grafieks.plotConfiguration;

    if (legendStatus) {
        // Adding Legend in legend placeholder
        var legend = d3.select(".legend").node();
        var legendContentOuterDiv = document.createElement("div");

        switch (legendPosition) {
            case CONSTANTS.LEGEND_POSITION.RIGHT:
                d3.select(".legend")
                    .style("top", "0px")
                    .style("right", "0px")
                    .style("bottom", null)
                    .style("left", null)
                    .style("height", "100%")
                    .style("width", CONSTANTS.defaultValues.legendWidth + "px");

                grafieks.legend.topMargin = 0;
                grafieks.legend.leftMargin = 0;

                legendContentOuterDiv.className = "outerLegendDivVertical";
                legendContentOuterDiv.innerHTML = getLegendDataHtml();

                break;
            case CONSTANTS.LEGEND_POSITION.LEFT:
                d3.select(".legend")
                    .style("top", "0px")
                    .style("right", null)
                    .style("bottom", null)
                    .style("left", "0px")
                    .style("height", "100%")
                    .style("width", CONSTANTS.defaultValues.legendWidth + "px");

                grafieks.legend.topMargin = 0;
                grafieks.legend.leftMargin = 100;

                legendContentOuterDiv.className = "outerLegendDivVertical";
                legendContentOuterDiv.innerHTML = getLegendDataHtml();

                break;
            case CONSTANTS.LEGEND_POSITION.TOP:
                d3.select(".legend")
                    .style("top", "0px")
                    .style("right", null)
                    .style("bottom", null)
                    .style("left", null)
                    .style("height", CONSTANTS.defaultValues.legendHeight + "px")
                    .style("width", "100%");

                legendContentOuterDiv.className = "outerLegendDivHorizontal";
                legendContentOuterDiv.innerHTML = getLegendDataHtml();

                grafieks.legend.topMargin = CONSTANTS.defaultValues.legendHeight;
                grafieks.legend.leftMargin = 0;

                break;
            case CONSTANTS.LEGEND_POSITION.BOTTOM:
                d3.select(".legend")
                    .style("top", null)
                    .style("right", null)
                    .style("bottom", "0px")
                    .style("left", null)
                    .style("height", CONSTANTS.defaultValues.legendHeight + "px")
                    .style("width", "100%");

                legendContentOuterDiv.className = "outerLegendDivHorizontal";
                legendContentOuterDiv.innerHTML = getLegendDataHtml();

                grafieks.legend.topMargin = 0;
                grafieks.legend.leftMargin = 0;
                break;
        }

        legend.appendChild(legendContentOuterDiv);
    } else {
        grafieks.legend.topMargin = 0;
        grafieks.legend.leftMargin = 0;
    }

    d3.select(".main-div")
        .style("margin-left", grafieks.legend.leftMargin + "px")
        .style("margin-top", grafieks.legend.topMargin + "px");
};

const setTooltipHandler = () => {
    // Show tooltip on mouseover
    // Move this to function and move it to utils

    const tooltip = d3.select(".tooltip");
    tooltip.append("span").attr("class", "leftArrow");
    tooltip.append("div").attr("class", "tooltip-text");
    tooltip.append("span").attr("class", "rightArrow");

    d3.selectAll(".visualPlotting")
        .on("mouseout", function () {
            d3.select(".tooltip").style("display", "none");
            d3.selectAll(".visualPlotting").style("opacity", 1);
        })
        .on("mouseover mousemove", function (event) {
            d3.select(".tooltip").style("display", "block");

            // Get the x and y values for the mouse position
            const pointers = d3.pointer(event, this);
            const [xpos, ypos] = pointers;

            const topValue = ypos - 30 + (window.grafieks.legend.topMargin || 0);
            const leftValue = xpos + 16 + (window.grafieks.legend.leftMargin || 0);

            // Set the tooltip position
            d3.select(".tooltip")
                .style("top", topValue + "px")
                .style("left", leftValue + "px");

            d3.select(".tooltip .leftArrow").style("display", "block");
            d3.select(".tooltip .rightArrow").style("display", "none");

            // Get the tooltip values
            // Based on chart names
            const tooltipValue = getToolTopValues(this);

            // Set the tooltip text
            d3.select(".tooltip .tooltip-text").html(tooltipValue);

            const tooltipBox = d3.select(".tooltip").node();
            tooltipBox.style.right = null;

            // Check if tooltip is in viewport
            if (!isElementInViewport(d3.select(".tooltip").node())) {
                d3.select(".tooltip .leftArrow").style("display", "none");
                d3.select(".tooltip .rightArrow").style("display", "block");
                const toolTipRight = window.innerWidth - xpos - (window.grafieks.legend.leftMargin || 0);
                tooltipBox.style.right = toolTipRight + 16 + "px";
                tooltipBox.style.left = null;
            }

            // Fade all the other lines
            d3.selectAll(".visualPlotting").style("opacity", 0.3);
            // Mark the current line
            d3.select(this).style("opacity", 1);
        });
};

const setXAxisLabel = (svg) => {
    const { width, height } = window.grafieks.chartsConfig;
    const {
        xAxisConfig: {
            xlabel,
            xLabelfontSize = CONSTANTS.defaultValues.fontSize,
            xaxisFontFamily = CONSTANTS.defaultValues.fontFamily
        } = {}
    } = window.grafieks.plotConfiguration;

    // TODO: Center the xAxis label
    svg.append("g")
        .attr("class", "x-axis-label")
        .attr("transform", `translate(${width / 2},${height - xLabelfontSize / 2})`)
        .append("text")
        .attr("fill", "black")
        .attr("font-size", xLabelfontSize)
        .attr("font-family", xaxisFontFamily)
        .attr("text-anchor", "middle")
        .text(xlabel);
};

const setYAxisLabel = (svg) => {
    const { height } = window.grafieks.chartsConfig;
    const {
        yAxisConfig: {
            ylabel,
            yLabelfontSize = CONSTANTS.defaultValues.fontSize,
            yaxisFontFamily = CONSTANTS.defaultValues.fontFamily
        } = {}
    } = window.grafieks.plotConfiguration;

    // TODO: Center the yAxis label
    svg.append("g")
        .attr("class", "y-axis-label")
        .append("text")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", yLabelfontSize)
        .style("text-anchor", "middle")
        .attr("font-size", yLabelfontSize)
        .attr("font-family", yaxisFontFamily || CONSTANTS.defaultValues.fontFamily)
        .text(ylabel);
};

// Setter functions ends

module.exports = {
    setInitialConfig,
    getSvg,
    getAxisWidth,
    getNumberOfTicks,
    makeYaxisGridLines,
    isAxisBasedChart,
    clearChart,
    getMinimumValue,
    getMaximumValue,
    getYScale,
    getXScale,
    getYRange,
    getXRange,
    setTooltipHandler,
    setLengend,
    setGrids,
    setYAxisLabel,
    setXAxisLabel
};
