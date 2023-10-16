# smart-accounts-website

### TL;DR

我们的 demo 先生成一个本机电脑的 passkey，
通过芯片 TouchId，计算合约钱包，指纹验证后
产生 Session Key 会话密钥，一定时间有效期进行交易。
我们可以看到每笔交易会有 ophash 和上链的 txhash，
有了 session key 我们可以进行交易，这里是 mint NFT

### Intro

下面介绍一下我们 Scaffold，我们开发者包括 Logic，Ellen 和 Sky
我们是帮助和引入下一爆款应用的开发者的 AA 应用脚手架，

目前 AA 现状是抽象账户是未来的 ETH 钱包账户标准，但是 ERC4337 标准未统一，生态应用缺乏，而且新用户体验和交互层出不穷，Passkey，意图交易，已经很多 AA 基础设施选择，Accountjs 开发时候就已经计划 Scaffold。

我们的 Accountjs 和应用脚手架公共物品。随着基础设施出现越来越多，学习门槛也在增加。AA 应用脚手架是开发者快速上手 AA 应用的框架，提供优秀的 Dapp 实践案例。它可以帮助你快速启动开发链上游戏，链上社交和链上金融 AA 应用。希望 AA 应用开发脚手架是你 AA 第一个应用启动框架

我们脚手架上实现了 AA 钱包基础功能，账户功能包括：激活，恢复，转换 Owner，余额查询，进行合约调用和调试：发送 UserOp，代币转账，生成 NFT，交换，还有更多验证功能：邮箱，OAuth，多签，社交恢复，Passkey

Demo 简单实现了 Passkey 验证，加入会话密钥，定期轮换密钥，合约实现了 secp256r1 算法，可以用 TouchID 或 FaceID 登录，接下来制作移动端嵌入式钱包脚手架。

我们最近做了 AA hackerhouse，发现接入仍然很复杂，我们的基础设施包括了 Smart Account 一个模块化，多验证基础版本 AA 合约，可自定义钩子和模块，安全，验证，恢复，执行。还有 Accountjs，对标 AA 开源公共物品里的 viem 和 wagmi ，SDK 整合多种基础设施，实践标准可以细粒化 AA 合约调用和模块抽象出常用方法，

### Visions

最后是我们愿景，AA 是应用层标准，是国人最熟悉的应用领域，未来的合约账户钱包标准，应该有国人一席之地，我们做的实践都是 Web3 应用走向 Mass Adoption 铺路
