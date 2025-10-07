////////////////////////////////////////////////////
// DESIGNPLUS CONFIG                            //
////////////////////////////////////////////////////
// Legacy

var DT_variables = {
    iframeID: '',
    // Path to the hosted USU Design Tools
    path: 'https://designtools.ciditools.com/',
    templateCourse: '14170',
    // OPTIONAL: Button will be hidden from view until launched using shortcut keys
    hideButton: true,
    // OPTIONAL: Limit by course format
    limitByFormat: false, // Change to true to limit by format
    // adjust the formats as needed. Format must be set for the course and in this array for tools to load
    formatArray: [
        'online',
        'on-campus',
        'blended'
    ],
    // OPTIONAL: Limit tools loading by users role
    limitByRole: false, // set to true to limit to roles in the roleArray
    // adjust roles as needed
    roleArray: [
        'student',
        'teacher',
        'admin'
    ],
    // OPTIONAL: Limit tools to an array of Canvas user IDs
    limitByUser: false, // Change to true to limit by user
    // add users to array (Canvas user ID not SIS user ID)
    userArray: [
        '1234',
        '987654'
    ]
};

// New
DpPrimary = {
    lms: 'canvas',
    templateCourse: '70819',
    hideButton: true,
    hideLti: false,
    extendedCourse: '', // added in sub-account theme
    sharedCourse: '', // added from localStorage
    courseFormats: [],
    canvasRoles: [],
    canvasUsers: [],
    canvasCourseIds: [],
    plugins: [],
    excludedModules: [],
    includedModules: [],
    lang: 'en',
    defaultToLegacy: false,
    enableVersionSwitching: true,
    hideSwitching: true,
}

// merge with extended/shared customizations config
DpConfig = {...DpPrimary, ...(window.DpConfig ?? {})}

$(function () {
    const uriPrefix = (location.href.includes('.beta.')) ? 'beta.' : '';
    const toolsUri = (DpConfig.toolsUri) ? DpConfig.toolsUri : `https://${uriPrefix}designplus.ciditools.com/`;
    $.getScript(`${toolsUri}js/controller.js`);
});
////////////////////////////////////////////////////
// END DESIGNPLUS CONFIG                        //
////////////////////////////////////////////////////


/*-----------------------------TOP----------------------------------------*/
//adds a custom button to SIS Imports for admins to scroll through previous SIS Import data
//dust-core.min.js, templates.js, and sis_import_extra.js hosted in AWS.

if (window.location.href.indexOf('sis_import') > -1) {
    var base_url = 'https://s3.amazonaws.com/SSL_Assets/jsheringer/show_more_imports_js/';
    require([base_url + 'dust-core.min.js', base_url + 'templates.js', base_url + 'sis_import_extras.js']);
}
/*-----------------------------BOTTOM----------------------------------------*/


/*-----------------------------TOP----------------------------------------*/


/*---------------------------ONPAGE Function - required by File Type Limit filter applied below------------------------------------------*/


onPage(/\/courses\/\d+\/settings/, function () {
    // do something
});

hasAnyRole('admin', function (hasRole) {
    if (hasRole) {
        // do something
    } else {
        // do something else
    }
});

isUser(1, function (isRyan) {
    if (isRyan) {
        // do something
    } else {
        // so something else
    }
});

onElementRendered('a[href=#create_ticket]', function (el) {
    // do something with el (a jquery element collection)
});

function onPage(regex, fn) {
    if (location.pathname.match(regex)) fn();
}

function hasAnyRole(/*roles, cb*/) {
    var roles = [].slice.call(arguments, 0);
    var cb = roles.pop();
    for (var i = 0; i < arguments.length; i++) {
        if (ENV.current_user_roles.indexOf(arguments[i]) !== -1) {
            return cb(true);
        }
    }
    return cb(false);
}

function isUser(id, cb) {
    cb(ENV.current_user_id == id);
}

function onElementRendered(selector, cb, _attempts) {
    var el = $(selector);
    _attempts = ++_attempts || 1;
    if (el.length) return cb(el);
    if (_attempts == 60) return;
    setTimeout(function () {
        onElementRendered(selector, cb, _attempts);
    }, 250);
}

/*---------------------------BOTTOM------------------------------------------*/


/*-----------------------------TOP----------------------------------------*/


/*
Show list of file types for file limitation on assignment uploads.
MODIFIED and repaired by TD 20240731
*/
document.addEventListener('DOMContentLoaded', function () {

    onElementRendered('div#allowed_extensions_container', function (container) {
        container = document.getElementById('allowed_extensions_container');
        const allowedExtensions = document.getElementById('assignment_allowed_extensions');
        const ft = {
            "Word": "doc,docx",
            "Excel": "xls,xlsx",
            "PowerPoint": "ppt,pptx",
            "PDF Files": "pdf",
            "Text Files": "txt",
            "Web Pages": "html,htm",
            "Images": "jpg,jpeg,gif,png,tiff,tif,bmp",
            "Zip Files": "zip"
        };

        const newDiv = document.createElement('div');
        newDiv.className = 'form-horizontal';
        newDiv.style.marginLeft = '60px';
        newDiv.innerHTML = '<br />...or select from the list of common files below:<table cellpadding="5"></table>';

        const table = newDiv.querySelector('table');
        let c = 0;
        for (const [key, val] of Object.entries(ft)) {
            if (c === 0) {
                table.insertRow();
            }
            const isChecked = allowedExtensions.value.includes(val) ? 'checked' : '';
            const cell = table.rows[table.rows.length - 1].insertCell();
            cell.innerHTML = `<label style="padding:3px 3px 3px 0px!important;"><input class="selectfiletypelist" style="margin: 0 5px 4px 0;" id="select_filetype_${key}" type="checkbox" name="${val}" ${isChecked} />${key}</label>`;
            c = (c + 1) % 2;
        }

        container.appendChild(newDiv);

        container.querySelectorAll('.selectfiletypelist').forEach(function (fileType) {
            fileType.addEventListener('click', function () {
                const fileTypeSet = new Set();
                container.querySelectorAll('.selectfiletypelist:checked').forEach(function (checkedFileType) {
                    fileTypeSet.add(checkedFileType.name);
                });
                allowedExtensions.value = Array.from(fileTypeSet).join(",");
            });
        });
    });

    onElementRendered('input#assignment_allowed_extensions', function (el) {
        if (el.click) {
            $('input#assignment_allowed_extensions').blur(function () {
                var curr = $('input#assignment_allowed_extensions').val();
                curr = curr.trim();
                if (curr.substr(-1) == ',') {
                    curr = curr.substr(0, (curr.length - 1));
                }
                if (curr.substr(0, 1) == ',') {
                    curr = curr.substr(1, (curr.length));
                }
                $('input#assignment_allowed_extensions').val(curr);
                if (curr.search(/([^A-Za-z0-9,]+)/m) > 0) {
                    alert('There are one or more errors in your Allowed File Extensions field.\n\n *This field should contain a comma (,) delimited list of file extensions (ex: doc,docx,pdf)\n *Do not include a dot (.) as part of the file extension\n *Do not include any non-Alphanumeric (A-Z 0-9) characters other than the comma (,) used to delimit the file extensions')
                }
            });
        }
        el.click(function () {
            var clickval = $('input#assignment_allowed_extensions').val();
            if (clickval.substr(-1) != ',' && clickval.length > 0) {
                $('input#assignment_allowed_extensions').val(clickval + ',');
            }
        });
    });

});


/*-----------------------------BOTTOM----------------------------------------*/
//
// BEGIN Atomic Search code
//
var atomicSearchWidgetScript = document.createElement("script");
atomicSearchWidgetScript.src = "https://d2u53n8918fnto.cloudfront.net/atomic_search_widget.js" + "?ts=" + new Date().getTime();
document.getElementsByTagName("head")[0].appendChild(atomicSearchWidgetScript);
//
// END Atomic Search code
//


// BEGIN Photo Toggle Code EML 20250904

(function() {
  // Only run on pages ending in "/users"
  if (!/\/users$/.test(window.location.pathname)) {
    return;
  }

  // Create the toggle button
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toggle Grid View";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "20px";      // Move to top
  toggleBtn.style.right = "20px";    // Keep on right
  toggleBtn.style.zIndex = "10000";
  toggleBtn.style.padding = "10px 15px";
  toggleBtn.style.borderRadius = "4px";
  toggleBtn.style.border = "none";
  toggleBtn.style.background = "#510c76";
  toggleBtn.style.color = "#fff";
  toggleBtn.style.cursor = "pointer";

  document.body.appendChild(toggleBtn);

  let gridVisible = false;
  let savedOriginal;

  function showGrid() {
    // Save original users view if not already saved
    if (!savedOriginal) {
      savedOriginal = $('div[data-view="users"]').clone(true, true);
    }

    const newDiv = $('<div>'); // Container for grid

    $('.collectionViewItems tr').each(function () {
      const avatarImg = $(this).find('img.css-bt94pf-avatar__loadImage');
      const avatar = avatarImg.attr('src') || '';
      const memberName = $(this).find('.roster_user_name').text().trim() || 'Unknown Member';

      const member = $(`
          <div class="member" style="width:120px; height:160px; float:left; margin:2px;">
              <div class="memberImg" style="text-align:center; height:120px; width:120px; display:flex; align-items:flex-start; justify-content:center;">
                  <img style="max-width:120px; max-height:120px;" src="${avatar}" alt="${memberName}">
              </div>
              <div class="memberName" style="text-align:center;">${memberName}</div>
          </div>
      `);

      newDiv.append(member);
    });

    newDiv.appendTo('.v-gutter');
    $('div[data-view="users"]').remove();
    gridVisible = true;
  }

  function hideGrid() {
    $('.v-gutter > div:has(.member)').remove();
    if (savedOriginal) {
      $('.v-gutter').append(savedOriginal);
    }
    gridVisible = false;
  }

  toggleBtn.addEventListener("click", () => {
    if (gridVisible) {
      hideGrid();
    } else {
      showGrid();
    }
  });
})();


///END Photo Toggle Code




//
// BEGIN Google Analytics code
//
// GOOGLE TAG MANAGER CODE
(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-T6493TS');

var googleTagManager = '<!-- Google Tag Manager (noscript) -->' +
    '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T6493TS" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>' +
    '<!-- End Google Tag Manager (noscript) -->';
$('body').prepend(googleTagManager);

//
// END Google Analytics code
//

//
// BEGIN Panaorama code EML 20240318
//
(async function () {
    const PANORAMA_SERVER_URL = 'https://panorama-api.yuja.com';
    const panoramaIdentifierKey = 'b690fae7557bd3e0772997375a81b81314cae21ad8250aa70e389c4f085f01dd';
    const PANORAMA_CDN_URL = 'https://cdn-panorama.yuja.com';

    window.PANORAMA_SERVER_URL = PANORAMA_SERVER_URL;
    window.panoramaIdentifierKey = panoramaIdentifierKey;
    window.PANORAMA_CDN_URL = PANORAMA_CDN_URL;

    function loadScript(url) {
        const script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }

    try {
        const response = await fetch(`${PANORAMA_SERVER_URL}/panorama-visualizer/canvas`, {cache: 'no-store'});
        const scriptUrl = await response.text();
        loadScript(scriptUrl);
    } catch (e) {
        console.error('Failed to load Panorama: ', e);
    }
})();