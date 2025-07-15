# 问题排查和解决方案

## 问题 1：hardhat-deploy 插件错误

### 错误信息

```
Error in plugin hardhat-deploy:
Unsupported network for JSON-RPC server. Only hardhat is currently supported.
hardhat-deploy cannot run on the hardhat provider when defaultNetwork is not hardhat
```

### 问题原因

- `hardhat-deploy` 插件要求 `defaultNetwork` 必须是 `"hardhat"`
- 你的配置中 `defaultNetwork` 设置为 `"localhost"`

### 解决方案

修改 `hardhat.config.ts`：

```typescript
const config: HardhatUserConfig = {
  // 将默认网络改为 hardhat
  defaultNetwork: "hardhat", // 之前是 "localhost"

  networks: {
    hardhat: {
      // hardhat 内置网络配置
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // ... 其他网络配置
  },
};
```

### 网络使用说明

- **默认网络**：`hardhat` - 用于测试和开发
- **本地网络**：`localhost` - 连接到本地节点
- **测试网**：`sepolia` - 连接到 Sepolia 测试网

### 运行命令

```bash
# 使用默认网络（hardhat）
npx hardhat test
npx hardhat node

# 使用 localhost 网络
npx hardhat test --network localhost
npx hardhat node --network localhost

# 使用 sepolia 网络
npx hardhat test --network sepolia
```

## 问题 2：chai-as-promised 导入问题

### 错误信息

```
Error [ERR_REQUIRE_ESM]: require() of ES Module chai-as-promised
```

### 问题原因

- `chai-as-promised@8.0.1` 是 ES Module
- 项目使用 CommonJS 模块系统

### 解决方案

#### 方案 1：降级版本（推荐）

```bash
npm uninstall chai-as-promised
npm install chai-as-promised@7.1.1
```

#### 方案 2：正确的导入方式

```typescript
import { deployments, ethers, getNamedAccounts } from "hardhat";
import type { Contract } from "ethers";
import { assert, expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
```

## 问题 3：BigInt 类型错误

### 错误信息

```
Operator '+' cannot be applied to types 'bigint' and 'number'
```

### 解决方案

```typescript
// 确保所有值都是 bigint 类型
const gasUsed = transactionReceipt.gasUsed; // bigint
const gasPrice = transactionReceipt.gasPrice; // bigint
const gasCost = gasUsed * gasPrice; // bigint

// 使用 BigInt() 转换
const result = endingFunds + BigInt(gasCost);
```

## 完整的修复步骤

### 1. 修复 hardhat 配置

```typescript
// hardhat.config.ts
defaultNetwork: "hardhat", // 改为 hardhat
```

### 2. 修复测试文件

```typescript
// test/unit/FundMe.test.ts
import { deployments, ethers, getNamedAccounts } from "hardhat";
import type { Contract } from "ethers";
import { assert, expect } from "chai";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

// 在测试中正确计算 gas cost
const gasUsed = transactionReceipt.gasUsed;
const gasPrice = transactionReceipt.gasPrice;
const gasCost = gasUsed * gasPrice;

assert.equal(
  (endingFunds + BigInt(gasCost)).toString(),
  (startingFunds + startingFundsContract).toString()
);
```

### 3. 验证修复

```bash
# 启动本地节点
npx hardhat node

# 运行测试
npx hardhat test --grep "single funder"
```

## 常见问题

### Q: 为什么需要将 defaultNetwork 改为 hardhat？

A: hardhat-deploy 插件要求默认网络必须是 hardhat，这样才能正确运行 JSON-RPC 服务器。

### Q: 如何在不同网络间切换？

A: 使用 `--network` 参数：

- `npx hardhat test --network localhost`
- `npx hardhat test --network sepolia`

### Q: BigInt 运算有什么注意事项？

A: 确保所有参与运算的值都是 bigint 类型，使用 `BigInt()` 进行类型转换。

## 总结

1. **修改默认网络**：`defaultNetwork: "hardhat"`
2. **修复导入**：使用正确的 chai-as-promised 导入
3. **处理 BigInt**：确保类型一致性
4. **验证修复**：运行测试确认问题解决
