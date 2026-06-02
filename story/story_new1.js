window.storyData = {
    "contacts": {
        "manzelka": {
            "name": "Helena (Exmanželka)",
            "color": "#ff4757"
        },
        "policie": {
            "name": "por. Navrátil (Policie)",
            "color": "#2eaf7d"
        },
        "pedofil": {
            "name": "p. Lízal (Kroužek)",
            "color": "#ffa502"
        }
    },
    "scenes": {
        "scena_klid": {
            "contactId": "manzelka",
            "editor": {
                "x": 684.8174603174605,
                "y": 1900.805555555556
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Myslíš že mě to nenapadlo? Vždyť ho má vypnutý! Zkouším to  každých pět minut!"
                },
                {
                    "type": "npc",
                    "text": "Ty si tam na té své observatoři v klidu pozoruješ hvězdy, zatímco tvůj syn možná leží někde v příkopu!"
                }
            ],
            "choices": [
                {
                    "text": "Nesleduji hvězdy!  Zrovna analyzuji sluneční erupce, které naznačují nezvykle nebezpečně zvýšenou aktivitu slunce.",
                    "next": "scena_787"
                },
                {
                    "text": "Jo, chápu tvoje naštvání, měl bych být doma, a více se věnovat Eliáškovy. Toulá se teď někde sám. ",
                    "next": "scena_904"
                }
            ]
        },
        "scena_manzelka_ceka": {
            "contactId": "manzelka",
            "editor": {
                "x": 4086.5,
                "y": 1956.75
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Helena je offline. Čeká se na výsledek pátrání."
                }
            ],
            "choices": [
                {
                    "text": "(Ukončit chat s policií a vyhledat kontakt na učitele)",
                    "next": "scena_265"
                }
            ]
        },
        "scena_panika_policie": {
            "contactId": "manzelka",
            "editor": {
                "x": 1327.0555555555559,
                "y": 2714.972222222222
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Máš pravdu... Panebože, mně se tak klepou ruce. Volám linku 158."
                },
                {
                    "type": "npc",
                    "text": "Řeknu jim tvoje telefonní číslo."
                },
                {
                    "type": "npc",
                    "text": "Dám ti pak vědět..."
                }
            ],
            "choices": [
                {
                    "text": "Dobře, budu čekat",
                    "next": "scena_prichod_policie"
                }
            ]
        },
        "scena_prichod_policie": {
            "contactId": "policie",
            "editor": {
                "x": 1742.2222222222224,
                "y": 2677.555555555555
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Nové číslo. Uživatelské jméno: poručík Navrátil (Policie)"
                },
                {
                    "type": "npc",
                    "text": "Dobrý večer, pane . Mluvili jsme s vaší bývalou manželkou ohledně pohřešovaného syna Eliáše."
                },
                {
                    "type": "npc",
                    "text": "Zahajujeme standardní pátrací úkony v okolí školy a bydliště. "
                },
                {
                    "type": "npc",
                    "text": "Zatím jen mapujeme poslední lidi, se kterými byl v kontaktu. "
                },
                {
                    "type": "npc",
                    "text": "Kam běžně chodí? Kroužky, hřiště, cokoli... "
                }
            ],
            "choices": [
                {
                    "text": "Chodí pouze na kroužek programování her, k panu Lízalovi, to je jeho učitel. ",
                    "next": "BACK_TO_CONTACTS"
                },
                {
                    "text": "Chodil hodně na hřiště, ale to jsme mu teď zakázali. Poslední dobou tam vždy zastavovala bílá dodávka. Ten chlápek tam třeba hodinu jen koukal. ",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_policie_vyslech_1": {
            "contactId": "policie",
            "editor": {
                "x": 2239,
                "y": 3008
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Díky, prověříme to. "
                },
                {
                    "type": "npc",
                    "text": "Zůstaňte na příjmu, pokud by se vám syn ozval sám. Zatím na shledanou."
                }
            ],
            "choices": [
                {
                    "text": "(Ukončit chat s policií a vyhledat kontakt na učitele)",
                    "next": "scena_kontakt_ucitel"
                }
            ]
        },
        "scena_kontakt_ucitel": {
            "contactId": "pedofil",
            "editor": {
                "x": 2686,
                "y": 3651
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Zahájili jste chat s uživatelem: p. Lízal (Kroužek)"
                },
                {
                    "type": "player",
                    "text": "Dobrý večer, pane učiteli. Tady otec Eliáše. Chci se zeptat, neviděl jste dnes mého syna? Nepřišel domů."
                },
                {
                    "type": "npc",
                    "text": "Dobrý den, ano, vím o tom, už tady u mě byla policie."
                },
                {
                    "type": "npc",
                    "text": "Popravdě, bylo to nepříjemné. "
                }
            ],
            "choices": [
                {
                    "text": "Vy k němu máte celkem blízko, že?",
                    "next": "scena_ucitel_paranoia_1"
                },
                {
                    "text": "Proč za vámi chodil mimo kroužek? Policie říkal, že se chováte podezřele. Co jste mu udělal?!",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_ucitel_utok": {
            "contactId": "pedofil",
            "editor": {
                "x": 6685,
                "y": 4212
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Uklidněte se, prosím. Chápu, že máte strach, jste otec. Ale tenhle agresivní tón ničemu nepomůže."
                },
                {
                    "type": "npc",
                    "text": "Nic jsem mu neudělal. Naopak, snažil jsem se mu pomoct, když vidím, v jakém stresu ten kluk žije. Vy o něm vlastně nic nevíte, když tam nahoře jen měříte rychlost větru."
                },
                {
                    "type": "npc",
                    "text": "Víc vám k tomu teď neřeknu, policie mi doporučila s vámi nekomunikovat, dokud se to nevyjasní."
                }
            ],
            "choices": [
                {
                    "text": "To si ze mě děláte srandu?! Nikam nechoďte, já si vás najdu!",
                    "next": "scena_ucitel_odmlčení"
                }
            ]
        },
        "scena_ucitel_odmlčení": {
            "contactId": "pedofil",
            "editor": {
                "x": 7759,
                "y": 4262
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Uživatel p. Lízal (Kroužek) neodpovídá. Status: Offline."
                }
            ],
            "choices": [
                {
                    "text": "(Zkusit znovu zkontrolovat zprávy od Heleny)",
                    "next": "scena_manzelka_hysterka"
                }
            ]
        },
        "scena_manzelka_hysterka": {
            "contactId": "manzelka",
            "editor": {
                "x": 8272,
                "y": 2589
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Tak u Davida není."
                },
                {
                    "type": "npc",
                    "text": "Volala mi kriminálka! Prý jedou zatknout učitele, co vede "
                },
                {
                    "type": "npc",
                    "text": "Ty jsi s ním mluvil?! Řekni mi, že mu nic neudělal. Já se zblázním, já v téhle zimě venku umřu."
                }
            ],
            "choices": [
                {
                    "text": "Psal jsem mu. Tvrdil, že Eliáš odešel smutný kvůli tomu, jak na něj křičíš. Co jsi mu provedla, Heleno?",
                    "next": "scena_manzelka_vymluva"
                },
                {
                    "text": "Klim. Policie už ho má. Jestli mu zkřivil jediný vlas, tak z těch hor slezu a vlastnoručně ho zabiju.",
                    "next": "scena_manzelka_utěcha"
                }
            ]
        },
        "scena_manzelka_vymluva": {
            "contactId": "manzelka",
            "editor": {
                "x": 8931,
                "y": 2221
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Já?! Ty mě teď budeš obviňovat?! Chlapec nosil domů pětky a lhal mi do očí! Samozřejmě, že jsem na něj zakřičela! Kdo by nezakřičel?!"
                },
                {
                    "type": "npc",
                    "text": "Ty si tam nahoře žiješ jako poustevník, žereš instantní polévky a hraječe si na hrdinu z hor, ale zodpovědnost nemáš žádnou!"
                },
                {
                    "type": "npc",
                    "text": "Ten úchyl ho zmanipuloval. Určitě mu napovídal nějaké blbosti. Policie ho prý právě veze na stanici. Piš raději jim, mně je zle."
                }
            ],
            "choices": [
                {
                    "text": "(Otevřít chat s poručíkem Navrátilem a zjistit stav zatčení)",
                    "next": "scena_policie_zatceni"
                }
            ]
        },
        "scena_manzelka_utěcha": {
            "contactId": "manzelka",
            "editor": {
                "x": 8589,
                "y": 3329
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Děkuju... aspoň v tomhle stojíš při mně. Slez z těch hor, prosím tě. Potřebuju tě tady. Policie prohledává jeho byt, doufám, že tam Eliášek není zamčený..."
                },
                {
                    "type": "npc",
                    "text": "Poručík Navrátil říkal, že ten chlap se ani nebránil. Prý jen seděl a pil čaj. Je to zrůda. Zeptej se policie, co zjistili."
                }
            ],
            "choices": [
                {
                    "text": "(Přepnout na policii a vyžádat si informace z výslechu)",
                    "next": "scena_policie_zatceni"
                }
            ]
        },
        "scena_policie_zatceni": {
            "contactId": "policie",
            "editor": {
                "x": 9429,
                "y": 2942
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Aktualizace stavu: por. Navrátil je online."
                },
                {
                    "type": "npc",
                    "text": "Pane Lízale, před malou chvílí jsme zadrželi podezřelého pana Lízala (shoda jmen je opravdu čistě náhodná) v místě jeho bydliště."
                },
                {
                    "type": "npc",
                    "text": "Muž byl umístěn do cely předběžného zadržení. Při zběžné prohlídce jeho telefonu jsme našli šokující věc: otevřeně se v komunitních fórech hlásí k pedofilii. Tvrdí sice, že je 'neaktivní' a nikdy nic neudělal, ale pro nás je to momentálně hlavní verze."
                },
                {
                    "type": "npc",
                    "text": "Chlapec u něj prokazatelně byl. Našli jsme v jeho dílně Eliášův batoh s učením. Chlapce ale na místě neměl. Podezřelý odmítá říct, kde syn je, opakuje jen, že je 'v bezpečí před vámi'."
                }
            ],
            "choices": [
                {
                    "text": "Vymlátit to z něj! Ten chlap mi vzal syna, chápete to?! Udělejte s ním něco!",
                    "next": "scena_policie_slepá_ulička"
                },
                {
                    "text": "V bezpečí před námi? Co tím myslel? Našli jste v tom telefonu nějaké zprávy přímo s Eliášem?",
                    "next": "scena_policie_stopy"
                }
            ]
        },
        "scena_policie_slepá_ulička": {
            "contactId": "policie",
            "editor": {
                "x": 9881,
                "y": 2203
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Chápu vaše emoce, ale žijeme v právním státě. Naši lidé pracují na plné obrátky. Technik se teď pokouší prolomit šifrovanou komunikaci v jeho počítači."
                },
                {
                    "type": "npc",
                    "text": "Zároveň ale prověřujeme věc, kterou nám podezřelý řekl. Tvrdí, že Eliáš měl v telefonu aplikaci pro anonymní krizovou linku a že se bál návratu domů kvůli domácímu násilí ze strany matky. Musíme prověřit i toto."
                },
                {
                    "type": "system",
                    "text": "SLEPÁ ULIČKA: Hráč se soustředí na agresi vůči učiteli, zatímco reálné stopy chladnou."
                }
            ],
            "choices": [
                {
                    "text": "To jsou jenom jeho lži, kterými se snaží odvést pozornost! Hledejte mého syna!",
                    "next": "scena_konec_kapitoly_1"
                }
            ]
        },
        "scena_policie_stopy": {
            "contactId": "policie",
            "editor": {
                "x": 9999,
                "y": 3826
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Ano, analyzujeme historii chatu. Zdá se, že mu podezřelý učitel poslal mapu a souřadnice nějakého místa. Bohužel, zpráva byla smazána těsně před naším příchodem."
                },
                {
                    "type": "npc",
                    "text": "Učitel u výslechu tvrdí: 'Dal jsem mu peníze a poslal ho na bezpečné místo, kde ho nebudou bít. Útěk do divočiny jsem mu rozmluvil, tam by zmrzl. Je v chatě.' Odmítá ale specifikovat, o kterou chatu jde."
                },
                {
                    "type": "npc",
                    "text": "Kolegové teď projíždějí seznam všech objektů v okolí, které podezřelý vlastní nebo si pronajímá."
                }
            ],
            "choices": [
                {
                    "text": "V okolí jsou stovky chat... Panebože, venku začíná chumelit. Jestli je v nějaké neudržované chatě, zmrzne!",
                    "next": "scena_konec_kapitoly_1"
                }
            ]
        },
        "scena_konec_kapitoly_1": {
            "contactId": "policie",
            "editor": {
                "x": 10496,
                "y": 3311
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Noc pokročila. Teplota klesá na -8 °C. Na horách začíná sněhová bouře."
                },
                {
                    "type": "system",
                    "text": "Učitel sedí v cele a mlčí. Policie prohledává nesprávné objekty. Vy sedíte na stanici a uvědomujete si, že jedna z těch chat v horách patří VÁM..."
                }
            ],
            "choices": [
                {
                    "text": "⏭️ Pokračovat do Kapitoly 2: Hledání vánice",
                    "changeChapter": {
                        "script": "story2.js",
                        "bg": "bg1.jpg"
                    }
                }
            ]
        },
        "scena_265": {
            "contactId": "pedofil",
            "editor": {
                "x": 4998,
                "y": 2032
            },
            "messages": [
                {
                    "type": "system",
                    "text": "Zahájili jste chat s uživatelem: p. Lízal (Kroužek)"
                },
                {
                    "type": "npc",
                    "text": "Dobrý večer, pane učiteli. Tady otec Eliáše. Chci se zeptat, neviděl jste dnes mého syna? Nepřišel domů."
                },
                {
                    "type": "npc",
                    "text": "Ano, Eliášek byl dnes u mne na kroužku. "
                }
            ],
            "choices": [
                {
                    "text": "Vy k němu máte celkem blízko, že?",
                    "next": "scena_835"
                },
                {
                    "text": "A říkal něco kam půjde po kroužku?",
                    "next": "scena_915"
                }
            ]
        },
        "scena_835": {
            "contactId": "pedofil",
            "editor": {
                "x": 5540,
                "y": 2204
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Ano, je to můj oblíbený student. Je k sežrání. "
                }
            ],
            "choices": [
                {
                    "text": "Co? To vyznělo docela úchylně. ",
                    "next": "scena_504"
                },
                {
                    "text": "A nevíte kde by mohl být?",
                    "next": "scena_643"
                }
            ]
        },
        "scena_915": {
            "contactId": "pedofil",
            "editor": {
                "x": 5485,
                "y": 2992
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Říkal, ale kdyby to chtěl říci vám, tak by jste to věděl. "
                }
            ],
            "choices": [
                {
                    "text": "Prosím? Jsem jeho otec! Jestli mi to neřeknete, zavolám na vás policii. ",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_43": {
            "contactId": "pedofil",
            "editor": {
                "x": 6515,
                "y": 2862
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "No, lidem co se líbí malí chlapci, tak jsou považování hned za agresory a násilníky. "
                },
                {
                    "type": "npc",
                    "text": "Jsem pedofil. Nestydím se za to, protože jsem nikdy nic neuděl špatného, právě že naopak. "
                }
            ],
            "choices": [
                {
                    "text": "Děkuji za důvěru. Znáte tento vtip? \"Jaký je rozdíl mezi pedagogem a pedofilem? Pedofil má rád děti.\"",
                    "next": "scena_300"
                },
                {
                    "text": "Tak to máte pravdu, lidi jako vy se máte dětem vyhýbat obloukem. ",
                    "next": "scena_196"
                }
            ]
        },
        "scena_504": {
            "contactId": "pedofil",
            "editor": {
                "x": 6182,
                "y": 2043
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Mě zas přijde úchylný trestat děti za známky. "
                },
                {
                    "type": "npc",
                    "text": "Sbohem"
                }
            ],
            "choices": [
                {
                    "text": "Píše Helena, kouknout na její zprávu.",
                    "next": "scena_manzelka_hysterka"
                }
            ]
        },
        "scena_643": {
            "contactId": "pedofil",
            "editor": {
                "x": 6033,
                "y": 2842
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Víte, Eliáš je strašně chytrý kluk, ale citlivý. "
                },
                {
                    "type": "npc",
                    "text": "Popravdě, moc se mu dnes domů nechtělo. "
                },
                {
                    "type": "npc",
                    "text": "Chtěl abych s ním šel ven, ale lidé jako já si to nemohou dovolit."
                }
            ],
            "choices": [
                {
                    "text": "Jak to myslíte 'lidé jako vy'? ",
                    "next": "scena_43"
                }
            ]
        },
        "scena_196": {
            "contactId": "pedofil",
            "editor": {
                "x": 7166,
                "y": 3391
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "To říká ten pravý, co nechá doma mlátit dítě za známky. "
                },
                {
                    "type": "npc",
                    "text": "Sbohem"
                }
            ],
            "choices": [
                {
                    "text": "Nahlásit pedofila policii.",
                    "next": "scena_514"
                },
                {
                    "text": "Píše Helena, kouknout na její zprávu.",
                    "next": "scena_manzelka_hysterka"
                }
            ]
        },
        "scena_300": {
            "contactId": "pedofil",
            "editor": {
                "x": 7108,
                "y": 2704
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Víte jaký je rozdíl mezi učitelem a rodičem? Učitel děti za známky nemlátí."
                }
            ],
            "choices": [
                {
                    "text": "",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_514": {
            "contactId": "manzelka",
            "editor": {
                "x": 7589,
                "y": 3365
            },
            "messages": [],
            "choices": [
                {
                    "text": "",
                    "next": "scena_manzelka_hysterka"
                }
            ]
        },
        "helena_ztrata": {
            "contactId": "manzelka",
            "editor": {
                "x": 237.66666666666697,
                "y": 2282.333333333333
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Ahoj"
                },
                {
                    "type": "npc",
                    "text": "Eliášek se nevrátil domů ze školy. Mám strašný strach."
                },
                {
                    "type": "npc",
                    "text": "Co když se mu něco stalo!"
                }
            ],
            "choices": [
                {
                    "text": "Ahoj, vždyť ho znáš, jen se zapomněl venku s kamarády. Pošli mu smsku, že už je hodně hodin.",
                    "next": "scena_253"
                },
                {
                    "text": "Vyhledej jeho GPS polohu, může si za to sám. ",
                    "next": "scena_klid"
                },
                {
                    "text": "Napíši jeho kamarádům",
                    "next": "BACK_TO_CONTACTS"
                },
                {
                    "text": "Zavolám policii",
                    "next": "scena_629"
                },
                {
                    "text": "Zavolám na horskou službu, nejspíš se zase ztratil v lese",
                    "next": "BACK_TO_CONTACTS"
                },
                {
                    "text": "Zavolám do škole ",
                    "next": "BACK_TO_CONTACTS"
                },
                {
                    "text": "",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_629": {
            "contactId": "policie",
            "editor": {
                "x": 1513,
                "y": 4080.444444444445
            },
            "messages": [
                {
                    "type": "npc",
                    "text": ""
                }
            ],
            "choices": [
                {
                    "text": "",
                    "next": "BACK_TO_CONTACTS"
                }
            ]
        },
        "scena_253": {
            "contactId": "manzelka",
            "editor": {
                "x": 685.5555555555555,
                "y": 1218.8888888888907
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Ty si tam na té své observatoři v klidu pozoruješ hvězdy, zatímco tvůj syn možná leží někde v příkopu!"
                }
            ],
            "choices": [
                {
                    "text": "Nesleduji hvězdy!  Zrovna analyzuji sluneční erupce, které naznačují nezvykle nebezpečně zvýšenou aktivitu slunce.",
                    "next": "scena_787"
                },
                {
                    "text": "Jo, chápu tvoje naštvání, měl bych být doma, a více se věnovat Eliáškovy. Toulá se teď někde sám. ",
                    "next": "scena_904"
                }
            ]
        },
        "scena_787": {
            "contactId": "manzelka",
            "editor": {
                "x": 1174.4444444444448,
                "y": 919.9999999999998
            },
            "messages": [
                {
                    "type": "npc",
                    "text": "Běž do prdele! "
                },
                {
                    "type": "npc",
                    "text": "Vždycky jsi dal přednost práci nad rodinou."
                },
                {
                    "type": "npc",
                    "text": "A víš co?"
                },
                {
                    "type": "system",
                    "text": "Helena vás zablokovala. Již této osobě nemůžete psát zprávy. "
                }
            ],
            "choices": [
                {
                    "text": "",
                    "next": "BACK_TO_CONTACTS",
                    "unlocks": ""
                }
            ]
        },
        "scena_904": {
            "contactId": "manzelka",
            "editor": {
                "x": 1175.5555555555554,
                "y": 1984.4444444444443
            },
            "messages": [],
            "choices": []
        }
    },
    "startScene": "helena_ztrata"
};

// A SEM, NA ÚPLNÝ KONEC SOUBORU, PŘIDEJ INSTAGRAM:
window.storyData.instagram = {
    "elias_syn": {
        "name": "Eliáš",
        "avatar": "eliasek.png",
        "bio": "Skaut. Urbex. Programování. Pózování 📸",
        "followers": "128",
        "following": "145",
        "posts": [
            {
                "img": "eliasek9.png",
                "desc": "S Filipem jsem byl 14 dní na vodě. To byla brutální jízda!!",
                "likes": 6
            },
            {
                "img": "eliasek7.png",
                "desc": "Takto vypadá moje maka úplně zoufalá.",
                "likes": 2
            },
            {
                "img": "eliasek3.png",
                "desc": "Vytvářím počítačové hry, je to brutálně super kurz. Filip je nejlepší učitel.",
                "likes": 24
            },
            {
                "img": "eliasek5.png",
                "desc": "Programování počká. Dneska jsme s Filipem stavěli hráz v potoce.",
                "likes": 5
            },
            {
                "img": "eliasek6.png",
                "desc": "S Filipem jsem byl koupališti. Byla brutálně teplá voda!",
                "likes": 2
            },
            {
                "img": "eliasek1.png",
                "desc": "Tímto lesem chodím ze škole domů. Jednou jsem tu našel kostru krtka.",
                "likes": 2
            },
            {
                "img": "eliasek4.png",
                "desc": "Moje tajné místo.",
                "likes": 4
            },
            {
                "img": "eliasek2.png",
                "desc": "Zase s Tátou na průzkumu. Tahle stará chata je fakt creepy. Našli jsme tam divný věci...",
                "likes": 2
            },
            {
                "img": "eliasek8.png",
                "desc": "S tátou na výletě. Prý pojede na dva roky na expedici.",
                "likes": 4
            }
        ]
    },
    "matka_helena": {
        "name": "Helena (Máma)",
        "avatar": "helena.png",
        "bio": "Káva. Rodina. Klid. ☕❤️",
        "followers": "89",
        "following": "50",
        "posts": [
            {
                "img": "helena3.png",
                "desc": "Dnes ráno mě vyfotila sousedka. Vůbec jsem o tom nevěděla.",
                "likes": 2
            },
            {
                "img": "helena4.png",
                "desc": "Mám skvělého manžela, opět zařídil další výlet.",
                "likes": 7
            },
            {
                "img": "helena2.png",
                "desc": "Už v našem novém domě.",
                "likes": 9
            },
            {
                "img": "helena1.png",
                "desc": "Po deseti letech jsme si řekli ANO.",
                "likes": 12
            }
        ]
    },
    "instruktor_filip": {
        "name": "Filip (Instruktor)",
        "avatar": "instruktor.png",
        "bio": "Příroda. Přežití. Kód. Učím děti myslet a nevzdat se. 🌲💻",
        "followers": "342",
        "following": "120",
        "posts": [
            {
                "img": "instruktor1.png",
                "desc": "Základy přežití. Vždy buďte připraveni na nejhorší.",
                "likes": 3
            },
            {
                "img": "instruktor2.png",
                "desc": "Jsem instruktor a lektor už přes 20 let.",
                "likes": 4
            },
            {
                "img": "instruktor3.png",
                "desc": "Příroda je naše učebna.",
                "likes": 9
            }
        ]
    }
};
