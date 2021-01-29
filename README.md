# 文件提取工具

用于提取文件夹中指定类型文件到另一个文件夹。

## 使用方式

### 提取文件

控制台执行指令：`node index src=srcPath dest=destPath`即可。

#### 参数配置

参数可以直接在指令后输入，也可以在index.js所在根目录下添加一个`config.json`来配置，两者可以同时使用。

| 参数      | 值     | 备注     |
| ---------- | :-----------:  | :-----------: |
| src     | String    | 源文件夹路径     |
| dest     | String    | 目标文件夹路径     |
| rules     | String    | 需要过滤的文件类型，多个用','连接：js,ts,css     |
| type     | String    | 过滤方式：filter/ignore，分别表示过滤和排除rules中的文件     |

### 清空文件夹

控制台执行指令：`node index empty pathName`即可。后面添加`--rmdir`参数可将目标文件夹删除。