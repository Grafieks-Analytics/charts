const d3 = require("d3");
const CONSTANTS = require("../constants");

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

const getDistance = (x1, x2, y1, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const getDistanceBetweenElements = (rect1, rect2) => {
    if (!rect1 || !rect2) return 0;
    rect1 = rect1.getClientRects()[0];
    rect2 = rect2.getClientRects()[0];
    let { x: x1, y: y1, width: width1, height: height1 } = rect1;
    x1 = x1 + width1 / 2;
    y1 = y1 + height1 / 2;

    let { x: x2, y: y2, width: width2, height: height2 } = rect2;
    x2 = x2 + width2 / 2;
    y2 = y2 + height2 / 2;

    const distanceValue = getDistance(x1, x2, y1, y2);
    return distanceValue;
};

function removeDataLabelsByDistance() {
    var labels = document.querySelectorAll(".data-label text");
    var lastTickShown = labels[0];
    var lastTickShown1 = null;
    var lastTickShown2 = null;
    labels.forEach((label, i) => {
        if (!i) return;
        if (
            getDistanceBetweenElements(label, lastTickShown) < 40 ||
            (lastTickShown1 && getDistanceBetweenElements(label, lastTickShown1) < 40) ||
            (lastTickShown2 && getDistanceBetweenElements(label, lastTickShown2) < 40)
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

    svg.append("g")
        .attr("class", "data-label")
        .selectAll("text")
        .data(grafieks.dataUtils.dataLabelValues)
        .join("text")
        .attr("class", "label-text")
        .attr("text-anchor", "middle")
        .attr("font-size", CONSTANTS.defaultValues.fontSize)
        .attr("font-family", CONSTANTS.defaultValues.fontFamily)
        .attr("fill", CONSTANTS.defaultValues.fontColor)
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
