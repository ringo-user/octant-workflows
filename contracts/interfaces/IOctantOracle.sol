// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

interface IOctantOracle {
    function getTotalETHStakingProceeds(
        uint32 epoch
    ) external view returns (uint256);
}