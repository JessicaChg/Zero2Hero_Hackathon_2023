// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");

const name = 'Relation Content';
const symbol = 'SBT';
const baseURI = '';
const schemaURI = 'gnfd://schema/Content.ttl';
const class_ = [];
const predicate_ = [["publicContent", 1]];



async function deploySemanticSBTLogic(){
    const SemanticSBTLogic = await ethers.getContractFactory("SemanticSBTLogicUpgradeable");
    const semanticSBTLogicLibrary = await SemanticSBTLogic.deploy();
    console.log(`SemanticSBTLogicUpgradeable deployed ,contract address: ${semanticSBTLogicLibrary.address}`);
    return semanticSBTLogicLibrary.address
}


async function deployContent(semanticSBTLogicLibraryAddress,owner){
    const contractName = "Content";
    const MyContract = await hre.ethers.getContractFactory(contractName, {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
        }
    });

    const contentContract = await upgrades.deployProxy(MyContract,
        [owner.address,
            owner.address,
            name,
            symbol,
            baseURI,
            schemaURI,
            class_,
            predicate_],
        {unsafeAllowLinkedLibraries: true, initializer: 'initialize(address, address, string, string, string, string, string[], (string,uint8)[])'});

    await contentContract.deployed();
    console.log(
        `${contractName} deployed ,contract address: ${contentContract.address}`
    );
    return contentContract.address
}


async function main() {
    const [owner] = await ethers.getSigners();

    const semanticSBTLogicAddress = await deploySemanticSBTLogic()
    await deployContent(semanticSBTLogicAddress,owner.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
