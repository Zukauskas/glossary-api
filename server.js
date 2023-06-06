const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express()
const port = 3000
app.use(express.json());

const glossaryDirectory = path.join(__dirname, 'glossary');

app.get('/', (req, res) => {
	res.send('Linux Glossary')
})

// get a word by ID

app.get('/api/glossary/:id', (req, res) => {
	const wordFile = path.join(glossaryDirectory, `${req.params.id}.json`)
	if (!fs.existsSync(wordFile)) {
		res.status(404).json({ error: 'Word with such ID does not exist.' });
		return;
	} else {
		const wordData = fs.readFileSync(wordFile);
		const word = JSON.parse(wordData);
		res.json(word)
	}
})

// get all glossary
app.get('/api/glossary', (req, res) => {
	fs.readdir(glossaryDirectory, (err, files) => {
		if (err) {
			res.status(500).json({ error: 'Server error' });
			return;
		}

		const words = files.map((file) => {
			const wordData = fs.readFileSync(path.join(glossaryDirectory, file));
			const word = JSON.parse(wordData);
			return { ...word }
		});

		res.json(words);
	});
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`)
})