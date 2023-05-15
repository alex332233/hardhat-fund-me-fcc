const { network, getNamedAccounts } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config.js")
// const { Log } = require("ethers")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //remember to set namedAccount in hardhat.config.js or you will get undefined"length" error
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        // chainId == 31337
        // developmentChains.includes(chainId)
        log("Detected the Local network. Deploying...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed...")
        log("---END---")
    }
}

module.exports.tags = ["all", "mocks"]
