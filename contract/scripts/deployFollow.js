// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");

const name = "Follow Template";
const symbol = 'SBT';
const schemaURI = 'gnfd://schema/Follow.ttl';
const class_ = [];
const predicate_ = [["following", 3]];


async function deploySemanticSBTLogic() {
    const SemanticSBTLogic = await ethers.getContractFactory("SemanticSBTLogicUpgradeable");
    const semanticSBTLogicLibrary = await SemanticSBTLogic.deploy();
    console.log(`SemanticSBTLogicUpgradeable deployed ,contract address: ${semanticSBTLogicLibrary.address}`);
    return semanticSBTLogicLibrary.address
}


async function deployFollow(semanticSBTLogicLibraryAddress) {
    const Follow = await hre.ethers.getContractFactory("Follow", {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
        }
    });
    const follow = await Follow.deploy();
    await follow.deployTransaction.wait();
    console.log(
        `Follow deployed ,contract address: ${follow.address}`
    );
    return follow.address
}


async function initFollow(followAddress, owner) {
    const follow = await hre.ethers.getContractAt("Follow", followAddress)

    await (await follow["initialize(address,address,string,string,string,string[],(string,uint8)[])"](
        owner,
        owner,
        name,
        symbol,
        schemaURI,
        class_,
        predicate_)).wait();

    console.log(
        `Follow contract initialize successfully!`
    );
}


async function main() {

    const [owner] = await ethers.getSigners();
    const semanticSBTLogicAddress = await deploySemanticSBTLogic()
    const followAddress = await deployFollow(semanticSBTLogicAddress)
    await initFollow(followAddress, owner.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
