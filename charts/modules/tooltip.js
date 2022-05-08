const d3 = require("d3");
const CONSTANTS = require("../constants");

const { isElementInViewport } = require("../utils");

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

module.exports = { setTooltipHandler };
