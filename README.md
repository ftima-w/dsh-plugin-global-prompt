<div align="center">

# dsh-plugin-global-prompt-switch

在 **DSH（DeepSeek Harness）** 侧边栏底部新增一个「全局提示词」入口，用浮层面板编辑一段**全局 Prompt**——它会被注入到**每一次对话**（含已开着的会话、新会话、子代理）的系统提示词里。保存即生效。

> 这是 [chaserchan/dsh-plugin-global-prompt](https://github.com/chaserchan/dsh-plugin-global-prompt)（Gitee: [chasechan](https://gitee.com/chasechan/dsh-plugin-global-prompt)）的 fork，修复了新版 DSH 下的若干问题，并加入了独立开关。原项目由 **逐鹿科技（chasechan）** 创作，MIT 协议。

[![License](https://img.shields.io/github/license/ftima-w/dsh-plugin-global-prompt?style=flat&colorA=000000&colorB=000000)](LICENSE)
[![Upstream](https://img.shields.io/badge/upstream-chaserchan%2Fdsh--plugin--global--prompt-181717?style=flat&logo=github&logoColor=ffffff&colorA=000000&colorB=000000)](https://github.com/chaserchan/dsh-plugin-global-prompt)

</div>

## 相比原版的改动

| 方面 | 原版 | 本 fork |
|---|---|---|
| 入口位置 | 设置 → 通用设置 里的一行 | 侧边栏底部独立入口 + 浮层面板 |
| 开关 | 无（留空即停用） | 独立开关，可保留文本而临时停用 |
| 客户端依赖 | 依赖 `@deepseek-ai/dsh-client-runtime`，新版 DSH 中该包已不存在，导致 web 启动失败 | 已移除该依赖 |
| 输入稳定性 | 面板刷新会中断输入法组词（拼音 `yi'bian` 被提交成字面文本）、丢失焦点 | 状态固定到 `globalThis` + 单例 textarea，刷新不打断组词、不丢焦点 |
| 删除光标 | — | 修复删除字符后光标后移 |
| 保存 | 每次输入即写 | 显式「保存 / 还原」+ 草稿持久化 |
| 语言 | 中文 | 中/英双语 |

## 为什么用独立开关

原版靠「留空即停用」。实际使用中，你往往想**临时关掉**一段已经写好的长提示词，又不想删掉它再重新打一遍。这个 fork 把开关和文本分开：关掉开关不影响已保存的文本。

## 安装

```sh
# 1. 安装到 profile（把 desktop 换成你的 profile 名）
dsh plugin --profile desktop add dsh-plugin-global-prompt-switch

# 2. 启用：在 $DSH_HOME/profiles/<name>/cordis.patch.yml 追加
# - insert:
#     - id: global-prompt-switch
#       name: 'dsh-plugin-global-prompt-switch'
```

或直接从本仓库安装：

```sh
dsh plugin --profile desktop add https://github.com/ftima-w/dsh-plugin-global-prompt
```

## 使用

1. 侧边栏底部点「全局提示词」；
2. 打开开关，写入你的要求，点「保存」；
3. 下一条回复即生效——**已在进行的会话、新会话、子代理**都会带上。

留空或关闭开关 = 不注入。

## 工作原理

- Host 侧注册两个 **volatile** Config 字段（`enabled` / `text`），写入时 Loader 原地更新运行中实例，无需重启；
- `systemPrompt.section({ text: () => ... })` 的 `text` 是**函数**，每个 agent 每次模型调用前都会重新求值，所以能覆盖到已经在跑的会话；
- `interpolate: false` 保证用户文本按字面注入，`{{...}}` 不会被当成模板；
- 客户端状态全部挂在 `globalThis` 的 Symbol 上，模块重载不会清空面板状态或重建输入框。

## 许可

MIT。原始版权归 **逐鹿科技（chasechan）** 所有，见 [LICENSE](LICENSE)。
