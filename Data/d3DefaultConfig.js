const constants = {
    chartTitles: {
        waterfallChart: "Waterfall Chart",
        horizontalBarChart: "Horizontal Bar Chart",
        barChart: "Bar Chart"
    },
    redColor: "#E15759",
    yellowColor: "#EDC949",
    greenColor: "#59A14F",
    chartType: {
        FIT_WIDTH: "FitWidth",
        STANDARD: "Standard",
        FIT_HEIGHT: "FitHeight"
    },
    cureveType: {
        CARDINAL: "curveCardinal",
        LINEAR: "curveLinear",
        BASIS: "curveBasis",
        OPEN_BASIS: "curveBasisOpen",
        BUNDLE: "curveBundle"
    },
    markerShapes: {
        CIRCLE: "circle",
        RECT: "rect"
    },
    labelFormat: {
        ROUND: "symbol",
        NONE: "none"
    },
    chartMargins: {
        top: 20,
        left: 70,
        right: 20,
        bottom: 70
    }
};

const defaultD3Config = {
    d3SequentialDefaultTheme: ["#ffffff", "#08306b"],
    d3ColorPalette: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf"
    ],
    defaultPaddingInner: 0.25,
    defaultMarkerShape: constants.markerShapes.CIRCLE,
    initialCircleRadius: 3,
    onHoverCircleRadius: 7,
    initialBoxDimension: 6,
    onHoverBoxDimension: 8,
    defaultLineCurve: constants.cureveType.LINEAR,
    innerRadius: 0.50,
    defaultTimeParseFormat: "%d-%m-%Y",
    defaultSpace: 30,
    dateFormat: "%Y",
    defaultMarkerStatus: true,
    chartType: constants.chartType.FIT_WIDTH,
    // chartType: constants.chartType.STANDARD,
    // horizontalChartType: constants.chartType.STANDARD,
    horizontalChartType: constants.chartType.FIT_HEIGHT,
    standardThresholdWidth: 100,
    standardThresholdHeight: 100,
    fontSize: 12,
    fontFamily: "MS Sans Serif",
    fontColor: "black",
    defaultLegendConfig: {
        legendStatus: false,
        legendPosition: "right",
    },
    defaultlabelConfig: {
        labelStatus: false,
        labelFormat: constants.labelFormat.ROUND
    },
    defaultGridConfig: {
        gridStatus: true
    },

    xAxisConfig: {
        xlabel: null,
        xboldLabel: false,
        xitalicLabel: false,
        xboldTick: false,
        xitalicTick: false,
        xaxisStatus: true
    },
    yAxisConfig: {
        ylabel: null,
        yboldLabel: false,
        yitalicLabel: false,
        yboldTick: false,
        yitalicTick: false,
        yaxisStatus: true
    },

    defaultTableChartConfig: {
        defaultCellBorderStatus: true,
        defaultCellHoverStatus: true,
        defaultCompactStatus: false,
        defaultSearchStatus: true,
        defaultGrandTotalStatus: false,
        defaultRowAlternateStatus: true,
        defaultBatchsize: 50
    },
    defaultDynamicHeight: false,
    defaultBottomPinch: 1,
    defaultKPIStyling: {
        value: {
            fontSize: 12,
            color: "#000",
            bold: false,
            italic: false,
            underline: false,
            fontFamily: "Arial"
        },
        label: {
            fontSize: 12,
            color: "#000",
            bold: false,
            italic: false,
            underline: false,
            fontFamily: "Arial"
        }
    }
};
const markerShapeConfig = {
    circle: {
        xPositionAttrName: "cx",
        yPositionAttrName: "cy"
    },
    rect: {
        xPositionAttrName: "x",
        yPositionAttrName: "y"
    },
    polygon: {
        xPositionAttrName: "x",
        yPositionAttrName: "y"
    }
};

function redrawChartBarVerticle() {
    var timer;
    window.addEventListener("resize", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            window.clearChart && clearChart();
            drawChart(data, {
                yAxisConfig: { yaxisStatus: true },
                xAxisConfig: { xaxisStatus: true },
                dataLabelColor: "#000000",
                paddingInner: 0.25,
                innerRadius: 150,
                chartType: "Standard",
                dataColumns: {
                    xAxisColumnDetails: [
                        {
                            itemName: "Product_Name",
                            itemType: "Categorical",
                            dateFormat: "%Y"
                        }
                    ],
                    yAxisColumnDetails: [
                        {
                            itemName: "Sales",
                            itemType: "Numerical",
                            dateFormat: "%Y"
                        }
                    ],
                    row3ColumnDetails: [],
                    colorByData: []
                }
            });
        }, 0);
    });
}
function redrawChartLineVerticle() {
    var timer;
    window.addEventListener("resize", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            window.clearChart && clearChart();
            drawChart(dataset, {
                chartType: "Standard",
                dataColumns: {
                    xAxisColumnDetails: [
                        {
                            itemName: "Order Date",
                            // itemType: "Date",
                            // dateFormat: "%d-%m-%Y"
                        }
                    ],
                    yAxisColumnDetails: [
                        {
                            itemName: "Sales",
                            // itemType: "Numerical",
                            // dateFormat: "%Y"
                        }
                    ],
                    row3ColumnDetails: [],
                    colorByData: []
                },
                dateFormat: "%d",
                gridConfig: { gridStatus: false }
            });
        }, 0);
    });
}
