window.storyData = {
    "contacts": {
        "manzelka": {
            "name": "Helena (Exmanželka)",
            "color": "#ff4757"
        },
        "policie": {
            "name": "por. Navrátil (Policie)",
            "color": "#2eaf7d"
        }
    },
    "scenes": {
        "scena_policie_chata": {
            "contactId": "policie",
            "editor": {
                "x": 2718.999999999999,
                "y": 2395.9999999999986
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Vaše chata? Proč by ho posílal na vaši chatu? To nedává smysl."
                },
                {
                    "type": "player",
                    "text": "Dává! Eliáš tam se mnou byl v létě. Ví, kde je klíč pod kamenem. A ten učitel... ten kluk mu o té chatě musel vyprávět na kroužku!"
                },
                {
                    "type": "npc",
                    "text": "Sakra. Černá skála je nahoře na hřebeni, že? Tam se teď nedostaneme ani s technikou. Silnice zapadly během půl hodiny. Jediný, kdo je blízko... jste vy na té observatoři."
                }
            ],
            "choices": [
                {
                    "text": "Já? Vždyť venku je vichřice, nemám pořádné vybavení na noční přechod a vánici!",
                    "next": "scena_policie_vymluva"
                },
                {
                    "text": "Je to ode mě necelé tři kilometry po hřebeni. Vyrazím tam. Hned.",
                    "next": "scena_policie_hrdina"
                }
            ]
        },
        "scena_policie_panika": {
            "contactId": "policie",
            "editor": {
                "x": 1932,
                "y": 3035.9999999999986
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Pane Lízale, uklidněte se. Nemůžeme nikoho mučit. Zkoušíme to psychologicky."
                },
                {
                    "type": "npc",
                    "text": "Mezitím nám technik potvrdil, že učitel měl v navigaci staženou offline mapu hřebenové oblasti kolem Černé skály. Nejsou tam náhodou nějaké turistické přístřešky?"
                }
            ],
            "choices": [
                {
                    "text": "U Černé skály je moje stará lovecká chata! Eliáš to tam zná! Musí být tam!",
                    "next": "scena_policie_chata"
                }
            ]
        },
        "scena_policie_vymluva": {
            "contactId": "policie",
            "editor": {
                "x": 3974.285714285713,
                "y": 1462.142857142856
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Chápu. Bylo by to extrémní riziko i pro vás. Zůstaňte na místě. Jakmile se vánice uklidní – odhadem zítra kolem poledne – vyšleme horskou službu a sněžné skútry."
                },
                {
                    "type": "system",
                    "text": "Zítra v poledne... To už chlapce najdou jen jako ledovou sochu. Teploměr na vaší stanici právě ukazuje -11 °C."
                }
            ],
            "choices": [
                {
                    "text": "(Zbabral jsi to. Zkusit napsat Heleně a říct jí krutou pravdu)",
                    "next": "scena_helena_konfrontace"
                }
            ]
        },
        "scena_policie_hrdina": {
            "contactId": "policie",
            "editor": {
                "x": 4054.285714285713,
                "y": 2165.7142857142844
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "To nemůžete myslet vážně. V tomhle počasí je to sebevražda. Jako policie vám to nemůžu schválit ani nařídit."
                },
                {
                    "type": "npc",
                    "text": "Pokud ale opravdu půjdete, nechte zapnutý telefon, budeme se vás snažit lokalizovat přes BTS vysílač, dokud vám neumrzne baterka. Bůh s vámi."
                }
            ],
            "choices": [
                {
                    "text": "(Zabalit batoh, vzít čelovku a napsat Heleně, než opustíš stanici)",
                    "next": "scena_helena_konfrontace"
                }
            ]
        },
        "scena_helena_konfrontace": {
            "contactId": "manzelka",
            "editor": {
                "x": 4543.857142857141,
                "y": 1427.714285714285
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Policie mi řekla, že Eliáš je možná v té naší staré chatě na hřebeni! Panebože, Petře, ty jsi tam nahoře! Udělej něco!"
                },
                {
                    "type": "npc",
                    "text": "Proč jsi tam toho úchyla vůbec kdy pouštěl?! Jo aha, ty jsi ho tam nepouštěl, tvůj vlastní syn mu o tom místě řekl, protože k němu měl větší důvěru než k vlastním rodičům!"
                },
                {
                    "type": "npc",
                    "text": "Jestli tam Eliáš umrzne, je to tvoje vina. Ty jsi nás opustil kvůli těm podělanejm meteorologickejm grafům!"
                }
            ],
            "choices": [
                {
                    "text": "Uklidni se, ty hysterko! Ty jsi ho mlátila kvůli známkám, zdrhnul před tebou, ne přede mnou!",
                    "next": "scena_helena_hadka"
                },
                {
                    "text": "Heleno... Právě si oblékám bundu a jdu ven do té bouře ho hledat. Možná se už neozvu. Promiň mi všechno.",
                    "next": "scena_helena_obet"
                }
            ]
        },
        "scena_helena_hadka": {
            "contactId": "manzelka",
            "editor": {
                "x": 5068.857142857141,
                "y": 1202.7142857142849
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Já ho nemlátila! Jen dostal občas facku, když byl drzej! Ty o tom víš hovno, ty si tam jen sedíš a čumíš do monitoru!"
                },
                {
                    "type": "npc",
                    "text": "Ty nikam nejdeš, co? Ty jsi posranej až za ušima. Necháš vlastního syna chcípnout v mrazu."
                },
                {
                    "type": "system",
                    "text": "Paranoia pracuje. Uvědomujete si, že ten pedofilní učitel možná chlapce záměrně poštval proti vám oběma, aby vás zničil."
                }
            ],
            "choices": [
                {
                    "text": "(Přepnout zpět na policii a zjistit, jestli učitel nezačal mluvit)",
                    "next": "scena_policie_vysluch_2"
                }
            ]
        },
        "scena_helena_obet": {
            "contactId": "manzelka",
            "editor": {
                "x": 4894.5714285714275,
                "y": 2740.5714285714275
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Petře? Ty... ty jdeš vážně ven? V tomhle?"
                },
                {
                    "type": "npc",
                    "text": "Panebože, já... já to tak nemyslela. Nechtěla jsem říct, že za to můžeš ty. Já mám jen strašný strach."
                },
                {
                    "type": "npc",
                    "text": "Vraťte se mi oba. Prosím. Slibuju, že doma všechno změním. Už žádný křik, žádný tlak."
                }
            ],
            "choices": [
                {
                    "text": "(Vypnout chat s Helenou a naposledy zkontrolovat policii)",
                    "next": "scena_policie_vysluch_2"
                }
            ]
        },
        "scena_policie_vysluch_2": {
            "contactId": "policie",
            "editor": {
                "x": 5898.857142857141,
                "y": 2097.7142857142844
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Naliehavá zpráva od kriminální policie."
                },
                {
                    "type": "npc",
                    "text": "Pane Lízale, zlomili jsme ho. Ale to, co řekl, nedává smysl. Tvrdí, že chlapci nedal souřadnice vaší chaty."
                },
                {
                    "type": "npc",
                    "text": "Prý mu dal peníze na autobus do Brna k nějaké krizové lince, ale chlapec v panice ztratil peněženku a začal bláznit, že uteče do hor umřít, aby byl od vás všech pokoj."
                },
                {
                    "type": "npc",
                    "text": "Učitel u výslechu doslova pláče a říká: 'Já ho chtěl zachránit, ale on utekl směr Černá skála sám, protože tam chtěl ukončit svůj život! Bál se, že ho pošlete do ústavu!'"
                }
            ],
            "choices": [
                {
                    "text": "On lže! Chce jen zachránit sebe! Jdu pro něj!",
                    "next": "scena_konec_kapitoly_2"
                },
                {
                    "text": "Ukončit svůj život?! Devítiletý kluk?! Bože... co jsme to provedli...",
                    "next": "scena_konec_kapitoly_2"
                }
            ]
        },
        "scena_konec_kapitoly_2": {
            "contactId": "policie",
            "editor": {
                "x": 6658.85714285714,
                "y": 1987.7142857142846
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Baterie telefonu: 14 %. Teplota vzduchu: -12 °C. Vítr: 90 km/h."
                },
                {
                    "type": "system",
                    "text": "Otevíráte těžké dveře meteorologické stanice. Do tváře vás zasáhne ledový krunýř sněhu. Před vámi je jen absolutní černo a řvoucí vánice."
                },
                {
                    "type": "system",
                    "text": "KONEC KAPITOLY 2. V Kapitole 3: Přechod hřebene, boj o přežití a finální konfrontace v chatě u Černé skály."
                }
            ],
            "choices": [
                {
                    "text": "⏭️ Načíst Kapitolu 3: Černá skála",
                    "changeChapter": {
                        "script": "story3.js",
                        "bg": "bg1.jpg"
                    }
                }
            ]
        },
        "scena_2": {
            "contactId": "policie",
            "editor": {
                "x": 1125.9999999999995,
                "y": 1626.999999999999
            },
            "messages": [
                {
                    "type": "system",
                    "text": "KAPITOLA 2: HLEDÁNÍ VE VÁNICI. Pozadí změněno na: bg_boure.jpg"
                },
                {
                    "type": "npc",
                    "text": "Pane Lízale? Jste tam? Naše prvoliniové hlídky musely kvůli sněhové vánici přerušit venkovní pátrání v údolí. Viditelnost je nula."
                },
                {
                    "type": "npc",
                    "text": "Prověřili jsme dvě chaty napsané na příbuzné zadrženého učitele. Obě are prázdné a zamčené. Ten chlap u výslechu jen sedí, usmívá se a tvrdí, že Eliášovi už teď nikdo neublíží."
                }
            ],
            "choices": [
                {
                    "text": "Pane poručíku, mně to došlo. On ho neposlal do svých objektů. Poslal ho do MOJÍ staré chaty u Černé skály!",
                    "next": "scena_policie_chata"
                },
                {
                    "text": "Usmívá se?! Vy z něj tu informaci nedokážete dostat?! Vždyť tam venku je peklo, ten kluk zmrzne!",
                    "next": "scena_policie_panika"
                }
            ]
        }
    }
};