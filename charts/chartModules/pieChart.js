const d3 = require("d3");

const CONSTANTS = require("../constants");
const { setLengend } = require("../modules/legend");
const { getSvg, getPageHeight, getPageWidth } = require("../utils");

const chartGeneration = () => {
    const grafieks = window.grafieks;
    const data = grafieks.dataUtils.rawData || [];
    const [dataValues, dataLabels] = data;

    let isDateTransforming = false;
    const {
        dataColumns: { xAxisColumnDetails = [] } = {},
        chartName,
        d3colorPalette = CONSTANTS.d3ColorPalette,
        paddingInner,
        dataColumns,
        labelConfig = CONSTANTS.defaultValues.defaultlabelConfig,
        dateFormat = CONSTANTS.defaultValues.dateFormat,
        innerRadius = CONSTANTS.defaultValues.innerRadius,
        dataLabelfontSize = CONSTANTS.defaultValues.fontSize,
        dataLabelfontFamily = CONSTANTS.defaultValues.fontFamily,
        dataLabelColor = CONSTANTS.defaultValues.fontColor
    } = grafieks.plotConfiguration;

    if (xAxisColumnDetails[0].itemType == "Date") {
        isDateTransforming = true;
    }

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    const legendsData = Object.keys(dataValues);
    grafieks.legend.data = legendsData;

    setLengend();

    const width = window.innerWidth - (grafieks.legend.leftMargin || grafieks.legend.rightMargin || 0);
    const height = window.innerHeight - (grafieks.legend.topMargin || 0);

    let radius = Math.min(width, height) / 2;
    radius = radius * 0.8;

    const translateSvgTop = 0;
    const translateSvgLeft = 0;

    const svg = getSvg();
    let g = svg
        .append("g")
        .attr("transform", "translate(" + (width / 2 + translateSvgLeft) + "," + (height / 2 + translateSvgTop) + ")");

    // Creating Pie generator
    var pie = d3.pie();

    // Creating arc
    var arc = d3
        .arc()
        .innerRadius(function () {
            let innerRadiusValue = (chartName == CONSTANTS.PIE_CHART ? 0 : innerRadius) * 80;
            if (innerRadiusValue >= radius) {
                innerRadiusValue = radius / 2;
            }
            return innerRadiusValue;
        })
        .outerRadius(radius);

    const keys = Object.keys(dataValues);
    // Grouping different arcs
    var arcs = g
        .selectAll("arc")
        .data(pie(Object.values(dataValues)))
        .enter()
        .append("g");

    // Appending path
    arcs.append("path")
        .attr("fill", function (_, i) {
            return d3colorPalette[i % d3colorPalette.length];
        })
        .attr("class", function (data, i) {
            let { data: value } = data;
            this.setAttribute("data-value-x1", keys[i]);
            this.setAttribute("data-value-y1", value);
            return "visualPlotting";
        })
        .attr("d", arc);

    const chartsDiv = d3.select(".charts-div");
    chartsDiv.node().appendChild(svg.node());
};
module.exports = chartGeneration;
