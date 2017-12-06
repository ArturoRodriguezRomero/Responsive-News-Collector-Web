const apiKey = '9331fc193116409cafe547ef5c5adbfe'; //<-- Don't be evil :)
//apiKey, endpoint, sources, domains, q, category, language, country, from, to, sortBy
const apiURL = (params) => {
    return `https://newsapi.org/v2/${params.endpoint}?apiKey=${params.apiKey}${params.sources != undefined ? `&sources=${params.sources}` : ''}${params.domains != undefined ? `&domains=${params.domains}` : ''}${params.q != undefined ? `&q=${params.q}` : ''}${params.category != undefined ? `&category=${params.category}` : ''}${params.language != undefined ? `&language=${params.language}` : ''}${params.country != undefined ? `&country=${params.country}` : ''}${params.from != undefined ? `&from=${params.from}` : ''}${params.to != undefined ? `&to=${params.to}` : ''}${params.sortBy != undefined ? `&sortBy=${params.sortBy}` : ''}`
};

const guideButtonExpand = document.querySelector('#guideButtonExpand');
const guideButtons = document.querySelectorAll('.guide-button');
const guideContainer = document.querySelector('.guide-container');
const pageContainer = document.querySelector('.page-container');

const queryInput = document.querySelector('#queryInput');
const queryInputButton = document.querySelector('#query-input-button');
//const sourcesContainer = document.querySelector('.sources-container');

var currentPage;
var currentEndpoint;
var currentCategory;

guideButtonExpand.addEventListener('click', event => {
    if (guideContainer.classList.contains('guide-container-hidden')) {
        guideContainer.classList.remove('guide-container-hidden');
        pageContainer.classList.remove('page-container-extended');
    } else {
        guideContainer.classList.add('guide-container-hidden');
        pageContainer.classList.add('page-container-extended');
    }
});

//console.log(guideButtons);
guideButtons.forEach((element, index) => {
    pageContainer.insertAdjacentHTML('beforeend', `<div id="${element.dataset.category != undefined ? element.dataset.category : element.dataset.endpoint}" class="page"></div>`);
    element.addEventListener('click', event => {
        guideButtons.forEach(element => {
            element.querySelector('.icon').classList.remove('icon-active');
        });
        element.querySelector('.icon').classList.add('icon-active');

        let pages = pageContainer.querySelectorAll('.page');
        pages.forEach((element, index) => {
            element.classList.add('page-hidden');
        });
        currentPage = pageContainer.querySelector(`#${element.dataset.category != undefined ? element.dataset.category : element.dataset.endpoint}`);
        currentEndpoint = element.dataset.endpoint;
        currentCategory = element.dataset.category;
        currentPage.classList.remove('page-hidden');
        populateArticles({ page: currentPage, endpoint: element.dataset.endpoint, category: element.dataset.category });

    });
});

queryInputButton.addEventListener('click', event => {
    populateArticles({ page: currentPage, endpoint: currentEndpoint, category: currentCategory });
});

function populateArticles(params) {
    params.page.innerHTML = '';

    fetchData({
        apiKey: apiKey,
        endpoint: params.endpoint,
        category: params.category,
        language: 'en',
        //sources: getSelectedSources(),
        q: getQuery()
    }
    ).then((result) => {
        //console.log(new Array(result.articles));
        result.articles.forEach((element) => {
            //console.log('hola')
            let article = new Article(element);
            //console.log(article.getArticleItem());
            params.page.insertAdjacentHTML('beforeend', article.getArticleItem());
        });
    });
}

function fetchData(params) {
    //console.log(apiURL(params));
    return new Promise((resolve, reject) => {
        fetch(apiURL(params)).then((data) => {
            data.json().then((json) => {
                //console.log(json);
                resolve(json);
            }).catch((error) => {
                reject(error);
            })
        }).catch((error) => {
            reject(error);
        });
    });
}

function formatDate(date) {
    let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

/*function getSelectedSources() {
    let sourcesString = undefined;
    let checkboxes = sourcesContainer.querySelectorAll('input[type="checkbox"]:checked');
    console.log(checkboxes);
    if (checkboxes.length != 0) {
        sourcesString = '';
    }
    checkboxes.forEach((element, index) => {
        sourcesString += element.dataset.source;
        if (index != checkboxes.length - 1) {
            sourcesString += ',';
        }
    });
    console.log(sourcesString);
    return sourcesString;
}*/

function getQuery() {
    return (queryInput.value != '' ? queryInput.value : undefined);
}

class Article {
    constructor(params) {
        this.author = params.author;
        this.title = params.title;
        this.description = params.description;
        this.url = params.url;
        this.urlToImage = params.urlToImage;
        this.publishedAt = params.publishedAt;
        this.source = params.source;
    }

    getArticleItem() {
        return (`<div class="article-item" onclick="window.open('${this.url}', '_blank')">
        <div class="image" ${(this.urlToImage != null ? `style="background-image:url(${this.urlToImage}");` : '')}></div>
        <div class="body">
            <div class="item">
                <div class="author">${this.source.name}</div>
                <div class="date">${formatDate(new Date(this.publishedAt))}</div>
            </div>
            <div class="title">${this.title}</div>
            <div class="description">${this.description}</div>
        </div>
        <div class="description-mobile">${this.description}</div>
        </div>`)
    }
}

//console.log(pageContainer.childNodes);
populateArticles({ page: pageContainer.childNodes[0], endpoint: 'top-headlines' });