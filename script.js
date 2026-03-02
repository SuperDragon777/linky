const services = [
	{
		name: 'YouTube',
		description: 'Video hosting',
		url: 'https://youtube.com'
	},
	{
		name: 'Google',
		description: 'Search engine',
		url: 'https://google.com'
	},
	{
		name: 'GitHub',
		description: 'Code hosting',
		url: 'https://github.com'
	}
]

const main = document.querySelector('main')

const searchContainer = document.createElement('div')
searchContainer.classList.add('search-container')

const searchInput = document.createElement('input')
searchInput.type = 'text'
searchInput.id = 'searchInput'
searchInput.placeholder = 'Search...'

searchContainer.appendChild(searchInput)
main.appendChild(searchContainer)

const servicesContainer = document.createElement('div')
servicesContainer.classList.add('services')
main.appendChild(servicesContainer)

function displayServices(list) {
	servicesContainer.innerHTML = ''

	if (list.length === 0) {
		servicesContainer.innerHTML = '<p>Nothing found</p>'
		return
	}

	list.forEach(service => {
		const card = document.createElement('div')
		card.classList.add('card')

		card.innerHTML = `
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <a href="${service.url}" target="_blank">Visit</a>
        `

		servicesContainer.appendChild(card)
	})
}

searchInput.addEventListener('input', () => {
	const value = searchInput.value.toLowerCase()
	const filtered = services.filter(service =>
		service.name.toLowerCase().includes(value)
	)
	displayServices(filtered)
})

displayServices(services)
