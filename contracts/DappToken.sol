pragma solidity >=0.4.2 <0.8.0;

contract DappToken{
    //constructor
    //set the total number of tokens
    //read the total number of tokens
    //name
    string public name = "DApp Token";
    //symbol
    string public symbol = "DAPP";
    //standard
    string public standard = "DApp token v1.0";
    uint256 public totalSupply;

    event Transfer(
         address indexed _from,
         address indexed _to,
         uint256 _value
    );

    mapping(address => uint256) public balanceOf;


    constructor(uint256 _initialSupply ) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;

    }
     //trunsfer

     function transfer(address _to, uint256 _value)public returns(bool succes){
         //MUST fire the transfer event
         //SHOULD throw if sender(messege coller account) dose note have inough tokens
         //return bullean value if transfer is sucssesful or not
          require(balanceOf[msg.sender] >= _value);
         // transfer the balanceOf
         balanceOf[msg.sender]-= _value;
         balanceOf[_to]+= _value;

         emit Transfer(msg.sender, _to, _value);
         return true;
    }
 }
