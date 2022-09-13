const { providers, Wallet } = require("ethers");
const hre = require("hardhat");
const ethers = require("ethers");
const { hexDataLength } = require("@ethersproject/bytes");
const {
  L1ToL2MessageGasEstimator,
} = require("@arbitrum/sdk/dist/lib/message/L1ToL2MessageGasEstimator");
const { arbLog, requireEnvVariables } = require("arb-shared-dependencies");
const {
  L1TransactionReceipt,
  L1ToL2MessageStatus,
  EthBridger,
  getL2Network,
} = require("@arbitrum/sdk");

const walletPrivateKey =
  "4fdbe4cf7ea3bf1408794f1cfdfc9c551ab9195c9f475f0d379c8eb2911f241f";

const l1Provider = new providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/apTja9Ab9jNlZtnCHzLc2bVLbkG6Ywro"
);

const l2Provider = new providers.JsonRpcProvider(
  "https://arb-goerli.g.alchemy.com/v2/6MngETAfssRerDSGt3orG69doZCTNUEG"
);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const main = async () => {
  const l2Network = await getL2Network(l2Provider);
  const ethBridger = new EthBridger(l2Network);
  const inboxAddress = ethBridger.l2Network.ethBridge.inbox;

  const newGreeting = "Greeting from far, far away";

  const newGreetingBytes = ethers.utils.defaultAbiCoder.encode(
    ["string"],
    [newGreeting]
  );
  // 단순히 encode
  // -> web3.eth.abi.encodeParameters
  const newGreetingBytesLength = hexDataLength(newGreetingBytes) + 4; // 4 bytes func identifier

  const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);

  // const _submissionPriceWei =
  //   await l1ToL2MessageGasEstimate.estimateSubmissionFee(
  //     l1Provider,
  //     await l1Provider.getGasPrice(),
  //     newGreetingBytesLength
  //   );

  // console.log(_submissionPriceWei);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
