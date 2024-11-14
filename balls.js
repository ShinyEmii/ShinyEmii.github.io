const enableBalls = () => {
    const buffer = [];
    window.addEventListener("keydown", (e) => {
        buffer.push(e.key);
        if (buffer.length > 10)
            buffer.shift();
        if (buffer.length == 10)
            if (JSON.stringify(buffer) == JSON.stringify(["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]))
                setupBalls();
    });
}
const setupBalls = () => {
	const balls = document.querySelector(".balls");
    const canvas = document.querySelector(".balls canvas");
    balls.style.height = "100vh";
    let animated = false;
    balls.addEventListener('transitionstart', () => animated = true);
    balls.addEventListener('transitionend', () => animated = false);
    const c = canvas.getContext('2d');
    let W, H;
    let mouse = {pos: {x: null, y: null}, held: false};
    let lastMousePos = {x: 0, y: 0};

    const resize = () => {
        W = canvas.clientWidth;
        H = canvas.clientHeight;
        canvas.width = W; canvas.height = H;
    };
    resize();
    document.body.onresize = () => resize();
    let G = 500;
    let restitution = 0.9;
    let maxSteps = 16;
    let lastTime = 0;

    window.addEventListener("mousemove", (e) => {
        if (e.target != balls) {
            mouse.held = false;
            return;
        }
        mouse.pos.x = e.layerX;
        mouse.pos.y = e.layerY;
    });
    window.addEventListener("mousedown", (e) => {
        if (e.button == 2) {
            mouse.held = true;
            lastMousePos = {...mouse.pos};
        }
        if (mouse.pos.x != null && e.button == 0)
            addCircle(vector(mouse.pos.x, mouse.pos.y), 15);
    });
    window.addEventListener("mouseup", (e) => {
        if (e.button == 2)
            mouse.held = false;
    });
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "1":
                circles = [];
                break;
            case "2":
                lines = [];
                break;
        }
    });

    const clear = () => {
        c.fillStyle = "rgba(8, 8, 8, 1)";
        c.fillRect(0, 0, W, H);
    };
    const drawLine = (line, color = "#fff") => {
        c.strokeStyle = color;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(line.a.x, line.a.y);
        c.lineTo(line.b.x, line.b.y);
        c.closePath();
        c.stroke();
    }
    const drawCircle = (circle, color = "#fff") => {
        c.fillStyle = color;
        c.beginPath();
        c.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI);
        c.closePath();
        c.fill();
    }
    const vector = (x, y) => {
        return {x: x, y: y};
    }
    const distance = (a, b) => {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    const length = (v) => {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    const normalize = (v) => {
        let l = length(v);
        return {x: v.x / l, y: v.y / l};
    }
    const pointInsideCircle = (point, circle) => {
        return distance(point, circle.pos) < circle.r;
    }
    const pointOnLine = (point, line) => {
        let lineLength = distance(line.a, line.b);
        let d1 = distance(point, line.a);
        let d2 = distance(point, line.b);
        return d1 + d2 >= lineLength - 0.1 && d1 + d2 <= lineLength + 0.1;
    }
    const checkCollisionCircleLine = (circle, line) => {
        let inside1 = pointInsideCircle(line.a, circle);
        let inside2 = pointInsideCircle(line.b, circle);
        if (inside1 || inside2) 
            return true;
        let lineD = vector(line.a.x - line.b.x, line.a.y - line.b.y);
        let lineLength = length(lineD);
        let dot = (((circle.pos.x-line.a.x) * (line.b.x - line.a.x)) + ((circle.pos.y-line.a.y) * (line.b.y - line.a.y)) ) / Math.pow(lineLength, 2);
        let closest = vector(line.a.x + (dot * (line.b.x - line.a.x)), line.a.y + (dot * (line.b.y - line.a.y)));
        if (!pointOnLine(closest, line)) 
            return false;
        return distance(circle.pos, closest) < circle.r;
    }
    const getClosestCircleLinePoint = (circle, line) => {
        let lineD = vector(line.a.x - line.b.x, line.a.y - line.b.y);
        let lineLength = length(lineD);
        let dot = (((circle.pos.x-line.a.x) * (line.b.x - line.a.x)) + ((circle.pos.y-line.a.y) * (line.b.y - line.a.y)) ) / Math.pow(lineLength, 2);
        let closest = vector(line.a.x + (dot * (line.b.x - line.a.x)), line.a.y + (dot * (line.b.y - line.a.y)));
        if (!pointOnLine(closest, line)) {
            let d1 = distance(closest, line.a);
            let d2 = distance(closest, line.b);
            if (d1 < d2) 
                return line.a;
            return line.b;
        }
        return closest;
    }
    const checkCollisionCircleCircle = (a, b) => {
        return distance(a.pos, b.pos) < a.r + b.r;
    }
    const resolveCollisionCircleLine = (circle, line) => {
        let point = getClosestCircleLinePoint(circle, line);
        let collision = vector(point.x - circle.pos.x, point.y - circle.pos.y);
        let depth = circle.r - length(collision);
        let normal = normalize(vector(circle.pos.x - point.x, circle.pos.y - point.y));
        circle.pos.x += normal.x * (depth + 0.01);
        circle.pos.y += normal.y * (depth + 0.01);
        let dot = circle.vel.x * normal.x + circle.vel.y * normal.y;
        circle.vel.x += normal.x * dot * -(1 + restitution);
        circle.vel.y += normal.y * dot * -(1 + restitution);
    }
    const resolveCollisionCircleCircle = (circle, other) => {
        let collision = vector(circle.pos.x - other.pos.x, circle.pos.y - other.pos.y);
        let normal = normalize(collision);
        let depth = length(collision) - (circle.r + other.r);
        circle.pos.x -= normal.x * (depth - 0.01) / 2;
        circle.pos.y -= normal.y * (depth - 0.01) / 2;
        other.pos.x += normal.x * (depth - 0.01) / 2;
        other.pos.y += normal.y * (depth - 0.01) / 2;
        let rel = vector(circle.vel.x - other.vel.x, circle.vel.y - other.vel.y);
        let dot = rel.x * normal.x + rel.y * normal.y;
        circle.vel.x += normal.x * dot * -(1 + restitution) / 2;
        circle.vel.y += normal.y * dot * -(1 + restitution) / 2;
        other.vel.x -= normal.x * dot * -(1 + restitution) / 2;
        other.vel.y -= normal.y * dot * -(1 + restitution) / 2;
    }

    let lines = [];
    let circles = [];
    const addLine = (a, b) => {
        lines.push({a: {...a}, b: {...b}});
    }
    const addCircle = (pos, r, vel = vector(Math.random() / 10.0, Math.random() / 10.0)) => {
        circles.push({pos: pos, r: r, vel: vel});
    }

    const update = (timestamp) => {
        if (animated)
            resize();
        let deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;
        clear();
        if (mouse.held && mouse.pos.x != null) {
            let d = Math.pow(lastMousePos.x - mouse.pos.x, 2) + Math.pow(lastMousePos.y - mouse.pos.y, 2);
            if (d > 1) {
                addLine(lastMousePos, mouse.pos);
                lastMousePos = {...mouse.pos};
            }
        }
        for (let step = 0; step < maxSteps; step++) {
            for (let circle of circles) {
                circle.pos.x += circle.vel.x / maxSteps * deltaTime;
                circle.pos.y += circle.vel.y / maxSteps * deltaTime;
                circle.vel.y += G / maxSteps * deltaTime;
                if (circle.pos.x > W - circle.r) {
                    circle.vel.x *= -restitution;
                    circle.pos.x = W - circle.r - 0.01;
                }
                if (circle.pos.x < circle.r) {
                    circle.vel.x *= -restitution;
                    circle.pos.x = circle.r + 0.01;
                }
                if (circle.pos.y > H - circle.r) {
                    circle.vel.y *= -restitution;
                    circle.pos.y = H - circle.r - 0.01;
                }
                if (circle.pos.y < circle.r) {
                    circle.vel.y *= -restitution;
                    circle.pos.y = circle.r + 0.01;
                }
                for (let line of lines)
                    if (checkCollisionCircleLine(circle, line))
                        resolveCollisionCircleLine(circle, line);
                for (let other of circles) {
                    if (other == circle) continue;
                    if (checkCollisionCircleCircle(circle, other))
                        resolveCollisionCircleCircle(circle, other);
                }
            }
        }
        for (let line of lines)
            drawLine(line);
        for (let circle of circles)
            drawCircle(circle);
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}