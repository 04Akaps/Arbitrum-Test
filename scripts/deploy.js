/* global BigInt */

const { providers, Wallet } = require("ethers");
const hre = require("hardhat");
const ethers = require("ethers");
const { hexDataLength } = require("@ethersproject/bytes");
const {
  L1ToL2MessageGasEstimator,
} = require("@arbitrum/sdk/dist/lib/message/L1ToL2MessageGasEstimator");

const {
  L1TransactionReceipt,
  L1ToL2MessageStatus,
  EthBridger,
  getL2Network,
  L2TransactionReceipt,
} = require("@arbitrum/sdk");

const walletPrivateKey =
  "4fdbe4cf7ea3bf1408794f1cfdfc9c551ab9195c9f475f0d379c8eb2911f241f";

const l1Provider = new ethers.providers.JsonRpcProvider(
  "https://eth-rinkeby.alchemyapi.io/v2/8OPSPq-TUd9JIWMNCPKyi0qUU8D2ccxB"
);
// https://eth-rinkeby.alchemyapi.io/v2/8OPSPq-TUd9JIWMNCPKyi0qUU8D2ccxB

const l2Provider = new ethers.providers.JsonRpcProvider(
  "https://crimson-summer-card.arbitrum-testnet.discover.quiknode.pro/514f523c485c0fe61eb3ad4603c77845c63a052d/"
);

// https://crimson-summer-card.arbitrum-testnet.discover.quiknode.pro/514f523c485c0fe61eb3ad4603c77845c63a052d/

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

// async function L1ToL2() {
//   const l2Network = await getL2Network(l2Provider);
//   const ethBridger = new EthBridger(l2Network);
//   const inboxAddress = ethBridger.l2Network.ethBridge.inbox;

//   const L1Greeter = await (
//     await hre.ethers.getContractFactory("GreeterL1")
//   ).connect(l1Wallet);

//   console.log("Deploying L1 Greeter 👋");

// const l1Greeter = await L1Greeter.deploy(
//   "Hello world in L1",
//   ethers.constants.AddressZero, // temp l2 addr
//   inboxAddress
// );

//   await l1Greeter.deployed();

//   console.log(`deployed to ${l1Greeter.address}`);

//   const L2Greeter = await (
//     await hre.ethers.getContractFactory("GreeterL2")
//   ).connect(l2Wallet);

//   console.log("Deploying L2 Greeter 👋👋");

//   const l2Greeter = await L2Greeter.deploy(
//     "Hello world in L2",
//     ethers.constants.AddressZero // temp l1 addr
//   );

//   await l2Greeter.deployed();

//   console.log(`deployed to ${l2Greeter.address}`);

//   const updateL1Tx = await l1Greeter.updateL2Target(l2Greeter.address);
//   await updateL1Tx.wait();

//   const updateL2Tx = await l2Greeter.updateL1Target(l1Greeter.address);
//   await updateL2Tx.wait();
//   console.log("Counterpart contract addresses set in both greeters 👍");

//   const currentL2Greeting = await l2Greeter.greet();
//   console.log(`Current L2 greeting: "${currentL2Greeting}"`);

//   console.log("Updating greeting from L1 to L2:");

//   const newGreeting = "Greeting from far, far away";

//   const newGreetingBytes = ethers.utils.defaultAbiCoder.encode(
//     ["string"],
//     [newGreeting]
//   );
//   const newGreetingBytesLength = hexDataLength(newGreetingBytes) + 4; // 4 bytes func identifier

//   const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);

//   // const _submissionPriceWei =
//   //   await l1ToL2MessageGasEstimate.estimateSubmissionFee(
//   //     l1Provider,
//   //     await l1Provider.getGasPrice(),
//   //     newGreetingBytesLength
//   //   );

//   // console.log(
//   //   `Current retryable base submission price: ${_submissionPriceWei.toString()}`
//   // );

//   const gasPriceBid = await l2Provider.getGasPrice();
//   console.log(`L2 gas price: ${gasPriceBid.toString()}`);

//   const ABI = ["function setGreeting(string _greeting)"];
//   const iface = new ethers.utils.Interface(ABI);
//   const calldata = iface.encodeFunctionData("setGreeting", [newGreeting]);

//   // const maxGas = await l1ToL2MessageGasEstimate.estimateRetryableTicketGasLimit(
//   //   l1Greeter.address,
//   //   l2Greeter.address,
//   //   ethers.utils.parseEther("0"),
//   //   l2Wallet.address,
//   //   l2Wallet.address,
//   //   calldata,
//   //   ethers.utils.parseEther("0.01"),
//   //   ethers.BigNumber.from("6000000000"),
//   //   ethers.BigNumber.from("0"),
//   //   ethers.BigNumber.from("0")
//   // );

//   // 6000000000
//   // 40000

//   // const setGreetingTx = await l1Greeter.setGreetingInL2(
//   //   newGreeting, // string memory _greeting,
//   //   6000000000,
//   //   40000,
//   //   gasPriceBid,
//   //   {
//   //     value: 6000000000 * 5 + gasPriceBid * 40000,
//   //   }
//   // );
//   // const setGreetingRec = await setGreetingTx.wait();

//   // console.log(
//   //   `Greeting txn confirmed on L1! 🙌 ${setGreetingRec.transactionHash}`
//   // );

//   // const l1TxReceipt = new L1TransactionReceipt(setGreetingRec);

//   // /**
//   //  * In principle, a single L1 txn can trigger any number of L1-to-L2 messages (each with its own sequencer number).
//   //  * In this case, we know our txn triggered only one
//   //  * Here, We check if our L1 to L2 message is redeemed on L2
//   //  */
//   // const message = await l1TxReceipt.getL1ToL2Message(l2Wallet);
//   // const status = await message.waitForStatus();
//   // console.log(status);
//   // if (status === L1ToL2MessageStatus.REDEEMED) {
//   //   console.log(`L2 retryable txn executed 🥳 ${message.l2TxHash}`);
//   // } else {
//   //   console.log(
//   //     `L2 retryable txn failed with status ${L1ToL2MessageStatus[status]}`
//   //   );
//   // }

//   // const newGreetingL2 = await l2Greeter.greet();
//   // console.log(`Updated L2 greeting: "${newGreetingL2}"`);
//   // console.log("✌️");

//   const currentL1Greeting = await l2Greeter.greet();
//   console.log(`Current L2 greeting: "${currentL1Greeting}"`);

//   const setGreetingTxToL1 = await l2Greeter.setGreetingInL1("test입니다.");

//   const setGreetingRec2 = await setGreetingTxToL1.wait();

//   console.log(
//     `Greeting txn confirmed on L1! 🙌 ${setGreetingRec2.transactionHash}`
//   );

//   const l2TxReceipt = new L2TransactionReceipt(setGreetingRec2);

//   /**
//    * In principle, a single L1 txn can trigger any number of L1-to-L2 messages (each with its own sequencer number).
//    * In this case, we know our txn triggered only one
//    * Here, We check if our L1 to L2 message is redeemed on L2
//    */
//   const message = await l2TxReceipt.getL2ToL1Messages(l1Wallet);

//   const status = await message.waitForStatus();

//   if (status === L1ToL2MessageStatus.REDEEMED) {
//     console.log(`L2 retryable txn executed 🥳 ${message.l1TxHash}`);
//   } else {
//     console.log(
//       `L2 retryable txn failed with status ${L1ToL2MessageStatus[status]}`
//     );
//   }

//   const newGreetingL1 = await l1Greeter.greet();
//   console.log(`Updated L2 greeting: "${newGreetingL1}"`);
//   console.log("✌️");
// }

async function L2ToL1() {
  const L1Contract = await (
    await hre.ethers.getContractFactory("SimpleStorageL1")
  ).connect(l1Wallet);

  const l1Contract = await L1Contract.deploy();

  console.log(`Deploying L1 Greeter 👋👋 ${l1Contract.address}`);

  const L2Contract = await (
    await hre.ethers.getContractFactory("SimpleStorageL2")
  ).connect(l2Wallet);

  const l2Contract = await L2Contract.deploy(l1Contract.address);

  console.log(`Deploying L2 Greeter 👋👋 ${l2Contract.address}`);

  const currentL1Int = await l1Contract.get();
  const currentL1Address = await l1Contract.getAddress();

  console.log(`Current L1 uint: "${currentL1Int}"`);
  console.log(`Current L1 address: "${currentL1Address}"`);

  const L2SendTxUint = await l2Contract.sendTxToL1();
  await L2SendTxUint.wait();

  const L2SendTxAddress = await l2Contract.sendTxToL1CheckAddress();
  await L2SendTxAddress.wait();

  const nextL1Int = await l1Contract.get();
  const nextL1Address = await l1Contract.getAddress();

  console.log(`Next L1 uint: "${nextL1Int}"`);
  console.log(`Next L1 address: "${nextL1Address}"`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// L1ToL2().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

L2ToL1().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
