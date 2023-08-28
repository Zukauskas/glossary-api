require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3003;
app.use(express.json());

const glossaryDirectory = path.join(__dirname, "glossary");

// Function to find available ID
const getAvailableID = () => {
    const files = fs.readdirSync(glossaryDirectory);
    const onlyIDs = files.map((file) => parseInt(path.parse(file).name));
    return onlyIDs[onlyIDs.length - 1] + 1;
};

app.get("/", (req, res) => {
    res.send("Linux Glossary");
});

// Add new word

app.post("/api/word", (req, res) => {
    const { word, definition } = req.body;
    const id = getAvailableID();
    const createdAt = new Date();
    const wordFile = path.join(glossaryDirectory, `${id}.json`);
    const wordData = JSON.stringify({ id, word, definition, createdAt });

    fs.writeFileSync(wordFile, wordData, (err) => {
        if (err) {
            res.status(500).json({ error: "Server error" });
        }
    });

    res.status(201).json({
        message: `${word} was added to glossary with id: ${id}`,
    });
});

// Get a word by ID
app.get("/api/glossary/:id", (req, res) => {
    const wordFile = path.join(glossaryDirectory, `${req.params.id}.json`);
    if (!fs.existsSync(wordFile)) {
        res.status(404).json({ error: "Word with such ID does not exist." });
    } else {
        const wordData = fs.readFileSync(wordFile);
        const word = JSON.parse(wordData);
        res.json(word);
    }
});

// Get all glossary
app.get("/api/glossary", (req, res) => {
    fs.readdir(glossaryDirectory, (err, files) => {
        if (err) {
            res.status(500).json({ error: "Server error" });
            return;
        }

        const words = files.map((file) => {
            const wordData = fs.readFileSync(
                path.join(glossaryDirectory, file)
            );
            const word = JSON.parse(wordData);
            return { ...word };
        });

        res.json(words);
    });
});

// Get pages

// Set default page size settings
const args = process.argv.slice(2);

const pageSizeArg = args.find((arg) => arg.startsWith("--pageSize="));
const minPageSizeArg = args.find((arg) => arg.startsWith("--minSize="));
const maxPageSizeArg = args.find((arg) => arg.startsWith("--maxSize="));

const pageSizeConf = pageSizeArg
    ? parseInt(pageSizeArg.split("=")[1])
    : process.env.PAGE_DEFAULT_SIZE;

const minPageSizeConf = minPageSizeArg
    ? parseInt(minPageSizeArg.split("=")[1])
    : process.env.PAGE_MIN_SIZE;

const maxPageSizeConf = maxPageSizeArg
    ? parseInt(maxPageSizeArg.split("=")[1])
    : process.env.PAGE_MAX_SIZE;

app.get("/api/glossary-page/:page?/:pageSize?", (req, res) => {
    const { page, pageSize } = req.params;
    const parsedPage = page ? parseInt(page) : 1;
    const parsedPageSize = pageSize ? parseInt(pageSize) : pageSizeConf;

    if (
        isNaN(parsedPage) ||
        isNaN(parsedPageSize) ||
        parsedPageSize < minPageSizeConf ||
        parsedPageSize > maxPageSizeConf
    ) {
        res.status(400).json({ error: "Invalid page or pageSize." });
        return;
    }

    fs.readdir(glossaryDirectory, (err, files) => {
        if (err) {
            res.status(500).json({ error: "Server error" });
            return;
        }

        const words = files.map((file) => {
            const wordData = fs.readFileSync(
                path.join(glossaryDirectory, file)
            );
            const word = JSON.parse(wordData);
            return { ...word };
        });

        words.sort((a, b) => {
            const nameComparison = a.word.localeCompare(b.word);

            if (nameComparison !== 0) {
                return nameComparison;
            }

            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        const startIndex = (parsedPage - 1) * parsedPageSize;
        const endIndex = startIndex + parsedPageSize;

        const paginatedWords = words.slice(startIndex, endIndex);

        const prevPage =
            parsedPage > 1
                ? `/api/glossary-page/${parsedPage - 1}/${parsedPageSize}`
                : "";
        const nextPage =
            endIndex < words.length
                ? `/api/glossary-page/${parsedPage + 1}/${parsedPageSize}`
                : "";

        res.json({
            prev: prevPage,
            list: paginatedWords,
            next: nextPage,
        });
    });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
