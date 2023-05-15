// import

// async function deployFunc() {
//     console.log("hey!")
// hre.getNamedAccounts()
// hre.deployments()
// }

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
// }

// const {} 就是從 require import {}內的object的意思
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("------------------------------------")

    // when going for localhost or hardhat network we want to use a mock
    log("Deploying Fundme, waiting for confirmations...")
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("--------------------------------------")

    //auto-verification
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }
    log("-------------------------------")
}

module.exports.tags = ["all", "fundme"]
