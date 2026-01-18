import requests
import json
import os
from typing import List, Dict, Optional
from config import LLM_PROVIDER, LLM_DEFAULT_MODEL, LLM_API_URL, LLM_API_KEY

# =========================
# ENHANCED LLM CONFIG
# =========================

# LLM provider configuration (driven by environment via `config.py`)
# Defaults: provider=huggingface, model=gpt-5-mini
PRIMARY_MODEL = LLM_DEFAULT_MODEL
FALLBACK_MODEL = None

def _get_provider_headers():
    if LLM_PROVIDER == 'openai':
        return {
            'Authorization': f'Bearer {LLM_API_KEY}',
            'Content-Type': 'application/json'
        }
    # Default to HuggingFace style headers
    return {
        'Authorization': f'Bearer {LLM_API_KEY}' if LLM_API_KEY else '',
        'Content-Type': 'application/json'
    }

def _get_provider_url(model_name: str):
    if LLM_API_URL:
        return LLM_API_URL
    if LLM_PROVIDER == 'openai':
        return 'https://api.openai.com/v1/chat/completions'
    # huggingface inference endpoint
    return f'https://api-inference.huggingface.co/models/{model_name}'

# Conversation memory
conversation_history: Dict[str, List[Dict[str, str]]] = {}

# =========================
# ENHANCED CONTEXT
# =========================

GOVCONNECT_CONTEXT = """
You are GovConnect Assistant, an AI-powered helper for India's National Digital Public Services Platform.

SERVICES AVAILABLE:
1. HEALTHCARE SERVICES:
   - Book doctor appointments at government hospitals
   - Access public health information and advisories
   - Register new hospitals (admin only)
   - View healthcare statistics and KPIs

2. AGRICULTURE SERVICES:
   - Farmer registration and management
   - Crop monitoring and yield prediction
   - Weather forecasts and pest alerts
   - Irrigation scheduling and water management
   - Agricultural subsidies and scheme information

3. URBAN SERVICES:
   - Report civic issues (roads, water, electricity)
   - Track complaint status and resolution
   - Access municipal services and information
   - View infrastructure health metrics

4. SYSTEM FEATURES:
   - Real-time alerts and notifications
   - Dynamic database management for admins
   - User role management (Super Admin, Healthcare Admin, Agriculture Admin)
   - API health monitoring and system status

RESPONSE GUIDELINES:
- Be helpful, professional, and concise
- Provide specific guidance on how to access services
- Direct users to appropriate sections of the platform
- Do not give medical diagnoses or legal advice
- Encourage use of official government services
- If unsure, ask for clarification
- Keep responses under 150 words
"""

# =========================
# ENHANCED CHATBOT FUNCTION
# =========================

def get_chatbot_response(user_message: str, user_id: str = "default") -> str:
    """Get enhanced AI-powered response with conversation memory"""
    try:
        # Initialize conversation history if needed
        if user_id not in conversation_history:
            conversation_history[user_id] = []

        # Add user message to history
        conversation_history[user_id].append({"role": "user", "content": user_message})

        # Keep only last 10 messages for context
        if len(conversation_history[user_id]) > 10:
            conversation_history[user_id] = conversation_history[user_id][-10:]

        # Try primary model first
        response = _call_llm_api(user_message, user_id, "primary")

        if response:
            # Add bot response to history
            conversation_history[user_id].append({"role": "assistant", "content": response})
            return response

        # Try fallback model
        response = _call_llm_api(user_message, user_id, "fallback")

        if response:
            conversation_history[user_id].append({"role": "assistant", "content": response})
            return response

        # If both models fail, use enhanced rule-based response
        return get_enhanced_rule_response(user_message, user_id)

    except Exception as e:
        print(f"Error in enhanced LLM: {e}")
        return get_enhanced_rule_response(user_message, user_id)

def _call_llm_api(user_message: str, user_id: str, model_type: str) -> Optional[str]:
    """Call LLM API with enhanced context"""
    try:
        # Build conversation context
        context_messages = conversation_history[user_id][-5:] if user_id in conversation_history else []

        # Create enhanced prompt text for providers that expect a single string
        system_prompt = f"{GOVCONNECT_CONTEXT}\n\nConversation History:\n"
        for msg in context_messages:
            role = "User" if msg["role"] == "user" else "Assistant"
            system_prompt += f"{role}: {msg['content']}\n"

        # Decide provider and call accordingly
        headers = _get_provider_headers()
        model_name = PRIMARY_MODEL
        provider_url = _get_provider_url(model_name)

        if LLM_PROVIDER == 'openai':
            # OpenAI Chat Completions style
            messages = [
                {"role": "system", "content": GOVCONNECT_CONTEXT}
            ]
            # append recent conversation messages
            for msg in context_messages:
                role = 'user' if msg['role'] == 'user' else 'assistant'
                messages.append({"role": role, "content": msg['content']})
            messages.append({"role": "user", "content": user_message})

            payload = {
                "model": model_name,
                "messages": messages,
                "max_tokens": 250,
                "temperature": 0.7
            }

            response = requests.post(provider_url, headers=headers, json=payload, timeout=20)
            response.raise_for_status()
            result = response.json()
            choice = result.get('choices', [{}])[0]
            content = choice.get('message', {}).get('content') if isinstance(choice, dict) else None
            if content and len(content) > 5:
                return content.strip()

        else:
            # Default: HuggingFace Inference style (single prompt string)
            full_prompt = f"{system_prompt}\nUser: {user_message}\nAssistant:"
            payload = {
                "inputs": full_prompt,
                "parameters": {
                    "max_length": 200,
                    "min_length": 20,
                    "do_sample": True,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "repetition_penalty": 1.2,
                    "num_return_sequences": 1
                }
            }

            response = requests.post(provider_url, headers=headers, json=payload, timeout=20)
            response.raise_for_status()

            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                generated_text = result[0].get("generated_text", "")
                if "Assistant:" in generated_text:
                    response_text = generated_text.split("Assistant:")[-1].strip()
                    response_text = response_text.split("\nUser:")[0].strip()
                    if response_text and len(response_text) > 10:
                        return response_text

        return None

    except Exception as e:
        print(f"Error calling {model_type} model: {e}")
        return None

def get_enhanced_rule_response(user_message: str, user_id: str = "default") -> str:
    """Enhanced rule-based responses with context awareness"""
    user_msg = user_message.lower()

    # Healthcare queries
    if any(word in user_msg for word in ["healthcare", "doctor", "appointment", "medical", "hospital", "health"]):
        if "appointment" in user_msg:
            return "To book a doctor appointment, go to the Healthcare section and click 'Book Appointment'. Select your preferred hospital, doctor, and time slot. You'll receive a confirmation once booked."
        elif "hospital" in user_msg:
            return "You can find registered hospitals in the Healthcare section. Super admins and healthcare admins can register new hospitals. Use the search feature to find hospitals by location or specialty."
        else:
            return "For healthcare services, visit the Healthcare page to book appointments, access health information, or register hospitals. I can help guide you through the process!"

    # Agriculture queries
    elif any(word in user_msg for word in ["agriculture", "farm", "farmer", "crop", "irrigation", "weather"]):
        if "register" in user_msg or "farmer" in user_msg:
            return "To register as a farmer, go to the Agriculture section and fill out the farmer registration form with your details, farm location, and crop information."
        elif "weather" in user_msg or "forecast" in user_msg:
            return "Weather forecasts are available in the Agriculture section. Check the weather widget for current conditions, forecasts, and pest risk alerts for your crops."
        elif "crop" in user_msg:
            return "Crop monitoring and yield prediction tools are available in the Agriculture dashboard. Register your farm first to access personalized crop analytics."
        else:
            return "The Agriculture section offers farmer registration, weather forecasts, crop monitoring, and irrigation management. How can I help you with agricultural services?"

    # Urban services queries
    elif any(word in user_msg for word in ["urban", "civic", "complaint", "roads", "water", "electricity", "infrastructure"]):
        if "complaint" in user_msg or "report" in user_msg:
            return "To report civic issues, use the Urban Services section. Submit complaints about roads, water, electricity, or other infrastructure problems. Track your complaint status in real-time."
        else:
            return "Urban services include complaint reporting and infrastructure monitoring. Visit the Urban Services page to report issues or check system status."

    # Admin queries
    elif any(word in user_msg for word in ["admin", "manage", "create", "delete", "update"]):
        if "alert" in user_msg:
            return "Super admins can create and manage system alerts in the Alerts section. Use alerts to notify users about important updates, maintenance, or emergency information."
        elif "hospital" in user_msg:
            return "Healthcare admins can register new hospitals through the Healthcare section. Provide hospital details, location, specialties, and contact information."
        else:
            return "Admin features include user management, hospital registration, alert creation, and dynamic database management. Login with appropriate admin credentials to access these features."

    # System queries
    elif any(word in user_msg for word in ["status", "health", "monitor", "api"]):
        return "System health and API status can be monitored in the System Health page. Check real-time metrics, database connectivity, and service availability."

    # General assistance
    elif any(word in user_msg for word in ["help", "how", "what", "guide"]):
        return "I can help you with healthcare appointments, agriculture services, urban complaints, and system navigation. Try asking about 'book appointment', 'farmer registration', or 'report complaint' for specific guidance."

    # Greeting responses
    elif any(word in user_msg for word in ["hello", "hi", "hey", "good"]):
        return "Hello! I'm GovConnect Assistant, here to help you with government services. I can assist with healthcare, agriculture, and urban services. What would you like to know?"

    # Default response
    else:
        return "I'm here to help with GovConnect services including healthcare, agriculture, and urban services. Could you please specify what you need assistance with? For example, 'book appointment', 'farmer registration', or 'report complaint'."


