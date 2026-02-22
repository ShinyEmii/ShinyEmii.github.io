const localization = {
	"english": {
		"languages": "Languages",
		"introduction": "Hi, I'm Emii. I love cats :3"
	},
	"polish": {
		"languages": "Języki",
		"introduction": "Hej, jestem Emii. Kocham koty :3"
	},
	"catala": {
		"languages": "Idiomes",
		"introduction": "Hola, sóc l'Emii. M'encanten els gats :3"
	}
};

function scrollBehaviour() {
    const scroll = document.querySelector("#attached #scroll");
	scroll.style.transform = `scale(${window.scrollY / window.scrollMaxY}, 1)`;
}

function updateLanguage(language) {
	let elements = document.querySelectorAll(".localized");
	
	localized = localization[language];
	
	if (localized == null)
		return;

    localStorage.setItem("language", language);
	
	for (element of elements) {		
		translation = localized[element.id];
		if (translation == null)
			continue;
		
		element.innerText = translation;
	}
}

function setupLanguage() {
    const menu = document.querySelector("#attached #language-picker #menu");
    const list = document.querySelector("#attached #language-picker #list");
    const languages = document.querySelectorAll("#attached #language-picker #list .language");

    menu.onclick = () => {
        menu.style.transform = `scale(1, 0)`;
        list.style.transform = `scale(1, 1)`;
    }

    for (let language of languages) {
        language.onclick = () => {
            menu.style.transform = `scale(1, 1)`;
            list.style.transform = `scale(1, 0)`;
            updateLanguage(language.id);
        }
    }

    let selectedLanguage = localStorage.getItem("language");
    if (selectedLanguage == null)
        selectedLanguage = "english";

	updateLanguage(selectedLanguage);
}

function createAboutStars() {
    const about = document.querySelector("#about");
    for (let i = 0; i < Math.random() * 50 + 25; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        star.style.width = `${Math.random() * 0.4 + 0.1}rem`;
        let x;
        let y;
        do {
            x = Math.random() * 100;
            y = Math.random() * 100;
        } while (Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)) < 10);
        star.style.top = `${x}%`;
        star.style.left = `${y}%`;
        star.style.animation = `star ${Math.random() * 10 + 10}s infinite linear`;
        star.style.animationDelay = `${-Math.random() * 50}s`;
        star.style.rotate = `${Math.random() * 360}deg`
        about.appendChild(star);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    scrollBehaviour();
    window.ontouchmove = () => scrollBehaviour();
    window.onscroll = () => scrollBehaviour();
	
    /*document.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });*/
	
	createAboutStars();
    setupLanguage();
});