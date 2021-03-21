module.exports = function () {  
  
  PERMISSIONS = {
    NONE: 0,
    RDJ: 1,
    RDJ_PLUS: 1.5,
    BOUNCER: 2,
    BOUNCER_PLUS: 2.5,
    MANAGER: 3,
    COHOST: 4,
    HOST: 5,
  };  

  SETTING_NAMES = {
    autoskip: "Autoskip",
    timeguard: "Timeguard",
    maxdctime: "DC Protection Time",
    maxsonglength: "Max Song Length",
    maxdjidletime: "Max DJ Idle Time",
    djidleminqueue: "DJ Idle Min Queue",
    djcyclemaxqueue: "DJ Cycle Max Queue",
    lockdown: "Lockdown Mode",
    cleverbot: "Cleverbot",
    rdjplus: "RDJ+ Mode",
    bouncerplus: "Bouncer+ Mode",
  };

  ISO_LANGUAGES = {
    af: "Afrikkans",
    ar: "Arabic",
    be: "Belarusian",
    bg: "Bulgarian",
    ca: "Catalan",
    cs: "Czech",
    da: "Danish",
    de: "German",
    el: "Greek",
    en: "English",
    es: "Spanish",
    et: "Estonian",
    eu: "Basque",
    fa: "Farsi",
    fi: "Finnish",
    fo: "Faeroese",
    fr: "French",
    ga: "Irish",
    gd: "Gaelic",
    hi: "Hindi",
    hr: "Croatian",
    hu: "Hungarian",
    id: "Indonesian",
    is: "Icelandic",
    it: "Italian",
    ja: "Japanese",
    ji: "Yiddish",
    ko: "Korean",
    ku: "Kurdish",
    lt: "Lithuanian",
    lv: "Latvian",
    mk: "Macedonian",
    ml: "Malayalam",
    ms: "Malasian",
    mt: "Maltese",
    nl: "Dutch",
    nb: "Norwegian",
    no: "Norwegian",
    pa: "Punjabi",
    pl: "Polish",
    pt: "Portuguese",
    rm: "Rhaeto-Romanic",
    ro: "Romanian",
    ru: "Russian",
    sb: "Sorbian",
    sk: "Slovak",
    sl: "Slovenian",
    sq: "Albanian",
    sr: "Serbian",
    sv: "Swedish",
    th: "Thai",
    tn: "Tswana",
    tr: "Turkish",
    ts: "Tsonga",
    uk: "Ukranian",
    ur: "Urdu",
    ve: "Venda",
    vi: "Vietnamese",
    xh: "Xhosa",
    zh: "Chinese",
    zu: "Zulu",
  };

  settings = {
    autoskip: false,
    timeguard: false,
    maxdctime: 15 * 60,
    maxsonglength: config.queue.maxSongLengthSecs,
    maxdjidletime: config.queue.djIdleAfterMins * 60,
    djidle: false,
    djidleminqueue: config.queue.djIdleMinQueueLengthToEnforce,
    djcyclemaxqueue: config.queue.djCycleMaxQueueLength,
    lockdown: false,
    cleverbot: false,
    rdjplus: false,
    bouncerplus: false,
  };

  uptime = new Date();
  lastRpcMessage = new Date();


  /**
 * Set default time thresholds for moment
 * (round up a little less aggressively)
 */
  moment.relativeTimeThreshold("s", 55);
  moment.relativeTimeThreshold("m", 90);
  moment.relativeTimeThreshold("h", 24);
  moment.relativeTimeThreshold("d", 30);
  moment.relativeTimeThreshold("M", 12);

  startupTimestamp = moment.utc().toDate();

};
