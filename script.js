const services = [
	{
		name: 'YouTube',
		description: 'Video hosting',
		url: 'https://youtube.com',
		tags: ['video_hosting', 'google']
	},
	{
		name: 'Google',
		description: 'Search engine',
		url: 'https://google.com',
		tags: ['search_engine', 'google']
	},
	{
		name: 'GitHub',
		description: 'Code hosting',
		url: 'https://github.com',
		tags: ['code_hosting']
	},
	{
		name: 'Yandex',
		description: 'Search engine',
		url: 'https://yandex.com',
		tags: ['search_engine']
	}
]

const searchInput = document.getElementById('searchInput')
const servicesContainer = document.getElementById('servicesContainer')
const tagsContainer = document.getElementById('tagsContainer')

let activeTag = null

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
	displayServices(filtered)
}

function displayServices(list) {
	servicesContainer.innerHTML = ''

	if (list.length === 0) {
		servicesContainer.innerHTML = '<p>Nothing found</p>'
		return
	}

	list.forEach(service => {
		const card = document.createElement('div')
		card.classList.add('card')

		const tagsHtml = service.tags
			.map(tag => `<span class="card-tag" data-tag="${tag}">#${tag}</span>`)
			.join('')

		card.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="card-tags">${tagsHtml}</div>
            <a href="${service.url}" target="_blank">Visit</a>
        `

		card.querySelectorAll('.card-tag').forEach(tagEl => {
			tagEl.addEventListener('click', e => {
				e.stopPropagation()
				filterByTag(tagEl.dataset.tag)
			})
		})

		servicesContainer.appendChild(card)
	})
}

searchInput.addEventListener('input', () => {
	activeTag = null
	updateTagStyles()
	filterServices()
})

renderTags()
displayServices(services)
