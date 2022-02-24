const { assert } = require('chai')

// eslint-disable-next-line no-undef
const Token = artifacts.require('Token')
// eslint-disable-next-line no-undef
const EthSwap = artifacts.require('EthSwap')

require('chai')
    .use(require('chai-as-promised'))
    .should()

    function tokens(n){
        // eslint-disable-next-line no-undef
        return web3.utils.toWei(n, 'ether')
    }

// eslint-disable-next-line no-undef
contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap

    // eslint-disable-next-line no-undef
    before(async() => {
         token = await Token.new()
         ethSwap = await EthSwap.new(token.address)

        // Transfer all tokens to EthSwap (1 million)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token development', async () => {
        it('contract has a name', async () => {
            
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap development', async () => {
        it('contract has a name', async () => {
            
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('Contract has tokens', async () => {
            
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buyTokens()', async() => {
        let result
        // eslint-disable-next-line no-undef
        before(async() => {
            
             // eslint-disable-next-line no-undef
             result =  await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
        })

        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
           // Check investor token balance after purchase
           let investorBalance = await token.balanceOf(investor)
           assert.equal(investorBalance.toString(), tokens('100'))

           // Check ethSwap balance after purchase
           let ethSwapBalance
           ethSwapBalance = await token.balanceOf(ethSwap.address)
           assert.equal(ethSwapBalance.toString(), tokens('999900'))
           // eslint-disable-next-line no-undef
           ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
           // eslint-disable-next-line no-undef
           assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))


           const event = result.logs[0].args
           assert.equal(event.account, investor)
           assert.equal(event.token, token.address)
           assert.equal(event.amount.toString(), tokens('100').toString())
           assert.equal(event.rate.toString(), '100')
        })
    })

    describe('sellTokens()', async() => {
        let result
        // eslint-disable-next-line no-undef
        before(async() => {
            // Investor must approve tokens before the purchase
            await token.approve(ethSwap.address, tokens('100'), {from: investor})
            // Investor sells tokens
            result = await ethSwap.sellTokens(tokens('100'), {from: investor})
        })

        it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
             // Check investor token balance after purchase
             let investorBalance = await token.balanceOf(investor)
             assert.equal(investorBalance.toString(), tokens('0'))


              // Check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            // eslint-disable-next-line no-undef
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            // eslint-disable-next-line no-undef
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

            // Check log to ensure event was emitted with correct data
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

            //FAILURE: investor can't sell more token than they have
            await ethSwap.sellTokens(tokens('500'), { from:investor}).should.be.rejected;
        })
    })
})