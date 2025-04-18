const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf',
    '.fbx': 'octet-stream'
};

const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const handleRequest = (req, res) => {
    const parsedUrl = url.parse(req.url);

    let sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    if (sanitizePath.substr(0, '/api'.length) === '/api') {
        return handleApiRequest(req, res, sanitizePath);
    }

    //Fix SPA
    if (sanitizePath === '/diary') {
        sanitizePath = '';
    }

    let pathname = path.join(__dirname, sanitizePath);
    fs.exists(pathname, function (exist) {
        if (!exist) {
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }

        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                const ext = path.parse(pathname).ext;
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                res.end(data);
            }
        });
    });

};

const handleApiRequest = (req, res, targetPath) => {
    switch (targetPath) {
        case '/api/entries':
            let data = readJsonFilesFromDirectory(path.join(__dirname, '/entries'));
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(data));
            break;
        default:
            res.statusCode = 404;
            res.end();
            break;
    }
};

const readJsonFilesFromDirectory = (directoryPath) => {
    try {
        const files = fs.readdirSync(directoryPath);
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        const jsonContents = jsonFiles.map(file => {
            const filePath = path.join(directoryPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContent);
        });

        return jsonContents;
    } catch (error) {
        console.error('Fehler beim Lesen der Dateien:', error);
        return [];
    }
};


https.createServer(httpsOptions, handleRequest).listen(443);

http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80);

