const chartNames = {
    BAR_CHART: "barChart",
    HORIZONTAL_BAR_CHART: "horizontalBarChart",
    STACKED_BAR_CHART: "stackedBarChart",
    HORIZONTAL_STACKED_BAR_CHART: "horizontalStackedBarChart",

    GROUP_BAR_CHART: "groupBarChart",
    HORIZONTAL_GROUP_BAR_CHART: "horizontalGroupBarChart",

    LINE_CHART: "lineChart",
    HORIZONTAL_LINE_CHART: "horizontalLineChart",
    MULTIPLE_LINE_CHART: "multipleLineChart",
    HORIZONTAL_MULTIPLE_LINE_CHART: "horizontalMultipleLineChart",

    AREA_CHART: "areaChart",
    HORIZONTAL_AREA_CHART: "horizontalAreaChart",
    STACKED_AREA_CHART: "stackedAreaChart",
    HORIZONTAL_STACKED_AREA_CHART: "horizontalStackedAreaChart",

    PIE_CHART: "pieChart",
    DONUT_CHART: "donutChart",

    SCATTER_CHART: "scatterChart",
    HEAT_MAP: "heatMap",
    WATERFALL_CHART: "waterfallChart",

    TREE_CHART: "treeChart",
    TREEMAP_CHART: "treemapChart",

    SANKEY_CHART: "sankeyChart",
    RADAR_CHART: "radarChart",
    SUNBURST_CHART: "sunburstChart",

    GAUGE_CHART: "gaugeChart",
    PIVOT: "pivot",
    TABLE: "table",
    KPI: "kpi",
    FUNNEL_CHART: "funnelChart"
};

module.exports = {
    ...chartNames,
    axisBasedCharts: [
        chartNames.BAR_CHART,
        chartNames.LINE_CHART,
        chartNames.AREA_CHART,
        chartNames.STACKED_BAR_CHART,
        chartNames.STACKED_AREA_CHART,
        chartNames.MULTIPLE_LINE_CHART,
        chartNames.HORIZONTAL_BAR_CHART,
        chartNames.HORIZONTAL_LINE_CHART,
        chartNames.HORIZONTAL_AREA_CHART,
        chartNames.HORIZONTAL_STACKED_BAR_CHART,
        chartNames.HORIZONTAL_STACKED_AREA_CHART,
        chartNames.HORIZONTAL_MULTIPLE_LINE_CHART,
        chartNames.GROUP_BAR_CHART,
        chartNames.HORIZONTAL_GROUP_BAR_CHART
    ],

    chartsMargins: { top: 20, right: 20, bottom: 30, left: 40 },

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

    curveType: {
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

    defaultValues: {
        fontSize: 12,
        fontFamily: "MS Sans Serif",
        fontColor: "black",

        gridStatus: true,
        legendStatus: true,

        legendWidth: 120,
        legendHeight: 30
    },

    LEGEND_POSITION: {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right"
    }
};
