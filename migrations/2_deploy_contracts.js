const BookAd = artifacts.require("BookAd");

module.exports = function(deployer) {
  deployer.deploy(BookAd, 2121, 10);
};
