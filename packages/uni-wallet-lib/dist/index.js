"use strict";

var jsxRuntime = require("react/jsx-runtime");
var React = require("react");
var wagmi = require("wagmi");
var rainbowkit = require("@rainbow-me/rainbowkit");
var reactQuery = require("@tanstack/react-query");
var chains = require("wagmi/chains");
require("@rainbow-me/rainbowkit/styles.css");
var viem = require("viem");

const supportedChains = [chains.mainnet, chains.sepolia];
({
  [chains.mainnet.id]: "🔷",
  [chains.sepolia.id]: "🔷",
});

function createWalletConfig(options) {
  const {
    appName = "APP_NAME",
    projectId = "YOUR_PROJECT_ID",
    alchemyApiKey,
    infuraApiKey,
  } = options;
  // 创建传输层配置
  const transports = supportedChains.reduce((acc, chain) => {
    let rpcUrl = "";
    if (alchemyApiKey) {
      // 使用链名称构建 Alchemy URL
      const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
      rpcUrl = `https://${chainName}.g.alchemy.com/v2/${alchemyApiKey}`;
    }
    if (infuraApiKey) {
      // 使用链名称构建 Infura URL
      const chainName = chain.name.toLowerCase().replace(/\s+/g, "-");
      rpcUrl = `https://${chainName}.infura.io/v3/${infuraApiKey}`;
    }
    acc[chain.id] = rpcUrl ? wagmi.http(rpcUrl) : wagmi.http();
    return acc;
  }, {});
  const config = rainbowkit.getDefaultConfig({
    appName,
    projectId,
    chains: supportedChains,
    ssr: true,
    storage: wagmi.createStorage({
      storage: wagmi.cookieStorage,
    }),
  });
  return {
    config,
    transports,
  };
}

({
  ...rainbowkit.lightTheme(),
  colors: {
    ...rainbowkit.lightTheme().colors,
  },
  radii: {
    ...rainbowkit.lightTheme().radii,
  },
});
const customDarkTheme = {
  ...rainbowkit.darkTheme(),
  colors: {
    ...rainbowkit.darkTheme().colors,
    accentColor: "#0070f3",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.04)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.06)",
    actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.06)",
    closeButton: "rgba(224, 232, 255, 0.8)",
    closeButtonBackground: "rgba(255, 255, 255, 0.06)",
    connectButtonBackground: "#0070f3",
    connectButtonBackgroundError: "#ff494a",
    connectButtonInnerBackground:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06))",
    connectButtonText: "#ffffff",
    connectButtonTextError: "#ffffff",
  },
  radii: {
    ...rainbowkit.darkTheme().radii,
    actionButton: "8px",
    connectButton: "8px",
    menuButton: "8px",
    modal: "16px",
    modalMobile: "16px",
  },
};

const defaultQueryClient = new reactQuery.QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
function WalletProvider({
  children,
  theme = "auto",
  queryClient = defaultQueryClient,
  initialState,
  ...configOptions
}) {
  const { config: wagmiConfig } = React.useMemo(
    () => createWalletConfig(configOptions),
    [
      configOptions.appName,
      configOptions.projectId,
      configOptions.alchemyApiKey,
      configOptions.infuraApiKey,
    ],
  );
  const rainbowKitTheme = React.useMemo(() => {
    return customDarkTheme;
  }, [theme]);
  return /*#__PURE__*/ jsxRuntime.jsx(wagmi.WagmiProvider, {
    config: wagmiConfig,
    reconnectOnMount: true,
    initialState: initialState,
    children: /*#__PURE__*/ jsxRuntime.jsx(reactQuery.QueryClientProvider, {
      client: queryClient,
      children: /*#__PURE__*/ jsxRuntime.jsx(rainbowkit.RainbowKitProvider, {
        theme: rainbowKitTheme,
        modalSize: "compact",
        showRecentTransactions: true,
        children: children,
      }),
    }),
  });
}

function useWalletConnection() {
  const { address, connector, isConnected, isConnecting, isReconnecting } =
    wagmi.useAccount();
  const chainId = wagmi.useChainId();
  const chains = wagmi.useChains();
  const { connect: wagmiConnect, connectors } = wagmi.useConnect();
  const { reconnect: wagmiReconnect } = wagmi.useReconnect();
  const { disconnect: wagmiDisconnect } = wagmi.useDisconnect();
  // 根据当前chainId找到对应的chain对象
  const currentChain = chains.find((chain) => chain.id === chainId);
  const connect = (connectorId) => {
    if (connectorId) {
      const targetConnector = connectors.find((c) => c.id === connectorId);
      if (targetConnector) {
        wagmiConnect({
          connector: targetConnector,
        });
      }
    } else {
      const availableConnector = connectors[0];
      if (availableConnector) {
        wagmiConnect({
          connector: availableConnector,
        });
      }
    }
  };
  const reconnect = (config) => {
    wagmiReconnect(config);
  };
  const disconnect = () => {
    wagmiDisconnect();
  };
  return {
    isConnected,
    isConnecting,
    isReconnecting,
    address,
    connector: connector
      ? {
          id: connector.id,
          name: connector.name,
          type: connector.type,
        }
      : undefined,
    chain: currentChain,
    chains,
    connect,
    reconnect,
    disconnect,
  };
}

function useWalletInfo() {
  const { address, connector, isConnected } = wagmi.useAccount();
  const chainId = wagmi.useChainId();
  const chains = wagmi.useChains();
  const chain = chains.find((c) => c.id === chainId);
  const { data: ensName } = wagmi.useEnsName({
    address,
  });
  const { data: balance, isLoading: isBalanceLoading } = wagmi.useBalance({
    address: address,
  });
  const formattedBalance = balance
    ? {
        value: balance.value,
        formatted: viem.formatEther(balance.value),
        symbol: balance.symbol,
        decimals: balance.decimals,
      }
    : undefined;
  return {
    address,
    isConnected,
    ensName,
    chainId,
    connector: connector
      ? {
          id: connector.id,
          name: connector.name,
          type: connector.type,
          icon: connector.icon,
        }
      : undefined,
    chain,
    balance: formattedBalance,
    isBalanceLoading,
  };
}

function useNetworkSwitch() {
  const chains = wagmi.useChains();
  const chainId = wagmi.useChainId();
  const currentChain = chains.find((c) => c.id === chainId);
  const { switchChain, isPending, error, isSuccess, reset } =
    wagmi.useSwitchChain();
  const switchToNetwork = (options) => {
    if (!switchChain) {
      throw new Error("❌Network switching not supported");
    }
    try {
      switchChain({
        chainId: options.chainId,
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
      throw error;
    }
  };
  const isCurrentChain = (_chainId) => {
    return chainId === _chainId;
  };
  return {
    currentChain,
    switchToNetwork,
    isPending,
    error,
    isSuccess,
    reset,
    isCurrentChain,
    canSwitchNetwork: !!switchChain,
  };
}

function useContractRead({
  address,
  abi,
  functionName,
  args,
  chainId,
  enabled = true,
  cacheTime = 0,
  staleTime = 0,
}) {
  const { data, ...result } = wagmi.useReadContract({
    address,
    abi,
    functionName,
    args,
    chainId,
    query: {
      enabled,
      gcTime: cacheTime,
      staleTime,
    },
  });
  return {
    data: data,
    ...result,
  };
}

function useContractWrite({
  address,
  abi,
  functionName,
  args,
  value,
  chainId,
  enabled = true,
  gasLimit,
}) {
  const { writeContract, writeContractAsync, ...returnTypes } =
    wagmi.useWriteContract();
  const receipt = wagmi.useWaitForTransactionReceipt({
    hash: returnTypes.data,
    query: {
      enabled: !!returnTypes.data,
    },
  });
  const write = (overrides) => {
    if (!enabled) return;
    writeContract({
      address,
      abi,
      functionName,
      args: overrides?.args || args,
      value: overrides?.value || value,
      chainId,
      gas: overrides?.gas || gasLimit,
    });
  };
  const writeAsync = async (overrides) => {
    if (!enabled) return;
    return await writeContractAsync({
      address,
      abi,
      functionName,
      args: overrides?.args || args,
      value: overrides?.value || value,
      chainId,
      gas: overrides?.gas || gasLimit,
    });
  };
  return {
    write,
    writeAsync,
    receipt,
    ...returnTypes,
  };
}

var ERC20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
];

var CourseContractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ydToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_platformAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "instructor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "CourseCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "instructor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "CoursePurchased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "courseIds",
        type: "uint256[]",
      },
    ],
    name: "batchCheckAccess",
    outputs: [
      {
        internalType: "bool[]",
        name: "",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "courseStudentCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "courseStudents",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "courses",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "address",
        name: "instructor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isPublished",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "address",
        name: "instructor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "createCourse",
    outputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "getCourse",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "address",
            name: "instructor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isPublished",
            type: "bool",
          },
        ],
        internalType: "struct ICourseContract.Course",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "getCourseStudentCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "getCourseStudents",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "instructor",
        type: "address",
      },
    ],
    name: "getInstructorCourses",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
    ],
    name: "getStudentCourses",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalCourses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "hasAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hasPurchased",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "courseId",
        type: "uint256",
      },
    ],
    name: "purchaseCourse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "studentCourses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCourses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ydToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

var SimpleYDContractAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "EXCHANGE_RATE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "ownerAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeETHForTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC20_ABI = ERC20Abi;
const COURSE_CONTRACT_ABI = CourseContractAbi;
const SIMPLE_YD_TOKEN_ABI = SimpleYDContractAbi;

function useERC20({ address, spenderAddress, enabled = true }) {
  const { address: userAddress } = wagmi.useAccount();
  /* ========== 辅助方法 ========== */ /**
   * 解析金额
   * 将字符串形式的金额转换为 bigint（考虑代币精度）
   * @param amount - 字符串形式的金额，如 '100.5'
   * @returns bigint 类型的代币数量
   * @throws 如果代币精度未加载，抛出错误
   */ const parseAmount = (amount) => {
    if (!decimals) throw new Error("Decimals not loaded");
    return viem.parseUnits(amount, decimals);
  };
  /* ========== 读取合约数据 ========== */ // 读取代币总供应量
  const { data: totalSupply } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "totalSupply",
    enabled,
  });
  // 读取当前用户的代币余额
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    enabled: enabled && !!userAddress,
  });
  // 读取代币精度
  const { data: decimals } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "decimals",
    enabled,
  });
  // 读取当前用户对指定地址的授权额度
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args:
      userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    enabled: enabled && !!userAddress && !!spenderAddress,
  });
  /* ========== 合约写入方法 ========== */ // 转账
  const transferWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "transfer",
  });
  /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */ const transfer = async (to, amount) => {
    if (!transferWrite.writeAsync) throw new Error("Transfer not available");
    const parsedAmount = parseAmount(amount);
    return transferWrite.writeAsync({
      args: [to, parsedAmount],
    });
  };
  // 授权
  const approveWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "approve",
  });
  /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */ const approve = async (spender, amount) => {
    if (!approveWrite.writeAsync) throw new Error("Approve not available");
    const parsedAmount = parseAmount(amount);
    return approveWrite.writeAsync({
      args: [spender, parsedAmount],
    });
  };
  // 代理转账函数的写入 Hook
  const transferFromWrite = useContractWrite({
    address,
    abi: ERC20_ABI,
    functionName: "transferFrom",
  });
  /**
   * 代理转账函数
   * 从指定地址转账到另一个地址（需要提前授权）
   * @param from - 转出地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '50'）
   * @returns 交易的 Promise
   * @throws 如果代理转账功能不可用，抛出错误
   */ const transferFrom = async (from, to, amount) => {
    if (!transferFromWrite.writeAsync)
      throw new Error("TransferFrom not available");
    const parsedAmount = parseAmount(amount);
    return transferFromWrite.writeAsync({
      args: [from, to, parsedAmount],
    });
  };
  return {
    /* 代币基本信息 */ totalSupply: totalSupply,
    balance: balance,
    allowance: allowance,
    transferReceipt: transferWrite.receipt,
    approveReceipt: approveWrite.receipt,
    transferFromReceipt: transferFromWrite.receipt,
    /* 方法 */ refetchBalance,
    refetchAllowance,
    transfer,
    approve,
    transferFrom,
  };
}

const YD_CONTRACT_ADDRESS = "0xA812265c869F2BCB755980677812F253459A0cc7";
function useSimpleYDToken({
  address = YD_CONTRACT_ADDRESS,
  spenderAddress,
  enabled = true,
}) {
  const { address: userAddress } = wagmi.useAccount();
  const [estGasTo, setEstGasTo] = React.useState();
  const [estGasValue, setEstGasValue] = React.useState();
  const { data: gasEstimate, refetch: refetchEstimateGas } =
    wagmi.useEstimateGas({
      account: userAddress,
      to: estGasTo,
      value: estGasValue,
      query: {
        enabled: false,
      },
    });
  /* ========== 辅助方法 ========== */ /**
   * 解析金额
   * 将字符串形式的金额转换为 bigint（考虑代币精度）
   * @param amount - 字符串形式的金额，如 '100.5'
   * @returns bigint 类型的代币数量
   * @throws 如果代币精度未加载，抛出错误
   */ const parseAmount = (amount) => {
    if (!decimals) throw new Error("Decimals not loaded");
    return viem.parseUnits(amount, decimals);
  };
  const prepareRefetchEstimateGas = async (to, value) => {
    setEstGasTo(to);
    setEstGasValue(value);
    // 等待 React 下一次渲染周期，确保 state 更新
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log(`🔢 请求参数: to->${to} / value->${value}`);
    // 然后调用 refetch
    await refetchEstimateGas();
    console.log("⛽️ Estimate Gas:", gasEstimate);
    // ✅ 立即清理
    setEstGasTo(undefined);
    setEstGasValue(undefined);
  };
  /* ========== 读取合约数据 ========== */ // 读取代币总供应量
  const { data: totalSupply } = useContractRead({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "totalSupply",
    enabled,
  });
  // 读取当前用户的代币余额
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    enabled: enabled && !!userAddress,
  });
  // 读取代币精度
  const { data: decimals } = useContractRead({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "decimals",
    enabled,
  });
  // 读取当前用户对指定地址的授权额度
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "allowance",
    args:
      userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    enabled: enabled && !!userAddress && !!spenderAddress,
  });
  /* ========== 合约写入方法 ========== */ // 转账
  const transferWrite = useContractWrite({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "transfer",
  });
  /**
   * 转账函数
   * 将代币从当前用户转账到指定地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '100.5'）
   * @returns 交易的 Promise
   * @throws 如果转账功能不可用，抛出错误
   */ const transfer = async (to, amount) => {
    if (!transferWrite.writeAsync) throw new Error("Transfer not available");
    const parsedAmount = parseAmount(amount);
    await prepareRefetchEstimateGas(to, parsedAmount);
    return transferWrite.writeAsync({
      args: [to, parsedAmount],
    });
  };
  // 授权
  const approveWrite = useContractWrite({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "approve",
  });
  /**
   * 授权函数
   * 授权指定地址可以支配的代币数量
   * @param spender - 被授权地址
   * @param amount - 授权金额（字符串形式，如 '1000'）
   * @returns 交易的 Promise
   * @throws 如果授权功能不可用，抛出错误
   */ const approve = async (spender, amount) => {
    if (!approveWrite.writeAsync) throw new Error("Approve not available");
    const parsedAmount = parseAmount(amount);
    await prepareRefetchEstimateGas(YD_CONTRACT_ADDRESS, undefined);
    return approveWrite.writeAsync({
      args: [spender, parsedAmount],
    });
  };
  // 代理转账函数的写入 Hook
  const transferFromWrite = useContractWrite({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "transferFrom",
  });
  /**
   * 代理转账函数
   * 从指定地址转账到另一个地址（需要提前授权）
   * @param from - 转出地址
   * @param to - 接收地址
   * @param amount - 转账金额（字符串形式，如 '50'）
   * @returns 交易的 Promise
   * @throws 如果代理转账功能不可用，抛出错误
   */ const transferFrom = async (from, to, amount) => {
    if (!transferFromWrite.writeAsync)
      throw new Error("TransferFrom not available");
    const parsedAmount = parseAmount(amount);
    await prepareRefetchEstimateGas(to, parsedAmount);
    return transferFromWrite.writeAsync({
      args: [from, to, parsedAmount],
    });
  };
  // 兑换YD币 (ETH -> YD)
  const exchangeETHForTokensWriter = useContractWrite({
    address,
    abi: SIMPLE_YD_TOKEN_ABI,
    functionName: "exchangeETHForTokens",
  });
  const exchangeETHForTokens = async (ether) => {
    if (!exchangeETHForTokensWriter.writeAsync) {
      throw new Error("Exchange not available");
    }
    await prepareRefetchEstimateGas(
      YD_CONTRACT_ADDRESS,
      viem.parseEther(ether),
    );
    return exchangeETHForTokensWriter.writeAsync({
      value: viem.parseEther(ether),
      gas: gasEstimate,
    });
  };
  return {
    /* 代币基本信息 */ totalSupply: totalSupply,
    balance: balance,
    allowance: allowance,
    transferReceipt: transferWrite.receipt,
    approveReceipt: approveWrite.receipt,
    transferFromReceipt: transferFromWrite.receipt,
    /* 方法 */ refetchBalance,
    refetchAllowance,
    transfer,
    approve,
    transferFrom,
    exchangeETHForTokens,
  };
}

const COURSE_CONTRACT_ADDRESS = "0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d";
function useCourseContract({
  address = COURSE_CONTRACT_ADDRESS,
  tokenDecimals = 18,
}) {
  // ========== 工具函数 ==========
  /**
   * 解析价格
   * 将字符串形式的价格转换为 bigint（考虑代币精度）
   */ const parsePrice = (price) => {
    return viem.parseUnits(price, tokenDecimals);
  };
  /* ========== 读取合约数据 ========== */ /**
   * 检查用户是否有课程访问权限
   * @param studentAddress 学生地址
   * @param courseId 课程ID
   */ const hasAccess = (studentAddress, courseId) => {
    const hasArgs = Boolean(studentAddress && courseId);
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "hasAccess",
      args: hasArgs ? [studentAddress, courseId] : undefined,
      enabled: hasArgs,
    });
  };
  /**
   * 获取课程信息
   * @param courseId 课程ID
   */ const getCourse = (courseId) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourse",
      args: courseId ? [courseId] : undefined,
      enabled: true,
    });
  };
  /**
   * 获取学生购买的所有课程
   * @param studentAddress 学生地址
   */ const getStudentCourses = (studentAddress) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getStudentCourses",
      args: studentAddress ? [studentAddress] : undefined,
      enabled: true,
    });
  };
  /**
   * 获取课程的所有学生
   * @param courseId 课程ID
   * @returns
   */ const getCourseStudents = (courseId) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourseStudents",
      args: courseId ? [courseId] : undefined,
      enabled: true,
    });
  };
  /**
   * 获取讲师的所有课程
   * @param instructorAddress 讲师地址
   * @returns
   */ const getInstructorCourses = (instructorAddress) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getInstructorCourses",
      args: instructorAddress ? [instructorAddress] : undefined,
      enabled: true,
    });
  };
  /**
   * 获取课程总数
   * @returns
   */ const getTotalCourses = () => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getTotalCourses",
      enabled: true,
    });
  };
  /**
   * 获取课程学生数量
   * @param courseId 课程ID
   * @returns
   */ const getCourseStudentCount = (courseId) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "getCourseStudentCount",
      args: [courseId],
      enabled: true,
    });
  };
  /**
   * 批量检查访问权限
   * @param student 学生地址
   * @param courseIds 课程ID数组
   * @returns
   */ const batchCheckAccess = (student, courseIds) => {
    return useContractRead({
      address,
      abi: COURSE_CONTRACT_ABI,
      functionName: "batchCheckAccess",
      args: [student, courseIds],
      enabled: true,
    });
  };
  /* ========== 写入合约数据 ========== */ // 创建课程
  const createCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "createCourse",
  });
  /**
   * 创建课程
   * @param title 课程标题
   * @param instructor 课程价格
   * @param price
   * @returns
   */ const createCourse = async (title, instructor, price) => {
    if (!createCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    const parsedPrice = parsePrice(price);
    return createCourseWriter.writeAsync({
      args: [title, instructor, parsedPrice],
    });
  };
  // 购买课程
  const purchaseCourseWriter = useContractWrite({
    address,
    abi: COURSE_CONTRACT_ABI,
    functionName: "purchaseCourse",
  });
  const purchaseCourse = async (courseId) => {
    if (!purchaseCourseWriter.writeAsync) {
      throw new Error("创建课程方法未创建");
    }
    return purchaseCourseWriter.writeAsync({
      args: [courseId],
    });
  };
  return {
    createCourseReceipt: createCourseWriter.receipt,
    purchaseCourseReceipt: purchaseCourseWriter.receipt,
    hasAccess,
    getCourse,
    getStudentCourses,
    getCourseStudents,
    getInstructorCourses,
    getTotalCourses,
    getCourseStudentCount,
    batchCheckAccess,
    createCourse,
    purchaseCourse,
  };
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 =
  "/* Profile Menu */\n.profile__menu-wrapper {\n  position: relative;\n}\n\n.profile__menu-trigger {\n  display: flex;\n  height: 2.5rem;\n  width: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: white;\n  color: #6a6d94;\n  border: 1px solid #e7e5fb;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s;\n  cursor: pointer;\n}\n\n.profile__menu-trigger:hover {\n  transform: translateY(-1px);\n}\n\n.profile__avatar {\n  border-radius: 50%;\n}\n\n/* Wallet Dropdown */\n.wallet-dropdown {\n  position: absolute;\n  right: 0;\n  top: 2.8rem;\n  width: 18rem;\n  border-radius: 1rem;\n  background-color: white;\n  padding: 1rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #2b2558;\n  box-shadow: 0 24px 60px rgba(154, 161, 255, 0.18);\n  border: 1px solid #ecebff;\n}\n\n.wallet-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n}\n\n.wallet-label {\n  font-size: 0.75rem;\n  line-height: 1rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #8b8eb5;\n}\n\n.wallet-value {\n  margin-top: 0.25rem;\n  font-weight: 600;\n}\n\n.wallet-chain-id {\n  border-radius: 9999px;\n  background-color: #f4f4ff;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  font-weight: 500;\n  color: #5f6094;\n}\n\n.wallet-section {\n  margin-top: 1rem;\n}\n\n.wallet-address-box {\n  margin-top: 0.25rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-radius: 0.75rem;\n  background-color: #f8f8ff;\n  padding: 0.5rem 0.75rem;\n}\n\n.wallet-address-text {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #2b2558;\n}\n\n.copy-button {\n  border-radius: 9999px;\n  padding: 0.25rem;\n  color: #6a6d94;\n  transition: background-color 0.2s;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n}\n\n.copy-button:hover {\n  background-color: white;\n}\n\n/* Balance Info Box */\n.balance-info-box {\n  margin-top: 1rem;\n  border-radius: 0.75rem;\n  background-color: #f9f9ff;\n  padding: 0.75rem;\n}\n\n.balance-info-label {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.75rem;\n  line-height: 1rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #8b8eb5;\n}\n\n.balance-info-amount {\n  margin-top: 0.5rem;\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n  font-weight: 600;\n}\n\n/* Disconnect Button */\n.disconnect-button {\n  margin-top: 1rem;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  padding: 0.5rem 1rem;\n  border-radius: 0.5rem;\n  background-color: #f3f4f6;\n  color: #374151;\n  font-weight: 500;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.disconnect-button:hover:not(:disabled) {\n  background-color: #e5e7eb;\n}\n\n.disconnect-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.disconnect-button.loading {\n  opacity: 0.7;\n}\n";
styleInject(css_248z$1);

const Profile = ({ account, chain, openAccountModal }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const { disconnect } = useWalletConnection();
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDisconnect = () => {
    setIsMenuOpen(false);
    disconnect();
  };
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("");
  };
  return /*#__PURE__*/ jsxRuntime.jsxs("div", {
    className: "profile__menu-wrapper",
    ref: menuRef,
    children: [
      /*#__PURE__*/ jsxRuntime.jsx("button", {
        onClick: () => setIsMenuOpen(!isMenuOpen),
        type: "button",
        className: "profile__menu-trigger profile__avatar",
        "aria-label": "Account menu",
        children: /*#__PURE__*/ jsxRuntime.jsxs("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            /*#__PURE__*/ jsxRuntime.jsx("path", {
              d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
            }),
            /*#__PURE__*/ jsxRuntime.jsx("circle", {
              cx: "12",
              cy: "7",
              r: "4",
            }),
          ],
        }),
      }),
      isMenuOpen && // Wallet Dropdown (conditionally shown)
        /*#__PURE__*/ jsxRuntime.jsxs("div", {
          className: "wallet-dropdown",
          id: "walletDropdown",
          children: [
            /*#__PURE__*/ jsxRuntime.jsxs("div", {
              className: "wallet-header",
              children: [
                /*#__PURE__*/ jsxRuntime.jsxs("div", {
                  children: [
                    /*#__PURE__*/ jsxRuntime.jsx("div", {
                      className: "wallet-label",
                      children: "网络",
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx("div", {
                      className: "wallet-value",
                      children: chain.name,
                    }),
                  ],
                }),
                /*#__PURE__*/ jsxRuntime.jsx("div", {
                  className: "wallet-chain-id",
                  children: "ID 1",
                }),
              ],
            }),
            /*#__PURE__*/ jsxRuntime.jsxs("div", {
              className: "wallet-section",
              children: [
                /*#__PURE__*/ jsxRuntime.jsx("div", {
                  className: "wallet-label",
                  children: "地址",
                }),
                /*#__PURE__*/ jsxRuntime.jsxs("div", {
                  className: "wallet-address-box",
                  children: [
                    /*#__PURE__*/ jsxRuntime.jsx("span", {
                      className: "wallet-address-text",
                      children: account.displayName,
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx("button", {
                      type: "button",
                      className: "copy-button",
                      "aria-label": "复制地址",
                      onClick: handleCopyAddress,
                      children: /*#__PURE__*/ jsxRuntime.jsxs("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        children: [
                          /*#__PURE__*/ jsxRuntime.jsx("rect", {
                            x: "9",
                            y: "9",
                            width: "13",
                            height: "13",
                            rx: "2",
                            ry: "2",
                          }),
                          /*#__PURE__*/ jsxRuntime.jsx("path", {
                            d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
            /*#__PURE__*/ jsxRuntime.jsxs("div", {
              className: "balance-info-box",
              children: [
                /*#__PURE__*/ jsxRuntime.jsxs("div", {
                  className: "balance-info-label",
                  children: [
                    /*#__PURE__*/ jsxRuntime.jsxs("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      children: [
                        /*#__PURE__*/ jsxRuntime.jsx("circle", {
                          cx: "12",
                          cy: "12",
                          r: "10",
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx("line", {
                          x1: "12",
                          y1: "16",
                          x2: "12",
                          y2: "12",
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx("line", {
                          x1: "12",
                          y1: "8",
                          x2: "12.01",
                          y2: "8",
                        }),
                      ],
                    }),
                    "当前余额",
                  ],
                }),
                /*#__PURE__*/ jsxRuntime.jsx("div", {
                  className: "balance-info-amount",
                  children: account.displayBalance,
                }),
              ],
            }),
            /*#__PURE__*/ jsxRuntime.jsxs("button", {
              className: "disconnect-button",
              onClick: handleDisconnect,
              children: [
                /*#__PURE__*/ jsxRuntime.jsxs("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  children: [
                    /*#__PURE__*/ jsxRuntime.jsx("path", {
                      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx("polyline", {
                      points: "16 17 21 12 16 7",
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx("line", {
                      x1: "21",
                      y1: "12",
                      x2: "9",
                      y2: "12",
                    }),
                  ],
                }),
                "断开连接",
              ],
            }),
          ],
        }),
    ],
  });
};

var css_248z =
  '/* WalletButton Component Styles */\n.wallet-button {\n  font-family:\n    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",\n    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;\n}\n\n.wallet-button__container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  height: 44px;\n}\n\n.wallet-button__connect {\n  background: linear-gradient(to right, #eab308, #f97316);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  cursor: pointer;\n  font-weight: 600;\n  padding: 12px 24px;\n  transition: all 0.2s ease;\n  font-size: 14px;\n}\n\n.wallet-button__connect:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);\n}\n\n.wallet-button__wrong-network {\n  background: #ff6b6b;\n  border: none;\n  border-radius: 12px;\n  color: white;\n  cursor: pointer;\n  font-weight: 600;\n  padding: 12px 24px;\n  transition: all 0.2s ease;\n  font-size: 14px;\n}\n\n.wallet-button__wrong-network:hover {\n  background: #ff5252;\n}\n\n.wallet-button__connected {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n\n.wallet-button__chain {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 9999px;\n  background: linear-gradient(to right, #ffe7c5, #ffead4);\n  padding: 8px 12px;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  font-weight: 500;\n  color: #5a4b23;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);\n}\n\n.wallet-button__chain-icon {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 0.5rem;\n}\n\n.wallet-button__icon {\n  width: 1.5rem;\n  height: 1.5rem;\n  background: linear-gradient(to right, #facc15, #f97316);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.wallet-button__account {\n  transform: translateY(-1px);\n  display: flex;\n  align-items: center;\n  justify-content: space-evenly;\n  gap: 0.5rem;\n  background-color: rgba(22, 163, 74, 0.2);\n  border: 1px solid rgba(34, 197, 94, 0.3);\n  border-radius: 0.5rem;\n  padding: 0 12px;\n  height: 40px;\n  min-width: 150px;\n\n  align-items: center;\n  gap: 0.5rem;\n  border-radius: 9999px;\n  background-color: white;\n  padding: 0.25rem 0.75rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  color: #66608d;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  border: 1px solid #e6e4fa;\n  transition: transform 0.2s;\n  cursor: pointer;\n  border: none;\n}\n\n.wallet-button__status-bot {\n  width: 0.5rem;\n  height: 0.5rem;\n  background-color: #4ade80;\n  border-radius: 9999px;\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n\n.wallet-icon {\n  width: 1rem;\n  height: 1rem;\n  color: #4ade80;\n}\n\n.wallet-button__address {\n  font-weight: 600;\n  font-size: 0.875rem;\n  color: #4ade80;\n\n  font-size: 0.75rem;\n  line-height: 1rem;\n  color: #8b8eb5;\n}\n\n/* Notification Bell */\n.notification-container {\n  position: relative;\n}\n\n.notification-button {\n  position: relative;\n  display: flex;\n  height: 2.5rem;\n  width: 2.5rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: white;\n  color: #6a6d94;\n  border: 1px solid #e7e5fb;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-sizing: border-box;\n}\n\n.notification-badge {\n  position: absolute;\n  right: -0.25rem;\n  top: -0.25rem;\n  display: inline-flex;\n  height: 1rem;\n  width: 1rem;\n\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  background-color: #ff5a5f;\n  padding: 0.25 0.25rem;\n  font-size: 0.625rem;\n  line-height: 1rem;\n  font-weight: 600;\n  color: white;\n}\n';
styleInject(css_248z);

const WalletButton = ({
  label = "连接钱包",
  showBalance = true,
  showChainName = true,
  className = "",
  size = "medium",
}) => {
  return /*#__PURE__*/ jsxRuntime.jsx("div", {
    className: `wallet-button wallet-button--${size} ${className}`,
    children: /*#__PURE__*/ jsxRuntime.jsx(rainbowkit.ConnectButton.Custom, {
      children: ({
        account,
        chain: currentChain,
        openAccountModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          currentChain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return /*#__PURE__*/ jsxRuntime.jsx("div", {
          className: "wallet-button__container",
          children: (() => {
            if (!connected) {
              return /*#__PURE__*/ jsxRuntime.jsx("button", {
                onClick: openConnectModal,
                type: "button",
                className: "wallet-button__connect",
                children: label,
              });
            }
            return /*#__PURE__*/ jsxRuntime.jsxs("div", {
              className: "wallet-button__connected",
              children: [
                showChainName &&
                  /*#__PURE__*/ jsxRuntime.jsxs("div", {
                    className: "wallet-button__chain",
                    children: [
                      currentChain.iconUrl &&
                        /*#__PURE__*/ jsxRuntime.jsx("div", {
                          className: "wallet-button__chain-icon",
                          children: /*#__PURE__*/ jsxRuntime.jsx("img", {
                            alt: currentChain.name ?? "Chain icon",
                            src: currentChain.iconUrl,
                            className: "wallet-button__icon",
                          }),
                        }),
                      showBalance &&
                        account.displayBalance &&
                        /*#__PURE__*/ jsxRuntime.jsx("span", {
                          children: account.displayBalance,
                        }),
                    ],
                  }),
                /*#__PURE__*/ jsxRuntime.jsxs("button", {
                  onClick: openAccountModal,
                  type: "button",
                  className: "wallet-button__account",
                  children: [
                    /*#__PURE__*/ jsxRuntime.jsx("span", {
                      className: "wallet-button__status-bot",
                    }),
                    /*#__PURE__*/ jsxRuntime.jsxs("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "wallet-icon",
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "aria-hidden": "true",
                      children: [
                        /*#__PURE__*/ jsxRuntime.jsx("path", {
                          d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
                        }),
                        /*#__PURE__*/ jsxRuntime.jsx("path", {
                          d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
                        }),
                      ],
                    }),
                    /*#__PURE__*/ jsxRuntime.jsx("span", {
                      className: "wallet-button__address",
                      children: account.displayName,
                    }),
                  ],
                }),
                /*#__PURE__*/ jsxRuntime.jsx("div", {
                  className: "notification-container",
                  children: /*#__PURE__*/ jsxRuntime.jsxs("div", {
                    className: "notification-button",
                    children: [
                      /*#__PURE__*/ jsxRuntime.jsxs("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        children: [
                          /*#__PURE__*/ jsxRuntime.jsx("path", {
                            d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9",
                          }),
                          /*#__PURE__*/ jsxRuntime.jsx("path", {
                            d: "M13.73 21a2 2 0 0 1-3.46 0",
                          }),
                        ],
                      }),
                      /*#__PURE__*/ jsxRuntime.jsx("span", {
                        className: "notification-badge",
                        children: "99",
                      }),
                    ],
                  }),
                }),
                /*#__PURE__*/ jsxRuntime.jsx(Profile, {
                  account: account,
                  chain: currentChain,
                  openAccountModal: openAccountModal,
                }),
              ],
            });
          })(),
        });
      },
    }),
  });
};

exports.WalletButton = WalletButton;
exports.WalletProvider = WalletProvider;
exports.useCourseContract = useCourseContract;
exports.useERC20 = useERC20;
exports.useNetworkSwitch = useNetworkSwitch;
exports.useSimpleYDToken = useSimpleYDToken;
exports.useWalletConnection = useWalletConnection;
exports.useWalletInfo = useWalletInfo;
