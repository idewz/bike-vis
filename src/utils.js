const utils = {
  toNiceNumber: number => {
    return number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  },
};

export const niceNumber = utils.toNiceNumber;
export default utils;
