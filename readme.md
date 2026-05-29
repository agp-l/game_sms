# GameSMS Engine

GameSMS Engine je lehký, webový herní engine zaměřený na simulaci mobilní komunikace. Tento projekt umožňuje vytvářet interaktivní detektivní thrillery a příběhové hry založené na SMS konverzacích, větveném ději a dynamických změnách prostředí.

## Klíčové vlastnosti
* **Simulace telefonu:** Plnohodnotné rozhraní messengeru přímo v prohlížeči.
* **Větvený příběh:** Systém scén a rozhodnutí, který umožňuje komplexní vyprávění.
* **Modulární design:** Engine je oddělen od samotného obsahu příběhu – snadno vytvoříte novou kapitolu pouhým vytvořením nového `.js` souboru.
* **Multimediální podpora:** Dynamické přepínání obrázkového a videopozadí v závislosti na kapitole.
* **Responzivní design:** Hra se přizpůsobí mobilním zařízením i desktopovým monitorům (s podporou pohybu ruky v dlani na PC).
* **Custom Editor:** Součástí je vizuální editor pro snadnou tvorbu příběhových uzlů.

## Struktura projektu
* `index.html` / `room1.html`: Hlavní herní rozhraní.
* `script.js`: Srdce enginu, které řídí logiku zpráv, animace a přechody.
* `style.css`: Stylování celého prostředí a mobilního simulátoru.
* `editor.html`: Vizuální nástroj pro tvorbu a propojování scén.
* `story_files/`: (Složka pro vaše příběhové skripty - *není součástí repozitáře*)

## Jak začít
1. Naklonujte si repozitář.
2. Ujistěte se, že máte připraveny soubory s příběhem (např. `story1.js`), které dodržují očekávanou strukturu `window.storyData`.
3. Spusťte `room1.html` v libovolném moderním webovém prohlížeči.

