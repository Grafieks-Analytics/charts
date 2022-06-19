const d3 = require("d3");
const CONSTANTS = require("../constants");

const getLegendDataHtml = () => {
    const legendData = window.grafieks.legend.data;
    let { d3ColorPalette, chartName } = grafieks.plotConfiguration;

    if (chartName == CONSTANTS.WATERFALL_CHART && !d3ColorPalette) {
        d3ColorPalette = Object.values(CONSTANTS.WATERFALL.COLORS);
    } else if (!d3ColorPalette) {
        d3ColorPalette = CONSTANTS.d3ColorPalette;
    }

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

module.exports = {
    setLengend
};
