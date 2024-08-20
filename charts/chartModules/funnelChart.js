const D3Funnel = require("d3-funnel");
const CONSTANTS = require("../constants");
const { setLengend } = require("../modules/legend");

const chartGeneration = () => {
    const grafieks = window.grafieks;

    const data = grafieks.dataUtils.rawData || [];

    const { dataValues = [], dataLabels = [],legendsData=[] } = data;

    grafieks.dataUtils.dataValues = dataValues;
    grafieks.dataUtils.dataLabels = dataLabels;

    grafieks.dataUtils.dataLabelValues = dataValues[1];

    grafieks.legend.data = legendsData;
    // console.log("dataLabels",legendsData)
    // console.log("grafieks.legend.data",grafieks.legend.data)

    // documentation for options
    // https://github.com/jakezatecky/d3-funnel/blob/master/README.md

    let {
        d3colorPalette = CONSTANTS.d3ColorPalette,
        dynamicHeight = CONSTANTS.FUNNEL.dynamicHeight,
        bottomPinch = CONSTANTS.FUNNEL.defaultBottomPinch,
        labelConfig = CONSTANTS.defaultValues.labelConfig,
        dataLabelfontSize = CONSTANTS.defaultValues.fontSize,
        dataLabelfontFamily = CONSTANTS.defaultValues.fontFamily,
        dataLabelColor = CONSTANTS.defaultValues.fontColor,
        dataLabelfontWeight,
        dataLabelfontStyle,
        dataLabeltextDecoration,
    } = grafieks.plotConfiguration;

    let { labelStatus } = labelConfig;

    const options = {
        block: {
            dynamicHeight,
            minHeight: 15,
            fill: {
                scale: d3colorPalette
            }
        },
        chart: {
            bottomPinch: Math.min(bottomPinch, data.length),
            curve: {
                enabled: false
            },
            width: window.innerWidth / 2,
            height: window.innerHeight - 80
        },
        tooltip: {
            enabled: false
        },
        label: {
            enabled: labelStatus,
            fill: dataLabelColor,
            fontSize: dataLabelfontSize,
            fontFamily: dataLabelfontFamily,
            fontWeight: dataLabelfontWeight ? "bold" : "normal",
            fontStyle: dataLabelfontStyle ? "italic" : "normal",
            textDecoration: dataLabeltextDecoration ? "underline" : "none"
        }
    };

    console.log(options)
    dataValues.forEach((value, i) => {
        value.label = value.label || value.key;
        if (i >= d3colorPalette.length && d3colorPalette.length < dataValues.length) {
            d3colorPalette.push(...d3colorPalette);
        }
    });
    // const legendsData = Object.keys(dataValues);
    grafieks.legend.data = legendsData;

    setLengend();
    const funnelChartDiv = document.createElement("div");
    funnelChartDiv.id = "funnelChart";
    const chartsDiv = document.querySelector(".charts-div");
    chartsDiv.appendChild(funnelChartDiv);

    const chart = new D3Funnel("#funnelChart");
    chart.draw(dataValues, options);
};
module.exports = chartGeneration;
