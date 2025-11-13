import './style.css';

const screen = document.getElementById('screen') as HTMLDivElement;
const rows: HTMLDivElement[][] = [];

// PuTTY colors
enum Colors {
    BLACK = 'rgb(0, 0, 0)',
    RED = 'rgb(187, 0, 0)',
    GREEN = 'rgb(0, 187, 0)',
    YELLOW = 'rgb(187, 187, 0)',
    BLUE = 'rgb(0, 0, 187)',
    MAGENTA = 'rgb(187, 0, 187)',
    CYAN = 'rgb(0, 187, 187)',
    WHITE = 'rgb(187, 187, 187)',
    BRIGHT_BLACK = 'rgb(85, 85, 85)',
    BRIGHT_RED = 'rgb(255, 85, 85)',
    BRIGHT_GREEN = 'rgb(85, 255, 85)',
    BRIGHT_YELLOW = 'rgb(255, 255, 85)',
    BRIGHT_BLUE = 'rgb(85, 85, 255)',
    BRIGHT_MAGENTA = 'rgb(255, 85, 255)',
    BRIGHT_CYAN = 'rgb(85, 255, 255)',
    BRIGHT_WHITE = 'rgb(255, 255, 255)'
}

function createGrid(w: number, h: number) {
    rows.length = 0;
    screen.innerHTML = '';
    rows.push(...new Array(h).fill(0).map(() => new Array(w).fill(0).map(() => {
        const div = document.createElement('div');
        div.innerText = ' ';
        div.style.backgroundColor = Colors.BLACK;
        div.style.color = Colors.WHITE;
        screen.appendChild(div);
        return div;
    })));
    screen.style.setProperty('--grid-w', w.toString());
    screen.style.setProperty('--grid-h', h.toString());
    cursor.row = 0;
    cursor.column = 0;
    swapColorsAtCursor();
}

const cursor = {
    row: 0,
    column: 0,
    currChar: null as string | null,
    currFG: null as Colors | null,
    currBG: null as Colors | null,
    speed: 50
};
function swapColorsAtCursor() {
    // cursor inverts the colors of the character it sits on
    const char = rows[cursor.row][cursor.column];
    let swap = char.style.backgroundColor;
    char.style.backgroundColor = char.style.color;
    char.style.color = swap;
}
function stepCursor() {
    swapColorsAtCursor();
    cursor.column++;
    if (cursor.column >= rows[cursor.row].length) {
        cursor.column = 0;
        cursor.row = (cursor.row + 1) % rows.length;
    }
    const char = rows[cursor.row][cursor.column];
    if (cursor.currChar !== null) char.innerText = cursor.currChar;
    if (cursor.currFG !== null) char.style.color = cursor.currFG;
    if (cursor.currBG !== null) char.style.backgroundColor = cursor.currBG;
    swapColorsAtCursor();
}
(async () => {
    createGrid(80, 25); // IBM PC AT size
    while (true) {
        stepCursor();
        await new Promise<void>((r) => setTimeout(() => r(), 1000 / cursor.speed));
    }
})();

document.addEventListener('keydown', (e) => {
    if (cursor.currChar !== null) return;
    if (/^[ qwertyuiopasdfghjklzxcvbnm1234567890.:,;'"(!?)+\-*\/=]$/.test(e.key.toLowerCase())) {
        cursor.currChar = e.key;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === cursor.currChar?.toLowerCase()) cursor.currChar = null;
});
window.addEventListener('blur', () => cursor.currChar = null);

const mouse = {
    down: false,
    hoveredFG: null as Colors | null,
    hoveredBG: null as Colors | null
}
const colorsBG = document.getElementById('colorsBG') as HTMLDivElement;
const colorsFG = document.getElementById('colorsFG') as HTMLDivElement;
function addColors(bg: boolean) {
    for (const name of Object.keys(Colors)) {
        const div = document.createElement('div');
        div.classList.add('colorButton');
        const color = Colors[name as keyof typeof Colors];
        div.style.backgroundColor = color;
        div.title = name;
        if (bg) {
            div.addEventListener('mouseover', () => {
                mouse.hoveredBG = color;
                if (mouse.down) cursor.currBG = mouse.hoveredBG;
            });
            div.addEventListener('mouseout', () => {
                mouse.hoveredBG = null;
                cursor.currBG = null;
            });
        } else {
            div.addEventListener('mouseover', () => {
                mouse.hoveredFG = color;
                if (mouse.down) cursor.currFG = mouse.hoveredFG;
            });
            div.addEventListener('mouseout', () => {
                mouse.hoveredFG = null;
                cursor.currFG = null;
            });
        }
        if (bg) colorsBG.appendChild(div);
        else colorsFG.appendChild(div);
    }
}
addColors(false);
addColors(true);
document.addEventListener('mousedown', (e) => {
    if (e.button == 0) {
        mouse.down = true;
        cursor.currFG = mouse.hoveredFG;
        cursor.currBG = mouse.hoveredBG;
    }
});
document.addEventListener('mouseup', (e) => {
    if (e.button == 0) {
        mouse.down = false;
        cursor.currFG = null;
        cursor.currBG = null;
    }
});
window.addEventListener('blur', () => {
    mouse.down = false;
    cursor.currFG = null;
    cursor.currBG = null;
});

const speedText = document.getElementById('speedText') as HTMLSpanElement;
const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
speedSlider.addEventListener('input', () => {
    cursor.speed = Number(speedSlider.value);
    speedText.innerText = speedSlider.value;
});
speedSlider.value = cursor.speed.toString();
speedText.innerText = speedSlider.value;