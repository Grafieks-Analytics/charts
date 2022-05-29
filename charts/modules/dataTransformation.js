const d3 = require("d3");
const CONSTANTS = require("../constants");

const isDateFormat = (itemType) => {
    if (itemType === "Date") {
        return true;
    }
    return false;
};

const sortDates = (datesArray, dateFormat) => {
    datesArray.sort(function (a, b) {
        if (dateFormat == "%d") {
            // Setting date value in accending order
            return +a - +b;
        }
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b) - new Date(a);
    });
    return datesArray;
};

const formattedDateValues = (dataValues, dateFormat) => {
    const timeFormat = d3.timeFormat(dateFormat);

    const { chartName } = window.grafieks.plotConfiguration;

    let transformedData;

    switch (chartName) {
        case CONSTANTS.BAR_CHART:
            const newDataSet = {};
            const [xAxisData, yAxisData] = dataValues;

            xAxisData.forEach((d, i) => {
                const dateValue = timeFormat(new Date(d));
                if (!newDataSet[dateValue]) {
                    newDataSet[dateValue] = 0;
                }
                newDataSet[dateValue] += yAxisData[i];
            });

            const dates = Object.keys(newDataSet);
            const sortedDates = sortDates(dates, dateFormat);
            console.log({ sortedDates });

            const values = sortedDates.map((d) => newDataSet[d]);

            transformedData = [sortedDates, values];
            break;
    }

    return transformedData;
};

const transformData = () => {
    const grafieks = window.grafieks;
    const { chartName, dataColumns: { xAxisColumnDetails = [], yAxisColumnDetails = [] } = {} } =
        grafieks.plotConfiguration;

    grafieks.flags.isDataTransformed = true;

    switch (chartName) {
        case CONSTANTS.BAR_CHART:
            const data = grafieks.dataUtils.rawData;
            const [dataValues] = data;

            if (isDateFormat(xAxisColumnDetails[0].itemType)) {
                grafieks.dataUtils.rawData[0] = formattedDateValues(dataValues, xAxisColumnDetails[0].dateFormat);
            }

            return;
        default:
            return;
    }
};

module.exports = {
    transformData
};
