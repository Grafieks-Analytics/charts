const d3 = require("d3");
const CONSTANTS = require("../constants");

const { getDistanceBetweenElements } = require("../utils");

function formatLabel(labelValue, labelFormat) {
    switch (labelFormat) {
        case "round":
            return Math.round(labelValue);
        case "comma":
            return Math.round(labelValue).toLocaleString("en-US");
        case "symbol":
            return d3.format(".3s")(labelValue);
        case "none":
            return labelValue;
        default:
            return Math.round(labelValue);
    }
}

function removeDataLabelsByDistance() {
    var labels = document.querySelectorAll(".data-label text");
    var lastTickShown = labels[0];
    var lastTickShown1 = null;
    var lastTickShown2 = null;
    labels.forEach((label, i) => {
        if (!i) return;
        if (
            getDistanceBetweenElements(label, lastTickShown) < CONSTANTS.defaultValues.maxDistanceBetweenLabels ||
            (lastTickShown1 &&
                getDistanceBetweenElements(label, lastTickShown1) < CONSTANTS.defaultValues.maxDistanceBetweenLabels) ||
            (lastTickShown2 &&
                getDistanceBetweenElements(label, lastTickShown2) < CONSTANTS.defaultValues.maxDistanceBetweenLabels)
        ) {
            label.remove();
        } else {
            lastTickShown2 = lastTickShown1;
            lastTickShown1 = lastTickShown;
            lastTickShown = label;
        }
    });
}

const setDataLabels = (svg) => {
    const visualPlotting = svg.selectAll(".visualPlotting");
    const visualPlottingNodes = visualPlotting.nodes();

    const {
        dataLabelColor = CONSTANTS.defaultValues.fontColor,
        dataLabelfontFamily = CONSTANTS.defaultValues.fontFamily,
        dataLabelfontSize = CONSTANTS.defaultValues.fontSize
    } = grafieks.plotConfiguration;

    svg.append("g")
        .attr("class", "data-label")
        .selectAll("text")
        .data(grafieks.dataUtils.dataLabelValues)
        .join("text")
        .attr("class", "label-text")
        .attr("text-anchor", "middle")
        .attr("font-size", dataLabelfontSize)
        .attr("font-family", dataLabelfontFamily)
        .attr("fill", dataLabelColor)
        .attr("x", function (_, i) {
            return +visualPlottingNodes[i].getAttribute("x") + +visualPlottingNodes[i].getAttribute("width") / 2;
        })
        .attr("y", function (d, i) {
            let yPosition = +visualPlottingNodes[i].getAttribute("y") - 3;
            if (d < 0) {
                yPosition += +visualPlottingNodes[i].getAttribute("height") + 16;
            }
            return yPosition;
        })
        .text(function (dataLabelText) {
            return formatLabel(dataLabelText, CONSTANTS.defaultValues.dataLabelFormat);
        });

    removeDataLabelsByDistance();
};

module.exports = {
    setDataLabels
};
