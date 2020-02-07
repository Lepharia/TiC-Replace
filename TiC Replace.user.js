// ==UserScript==
// @name            TiC Replace_beta
// @namespace       tag:dennis.bonnmann@materna.de
// @author          Dennis Bonnmann (dennis.bonnmann@materna.de)
// @version         0.8.2
// @include         https://myintranet.materna.de/tic/*
// @include         https://extranet.materna.de/*/tic/*
// @exclude         https://myintranet.materna.de/tic/report*
// @exclude         https://myintranet.materna.de/tic/selectProject*
// @exclude         https://extranet.materna.de/*/tic/report*
// @exclude         https://extranet.materna.de/*/tic/selectProject*
// @grant           GM_addStyle
// ==/UserScript==



/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement('TD');
zNode.innerHTML =
    '<td>' +
        '<div id="div_TicReplace">' +
            '<div class="caption ticreplace">' +
                '- TiC Replace -' +
            '</div>' +
            '<div id="bt_Strip" class="tm_button ticreplace">' +
                'Sonderzeichen entfernen<br>(STRG+ALT+S)' +
            '</div>' +
            '<div id="bt_Replace" class="tm_button ticreplace">' +
                'Abkürzungen auflösen<br>(STRG+ALT+R)' +
            '</div>' +
        '</div>' + 
    '</td>';
zNode.setAttribute('id', 'td_TicReplace');
var menu = document.getElementsByClassName("actions")[0];
menu.insertAdjacentElement("afterend",zNode);

//--- Style our newly added elements using CSS.
GM_addStyle(multilineStr(function () {/*!
    #td_TicReplace{
    }
    #div_TicReplace {
        opacity:                0.9;
        z-index:                1100;
        margin-bottom:          6px;
        padding:                5px;
        padding-top:            10px;
        padding-bottom:         10px;
        border:                 2px solid rgb(15,44,68);
    }
    .ticreplace {
        font-family:            Calibri !important;
        font-size:              18px !important;
        text-align:             center;
        font-weight:            bold;
        color:                  rgb(15,44,68);
    }
    .tm_button {
        cursor:                 pointer;
        margin:                 5px;
        padding:                5px;
        font-size:              13px !important;
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
        margin-bottom:          11px;
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

//CTRL + ALT + D
$('textarea').keyup(function (e) {
    if (e.ctrlKey && e.altKey && (e.keyCode == 68)) {
        /*bt_stripClick(null);*/
        var $t = $(this);
        insertAtCursor(this, '[d][/d]');
        };
    });

//CTRL + ALT + A
$('textarea').keyup(function (e) {
    if (e.ctrlKey && e.altKey && (e.keyCode == 65)) {
        /*bt_stripClick(null);*/
        var $t = $(this);
        insertAtCursor(this, '[e][/e]');
        };
    });

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
    tr_replace(/\\Ass/,  "Erfassen von Asset");
    tr_replace(/\\Kot/,  "Aufstellen eines Konftels");
    tr_replace(/\\Inc/,  "Ticketbearbeitung:");
    tr_replace(/\\Win/,  "Windows-Client");
    tr_replace(/\\VM/,   "VM Bereitstellung");
    tr_replace(/\\VI/,   "Virtuelle Infrastruktur");
    tr_replace(/\*E\*/,  "Einarbeitung in");
    tr_replace(/\\Dxu/,  "[e]NAME[/e] - Neuinstallation von PC Arbeitsplatz[d] RECHNERNAME[/d] über DX-Union");
    tr_replace(/\\Mull/, "Aussonderung von Altrechner[d] RECHNERNAME[/d]");
    tr_replace(/\\Kl/,   "Klausurvorbereitung im Fach");
    tr_replace(/\\Vid/,  "Anschauen eines Lehrvideos");
    tr_replace(/\\PS/,   "Übung in PowerShell");
    tr_replace(/\\Py/,   "Übung in Python");
    /************\
     * Meetings *
    \************/
    tr_replace(/\\JFI/, "Teammeeting IT-Infrastructure");
    tr_replace(/\\JFF/, "Teammeeting IT-Frontoffice");
    tr_replace(/\\JFB/, "Teammeeting IT-Backoffice");
    tr_replace(/\\ABT/, "Abteilungsmeeting[d] ZE MS Operations[/d]");
    tr_replace(/\\BV/, "Betriebsversammlung");
    tr_replace(/\\INFO/, "Infoveranstaltung der Geschäftsführung");
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
    tr_replace(/\\GOV/, "BL Government");
    tr_replace(/\\ITF/, "BL IT-Factory");
    tr_replace(/\\MOB/, "BL Mobility");
    /**********************\
     * Zentrale Einheiten *
    \**********************/
    tr_replace(/\\OPS/,  "ZE MS Operations");
    tr_replace(/\\MS/,   "ZE MS Managed Services");
    tr_replace(/\\CS/,   "ZE Central Sales");
    tr_replace(/\\MAR/,  "ZE Marketing & Communications");
    tr_replace(/\\SD/,   "ZE Shared Delivery Services");
    tr_replace(/\\CD/,   "ZE Corporate Development");
    tr_replace(/\\HR/,   "MGS Human Resources");
    tr_replace(/\\CON/,  "MGS Controlling");
    tr_replace(/\\FIBU/, "MGS Finanzbuchhaltung");
    tr_replace(/\\FAC/,  "MGS Facility Management");
    tr_replace(/\\ES/,   "MGS Enterprise Services");
    tr_replace(/\\LEG/,  "MGS Legal Department");
    /**********************\
     * Andere Abkürzungen *
    \**********************/
    tr_replace(/\\GST/, "Geschäftsstelle");
    tr_replace(/\\BS/,  "Berufsschule");
    tr_replace(/\\BBE/,  "[e][/e]");
    tr_replace(/\\BBD/,  "[d][/d]");
}

/**
 * Function that is called when bt_strip is clicked. Removes special caracters used in my RegEx in TiC2Wb
 */
function bt_stripClick(zEvent) {
    tr_replace(/\*/, "");
    tr_replace(/\_/, "");
    tr_replace(/\#/, "");
    tr_replace(/\[e\]/, "");
    tr_replace(/\[\/e\]/, "");
    tr_replace(/\[d\]/, "");
    tr_replace(/\[\/d\]/, "");
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}
