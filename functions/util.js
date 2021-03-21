module.exports = function () {  

  trimCommas = function (str) {
    return str.replace(/(^\s*,)|(,\s*$)/g, "");
  };
  
};
