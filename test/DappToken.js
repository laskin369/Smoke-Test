var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken', function(accounts){
     var tokenInstance;

     it('initilizes contract with the correct values.', function(){
         return DappToken.deployed().then(function(instance){
             tokenInstance = instance;
             return tokenInstance.name();
         }).then(function(name){
             assert.equal(name, "DApp Token", "it has a great name");
             return tokenInstance.symbol();
         }).then(function(symbol){
             assert.equal(symbol, "DAPP", "it has a great symbol");
             return tokenInstance.standard()
         }).then(function(standard){
              assert.equal(standard, "DApp token v1.0", "it has the correct standard");
         })
     })
    it('allocates initial supply upon deployment', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin accaunt');
        });
    });

    it("trunsfers ownerships of the tokens", function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            //Test require statment first by transfering ballance larger then sender's ballance
            return tokenInstance.transfer.call(accounts[1],9999999999999)
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>= 0, 'error messege mast contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
        }).then(function(saccess){
            assert.equal(saccess, true, 'its return true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the"Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);

        }).then(function(ballance){
            assert.equal(ballance.toNumber(), 250000, 'adds the ammount to reciving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(ballance){
            assert.equal(ballance.toNumber(), 750000,('deducts the ammoun from sending account'))
        })
    })
})
