import os
import re
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

PROMPTS = {
    "explain": """You are an expert code educator. Analyze the provided code and give a thorough, beginner-friendly explanation.

Structure your response EXACTLY like this (use these exact section headers):

## 📋 Overview
A 2-3 sentence plain-English summary of what this code does and its purpose.

## 🔤 Language & Tech Stack
- **Language:** [detected language + version hints if visible]
- **Frameworks/Libraries:** [list any imports/dependencies]
- **Paradigm:** [OOP / functional / procedural / etc.]

## 🧩 How It Works — Step by Step
Walk through the code logic in numbered steps. For each step explain WHAT it does and WHY. Be specific about line numbers when helpful.

## ⚠️ Bugs & Issues Found
For EACH bug or issue, provide:

**[Issue #N] — [Short title]** `[SEVERITY: Critical/High/Medium/Low]`
- **What's wrong:** Clear explanation of the problem
- **Where:** Line number or function name
- **Why it matters:** Impact on the program
- **Fix:**
```[language]
[corrected code snippet]
```

If no bugs found, say "✅ No bugs detected in this code."

## 💡 Key Concepts Used
List 3-5 programming concepts demonstrated in this code with a one-line explanation of each.

## 📚 Suggested Improvements
2-4 concrete, actionable improvements with brief before/after code examples where helpful.

Be thorough but clear. Use plain language. Assume the reader is learning.""",

    "review": """You are a senior software engineer doing a professional code review. Be thorough, constructive, and specific.

Structure your response EXACTLY like this:

## 📊 Code Quality Score
Rate the code: **[X/10]** — [one sentence verdict]

## ✅ What's Done Well
List 3-5 specific things the code does right, with line references where possible.

## 🐛 Bugs & Defects
For EACH bug found:

**[Bug #N] — [Title]** `[CRITICAL / HIGH / MEDIUM / LOW]`
- **Problem:** What is wrong
- **Location:** Line/function
- **Impact:** What breaks or behaves wrongly
- **Fix:**
```[language]
[fixed code]
```

If no bugs: "✅ No functional bugs detected."

## 📐 Best Practices Violations
For each violation:

**[#N] [Rule/Principle violated]** `[SEVERITY]`
- **Issue:** Description
- **Recommendation:** How to fix it
- **Example:**
```[language]
// Before
[bad code]

// After  
[improved code]
```

## 🏗️ Code Structure & Design
Assess: naming conventions, function/class design, separation of concerns, readability, maintainability.

## 🧪 Testability
Note any aspects that make the code hard to test, and suggest what unit tests should cover.

## 📋 Summary & Priority Action Items
Numbered list of the top 3-5 things to fix, ordered by priority.""",

    "optimize": """You are a performance engineering expert. Analyze this code for performance, efficiency, and optimization opportunities.

Structure your response EXACTLY like this:

## ⚡ Performance Overview
**Overall Assessment:** [1-2 sentences on the code's performance profile]
**Complexity:** Time: O(?), Space: O(?) — explain your analysis

## 🐌 Performance Issues Found
For EACH issue:

**[Issue #N] — [Title]** `[CRITICAL / HIGH / MEDIUM / LOW]`
- **Problem:** What is slow or wasteful
- **Location:** Line/function
- **Root Cause:** Why this causes poor performance
- **Impact:** How much this matters (e.g., O(n²) → O(n log n))
- **Optimized Version:**
```[language]
[faster code with explanation comments]
```

## 🔄 Algorithm & Data Structure Analysis
Evaluate the choice of algorithms and data structures. Suggest better alternatives where applicable.

## 💾 Memory Usage
Identify memory inefficiencies, unnecessary allocations, or potential memory leaks.

## 🔧 Quick Wins
List 3-5 small changes that give immediate performance improvements with minimal refactoring.

## 🏆 Fully Optimized Version
If the code is short enough, provide a complete rewritten optimized version with comments explaining each optimization.

## 📈 Expected Improvements
Summarize the expected performance gains after applying all suggestions.""",

    "security": """You are a cybersecurity expert and penetration tester. Perform a thorough security audit of this code.

Structure your response EXACTLY like this:

## 🛡️ Security Assessment Summary
**Risk Level:** [CRITICAL / HIGH / MEDIUM / LOW / SAFE]
**Brief:** 2-3 sentence summary of the security posture.

## 🚨 Vulnerabilities Found
For EACH vulnerability:

**[CVE-style Title]** `[CRITICAL / HIGH / MEDIUM / LOW / INFO]`
- **Vulnerability Type:** (e.g., SQL Injection, XSS, Path Traversal, Insecure Deserialization, etc.)
- **Location:** Line number or function
- **Description:** What the vulnerability is
- **Attack Scenario:** How an attacker could exploit this (be specific)
- **Impact:** What damage could result (data breach, RCE, auth bypass, etc.)
- **Fix:**
```[language]
[secure code replacement]
```
- **References:** OWASP category or CWE if applicable

## 🔐 Authentication & Authorization
Assess any auth-related code. Look for broken auth, missing checks, privilege escalation risks.

## 💉 Input Validation & Sanitization
Check all user inputs, file uploads, query parameters, etc.

## 📦 Dependency & Configuration Issues
Note any insecure library usage, hardcoded secrets, or dangerous configurations.

## ✅ Security Best Practices Checklist
Go through relevant items:
- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] Error handling (no sensitive info in errors)
- [ ] Secrets management
- [ ] Logging & monitoring

## 🔒 Hardened Version
Provide a security-hardened rewrite of the most critical vulnerable sections.""",

    "document": """You are a technical documentation expert. Generate comprehensive, professional documentation for this code.

Structure your response EXACTLY like this:

## 📄 Module / File Overview
**Purpose:** What this code does
**Author notes:** Any patterns or style observations
**Dependencies:** What it requires to run

## 🔧 Functions / Methods / Classes

For EACH function, method, or class found:

### `[name]([parameters])`
**Description:** What it does in plain English
**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | type | Yes/No | description |

**Returns:** `[type]` — description of return value
**Raises/Throws:** Any exceptions or errors it can produce
**Example Usage:**
```[language]
[realistic usage example]
```
**Notes:** Edge cases, gotchas, or important behavior

## 📊 Data Flow
Describe how data moves through the code — inputs, transformations, outputs.

## ⚠️ Known Limitations & Edge Cases
List any limitations, untested edge cases, or TODOs implied by the code.

## 🚀 Usage Guide
A practical "getting started" guide showing how to use this code with real examples.

## 📝 Suggested Docstrings
Provide copy-paste ready docstrings/JSDoc comments for all public functions.""",
    "refactor": """You are a code refactoring expert. Refactor the provided code to improve readability, maintainability, and structure. Apply SOLID principles, reduce duplication, improve naming, and break down large functions. Show the refactored code first, then briefly explain the key changes made.""",

    "test": """You are a testing expert. Generate comprehensive unit tests for the provided code. Include happy path tests, edge cases, error cases, and boundary conditions. Use the appropriate testing framework for the detected language (pytest for Python, Jest for JS/TS, JUnit for Java). Add brief comments explaining what each test covers.""",

    "complexity": """You are a code complexity analyst. Analyze the provided code for cyclomatic complexity, cognitive complexity, and Big O time/space complexity. For each function: state its complexity score, explain why, identify the most complex parts, and suggest specific simplifications with example code.""",

    "generate": """You are an expert programming teacher. Generate complete, working code based on the user description. Structure your response like this:

1. First show the complete working code
2. Then add a section called ## How It Works with a simple step-by-step explanation that a student can understand
3. Then add ## Key Concepts explaining the main programming concepts used
4. Finally add ## How To Run with instructions

Use clear, simple language. Avoid jargon. Make it educational.""",

    "convert": """You are an expert programming teacher. Convert the provided code to the target language. Structure your response:

1. Show the complete converted code
2. Add ## What Changed explaining the key differences between the two languages in simple terms
3. Add ## Why These Changes explaining why the target language does things differently

Keep explanations simple enough for students to understand.""",

    "format": """You are an expert programming teacher. Clean and reformat the provided code. Structure your response:

1. Show the complete formatted/cleaned code
2. Add ## What Was Fixed listing each change made and why it is better practice
3. Add ## Good Habits explaining the coding standards applied, in simple terms for students

Make the explanations educational and easy to understand.""",

}


def detect_language(filename: str, code: str) -> str:
    ext_map = {
        ".py": "Python", ".js": "JavaScript", ".ts": "TypeScript",
        ".tsx": "TypeScript (React)", ".jsx": "JavaScript (React)",
        ".java": "Java", ".cpp": "C++", ".c": "C", ".cs": "C#",
        ".go": "Go", ".rb": "Ruby", ".php": "PHP", ".swift": "Swift",
        ".kt": "Kotlin", ".rs": "Rust", ".html": "HTML", ".css": "CSS",
        ".sql": "SQL", ".sh": "Shell/Bash", ".yaml": "YAML", ".json": "JSON",
    }
    if filename:
        for ext, lang in ext_map.items():
            if filename.lower().endswith(ext):
                return lang

    # Fallback: keyword sniffing
    snippets = {
        "Python": ["def ", "import ", "print(", "elif ", "self."],
        "JavaScript": ["const ", "let ", "var ", "function ", "=>", "console.log"],
        "TypeScript": ["interface ", ": string", ": number", ": boolean", "type "],
        "Java": ["public class", "public static void", "System.out.println"],
        "C++": ["#include", "std::", "cout <<", "int main()"],
        "Go": ["func ", "package main", "fmt.Println", ":="],
        "Ruby": ["def ", "puts ", "end\n", "attr_"],
        "PHP": ["<?php", "echo ", "$"],
        "Swift": ["func ", "var ", "let ", "print(", "->"],
    }
    code_lower = code[:500]
    scores = {lang: sum(1 for kw in kws if kw in code_lower) for lang, kws in snippets.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Unknown"


def count_lines(code: str) -> int:
    return len([l for l in code.splitlines() if l.strip()])


def analyze_code(code: str, mode: str = "explain", filename: str = "") -> dict:
    language = detect_language(filename, code)
    lines = count_lines(code)
    prompt = PROMPTS.get(mode, PROMPTS["explain"])

    system_prompt = f"""You are an expert code analyst. The user has submitted {language} code ({lines} lines) for analysis.
Mode: {mode.upper()}
Be thorough, specific, and use the EXACT section structure provided. 
Always reference specific line numbers when possible.
Format code blocks with proper syntax highlighting tags.
Be constructive and educational in tone."""

    user_message = f"""Please analyze this {language} code:

```{language.lower().split()[0] if language != "Unknown" else ""}
{code}
```

{prompt}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.3,
        max_tokens=4096,
    )

    analysis = response.choices[0].message.content

    return {
        "analysis": analysis,
        "language": language,
        "mode": mode,
        "lines": lines,
    }
