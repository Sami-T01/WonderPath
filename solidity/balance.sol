// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Rewards {
    // Map user address to balance
    mapping(address => uint256) public balances;

    /// @notice Explicitly set the balance of a user
    /// @param user   The address of the user
    /// @param amount The new balance to assign
    function setBalance(address user, uint256 amount) external {
        balances[user] = amount;
    }

    /// @notice Increment the balance of a user by a given amount
    /// @param user   The address of the user
    /// @param amount The amount to add to the user's balance
    function incrementBalance(address user, uint256 amount) external {
        balances[user] += amount;
    }

    /// @notice Decrement the balance of a user by a given amount
    /// @param user   The address of the user
    /// @param amount The amount to subtract from the user's balance
    function decrementBalance(address user, uint256 amount) external {
        require(balances[user] >= amount, "Insufficient balance");
        balances[user] -= amount;
    }

    /// @notice Get the balance of a user
    /// @param user The address of the user
    /// @return     The current balance
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}