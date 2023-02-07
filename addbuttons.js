const gitHubButtonSuffix = '-ghb';

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function generateTab(label, name, url, index=0)
{
    return createElementFromHTML(
        `
<li data-view-component="true" class="d-inline-flex">
    <a
        id="${name}${gitHubButtonSuffix}"
        href="${url}"
        data-tab-item="i${index}${name}${gitHubButtonSuffix}"
        data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches repo_packages repo_deployments /mdn/webextensions-examples"
        data-pjax="#repo-content-pjax-container"
        data-turbo-frame="repo-content-turbo-frame"
        data-hotkey="g c"
        data-analytics-event="{&quot;category&quot;:&quot;Underline navbar&quot;,&quot;action&quot;:&quot;Click tab&quot;,&quot;label&quot;:&quot;${label}&quot;,&quot;target&quot;:&quot;UNDERLINE_NAV.TAB&quot;}"
        aria-current="page"
        data-view-component="true"
       class="UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item selected"
    >
        <span data-content="${label}">${label}</span>
        <span id="${name}-repo-tab-count" data-pjax-replace="" data-turbo-replace="" title="Not available" data-view-component="true" class="Counter"></span>
    </a>
</li>
`
    );
}

function generateButton(label, name, url, index) {
    return createElementFromHTML(
        `
<a href="${url}" class="btn btn-primary" role="button" data-hotkey="c" id="${name}${gitHubButtonSuffix}">
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

function appendElement(nav, label, url, generatorFunction, name = undefined, index=0)
{
    let codename = name;
    if (!name) {
        codename = label.toLowerCase();
    }
    const exists = document.getElementById(`${codename}${gitHubButtonSuffix}`);
    const fullUrl = buildUrl(url);
    if (!exists) {
        nav[0].children[0].appendChild(generatorFunction(label, codename, fullUrl, index));
    }
}

function addTabs()
{
    let nav = document.getElementsByClassName("js-repo-nav");
    if (nav !== undefined) {
        appendElement(nav, 'My branches', '/branches/yours', generateTab, undefined, 6);
        appendElement(nav, 'All branches', '/branches/all', generateTab, undefined, 7);
        appendElement(nav, 'Network', '/network', generateTab, undefined, 8);
        appendElement(nav, 'New issue', '/issues/new/choose', generateButton, undefined, 9);
    }
}

setInterval(addTabs, 1000);
