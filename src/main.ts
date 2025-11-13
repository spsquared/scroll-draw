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
    pressedCharacter: null as string | null,
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
    swapColorsAtCursor();
    if (cursor.pressedCharacter !== null) {
        const char = rows[cursor.row][cursor.column];
        char.innerText = cursor.pressedCharacter;
    }
}
(async () => {
    createGrid(80, 25); // IBM PC AT size
    while (true) {
        stepCursor();
        await new Promise<void>((r) => setTimeout(() => r(), 1000 / cursor.speed));
    }
})();

document.addEventListener('keydown', (e) => {
    if (cursor.pressedCharacter !== null) return;
    if (/^[ qwertyuiopasdfghjklzxcvbnm1234567890.:,;'"(!?)+\-*\/=]$/.test(e.key.toLowerCase())) {
        cursor.pressedCharacter = e.key;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === cursor.pressedCharacter?.toLowerCase()) cursor.pressedCharacter = null;
});
document.addEventListener('blur', () => cursor.pressedCharacter = null);