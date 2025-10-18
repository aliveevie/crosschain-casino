// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiceGame {
    event Bet(address indexed player, uint256 guess, uint256 roll, uint256 payout);

    function placeBet(uint256 guess) external payable {
        require(guess >= 1 && guess <= 6, "bad guess");
        require(msg.value > 0, "no bet");
        uint256 roll = (uint256(blockhash(block.number - 1)) ^ uint256(uint160(msg.sender))) % 6 + 1;
        uint256 payout = 0;
        if (roll == guess) {
            payout = msg.value * 5;
            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");
        }
        emit Bet(msg.sender, guess, roll, payout);
    }
}