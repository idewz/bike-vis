const utils = {
  toNiceNumber: (number, precision = 2) => {
    return number.toLocaleString(undefined, {
      maximumFractionDigits: precision,
    });
  },
};

export const niceNumber = utils.toNiceNumber;
export default utils;
