from deep_translator import GoogleTranslator

def getTranslateText(text: str, dest: str) -> str:
    try:
        return GoogleTranslator(source='auto', target=dest).translate(text)
    except Exception as e:
        return f"Translation error: {str(e)}"
