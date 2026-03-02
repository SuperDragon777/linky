let services = []
let favorites = JSON.parse(localStorage.getItem('linkyFavorites')) || []
let currentTab = 'all'
let isLightTheme = localStorage.getItem('linkyTheme') === 'light'

const searchInput = document.getElementById('searchInput')
const servicesContainer = document.getElementById('servicesContainer')
const tagsContainer = document.getElementById('tagsContainer')

let activeTag = null

if (isLightTheme) {
	document.body.classList.add('light')
	document.getElementById('themeToggle').textContent = '🌙'
}

function saveFavorites() {
	localStorage.setItem('linkyFavorites', JSON.stringify(favorites))
}

function toggleFavorite(url) {
	const index = favorites.indexOf(url)
	if (index === -1) {
		favorites.push(url)
	} else {
		favorites.splice(index, 1)
	}
	saveFavorites()
	renderServices()
}

function isFavorite(url) {
	return favorites.includes(url)
}

function getAllTags() {
	const allTags = services.flatMap(service => service.tags)
	return [...new Set(allTags)].sort()
}

function renderTags() {
	const allTags = getAllTags()
	tagsContainer.innerHTML = ''

	allTags.forEach(tag => {
		const tagEl = document.createElement('span')
		tagEl.classList.add('tag')
		tagEl.textContent = `#${tag}`
		tagEl.addEventListener('click', () => filterByTag(tag))
		tagsContainer.appendChild(tagEl)
	})
}

function filterByTag(tag) {
	if (activeTag === tag) {
		activeTag = null
		searchInput.value = ''
	} else {
		activeTag = tag
		searchInput.value = ''
	}
	updateTagStyles()
	filterServices()
}

function updateTagStyles() {
	const tagElements = tagsContainer.querySelectorAll('.tag')
	tagElements.forEach(el => {
		const tagName = el.textContent.slice(1)
		if (tagName === activeTag) {
			el.classList.add('active')
		} else {
			el.classList.remove('active')
		}
	})
}

function filterServices() {
	const query = searchInput.value.toLowerCase()
	const filtered = services.filter(service => {
		const matchesSearch =
			service.name.toLowerCase().includes(query) ||
			service.description.toLowerCase().includes(query) ||
			service.tags.some(tag => tag.toLowerCase().includes(query))

		const matchesTag = activeTag ? service.tags.includes(activeTag) : true

		return matchesSearch && matchesTag
	})

	if (currentTab === 'favorites') {
		const filteredFavorites = filtered.filter(s => favorites.includes(s.url))
		displayServices(filteredFavorites)
	} else {
		displayServices(filtered)
	}
}

function displayServices(list) {
	servicesContainer.innerHTML = ''

	if (list.length === 0) {
		servicesContainer.innerHTML = '<p>Nothing found</p>'
		return
	}

	if (currentTab === 'all') {
		list = [...list].sort((a, b) => {
			const aFav = favorites.includes(a.url) ? 0 : 1
			const bFav = favorites.includes(b.url) ? 0 : 1
			return aFav - bFav
		})
	}

	list.forEach(service => {
		const card = document.createElement('div')
		card.classList.add('card')

		const tagsHtml = service.tags
			.map(tag => `<span class="card-tag" data-tag="${tag}">#${tag}</span>`)
			.join('')

		const favoriteIcon = isFavorite(service.url) ? '★' : '☆'

		card.innerHTML = `
            <div class="card-header">
                <h3>${service.name}</h3>
                <button class="favorite-btn ${isFavorite(service.url) ? 'active' : ''}" title="Add to favorites">
                    ${favoriteIcon}
                </button>
            </div>
            <p>${service.description}</p>
            <div class="card-tags">${tagsHtml}</div>
            <a href="${service.url}" target="_blank">Visit</a>
        `

		const favBtn = card.querySelector('.favorite-btn')
		favBtn.addEventListener('click', e => {
			e.stopPropagation()
			toggleFavorite(service.url)
		})

		card.querySelectorAll('.card-tag').forEach(tagEl => {
			tagEl.addEventListener('click', e => {
				e.stopPropagation()
				filterByTag(tagEl.dataset.tag)
			})
		})

		servicesContainer.appendChild(card)
	})
}

function renderServices() {
	if (currentTab === 'favorites') {
		const favoriteServices = services.filter(s => favorites.includes(s.url))
		displayServices(favoriteServices)
	} else {
		filterServices()
	}
}

searchInput.addEventListener('input', () => {
	activeTag = null
	updateTagStyles()
	filterServices()
})

document.querySelectorAll('.tab-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		document
			.querySelectorAll('.tab-btn')
			.forEach(b => b.classList.remove('active'))
		btn.classList.add('active')
		currentTab = btn.dataset.tab
		renderServices()
	})
})

const themeToggle = document.getElementById('themeToggle')
themeToggle.addEventListener('click', () => {
	document.body.classList.toggle('light')
	isLightTheme = document.body.classList.contains('light')
	localStorage.setItem('linkyTheme', isLightTheme ? 'light' : 'dark')
	themeToggle.textContent = isLightTheme ? '🌙' : '☀️'
})

async function loadSites() {
	try {
		const response = await fetch('sites.json')
		services = await response.json()
		renderTags()
		renderServices()
	} catch (error) {
		console.error('Error loading sites:', error)
		servicesContainer.innerHTML = '<p>Error loading sites</p>'
	}
}

loadSites()
