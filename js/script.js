let selectedCategory = "All";
let favoritesOnly = false;

window.onload = function () {
    renderFilterBar();
    renderTools();
};

const tools = [
    {
        id: "text",
        name: "Random Text Generator",
        description: "Generate randomized strings with custom length and spacing.",
        category: "Data"
    },
    {
        id: "api",
        name: "API Tester",
        description: "Test REST APIs with custom requests and responses.",
        category: "API"
    },
    {
        id: "json",
        name: "JSON Formatter",
        description: "Validate and format JSON data.",
        category: "Data"
    },
    {
        id: "data",
        name: "Data Generator",
        description: "Create random emails, usernames, and test data.",
        category: "Data"
    },
    {
        id: "string",
        name: "String Validator",
        description: "Analyze string length, whitespace, and characters.",
        category: "QA"
    },
    {
        id: "edge",
        name: "Edge Case Generator",
        description: "Generate tricky inputs like XSS and SQL injection strings.",
        category: "Security"
    },
    {
        id: "bva",
        name: "Boundary Value Analyzer",
        description: "Visualizes boundary values for testing input limits.",
        category: "QA"
    },
    {
        id: "bug",
        name: "Bug Severity Classifier",
        description: "Classifies system bugs based on probability + consequence levels.",
        category: "Reporting"
    },
    {
        id: "file",
        name: "Test File Generator",
        description: "Generates test files for validating file upload behavior.",
        category: "QA"
    },
    {
        id: "sanInput",
        name: "Input Sanitization Checker",
        description: "Checks input for proper sanitization and shows how it can be sanitized.",
        category: "Security"
    },
    {
        id: "status",
        name: "HTTP Status Code Cheat Sheet",
        description: "Displays HTTP status codes and their meaning.",
        category: "API"
    },
    {
        id: "sql",
        name: "SQL Query Builder",
        description: "Build simple SQL queries.",
        category: "Data"
    },
    {
        id: "rca",
        name: "Root Cause Analysis Walkthrough",
        description: "Walk through the RCA process.",
        category: "Reporting"
    },
    {
        id: "bugRep",
        name: "Bug Report Wizard",
        description: "Walk through the bug reporting process.",
        category: "Reporting"
    }
];

function filterTools(tools) {
    let filtered = tools;

    // Category filter
    if (selectedCategory !== "All") {
        filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Favorites-only filter
    if (favoritesOnly) {
        const favs = getFavorites();
        filtered = filtered.filter(tool => favs.includes(tool.id));
    }

    return filtered;
}

function toggleFavoritesOnly() {
    favoritesOnly = !favoritesOnly;
    renderFilterBar();
    renderTools();
}

function renderFilterBar() {
    const categories = ["All", "QA", "API", "Security", "Data", "Reporting"];
    const bar = document.getElementById("filterBar");

    bar.innerHTML = categories.map(cat => {
        const isActive = selectedCategory === cat;

        return `
            <button
                onclick="setCategory('${cat}')"
                class="px-3 py-1 rounded-full text-sm transition
                ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}">
                ${cat}
            </button>
        `;
    }).join("");

    const favActive = favoritesOnly ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600";

    bar.innerHTML += `
        <button
            onclick="toggleFavoritesOnly()"
            class="px-3 py-1 rounded-full text-sm transition ml-2 ${favActive}">
            ⭐ Favorites Only
        </button>
    `;
}

function getCategoryColor(category) {
    switch (category) {
        case "QA": return "bg-red-900 text-red-300";
        case "API": return "bg-blue-900 text-blue-300";
        case "Security": return "bg-purple-900 text-purple-300";
        case "Data": return "bg-green-900 text-green-300";
        default: return "bg-gray-700 text-gray-300";
    }
}

function setCategory(category) {
    selectedCategory = category;
    renderFilterBar();
    renderTools();
}

function toggleFavorite(toolId) {
    let favs = getFavorites();

    if (favs.includes(toolId)) {
        favs = favs.filter(id => id !== toolId);
    } else {
        favs.push(toolId);
    }

    saveFavorites(favs);

    renderTools(); // refresh UI so stars update
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(favs) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

function isFavorite(toolId) {
    return getFavorites().includes(toolId);
}

function sortTools(tools) {
    let favs = getFavorites();

    return [...tools].sort((a, b) => {
        let aFav = favs.includes(a.id);
        let bFav = favs.includes(b.id);

        return (bFav - aFav); // favorites first
    });
}

function renderCard(tool) {
    let stats = getToolStats();
    let usage = stats[tool.id]?.count || 0;
    return `
        <div class="relative bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] flex flex-col gap-3">

            <!-- Favorite button -->
            <button onclick="toggleFavorite('${tool.id}')"
                class="absolute top-3 right-3 text-yellow-400 text-xl">
                ${isFavorite(tool.id) ? "⭐" : "☆"}
            </button>

            <!-- Title -->
            <h2 class="text-xl font-semibold mb-2">${tool.name}</h2>

            <!-- Description -->
            <p class="text-gray-400 mb-4">${tool.description}</p>

            <!-- Open button -->
            <button onclick="openTool('${tool.id}')"
                class="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition">
                Open Tool
            </button>

            <!-- Category Tag -->
            <span class="inline-block w-fit px-2 py-1 text-xs rounded-full ${getCategoryColor(tool.category)}">
                ${tool.category}
            </span>

            <!-- Usage Statistics -->
            <p class="text-xs text-gray-500 mt-2">
                Used ${usage} time${usage === 1 ? "" : "s"}
            </p>

        </div>
    `;
}

function renderTools() {
    const container = document.getElementById("toolGrid");

    container.innerHTML = sortTools(filterTools(tools))
        .map(tool => renderCard(tool))
        .join("");
}

function getToolStats() {
    return JSON.parse(localStorage.getItem("toolStats") || "{}");
}

function saveToolStats(stats) {
    localStorage.setItem("toolStats", JSON.stringify(stats));
}

function openTool(tool) {
    // Analytics tracking
    let stats = getToolStats();

    if (!stats[tool]) {
        stats[tool] = { count: 0, lastUsed: null };
    }

    stats[tool].count += 1;
    stats[tool].lastUsed = new Date().toISOString();

    saveToolStats(stats);

    // Hide cards
    document.getElementById("toolGrid").classList.add("hidden");
    document.getElementById("filterBar").classList.add("hidden");

    // Show tool container
    document.getElementById("tool-container").classList.remove("hidden");

    // Load tool UI
    loadTool(tool);
}

function goHome() {
    // Show cards
    document.getElementById("toolGrid").classList.remove("hidden");
    document.getElementById("filterBar").classList.remove("hidden");

    // Hide tool container
    document.getElementById("tool-container").classList.add("hidden");

    document.getElementById("tool-content").innerHTML = "";

    renderTools();
}

function loadTool(tool) {
    const container = document.getElementById("tool-content");

    if (tool === "text") {
        document.getElementById("tool-content").innerHTML = `
            <div class="space-y-4">

                <input id="textLength" type="number" placeholder="Length"
                    class="w-full p-2 rounded bg-gray-700 text-white" value="100"/>

                <div class="grid grid-cols-2 gap-2 text-sm">

                    <label><input type="checkbox" id="letters" checked> Letters</label>
                    <label><input type="checkbox" id="numbers"> Numbers</label>
                    <label><input type="checkbox" id="symbols"> Symbols</label>
                    <label><input type="checkbox" id="spaces" checked> Spaces</label>
                    <label><input type="checkbox" id="punctuation"> Punctuation</label>
                    <label><input type="checkbox" id="capitalize"> Random Caps</label>

                </div>

                <button onclick="generateText()"
                    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Generate
                </button>

                    <div class="relative">
                        <textarea id="textOutput"
                            class="w-full p-3 rounded bg-gray-900 text-green-400"
                            rows="6" readonly></textarea>

                        <button onclick="copyToClipboard('textOutput')"
                            class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                            Copy
                        </button>
                    </div>
            </div>
        `;
    }

    else if (tool === "data") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Data Generator</h2>

            <!-- Type -->
            <label class="block mb-2">Data Type</label>
            <select id="dataType" class="w-full p-2 mb-4 rounded bg-gray-700 text-white">
                <option value="email">Email</option>
                <option value="username">Username</option>
                <option value="phone">Phone Number</option>
                <option value="id">Random ID</option>
            </select>

            <!-- Valid / Invalid Toggle -->
            <label class="flex items-center gap-2 mb-4">
                <input type="checkbox" id="invalidToggle">
                Generate INVALID data (QA edge cases)
            </label>

            <!-- Count -->
            <label class="block mb-2">Amount</label>
            <input id="count" type="number" value="5"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white">

            <button onclick="generateData()"
                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Generate
            </button>

            <div class="relative">
                <pre id="dataOutput"
                class="mt-4 p-6 bg-gray-900 rounded text-sm overflow-auto"></pre>

                <button onclick="copyToClipboard('dataOutput')"
                    class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                    Copy
                </button>
            </div>
        `;
    }

    else if (tool === "api") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">API Tester</h2>

            <!-- Method -->
            <label class="block mb-2">Method</label>
            <select id="method" class="w-full p-2 mb-4 rounded bg-gray-700 text-white">
                <option>GET</option>
                <option>POST</option>
            </select>

            <!-- URL -->
            <label class="block mb-2">URL</label>
            <input id="url" placeholder="https://api.example.com/data"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white">

            <!-- Headers -->
            <label class="block mb-2">Headers (JSON)</label>
            <textarea id="headers"
                class="w-full p-2 mb-4 rounded bg-gray-900 text-white"
                rows="3"
                placeholder='{"Content-Type": "application/json"}'></textarea>

            <!-- Body -->
            <label class="block mb-2">Body (POST only)</label>
            <textarea id="body"
                class="w-full p-2 mb-4 rounded bg-gray-900 text-white"
                rows="4"
                placeholder='{"key": "value"}'></textarea>

            <!-- Send Button -->
            <button onclick="sendRequest()"
                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Send Request
            </button>

            <!-- Response -->
            <div class="mt-6">
                <h3 class="text-lg font-semibold mb-2">Response</h3>
                <div id="status" class="mb-2 text-sm text-gray-300"></div>
                    <div class="relative">
                        <pre id="response"
                            class="p-6 bg-gray-900 rounded overflow-auto text-sm"></pre>

                        <button onclick="copyToClipboard('response')"
                            class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                            Copy
                        </button>
                    </div>
            </div>
        `;
    }

    else if (tool === "json") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">JSON Formatter & Validator</h2>

            <!-- Input -->
            <label class="block mb-2">Input JSON</label>
            <textarea id="jsonInput"
                class="w-full p-3 h-40 rounded bg-gray-700 text-white font-mono"
                placeholder='{"name":"test","id":1}'></textarea>

            <!-- Buttons -->
            <div class="flex gap-3 mt-4">
                <button onclick="formatJSON()"
                    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Format
                </button>

                <button onclick="clearJSON()"
                    class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
                    Clear
                </button>
            </div>

            <!-- Status -->
            <div id="jsonStatus" class="mt-4 text-sm"></div>

            <!-- Output -->
            <div class="relative">
                <pre id="jsonOutput"
                    class="mt-4 p-6 bg-gray-900 rounded overflow-auto text-sm"></pre>

                <button onclick="copyToClipboard('jsonOutput')"
                    class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                    Copy
                </button>
            </div>
        `;
    }

    else if (tool === "string") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">String Validator</h2>

            <!-- Input -->
            <label class="block mb-2">Input String</label>
            <textarea id="stringInput"
                class="w-full p-3 h-32 rounded bg-gray-700 text-white font-mono"
                placeholder="Enter text to analyze..."></textarea>

            <!-- Analyze Button -->
            <button onclick="analyzeString()"
                class="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Analyze
            </button>

            <!-- Results -->
            <div id="stringResults" class="mt-6 space-y-2"></div>
        `;
    }

    else if (tool === "edge") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Edge Case Generator</h2>

            <!-- Category -->
            <label class="block mb-2">Case Type</label>
            <select id="edgeType" class="w-full p-2 mb-4 rounded bg-gray-700 text-white">
                <option value="sql">SQL Injection</option>
                <option value="xss">XSS Payloads</option>
                <option value="unicode">Unicode / Encoding</option>
                <option value="long">Very Long Strings</option>
                <option value="empty">Empty / Null Cases</option>
                <option value="control">Control Characters</option>
            </select>

            <!-- Count -->
            <label class="block mb-2">Amount</label>
            <input id="edgeCount" type="number" value="5"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white">

            <button onclick="generateEdgeCases()"
                class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                Generate Edge Cases
            </button>

            <div class="relative">
                <pre id="edgeOutput"
                    class="mt-4 p-6 bg-gray-900 rounded text-sm overflow-auto"></pre>

                <button onclick="copyToClipboard('edgeOutput')"
                    class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                    Copy
                </button>
            </div>
        `;
    }

    else if (tool === "bva") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Boundary Value Analyzer</h2>

            <!-- Min -->
            <label class="block mb-2">Minimum Value</label>
            <input id="minVal" type="number"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                placeholder="e.g. 1">

            <!-- Max -->
            <label class="block mb-2">Maximum Value</label>
            <input id="maxVal" type="number"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                placeholder="e.g. 100">

            <button onclick="generateBoundaryValues()"
                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Generate Test Values
            </button>

            <div id="bvaOutput" class="mt-6 space-y-2"></div>
        `;
    }

    else if (tool === "bug") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Bug Severity Classifier</h2>

            <!-- Title -->
            <label class="block mb-2">Bug Title</label>
            <input id="bugTitle" type="text"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                placeholder="e.g. Login button does not work">

            <!-- Description -->
            <label class="block mb-2">Bug Description</label>
            <textarea id="bugDesc"
                class="w-full p-3 h-32 rounded bg-gray-700 text-white font-mono"
                placeholder="Describe the issue in detail..."></textarea>

            <button onclick="classifyBugAuto()"
                class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mt-4">
                Classify Bug
            </button>

            <div id="bugOutput" class="mt-6"></div>
        `;
    }

    else if (tool === "file") {
    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Test File Generator</h2>

        <!-- File Type -->
        <label class="block mb-2">File Type</label>
        <select id="fileType" class="w-full p-2 mb-4 rounded bg-gray-700 text-white">
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="gif">GIF (mock binary)</option>
            <option value="mp4">MP4 (mock binary)</option>
            <option value="mp3">MP3 (mock binary)</option>
            <option value="png">PNG (mock binary)</option>
            <option value="jpg">JPG (mock binary)</option>
        </select>

        <!-- Size -->
        <label class="block mb-2">File Size (KB)</label>
        <input id="fileSize" type="number" value="10"
            class="w-full p-2 mb-4 rounded bg-gray-700 text-white">

        <button onclick="generateFile()"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Generate File
        </button>

        <div id="fileStatus" class="mt-4 text-sm text-gray-300"></div>
    `;
}

    else if (tool === "status") {
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">HTTP Status Code Cheat Sheet</h2>

            <label class="block mb-2 text-gray-300">Select Status Code</label>

            <select id="statusSelect"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white">
                
                <option value="200">200 - OK</option>
                <option value="201">201 - Created</option>
                <option value="204">204 - No Content</option>

                <option value="400">400 - Bad Request</option>
                <option value="401">401 - Unauthorized</option>
                <option value="403">403 - Forbidden</option>
                <option value="404">404 - Not Found</option>

                <option value="409">409 - Conflict</option>
                <option value="422">422 - Unprocessable Entity</option>

                <option value="500">500 - Internal Server Error</option>
                <option value="502">502 - Bad Gateway</option>
                <option value="503">503 - Service Unavailable</option>
            </select>

            <button onclick="showStatusInfo()"
                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Explain Status Code
            </button>

            <div id="statusOutput"
                class="mt-4 p-4 bg-gray-800 rounded text-gray-200 whitespace-pre-line">
            </div>
        `;
    }

    else if (tool === "sql") {
        container.innerHTML = `
            <label class="block mb-2">Query Type</label>
            <select id="sqlMode"
                class="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                onchange="renderSQLBuilder()">

                <option value="select">SELECT</option>
                <option value="insert">INSERT</option>
                <option value="update">UPDATE</option>
                <option value="delete">DELETE</option>
            </select>

            <div id="sqlBuilder"></div>

            <div class="relative mt-4">
                <textarea id="sqlOutput"
                    class="w-full p-3 rounded bg-gray-900 text-green-400 pr-12"
                    rows="5" readonly></textarea>

                <button onclick="copyFromButton(this)"
                    class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                    Copy
                </button>
            </div>
        `;
    }

    else if (tool === "rca") {
    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Root Cause Analysis Walkthrough</h2>

        <label class="block mb-1">1. Enter the ADO bug ID</label>
        <textarea id="rca_bug"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="e.g. 123456"></textarea>
        
        <label class="block mb-1">2. What was the issue?</label>
        <textarea id="rca_issue"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="e.g. Login button does nothing in production"></textarea>

        <label class="block mb-1">3. Where was it discovered?</label>
        <input id="rca_found"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="Team / DEV / STG / Production">

        <label class="block mb-1">4. What should have caught it?</label>
        <textarea id="rca_should_have"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="e.g. Functional test / regression suite / code review / automation"></textarea>

        <label class="block mb-1">5. What testing step failed?</label>
        <select id="rca_step"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white">

            <option value="requirements">Requirements / Design review</option>
            <option value="dev">Development / Unit testing</option>
            <option value="qa">QA testing</option>
            <option value="automation">Automation coverage</option>
            <option value="uat">UAT validation</option>
            <option value="release">Release / deployment checks</option>
            <option value="monitoring">Post-release monitoring</option>
        </select>

        <label class="block mb-1">6. How did it escape detection?</label>
        <textarea id="rca_escape"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="e.g. Not covered in regression suite"></textarea>

        <label class="block mb-1">7. Contributing process gaps</label>
        <textarea id="rca_gaps"
            class="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="e.g. Missing test case, unclear requirements, insufficient coverage"></textarea>

        <button onclick="generateProcessRCA()"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Generate RCA Summary
        </button>

        <div class="relative">
            <div id="rca_output"
            class="mt-4 p-4 bg-gray-800 rounded whitespace-pre-line text-gray-200"></div>

            <button onclick="copyToClipboard('rca_output')"
                class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm">
                Copy
            </button>
        </div>
    `;
}

else if (tool === "bugRep") {
    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Bug Report Wizard 🐛</h2>

        <div class="space-y-4">

            <!-- Step 1 -->
            <input id="bugTitle" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Bug title" />

            <!-- Step 2 -->
            <textarea id="bugDescription" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Bug description"></textarea>

            <!-- Step 3 -->
            <textarea id="bugSteps" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Reproduction steps"></textarea>

            <textarea id="bugExpected" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Expected result"></textarea>

            <textarea id="bugActual" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Actual result"></textarea>

            <!-- Step 4 -->
            <input id="bugSystem" class="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="System (test site, subsystem, project, etc)" />

            <!-- Step 5 -->
            <select id="bugEnv" class="w-full p-2 rounded bg-gray-700 text-white">
                <option value="DEV">DEV</option>
                <option value="STG">STG</option>
                <option value="PROD">PROD</option>
                <option value="TEAM">TEAM</option>
            </select>

            <!-- Step 6 -->
            <div class="flex gap-2">
                <select id="bugProbability" class="w-1/2 p-2 rounded bg-gray-700 text-white">
                    <option value="Low">Probability: Low</option>
                    <option value="High">Probability: High</option>
                </select>

                <select id="bugConsequence" class="w-1/2 p-2 rounded bg-gray-700 text-white">
                    <option value="Low">Consequence: Low</option>
                    <option value="High">Consequence: High</option>
                </select>
            </div>

            <button onclick="generateBugReport()"
                class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Generate Bug Report
            </button>

            <button onclick="copyBugReport()"
                class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded ml-2">
                Copy to Clipboard
            </button>

            <textarea id="bugOutput"
                class="w-full p-3 mt-4 rounded bg-gray-800 text-white h-64"
                readonly></textarea>

        </div>
    `;
}

    else {
        container.innerHTML = `<p>Tool coming soon...</p>`;
    }
}

function generateBugReport() {
    const title = document.getElementById("bugTitle").value;
    const description = document.getElementById("bugDescription").value;
    const steps = document.getElementById("bugSteps").value;
    const expected = document.getElementById("bugExpected").value;
    const actual = document.getElementById("bugActual").value;
    const system = document.getElementById("bugSystem").value;
    const env = document.getElementById("bugEnv").value;
    const probability = document.getElementById("bugProbability").value;
    const consequence = document.getElementById("bugConsequence").value;

    const report = `
BUG REPORT

Title:
${title}

Description:
${description}

System:
${system}

Environment:
${env}

Reproduction Steps:
${steps}

Expected Result:
${expected}

Actual Result:
${actual}

Risk Assessment:
- Probability: ${probability}
- Consequence: ${consequence}
`;

    document.getElementById("bugOutput").value = report.trim();
}

function copyBugReport() {
    const output = document.getElementById("bugOutput");
    output.select();
    document.execCommand("copy");
}

function generateProcessRCA() {
    const bug = document.getElementById("rca_bug").value;
    const issue = document.getElementById("rca_issue").value;
    const found = document.getElementById("rca_found").value;
    const shouldHave = document.getElementById("rca_should_have").value;
    const step = document.getElementById("rca_step").value;
    const escape = document.getElementById("rca_escape").value;
    const gaps = document.getElementById("rca_gaps").value;

    const output = document.getElementById("rca_output");

    let summary = `
Root Cause Analysis 
--------------------------------

ADO Bug ID: ${bug}

Issue:
${issue}

Where it was found:
${found}

Expected detection point:
${shouldHave}

--------------------------------
PROCESS STEP THAT FAILED:
${step.toUpperCase()}

--------------------------------
HOW IT ESCAPED:
${escape}

--------------------------------
CONTRIBUTING PROCESS GAPS:
${gaps}

--------------------------------
KEY TAKEAWAY:
`;

    // simple mapping logic (you can expand later)
    if (step === "qa") {
        summary += "- Gap in QA test coverage or test design\n- Missing regression or edge case validation";
    }
    else if (step === "automation") {
        summary += "- Automation coverage gap or outdated test suite\n- Flaky or missing automated checks";
    }
    else if (step === "requirements") {
        summary += "- Ambiguous or incomplete requirements\n- Missed acceptance criteria";
    }
    else if (step === "release") {
        summary += "- Deployment validation missing or insufficient\n- Lack of pre-release sanity checks";
    }
    else {
        summary += "- Process breakdown at earlier lifecycle stage\n- Requires review of upstream validation steps";
    }

    summary += `

--------------------------------
PREVENTION PLAN:
- Add missing test coverage
- Improve validation at "${step}" stage
- Document regression scenario
- Add monitoring or automated checks
- Review similar past defects for pattern matching
`;

    output.textContent = summary;
}

function renderSQLBuilder() {
    const mode = document.getElementById("sqlMode").value;
    const container = document.getElementById("sqlBuilder");

    if (mode === "select") {
        container.innerHTML = `
            <input id="table" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Table name">
            <input id="columns" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Columns (id, name)">
            <input id="where" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="WHERE clause (optional)">
            <button onclick="buildSQL()" class="bg-blue-600 px-3 py-2 rounded">Generate</button>
        `;
    }

    else if (mode === "insert") {
        container.innerHTML = `
            <input id="table" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Table name">
            <input id="columns" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Columns (name, email)">
            <input id="values" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Values ('John','john@email.com')">
            <button onclick="buildSQL()" class="bg-blue-600 px-3 py-2 rounded">Generate</button>
        `;
    }

    else if (mode === "update") {
        container.innerHTML = `
            <input id="table" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Table name">
            <input id="setClause" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="SET (name='John')">
            <input id="where" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="WHERE clause">
            <button onclick="buildSQL()" class="bg-blue-600 px-3 py-2 rounded">Generate</button>
        `;
    }

    else if (mode === "delete") {
        container.innerHTML = `
            <input id="table" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="Table name">
            <input id="where" class="w-full p-2 mb-2 rounded bg-gray-700 text-white" placeholder="WHERE clause">
            <button onclick="buildSQL()" class="bg-blue-600 px-3 py-2 rounded">Generate</button>
        `;
    }
}

function buildSQL() {
    const mode = document.getElementById("sqlMode").value;
    const output = document.getElementById("sqlOutput");

    let sql = "";

    const table = document.getElementById("table")?.value?.trim();
    const where = document.getElementById("where")?.value?.trim();

    if (mode === "select") {
        const columns = document.getElementById("columns").value.trim();
        sql = `SELECT ${columns || "*"} FROM ${table}`;
        if (where) sql += ` WHERE ${where}`;
    }

    else if (mode === "insert") {
        const columns = document.getElementById("columns").value.trim();
        const values = document.getElementById("values").value.trim();

        sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
    }

    else if (mode === "update") {
        const setClause = document.getElementById("setClause").value.trim();

        sql = `UPDATE ${table} SET ${setClause}`;
        if (where) sql += ` WHERE ${where}`;
    }

    else if (mode === "delete") {
        sql = `DELETE FROM ${table}`;
        if (where) sql += ` WHERE ${where}`;
    }

    output.value = sql + ";";
}

function showStatusInfo() {
    const code = document.getElementById("statusSelect").value;
    const output = document.getElementById("statusOutput");

    let info = "";

    if (code === "200") {
        info = "200 OK\nRequest succeeded. Standard successful response.";
    } 
    else if (code === "201") {
        info = "201 Created\nResource was successfully created (usually POST).";
    } 
    else if (code === "204") {
        info = "204 No Content\nRequest succeeded but no data returned.";
    } 
    else if (code === "400") {
        info = "400 Bad Request\nClient sent invalid or malformed request.";
    } 
    else if (code === "401") {
        info = "401 Unauthorized\nAuthentication required or failed.";
    } 
    else if (code === "403") {
        info = "403 Forbidden\nUser is authenticated but not allowed.";
    } 
    else if (code === "404") {
        info = "404 Not Found\nRequested resource does not exist.";
    } 
    else if (code === "409") {
        info = "409 Conflict\nRequest conflicts with current state (duplicate data, etc).";
    } 
    else if (code === "422") {
        info = "422 Unprocessable Entity\nRequest is valid but contains semantic errors.";
    } 
    else if (code === "500") {
        info = "500 Internal Server Error\nServer failed unexpectedly.";
    } 
    else if (code === "502") {
        info = "502 Bad Gateway\nInvalid response from upstream server.";
    } 
    else if (code === "503") {
        info = "503 Service Unavailable\nServer temporarily overloaded or down.";
    }

    output.textContent = info + "\n\nExample:\n" + getExample(code);

    // set color
    output.className = `
        mt-4 p-4 rounded text-white whitespace-pre-line
        ${getStatusColor(code)}
    `;
}

function getExample(code) {
    if (code === "200") {
        return "GET /api/users/1 → returns user data successfully";
    }

    if (code === "201") {
        return "POST /api/users { name: 'John' } → creates new user";
    }

    if (code === "204") {
        return "DELETE /api/users/45 → success, no response body returned";
    }

    if (code === "400") {
        return "POST /api/users { email: 'invalid-email' } → bad request format";
    }

    if (code === "401") {
        return "GET /api/orders (no auth token) → authentication required";
    }

    if (code === "403") {
        return "GET /api/admin/dashboard (insufficient permissions)";
    }

    if (code === "404") {
        return "GET /api/user/999 → resource not found";
    }

    if (code === "409") {
        return "POST /api/users { email: 'existing@email.com' } → duplicate conflict";
    }

    if (code === "422") {
        return "POST /api/register { age: -5 } → validation error (invalid data)";
    }

    if (code === "500") {
        return "GET /api/users → server crash during database query";
    }

    if (code === "502") {
        return "API Gateway → backend service returned invalid response";
    }

    if (code === "503") {
        return "GET /api/search → service unavailable or overloaded";
    }

    return "";
}

function getStatusColor(code) {
    if (code >= 200 && code < 300) {
        return "bg-green-600";
    }

    if (code >= 400 && code < 500) {
        return "bg-yellow-600";
    }

    if (code >= 500) {
        return "bg-red-600";
    }

    return "bg-gray-700";
}

function runSanitizationChecker() {
    const input = document.getElementById("sanInput").value;

    const result = sanitizeInput(input);

    document.getElementById("sanOutput").innerHTML = `
        <div class="bg-gray-900 p-4 rounded-lg space-y-3">

            <div>
                <h3 class="text-sm text-gray-400">Original</h3>
                <p class="text-white">${result.original}</p>
            </div>

            <div>
                <h3 class="text-sm text-gray-400">Sanitized</h3>
                <p class="text-green-400">${result.cleaned}</p>
            </div>

            <div>
                <h3 class="text-sm text-gray-400">Warnings</h3>
                <ul class="text-yellow-400 list-disc ml-5">
                    ${result.warnings.map(w => `<li>${w}</li>`).join("") || "<li>None</li>"}
                </ul>
            </div>

        </div>
    `;
}

function sanitizeInput(input) {
    let original = input;

    let warnings = [];

    // 1. XSS removal
    let noScripts = input.replace(/<script.*?>.*?<\/script>/gi, "");
    if (noScripts !== input) {
        warnings.push("Removed <script> tag (XSS risk)");
    }

    // 2. Remove HTML tags
    let noHtml = noScripts.replace(/<[^>]*>/g, "");
    if (noHtml !== noScripts) {
        warnings.push("Removed HTML tags");
    }

    // 3. SQL injection patterns (basic detection)
    let sqlPatterns = /('|"|;|--|\/\*|\*\/|DROP|SELECT|INSERT|DELETE)/gi;
    if (sqlPatterns.test(noHtml)) {
        warnings.push("Possible SQL injection characters detected");
    }

    let cleaned = noHtml.replace(sqlPatterns, "");

    // 4. Trim whitespace normalization
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return {
        original,
        cleaned,
        warnings
    };
}

function generateText() {
    let length = parseInt(document.getElementById("textLength").value) || 100;

    let includeSpaces = document.getElementById("spaces").checked;
    let includeNumbers = document.getElementById("numbers")?.checked;
    let includeSymbols = document.getElementById("symbols")?.checked;
    let includeCaps = document.getElementById("capitalize")?.checked;
    let includePunctuation = document.getElementById("punctuation")?.checked;

    let letters = "abcdefghijklmnopqrstuvwxyz";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let vowels = "aeiou";
    let consonants = "bcdfghjklmnpqrstvwxyz";

    let result = "";
    let currentLength = 0;

    function generateWord(wordLength) {
        let word = "";

        for (let i = 0; i < wordLength; i++) {
            let set = (i % 2 === 0) ? consonants : vowels;
            let char = set[Math.floor(Math.random() * set.length)];

            if (includeCaps && Math.random() < 0.2) {
                char = char.toUpperCase();
            }

            word += char;
        }

        return word;
    }

    while (currentLength < length) {

        // build word
        let wordLength = Math.floor(Math.random() * 8) + 2;
        let word = generateWord(wordLength);

        result += word;
        currentLength += wordLength;

        // optionally inject numbers/symbols
        if (includeNumbers && Math.random() < 0.1) {
            let n = numbers[Math.floor(Math.random() * numbers.length)];
            result += n;
            currentLength += 1;
        }

        if (includeSymbols && Math.random() < 0.1) {
            let s = symbols[Math.floor(Math.random() * symbols.length)];
            result += s;
            currentLength += 1;
        }

        // spacing logic
        if (includeSpaces && currentLength < length) {
            let spaceChance = Math.random();

            if (spaceChance < 0.7) {
                result += " ";
                currentLength += 1;
            } else if (spaceChance < 0.9) {
                result += "  ";
                currentLength += 2;
            } else {
                result += "   ";
                currentLength += 3;
            }
        }

        // punctuation
        if (includePunctuation && Math.random() < 0.15 && currentLength < length) {
            let p = ".,!?;"[Math.floor(Math.random() * 5)];
            result += p;
            currentLength += 1;
        }
    }

    // enforce exact length (fixes overflow bug)
    result = result.slice(0, length);

    document.getElementById("textOutput").value = result;
}

async function sendRequest() {
    let method = document.getElementById("method").value;
    let url = document.getElementById("url").value;
    let headersInput = document.getElementById("headers").value;
    let bodyInput = document.getElementById("body").value;

    let statusEl = document.getElementById("status");
    let responseEl = document.getElementById("response");

    try {
        // Parse headers safely
        let headers = {};
        if (headersInput.trim()) {
            headers = JSON.parse(headersInput);
        }

        // Build fetch options
        let options = {
            method,
            headers
        };

        // Add body only for non-GET
        if (method !== "GET" && bodyInput.trim()) {
            options.body = bodyInput;
        }

        let startTime = performance.now();

        let res = await fetch(url, options);

        let endTime = performance.now();
        let duration = (endTime - startTime).toFixed(2);

        let text = await res.text();

        // Try to format JSON if possible
        let formatted;
        try {
            formatted = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            formatted = text;
        }

        statusEl.innerHTML = `
            Status: ${res.status} ${res.statusText} | Time: ${duration}ms
        `;

        responseEl.textContent = formatted;

    } catch (err) {
        statusEl.innerHTML = `<span class="text-red-400">Request Failed</span>`;
        responseEl.textContent = err.toString();
    }
}

function generateData() {
    let type = document.getElementById("dataType").value;
    let count = parseInt(document.getElementById("count").value);
    let invalid = document.getElementById("invalidToggle").checked;

    let output = [];

    for (let i = 0; i < count; i++) {
        if (type === "email") {
            output.push(generateEmail(invalid));
        }
        else if (type === "username") {
            output.push(generateUsername(invalid));
        }
        else if (type === "phone") {
            output.push(generatePhone(invalid));
        }
        else if (type === "id") {
            output.push(generateID(invalid));
        }
    }

    document.getElementById("dataOutput").textContent =
        output.join("\n");
}

function generateEmail(invalid) {
    let chars = "abcdefghijklmnopqrstuvwxyz";

    let name = "";
    for (let i = 0; i < 6; i++) {
        name += chars[Math.floor(Math.random() * chars.length)];
    }

    let domain = "test.com";

    if (invalid) {
        let bad = ["@", "", "!!!", "@@", "test", "com"];
        return name + bad[Math.floor(Math.random() * bad.length)];
    }

    return `${name}@${domain}`;
}

function generateUsername(invalid) {
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    let username = "";
    let len = invalid ? 2 : 8;

    for (let i = 0; i < len; i++) {
        username += chars[Math.floor(Math.random() * chars.length)];
    }

    if (invalid) {
        username = username.replace(/a/g, "@"); // intentional weirdness
    }

    return username;
}

function generatePhone(invalid) {
    let num = "";

    for (let i = 0; i < 10; i++) {
        num += Math.floor(Math.random() * 10);
    }

    if (invalid) {
        let formats = [
            num,
            num.slice(0, 6),
            "ABC" + num,
            num + "!!!"
        ];
        return formats[Math.floor(Math.random() * formats.length)];
    }

    return `(${num.slice(0,3)}) ${num.slice(3,6)}-${num.slice(6)}`;
}

function generateID(invalid) {
    let id = "";

    for (let i = 0; i < 8; i++) {
        id += Math.floor(Math.random() * 10);
    }

    if (invalid) {
        return id + "X"; // breaks numeric assumptions
    }

    return id;
}

function generateEdgeCases() {
    let type = document.getElementById("edgeType").value;
    let count = parseInt(document.getElementById("edgeCount").value);

    let output = [];

    for (let i = 0; i < count; i++) {
        if (type === "sql") {
            output.push(getSQLPayload());
        }
        else if (type === "xss") {
            output.push(getXSSPayload());
        }
        else if (type === "unicode") {
            output.push(getUnicodePayload());
        }
        else if (type === "long") {
            output.push(getLongString());
        }
        else if (type === "empty") {
            output.push(getEmptyCase());
        }
        else if (type === "control") {
            output.push(getControlChars());
        }
    }

    document.getElementById("edgeOutput").textContent =
        output.join("\n\n");
}

function getSQLPayload() {
    let payloads = [
        "' OR 1=1 --",
        "'; DROP TABLE users; --",
        "\" OR \"\" = \"",
        "' OR 'a'='a",
        "' UNION SELECT null, username, password --"
    ];

    return payloads[Math.floor(Math.random() * payloads.length)];
}

function getXSSPayload() {
    let payloads = [
        "&lt;script&gt;alert('XSS')&lt;/script&gt;",
        "&lt;img src=x onerror=alert(1)&gt;",
        "&lt;svg onload=alert('XSS')&gt;",
        "javascript:alert(1)",
        "&lt;body onload=alert('XSS')&gt;"
    ];

    return payloads[Math.floor(Math.random() * payloads.length)];
}

function getUnicodePayload() {
    let payloads = [
        "𝓣𝓮𝓼𝓽𝓲𝓷𝓰",
        "テスト",
        "测试",
        "😀😀😀😀😀",
        "\u0000\u0001\u0002",
        "e\u0301e\u0301e\u0301"
    ];

    return payloads[Math.floor(Math.random() * payloads.length)];
}

function getLongString() {
    return "A".repeat(Math.floor(Math.random() * 2000) + 500);
}

function getEmptyCase() {
    let cases = [
        "",
        " ",
        null,
        undefined
    ];

    return cases[Math.floor(Math.random() * cases.length)];
}

function getControlChars() {
    let chars = [
        "\n",
        "\t",
        "\r",
        "\b",
        "\f",
        "\n\n\n",
        "\t\t\t"
    ];

    return chars[Math.floor(Math.random() * chars.length)];
}

function formatJSON() {
    let input = document.getElementById("jsonInput").value;
    let status = document.getElementById("jsonStatus");
    let output = document.getElementById("jsonOutput");

    if (!input.trim()) {
        status.innerHTML = "<span class='text-yellow-400'>⚠️ Empty input</span>";
        output.textContent = "";
        return;
    }

    try {
        let parsed = JSON.parse(input);

        let formatted = JSON.stringify(parsed, null, 2);

        output.textContent = formatted;
        status.innerHTML = "<span class='text-green-400'>✓ Valid JSON</span>";

    } catch (err) {
        output.textContent = "";
        status.innerHTML = `
            <span class='text-red-400'>✗ Invalid JSON</span><br>
            <span class='text-gray-400'>${err.message}</span>
        `;
    }
}

function clearJSON() {
    document.getElementById("jsonInput").value = "";
    document.getElementById("jsonOutput").textContent = "";
    document.getElementById("jsonStatus").innerHTML = "";
}

function analyzeString() {
    let input = document.getElementById("stringInput").value;
    let results = document.getElementById("stringResults");

    // Basic metrics
    let length = input.length;
    let trimmedLength = input.trim().length;
    let spaces = (input.match(/ /g) || []).length;
    let tabs = (input.match(/\t/g) || []).length;
    let newlines = (input.match(/\n/g) || []).length;

    // Character breakdown
    let hasNumbers = /\d/.test(input);
    let hasLetters = /[a-zA-Z]/.test(input);
    let hasSpecial = /[^a-zA-Z0-9\s]/.test(input);

    // Empty / edge cases
    let isEmpty = input.length === 0;
    let isWhitespaceOnly = input.trim().length === 0;

    results.innerHTML = `
        <div class="bg-gray-800 p-3 rounded">
            <strong>Length:</strong> ${length}
        </div>

        <div class="bg-gray-800 p-3 rounded">
            <strong>Trimmed Length:</strong> ${trimmedLength}
        </div>

        <div class="bg-gray-800 p-3 rounded">
            <strong>Spaces:</strong> ${spaces} |
            <strong>Tabs:</strong> ${tabs} |
            <strong>Newlines:</strong> ${newlines}
        </div>

        <div class="bg-gray-800 p-3 rounded">
            <strong>Contains Letters:</strong> ${hasLetters} <br>
            <strong>Contains Numbers:</strong> ${hasNumbers} <br>
            <strong>Contains Special Characters:</strong> ${hasSpecial}
        </div>

        <div class="bg-gray-800 p-3 rounded">
            <strong>Edge Cases:</strong><br>
            Empty: ${isEmpty} <br>
            Whitespace Only: ${isWhitespaceOnly}
        </div>
    `;
}

function generateBoundaryValues() {
    let min = parseInt(document.getElementById("minVal").value);
    let max = parseInt(document.getElementById("maxVal").value);
    let output = document.getElementById("bvaOutput");

    if (isNaN(min) || isNaN(max)) {
        output.innerHTML = `<span class="text-red-400">⚠️ Please enter valid numbers</span>`;
        return;
    }

    if (min >= max) {
        output.innerHTML = `<span class="text-red-400">⚠️ Min must be less than Max</span>`;
        return;
    }

    let testValues = [
        { label: "Min - 1", value: min - 1 },
        { label: "Min", value: min },
        { label: "Min + 1", value: min + 1 },
        { label: "Max - 1", value: max - 1 },
        { label: "Max", value: max },
        { label: "Max + 1", value: max + 1 }
    ];

    output.innerHTML = `
        <div class="bg-gray-800 p-4 rounded">
            ${testValues.map(v => `
                <div class="flex justify-between border-b border-gray-700 py-1">
                    <span>${v.label}</span>
                    <span class="text-blue-400 font-mono">${v.value}</span>
                </div>
            `).join("")}
        </div>
    `;
}

function classifyBugAuto() {
    let title = document.getElementById("bugTitle").value.toLowerCase();
    let desc = document.getElementById("bugDesc").value.toLowerCase();
    let output = document.getElementById("bugOutput");

    let text = title + " " + desc;

    let probability = "low";
    let consequence = "low";

    // 🔍 HIGH PROBABILITY signals (user will likely encounter)
    let highProbKeywords = [
        "always", "every time", "cannot avoid", "frequently",
        "on load", "all users", "login", "homepage", "navigation"
    ];

    // 💥 HIGH CONSEQUENCE signals (workflow blocking)
    let highConsKeywords = [
        "cannot", "blocked", "crash", "freeze", "error",
        "stuck", "fails", "not working", "broken", "prevents"
    ];

    // Detect probability
    for (let word of highProbKeywords) {
        if (text.includes(word)) {
            probability = "high";
            break;
        }
    }

    // Detect consequence
    for (let word of highConsKeywords) {
        if (text.includes(word)) {
            consequence = "high";
            break;
        }
    }

    // 🧠 Classification logic
    let severity = "";
    let priority = "";
    let explanation = "";

    if (probability === "high" && consequence === "high") {
        severity = "🔴 Critical";
        priority = "P0 - Immediate Fix Required";
        explanation = "Frequent occurrence + workflow blocking issue.";
    }

    else if (probability === "high" && consequence === "low") {
        severity = "🟠 Major";
        priority = "P1 - High Priority";
        explanation = "Common issue but does not fully block workflow.";
    }

    else if (probability === "low" && consequence === "high") {
        severity = "🟠 Major (Edge Blocker)";
        priority = "P1 - Investigate Soon";
        explanation = "Rare but blocks critical functionality when encountered.";
    }

    else {
        severity = "🟡 Minor";
        priority = "P2 - Low Priority";
        explanation = "Low impact and low frequency issue.";
    }

    output.innerHTML = `
        <div class="bg-gray-800 p-4 rounded space-y-2">
            <div><strong>Title:</strong> ${title}</div>
            <div><strong>Probability:</strong> ${probability}</div>
            <div><strong>Consequence:</strong> ${consequence}</div>
            <div><strong>Severity:</strong> ${severity}</div>
            <div><strong>Priority:</strong> ${priority}</div>
            <div class="text-gray-300 mt-2">${explanation}</div>
        </div>
    `;
}

function generateFile() {
    let type = document.getElementById("fileType").value;
    let sizeKB = parseInt(document.getElementById("fileSize").value);
    let status = document.getElementById("fileStatus");

    if (isNaN(sizeKB) || sizeKB <= 0) {
        status.innerHTML = "⚠️ Enter a valid file size";
        return;
    }

    let blob;

    if (type === "txt") {
        blob = generateTextFile(sizeKB);
    }

    else if (type === "docx") {
        blob = generateDocxFile(sizeKB);
    }

    else if (type === "json") {
        blob = generateJsonFile(sizeKB);
    }

    else if (type === "csv") {
        blob = generateCsvFile(sizeKB);
    }

    else if (type === "gif") {
        blob = generateGifFile(sizeKB);
    }

    else if (type === "mp4") {
        blob = generateMp4File(sizeKB);
    }

    else if (type === "mp3") {
        blob = generateMp3File(sizeKB);
    }

    else if (type === "png" || type === "jpg") {
        let bytes = new Uint8Array(sizeKB * 1024);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        blob = new Blob([bytes], { type: "application/octet-stream" });
    }

    // Download
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");

    a.href = url;
    a.download = `testfile.${type}`;
    a.click();

    URL.revokeObjectURL(url);

    status.innerHTML = `Generated ${sizeKB}KB ${type.toUpperCase()} file`;
}

function generateDocxFile(targetKB) {
    let targetBytes = targetKB * 1024;

    let documentXml =
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p>
            <w:r>
                <w:t>QA Test Document</w:t>
            </w:r>
        </w:p>
    </w:body>
</w:document>`;

    let contentTypes = `<Types></Types>`;
    let rels = `<Relationships></Relationships>`;

    let base =
        "CONTENT_TYPES\n" + contentTypes +
        "\nRELS\n" + rels +
        "\nDOCUMENT\n" + documentXml;

    let encoder = new TextEncoder();

    // STRICT SIZE LOOP
    while (true) {
        let bytes = encoder.encode(base);

        if (bytes.length >= targetBytes) {
            // trim EXACTLY to target size
            let trimmed = bytes.slice(0, targetBytes);

            return new Blob([trimmed], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });
        }

        // expand deterministically (important!)
        base += "\n<w:p><w:r><w:t>FILLER</w:t></w:r></w:p>";
    }
}

function generateTextFile(targetKB) {
    let targetBytes = targetKB * 1024;
    let chunk = "QA_TEST_DATA_1234567890\n";
    let content = "";

    while (content.length < targetBytes) {
        content += chunk;
    }

    // Trim to exact size
    content = content.substring(0, targetBytes);

    return new Blob([content], { type: "text/plain" });
}

function generateJsonFile(targetKB) {
    let targetBytes = targetKB * 1024;

    let baseObject = {
        id: 1,
        name: "qa_test",
        data: ""
    };

    let filler = "x".repeat(1000);
    let data = "";

    // grow until we reach target size
    while (true) {
        data += filler;

        baseObject.data = data;

        let json = JSON.stringify(baseObject);

        if (json.length >= targetBytes) {
            // trim excess to match size closely
            let trimmed = json.substring(0, targetBytes);
            return new Blob([trimmed], { type: "application/json" });
        }
    }
}

function generateCsvFile(targetKB) {
    let targetBytes = targetKB * 1024;

    let header = "id,name,value\n";
    let rowIndex = 0;
    let content = header;

    while (content.length < targetBytes) {
        let row = `${rowIndex},test_user_${rowIndex},${Math.random()}\n`;
        content += row;
        rowIndex++;
    }

    // trim to exact size
    content = content.substring(0, targetBytes);

    return new Blob([content], { type: "text/csv" });
}

function generateGifFile(targetKB) {
    let targetBytes = targetKB * 1024;

    // Minimal GIF header (GIF89a)
    let header = "GIF89a";

    // Fill with pseudo-binary data
    let data = header;

    while (data.length < targetBytes) {
        data += String.fromCharCode(Math.floor(Math.random() * 256));
    }

    data = data.substring(0, targetBytes);

    // Convert to byte-safe blob
    let bytes = new Uint8Array(data.split('').map(c => c.charCodeAt(0)));

    return new Blob([bytes], { type: "image/gif" });
}

function generateMp4File(targetKB) {
    let size = targetKB * 1024;
    let bytes = new Uint8Array(size);

    // MP4 files often start with ftyp box (basic header)
    let header = [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70];

    for (let i = 0; i < header.length && i < bytes.length; i++) {
        bytes[i] = header[i];
    }

    for (let i = header.length; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }

    return new Blob([bytes], { type: "video/mp4" });
}

function generateMp3File(targetKB) {
    let size = targetKB * 1024;
    let bytes = new Uint8Array(size);

    // MP3 frame sync header (common starting bytes)
    let header = [0xFF, 0xFB];

    for (let i = 0; i < header.length && i < bytes.length; i++) {
        bytes[i] = header[i];
    }

    for (let i = header.length; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
    }

    return new Blob([bytes], { type: "audio/mpeg" });
}

//Test output copy to clipboard
function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);

    if (!el) {
        console.error("Copy failed: element not found");
        return;
    }

    const value = el.value || el.textContent;

    navigator.clipboard.writeText(value)
        .then(() => {
            showCopyFeedback(el);
        })
        .catch(err => {
            console.error("Copy failed:", err);
        });
}

function showCopyFeedback(element) {
    const btn = element.parentElement.querySelector("button");

    if (!btn) return;

    const original = btn.textContent;
    btn.textContent = "Copied!";

    setTimeout(() => {
        btn.textContent = original;
    }, 1500);
}

const logoWrapper = document.querySelector(".logo-wrapper");
const colors = ["#961f1f", "#d8ad2b", "#f8e8bb"];

logoWrapper.addEventListener("mouseenter", () => {
    const rect = logoWrapper.getBoundingClientRect();

    const bursts = Math.floor(Math.random() * 3) + 3;

    for (let b = 0; b < bursts; b++) {

        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;

        for (let i = 0; i < 14; i++) {

            const spark = document.createElement("div");
            spark.classList.add("spark");

            spark.style.background =
                colors[Math.floor(Math.random() * colors.length)];

            spark.style.left = startX + "px";
            spark.style.top = startY + "px";

            logoWrapper.appendChild(spark);

            // physics values
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 6 + 3;

            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;

            let x = startX;
            let y = startY;
            const smoke = document.createElement("div");
            smoke.classList.add("smoke");

            smoke.style.left = startX + "px";
            smoke.style.top = startY + "px";

            logoWrapper.appendChild(smoke);

            setTimeout(() => smoke.remove(), 700);

            const gravity = 0.15;

            function animate() {
                vx *= 0.995;      // less air resistance (slower slowdown)
                vy += gravity;    // gravity still applies

                x += vx;
                y += vy;

                spark.style.left = x + "px";
                spark.style.top = y + "px";

                // slower fade-out (KEY CHANGE)
                let currentOpacity = parseFloat(spark.style.opacity);
                spark.style.opacity = currentOpacity - 0.003;

                // let them live longer before removal
                if (currentOpacity <= 0 || y > rect.height + 200) {
                    spark.remove();
                    return;
                }

                requestAnimationFrame(animate);
            }

            spark.style.opacity = 1;
            requestAnimationFrame(animate);
        }
    }
});

//easter egg
let logoClickCount = 0;
let logoClickTimer = null;

const logo = document.getElementById("logo");

logo.addEventListener("click", () => {
    logoClickCount++;

    // reset if user pauses too long between clicks
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
    }, 1200);

    if (logoClickCount === 10) {
        triggerEasterEgg();
        logoClickCount = 0;
    }
});

function triggerEasterEgg() {
    document.body.classList.add("circus-mode");

    // temporary banner
    const banner = document.createElement("div");
    banner.innerHTML = "🎪 CIRCUS MODE ACTIVATED 🎪";
    banner.className =
        "fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold z-50";

    document.body.appendChild(banner);

    setTimeout(() => {
        banner.remove();
        document.body.classList.remove("circus-mode");
    }, 5000);

    launchMegaFireworks();
}

function createFireworkBurst() {
    const rect = logoWrapper.getBoundingClientRect();

    const bursts = Math.floor(Math.random() * 3) + 3;

    for (let b = 0; b < bursts; b++) {

        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;

        // smoke
        const smoke = document.createElement("div");
        smoke.classList.add("smoke");
        smoke.style.left = startX + "px";
        smoke.style.top = startY + "px";
        logoWrapper.appendChild(smoke);
        setTimeout(() => smoke.remove(), 700);

        for (let i = 0; i < 14; i++) {

            const spark = document.createElement("div");
            spark.classList.add("spark");

            spark.style.left = startX + "px";
            spark.style.top = startY + "px";

            const colors = ["#ff4d4d", "#ffd24d", "#4dd2ff", "#b84dff", "#4dff88"];
            spark.style.background = colors[Math.floor(Math.random() * colors.length)];

            logoWrapper.appendChild(spark);

            let vx = (Math.random() - 0.5) * 6;
            let vy = (Math.random() - 1.5) * 6;
            const gravity = 0.15;

            let x = startX;
            let y = startY;

            function animate() {
                vx *= 0.995;
                vy += gravity;

                x += vx;
                y += vy;

                spark.style.left = x + "px";
                spark.style.top = y + "px";

                spark.style.opacity -= 0.005;

                if (spark.style.opacity <= 0) {
                    spark.remove();
                    return;
                }

                requestAnimationFrame(animate);
            }

            spark.style.opacity = 1;
            requestAnimationFrame(animate);

            setTimeout(() => spark.remove(), 3000);
        }
    }
}

function launchMegaFireworks() {
    console.log("🎆 Mega fireworks triggered");

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            createFireworkBurst();
        }, i * 200);
    }
}