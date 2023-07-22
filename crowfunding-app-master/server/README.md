# Crowd Funding Campaign Registry
`Join the decentralized revolution with our web3 crowdfunding platform. Invest in innovative projects, securely and transparently, using cryptocurrency.`

## `What is Web3 ?`

Web3 refers to the next generation of the internet, where users have more control over their data and interactions with decentralized systems, rather than relying on centralized intermediaries. In a web3 context, crowdfunding allows for secure and transparent investment opportunities without the need for a middleman, enabling a more equitable and efficient system for both investors and project creators.

## `Why we use blockchain in crowdfunding ?`

* `Decentralization:` Blockchain eliminates the need for intermediaries and creates a decentralized platform for transactions, making the process more secure, transparent, and efficient.

* `Immutable Record-Keeping:` Transactions made on the blockchain are permanent and can't be altered, providing a tamper-proof record of all investments and funding.

* `Faster Payments:` Blockchain technology enables faster, peer-to-peer transactions without the need for intermediaries, reducing wait times for funding disbursements.

* `Tokenization:` The ability to issue unique tokens for each project on the blockchain allows for easy tracking of investment and distribution of rewards.

* `Security:` Blockchain's cryptographic security measures protect against hacking, fraud, and other malicious activities.

### `Features` 
  
  ✅ Safe and Secure

  ✅ Transparent Transaction

  ✅ payment with Ethereum

  ✅ Industry-ready application

  ✅ Modern / Responsive / Beautiful  Design

### `Used Technologies`

* Solidity
* Ether.js
* Smart Contract
* TypeScript
* MetaMask
* Mocha
* Hardhat

### It's Salient Features are as follows:
* Completely Decentralized
* Highly Secured
* Fully Tamperproof
* Entirely Transparent
* Non-Private
* Censorship Resistant

## Contracts

```ml
auth
├─ Owned — "Simple single owner authorization"
tokens
├─ ERC721 — "Modern, minimalist, and gas efficient ERC721 implementation"
├─ ERC1155 — "Minimalist and gas efficient standard ERC1155 implementation"
utils
├─ ReentrancyGuard — "Gas optimized reentrancy protection for smart contracts"
````

# Coverage Report

| Statements                                                                               | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

# Prerequisites

- Docker

```shell
PATH+=":./bin"    # use your sh files (which are located in bin/) directly from the root of the project
```

```shell
yarn install      # install deps
yarn run build    # install solc and other tools in the docker image
```

Don't forget to copy the .env.example file to a file named .env, and then edit it to fill in the details.

# Running all the tests
# Test results
![Alt text](./diagrams/test-results.png?raw=true "Test results")

```shell
yarn run test

yarn run test:trace       # shows logs + calls
yarn run test:fresh       # force compile and then run tests
yarn run test:coverage    # run tests with coverage reports
```

# Formatters & Linters

You can use the below packages,

- Solhint
- ESLint
- Prettier
- CSpell
- ShellCheck

```shell
yarn run format
yarn run lint
```

# Analyzers

You can use the below tools,

- Slither
- Mythril

```shell
yarn run analyze:static path/to/contract
yarn run analyze:security path/to/contract
yarn run analyze:all path/to/contract
```

# Deploy Contract & Verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details.

- Enter your Etherscan API key
- Ropsten node URL (eg from Alchemy)
- The private key of the account which will send the deployment transaction.

With a valid .env file in place, first deploy your contract:

```shell
yarn run deploy ropsten <CONTRACT_FILE_NAME>    # related to scripts/deploy/<CONTRACT_FILE_NAME>.ts
yarn run deploy:all ropsten                     # related to scripts/deploy.ts
```

Also, you can add contract(s) manually to your tenderly projects from the output.
`https://dashboard.tenderly.co/contract/<NETWORK_NAME>/<CONTRACT_ADDRESS>`

And then verify it:

```shell
yarn run verify ropsten <DEPLOYED_CONTRACT_ADDRESS> "<CONSTRUCTOR_ARGUMENT(S)>"    # hardhat.config.ts to see all networks
```

# Finder

```shell
yarn run finder --path contracts/Workshop.sol --name Workshop abi --colorify --compact --prettify    # find contract outputs of specific contract
```

```shell
yarn run finder --help    # see all supported outputs (abi, metadata, bytecode and more than 20+ outputs)
```

# Miscellaneous

```shell
yarn run generate:docs    # generate docs according to the contracts/ folder
```

```shell
yarn run generate:flatten ./path/to/contract     # generate the flatten file (path must be "./" prefixed)
yarn run generate:abi ./path/to/contract         # generate the ABI file (path must be "./" prefixed)
yarn run generate:bin ./path/to/contract         # generate the binary in a hex (path must be "./" prefixed)
yarn run generate:metadata ./path/to/contract    # generate the metadata (path must be "./" prefixed)
yarn run generate:all-abi
yarn run generate:all-bin
yarn run generate:all-metadata
```

```shell
yarn run share    # share project folder with remix ide
```

# REPORT 

 Sūrya's Description Report

 Contracts Description Table

 Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |

