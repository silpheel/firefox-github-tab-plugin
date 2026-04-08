const gitHubButtonSuffix = '-ghb';

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function generateTab(label, name, url, shortcut = '', index=0)
{
    const convertedName = name.replace(/\s+/g, '-');
    return createElementFromHTML(
        `
<li data-view-component="true" class="d-inline-flex">
    <a
        id="${convertedName}${gitHubButtonSuffix}"
        href="${url}"
        data-tab-item="i${index}${convertedName}${gitHubButtonSuffix}"
        data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches repo_packages repo_deployments /mdn/webextensions-examples"
        data-pjax="#repo-content-pjax-container"
        data-turbo-frame="repo-content-turbo-frame"
        data-hotkey="${shortcut}"
        data-analytics-event="{&quot;category&quot;:&quot;Underline navbar&quot;,&quot;action&quot;:&quot;Click tab&quot;,&quot;label&quot;:&quot;${label}&quot;,&quot;target&quot;:&quot;UNDERLINE_NAV.TAB&quot;}"
        data-view-component="true"
       class="UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item"
    >
        <span data-content="${label}">${label}</span>
        <span id="${name}-repo-tab-count" data-pjax-replace="" data-turbo-replace="" title="Not available" data-view-component="true" class="Counter"></span>
    </a>
</li>
`
    );
}

function generateButton(label, name, url, shortcut, index) {
    const convertedName = name.replace(/\s+/g, '-');
    return createElementFromHTML(
        `
<a href="${url}" class="btn btn-primary" role="button" data-hotkey="${shortcut}" id="${convertedName}${gitHubButtonSuffix}">
    <span class="d-none d-md-block">${label}</span>
    <span class="d-block d-md-none">${label}</span>
</a>
        `
    );
}

function buildUrl(url)
{
    const m = window.location.pathname.match(/^\/(?:[^\/]+)\/(?:[^\/]+)/);
    if (!m) {
        return url
    }
    return m[0] + url;
}

function appendElement(navEl, label, url, generatorFunction, name = undefined, index = 0, shortcut = '') {
    const codename = name || label.toLowerCase();
    const convertedName = codename.replace(/\s+/g, '-');
    const id = `${convertedName}${gitHubButtonSuffix}`;

    if (document.getElementById(id)) {
        return;
    }

    if (!navEl) {
        return;
    }

    const list = navEl.querySelector('ul');
    if (!list) {
        return;
    }

    const fullUrl = buildUrl(url);
    list.appendChild(generatorFunction(label, codename, fullUrl, shortcut, index));
}

function addTabs() {
    let navEl = document.querySelector('.js-repo-nav');

    if (!navEl) {
        navEl = document.querySelector('nav[aria-label="Repository"]');
    }

    if (!navEl) {
        navEl = document.querySelector('#repository-container-header nav');
    }

    if (!navEl) return;

    appendElement(navEl, 'My branches', '/branches/yours', generateTab, undefined, 6, 'q m');
    appendElement(navEl, 'All branches', '/branches/all', generateTab, undefined, 7, 'q a');
    appendElement(navEl, 'Network', '/network', generateTab, undefined, 8, 'q n');
    appendElement(navEl, 'New issue', '/issues/new/choose', generateButton, undefined, 9, 'q c');
}

function addTopRightButtons() {
    const containerId = 'github-tab-plugin-top-right-buttons';
    if (document.getElementById(containerId)) return;

    const icon = document.querySelector('.prc-Stack-Stack-UQ9k6 .octicon-git-pull-request');
    const btn = icon ? icon.closest('.prc-Button-ButtonBase-9n-Xk') : null;
    if (!btn) return;
    btn.outerHTML = `
<span id="${containerId}">
    <div class="prc-ButtonGroup-ButtonGroup-vFUrY">
        <div>
            <a title="Created - Pull Requests" href="/pulls" data-component="IconButton" type="button" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-labelledby="_R_q3pb_" data-discover="true" class="prc-Button-ButtonBase-9n-Xk styles-module__appHeaderButton__axedQ prc-Button-IconButton-fyge7">
                <svg aria-hidden="true" focusable="false" class="octicon octicon-git-pull-request" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align:text-bottom">
                    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path>
                </svg>
            </a>
        </div>
        <div>
            <a title="Assigned - Pull Requests" href="/pulls/assigned" data-component="IconButton" type="button" class="prc-Button-ButtonBase-9n-Xk styles-module__appHeaderButton__axedQ prc-Button-IconButton-fyge7" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-labelledby="_R_q3pb_" data-discover="true">
                A
            </a>
        </div>
        <div>
            <a title="Mentioned - Pull Requests" href="/pulls/mentioned" data-component="IconButton" type="button" class="prc-Button-ButtonBase-9n-Xk styles-module__appHeaderButton__axedQ prc-Button-IconButton-fyge7" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-labelledby="_R_q3pb_" data-discover="true">
                M
            </a>
        </div>
        <div>
            <a title="Review Requested - Pull Requests" href="/pulls/review-requested" data-component="IconButton" type="button" class="prc-Button-ButtonBase-9n-Xk styles-module__appHeaderButton__axedQ prc-Button-IconButton-fyge7" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-labelledby="_R_q3pb_" data-discover="true">
                R
            </a>
        </div>
    </div>
</span>
    `;
}

function startObserver() {
    const obs = new MutationObserver(() => {
        addTabs();
        addTopRightButtons();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    addTabs();
    addTopRightButtons();
}

startObserver();
