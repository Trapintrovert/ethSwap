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
contract('EthSwap', (accounts) => {
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

    describe('buyTokens', async() => {
        it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
            await ethSwap.buyTokens({from: accounts[1], value: '1000000000000000000'})
        })
    })
})