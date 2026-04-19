from google import genai

client = genai.Client(api_key="AIzaSyD1LGdsf8KCrLxOCvoCAW5VkXS01i68wm0")

models = client.models.list()
for m in models:
    print(m.name)