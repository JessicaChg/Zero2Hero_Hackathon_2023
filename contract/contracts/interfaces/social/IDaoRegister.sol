// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../ISemanticSBT.sol";


interface IDaoRegister is ISemanticSBT {

    function deployDaoContract(address to, string calldata name,string calldata daoURI) external returns (uint256);


    function daoOf(uint256 tokenId) external view returns (address owner, address contractAddress);
}