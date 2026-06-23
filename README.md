# ModelSentinel

## AI Red Teaming & LLM Security Assessment Platform
ModelSentinel is a GenAI security assessment platform designed to evaluate Large Language Models (LLMs) against adversarial attacks such as Prompt Injection, Jailbreaks, Sensitive Information Disclosure, Tool Abuse, and Social Engineering attacks.
The platform simulates enterprise AI deployments, executes automated security assessments, analyzes model responses, maps findings to the OWASP LLM Top 10 framework, and generates security telemetry and executive reports.
<img width="1983" height="793" alt="modelsentinel" src="https://github.com/user-attachments/assets/339c268c-21f5-48b8-9711-d3571a8b27e6" />


## Key Features

### Attack Library
* Pre-built adversarial attack payload repository
* Prompt Injection attack simulations
* Jailbreak attack testing
* Sensitive information extraction attempts
* Tool abuse and privilege escalation scenarios
* Custom payload creation and management

### Automated Attack Engine
* Execute attacks against simulated enterprise LLM deployments
* Security posture assessment
* Response evaluation and risk analysis
* Threat scoring and verdict generation
* Audit trail generation

### OWASP LLM Top 10 Mapping
Automatically maps assessment findings to:
* LLM01: Prompt Injection
* LLM02: Insecure Output Handling
* LLM06: Sensitive Information Disclosure
* LLM07: Insecure Plugin Design
* Additional OWASP LLM Top 10 categories

### Threat Intelligence Module
* AI-generated attack payload creation
* Threat simulation workflows
* Adversarial testing recommendations
* Emerging attack scenario generation

### Executive Reporting
* Security posture summaries
* Risk distribution analysis
* Vulnerability statistics
* Audit history and findings
* Executive-level assessment reports

## Screenshots
### Security Dashboard
<img width="1837" height="935" alt="Screenshot 2026-06-23 142709" src="https://github.com/user-attachments/assets/3bd9600c-d7be-46a1-95c4-4008d9991978" />

### Attack Library
<img width="1832" height="935" alt="Screenshot 2026-06-23 142733" src="https://github.com/user-attachments/assets/c1ed6a1a-38a2-4592-bcc0-54029ed36f96" />

### Automated Attack Engine
<img width="1840" height="941" alt="Screenshot 2026-06-23 142808" src="https://github.com/user-attachments/assets/115b3049-2f28-49f4-b1b0-301da83cfd71" />

### OWASP LLM Top 10 Mapping
<img width="1847" height="937" alt="Screenshot 2026-06-23 142937" src="https://github.com/user-attachments/assets/13d3e590-fef7-4c46-8862-db7bf6686219" />

### Threat Intelligence
<img width="1852" height="941" alt="Screenshot 2026-06-23 143004" src="https://github.com/user-attachments/assets/a5b1e0c2-d09a-431c-9e4a-c7551b4ce939" />

### Executive Reporting
<img width="1808" height="936" alt="Screenshot 2026-06-23 143210" src="https://github.com/user-attachments/assets/96691209-444d-40bb-a3c3-cd705c543be5" />


## Assessment Workflow
1. Select Attack Payload
2. Select Target Model Profile
3. Execute Security Assessment
4. Analyze Model Response
5. Detect Security Violations
6. Calculate Threat Score
7. Assign Risk Level
8. Map Finding to OWASP LLM Top 10
9. Generate Audit Record
10. Display Executive Report

## Simulated Enterprise Profiles
### GPT-4o Enterprise
Enterprise productivity assistant with access to internal business knowledge and documentation.

### Claude 3.5 Customer Support
Customer-facing support assistant handling billing, account, and product inquiries.

### Llama 3 Financial Advisor
Financial guidance assistant operating in a regulated environment with strict confidentiality requirements.


## Threat Scoring Model
The platform evaluates responses based on:
* Prompt Injection Success
* Jailbreak Success
* Internal Instruction Exposure
* Confidential Information Disclosure
* Safety Guardrail Bypass Attempts

Findings are categorized into:
* Low Risk
* Medium Risk
* High Risk
* Critical Risk

## Architecture
User
↓
React Frontend
↓
Attack Library / Threat Intelligence
↓
Attack Engine
↓
Express API Backend
↓
Target Model Simulation
↓
Response Evaluation Engine
↓
Threat Scoring
↓
OWASP Mapping
↓
Audit Logs & Reports


## Technology Stack
### Frontend
* React
* TypeScript
* Tailwind CSS
* Lucide Icons

### Backend
* Node.js
* Express.js

### AI
* Google Gemini API

### Security Frameworks
* OWASP LLM Top 10
* AI Red Teaming Concepts
* Prompt Injection Testing Methodologies



## Future Enhancements
* MITRE ATLAS Mapping
* Multi-Model Benchmarking
* RAG Security Testing
* Real-Time Threat Intelligence Feeds
* Advanced Prompt Injection Detection
* Automated Security Recommendations
* Model-to-Model Comparative Assessments

## Learning Outcomes
This project helped strengthen knowledge in:
* AI Security
* LLM Red Teaming
* Prompt Injection Attacks
* OWASP LLM Top 10
* Secure AI System Design
* Threat Modeling
* React + TypeScript Development
* API Integration
* Security Reporting and Risk Assessment

## Disclaimer
This project is intended for educational and defensive security research purposes only. All attack simulations are performed within a controlled assessment environment and are designed to promote secure AI system development.
