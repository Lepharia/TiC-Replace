// ==UserScript==
// @name            TiC Replace
// @namespace       tag:dennis.bonnmann@materna.de
// @author          Dennis Bonnmann (dennis.bonnmann@materna.de)
// @version         0.5.2
// @include         https://myintranet.materna.de/tic/*
// @include         https://extranet.materna.de/*/tic/*
// @exclude         https://myintranet.materna.de/tic/report*
// @grant           GM_addStyle
// ==/UserScript==



/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement('div');
zNode.innerHTML =
    '<div class="caption">' +
        '- TiC Replace -' +
    '</div>' +
    '<div id="bt_Strip" class="tm_button">' +
        'Sonderzeichen entfernen<br>(STRG+ALT+S)' +
    '</div>' +
    '<div id="bt_Replace" class="tm_button">' +
        'Abkürzungen auflösen<br>(STRG+ALT+R)' +
    '</div>';
zNode.setAttribute('id', 'div_TicReplace');
document.body.appendChild(zNode);

//--- Style our newly added elements using CSS.
GM_addStyle(multilineStr(function () {/*!
    #div_TicReplace {
        position:               absolute;
        top:                    188px;
        right:                  750px;
        height:                 177px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px;
        padding-top:            10px;
        padding-bottom:         10px;
        font-family:            Calibri;
        font-size:              18px;
        text-align:             center;
        font-weight:            bold;
        border:                 2px solid rgb(15,44,68);
        color:                  rgb(15,44,68);
    }
    .tm_button {
        cursor:                 pointer;
        margin:                 5px;
        padding:                5px;
        font-size:              13px;
        background-color:       rgb(220,62,24);
        color:                  white;
        font-weight:            normal;
        border:                 2px  solid white;
    }
    .tm_button:hover{
        background-color:       rgb(88,88,88);
        text-decoration:        underline;
    }
    div.caption{
        margin-bottom:          25px;
    }
*/
}));

function multilineStr(dummyFunc) {
    var str = dummyFunc.toString();
    str     = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace(/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace(/\/\/.+$/gm, ''); // Double-slash comments wreck CSS. Strip them.
    return str;
}

/**Handler for button bt_Replace**/
document.getElementById("bt_Replace").addEventListener(
    "click",
    bt_replaceClick,
    false
);

/**Handler for button bt_Strip**/
document.getElementById("bt_Strip").addEventListener(
    "click",
    bt_stripClick,
    false
);

/**Define handler for Hotkeys**/
document.addEventListener('keyup', doc_keyUp, false);

/**Implements the handler for hotkeys. Stripping is triggered by CTRL+ALT+S, Replace by CTRL+ALT+R**/
function doc_keyUp(e) {
    
    // CTRL + ALT + S
    if (e.ctrlKey && e.altKey && (e.keyCode == 83)) {
        bt_stripClick(null);
    }
    
    //CTRL + ALT + R
    if (e.ctrlKey && e.altKey && (e.keyCode == 82)) {
        bt_replaceClick(null);
    }
}

/**
 * Queries the page for textareas and replaces every occurrence of a string with another
 *
 * @param originalString - the String to be replaced
 * @param replaceString - the replacement String
 */
function tr_replace(originalString, replaceString) {
    var textNodes = document.evaluate("//TEXTAREA", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var length = textNodes.snapshotLength;
    var searchRE = new RegExp(originalString, 'gi');
    var i;
    for (i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        node.value = node.value.replace(searchRE, replaceString);
    }
}

/**
 * Function that is called when bt_replace is clicked. Calls many instances of tr_replace to resolve shorthand for school subjects, business lines and other things
 */
function bt_replaceClick(zEvent) {
    /*******************\
     * Routineaufgaben *
    \*******************/
    tr_replace(/\\Ass/, "Erfassen von Asset");
    tr_replace(/\\Kot/, "Aufstellen eines Konftels");
    tr_replace(/\\Inc/, "Bearbeitung von Ticket");
    /***************\
     * Schulfächer *
    \***************/
    tr_replace(/\\E/,   "Englisch");
    tr_replace(/\\ITS/, "IT-Systeme");
    tr_replace(/\\WG/,  "Wirtschaft und Geschäftsprozesse");
    tr_replace(/\\PGL/, "Politik und Gesellschaftslehre");
    tr_replace(/\\DK/,  "Deutsch\/Kommunikation");
    tr_replace(/\\AE/,  "IT-Anwendungsentwicklung");
    /******************\
     * Business Lines *
    \******************/
    tr_replace(/\\COM/, "BL Communications");
    tr_replace(/\\DE/,  "BL Digital Enterprise");
    tr_replace(/\\GOV/,  "BL Government");
    tr_replace(/\\ITF/, "BL IT-Factory");
    tr_replace(/\\MOB/, "BL Mobility");
    /**********************\
     * Zentrale Einheiten *
    \**********************/
    tr_replace(/\\OPS/, "ZE MS Operations");
    /**********************\
     * Andere Abkürzungen *
    \**********************/
    tr_replace(/\\GST/, "Geschäftsstelle");
    tr_replace(/\\BS/,  "Berufsschule");
}

/**
 * Function that is called when bt_strip is clicked. Removes special caracters used in my RegEx in TiC2Wb
 */
function bt_stripClick(zEvent) {
    tr_replace(/\*/, "");
    tr_replace(/\_/, "");
    tr_replace(/\#/, "");
}