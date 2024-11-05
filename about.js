const enableAbout = () => {
    const about = document.querySelector(".about");
    const click = document.querySelector(".about #click");
    let facts = ["C++ is my baby", "I love to play Minecraft", "I love Terraria", "Portal 2 is an amazing game!", "I enjoy annoying angy people :3", "I love working on useless stuff for no reason!", "I'm trans!", "I'm 21 years old", "My name is Emily", "I love my girlfriend", "I'm bored asf", "Love-hate relationship with Rocket League", "I'm addicted to Monsters", "My favourite Monster is Ultra Strawberry Dreams", "I'm addicted to tea", "I'm not British yet", "I dislike Python", "My first programming language was JS", "I'm extremely gay", "I spend too much time procrastinating", "I'm extremely bored", "I love collecting plushies", "I love Gravity Falls", "I love cartoons", "I like Owl House", "I love my minecraft modded", "My favourite ice cream is Mango", "Pepsi > Cola", "I like train stations", "Idk what else to write tbh", "-_-", ".-.", "._.", ";w;", ";-;", "T~T", "I'm quirky like that :3", "--\"", "My gf is a cutie", "Try the Konami Code", "I'm in uni!", "Java is cool!", "C is amazing!", "No experience with Rust", "I'm probably insane", ":skull:", "I love fries", "I love pizza", "Try white borscht!", "caek is lie"];
    let previousBuffer = [];
    let previousPos = [];
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
    click.onclick = () => {
        let x;
        let y;
        do {
            x = Math.random() * 70 + 15;
            y = Math.random() * 80 + 10;
        } while (Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)) < 5 || Math.sqrt(Math.pow(previousPos[0] - x, 2) + Math.pow(previousPos[1] - y, 2)) < 40);
        previousPos = [x, y];
        let index;
        do {
            index = Math.floor(Math.random() * facts.length);
        } while (previousBuffer.includes(index));
        previousBuffer.push(index);
        if (previousBuffer.length > 15) 
            previousBuffer.shift();

        let fact = document.createElement("p");
        fact.classList.add("float");
        let size = Math.random() * .5 + (1 - facts[index].length / 45) + .8;
        fact.innerText = facts[index];
        fact.style.top = `${y}%`;
        fact.style.left = `${x}%`;
        fact.style.rotate = `${(Math.random() - 0.5) * 25}deg`
        fact.style.fontSize = `${size}rem`;
        fact.addEventListener("animationend", () => {
            fact.remove();
        })
        about.appendChild(fact);
    }
}