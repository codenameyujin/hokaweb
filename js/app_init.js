const appInit={
    "id": "#grmnApp",
    "cookiesKey": "EVNT_find_your_watch",
    "text": {
        "step": {
            "next": "다음 질문",
            "result": "결과 보기",
            "more": "자세히"
        }
    },
    "APIs": {
        "country": "kr",
        "api": "https://www.garmin.com.my/_js/api_minisite-buy-data/kr/",
        "timeout": 30000,
        "products": "js/app_products.json",
        "compare": {
            "host": "https://www.garmin.co.kr/",
            "url": "products/compare/",
            "urlMb": "mobile/products/compare/",
            "category": "wearables",
            "subCategory": "wearables-smartwatches",
            "locale": "ko_KR"
        }
    },
    "baseURL": "https://www.garmin.co.kr/m/buzz/minisite/find-your-watch-v2/"
};
const questions = {
    "filter_price": [
        {
            "keys": "cheapest",
            "min": 0,
            "max": 450000,
            "filter": "budget"
        },
        {
            "keys": "lower_price",
            "min": 450001,
            "max": 600000,
            "filter": "budget"
        },
        {
            "keys": "middle_price",
            "min": 600001,
            "max": 1000000,
            "filter": "budget"
        },
        {
            "keys": "higher_price",
            "min": 1000001,
            "max": 2500000,
            "filter": "budget"
        },
        {
            "keys": "luxury",
            "min": 2500001,
            "max": 10000000,
            "filter": "budget"
        }
    ],
    "FILTERS": [
        {
            "filter": "gender",
            "title": "나의 성별은?",
            "fi": "",
            "type": "radio",
            "tags": [
                {
                    "filter": "gender",
                    "tag": "women",
                    "title": "여성",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "gender",
                    "tag": "men",
                    "title": "남성",
                    "desc": "",
                    "img": ""
                }
            ],
            "flow": {
                "tag": "no",
                "goto": "budget"
            }
        },
        {
            "filter": "where",
            "title": "주로 어디에서 달리시나요?",
            "fi": true,
            "type": "checkbox",
            "tags": [
                {
                    "filter": "where",
                    "tag": "road",
                    "title": "도로",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "where",
                    "tag": "trail",
                    "title": "트레일/산길",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "where",
                    "tag": "track",
                    "title": "트랙",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "where",
                    "tag": "others",
                    "title": "그 외",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "purpose",
            "title": "러닝의 주된 목적은 무엇인가요?",
            "fi": "",
            "type": "radio",
            "tags": [
                {
                    "filter": "purpose",
                    "tag": "race",
                    "title": "레이스 준비",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "purpose",
                    "tag": "health",
                    "title": "건강 관리 및 체중 조절",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "purpose",
                    "tag": "hobby",
                    "title": "취미 및 스트레스 해소",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "purpose",
                    "tag": "others",
                    "title": "기타",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "distance",
            "title": "주로 달리는 거리(km/회)",
            "fi": "",
            "type": "radio",
            "tags": [
                {
                    "filter": "distance",
                    "tag": "zero",
                    "title": "0~5km",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "distance",
                    "tag": "five",
                    "title": "5~10km",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "distance",
                    "tag": "ten",
                    "title": "10~20km",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "distance",
                    "tag": "twenty",
                    "title": "20km 이상",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "arch",
            "title": "발의 아치 형태를 알고 계신가요?",
            "fi": "",
            "type": "radio",
            "tags": [
                {
                    "filter": "arch",
                    "tag": "low",
                    "title": "평발 Low Arch",
                    "desc": "",
                    "img":""
                },
                {
                    "filter": "arch",
                    "tag": "medium",
                    "title": "보통 Medium Arch",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "arch",
                    "tag": "high",
                    "title": "높은 아치 High Arch",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "arch",
                    "tag": "donotknow",
                    "title": "잘 모르겠음",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "posture",
            "title": "보행 또는 달릴 때 발의 자세를 체크해보셨나요?",
            "fi": "",
            "type": "radio",
            "tags": [
                {
                    "filter": "posture",
                    "tag": "inside",
                    "title": "과내전 발 안쪽으로 기울어짐",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "posture",
                    "tag": "straight",
                    "title": "중립 발이 똑바로 움직임",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "posture",
                    "tag": "outside",
                    "title": "과외전 발 바깥쪽으로 기울어짐",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "posture",
                    "tag": "donotknow",
                    "title": "잘 모르겠음",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "cushion",
            "title": "러닝 시 선호하는 쿠셔닝 강도",
            "fi": true,
            "type": "checkbox",
            "tags": [
                {
                    "filter": "cushion",
                    "tag": "soft",
                    "title": "부드러운 쿠션",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "cushion",
                    "tag": "sleep",
                    "title": "중간 정도",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "cushion",
                    "tag": "music",
                    "title": "단단한 쿠션",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "time",
            "title": "주로 러닝하는 시간대",
            "fi": true,
            "type": "checkbox",
            "tags": [
                {
                    "filter": "time",
                    "tag": "morning",
                    "title": "아침",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "time",
                    "tag": "afternoon",
                    "title": "낮",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "time",
                    "tag": "evening",
                    "title": "저녁",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "time",
                    "tag": "night",
                    "title": "밤",
                    "desc": "",
                    "img": ""
                }
            ]
        },
        {
            "filter": "factor",
            "title": "중요하게 생각하는 요소",
            "fi": true,
            "type": "checkbox",
            "tags": [
                {
                    "filter": "factor",
                    "tag": "durability",
                    "title": "내구성",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "factor",
                    "tag": "lightness",
                    "title": "가벼움",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "factor",
                    "tag": "breathable",
                    "title": "통기성",
                    "desc": "",
                    "img": ""
                },
                {
                    "filter": "factor",
                    "tag": "waterproof",
                    "title": "방수 기능",
                    "desc": "",
                    "img": ""
                }
            ]
        }
    ],
        hashTagIcon : {
           "heart_rate": appInit.baseURL + "images/icons/heart-rate.svg",
           "notification": appInit.baseURL + "images/icons/notification.svg",
           "gps": appInit.baseURL + "images/icons/gps.svg",
           "battery": appInit.baseURL + "images/icons/battery.svg"
        },
        hashTag : [
            {"keys":"abc","img":"","title":"ABC 센서","desc":"고도계, 기압계, 3축 전자 나침반으로 다음 경로를 탐색하세요."},
            {"keys":"air_integration","img":"","title":"에어 인티그레이션","desc":"Descent T2 트랜시버(별도 판매) 와 함께 사용하면, SubWave 소나 네트워크를 통해 최대 8개 다이빙 탱크의 압력을 모니터링할 수 있습니다."},
            {"keys":"aluminium_watch_case","img":"","title":"알루미늄 베젤","desc":"이 스마트워치는 가벼워서 착용하기에 번거롭지 않은 알루미늄 베젤을 갖추고 있습니다."},
            {"keys":"amoled","img":"","title":"아몰레드 디스플레이","desc":"이 스마트워치의 AMOLED 디스플레이는 선명하고 밝고 매끈해서 햇빛을 받고 있을 때도 훌륭한 가독성을 제공합니다."},
            {"keys":"analog","img":"","title":"아날로그 시계바늘","desc":"이 스마트워치(밴드)에는 유행을 타지 않는 전통적인 클래식 시계바늘이 있습니다."},
            {"keys":"animated_workouts","img":"","title":"온스크린 운동 가이드","desc":"유산소 운동, 웨이트 트레이닝, 요가, 필라테스 및 고강도 인터벌 트레이닝 지침을 워치 디스플레이에서 편리하게 바로 확인할 수 있으므로 훈련 루틴에 따라서 간단하게 운동할 수 있습니다."},
            {"keys":"autoshot","img":"","title":"AutoShot 스윙 감지","desc":"이 스마트워치는 스트로크 횟수와 거리를 자동으로 기록합니다. Approach CT10 클럽 센서 시스템과 페어링하면 훨씬 더 정확한 거리와 데이터를 제공합니다."},
            {"keys":"battery","img":"","title":"배터리 수명","desc":"배터리 수명은 스마트워치 모드(전화기에 블루투스 연결 + 심박수)에서 평가됩니다. 태양광 충전 스마트워치는 50,000 lux 조도 조건의 야외에서 3시간을 요구합니다."},
            {"keys":"body_battery","img":"","title":"바디 배터리 모니터링","desc":"신체의 에너지 레벨을 추적하여 활동하거나 휴식하기에 가장 적합한 시간을 알아보세요."},
            {"keys":"button_control","img":appInit.baseURL + "images/function-5-buttons.jpg","title":"버튼 작동","desc":"이 스마트워치는 터치스크린 방식과 달리 버튼 5개를 사용하여 조작합니다. 그러므로 워치 페이스 위에 묻은 땀으로 인해 터치 작동에 문제가 발생하지 않고 수영 중이나 장갑을 착용하고 라이딩하는 도중에도 조작할 수 있습니다."},
            {"keys":"caddie","img":"","title":"가상 캐디","desc":"손목에서 약간의 도움을 받아보십시오. 가상 캐디가 풍속과 풍향을 고려하여 일반적인 클럽별 스윙 거리를 기준으로 적절한 클럽을 추천합니다."},
            {"keys":"caddie_pro","img":"","title":"향상된 가상 캐디","desc":"바람, 고도, 스윙 데이터 등을 기반으로 클럽 추천을 받을 수 있습니다. 새로운 샷 분포도를 통해 클럽 선택에 따라 어떻게 게임을 진행해 나갈 수 있는지 알 수 있습니다."},
            {"keys":"compass","img":"","title":"다이브 나침반","desc":"수중 나침반과 내장 ABC 센서로 언제 어디서든 원하는 길로 향할 수 있습니다."},
            {"keys":"daily_suggestion","img":"","title":"데일리 워크아웃 추천","desc":"자신만의 운동을 준비하세요. Garmin Connect 스마트폰 앱 캘린더에서 러닝 후 퍼포먼스와 회복 상태뿐 아니라 다가오는 레이스 일정에 맞게 매번 권장 운동량을 조정합니다."},
            {"keys":"damascus","img":"","title":"Damascus Steel Edition","desc":"엄선된 스틸 소재 두 가지에 복잡한 절곡, 단조의 과정을 더하여 Garmin만의 유일무이한 트위스트 패턴을 만들었습니다. 천년의 기술을 재현하기 위해 6개월 동안 50가지 이상의 공정 과정을 거쳤습니다."},
            {"keys":"dive_log","img":"","title":"다이브 로그","desc":"스마트폰에 설치된 Garmin Dive 앱으로 다이브로그를 자동 연동하여 데이터를 공유하고 리뷰하여 장비를 효과적으로 관리하고, 사진을 찍고, 메모를 하는 등 다양한 기능을 사용할 수 있습니다."},
            {"keys":"dive_readiness","img":"","title":"다이빙 준비 상태","desc":"Garmin에서 처음 선보이는 다이빙 준비 상태 기능은 수면, 운동, 스트레스 및 시차 등 라이프 스타일이 신체에 미치는 영향을 파악해서 다이빙을 할 수 있는 최적의 준비가 완료된 시간을 알려주는 기능입니다."},
            {"keys":"dive_view","img":"","title":"다이브뷰 맵","desc":"컬러 맵에 표시된 수심 등고선과 4천 개 이상의 다이빙 포인트를 통해 새로운 다이빙 스팟에서 이색적인 경험을 해보세요.(북미 및 유럽 일부 지역 사용 가능)"},
            {"keys":"diving","img":"","title":"다양한 내장 다이브 모드","desc":"단일 및 멀티 가스 다이빙(nitrox와 trimix 포함), 게이지, 무호흡 사냥, 폐쇄 회로식 재호흡기(CCR)등 다양한 다이브 모드를 지원합니다."},
            {"keys":"dome_sapphire","img":"","title":"돔형 사파이어 렌즈","desc":"돔형 사파이어 렌즈는 최고 등급의 긁힘 방지성과 가독성을 제공합니다."},
            {"keys":"durable","img":"","title":"견고성과 내구성","desc":"이 스마트워치는 높은 고도에서 군사 표준 MIL-STD-810 테스트를 통과했으며, 이로써 극한의 열과 냉기, 반복적인 낙하, 굴러떨어짐, 충격, 강우/먼지 부식에 대한 내성을 검증받았습니다. 언제 어디서나 믿을 수 있는 견고성을 달성했습니다."},
            {"keys":"easy_to_read","img":"","title":"크고 선명한 디스플레이","desc":"이 피트니스 추적 밴드는 더 크고 분명하게 볼 수 있도록 더 커진 글자 크기와 밝은 디스플레이를 제공합니다."},
            {"keys":"ecg","img":"","title":"","desc":""},
            {"keys":"flashlight","img":"","title":"내장 플래시라이트","desc":"이 스마트워치에는 조도가 낮은 환경에서 길을 찾는 것을 돕고 비상 상황에서 SOS 신호등을 켤 수 있도록 네 가지 밝기 레벨과 적색등을 지원하는 LED 플래시라이트가 내장되어 있습니다."},
            {"keys":"gps","img":"","title":"내장 GPS","desc":"내장 GPS를 사용하여 전화기에 연결하지 않고도 워치에서 사용자의 움직임을 추적하고 거리, 속도, 간격과 같은 정확한 상태를 제공할 수 있습니다."},
            {"keys":"gps_multi","img":"","title":"멀티밴드 GNSS","desc":"다중 위성 위치 측정 시스템(GPS, GLONASS, Galileo)과 새롭게 추가된 멀티 밴드 GNSS은 까다로운 환경에서도 올바른 방향을 유지할 수 있도록 위치 측정의 속도와 정확도를 크게 향상시켰습니다."},
            {"keys":"grade_5","img":"","title":"티타늄(5등급)","desc":"2등급 티타늄보다 2.5배 더 단단하고 내열성, 내부식성, 긁힘 방지성이 우수한 프리미엄 5등급 티타늄으로 제작하여 가장 지독한 지상 환경에서도 뛰어난 성능을 제공하고 경량 디자인 및 편안함에 대한 요구도 충족합니다."},
            {"keys":"green_view","img":"","title":"그린 미리보기","desc":"그린 미리보기 기능 덕분에 코스의 모든 위치에서 그린의 실제 형태를 볼 수 있으며 그날의 위치를 수동으로 드래그해 거리를 더 정확하게 확인할 수 있습니다."},
            {"keys":"hazard_view","img":"","title":"장애물 구역 보기","desc":"이 스마트워치는 맵에서 모든 해저드를 빠르게 훑어보고 중요한 거리 정보에 접근하여 불리한 조건을 피할 수 있게 해줍니다."},
            {"keys":"heart_rate","img":"","title":"24시간 건강 모니터링","desc":"이 스마트워치(피트니스 추적기)는 심박수를 지속적으로 모니터링하면서 심박수 변화를 분석하여 스트레스 수준을 추정한 다음, 스트레스 수준과 수면 질 및 활동 데이터 등을 기준으로 바디 배터리를 추산하여 생활양식 습관 조정과 개선을 도울 수 있습니다."},
            {"keys":"hidden_display","img":"","title":"히든 터치스크린 디스플레이","desc":"워치 페이스는 사용자가 필요로 할 때만 정보를 표시합니다. 워치 페이스를 탭하면 터치스크린이 활성화됩니다."},
            {"keys":"light_weight","img":"","title":"경량","desc":"이 스마트워치(밴드)는 손목에 아무것도 착용하고 있지 않은 것처럼 가볍고 편안합니다. "},
            {"keys":"luminous","img":"","title":"야광 시계바늘","desc":"이 스마트워치의 시계바늘과 시간 인덱스는 야간 가독성 향상을 위해 Swiss Super-LumiNova로 코팅되어 있으며 시계바늘이 풀스크린 디지털 디스플레이를 자동으로 회피하여 물리적 시계바늘이 중요 정보를 차폐하는 것이 예방되고 실용적이고 쉽게 워치를 읽을 수 있습니다."},
            {"keys":"marq_adventurer","img":"","title":"아웃도어 어드밴처용 디자인","desc":"독자적인 SatIQ 기술을 적용한 MARQ Adventurer는 멀티밴드 GNSS 위치 확인 모드를 자동으로 전환하여 모든 환경에서 최고 수준의 위치 정확성과 최적의 배터리 성능을 보장합니다. 고도 측정을 위한 고도계, 날씨 모니터링을 위한 기압계, 3-축 전자 나침반을 포함하여 다양한 ABC 센서가 내장되어 있어 아웃도어 스포츠에 없어서는 안될 동반자가 되어줍니다."},
            {"keys":"marq_athlete","img":"","title":"운동선수용 디자인","desc":"MARQ Athlete는 1주일간 수면의 질과 HRV, 스트레스, 훈련 부하를 평가할 수 있으므로 사용자가 이 수치를 점검하여 신체가 고강도 훈련에 적합한 상태인지를 빠르게 평가할 수 있습니다. 트레일 러닝, 수영, 러닝, 자전거, 하이킹, 조정, 스키, 골프, 서핑, 실내 클라이밍을 포함하여 수많은 멀티스포츠 모드를 제공합니다. 유산소 운동, 웨이트 트레이닝, 요가, 필라테스 및 고강도 인터벌 트레이닝을 워치 디스플레이에서 편리하게 바로 확인할 수 있으므로 훈련 루틴에 따라서 간단하게 운동할 수 있습니다."},
            {"keys":"marq_aviator","img":"","title":"비행사용 디자인","desc":"MARQ Aviator는 세계 항공 데이터베이스에서 특정한 위치나 웨이포인트를 바로 탐색할 수 있으며, “가장 가까운 공항” 기능을 선택해 가장 가까운 공항으로의 경로를 활성화할 수도 있습니다. 터치스크린 디스플레이에서 풀컬러 다이내믹 맵을 토글 및 확인하고 웨이포인트를 터치해 자세한 정보를 얻을 수 있습니다. 경로 위에 표시되는 NEXRAD 레이더를 확인할 수도 있습니다."},
            {"keys":"marq_captain","img":"","title":"선원용 디자인","desc":"MARQ Captain을 호환되는 선박 내 기기에 연결하면 수심, 엔진 RPM, 풍속, 맞춤 데이터 등을 워치에서 바로 확인할 수 있습니다. 낙수자 표시기(MOB) 기능이 탑재되어있어 버튼만 누르면 위치, 방향 화살표, 거리 카운트다운 타이머가 표시되므로 빠른 구조 작업을 펼치는 데 도움이 됩니다."},
            {"keys":"marq_golf","img":"","title":"골프용 디자인","desc":"MARQ Golfer는 가장 믿을 수 있는 손목 위 가당 캐디입니다. 풍속과 풍향을 토대로 특정 클럽의 기본 스윙 거리를 사용해 클럽을 추천합니다. 스마트워치에서 전 세계 골프 코스 42,000개 이상의 풀컬러 페어웨이 맵에 접근하고 PlaysLike 경사 거리 제안 기능을 이용할 수 있습니다."},
            {"keys":"multi_control","img":appInit.baseURL + "images/function-multi-control.jpg","title":"버튼 + 터치 작동","desc":"이 스마트워치는 옵션과 기능을 빠르게 선택할 수 있는 터치스크린이 탑재되어 있을뿐만 아니라 땀이나 장갑 때문에 스크린을 터치할 수 없을 때 이용할 수 있는 버튼 5개도 있습니다. 터치스크린 기능 On/Off를 선택할 수도 있습니다."},
            {"keys":"music","img":"","title":"음악","desc":"컴퓨터에서 이 스마트워치로 노래를 다운로드하거나 제3자 음악 스트리밍 플랫폼을 이용해 좋아하는 노래를 재생할 수 있습니다. 블루투스 이어버드와 페어링하여 워치에서 음악을 즐길 수 있습니다."},
            {"keys":"navigation","img":"","title":"내장 맵과 내비게이션","desc":"풀컬러 맵 정보가 내장된 이 스마트워치는 확실한 내비게이션과 위치 추적에 기반해 올바른 경로로 정밀하게 안내합니다."},
            {"keys":"notification","img":"","title":"스마트 알림","desc":"호환되는 스마트폰과 페어링하면 이메일과 문자 메시지 및 알림을 스마트워치(밴드)에서 바로 받을 수 있습니다. Android™ 스마트폰에서는 사전에 작성한 문자 답신을 보낼 수 있습니다."},
            {"keys":"ocean","img":"","title":"환경을 생각하는","desc":"하우징과 베젤 및 버튼은 해양 유입 플라스틱을 재활용한 소재로 만들어졌습니다."},
            {"keys":"patterned_lens","img":"","title":"패턴드 렌즈","desc":"매력적이고 세련된 패턴 렌즈 다이얼에 숨겨져 있는 터치스크린은 워치 페이지를 탭하거나 손목을 돌리면 활성화됩니다."},
            {"keys":"payment","img":"","title":"모바일 결제","desc":"이 스마트워치는 Garmin Pay를 지원합니다. 워치의 Garmin Pay 가상지갑에 지원되는 신용카드를 추가하기만 하면 편리하게 현금 없이 결제할 수 있습니다."},
            {"keys":"period","img":"","title":"여성 건강 모니터링","desc":"월경 주기와 임신을 추적하고 운동 및 영양에 대한 교육을 받을 수 있습니다."},
            {"keys":"pinpointer","img":"","title":"핀 포인터","desc":"핀의 방향을 알려주는 핀 포인터 기능으로 블라인드 샷에서도 가장 완벽한 스윙을 할 수 있습니다."},
            {"keys":"plays_like","img":"","title":"PlaysLike Distance 기능","desc":"PlaysLike Distance 기능은 업힐과 다운힐 샷을 고려한 높낮이 보정거리를 제공하므로 코스에 거리 정보에 대한 가장 정확한 정보를 얻을 수 있습니다.<br><br>향상된<br>고도 변화와 환경 조건에 맞게 보정된 거리 정보로 각 샷을 실제로 얼마나 멀리 보내야 하는지 알 수 있습니다."},
            {"keys":"plays_like_pro","img":"","title":"향상된 PlaysLike Distance 기능","desc":"고도 변화와 환경 조건에 맞게 보정된 거리 정보로 각 샷을 실제로 얼마나 멀리 보내야 하는지 알 수 있습니다."},
            {"keys":"preloaded_courses","img":"","title":"내장 골프 코스","desc":"이 스마트워치에는 41,000개 이상의 전 세계 골프 코스가 내장되어 있으며 최신 코스 정보로 업데이트할 수 있습니다."},
            {"keys":"pulse_ox","img":"","title":"Pulse Ox","desc":"이 스마트워치(밴드)는 펄스 옥시미터에서 손목으로 불빛 신호를 보내서 신체가 산소를 흡수하는 능력을 측정합니다."},
            {"keys":"race_widget","img":"","title":"레이스 도구","desc":"이 스마트워치는 현재의 신체 상태와 경로에 따라서 레이스 목표 시간 예측과 훈련 조언을 제공할 수 있습니다."},
            {"keys":"real_time_stamina","img":"","title":"실시간 체력","desc":"이 스마트워치는 스포츠의 현 물리 상태를 제공하고, 체력 회복 상한을 관찰하고, 속도와 노력 수준을 미세 조율할 수 있습니다. 장거리 레이스에서 이 스마트워치는 운동선수가 격렬한 신체 운동/회복의 수준을 이해 및 구성하여 결승선에 도달하기 전에 에너지가 고갈되거나 에너지가 남아 있는데도 최고의 결과를 달성하지 못하는 일이 발생하지 않도록 돕습니다."},
            {"keys":"recreational_dive","img":"","title":"레크리에이션 다이빙","desc":"스쿠버 및 무호흡 다이빙 활동을 지원하는 40m 다이빙 등급과 누수방지 금속 버튼을 통해 물 속 더 깊은 곳까지 도달할 수 있습니다."},
            {"keys":"revodrive","img":"","title":"내충격성 자동 교정 시계바늘","desc":"다양한 모터로부터 동력을 공급받고, 정밀한 마이크로프로세서 및 명암 센서 기술이 결합되어 있고, GPS 위성 위치 표시 기능이 탑재되어있어 정밀한 현지 시각과 시계바늘 위치 자동 감지 및 교정 기능을 제공합니다. 아웃도어 어드밴처 시나리오에서 격렬한 충격이 발생한 경우 시계바늘이 즉시 정확한 위치로 교정되어 기계식 워치처럼 정확한 시간을 제공하고 짜릿한 모험의 매 순간을 동기화합니다."},
            {"keys":"sleep","img":"","title":"수면 추적","desc":"수면 중 이 스마트워치(밴드)를 착용하고 있으면 선잠, 숙면, REM 수면 단계를 완벽하게 분석하는 데 도움이 될 수 있습니다."},
            {"keys":"sleep_coach","img":"","title":"수면 코치","desc":"하루 활동, 낮잠, 수면 기록을 기반으로 수면에 대한 지표와 인사이트를 받을 수 있습니다."},
            {"keys":"smallest","img":"","title":"미니 워치 케이스, 단 35mm","desc":"직경이 35mm에 불과한 가벼운 초소형 워치 케이스 덕분에 시선을 사로잡는 외관이 아니었다면 손목에 있다는 것조차 잊게 될 수 있었을 것입니다."},
            {"keys":"solar","img":"","title":"태양광 충전","desc":"이 스마트워치는 태양 에너지를 배터리 전력으로 변환합니다. 햇빛(50,000 lux)만 있으면 배터리 수명이나 충전에 대해서 걱정하지 않으면서 좋아하는 활동을 계속해서 즐길 수 있습니다."},
            {"keys":"stress","img":"","title":"스트레스 추적","desc":"나의 하루 중 스트레스가 얼마나 많았는지, 현재 휴식이 필요한 상태인지 확인 해 보십시오."},
            {"keys":"subwave","img":"","title":"Subwave 소나 네트워킹","desc":"10미터 범위 안에서 최대 8명의 다이버 간에 다이빙 탱크 압력, 수심, 거리를 모니터링하고 최대 30미터까지 사전 설정된 메시지를 교환할 수 있습니다. (*메시지 전송 기능은 소프트웨어 업데이트를 통해 곧 출시 예정입니다.)"},
            {"keys":"surface_multi_gnss","img":"","title":"자동 서피스 다이브 위치 선정","desc":"이 스마트워치는 각 다이빙의 입수 지점과 출수 지점을 빠르고 정확하게 기록하기 위해서 GPS/GLONASS/Galileo 삼중 위성 위치 확인을 지원합니다."},
            {"keys":"surfing","img":"","title":"다양한 내장 서핑 모드","desc":"이 스마트워치는 최신 바다 상태 정보를 제공할 수 있을뿐만 아니라 서핑, 윈드서핑, 카이트서핑을 위한 독자적인 워터스포츠 프로파일도 내장되어 있어서 완벽한 파도를 정확하게 탈 수 있게 돕습니다."},
            {"keys":"titanium_watch_case","img":"","title":"티타늄 베젤 탑재","desc":"이 스마트워치는 가벼운 티타늄 베젤이 특징입니다."},
            {"keys":"trac_back","img":"","title":"TracBack","desc":"이 스마트워치는 동일한 경로에서 출발점으로 복귀하게 돕는 TracBack 기능을 지원하므로 왕복 여행에서 출발지로 돌아오는 길을 추측할 필요가 없습니다."},
            {"keys":"training_effect","img":"","title":"훈련 효과","desc":"훈련 효과를 통해 체력에 운동이 어떤 영향을 미쳤는지 확인하고 훈련과 운동의 주요 이점을 파악하세요."},
            {"keys":"training_readiness","img":"","title":"트레이닝 준비 상태","desc":"이 스마트워치는 1주일간 수면의 질과 HRV, 스트레스, 일일 훈련 부하를 평가할 수 있으므로 사용자가 이 수치를 점검하여 신체가 고강도 훈련에 적합한 상태인지를 빠르게 평가할 수 있습니다."},
            {"keys":"training_status","img":"","title":"훈련 상태","desc":"이 스마트워치는 체력 수준을 반영하는 핵심 데이터 지표인 VO2 Max를 자동으로 감지해 훈련 부하를 수량화합니다. 그러므로 사용자는 최적의 레이싱 조건에서 어떤 종류의 훈련에 집중해야 하는지를 확실하게 이해할 수 있으며, 현재 훈련 강도를 확인하면서 최고의 경쟁 조건이 만들어졌는지 아니면 조정해야 하는지 판단할 수도 있습니다."},
            {"keys":"triathlon","img":"","title":"트라이애슬론 워치","desc":"이 스마트워치는 트라이애슬론 이벤트를 지원하므로 트라이애슬론을 완주할 때 버튼 하나로 스포츠를 빠르게 전환할 수 있습니다."},
            {"keys":"unlimited_battery_life","img":"","title":"무한 전력 태양광 충전 렌즈","desc":"이 스마트워치에는 워치의 배터리 수명을 연장하고 절전 모드에서 배터리 수명을 확보할 수 있는 Power Glass 태양광 충전 워치 렌즈가 장착되어 있습니다."},
            {"keys":"voice","img":"","title":"손목 음성 통화","desc":"이 스마트워치는 호환되는 스마트폰과 페어링하여 워치에서 전화를 걸고 받을 수 있습니다."},
            {"keys":"voice_command","img":"","title":"음성 명령","desc":"스마트폰과 페어링하여 워치로 전화를 걸고 받아 보십시오. 그리고, 무선 음성 명령으로 워치를 컨트롤하고 스마트폰의 음성 지원을 사용하여 문자 메시지 응답 등의 다양한 활동을 수행할 수 있습니."},
            {"keys":"wind_speed","img":"","title":"풍속과 풍향","desc":"이 스마트워치는 어떤 클럽을 사용해 어떤 방향으로 스윙할지를 더 쉽고 효율적으로 판단할 수 있도록 풍속과 풍향을 제공합니다."},
            {"keys":"wireless_charging","img":"","title":"무선 충전","desc":"이 스마트워치는 무선 충전을 지원하며 Qi 인증 무선 충전기와 호환됩니다."},
            {"keys":"workout_benefit","img":"","title":"운동 효율 및 회복 시간 제공","desc":"오늘 한 운동의 효율과 필요한 회복 시간을 한눈에 확인할 수 있습니다."},
            {"keys":"stainless_steel_watch_case","img":"","title":"스테인리스 스틸 베젤 탑재","desc":"이 스마트워치는 내구성이 뛰어난 스테인리스 스틸 베젤을 특징으로 합니다."}
        ]
};