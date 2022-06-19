const d3 = require("d3");
const CONSTANTS = require("./constants");

// Utility functions
const { setInitialConfig, isAxisBasedChart, clearChart, getSvg } = require("./utils");

// Features Modules
const { setYAxisLabel, setXAxisLabel } = require("./modules/axisLabels");
const { setTooltipHandler } = require("./modules/tooltip");
const { setLengend } = require("./modules/legend");
const { setGrids } = require("./modules/grids");
const { isTickTextOverflowing, modifyAndHideTicks } = require("./modules/ticks");
const { setDataLabels } = require("./modules/datalabels");
const { transformData } = require("./modules/dataTransformation");

// Chart modules
const barChartGeneration = require("./chartModules/barChart");
const lineChartGeneration = require("./chartModules/lineChart");
const stackBarChart = require("./chartModules/stackBarChart");
const multiLineChart = require("./chartModules/multilineChart");
const scatterChart = require("./chartModules/scatterChart");

(function () {
    // Setting Initial Window Grafieks Object and Constants
    setInitialConfig();

    // Setting Initial Window Grafieks Object to a constant
    const grafieks = window.grafieks;
    // Expose utility functions to window
    grafieks.utils.clearChart = clearChart;

    const drawChart = (data, plotConfiguration = {}) => {
        grafieks.plotConfiguration = plotConfiguration;
        // Set data to grafieks.dataUtils.rawData for future use (redraw when resize, etc)
        grafieks.dataUtils.rawData = data;
        if (!grafieks.flags.isDataTransformed) {
            transformData();
        }

        const {
            chartName,
            yAxisConfig: { yLabelfontSize = CONSTANTS.defaultValues.fontSize, yaxisStatus = true } = {},
            xAxisConfig: { xLabelfontSize = CONSTANTS.defaultValues.fontSize, xaxisStatus = true } = {},
            gridConfig: { gridStatus = CONSTANTS.defaultValues.gridStatus } = {},
            legendConfig: {
                legendStatus = CONSTANTS.defaultValues.legendStatus,
                legendPosition = CONSTANTS.LEGEND_POSITION.RIGHT
            } = {},
            labelConfig: { labelStatus = CONSTANTS.defaultValues.labelStatus } = {}
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
        // Setting default tick style to horizontal
        grafieks.chartsConfig.ticksStyle = CONSTANTS.TICK_HORIZONTAL;

        // Function to get the chart's svg
        let getChartSvg = function () {};

        // TODO: Move  these functions to other file and map with chartName
        /*
            {
                BAR_CHART: barChartGeneration
            }
        */
        switch (chartName) {
            case CONSTANTS.BAR_CHART:
                getChartSvg = barChartGeneration;
                break;
            case CONSTANTS.AREA_CHART:
            case CONSTANTS.LINE_CHART:
                // Line and Area Charts are same, only difference is of area function and line function and fill of lower area
                // A condition is added to in corporate these things in a single chart generation function
                getChartSvg = lineChartGeneration;
                break;
            case CONSTANTS.STACKED_BAR_CHART:
                getChartSvg = stackBarChart;
                break;
            case CONSTANTS.MULTIPLE_AREA_CHART:
            case CONSTANTS.MULTIPLE_LINE_CHART:
                getChartSvg = multiLineChart;
                break;
            case CONSTANTS.SCATTER_CHART:
                getChartSvg = scatterChart;
                break;
            default:
                return console.log("No chart generator function found for this chart");
        }

        // Clear the chart before drawing anything
        clearChart();

        // SVG element is the chart for particular chart
        let svg = getChartSvg(getSvg());

        const chartsDiv = d3.select(".charts-div");
        chartsDiv.node().appendChild(svg.node());

        // Checking if tick text is overflowing
        const isOverFlowing = isTickTextOverflowing();

        if (isOverFlowing) {
            /*
                Rotate the x-axis labels to vertical. To perform this action, we need to
                - ReDraw bars with new yScale (When Checking overflow condition, a rotatingMargin value is assigned)
                - Change yAxis Scale (Rotating Margin is added to yScale in range)
                - Rotate ticks to 90 degrees (To do this, tick style config is set to vertical, and tick rotation is set to 90 degrees)
            */
            svg.node().remove();
            grafieks.chartsConfig.ticksStyle = CONSTANTS.TICK_VERTICAL;
            svg = getChartSvg(getSvg());
            chartsDiv.node().appendChild(svg.node());
            modifyAndHideTicks();
        }

        if (plotConfiguration.isAxisBasedChart) {
            // Add multiple conditions only for the axis based chart

            // Setting xAxis labels
            if (xaxisStatus) {
                setXAxisLabel(svg);
            }

            // Setting yAxis labels
            if (yaxisStatus) {
                setYAxisLabel(svg);
            }

            if (gridStatus) {
                setGrids(svg);
            }
        }

        // Set Tooltip Handler
        setTooltipHandler();

        // Set Lenged
        setLengend();

        // Set data labels
        if (labelStatus) {
            setDataLabels(svg);
        }
    };

    grafieks.drawChart = drawChart;

    // On Resize replot the graph
    window.addEventListener("resize", function () {
        drawChart(grafieks.dataUtils.rawData, window.grafieks && window.grafieks.plotConfiguration);
    });
})();
