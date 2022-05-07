const d3 = require("d3");

const barChartGeneration = require("./modules/barChart");

const CONSTANTS = require("./constants");

const {
    setInitialConfig,
    isAxisBasedChart,
    clearChart,
    setTooltipHandler,
    setLengend,
    setGrids,
    setYAxisLabel,
    setXAxisLabel,
    isTickTextOverflowing,
    modifyAndHideTicks
} = require("./utils");

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

        grafieks.plotConfiguration = plotConfiguration;
        const {
            chartName,
            yAxisConfig: { yLabelfontSize, yaxisStatus } = {},
            xAxisConfig: { xLabelfontSize, xaxisStatus } = {},
            gridConfig: { gridStatus = CONSTANTS.defaultValues.gridStatus } = {},
            legendConfig: {
                legendStatus = CONSTANTS.defaultValues.legendStatus,
                legendPosition = CONSTANTS.LEGEND_POSITION.RIGHT
            } = {}
        } = plotConfiguration;

        plotConfiguration.isAxisBasedChart = isAxisBasedChart(chartName);

        let legendHeight = 0;
        let legendWidth = 0;
        if (
            legendStatus &&
            (legendPosition === CONSTANTS.LEGEND_POSITION.RIGHT || legendPosition === CONSTANTS.LEGEND_POSITION.LEFT)
        ) {
            legendWidth = CONSTANTS.defaultValues.legendWidth;
        } else if (legendStatus) {
            legendHeight = CONSTANTS.defaultValues.legendHeight;
        }

        // Set Height and Width of the chart
        const width = window.innerWidth - legendWidth;
        const height = window.innerHeight - legendHeight;

        // Store the values to charts config
        // Same value to be reused further
        grafieks.chartsConfig.width = width;
        grafieks.chartsConfig.height = height;

        const chartsMargins = { ...CONSTANTS.chartsMargins };

        // If xAxisLabel needs to be shown then add the 1.5 times the fontSize of xLabel to bottom margin
        if (xaxisStatus) {
            chartsMargins.bottom = chartsMargins.bottom + xLabelfontSize * 1.5;
        }

        // If yAxisLabel needs to be shown then add the 1.5 times the fontSize of yLabel to bottom margin
        if (yaxisStatus) {
            chartsMargins.left = chartsMargins.left + yLabelfontSize * 1.5;
        }

        // Setting margins to grafieks object to use it further
        grafieks.chartsConfig.margins = chartsMargins;

        // Function to get the chart's svg
        let getChartSvg = function () {};

        switch (chartName) {
            case CONSTANTS.BAR_CHART:
                getChartSvg = barChartGeneration;
                break;
            default:
                return console.log("No chart generator function found for this chart");
        }

        // Clear the chart before drawing anything
        clearChart();

        // SVG element is the chart for particular chart
        let svg = getChartSvg();
        const chartsDiv = d3.select(".charts-div");
        chartsDiv.node().appendChild(svg.node());

        // Checking if text is overflowing
        const isOverFlowing = isTickTextOverflowing();
        grafieks.chartsConfig.ticksStyle = CONSTANTS.TICK_HORIZONTAL;

        if (isOverFlowing) {
            /*
                Rotate the x-axis labels to vertical. To perform this action, we need to
                - ReDraw bars with new yScale (When Checking overflow condition, a rotatingMargin value is assigned)
                - Change yAxis Scale (Rotating Margin is added to yScale in range)
                - Rotate ticks to 90 degrees (To do this, tick style config is set to vertical, and tick rotation is set to 90 degrees)
            */
            svg.node().remove();
            grafieks.chartsConfig.ticksStyle = CONSTANTS.TICK_VERTICAL;
            svg = getChartSvg();
            chartsDiv.node().appendChild(svg.node());
            modifyAndHideTicks();
        }

        // Setting xAxis labels
        if (xaxisStatus) {
            setXAxisLabel(svg);
        }

        // Setting yAxis labels
        if (yaxisStatus) {
            setYAxisLabel(svg);
        }

        if (plotConfiguration.isAxisBasedChart) {
            // Add multiple conditions only for the axis based chart
            // grids can only be there in axis based charts
            if (gridStatus) {
                setGrids(svg);
            }
        }

        // Set Tooltip Handler
        setTooltipHandler();

        // Set Lenged
        setLengend();
    };

    grafieks.drawChart = drawChart;

    window.addEventListener("resize", function () {
        drawChart(grafieks.dataUtils.rawData, grafieks.plotConfiguration);
    });
})();
