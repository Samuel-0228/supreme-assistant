
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

    analysis: `# 📊 Comprehensive Student Analysis (2017 Batch)
**Data by Savvy Researches**

## 🩺 Medicine
* **Survey Size:** 774 students.
* **Selection:** 99 selected MD (32 Male).
* **GPAs:** 14 (4.0), 35 (3.75-4.0), 28 (3.5-3.75), 19 (3.0-3.5), 3 (below 3.0).
* **EUEE:** 16 scored above 500 (most maintained 3.75+ GPA).
* **Ratio:** Female-to-Male ratio is 2.1:1. Competition remains intense for females.

## 💻 Computer Science
* **Survey Size:** 783 students.
* **Interest:** 189 students (64 Female).
* **GPAs:** 28 (4.0), 94 (3.75-4.0), 32 (3.5-3.75), 28 (3.0-3.5), 7 (below 3.0).
* **EUEE:** 48.7% scored above 500.

## 🏗️ Pre-Engineering (AAiT)
* **Preference:** 97 students (53.29%) chose Software Engineering.
* **GPAs:** 8 (4.0), 29 (3.75-4.0), 16 (3.5-3.75), 26 (3.0-3.5), 18 (below 3.0).
* **EUEE:** 26 scored above 500.
* **Advisory:** Admission is fierce; males should explore alternative programs.

## 📊 Information Systems
* **Selection:** 100 students out of 804.
* **GPAs:** 3 (4.0), 14 (3.75-4.0), 27 (3.5-3.75), 43 (3.0-3.5), 13 (below 3.0).
* **EUEE:** Only 7% scored above 500.
* **Takeaway:** Attainable for students with mid-range academic profiles.

## 🏥 Other Health
* **Selection:** 38 students.
* **GPAs:** 0 (4.0), 2 (3.75-4.0), 3 (3.5-3.75), 19 (3.0-3.5), 14 (below 3.0).
* **EUEE:** Majority scored below 450.

## 🦷 Dental Medicine
* **Applicants:** 51 students out of 941.
* **Demographics:** 84.3% Female.
* **High Achievers:** 62.5% of males, 51% of females.
* **Warning:** Limited spots make competition fierce.

Visit https://savvyresearches.vercel.app/ for more visuals.`
};

export const SYSTEM_INSTRUCTION = `
You are Savvy Chatbot AF 3.0 — a highly advanced assistant for Addis Ababa University (AAU) students.
Creator Info: If asked who created you, say: "I was created by the Savvy Society Team".

Knowledge Core:
Use the AAU CONTEXT below to answer accurately. 
ALWAYS provide complete, full responses. Do not cut short your analysis or lists.

Formatting Rules:
- Use **Bold** for emphasis.
- Use Bullet points (*) for lists.
- Use ## for main sections.
- Keep the tone professional but helpful.

External Links:
- Promotions/Announcements: ${ADMIN_HANDLE}
- Course Modules: ${MODULES_BOT}
- Website: ${REGISTRAR_LINK}

At the end of every response, you MUST include: 📢 @Savvy_Society

AAU CONTEXT:
${Object.entries(AAU_INFO).map(([key, val]) => `--- ${key.toUpperCase()} ---\n${val}`).join('\n\n')}
`;
