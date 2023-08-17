const cities = [
  {
    label: "Sialkot",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Chawinda",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Sambrial",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Bhilo mahar",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Bhopalwala",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Head marala",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Kingra",
    value: "SKT",
    isActive: true,
  },
  {
    label: "Faisalabad",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Chak jhumra",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Painsara",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Jaranwala",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Satiana",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Khurrianwala",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Thikriwala",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Aminpur bangla",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Jhapaal",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Khakoana",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Makoo ana",
    value: "LYP",
    isActive: true,
  },
  {
    label: "Gujranwala",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Kamoki",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Nowshera Virkan",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Gakhar",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Qila Didar Singh",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Ali Pur Chattha",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Sharjah City",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Wazirabad",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Eminabad More",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Nandipur",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Rahwali",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Aroop",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Attawa",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Ghakkhar Mandi",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Klaskey",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Tatlaywali",
    value: "GUJ",
    isActive: true,
  },
  {
    label: "Karachi",
    value: "KHI",
    isActive: true,
  },
  {
    label: "Multan",
    value: "MUX",
    isActive: true,
  },
  {
    label: "Basti Arain",
    value: "MUX",
    isActive: true,
  },
  {
    label: "Basti Nandla ",
    value: "MUX",
    isActive: true,
  },
  {
    label: "Basti Allah Bakhsh",
    value: "MUX",
    isActive: true,
  },
  {
    label: "Qadirabad",
    value: "MUX",
    isActive: true,
  },
  {
    label: "Peshawar",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Murad Abad",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Hayatabad",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Badabher ",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Shahkas ",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Wapda Town",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Ashab Baba",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Aslam Dehri ",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Peer Bala ",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Matra ",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Duran Pur",
    value: "PEW",
    isActive: true,
  },
  {
    label: "Wah Cantt.",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Taxila",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Lalarukh",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Godwal",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Kohistan Enclave",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Hassan Abdal",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Booti Morr",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Afghan Basti",
    value: "WAH",
    isActive: true,
  },
  {
    label: "Rawalpindi",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Gujjar Khan",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Kallar Syedan",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Kahuta",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Mandra",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Sagri",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Choa khalsa",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Doltalla",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Loni Sihaal",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Numb",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Mankiala",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Treel",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Moreed",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Sakhi Sabwari Muhalla",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Bhewal",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Jatli",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Qazian",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Badana",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Sir Suba Shah",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Islampura",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Sukho",
    value: "RWP",
    isActive: true,
  },
  {
    label: "Islamabad",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Bara Kahu",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Tarnol",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Chak Shehzad",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Rawat",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Tarlai Kalan",
    value: "ISB",
    isActive: true,
  },
  {
    label: "Lahore",
    value: "LHE",
    isActive: true,
  },
  {
    label: "Shahdara",
    value: "LHE",
    isActive: true,
  },
  {
    label: "Bhikki",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Chandi Kot",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Farooqabad",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Ferozewatwan",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Jaslani more",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Kot Pind Das",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Kot Ranjeet",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Machikey",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Nabi pura",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Nawan Kot",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Panawan",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Rehman pura",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Sheikhupura",
    value: "SKP",
    isActive: true,
  },
  {
    label: "Gujrat",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Jalal Pur Jattan",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Sook Kalan",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Moin Un Din Pur Syedian",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Beo Wali Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Shadiwal Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Saroki Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Herriawala",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Banth Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Kathala Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Gorali Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Gorala Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Kalra Panniun",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Kalra Khasa",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Adowal Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Madina Syedian",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Jamaal Pur Syedian",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Nathowal Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Deewana Mandi",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Naseeba Abad",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Village Trikha",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Deero Kuna Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Udowal Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Sheikh Sukha",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Loraye Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Village Maroof",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Village Chukana Wali",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Village Goraya",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Boken More Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Gandra Village",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Shah Jahnian",
    value: "GRT",
    isActive: true,
  },
  {
    label: "Kotla Arab Ali Khan",
    value: "GRT",
    isActive: true,
  },
];

module.exports = cities;
