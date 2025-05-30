请帮我开发一个"图片压缩"网站，这个网站的功能是：
1，用户带卡后可以上传PNG，JPG等格式的图片，然后按需要的比例进行压缩，减少图片文件的大小。
2，上传的图片和压缩的图片都应该在网页上可以预览查看，帮助用户判断上传的图片是否准确，压缩后的效果是否满足预期。
3，你需要展示压缩前和压缩后的文件大小。
4，允许用户下载压缩后的图片。
5，支持批量上传，并且可以展示上传的图片数量。也支持批量选中下载的方式。

你是一个非常出色的工程师和设计师，请帮助完成功能设计的基础上，帮我实现出色的有苹果风格的视觉设计。

2025/05/30 追加
@codebase 保持网站功能不变，在网站主页右下角创建一个聊天框，可以用来打字发送消息和ai进行交互，AI大模型的api请求示例如下：

API key:
sk-bdc3bb52ed51XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

代码请求调用示例：
# Please install OpenAI SDK first: `pip3 install openai`

from openai import OpenAI

client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"},
    ],
    stream=False
)

print(response.choices[0].message.content)