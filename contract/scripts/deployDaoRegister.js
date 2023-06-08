// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers,upgrades} = require("hardhat");
const hre = require("hardhat");

const name = 'Relation Dao Register';
const symbol = 'SBT';
const baseURI = '';
const schemaURI = 'gnfd://schema/DaoRegister.ttl';
const class_ = ["Contract"];
const predicate_ = [["daoContract", 3]];

async function deploySemanticSBTLogic(){
    const SemanticSBTLogic = await ethers.getContractFactory("SemanticSBTLogicUpgradeable");
    const semanticSBTLogicLibrary = await SemanticSBTLogic.deploy();
    console.log(`SemanticSBTLogicUpgradeable deployed ,contract address: ${semanticSBTLogicLibrary.address}`);
    return semanticSBTLogicLibrary.address
}

async function deployDaoRegisterLogic(){
    const DaoRegisterLogic = await ethers.getContractFactory("DaoRegisterLogic");
    const daoRegisterLogicLibrary = await DaoRegisterLogic.deploy();
    console.log(`DaoRegisterLogic deployed ,contract address: ${daoRegisterLogicLibrary.address}`);
    return daoRegisterLogicLibrary.address
}


async function deployDao(semanticSBTLogicLibraryAddress){
    const Dao = await ethers.getContractFactory("Dao", {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
        }
    });
    const dao = await Dao.deploy();
    await dao.deployTransaction.wait();
    console.log(`Dao deployed ,contract address: ${dao.address}`);
    return dao.address
}


async function deployUpgradeableBeacon(daoAddress){
    const UpgradeableBeacon = await hre.ethers.getContractFactory("UpgradeableBeacon");
    const upgradeableBeacon = await UpgradeableBeacon.deploy(daoAddress);
    await upgradeableBeacon.deployTransaction.wait();
    const upgradeableBeaconAddress = upgradeableBeacon.address
    console.log(`UpgradeableBeacon deployed ,contract address: ${upgradeableBeaconAddress}`);
    return upgradeableBeaconAddress
}


async function deployDaoRegister(semanticSBTLogicLibraryAddress,daoRegisterLogicLibraryAddress,owner){
    const contractName = "DaoRegister";
    const MyContract = await ethers.getContractFactory(contractName, {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
            DaoRegisterLogic: daoRegisterLogicLibraryAddress,
        }
    });

    const daoRegister = await upgrades.deployProxy(MyContract,
        [owner,
            name,
            symbol,
            baseURI,
            schemaURI,
            class_,
            predicate_],
        {unsafeAllowLinkedLibraries: true});

    await daoRegister.deployed();
    console.log(`${contractName} deployed ,contract address: ${daoRegister.address}`);
    return daoRegister.address
}


async function setDaoImpl(daoRegisterAddress,upgradeableBeaconAddress){
    const daoRegister = await hre.ethers.getContractAt("DaoRegister",daoRegisterAddress)
    await (await daoRegister.setDaoImpl(upgradeableBeaconAddress)).wait();
    console.log(`DaoRegister setDaoImpl successfully!` );
}


async function upgrade(daoProxyAddress,semanticSBTLogicLibraryAddress,daoRegisterLogicLibraryAddress){

    const contractName = "DaoRegister";
    const MyContract = await ethers.getContractFactory(contractName, {
        libraries: {
            SemanticSBTLogicUpgradeable: semanticSBTLogicLibraryAddress,
            DaoRegisterLogic: daoRegisterLogicLibraryAddress,
        }
    });

    await upgrades.upgradeProxy(
        daoProxyAddress,
        MyContract,
        {unsafeAllowLinkedLibraries: true});
    console.log(`DaoRegister upgradeable successfully!` );
}

async function main() {

    const [owner] = await ethers.getSigners();

    // bsc testnet
    // const semanticSBTLogicAddress = "0xD48B47a9B30d68b642a706c639Facd2f8e838535"
    // const daoRegisterLogicAddress = "0x131db07cA2Cb0eE77C0711971dEcDf4A38802b1f"
    // const daoRegisterAddress = "0x49A61b483bd6C9681a717cc4D878bDFed4eAF1d6"
    // const daoAddress = "0x072DDbe361C92dB51b35AA23a9B19FeF457efbd3"
    // const upgradeableBeaconAddress = "0x55E8fc27a752aD25a54b9FA6e79cff322205144B"

    const semanticSBTLogicAddress = await deploySemanticSBTLogic()
    const daoRegisterLogicAddress = await deployDaoRegisterLogic()
    const daoAddress = await deployDao(semanticSBTLogicAddress)
    const upgradeableBeaconAddress = await deployUpgradeableBeacon(daoAddress)
    const daoRegisterAddress = await deployDaoRegister(semanticSBTLogicAddress,daoRegisterLogicAddress,owner.address)
    await setDaoImpl(daoRegisterAddress,upgradeableBeaconAddress)

    //upgrade
    await upgrade(daoRegisterAddress,semanticSBTLogicAddress,daoRegisterLogicAddress)

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
