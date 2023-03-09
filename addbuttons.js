const gitHubButtonSuffix = '-ghb';

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function generateTab(label, name, url, shortcut = '', index=0)
{
    const convertedName = name.replace(' ', '-');
    // without the data-turbo-frame, the loads are no longer pjax and so a full page reload occurs
    // the underline appears when the tab has `class=current` or `aria-current=page`
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
    const convertedName = name.replace(' ', '-');
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
    return window.location.pathname.replace(/(\/[^\/]+\/[^\/]+)\/?.*/g, "$1") + url;
}

function appendElement(nav, label, url, generatorFunction, name = undefined, index=0, shortcut='')
{
    let codename = name;
    if (!name) {
        codename = label.toLowerCase();
    }
    const convertedName = codename.replace(' ', '-');
    const exists = document.getElementById(`${convertedName}${gitHubButtonSuffix}`);
    const fullUrl = buildUrl(url);
    if (!exists) {
        nav[0].children[0].appendChild(generatorFunction(label, codename, fullUrl, shortcut, index));
    }
}

function addTabs()
{
    let nav = document.getElementsByClassName("js-repo-nav");
    if (nav !== undefined) {
        appendElement(nav, 'My branches', '/branches/yours', generateTab, undefined, 6, 'q m');
        appendElement(nav, 'All branches', '/branches/all', generateTab, undefined, 7, 'q a');
        appendElement(nav, 'Network', '/network', generateTab, undefined, 8, 'q n');
        appendElement(nav, 'New issue', '/issues/new/choose', generateButton, undefined, 9, 'q c');
    }
}

setInterval(addTabs, 1000);
