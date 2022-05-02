const d3 = require("d3");
const CONSTANTS = require("../constants");

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
};

const getSvg = () => {
    const { width, height, lengends: { legendWidth = 0, legenedHeight = 0 } = {} } = window.grafieks.chartsConfig;
    return d3.create("svg").attr("viewBox", [0, 0, width - legendWidth, height - legenedHeight]);
};

const getAxisWidth = () => {
    const margins = window.grafieks.chartsConfig.margins;
    return window.innerWidth - margins.left - margins.right;
};

const getNumberOfTicks = () => {
    return Math.floor(window.innerHeight / 70);
};

const clearChart = () => {
    d3.select(".charts-div").html(""); // Clear Chart
    d3.select(".tooltip").html(""); // Clear Tooltip
    d3.select(".legend").html(""); // Clear legend
};

const makeYaxisGridLines = (scale) => {
    return d3.axisLeft(scale).ticks(getNumberOfTicks()).tickSize(-getAxisWidth()).tickFormat(d3.format(".2s"));
};

const isAxisBasedChart = (chartName) => {
    return CONSTANTS.axisBasedCharts.includes(chartName);
};

const getMinimumValue = (array) => {
    let minValue = d3.min(array);
    if (minValue > 0) {
        minValue = 0;
    }
    return minValue;
};

const getMaximumValue = (array) => {
    let maxValue = d3.max(array);
    if (maxValue < 0) {
        maxValue = 0;
    }
    return maxValue;
};

const getYScale = (domain, range) => {
    return d3.scaleLinear().domain(domain).nice().range(range);
};

const getXScale = (domain, range, options = {}) => {
    const { padding = 0.25 } = options;
    return d3.scaleBand().domain(domain).range(range).padding(padding);
};

const getYRange = () => {
    const { height, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [height - chartsMargins.bottom, chartsMargins.top];
};

const getXRange = () => {
    const { width, margins: chartsMargins } = window.grafieks.chartsConfig;
    return [chartsMargins.left, width - chartsMargins.right];
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

const isElementInViewport = (element) => {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
};

const showTooltip = () => {
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

            // Set the tooltip position
            d3.select(".tooltip")
                .style("top", ypos - 16 + "px")
                .style("left", xpos + 16 + "px");

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
                const toolTipRight = window.innerWidth - xpos;
                tooltipBox.style.right = toolTipRight + 16 + "px";
                tooltipBox.style.left = null;
            }

            // Fade all the other lines
            d3.selectAll(".visualPlotting").style("opacity", 0.3);
            // Mark the current line
            d3.select(this).style("opacity", 1);
        });
};

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
    showTooltip
};
