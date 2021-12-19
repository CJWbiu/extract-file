# 文件提取工具

用于提取文件夹中指定类型文件到另一个文件夹。

## 使用方式

### 提取文件

控制台执行指令：`extract -s [sourcePath] -d [destPath] -r [rules] -m [mode]`即可。

#### 参数配置

具体参数配置如下：

| 参数/简写     | 值     | 备注     |
| ---------- | :-----------:  | :-----------: |
| --src|-s     | String    | 源文件夹路径，默认为指令执行的目录     |
| --dest|-d     | String    | 目标文件夹路径     |
| --rules|-r     | String    | 需要过滤的文件类型，多个用','连接：js,ts,css     |
| --mode|-m     | String    | 过滤方式：filter/ignore，分别表示过滤和排除rules中的文件，默认filter     |
