import fs from 'fs';
import path from 'path';
import https from 'https';

const dataPath = path.join(process.cwd(), 'public', 'data', 'cards.json');
const imagesDir = path.join(process.cwd(), 'public', 'images', 'cards');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
};

async function downloadAll() {
    console.log(`Starting download for ${cards.length} cards...`);
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const imageUrl = card.images.large || card.images.small;
        if (!imageUrl) continue;
        
        const fileName = `${card.id}.png`;
        const filePath = path.join(imagesDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            try {
                console.log(`Downloading [${i + 1}/${cards.length}]: ${fileName}`);
                await downloadImage(imageUrl, filePath);
            } catch (err) {
                console.error(`Failed to download ${fileName}:`, err.message);
            }
        } else {
            console.log(`Skipping [${i + 1}/${cards.length}]: ${fileName} (already exists)`);
        }
    }
    
    console.log('Finished downloading images.');
}

downloadAll();
