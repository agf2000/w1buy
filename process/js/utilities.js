var my = {}; //my namespace

/* remove border around all input elements */
if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
    $(window).load(function () {
        $('input:-webkit-autofill').each(function () {
            var text = $(this).val();
            var id = $(this).attr('id');
            $(this).after(this.outerHTML).remove();
            $('input[id=' + id + ']').val(text);
        });
    });
}

my.isNumberKey = function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 43 || charCode > 57))
        return false;

    return true;
};

my.isValidEmailAddress = function (emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

my.formatPhone = function (phonenum) {
    //return text.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{2})\)?[-. ]?)?([0-9]{4})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) {
            phone += "(" + parts[1] + ") ";
        }
        phone += parts[2] + "-" + parts[3];
        return phone;
    } else {
        //invalid phone number
        return phonenum;
    }
};

my.encodeSlash = function (str) {
    var urlEncodeForwardSlashedRegExp = new RegExp("/", "gi");
    str = str.replace(urlEncodeForwardSlashedRegExp, "%2F");
    return str;
};

my.getQuerystring = function (key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
};

my.getStringParameterByName = function (name) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return sURL.split(name + '/')[1];
    } else {
        return '';
    }
};

my.getParameterByName = function (name) {
    var sURL = window.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return parseInt(sURL.split(name + '/')[1]);
    } else {
        return 0;
    }
};

my.getTopParameterByName = function (name) {
    var sURL = window.top.document.URL.toString();
    if (sURL.indexOf(name) > -1) {
        return parseInt(sURL.split(name + '/')[1]);
    } else {
        return 0;
    }
};

my.getHashValue = function (key) {
    if (typeof key !== 'string') {
        key = '';
    } else {
        key = key.toLowerCase();
    }

    var keyAndHash = location.hash.toLowerCase().match(new RegExp(key + '=([^&]*)'));
    var value = '';

    if (keyAndHash) {
        value = keyAndHash[1];
    }

    return value;
};

/**
 * Formatters
 */

/**
 * Format postal code
 */

my.formatPostalcode = function (pcode) {
    var regexObj = /^\d{5}$|^\d{5}\-\d{}$/;
    if (regexObj.test(parseInt(pcode))) {
        var parts = pcode.match(regexObj);
        var pc = parts[1] + " " + parts[3];
        return pc.toUpperCase();
    } else {
        return pcode;
    }
};

/**
 * Format currency
 */

my.formatCurrency = function (value) {
    return "R$ " + value.toFixed(2);
};

/**
 * Format percent
 */

my.formatPercent = function (value) {
    return value.toFixed(2) + ' %';
};

/**
 * Format file sizes
 */

my.size_format = function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[[i]];
};

/**
 * Maths
 */

my.pmt = function (rate, per, nper, pv, fv) {

    fv = parseFloat(fv);

    nper = parseFloat(nper);

    pv = parseFloat(pv);

    per = parseFloat(per);

    if ((per === 0) || (nper === 0)) {

        alert("Why do you want to test me with zeros?");

        return (0);

    }

    rate = eval((rate) / (per * 100));

    if (rate === 0) // Interest rate is 0

    {

        pmt_value = -(fv + pv) / nper;

    } else {

        x = Math.pow(1 + rate, nper);

        pmt_value = -((rate * (fv + x * pv)) / (-1 + x));

    }

    pmt_value = my.conv_number(pmt_value, 2);

    return (parseFloat(pmt_value));

};

my.conv_number = function (expr, decplaces) { // This function is from David Goodman's Javascript Bible.

    var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));

    while (str.length <= decplaces) {

        str = "0" + str;

    }

    var decpoint = str.length - decplaces;

    return (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));

};

// Feature detect + local reference
my.storage;
var fail,
    uid;
try {
    uid = new Date;
    (my.storage = window.localStorage).setItem(uid, uid);
    fail = my.storage.getItem(uid) != uid;
    my.storage.removeItem(uid);
    fail && (my.storage = false);
} catch (e) {};

// kendo dataSource sorting parameterMap command convertion
my.convertSortingParameters = function (original) {
    if (original) {
        var sortIndex;
        var converted = "";
        for (sortIndex = 0; sortIndex < original.length; sortIndex += 1) {
            if (sortIndex > 0) {
                converted += ", ";
            }
            converted += original[sortIndex].field + " " + original[sortIndex].dir;
        }
        return converted;
    }
};

my.stripEndQuotes = function (s) {
    var t = s.length;
    if (s.charAt(0) == '"') s = s.substring(1, t--);
    if (s.charAt(--t) == '"') s = s.substring(0, t);
    return s;
}

my.createObject = function (value) {
    var str = $('<div/>').html(value).text();
    var obj = str.substring(1, str.length - 2);;
    return $('<' + obj + '/>');
};

//create a in-memory div, set it's inner text(which jQuery automatically encodes)
//then grab the encoded contents back out.  The div never exists on the page.
my.htmlDecode = function (value) {
    return $('<div/>').html(value).text();
};

my.htmlEncode = function (value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
};

// HtmlHelpers Module
// Call by using my.htmlHelpers.getQueryStringValue("myname");
my.htmlHelpers = function () {
    return {
        // Based on http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
        getQueryStringValue: function (name) {
            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
    };
}();

/**
 * String manipulations
 */

my.getNewId = function () {
    var lastId = localStorage['lastId'] || '0';
    var newId = parseInt(lastId, 10) + 1;
    localStorage['lastId'] = newId;
    return newId;
}

my.wordInString = function (s, word) {
    return new RegExp('\\b' + word + '\\b', 'i').test(s);
};

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

my.endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

my.replaceAll = function (string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

my.stripHtml = function (html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

my.symbolsToEntities = function (sText) {
    var sNewText = "";
    var iLen = sText.length;
    for (i = 0; i < iLen; i++) {
        iCode = sText.charCodeAt(i);
        sNewText += (iCode > 256 ? "&#" + iCode + ";" : sText.charAt(i));
    }
    return sNewText;
};

String.prototype.strip = function () {
    var translate_re = /[úõôóíêéçãâáàÚÕÔÓÍÊÉÇÃÁÀÂ]/g;
    var translate = {
        "À": "A",
        "Á": "A",
        "Ã": "A",
        "Â": "A",
        "Ç": "C",
        "É": "E",
        "Ê": "E",
        "Í": "I",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ú": "U",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ç": "c",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ú": "u"
    };
    return (this.replace(translate_re, function (match) {
        return translate[match];
    }));
};

// file encoding must be UTF-8!
my.getTextExtractor = function () {
    return (function () {
        var patternLetters = /[úõôóíêéçãâáàÚÕÔÓÍÊÉÇÃÁÀÂ]/g;
        var patternDateDmy = /^(?:\D+)?(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/;
        var lookupLetters = {
            "À": "A",
            "Á": "A",
            "Ã": "A",
            "Â": "A",
            "Ç": "C",
            "É": "E",
            "Ê": "E",
            "Í": "I",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ú": "U",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ç": "c",
            "é": "e",
            "ê": "e",
            "í": "i",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ú": "u"
        };
        var letterTranslator = function (match) {
            return lookupLetters[match] || match;
        }

        return function (node) {
            var text = $.trim($(node).text());
            var date = text.match(patternDateDmy);
            if (date)
                return [date[3], date[2], date[1]].join("-");
            else
                return text.replace(patternLetters, letterTranslator);
        }
    })();
};

// StringHelpers Module
// Call by using StringHelpers.padLeft("1", "000");
my.stringHelpers = function () {
    return {
        // Pad string using padMask.  string '1' with padMask '000' will produce '001'.
        padLeft: function (string, padMask) {
            string = '' + string;
            return (padMask.substr(0, (padMask.length - string.length)) + string);
        }
    };
}();

my.padLeft = function (str, max) {
    str = str.toString();

    function main(str, max) {
        return str.length < max ? main("0" + str, max) : str;
    }
    return main(str, max);
};

/**
 * ... trallings
 */

my.Left = function (str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0, n) + ' ...';
};

my.Right = function (str, n) {
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
};

String.prototype.padLeft = function padLeft(length, leadingChar) {
    if (leadingChar === undefined) leadingChar = "0";
    return this.length < length ? (leadingChar + this).padLeft(length, leadingChar) : this;
};

my.zeroPad = function (num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

function removeCurrency(strValue) {
    var value = strValue;
    if (value === "") {
        value = 0;
    } else {
        value = value.replace(".", "");
        value = value.replace(",", ".");
        value = value.replace('R', '');
        value = value.replace('$', '');
        value = parseFloat(value);
    }
    return value;
}

function formatWithComma(x, precision, seperator) {
    var options = {
        precision: precision || 2,
        seperator: seperator || ','
    };
    var formatted = parseFloat(x, 10).toFixed(options.precision);
    var regex = new RegExp(
        '^(\\d+)[^\\d](\\d{' + options.precision + '})$');
    formatted = formatted.replace(
        regex, '$1' + options.seperator + '$2');
    return formatted;
};

//transforma a entrada em número float
var convertToFloatNumber = function (value) {
    value = value.toString();
    if (value.indexOf('.') !== -1 && value.indexOf(',') !== -1) {
        if (value.indexOf('.') < value.indexOf(',')) {
            //inglês
            return parseFloat(value.replace(/,/gi, ''));
        } else {
            //português
            return parseFloat(value.replace(/./gi, '').replace(/,/gi, '.'));
        }
    } else {
        return parseFloat(value);
    }
};

//prototype para formatar a saída  
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/**
 * Times and dates
 */

Date.prototype.addSeconds = function (seconds) {
    this.setDate(this.getSeconds() + seconds);
    return this;
};

Date.prototype.addMinutes = function (minutes) {
    this.setDate(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addMonths = function (months) {
    this.setDate(this.getMonth() + months);
    return this;
};

Date.prototype.addYears = function (years) {
    this.setDate(this.getFullYear() + years);
    return this;
};

my.daysBetween = function (date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY);
};

my.setHours = function (date, days, nhr, nmin, nsec) {
    var d, s;
    d = date;
    d = date.addDays(days);
    d.setHours(nhr, nmin, nsec);
    s = "Current setting is " + d.toLocaleString();
    return (d);
};

my.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

jQuery.fn.getCheckboxVal = function () {
    var vals = [];
    this.each(function () {
        vals.push(parseInt(jQuery(this).val()));
    });
    return vals;
};

my.stack_bottomright = {
    "dir1": "up",
    "dir2": "left",
    "firstpos1": 25,
    "firstpos2": 25
};
my.stack_bottomleft = {
    "dir1": "up",
    "dir2": "right",
    "firstpos1": 25,
    "firstpos2": 25
};
my.stack_topleft = {
    "dir1": "down",
    "dir2": "right",
    "push": "top"
};
my.stack_topright = {
    "dir1": "down",
    "dir2": "left",
    "firstpos1": 25,
    "firstpos2": 25
};

my.minmax = function (value, min, max) {
    if (parseInt(value) < 0 || isNaN(value))
        return 0;
    else if (parseInt(value) > 100)
        return 100;
    else return value;
};

window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
        alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_self');
    return true;
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

my.formatVersion = function (version) {
    var html = '';
    if (version > 0) {
        html = version.toString().substring(0, 1) + '.' + version.toString().substring(1, 2) + '.' + version.toString().substring(2, 3) + '.' + version.toString().substring(3, 4);
    }

    return html;
};

my.popupwindow = function (url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var openWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left, true);
    openWindow.document.title = title;
    return openWindow;
};

my.getStateName = function (s) {
    var stateName = '';
    switch (s.toUpperCase()) {
        case "AC":
            stateName = "Acre"
            break;
        case "AL":
            stateName = "Alagoas"
            break;
        case "AP":
            stateName = "Amapá"
            break;
        case "AM":
            stateName = "Amazonas"
            break;
        case "BA":
            stateName = "Bahia"
            break;
        case "CE":
            stateName = "Ceará"
            break;
        case "DF":
            stateName = "Distrito Federal"
            break;
        case "ES":
            stateName = "Espírito Santo"
            break;
        case "GO":
            stateName = "Goiás"
            break;
        case "MA":
            stateName = "Maranhão"
            break;
        case "MT":
            stateName = "Mato Grosso"
            break;
        case "MS":
            stateName = "Mato Grosso do Sul"
            break;
        case "MG":
            stateName = "Minas Gerais"
            break;
        case "PA":
            stateName = "Pará"
            break;
        case "PB":
            stateName = "Paraíba"
            break;
        case "PR":
            stateName = "Paraná"
            break;
        case "PE":
            stateName = "Pernambuco"
            break;
        case "PI":
            stateName = "Piauí"
            break;
        case "RJ":
            stateName = "Rio de Janeiro"
            break;
        case "RN":
            stateName = "Rio Grande do Norte"
            break;
        case "RS":
            stateName = "Rio Grande do Sul"
            break;
        case "RO":
            stateName = "Rondônia"
            break;
        case "RR":
            stateName = "Roraima"
            break;
        case "SC":
            stateName = "Santa Catarina"
            break;
        case "SP":
            stateName = "São Paulo"
            break;
        case "SE":
            stateName = "Sergipe"
            break;
        case "TO":
            stateName = "Tocantins"
            break;
        default:

    }
    return stateName;
}

my.validaCPF = function (cpf) {

    var cboll = true;

    if (cpf != undefined) {
        strCPF = cpf.replace(/[^\d]+/g, '');
        var Soma;
        var Resto;
        Soma = 0;

        if (strCPF.length != 11)
            cboll = false;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10))) cboll = false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11))) cboll = false;
    }

    return cboll;

}

my.validaCnpj = function (str) {

    if (str != undefined) {
        str = str.replace(/[^\d]+/g, '');
        cnpj = str;
        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;
        if (cnpj.length < 14 && cnpj.length < 15)
            return false;
        for (i = 0; i < cnpj.length - 1; i++)
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        if (!digitos_iguais) {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return false;
            return true;
        } else
            return false;
    } else
        return false;
}

my.availableColors = [
    '#ADFF2F', '#ADD8A6', '#FAEBD7', '#FF8A80', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#B2DFDB', '#C8E6C9', '#CCFF90', '#F4FF81', '#FFE0B2', '#FFAB91', '#CFD8DC', '#E0E0E0'
];

my.stateAbbrv = function (st) {
    var region = '';
    switch (st) {
        case 'Acre':
            region = 'AC';
            break;
        case 'Alagoas':
            region = 'AL';
            break;
        case 'Amapá':
            region = 'AP';
            break;
        case 'Amazonas':
            region = 'AM';
            break;
        case 'Bahia':
            region = 'BA';
            break;
        case 'Ceará':
            region = 'CE';
            break;
        case 'Distrito Federal':
            region = 'DF';
            break;
        case 'Espírito Santo':
            region = 'ES';
            break;
        case 'Goiás':
            region = 'GO';
            break;
        case 'Maranhão':
            region = 'MA';
            break;
        case 'Mato Grosso':
            region = 'MT';
            break;
        case 'Mato Grosso do Sul':
            region = 'MS';
            break;
        case 'Minas Gerais':
            region = 'MG';
            break;
        case 'Pará':
            region = 'PA';
            break;
        case 'Paraíba':
            region = 'PB';
            break;
        case 'Paraná':
            region = 'PR';
            break;
        case 'Pernambuco':
            region = 'PE';
            break;
        case 'Piauí':
            region = 'PI';
            break;
        case 'Rio de Janeiro':
            region = 'RJ';
            break;
        case 'Rio Grande do Norte':
            region = 'RN';
            break;
        case 'Rio Grande do Sul':
            region = 'RS';
            break;
        case 'Rondônia':
            region = 'RO';
            break;
        case 'Roraima':
            region = 'RR';
            break;
        case 'Santa Catarina':
            region = 'SC';
            break;
        case 'São Paulo':
            region = 'SP';
            break;
        case 'Sergipe':
            region = 'SE';
            break;
        case 'Tocantins':
            region = 'TO';
            break;
    }
    return region;
};

my.stateFullName = function (st) {
    var region = '';
    switch (st) {
        case 'AC':
            region = 'Acre';
            break;
        case 'AL':
            region = 'Alagoas';
            break;
        case 'AP':
            region = 'Amapá';
            break;
        case 'AM':
            region = 'Amazonas';
            break;
        case 'BA':
            region = 'Bahia';
            break;
        case 'CE':
            region = 'Ceará';
            break;
        case 'DF':
            region = 'Distrito Federal';
            break;
        case 'ES':
            region = 'Espírito Santo';
            break;
        case 'GO':
            region = 'Goiás';
            break;
        case 'MA':
            region = 'Maranhão';
            break;
        case 'MT':
            region = 'Mato Grosso';
            break;
        case 'MS':
            region = 'Mato Grosso do Sul';
            break;
        case 'MG':
            region = 'Minas Gerais';
            break;
        case 'PA':
            region = 'Pará';
            break;
        case 'PB':
            region = 'Paraíba';
            break;
        case 'PR':
            region = 'Paraná';
            break;
        case 'PE':
            region = 'Pernambuco';
            break;
        case 'PI':
            region = 'Piauí';
            break;
        case 'RJ':
            region = 'Rio de Janeiro';
            break;
        case 'RN':
            region = 'Rio Grande do Norte';
            break;
        case 'RS':
            region = 'Rio Grande do Sul';
            break;
        case 'RO':
            region = 'Rond&ohat;nia';
            break;
        case 'RR':
            region = 'Roraima';
            break;
        case 'SC':
            region = 'Santa Catarina';
            break;
        case 'SP':
            region = 'São Paulo';
            break;
        case 'SE':
            region = 'Sergipe';
            break;
        case 'TO':
            region = 'Tocantins';
            break;
    }
    return region;
};

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 *
 * @author Eugene Maslovich <ehpc@em42.ru>
 */

my.waitingDialog = my.waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    return {
        /**
         * Opens our dialog
         * @param message Custom message
         * @param options Custom options:
         * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
         * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
         */
        show: function (message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = 'Loading';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: '',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h3').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
        },
        /**
         * Closes dialog
         */
        hide: function () {
            $dialog.modal('hide');
        }
    };

})(jQuery);


my.badWords = /anus|baba-ovo|babaovo|babaca|bacura|bagos|baitola|bebum|besta|bicha|bisca|bixa|boazuda|boceta|boco|boiola|bolagato|boquete|bolcat|bosseta|bosta|bostana|brecha|brexa|brioco|bronha|buca|buceta|bunda|bunduda|burra|burro|busseta|cachorra|cachorro|cadela|caga|cagado|cagao|cagona|canalha|caralho|casseta|cassete|checheca|chereca|chibumba|chibumbo|chifruda|chifrudo|chota|chochota|chupada|chupado|clitoris|clit+ris|cocaina|coca-na|coco|corna|corno|cornuda|cornudo|corrupta|corrupto|cretina|cretino|cruz-credo|cu|culhao|curalho|cuzao|cuz+o|cuzuda|cuzudo|debil|debiloide|defunto|demonio|dem+nio|difunto|doida|doido|escrota|escroto|esporrada|esporrado|esporro|estupida|estupidez|estupido|est+pido|fedida|fedido|fedor|fedorenta|feia|feio|feiosa|feioso|feioza|feiozo|felacao|fenda|foda|fodao|fode|fodida|fodido|fornica|fudendo|fudecao|fudida|fudido|furada|furado|furao|furnica|furnicar|furo|furona|gaiata|gaiato|gay|gonorrea|gonorreia|gosma|gosmenta|gosmento|grelinho|grelo|homo-sexual|homosexual|homossexual|idiota|idiotice|imbecil|iscrota|iscroto|japa|ladra|ladrao|ladr+o|ladroeira|ladrona|lalau|leprosa|leproso|lesbica|macaca|macaco|machona|machorra|manguaca|masturba|meleca|merda|mija|mijada|mijado|mijo|mocrea|mocr+a|mocreia|moleca|moleque|mondronga|mondrongo|naba|nadega|nojeira|nojenta|nojento|nojo|olhota|otaria|otario|paca|paspalha|paspalhao|paspalho|pau|peia|peido|pemba|penis|p-nis|pentelha|pentelho|perereca|peru|pica|picao|pilantra|piranha|piroca|piroco|piru|porra|prega|prostibulo|prostituta|prostituto|punheta|punhetao|pus|pustula|puta|puto|puxa-saco|puxasaco|rabao|rabo|rabuda|rabudao|rabud+o|rabudo|rabudona|racha|rachada|rachadao|rachad+o|rachadinha|rachadinho|rachado|ramela|remela|retardada|retardado|ridicula|rola|rolinha|rosca|sacana|safada|safado|sapatao|sifilis|siririca|tarada|tarado|testuda|tezao|tez+o|tezuda|tezudo|trocha|trolha|troucha|trouxa|troxa|vaca|vagabunda|vagabundo|vagina|veada|veadao|vead+o|veado|viada|viado|viadao|xavasca|xerereca|xexeca|xibiu|xibumba|xota|xochota|xoxota|xana|xaninha/gi;
my.prepData = `a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,v,w,x,y,z,gosto,gosta,mais,preciso,cujo,me,os,sua,cujos
                ,mesmos,ou,suas,da,meu,outra,tanta,ah,das,meus,outras,tantas,ai,de,mim,outrem,tanto,algo,dela
                ,minha,outro,tantos,filho,alguem,delas,minhas,outros,te,algum,dele,muita,para,teu,alguma,deles
                ,muitas,per,teus,algumas,desde,muito,perante,ti,alguns,do,muitos,pois,toda,alo,dos,na,por,todas
                ,ambos,nada,porém,todo,ante,eia,nas,porque,todos,ao,ela,nela,portanto,tras,apos,elas,nelas,pouca
                ,tu,aquela,ele,nele,poucas,tua,aquelas,eles,neles,pouco,tuas,aquele,em,nem,poucos,tudo,aqueles
                ,embora,nenhum,proprios,ue,aquilo,enquanto,nenhuma,psit,uh,as,entre,nenhumas,psiu,ui,ate,essa
                ,nenhuns,quais,um,bis,essas,ninguem,quaisquer,uma,cada,esse,no,qual,umas,certa,esses,nos,qualquer
                ,uns,certas,esta,nós,quando,varia,certo,estas,nossa,varias,certos,este,nossas,vario,chi,estes
                ,nosso,quanto,quanta,varios,com,eu,nossos,quantos,quantas,voce,comigo,hem,que,vos,conforme,hum
                ,quem,vossa,conosco,ih,se,vossas,consigo,isso,oba,sem,vosso,contigo,isto,oh,seu,vossos,contra,
                lhe,ola,seus,convosco,lhes,onde,si,cuja,logo,opa,sob,cujas,mas,ora,sobre,comprar,quero,anuncio
                ,teste,testes,e,nao,compro,cor,cores,amrelo,vermelho,rosa,verde,azul,cinza,preto,branco`;