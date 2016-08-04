var fl = {
	'bird':['mouse','hamster','rabbit','herb','deciduous','evergreen','chestnut','corn','rice','cactus','flower','cherry','bug','ant','ladybug','spider'],//may wanna split this up later depending on diet
    'mouse': ['chestnut', 'corn', 'rice', 'evergreen', 'deciduous', 'herb', 'palm', 'cactus', 'flower', 'cherry', 'sunflower', 'blossom', 'bug', 'ant', 'ladybug', 'spider', 'maple'],
    'cow': ['grass', 'blossom', 'tulip', 'whiteflower', 'flower', 'herb'],
    'tiger': ['cow', 'monkey', 'mouse', 'dog', 'pig', 'rabbit', 'cat', 'horse', 'hamster', 'wolf','bird'],
    'monkey': ['corn', 'rice', 'deciduous', 'herb', 'palm', 'flower', 'cherry', 'mouse', 'hamster', 'frog', 'pig', 'bug', 'ant','bird'],
    'dog': ['hamster', 'mouse', 'pig', 'frog', 'rabbit', 'cat','bird'],
    'pig': ['bug', 'ant', 'bee', 'grass', 'cherry', 'deciduous', 'spider', 'mouse', 'herb', 'rice', 'corn', 'blossom', 'chestnut'],
    'frog': ['bug', 'ant', 'bee', 'ladybug', 'spider'],
    'rabbit': ['grass', 'herb', 'cherry', 'sunflower', 'deciduous', 'herb', 'chestnut', 'maple', 'whiteflower', 'flower'],
    'cat': ['mouse', 'hamster', 'pig','bird'],
    'dragon': ['mouse', 'cow', 'tiger', 'monkey', 'dog', 'pig', 'frog', 'rabbit', 'cat', 'horse', 'hamster', 'wolf', 'bear', 'panda','bird'],
    'horse': ['grass', 'herb', 'deciduous', 'evergreen', 'tulip', 'blossom', 'whiteflower', 'flower', 'corn', 'rice', 'palm'],
    'hamster': ['chestnut', 'blossom', 'maple', 'herb', 'palm', 'deciduous', 'flower'],
    'wolf': ['rabbit','mouse','hamster','horse','cow','pig','cat','bird'],
    'bear': ['rabbit','mouse','hamster','horse','pig','cow','cat','dog','cat','chestnut','corn','cherry','herb','rice','flower','ant'],
    'panda': ['grass'],//interesting fact: bamboo is a grass!
    'bug': ['chestnut','deciduous','cherry','corn','rice','ant','flower','grass','herb','bee','spider','ladybug'],
    'ant': ['bug','cherry','corn','rice','herb','bee','spider','ladybug','chestnut'],
    'bee': ['flower','whiteflower','herb','deciduous','evergreen'],
    'ladybug': ['ant','bug','spider'],
    'spider': ['ant','bug','ladybug','bee']
};
//speed is in km/h
var orgStats = {
	'bird': {
        img: 'SLASHuD83DSLASHuDC26',
        speed:36,
        gestation:21,
        timeToMature:104,
        type: 'omni'
    },
    'mouse': {
        img: 'SLASHuD83DSLASHuDC01',
        speed:1,
        gestation:20,
        timeToMature:2,
        type: 'omni'
    },
    'cow': {
        img: 'SLASHuD83DSLASHuDC04',
        speed:40,
        gestation:284,
        timeToMature:676,
        type: 'herbi'
    },
    'tiger': {
        img: 'SLASHuD83DSLASHuDC05',
        speed:56,
        gestation:102,
        timeToMature:156,
        type: 'pred'
    },
    'monkey': {
        img: 'SLASHuD83DSLASHuDC12',
        speed:56,
        gestation:175,
        timeToMature:156,
        type: 'omni'
    },
    'dog': {
        img: 'SLASHuD83DSLASHuDC15',
        speed:40,
        gestation:63,
        timeToMature:104,
        type: 'pred'
    },
    'pig': {
        img: 'SLASHuD83DSLASHuDC16',
        speed:17,
        gestation:115,
        timeToMature:30,
        type: 'omni'
    },
    'frog': {
        img: 'SLASHuD83DSLASHuDC38',
        speed:17,
        gestation:21,
        timeToMature:52,
        type: 'pred'
    },
    'rabbit': {
        img: 'SLASHuD83DSLASHuDC07',
        speed:48,
        gestation:30,
        timeToMature:25,
        type: 'herbi'
    },
    'cat': {
        img: 'SLASHuD83DSLASHuDC08',
        speed:48,
        gestation:50,
        timeToMature:40,
        type: 'pred'
    },
    'dragon': {
        img: 'SLASHuD83DSLASHuDC09',
        speed:108,
        gestation:390,
        timeToMature:780,
        type: 'pred'
    },
    'horse': {
        img: 'SLASHuD83DSLASHuDC0E',
        speed:48,
        gestation:340,
        timeToMature:65,
        type: 'herbi'
    },
    'hamster': {
        img: 'SLASHuD83DSLASHuDC39',
        speed:4,
        gestation:22,
        timeToMature:5,
        type: 'omni'
    },
    'wolf': {
        img: 'SLASHuD83DSLASHuDC3A',
        speed:65,
        gestation:68,
        timeToMature:156,
        type: 'pred'
    },
    'bear': {
        img: 'SLASHuD83DSLASHuDC3B',
        speed:56,
        gestation:215,
        timeToMature:208,
        type: 'omni'
    },
    'panda': {
        img: 'SLASHuD83DSLASHuDC3C',
        speed:32,
        gestation:127,
        timeToMature:312,
        type: 'herbi'
    },
    'bug': {
        img: 'SLASHuD83DSLASHuDC1B',
        speed:1,
        gestation:10,
        timeToMature:5,
        type: 'omni'
    },
    'ant': {
        img: 'SLASHuD83DSLASHuDC1C',
        speed:1,
        gestation:10,
        timeToMature:5,
        type: 'omni'
    },
    'bee': {
        img: 'SLASHuD83DSLASHuDC1D',
        speed:24,
        gestation:10,
        timeToMature:5,
        type: 'herbi'
    },
    'ladybug': {
        img: 'SLASHuD83DSLASHuDC1E',
        speed:59,
        gestation:15,
        timeToMature:5,
        type: 'pred'
    },
    'spider': {
        img: 'SLASHuD83DSLASHuDD77',
        speed:2,
        gestation:21,
        timeToMature:5,
        type: 'pred'
    },
    'chestnut': {
        img: 'SLASHuD83CSLASHuDF30',
        gestation:10,
        timeToMature:208,
        type: 'prod'
    },
    'corn': {
        img: 'SLASHuD83CSLASHuDF3D',
        gestation:10,
        timeToMature:11,
        type: 'prod'
    },
    'rice': {
        img: 'SLASHuD83CSLASHuDF3E',
        gestation:10,
        timeToMature:16,
        type: 'prod'
    },
    'herb': {
        img: 'SLASHuD83CSLASHuDF3F',
        gestation:10,
        timeToMature:10,
        type: 'prod'
    },
    'maple': {
        img: 'SLASHuD83CSLASHuDF41',
        gestation:10,
        timeToMature:208,
        type: 'prod'
    },
    'cactus': {
        img: 'SLASHuD83CSLASHuDF35',
        gestation:10,
        timeToMature:208,
        type: 'prod'
    },
    'evergreen': {
        img: 'SLASHuD83CSLASHuDF32',
        gestation:10,
        timeToMature:208,
        type: 'prod'
    },
    'deciduous': {
        img: 'SLASHuD83CSLASHuDF33',
        gestation:10,
        timeToMature:208,
        type: 'prod'
    },
    'palm': {
        img: 'SLASHuD83CSLASHuDF34',
        gestation:10,
        timeToMature:364,
        type: 'prod'
    },
    'flower': {
        img: 'SLASHu2698',
        gestation:10,
        timeToMature:7,
        type: 'prod'
    },
    'whiteflower': {
        img: 'SLASHu2740',
        gestation:10,
        timeToMature:7,
        type: 'prod'
    },
    'tulip': {
        img: 'SLASHuD83CSLASHuDF37',
        gestation:10,
        timeToMature:7,
        type: 'prod'
    },
    'cherry': {
        img: 'SLASHuD83CSLASHuDF52',
        gestation:10,
        timeToMature:104,
        type: 'prod'
    },
    'sunflower': {
        img: 'SLASHuD83CSLASHuDF3B',
        gestation:10,
        timeToMature:7,
        type: 'prod'
    },
    'blossom': {
        img: 'SLASHuD83CSLASHuDF3C',
        gestation:10,
        timeToMature:7,
        type: 'prod'
    },
    'grass': {
        img: '|',
        gestation:10,
        timeToMature:2,
        type: 'prod'
    }
};
// NOTE: dragon times are based on similar sized animals. Rhinos and Whales all seem to have gestation periods in the range of 14-19 months. However, Dinosaurs are known (based on bone morphology) to have particularly fast growth rates. I'm merely extending this into the egg phase. Nevertheless, we're talking about a large animal, so it has the largest gestation period. As far as top speed, I'm basing this on Quetzalcoatlus northropi, the largest flying reptile of all time.
var testPics = function(){
	var names = Object.keys(orgStats);
	for (var n in orgStats){
		console.log(n,orgStats[n].img.replace(/s/g,'\\'));
	}
};
/*ORGS:
    mouse
    cow
    tiger
    monkey
    dog
    pig
    frog
    rabbit
    cat
    dragon
    horse
    hamster
    wolf
    bear
    panda
    bug
    ant
    bee
    ladybug
    spider
    chestnut
    corn
    rice
    herb
    maple
    cactus
    evergreen
    deciduous
    palm
    flower
    whiteflower
    tulip
    cherry
    sunflower
    blossom
    grass (ꔖ)
    */
