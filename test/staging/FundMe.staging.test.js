const { getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

// let variable = false
// let someVar = variable ? "yes" : "no"
// 如果是vaiable，在這裡是development chain，那麼skip，如果不是development chain是testnet，那就執行

//也可以寫成 if (variable) {someVar = "yes"} else {someVar = "no"}
//把判斷式也加到unit test，但是相反，如果在development chain，就不skip，所以前面加上!
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
