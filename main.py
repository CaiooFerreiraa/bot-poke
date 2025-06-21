import pyautogui
import pyscreenshot as imageGrab
from PIL import Image
import time
import pytesseract

name1 = "awailcharmander"
name2 = "wildcharmander"

# Caminho do Tesseract OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

cond = True

def captura():
    # Tirar nova screenshot
    screenshot = imageGrab.grab()
    screenshot.save("test.jpeg", "JPEG")

    img = Image.open("test.jpeg")
    crop_area = (600, 500, 1100, 750)
    cropped_image = img.crop(crop_area)

    text = pytesseract.image_to_string(cropped_image)

    while True:
        pyautogui.press('3')
        print(f"[Captura] Texto encontrado: {text.strip()}")
        if "False Swipe" in text:
            print("[Captura] Capturando...")
            pyautogui.press('1')
        else:
            print("[Captura] A captura terminou.")
            break

        # Espera e captura novamente
        time.sleep(2)
        screenshot = imageGrab.grab()
        screenshot.save("test.jpeg", "JPEG")
        img = Image.open("test.jpeg")
        cropped_image = img.crop(crop_area)
        text = pytesseract.image_to_string(cropped_image)

def usarFalseSwipe():
    time.sleep(2)
    pyautogui.press('1')

    screenshot = imageGrab.grab()
    screenshot.save("test.jpeg", "JPEG")
    img = Image.open("test.jpeg")
    crop_area = (600, 500, 1100, 750)
    cropped_image = img.crop(crop_area)

    text = pytesseract.image_to_string(cropped_image)
    print(f"[usarFalseSwipe] Texto: {text.strip()}")

    if "with False Swipe." in text:
        print("[usarFalseSwipe] False Swipe detectado, chamando captura()...")
        pyautogui.press('3')
        captura()
    else:
        print("[usarFalseSwipe] False Swipe não encontrado.")

time.sleep(5)

while cond:
    screenshot = imageGrab.grab()
    screenshot.save("test.jpeg", "JPEG")
    img = Image.open("test.jpeg")
    crop_area = (600, 500, 1100, 750)
    cropped_image = img.crop(crop_area)
    text = pytesseract.image_to_string(cropped_image)
    print(f"[Main Loop] Texto: {text.strip()}")

    # Normaliza texto para comparação (tudo minúsculo, remove espaços)
    normalized_text = text.lower().replace(" ", "")

    if name1 in normalized_text or name2 in normalized_text:
        print("[Main Loop] Charmander detectado!")
        pyautogui.press('1')
        usarFalseSwipe()
    else:
        print("[Main Loop] Charmander não encontrado...")
        pyautogui.press('4')
