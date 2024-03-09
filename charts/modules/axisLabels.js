const d3 = require("d3");
const CONSTANTS = require("../constants");
const { isHorizontalGraph } = require("../utils");

const setXAxisLabel = (svg) => {
    const { width, height } = window.grafieks.chartsConfig;
    let {
        xAxisConfig: { xlabel } = {},
        xLabelfontSize = CONSTANTS.defaultValues.fontSize,
        xaxisFontFamily = CONSTANTS.defaultValues.fontFamily,
        xLabelfontColor = CONSTANTS.defaultValues.fontColor,
    } = window.grafieks.plotConfiguration;

    if (!xlabel) {
        if (isHorizontalGraph()) {
            xlabel = grafieks.dataUtils.dataLabels.yAxisLabel;
        } else {
            xlabel = grafieks.dataUtils.dataLabels.xAxisLabel;
        }
    }

    // TODO: Center the xAxis label
    svg.append("g")
        .attr("class", "x-axis-label")
        .attr("transform", `translate(${width / 2},${height - xLabelfontSize / 2})`)
        .append("text")
        .attr("fill", xLabelfontColor)
        .attr("font-size", xLabelfontSize)
        .attr("font-family", xaxisFontFamily)
        .attr("text-anchor", "middle")
        .text(xlabel);
};

const setYAxisLabel = (svg) => {
    const { height, margins: chartsMargins } = window.grafieks.chartsConfig;
    let {
        yAxisConfig: { ylabel } = {},
        yLabelfontSize = CONSTANTS.defaultValues.fontSize,
        yaxisFontFamily = CONSTANTS.defaultValues.fontFamily,
        yLabelfontColor = CONSTANTS.defaultValues.fontColor,
    } = window.grafieks.plotConfiguration;

    if (!ylabel) {
        if (isHorizontalGraph()) {
            // TODO: To check if yAxisLabel should be set here?
            ylabel = grafieks.dataUtils.dataLabels.xAxisLabel;
        } else {
            ylabel = grafieks.dataUtils.dataLabels.yAxisLabel;
        }
    }

    // TODO: Center the yAxis label
    svg.append("g")
        .attr("class", "y-axis-label")
        .append("text")
        .attr("fill", yLabelfontColor)
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2 - chartsMargins.rotatingMargin))
        .attr("y", yLabelfontSize)
        .style("text-anchor", "middle")
        .attr("font-size", yLabelfontSize)
        .attr("font-family", yaxisFontFamily || CONSTANTS.defaultValues.fontFamily)
        .text(ylabel);
};

module.exports = {
    setYAxisLabel,
    setXAxisLabel
};
