const header = document.querySelector('[data-header]')
const sections = [...document.querySelectorAll('[data-section]')]
const headerLinks = [...document.querySelectorAll('[data-link]')]

let prevYPosition = 0
let direction = 'up'

const options = {
	rootMargin: `${header.offsetHeight * -1}px`,
	threshold: 0
}

const getTargetSection = (entry) => {
	const index = sections.findIndex((section) => section == entry.target)

	if (index >= sections.length - 1) {
	 return entry.target
	} else {
	 return sections[index + 1]
	}
}

const updateColors = (target) => {
	const theme = target.dataset.section
	header.setAttribute('data-theme', theme)
}

const shouldUpdate = (entry) => {
	if (direction === 'down' && !entry.isIntersecting) {
		return true
	}

	if (direction === 'up' && entry.isIntersecting) {
		return true
	}

	return false
}

const updateMarker = (target) => {
	const id = target.id

	if (!id) return

	let link = headerLinks.find((el) => {
		return el.getAttribute('href') === `#${id}`
	})

	link = link || headerLinks[0]

	const distanceFromLeft = link.getBoundingClientRect().left

	header.style.setProperty('--markerWidth', `${link.clientWidth}px`)
	header.style.setProperty('--markerLeft', `${distanceFromLeft}px`)
}

const onIntersect = (entries) => {
	entries.forEach((entry) => {
		if (window.scrollY > prevYPosition) {
			direction = 'down'
		} else {
			direction = 'up'
		}

		prevYPosition = window.scrollY

		const target = direction === 'down' ? getTargetSection(entry) : entry.target

		if (shouldUpdate(entry)) {
			updateColors(target)
			updateMarker(target)
		}
	})
}

document.addEventListener('readystatechange', e => {
  if (e.target.readyState === 'complete') {
    updateMarker(sections[0])
  }
})

const observer = new IntersectionObserver(onIntersect, options)

sections.forEach((section) => {
	observer.observe(section)
})
