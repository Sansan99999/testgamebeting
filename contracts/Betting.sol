// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betting {
    address public owner = 0x393F4694b64564fd5f7638e7f13E3F099f5a74bC; // Wallet address for losing bets
    address public player;
    uint public playerBalance;

    event BetPlaced(address player, uint amount, bool result);

    // Function to place a bet
    function placeBet(uint amount) external payable {
        require(msg.value == amount, "Bet amount mismatch");

        player = msg.sender;
        playerBalance = msg.value;

        bool result = randomWinOrLose();
        if (result) {
            payable(player).transfer(amount * 2); // Win: Double the bet amount is returned
        } else {
            payable(owner).transfer(amount); // Lose: Funds go to the owner's wallet
        }

        emit BetPlaced(player, amount, result);
    }

    // Function to determine random win or loss
    function randomWinOrLose() internal view returns (bool) {
        return (block.timestamp % 2 == 0); // Simple random logic (improve for better randomness)
    }
}
