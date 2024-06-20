from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai
import os

# Set your OpenAI API key here
openai.api_key = os.getenv('OPENAI_API_KEY')

# Define conversation history
conversation_history = []

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        user_input = request.POST.get('message')

        if user_input.lower() in ['exit', 'quit']:
            response = "Thank you for using the EduTech Assistant! Have a nice day!"
        else:
            try:
                conversation_history.append({"role": "user", "content": user_input})
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=conversation_history
                )
                assistant_response = response['choices'][0]['message']['content'].strip()
                conversation_history.append({"role": "assistant", "content": assistant_response})
                # Prepare JSON response with the assistant's answer
                return JsonResponse({"message": assistant_response})
            except Exception as e:
                response = str(e)
                return JsonResponse({"error": response})

    else:
        return JsonResponse({"error": "Only POST requests are allowed."})
