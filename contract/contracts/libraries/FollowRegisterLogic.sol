// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {Clones} from '@openzeppelin/contracts/proxy/Clones.sol';
import {IFollow} from "../interfaces/social/IFollow.sol";
import {Follow} from "../social/Follow.sol";
import {BeaconProxy} from "../upgrade/BeaconProxy.sol";
import {Predicate, FieldType} from "../core/SemanticBaseStruct.sol";

library FollowRegisterLogic {

    string constant  FOLLOWING = "following";
    string constant NAME = "Follow SBT";
    string constant SYMBOL = "SBT";
    string constant SCHEMA_URI = "gnfd://schema/Follow.ttl";


    function createFollow(address beaconAddress, address owner, address minter) external returns (address){
        address followContract;
        bytes memory code = type(BeaconProxy).creationCode;
        bytes memory data = _getEncodeWithSelector( owner, minter);
        bytes memory bytecode = abi.encodePacked(code, abi.encode(beaconAddress, data));
        bytes32 salt = keccak256(abi.encodePacked(owner, minter));
        assembly {
            followContract := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        return followContract;
    }

    function _getEncodeWithSelector(address owner, address minter) internal pure returns (bytes memory) {
        Predicate[] memory predicates_ = new Predicate[](1);
        predicates_[0] = Predicate(FOLLOWING, FieldType.SUBJECT);
        bytes4 func = IFollow.initialize.selector;

        return abi.encodeWithSelector(func, owner, minter, NAME, SYMBOL, SCHEMA_URI, new string[](0), predicates_);
    }


}
