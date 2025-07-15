# Hardhat 网络和 Signer 详解

## 1. 网络选择机制

### 网络优先级

1. **命令行参数**：`--network <network-name>`
2. **默认网络**：`hardhat.config.ts` 中的 `defaultNetwork`
3. **环境变量**：`HARDHAT_NETWORK`

### 网络配置示例

```typescript
// hardhat.config.ts
const config: HardhatUserConfig = {
  defaultNetwork: "localhost", // 默认网络

  networks: {
    // 内置网络 - 内存中的测试网络
    hardhat: {
      // 自动配置，无需额外设置
    },

    // 本地网络 - 连接到本地节点
    localhost: {
      url: "http://127.0.0.1:8545", // RPC 节点地址
      chainId: 31337,
    },

    // 测试网 - 连接到真实的测试网络
    sepolia: {
      url: process.env.SEPOLIA_URL || "", // 从环境变量获取 RPC 地址
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
```

## 2. Provider 如何知道连接到哪个网络？

### 网络切换过程

```bash
# 使用默认网络（localhost）
npx hardhat test

# 使用 hardhat 内置网络
npx hardhat test --network hardhat

# 使用 sepolia 测试网
npx hardhat test --network sepolia
```

### Provider 自动配置

- **Hardhat 内置网络**：`HardhatEthersProvider` - 内存中的模拟网络
- **本地网络**：`JsonRpcProvider` - 连接到本地节点
- **测试网/主网**：`JsonRpcProvider` - 连接到远程 RPC 节点

## 3. Signer 的来源

### 本地网络（localhost/hardhat）

```typescript
// Hardhat 自动生成 20 个测试账户
const signers = await ethers.getSigners();
// 每个账户都有 10,000 ETH 的初始余额
// 私钥是预定义的，用于测试
```

### 测试网/主网

```typescript
// 从 hardhat.config.ts 的 accounts 配置获取
sepolia: {
  accounts: [process.env.PRIVATE_KEY],  // 你的真实私钥
}
```

### Signer 类型

- **本地网络**：`HardhatEthersSigner` - 测试用
- **测试网/主网**：`Wallet` - 真实钱包

## 4. 实际运行示例

### localhost 网络

```
当前网络 ChainId: 31337
当前网络名称: localhost
当前区块号: 88
Signer 数量: 20
Provider 类型: HardhatEthersProvider
```

### hardhat 内置网络

```
当前网络 ChainId: 31337
当前网络名称: hardhat
当前区块号: 0
Signer 数量: 20
Provider 类型: HardhatEthersProvider
```

## 5. 关键区别

| 网络类型  | Provider              | Signer 来源      | 用途       |
| --------- | --------------------- | ---------------- | ---------- |
| hardhat   | HardhatEthersProvider | 20 个测试账户    | 单元测试   |
| localhost | JsonRpcProvider       | 20 个测试账户    | 本地开发   |
| sepolia   | JsonRpcProvider       | 配置文件中的私钥 | 测试网部署 |

## 6. 环境变量配置

### .env 文件示例

```env
# Sepolia 测试网 RPC 地址
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# 你的私钥（用于测试网部署）
PRIVATE_KEY=0x1234567890abcdef...

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 7. 常见问题

### Q: 为什么 localhost 和 hardhat 网络都是 ChainId 31337？

A: 31337 是 Hardhat 的标准 ChainId，用于区分本地开发网络。

### Q: 如何查看当前使用的网络？

A: 使用 `ethers.provider.getNetwork()` 获取网络信息。

### Q: 如何切换网络？

A: 使用 `--network` 参数或在配置中修改 `defaultNetwork`。
