# 图片压缩工具（ImageCompressionTools02）

## 项目简介
本项目是一个基于HTML5、CSS3和JavaScript开发的苹果风格网页图片压缩工具，支持多种图片格式的上传、预览、压缩、下载，并集成了AI聊天助手，方便用户随时提问和获取帮助。

---

## 主要功能
1. **图片上传**：支持PNG、JPG、WebP等格式，拖拽或点击上传，支持批量操作。
2. **图片预览**：上传后可直接预览原图和压缩后图片，方便对比效果。
3. **压缩参数调整**：可自定义压缩质量、最大宽度、输出格式（保持原格式/JPEG/PNG/WebP）。
4. **压缩前后对比**：显示原图和压缩后图片的尺寸、大小、压缩比。
5. **批量处理**：支持多图批量压缩和批量下载。
6. **下载功能**：一键下载压缩后的图片，支持批量下载。
7. **苹果风格UI**：简洁、圆角、磨砂、阴影，响应式设计，适配PC和移动端。
8. **AI聊天助手**：主页右下角集成AI聊天框，可随时提问、获取帮助或与AI互动。

---

## 页面结构说明
- **头部（Header）**：网站标题与简要介绍。
- **上传区域**：拖拽或点击上传图片，显示上传数量。
- **控制面板**：压缩质量滑块、最大宽度输入、输出格式选择、批量操作按钮。
- **图片预览区**：原图与压缩后图片对比，显示详细信息。
- **图片列表**：批量上传时显示所有图片，支持选择、删除、单独压缩和下载。
- **AI聊天框**：右下角悬浮，支持输入消息与AI对话。
- **页脚（Footer）**：版权信息。

---

## AI聊天助手说明
- 聊天框位于主页右下角，点击即可输入消息。
- 支持与AI大模型实时对话，获取图片压缩、网页使用等相关帮助。
- **使用前请在 `js/app.js` 文件中填写您自己的 DeepSeek API Key，切勿使用默认key。**
- 前端直接调用DeepSeek API（仅供学习测试，生产环境请保护API密钥）。

---

## 技术实现
- **前端**：HTML5 + CSS3 + 原生JavaScript
- **图片处理**：Canvas API
- **AI对话**：DeepSeek API（fetch方式调用）
- **响应式设计**：Flexbox/Grid布局，适配多终端

---

## 使用方法
1. 打开网页。
2. 上传图片（拖拽或点击上传按钮）。
3. 调整压缩参数（质量、宽度、格式）。
4. 预览压缩效果，查看压缩比。
5. 单张或批量下载压缩后图片。
6. 如有疑问，可在右下角AI聊天框输入问题并获取帮助。

---

## 浏览器兼容性
- Chrome
- Firefox
- Safari
- Edge

---

## 版权声明
- 本项目仅供学习与交流，禁止用于商业用途。
- UI风格参考苹果设计，版权归原公司所有。 