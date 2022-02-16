pragma solidity ^0.5.0;

import './Token.sol';

contract EthSwap {
   string public name = "EthSwap Instant Exchange";
   Token public token;
   uint public rate = 100;

   constructor(Token _token) public {
      token = _token;
   }

   function buyTokens() public payable{
      // Calculate the nu,ber of tokens to buy
      uint tokenAmount = msg.value * rate;
      token.transfer(msg.sender, tokenAmount);
   }
}