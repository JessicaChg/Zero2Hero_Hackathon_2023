# Relation Graph Contract

## Quick start

1. install dependencies
```shell
npm install
```

2. compile
```shell
npx hardhat compile
```

3. deploy

update **hardhat.config.js**
```js
module.exports = {
  solidity: {
    ...
  },
  ...
  networks: {
    bsc_testnet: {
      url: "${RPC_URL}",
      accounts: [
        "${YOUR_PRIVATE_KEY}"
      ]
    }
  }
}
```

deploy with script
```shell
npx hardhat run script/deployFollow.js --network bsc_testnet
```

## Resource

### Contract address 


**BSC testnet**

| Name                               | Contract Address                            |
|------------------------------------|---------------------------------------------|
| Content                            | 0x570890Be6Fb3d1A6aA9B020Ef2d3E019a1cF0381  |
| FollowRegister                     | 0x2A10d00a65447f875bD7676833747DB986a2C6a3  |
| DaoRegister                        | 0x49A61b483bd6C9681a717cc4D878bDFed4eAF1d6  |

### Abi


| Name                  | abi file                                         |
|-----------------------|--------------------------------------------------|
| Content               | [Content.json](./abi/Content.json)               |
| FollowRegister        | [FollowRegister.json](./abi/FollowRegister.json) |
| Follow                | [Follow.json](./abi/Follow.json)                 |
| DaoRegister           | [DaoRegister.json](./abi/DaoRegister.json)       |
| Dao                   | [Dao.json](./abi/Dao.json)                       |



