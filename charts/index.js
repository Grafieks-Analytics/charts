const d3 = require("d3");

const barChartGeneration = require("./modules/barChart");

const CONSTANTS = require("./constants");
const { makeYaxisGridLines, setInitialConfig, isAxisBasedChart, clearChart, showTooltip } = require("./utils");

(function () {
    // Setting Initial Window Grafieks Object and Constants
    setInitialConfig();

    // Setting Initial Window Grafieks Object to a constant
    const grafieks = window.grafieks;
    // Expose utility functions to window
    grafieks.utils.clearChart = clearChart;

    // Temp function. Will be removed later
    grafieks.utils.getPlotConfiguration = function () {
        let plotConfiguration = {
            chartName: "barChart",
            yAxisConfig: { yaxisStatus: true, ylabel: "Sales" },
            xAxisConfig: { xaxisStatus: true, xlabel: "Sub-Category" },
            dataLabelColor: "#000000",
            paddingInner: 0.25,
            innerRadius: 0.75,
            dataColumns: {
                xAxisColumnDetails: [
                    {
                        itemName: "Product_Name",
                        tableValue: "`sample_superstore`.`Product_Name`",
                        itemType: "Categorical",
                        dateFormat: "%Y"
                    }
                ],
                yAxisColumnDetails: [
                    {
                        itemName: "Sales",
                        tableValue: "`sample_superstore`.`Sales`",
                        itemType: "Numerical",
                        dateFormat: "%Y"
                    }
                ],
                row3ColumnDetails: [],
                colorByData: []
            },
            xLabelfontSize: 12,
            xTickfontFamily: "Courier",
            xTickfontSize: 12,

            yLabelfontSize: 12,
            yTickfontFamily: "Courier",
            yTickfontSize: 12
        };

        plotConfiguration = {
            ...plotConfiguration,
            xAxisConfig: {
                xLabelfontSize: plotConfiguration.xLabelfontSize || CONSTANTS.fontSize,
                xTickfontFamily: plotConfiguration.xTickfontFamily || CONSTANTS.fontFamily,
                xTickfontSize: plotConfiguration.xTickfontSize || CONSTANTS.fontSize,
                ...plotConfiguration.xAxisConfig
            },
            yAxisConfig: {
                yLabelfontSize: plotConfiguration.yLabelfontSize || CONSTANTS.fontSize,
                yTickfontFamily: plotConfiguration.yTickfontFamily || CONSTANTS.fontFamily,
                yTickfontSize: plotConfiguration.yTickfontSize || CONSTANTS.fontSize,
                ...plotConfiguration.yAxisConfig
            }
        };

        delete plotConfiguration.xLabelfontSize;
        delete plotConfiguration.xTickfontFamily;
        delete plotConfiguration.xTickfontSize;
        delete plotConfiguration.yLabelfontSize;
        delete plotConfiguration.yTickfontFamily;
        delete plotConfiguration.yTickfontSize;

        return plotConfiguration;
    };

    // Temp function. Will be removed later
    grafieks.plotConfiguration = grafieks.utils.getPlotConfiguration();

    const drawChart = (data, plotConfiguration = {}) => {
        // Set data to grafieks.dataUtils.rawData for future use (redraw when resize, etc)
        grafieks.dataUtils.rawData = data;
        const width = window.innerWidth;
        const height = window.innerHeight;

        grafieks.plotConfiguration = plotConfiguration;
        const {
            chartName,
            yAxisConfig: { ylabel, yLabelfontSize, yaxisStatus, yaxisFontFamily } = {},
            xAxisConfig: { xlabel, xLabelfontSize, xaxisStatus, xaxisFontFamily } = {},
            gridConfig: { gridStatus = CONSTANTS.defaultValues.gridStatus } = {},
            d3colorPalette = CONSTANTS.d3ColorPalette
        } = plotConfiguration;

        plotConfiguration.isAxisBasedChart = isAxisBasedChart(chartName);

        // Function to get the chart's svg
        let getChartSvg = function () {};

        switch (chartName) {
            case CONSTANTS.BAR_CHART:
                getChartSvg = barChartGeneration;
                break;
            default:
                return console.log("No chart generator function found for this chart");
        }

        const svg = getChartSvg();

        // Setting xAxis labels
        // Move this to a function later
        if (xaxisStatus) {
            svg.append("g")
                .attr("class", "x-axis-label")
                .attr("transform", `translate(${width / 2},${height - xLabelfontSize / 2})`)
                .append("text")
                .attr("fill", "black")
                .attr("font-size", xLabelfontSize)
                .attr("font-family", xaxisFontFamily || CONSTANTS.fontFamily)
                .attr("text-anchor", "middle")
                .text(xlabel);
        }

        // Setting yAxis labels
        // Move this to a function later
        if (yaxisStatus) {
            svg.append("g")
                .attr("class", "y-axis-label")
                .append("text")
                .attr("fill", "black")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", yLabelfontSize)
                .style("text-anchor", "middle")
                .attr("font-size", yLabelfontSize)
                .attr("font-family", yaxisFontFamily || CONSTANTS.fontFamily)
                .text(ylabel);
        }

        const chartsDiv = d3.select(".charts-div");
        clearChart();
        chartsDiv.node().appendChild(svg.node());

        if (plotConfiguration.isAxisBasedChart) {
            // Add multiple conditions only for the axis based chart
            // grids can only be there in axis based charts
            if (gridStatus) {
                const chartsMargins = grafieks.chartsConfig.margins;
                svg.append("g")
                    .lower() // lower() Works like Prepend in jquery
                    .attr("class", "grid")
                    .attr("transform", `translate(${chartsMargins.left},0)`)
                    .style("stroke-width", "1")
                    .call(makeYaxisGridLines(grafieks.utils.yScale));
            }
        }

        showTooltip();
    };

    grafieks.drawChart = drawChart;

    window.addEventListener("resize", function () {
        drawChart(grafieks.dataUtils.rawData, grafieks.plotConfiguration);
    });
})();
