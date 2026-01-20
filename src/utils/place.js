export const getJudicialDistrictFromPostalCode = (postalCode) => {
  const code = parseInt(postalCode, 10);

  const postalCodeMapping = {
    // Bruxelles
    1000: "Bruxelles",
    1020: "Bruxelles",
    1030: "Bruxelles",
    1040: "Bruxelles",
    1050: "Bruxelles",
    1060: "Bruxelles",
    1070: "Bruxelles",
    1080: "Bruxelles",
    1081: "Bruxelles",
    1082: "Bruxelles",
    1083: "Bruxelles",
    1090: "Bruxelles",
    1120: "Bruxelles",
    1130: "Bruxelles",
    1140: "Bruxelles",
    1150: "Bruxelles",
    1160: "Bruxelles",
    1170: "Bruxelles",
    1180: "Bruxelles",
    1190: "Bruxelles",
    1200: "Bruxelles",
    1210: "Bruxelles",

    // Aalst
    9300: "Aalst",
    9308: "Aalst",
    9310: "Aalst",
    9320: "Aalst",
    9340: "Aalst",
    9400: "Aalst",
    9401: "Aalst",
    9402: "Aalst",
    9403: "Aalst",
    9406: "Aalst",
    9420: "Aalst",
    9450: "Aalst",
    9460: "Aalst",
    9470: "Aalst",
    9473: "Aalst",
    9500: "Aalst",
    9506: "Aalst",
    9520: "Aalst",
    9880: "Aalst",
    9890: "Aalst",

    // Antwerp
    2000: "Anvers",
    2018: "Anvers",
    2020: "Anvers",
    2030: "Anvers",
    2040: "Anvers",
    2050: "Anvers",
    2060: "Anvers",
    2100: "Anvers",
    2140: "Anvers",
    2150: "Anvers",
    2170: "Anvers",
    2180: "Anvers",
    2600: "Anvers",
    2610: "Anvers",
    2660: "Anvers",

    // Arlon
    6700: "Arlon",
    6706: "Arlon",
    6704: "Arlon",
    6717: "Arlon",
    6790: "Arlon",
    6780: "Arlon",
    6781: "Arlon",
    6782: "Arlon",
    6720: "Arlon",
    6721: "Arlon",
    6723: "Arlon",
    6724: "Arlon",
    6730: "Arlon",
    6740: "Arlon",
    6741: "Arlon",
    6742: "Arlon",
    6743: "Arlon",
    6747: "Arlon",
    6750: "Arlon",

    // Ath
    7320: "Ath",
    7321: "Ath",
    7322: "Ath",
    7800: "Ath",
    7801: "Ath",
    7810: "Ath",
    7811: "Ath",
    7822: "Ath",
    7890: "Ath",
    7891: "Ath",
    7892: "Ath",
    7910: "Ath",
    7911: "Ath",
    7912: "Ath",
    7940: "Ath",
    7941: "Ath",
    7942: "Ath",
    7943: "Ath",
    7950: "Ath",
    7951: "Ath",
    7970: "Ath",
    7971: "Ath",
    7972: "Ath",
    7973: "Ath",
    7600: "Ath",
    7601: "Ath",
    7602: "Ath",
    7603: "Ath",
    7608: "Ath",
    7620: "Ath",
    7621: "Ath",
    7622: "Ath",
    7623: "Ath",
    7640: "Ath",
    7802: "Ath",
    7803: "Ath",
    7804: "Ath",
    7812: "Ath",
    7823: "Ath",
    7830: "Ath",
    7850: "Ath",
    7860: "Ath",
    7861: "Ath",
    7862: "Ath",
    7863: "Ath",
    7864: "Ath",
    7866: "Ath",
    7870: "Ath",
    7880: "Ath",
    7900: "Ath",
    7903: "Ath",
    7904: "Ath",
    7906: "Ath",

    // Bastogne
    6600: "Bastogne",
    6630: "Bastogne",
    6637: "Bastogne",
    6640: "Bastogne",
    6642: "Bastogne",
    6660: "Bastogne",
    6661: "Bastogne",
    6662: "Bastogne",
    6663: "Bastogne",
    6666: "Bastogne",
    6670: "Bastogne",
    6671: "Bastogne",
    6672: "Bastogne",
    6673: "Bastogne",
    6674: "Bastogne",
    6680: "Bastogne",
    6681: "Bastogne",
    6686: "Bastogne",
    6631: "Bastogne",
    6632: "Bastogne",
    6633: "Bastogne",
    6634: "Bastogne",
    6635: "Bastogne",
    6636: "Bastogne",

    // Brugge
    8000: "Brugge",
    8001: "Brugge",
    8200: "Brugge",
    8310: "Brugge",
    8380: "Brugge",
    8370: "Brugge",
    8020: "Brugge",
    8210: "Brugge",
    8300: "Brugge",
    8340: "Brugge",

    // Dinant
    5500: "Dinant",
    5501: "Dinant",
    5502: "Dinant",
    5503: "Dinant",
    5504: "Dinant",
    5520: "Dinant",
    5521: "Dinant",
    5522: "Dinant",
    5530: "Dinant",
    5537: "Dinant",
    5550: "Dinant",
    5555: "Dinant",
    5560: "Dinant",
    5300: "Dinant",
    5310: "Dinant",
    5330: "Dinant",
    5332: "Dinant",
    5333: "Dinant",
    5334: "Dinant",
    5336: "Dinant",
    5523: "Dinant",
    5524: "Dinant",
    5540: "Dinant",
    5541: "Dinant",
    5542: "Dinant",
    5543: "Dinant",
    5544: "Dinant",
    5561: "Dinant",
    5562: "Dinant",
    5563: "Dinant",
    5564: "Dinant",
    5570: "Dinant",
    5571: "Dinant",
    5572: "Dinant",
    5573: "Dinant",
    5574: "Dinant",
    5575: "Dinant",
    5576: "Dinant",
    5580: "Dinant",
    5590: "Dinant",

    // Charleroi
    6000: "Charleroi",
    6001: "Charleroi",
    6002: "Charleroi",
    6003: "Charleroi",
    6020: "Charleroi",
    6030: "Charleroi",
    6031: "Charleroi",
    6032: "Charleroi",
    6040: "Charleroi",
    6060: "Charleroi",
    6061: "Charleroi",
    6070: "Charleroi",
    6110: "Charleroi",
    6140: "Charleroi",
    6150: "Charleroi",
    6010: "Charleroi",
    6041: "Charleroi",
    6042: "Charleroi",
    6043: "Charleroi",
    6044: "Charleroi",
    6111: "Charleroi",
    6120: "Charleroi",
    6141: "Charleroi",
    6142: "Charleroi",
    6200: "Charleroi",
    6210: "Charleroi",
    6220: "Charleroi",
    6221: "Charleroi",
    6222: "Charleroi",
    6223: "Charleroi",
    6224: "Charleroi",
    6230: "Charleroi",
    6238: "Charleroi",
    6240: "Charleroi",

    // Dendermonde
    9200: "Dendermonde",
    9201: "Dendermonde",
    9202: "Dendermonde",
    9220: "Dendermonde",
    9230: "Dendermonde",
    9240: "Dendermonde",
    9250: "Dendermonde",
    9260: "Dendermonde",
    9270: "Dendermonde",
    9280: "Dendermonde",
    9290: "Dendermonde",

    // Diksmuide
    8600: "Diksmuide",
    8601: "Diksmuide",
    8620: "Diksmuide",
    8610: "Diksmuide",

    // Eeklo
    9900: "Eeklo",
    9910: "Eeklo",
    9940: "Eeklo",
    9950: "Eeklo",
    9800: "Eeklo",
    9810: "Eeklo",
    9820: "Eeklo",
    9850: "Eeklo",
    9860: "Eeklo",
    9870: "Eeklo",
    9920: "Eeklo",
    9930: "Eeklo",
    9960: "Eeklo",
    9970: "Eeklo",
    9980: "Eeklo",
    9990: "Eeklo",

    // Gent
    9000: "Gent",
    9030: "Gent",
    9031: "Gent",
    9040: "Gent",
    9050: "Gent",
    9060: "Gent",
    9070: "Gent",
    9080: "Gent",
    9090: "Gent",
    9111: "Gent",
    9032: "Gent",
    9041: "Gent",
    9042: "Gent",
    9051: "Gent",
    9052: "Gent",
    9100: "Gent",
    9120: "Gent",
    9140: "Gent",
    9150: "Gent",
    9160: "Gent",
    9170: "Gent",
    9180: "Gent",
    9185: "Gent",
    9190: "Gent",
    9830: "Gent",
    9831: "Gent",
    9840: "Gent",
    8470: "Gent",

    // Halle-Vilvoorde
    1500: "Halle-Vilvoorde",
    1501: "Halle-Vilvoorde",
    1502: "Halle-Vilvoorde",
    1600: "Halle-Vilvoorde",
    1601: "Halle-Vilvoorde",
    1650: "Halle-Vilvoorde",
    1651: "Halle-Vilvoorde",
    1652: "Halle-Vilvoorde",
    1700: "Halle-Vilvoorde",
    1701: "Halle-Vilvoorde",
    1702: "Halle-Vilvoorde",
    1750: "Halle-Vilvoorde",
    1755: "Halle-Vilvoorde",
    1760: "Halle-Vilvoorde",
    1770: "Halle-Vilvoorde",
    1800: "Halle-Vilvoorde",
    1820: "Halle-Vilvoorde",
    1830: "Halle-Vilvoorde",
    1930: "Halle-Vilvoorde",
    1980: "Halle-Vilvoorde",
    1981: "Halle-Vilvoorde",
    1540: "Halle-Vilvoorde",
    1541: "Halle-Vilvoorde",
    1560: "Halle-Vilvoorde",
    1570: "Halle-Vilvoorde",
    1620: "Halle-Vilvoorde",
    1630: "Halle-Vilvoorde",
    1640: "Halle-Vilvoorde",
    1653: "Halle-Vilvoorde",
    1670: "Halle-Vilvoorde",
    1671: "Halle-Vilvoorde",
    1673: "Halle-Vilvoorde",
    1674: "Halle-Vilvoorde",
    1703: "Halle-Vilvoorde",
    1730: "Halle-Vilvoorde",
    1731: "Halle-Vilvoorde",
    1740: "Halle-Vilvoorde",
    1741: "Halle-Vilvoorde",
    1742: "Halle-Vilvoorde",
    1761: "Halle-Vilvoorde",
    1780: "Halle-Vilvoorde",
    1785: "Halle-Vilvoorde",
    1790: "Halle-Vilvoorde",
    1831: "Halle-Vilvoorde",
    1840: "Halle-Vilvoorde",
    1850: "Halle-Vilvoorde",
    1860: "Halle-Vilvoorde",
    1861: "Halle-Vilvoorde",
    1880: "Halle-Vilvoorde",
    1900: "Halle-Vilvoorde",
    1910: "Halle-Vilvoorde",
    1932: "Halle-Vilvoorde",
    1933: "Halle-Vilvoorde",
    1934: "Halle-Vilvoorde",
    1935: "Halle-Vilvoorde",
    1950: "Halle-Vilvoorde",

    // Huy
    4500: "Huy",
    4520: "Huy",
    4530: "Huy",
    4540: "Huy",
    4577: "Huy",
    4570: "Huy",
    4400: "Huy",
    4420: "Huy",
    4550: "Huy",
    4557: "Huy",
    4560: "Huy",
    4590: "Huy",

    // Hasselt
    3500: "Hasselt",
    3501: "Hasselt",
    3510: "Hasselt",
    3511: "Hasselt",
    3520: "Hasselt",
    3530: "Hasselt",
    3540: "Hasselt",
    3550: "Hasselt",
    3560: "Hasselt",
    3590: "Hasselt",
    3512: "Hasselt",
    3545: "Hasselt",
    3570: "Hasselt",
    3580: "Hasselt",
    3581: "Hasselt",
    3600: "Hasselt",
    3620: "Hasselt",
    3630: "Hasselt",
    3640: "Hasselt",
    3650: "Hasselt",
    3660: "Hasselt",
    3665: "Hasselt",
    3668: "Hasselt",
    3670: "Hasselt",

    // Ieper
    8900: "Ieper",
    8902: "Ieper",
    8904: "Ieper",
    8906: "Ieper",
    8908: "Ieper",
    8920: "Ieper",
    8930: "Ieper",
    8980: "Ieper",

    // Kortrijk
    8500: "Kortrijk",
    8510: "Kortrijk",
    8511: "Kortrijk",
    8512: "Kortrijk",
    8530: "Kortrijk",
    8540: "Kortrijk",
    8550: "Kortrijk",
    8560: "Kortrijk",
    8570: "Kortrijk",
    8580: "Kortrijk",

    // Leuven
    3000: "Leuven",
    3010: "Leuven",
    3012: "Leuven",
    3040: "Leuven",
    3050: "Leuven",
    3060: "Leuven",
    3070: "Leuven",
    3080: "Leuven",
    3090: "Leuven",
    3110: "Leuven",
    3120: "Leuven",
    3140: "Leuven",
    3001: "Leuven",
    3018: "Leuven",
    3020: "Leuven",
    3041: "Leuven",
    3051: "Leuven",
    3052: "Leuven",
    3053: "Leuven",
    3054: "Leuven",
    3061: "Leuven",
    3071: "Leuven",
    3078: "Leuven",
    3111: "Leuven",
    3118: "Leuven",
    3128: "Leuven",
    3130: "Leuven",
    3200: "Leuven",
    3201: "Leuven",
    3202: "Leuven",
    3210: "Leuven",
    3211: "Leuven",
    3220: "Leuven",
    3221: "Leuven",
    3270: "Leuven",
    3271: "Leuven",
    3272: "Leuven",
    3290: "Leuven",
    3293: "Leuven",
    3294: "Leuven",
    3300: "Leuven",
    3320: "Leuven",
    3321: "Leuven",
    3350: "Leuven",
    3360: "Leuven",
    3370: "Leuven",
    3380: "Leuven",
    3381: "Leuven",
    3384: "Leuven",
    3390: "Leuven",
    3391: "Leuven",
    3400: "Leuven",
    3401: "Leuven",
    3404: "Leuven",
    3440: "Leuven",
    3441: "Leuven",
    3450: "Leuven",
    3460: "Leuven",
    3470: "Leuven",
    3472: "Leuven",
    3473: "Leuven",
    3480: "Leuven",

    // Maaseik
    3680: "Maaseik",
    3681: "Maaseik",
    3682: "Maaseik",
    3690: "Maaseik",
    3691: "Maaseik",
    3692: "Maaseik",
    3900: "Maaseik",
    3910: "Maaseik",
    3920: "Maaseik",
    3930: "Maaseik",
    3940: "Maaseik",
    3945: "Maaseik",
    3950: "Maaseik",
    3960: "Maaseik",
    3970: "Maaseik",
    3971: "Maaseik",
    3980: "Maaseik",
    3990: "Maaseik",

    // Marche-en-Famenne
    6900: "Marche-en-Famenne",
    6970: "Marche-en-Famenne",
    6971: "Marche-en-Famenne",
    6980: "Marche-en-Famenne",
    6990: "Marche-en-Famenne",
    6920: "Marche-en-Famenne",
    6940: "Marche-en-Famenne",
    6941: "Marche-en-Famenne",
    6950: "Marche-en-Famenne",
    6960: "Marche-en-Famenne",
    6986: "Marche-en-Famenne",
    6987: "Marche-en-Famenne",

    // Mechelen
    2800: "Mechelen",
    2801: "Mechelen",
    2811: "Mechelen",
    2812: "Mechelen",
    2820: "Mechelen",
    2830: "Mechelen",
    2840: "Mechelen",
    2850: "Mechelen",
    2860: "Mechelen",
    2870: "Mechelen",
    2880: "Mechelen",
    2890: "Mechelen",
    2845: "Mechelen",
    2861: "Mechelen",
    2900: "Mechelen",
    2910: "Mechelen",
    2920: "Mechelen",
    2930: "Mechelen",
    2940: "Mechelen",
    2950: "Mechelen",
    2960: "Mechelen",
    2970: "Mechelen",
    2980: "Mechelen",
    2990: "Mechelen",

    // Mons
    7000: "Mons",
    7011: "Mons",
    7012: "Mons",
    7030: "Mons",
    7032: "Mons",
    7040: "Mons",
    7050: "Mons",
    7060: "Mons",
    7070: "Mons",
    7090: "Mons",
    7020: "Mons",
    7021: "Mons",
    7022: "Mons",
    7024: "Mons",
    7031: "Mons",
    7033: "Mons",
    7034: "Mons",
    7041: "Mons",
    7061: "Mons",
    7080: "Mons",
    7100: "Mons",
    7110: "Mons",
    7120: "Mons",
    7130: "Mons",
    7140: "Mons",
    7160: "Mons",
    7180: "Mons",
    7190: "Mons",
    7700: "Mons",
    7711: "Mons",
    7712: "Mons",
    7730: "Mons",
    7760: "Mons",
    7780: "Mons",

    // Namur
    5000: "Namur",
    5001: "Namur",
    5020: "Namur",
    5021: "Namur",
    5022: "Namur",
    5024: "Namur",
    5030: "Namur",
    5032: "Namur",
    5033: "Namur",
    5080: "Namur",
    5081: "Namur",
    5082: "Namur",
    5100: "Namur",
    5101: "Namur",
    5002: "Namur",
    5003: "Namur",
    5004: "Namur",
    5031: "Namur",
    5060: "Namur",
    5070: "Namur",
    5110: "Namur",
    5140: "Namur",
    5150: "Namur",
    5170: "Namur",
    5190: "Namur",

    // Nivelles
    1400: "Nivelles",
    1401: "Nivelles",
    1402: "Nivelles",
    1404: "Nivelles",
    1406: "Nivelles",
    1410: "Nivelles",
    1420: "Nivelles",
    1430: "Nivelles",
    1440: "Nivelles",
    1450: "Nivelles",
    1470: "Nivelles",
    1300: "Nivelles",
    1301: "Nivelles",
    1310: "Nivelles",
    1315: "Nivelles",
    1320: "Nivelles",
    1325: "Nivelles",
    1340: "Nivelles",
    1341: "Nivelles",
    1342: "Nivelles",
    1348: "Nivelles",
    1350: "Nivelles",
    1357: "Nivelles",
    1360: "Nivelles",
    1367: "Nivelles",
    1370: "Nivelles",
    1380: "Nivelles",
    1390: "Nivelles",
    1414: "Nivelles",
    1421: "Nivelles",
    1428: "Nivelles",
    1435: "Nivelles",
    1457: "Nivelles",
    1460: "Nivelles",
    1461: "Nivelles",
    1472: "Nivelles",
    1473: "Nivelles",
    1474: "Nivelles",
    1480: "Nivelles",
    1490: "Nivelles",
    1491: "Nivelles",
    1492: "Nivelles",
    1493: "Nivelles",
    1494: "Nivelles",
    1495: "Nivelles",
    1498: "Nivelles",

    // Oostende
    8400: "Oostende",
    8420: "Oostende",
    8430: "Oostende",
    8431: "Oostende",
    8432: "Oostende",
    8433: "Oostende",
    8450: "Oostende",
    8460: "Oostende",

    // Oudenaarde
    9700: "Oudenaarde",
    9706: "Oudenaarde",
    9710: "Oudenaarde",
    9770: "Oudenaarde",
    9790: "Oudenaarde",
    9750: "Oudenaarde",

    // Philippeville
    5600: "Philippeville",
    5601: "Philippeville",
    5602: "Philippeville",
    5630: "Philippeville",
    5660: "Philippeville",
    5670: "Philippeville",
    5671: "Philippeville",
    6820: "Philippeville",
    6823: "Philippeville",
    6824: "Philippeville",
    6830: "Philippeville",
    6831: "Philippeville",
    6832: "Philippeville",
    6833: "Philippeville",
    6834: "Philippeville",
    6836: "Philippeville",
    6840: "Philippeville",
    6856: "Philippeville",
    6880: "Philippeville",
    6887: "Philippeville",
    6890: "Philippeville",

    // Roeselare
    8800: "Roeselare",
    8810: "Roeselare",
    8820: "Roeselare",
    8830: "Roeselare",
    8840: "Roeselare",
    8760: "Roeselare",
    8770: "Roeselare",
    8780: "Roeselare",
    8790: "Roeselare",
    8850: "Roeselare",
    8860: "Roeselare",
    8870: "Roeselare",
    8880: "Roeselare",
    8890: "Roeselare",

    // Sint-Niklaas
    9521: "Sint-Niklaas",
    9540: "Sint-Niklaas",
    9550: "Sint-Niklaas",
    9560: "Sint-Niklaas",
    9570: "Sint-Niklaas",
    9571: "Sint-Niklaas",
    9572: "Sint-Niklaas",
    9600: "Sint-Niklaas",
    9620: "Sint-Niklaas",
    9630: "Sint-Niklaas",

    // Thuin
    6250: "Thuin",
    6280: "Thuin",
    6440: "Thuin",
    6460: "Thuin",
    6470: "Thuin",
    6500: "Thuin",
    6530: "Thuin",
    6531: "Thuin",
    6532: "Thuin",
    6533: "Thuin",
    6534: "Thuin",
    6536: "Thuin",
    6560: "Thuin",
    6567: "Thuin",
    6590: "Thuin",

    // Tielt
    8700: "Tielt",
    8710: "Tielt",
    8720: "Tielt",
    8730: "Tielt",
    8740: "Tielt",
    8750: "Tielt",
    8755: "Tielt",

    // Tongeren
    3700: "Tongeren",
    3720: "Tongeren",
    3730: "Tongeren",
    3732: "Tongeren",
    3740: "Tongeren",
    3742: "Tongeren",
    3746: "Tongeren",
    3770: "Tongeren",
    3790: "Tongeren",
    3800: "Tongeren",
    3803: "Tongeren",
    3806: "Tongeren",
    3830: "Tongeren",
    3831: "Tongeren",
    3832: "Tongeren",
    3840: "Tongeren",
    3850: "Tongeren",
    3870: "Tongeren",
    3890: "Tongeren",

    // Tournai
    7500: "Tournai",
    7501: "Tournai",
    7502: "Tournai",
    7503: "Tournai",
    7506: "Tournai",
    7520: "Tournai",
    7521: "Tournai",
    7522: "Tournai",
    7530: "Tournai",
    7531: "Tournai",
    7532: "Tournai",
    7533: "Tournai",
    7534: "Tournai",
    7540: "Tournai",
    7542: "Tournai",
    7543: "Tournai",
    7548: "Tournai",

    // Turnhout
    2300: "Turnhout",
    2310: "Turnhout",
    2320: "Turnhout",
    2330: "Turnhout",
    2340: "Turnhout",
    2350: "Turnhout",
    2360: "Turnhout",
    2370: "Turnhout",
    2380: "Turnhout",
    2390: "Turnhout",
    2400: "Turnhout",
    2430: "Turnhout",
    2440: "Turnhout",
    2450: "Turnhout",
    2460: "Turnhout",
    2470: "Turnhout",
    2480: "Turnhout",
    2490: "Turnhout",
    2500: "Turnhout",
    2520: "Turnhout",
    2540: "Turnhout",
    2560: "Turnhout",
    2580: "Turnhout",
    2590: "Turnhout",

    // Verviers
    4600: "Verviers",
    4602: "Verviers",
    4606: "Verviers",
    4607: "Verviers",
    4608: "Verviers",
    4610: "Verviers",
    4620: "Verviers",
    4621: "Verviers",
    4624: "Verviers",
    4630: "Verviers",
    4631: "Verviers",
    4633: "Verviers",
    4640: "Verviers",
    4650: "Verviers",
    4651: "Verviers",
    4652: "Verviers",
    4653: "Verviers",
    4654: "Verviers",
    4670: "Verviers",
    4671: "Verviers",
    4672: "Verviers",
    4680: "Verviers",
    4681: "Verviers",
    4682: "Verviers",
    4683: "Verviers",
    4684: "Verviers",
    4690: "Verviers",
    4700: "Verviers",
    4710: "Verviers",
    4720: "Verviers",
    4721: "Verviers",
    4730: "Verviers",
    4731: "Verviers",
    4750: "Verviers",
    4760: "Verviers",
    4761: "Verviers",
    4770: "Verviers",
    4771: "Verviers",
    4780: "Verviers",
    4782: "Verviers",
    4783: "Verviers",
    4784: "Verviers",
    4800: "Verviers",
    4801: "Verviers",
    4802: "Verviers",
    4820: "Verviers",
    4821: "Verviers",
    4830: "Verviers",
    4831: "Verviers",
    4834: "Verviers",
    4837: "Verviers",
    4845: "Verviers",
    4850: "Verviers",
    4851: "Verviers",
    4860: "Verviers",
    4870: "Verviers",
    4877: "Verviers",
    4880: "Verviers",
    4890: "Verviers",
    4900: "Verviers",
    4910: "Verviers",
    4920: "Verviers",
    4950: "Verviers",
    4960: "Verviers",
    4970: "Verviers",
    4980: "Verviers",
    4983: "Verviers",
    4987: "Verviers",
    4990: "Verviers",

    // Veurne
    8630: "Veurne",
    8640: "Veurne",
    8650: "Veurne",
    8660: "Veurne",
    8670: "Veurne",
    8680: "Veurne",
    8690: "Veurne",

    // Virton
    6760: "Virton",
    6761: "Virton",
    6762: "Virton",
    6767: "Virton",
    6769: "Virton",
    6783: "Virton",
    6791: "Virton",
    6792: "Virton",
    6793: "Virton",

    // Waremme
    4300: "Waremme",
    4317: "Waremme",
    4340: "Waremme",
    4347: "Waremme",
    4350: "Waremme",
    4357: "Waremme",
    4360: "Waremme",
    4367: "Waremme",

    // Liège
    4000: "Liège",
    4020: "Liège",
    4030: "Liège",
    4031: "Liège",
    4032: "Liège",
    4040: "Liège",
    4041: "Liège",
    4042: "Liège",
    4050: "Liège",
    4051: "Liège",
    4052: "Liège",
    4053: "Liège",
    4100: "Liège",
    4101: "Liège",
    4102: "Liège",
    4120: "Liège",
    4121: "Liège",
    4122: "Liège",
    4130: "Liège",
    4140: "Liège",
    4160: "Liège",
    4161: "Liège",
    4162: "Liège",
    4163: "Liège",
    4170: "Liège",
    4171: "Liège",
    4180: "Liège",
    4181: "Liège",

    // Neufchâteau
    6687: "Neufchâteau",
    6688: "Neufchâteau",
    6690: "Neufchâteau",
    6692: "Neufchâteau",
    6698: "Neufchâteau",
    6800: "Neufchâteau",
    6810: "Neufchâteau",
    6811: "Neufchâteau",
    6812: "Neufchâteau",
    6813: "Neufchâteau",
    6821: "Neufchâteau",
    6850: "Neufchâteau",
    6851: "Neufchâteau",
    6852: "Neufchâteau",
    6853: "Neufchâteau",
    6860: "Neufchâteau",
    6870: "Neufchâteau",
    6871: "Neufchâteau",
    6872: "Neufchâteau",
    6874: "Neufchâteau",
  };

  return postalCodeMapping[code] || null;
};

export const getJudicialDistrictFromLocality = (locality) => {
  const normalizedLocality = locality.toLowerCase().trim();

  const cityMapping = {
    // Brussels-Capital Region
    brussels: "Bruxelles",
    bruxelles: "Bruxelles",
    brussel: "Bruxelles",
    etterbeek: "Bruxelles",
    ixelles: "Bruxelles",
    uccle: "Bruxelles",
    schaerbeek: "Bruxelles",
    anderlecht: "Bruxelles",
    molenbeek: "Bruxelles",
    forest: "Bruxelles",
    "saint-gilles": "Bruxelles",
    auderghem: "Bruxelles",

    // Walloon Brabant - Nivelles
    nivelles: "Nivelles",
    waterloo: "Nivelles",
    wavre: "Nivelles",
    ottignies: "Nivelles",
    "louvain-la-neuve": "Nivelles",
    tubize: "Nivelles",

    // Flemish Brabant - Halle-Vilvoorde
    vilvoorde: "Halle-Vilvoorde",
    halle: "Halle-Vilvoorde",
    asse: "Halle-Vilvoorde",
    zaventem: "Halle-Vilvoorde",
    machelen: "Halle-Vilvoorde",
    kraainem: "Halle-Vilvoorde",

    // Flemish Brabant - Leuven
    leuven: "Leuven",
    louvain: "Leuven",
    tienen: "Leuven",
    aarschot: "Leuven",

    // Antwerp Province - Anvers
    antwerpen: "Anvers",
    antwerp: "Anvers",
    berchem: "Anvers",

    // Antwerp Province - Mechelen
    mechelen: "Mechelen",
    malines: "Mechelen",
    lier: "Mechelen",

    // Antwerp Province - Turnhout
    turnhout: "Turnhout",
    mol: "Turnhout",
    geel: "Turnhout",

    // Limburg Province - Hasselt
    hasselt: "Hasselt",
    genk: "Hasselt",
    diepenbeek: "Hasselt",

    // Limburg Province - Tongeren
    tongeren: "Tongeren",
    tongres: "Tongeren",
    bilzen: "Tongeren",

    // Limburg Province - Maaseik
    maaseik: "Maaseik",
    kinrooi: "Maaseik",
    bree: "Maaseik",

    // Liège Province - Liège
    liège: "Liège",
    liege: "Liège",
    seraing: "Liège",
    herstal: "Liège",

    // Liège Province - Huy
    huy: "Huy",
    hannut: "Huy",

    // Liège Province - Verviers
    verviers: "Verviers",
    spa: "Verviers",
    malmédy: "Verviers",

    // Liège Province - Waremme
    waremme: "Waremme",
    "saint-georges-sur-meuse": "Waremme",

    // Namur Province - Namur
    namur: "Namur",
    gembloux: "Namur",
    "fosses-la-ville": "Namur",

    // Namur Province - Dinant
    dinant: "Dinant",
    ciney: "Dinant",

    // Namur Province - Philippeville
    philippeville: "Philippeville",
    couvin: "Philippeville",

    // Hainaut Province - Charleroi
    charleroi: "Charleroi",
    châtelet: "Charleroi",
    fleurus: "Charleroi",

    // Hainaut Province - Thuin
    thuin: "Thuin",
    binche: "Thuin",
    chimay: "Thuin",

    // Hainaut Province - Mons
    mons: "Mons",
    frameries: "Mons",
    quaregnon: "Mons",

    // Hainaut Province - Ath
    ath: "Ath",
    enghien: "Ath",
    lessines: "Ath",

    // Hainaut Province - Tournai
    tournai: "Tournai",
    mouscron: "Tournai",
    "comines-warneton": "Tournai",

    // Luxembourg Province - Arlon
    arlon: "Arlon",
    messancy: "Arlon",
    aubange: "Arlon",

    // Luxembourg Province - Neufchâteau
    neufchâteau: "Neufchâteau",
    bertrix: "Neufchâteau",
    libramont: "Neufchâteau",

    // Luxembourg Province - Virton
    virton: "Virton",
    florenville: "Virton",
    chiny: "Virton",

    // Luxembourg Province - Bastogne
    bastogne: "Bastogne",
    houffalize: "Bastogne",
    vielsalm: "Bastogne",

    // Luxembourg Province - Marche-en-Famenne
    "marche-en-famenne": "Marche-en-Famenne",
    durbuy: "Marche-en-Famenne",
    hotton: "Marche-en-Famenne",

    // West Flanders Province - Brugge
    bruges: "Brugge",
    brugge: "Brugge",
    damme: "Brugge",

    // West Flanders Province - Oostende
    oostende: "Oostende",
    ostende: "Oostende",
    bredene: "Oostende",

    // West Flanders Province - Diksmuide
    dixmude: "Diksmuide",
    diksmuide: "Diksmuide",

    // West Flanders Province - Veurne
    furnes: "Veurne",
    veurne: "Veurne",
    nieuport: "Veurne",

    // West Flanders Province - Kortrijk
    kortrijk: "Kortrijk",
    courtrai: "Kortrijk",
    menen: "Kortrijk",

    // West Flanders Province - Ieper
    ieper: "Ieper",
    ypres: "Ieper",
    poperinge: "Ieper",

    // West Flanders Province - Tielt
    tielt: "Tielt",
    ruiselede: "Tielt",
    pittem: "Tielt",

    // West Flanders Province - Roeselare
    roeselare: "Roeselare",
    roulers: "Roeselare",
    izegem: "Roeselare",

    // East Flanders Province - Gent
    gent: "Gent",
    gand: "Gent",
    ghent: "Gent",
    lochristi: "Gent",

    // East Flanders Province - Dendermonde
    dendermonde: "Dendermonde",
    termonde: "Dendermonde",
    hamme: "Dendermonde",

    // East Flanders Province - Sint-Niklaas
    "sint-niklaas": "Sint-Niklaas",
    "saint-nicolas": "Sint-Niklaas",
    temse: "Sint-Niklaas",

    // East Flanders Province - Aalst
    aalst: "Aalst",
    alost: "Aalst",
    ninove: "Aalst",

    // East Flanders Province - Oudenaarde
    oudenaarde: "Oudenaarde",
    audenarde: "Oudenaarde",
    ronse: "Oudenaarde",

    // East Flanders Province - Eeklo
    eeklo: "Eeklo",
    kaprijke: "Eeklo",
    maldegem: "Eeklo",
  };

  return cityMapping[normalizedLocality] || null;
};

export const getPlaceDetails = (placeId) =>
  new Promise((resolve, reject) => {
    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      reject(
        new Error(
          "'google' is not defined. Make sure the Google Maps JavaScript API is loaded."
        )
      );
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId,
        fields: ["address_components", "name", "formatted_address"],
      },
      (place, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          resolve(place);
        } else {
          reject(new Error(`Places service failed: ${status}`));
        }
      }
    );
  });

export const extractRegionFromPlace = (place) => {
  if (!place.address_components) return null;

  const postalCodeComponent = place.address_components.find((component) =>
    component.types.includes("postal_code")
  );
  if (postalCodeComponent) {
    const judicialDistrict = getJudicialDistrictFromPostalCode(
      postalCodeComponent.long_name
    );
    if (judicialDistrict) {
      return judicialDistrict;
    }
  }

  const localityComponent = place.address_components.find((component) =>
    component.types.includes("administrative_area_level_2")
  );
  if (localityComponent) {
    const judicialDistrict = getJudicialDistrictFromLocality(
      localityComponent.long_name
    );
    if (judicialDistrict) {
      return judicialDistrict;
    }
  }

  return null;
};

export const getRegionFromAddress = (address, country, postalCode) =>
  new Promise((resolve) => {
    const normalizedCountry = country.toUpperCase().trim();

    if (normalizedCountry === "BE" && postalCode) {
      const judicialDistrict = getJudicialDistrictFromPostalCode(postalCode);
      if (judicialDistrict) {
        resolve(judicialDistrict);
        return;
      }
    }

    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.Geocoder
    ) {
      resolve(null);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      {
        address: `${address}, ${normalizedCountry}`,
        componentRestrictions: { country: normalizedCountry },
      },
      (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const result = results[0];

          if (!result.address_components) {
            resolve(null);
            return;
          }

          for (const component of result.address_components) {
            if (component.types.includes("administrative_area_level_2")) {
              const locality = component.long_name;
              const district = getJudicialDistrictFromLocality(locality);
              if (district) {
                resolve(district);
                return;
              }
            }
          }

          resolve(null);
        } else {
          resolve(null);
        }
      }
    );
  });

export const getCountryFromCompanyNumber = (companyNumber) => {
  if (!companyNumber) return "BE";

  const upperCompanyNumber = companyNumber.toUpperCase().trim();

  if (upperCompanyNumber.startsWith("BE")) return "BE";
  if (upperCompanyNumber.startsWith("LU")) return "LU";
  if (upperCompanyNumber.startsWith("FR")) return "FR";
  if (upperCompanyNumber.startsWith("NL")) return "NL";

  return "BE";
};

export const normalizeRegionName = (regionName) =>
  regionName.replace(/^Région\s+/i, "").trim();
