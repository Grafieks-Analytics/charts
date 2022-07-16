const CONSTANTS = require("../constants");

const drawMarker = (svg, dataValues, stroke, fill) => {
    const markerShapeConfig = CONSTANTS.markerShapeConfig;
    const { markerShape = CONSTANTS.defaultValues.markerShape } = grafieks.plotConfiguration;

    const chartsMargins = window.grafieks.chartsConfig.margins;

    const { initialCircleRadius, initialBoxDimension } = CONSTANTS.defaultValues;

    let xScale = grafieks.utils.xScale;
    let yScale = grafieks.utils.yScale;

    if (grafieks.plotConfiguration.isHorizontalGraph) {
        xScale = grafieks.utils.yScale;
        yScale = grafieks.utils.xScale;
    }

    svg.selectAll(".dot")
        .data(dataValues)
        .enter()
        .append(markerShape)
        .attr("stroke", stroke)
        .attr("class", markerShape)
        .attr("class", "visualPlotting marker-shape")
        .attr("fill", fill)
        .attr(markerShapeConfig[markerShape] && markerShapeConfig[markerShape].xPositionAttrName, function (d, i) {
            this.setAttribute("data-value-x1", d[0]);
            this.setAttribute("data-value-y1", d[1]);

            return xScale(d[0]) + xScale.bandwidth() / 2;
        })
        .attr(markerShapeConfig[markerShape] && markerShapeConfig[markerShape].yPositionAttrName, function (d) {
            const yValue = yScale(d[1]);
            let value = yValue;

            if (markerShape == CONSTANTS.markerShapes.RECT) {
                value -= initialBoxDimension / 2;
            } else {
                value -= initialCircleRadius / 2 - 1;
            }

            return value;
        })
        .attr("r", initialCircleRadius)
        .attr("height", initialBoxDimension)
        .attr("width", initialBoxDimension)
        .attr("points", function (d, i) {
            var x1 = xScale(d[0]);
            return x1;
        });
};

module.exports = {
    drawMarker
};
