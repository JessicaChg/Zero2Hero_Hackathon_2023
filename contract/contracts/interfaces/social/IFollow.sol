// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../../core/SemanticBaseStruct.sol";
import "../ISemanticSBT.sol";

interface IFollow is ISemanticSBT {


    function initialize(
        address owner,
        address minter,
        string memory name_,
        string memory symbol_,
        string memory schemaURI_,
        string[] memory classes_,
        Predicate[] memory predicates_
    ) external;

    function createGroup(uint256 groupIndex) external payable;

        /**
         * Follow the owner of the current contract.
         * @return tokenId The tokenId.
     */
    function follow() external payable returns (uint256);

    /**
     * Unfollow
     * @return tokenId The tokenId.
     */
    function unfollow() external payable returns (uint256);


    /**
     * Returns whether the `addr` is following the owner of the current contract
     */
    function isFollowing(address addr) external view returns (bool);

    /**
     * Returns the address represented by the current Follow contract
     * @return addr The address.
     */
    function representedAddress() external view returns (address addr);
}