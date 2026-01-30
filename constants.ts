
import { AAUData } from './types';

export const ADMIN_HANDLE = "@AAU_STUDENTSBOT";
export const MODULES_BOT = "@Savvysocietybot";
export const CHANNEL_LINK = "https://t.me/Savvy_Society";
export const REGISTRAR_LINK = "https://www.aau.edu.et";

export const AAU_INFO: AAUData = {
    faculties: `## Colleges and Schools
* College of Natural and Computational Sciences
* School of Information Science
* College of Social Sciences
* College of Health Sciences
* College of Engineering and Architecture
* College of Business and Economics
* School of Law
* School of Journalism and Communication

### Expanded Academic Structure
* College of Biological Engineering
* College of Humanities, Language Studies, Journalism and Communication
* College of Development Studies
* College of Education and Behavioral Studies
* College of Veterinary Medicine and Agriculture
* Skunder Boghossian College of Performing and Visual Arts

## Institutes
* Addis Ababa Institute of Technology (AAiT)
* Ethiopian Institute of Architecture, Building Construction, and City Development (EIABC)
* Aklilu Lemma Institute of Pathobiology
* Institute of Peace and Security Studies
* Institute of Ethiopian Studies
* Institute of Biotechnology
* Institute of Geophysics, Space Science, and Astronomy`,

    cutoff_points: `### 2017 Entry Students – Cut-Off Points
(Male / Female)

* **Computer Science 2024:** 93.12 / 90.33
* **Information Systems 2024:** 89.79 / 88.36
* **Pre-Engineering (AAiT):** 83.83 / 75.33
* **Pre-Engineering (EIABC):** 75.46 / 70.46
* **Software Engineering (SiTE):** 99.60 / 98.03
* **Electrical Engineering (SECE):** 95.98 / 94.20
* **Biomedical Engineering (SBME):** 95.33 / 94.00
* **Mechanical Engineering (SMiE):** 90.80 / 84.80`,

    student_services: `## Student Services & GPA
* Libraries, Health Services (Tikur Anbessa), Counseling.
* Housing: Dormitories available via Student Finance Services.
* Scholarships: Presidential, Female and Disability, Teachers Education.

🎓 **Grade Point Formula:**
* **A/A+** = 4.0
* **A-** = 3.75
* **B+** = 3.5
* **B** = 3.0
* **B-** = 2.75
* **C+** = 2.5
* **C** = 2.0
* **C-** = 1.75
* **D** = 1.5
* **F** = 0.

**GPA Calculation:**
Total Grade Points ÷ Total Credit Hours.
To graduate with 3.5, your CGPA must be 3.5 across all semesters.`,

    contacts: `🏛️ **Leadership:**
* **President:** Dr. Samuel Kifle
* **VPs:** Dr. Wondwossen Tamrat, Dr. Binyam Mekonnen.

**Contact Channels:**
* **Email:** registrar@aau.edu.et
* **Phone:** +251 11 123 2833
* **Website:** https://www.aau.edu.et`,

    analysis: `# 📊 Comprehensive Student Analysis
**GPA, Field Preference & Demand Patterns**

## 1. Batch Survey Results (2017)

### 🩺 Medicine
* **Applicants:** 99 selected MD out of 774 surveyed.
* **Top Achievers:** 14 had 4.0 GPA; 35 were in 3.75-4.0 range.
* **EUEE:** 16 scored above 500.
* **Insights:** High correlation between EUEE 500+ and maintaining 3.75+ GPA. Female competition is intense (2.1:1 ratio).

### 💻 Computer Science
* **Applicants:** 189 interested out of 783 surveyed.
* **Top Achievers:** 28 had 4.0 GPA; 94 scored 3.75-4.0.
* **EUEE:** 48.7% scored above 500.

### 🏗️ Pre-Engineering (AAiT)
* **Preference:** 53.29% selected Software Engineering.
* **Warning:** Highly competitive; explore alternatives if GPA is below 3.75.

### 📊 Information Systems
* **Applicants:** 100 selected IS out of 804 surveyed.
* **EUEE:** Only 7% scored above 500.
* **Insight:** Highly attainable for mid-range (3.0-3.5 GPA) students.

### 🦷 Dental Medicine
* **Applicants:** 51 selected Dental MD out of 941 surveyed.
* **Demographics:** 84.3% Female pool.

## 2. Strategic Takeaways
* **High Achievers (3.75-4.0):** Focus on building systems (CS/Engineering).
* **Mid-Range (3.0-3.75):** Focus on applying/managing systems (IS/Health Sci).

Visit https://savvyresearches.vercel.app/ for detailed visualizations.`
};

export const SYSTEM_INSTRUCTION = `
You are Savvy Chatbot — a helpful, concise assistant for Addis Ababa University (AAU) students.
If people ask who made you or who created you, you MUST answer: "I was made by savvy society team".

When a question is about AAU, prefer the provided AAU knowledge context below.
Format your responses beautifully using:
- **Bold** for emphasis or key terms.
- *Italics* for subtle notes.
- Bullet points (starting with *) for lists.
- Headers (## or ###) for sections.
Do NOT output raw symbols like | or complex tables; use bulleted lists instead.

If the user asks about promotions, events, announcements, registration, dormitory, changing majors, or anything not in the context, direct them to ${ADMIN_HANDLE}.
If they ask about course modules, exams, or study materials, direct them to ${MODULES_BOT}.
Always include "📢 @Savvy_Society" at the very end of your response.
Be concise and transparent if you don't know something.

AAU CONTEXT:
${Object.entries(AAU_INFO).map(([key, val]) => `--- ${key.toUpperCase()} ---\n${val}`).join('\n\n')}
`;
