// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers, upgrades} = require("hardhat");

const name = 'Relation Follow Register';
const symbol = 'SBT';
const baseURI = '';
const schemaURI = 'gnfd://schema/FollowRegister.ttl';
const class_ = ["Contract"];
const predicate_ = [["followContract", 3]];


async function deploySemanticSBTLogic(){
    const SemanticSBTLogic = await ethers.getContractFactory("SemanticSBTLogicUpgradeable");
    const semanticSBTLogicLibrary = await SemanticSBTLogic.deploy();
    console.log(`SemanticSBTLogicUpgradeable deployed ,contract address: ${semanticSBTLogicLibrary.address}`);
    return semanticSBTLogicLibrary.address
}

async function deployFollowRegisterLogic(){
    const FollowRegisterLogic = await ethers.getContractFactory("FollowRegisterLogic");
    const followRegisterLogicLibrary = await FollowRegisterLogic.deploy();
    console.log(`FollowRegisterLogic deployed ,contract address: ${followRegisterLogicLibrary.address}`);
    return followRegisterLogicLibrary.address
}


async function deployFollow(semanticSBTLogicLibraryAddress){
    const Follow = await ethers.getContractFactory("Follow", {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
        }
    });
    const follow = await Follow.deploy();
    await follow.deployTransaction.wait();
    console.log(`Follow deployed ,contract address: ${follow.address}`);
    return follow.address
}


async function deployUpgradeableBeacon(FollowAddress){
    const UpgradeableBeacon = await hre.ethers.getContractFactory("UpgradeableBeacon");
    const upgradeableBeacon = await UpgradeableBeacon.deploy(FollowAddress);
    await upgradeableBeacon.deployTransaction.wait();
    const upgradeableBeaconAddress = upgradeableBeacon.address
    console.log(`UpgradeableBeacon deployed ,contract address: ${upgradeableBeaconAddress}`);
    return upgradeableBeaconAddress
}


async function deployFollowRegister(semanticSBTLogicLibraryAddress,FollowRegisterLogicLibraryAddress,owner){
    const contractName = "FollowRegister";
    const MyContract = await ethers.getContractFactory(contractName, {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
            FollowRegisterLogic: FollowRegisterLogicLibraryAddress,
        }
    });

    const followRegister = await upgrades.deployProxy(MyContract,
        [owner,
            name,
            symbol,
            baseURI,
            schemaURI,
            class_,
            predicate_],
        {unsafeAllowLinkedLibraries: true});

    await followRegister.deployed();
    console.log(`${contractName} deployed ,contract address: ${followRegister.address}`);
    return followRegister.address
}


async function setFollowImpl(followRegisterAddress,upgradeableBeaconAddress){
    const followRegister = await hre.ethers.getContractAt("FollowRegister",followRegisterAddress)
    await (await followRegister.setfollowImpl(upgradeableBeaconAddress)).wait();
    console.log(`FollowRegister setFollowImpl successfully!` );
}


async function upgrade(followProxyAddress,semanticSBTLogicLibraryAddress,followRegisterLogicLibraryAddress){

    const contractName = "FollowRegister";
    const MyContract = await ethers.getContractFactory(contractName, {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
            FollowRegisterLogic: followRegisterLogicLibraryAddress,
        }
    });

    await upgrades.upgradeProxy(
        followProxyAddress,
        MyContract,
        {unsafeAllowLinkedLibraries: true});
    console.log(`FollowRegister upgradeable successfully!` );
}

async function main() {

    const [owner] = await ethers.getSigners();

    // bsc testnet
    // const semanticSBTLogicAddress = "0xD48B47a9B30d68b642a706c639Facd2f8e838535"
    // const followRegisterLogicAddress = "0x53956f984411067f6f9ffCdC0Ff70A0BEF9C7f93"
    // const followRegisterAddress = "0x2A10d00a65447f875bD7676833747DB986a2C6a3"
    // const followAddress = "0x072DDbe361C92dB51b35AA23a9B19FeF457efbd3"
    // const upgradeableBeaconAddress = "0xa5fca0710aDa13ff8aFFcd51a37403d612B7E887"

    const semanticSBTLogicAddress = await deploySemanticSBTLogic()
    const followRegisterLogicAddress = await deployFollowRegisterLogic()
    const followAddress = await deployFollow(semanticSBTLogicAddress)
    const upgradeableBeaconAddress = await deployUpgradeableBeacon(followAddress)
    const followRegisterAddress = await deployFollowRegister(semanticSBTLogicAddress,followRegisterLogicAddress,owner.address)
    await setFollowImpl(followRegisterAddress,upgradeableBeaconAddress)

    //upgrade
    await upgrade(followRegisterAddress,semanticSBTLogicAddress,followRegisterLogicAddress)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
