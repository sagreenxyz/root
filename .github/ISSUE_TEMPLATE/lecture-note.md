---
name: "📖 Lecture Note"
about: "Capture raw lecture notes for a course session. The Copilot agent will refine them and add a polished markdown file to the private /lecture-notes section."
title: "[Lecture Note] <Course> – <Topic> (<YYYY-MM-DD>)"
labels: ["lecture-note", "needs-refine"]
assignees: []
---

<!-- Fill in each section below. Rough notes are fine — the agent will clean them up. -->

## Course & Session Details

| Field | Value |
|-------|-------|
| **Course** | <!-- e.g. D439 – Foundations of Nursing --> |
| **Date** | <!-- YYYY-MM-DD --> |
| **Lecturer / Instructor** | <!-- e.g. Dr. Jen Scarpena --> |
| **Topic / Lecture Title** | <!-- e.g. Introduction to the Nursing Process (ADPIE) --> |

---

## Raw Notes

<!-- Paste your raw notes below. Bullet points, sentence fragments, and shorthand are all fine. -->

-
-
-

---

## Key Concepts (optional)

<!-- List the most important concepts you want to make sure are covered in the final note. -->

-
-

---

## Questions / Follow-Ups (optional)

<!-- Anything you want to follow up on or that wasn't fully covered in the lecture. -->

-

---

## Additional Context (optional)

<!-- Links, references, screenshots, or anything else that should be included. -->

---

<!-- 
AGENT INSTRUCTIONS (do not delete):
When processing this issue, the Copilot agent should:
1. Extract the course, date, lecturer, topic, and notes from the sections above.
2. Create a new markdown file at:
   src/content/lecture-notes/<YYYY-MM-DD>-<kebab-slug>.md
   with the correct frontmatter (title, date, course, lecturer, summary, tags, issueNumber).
3. Refine the raw notes into well-structured markdown with headings, key concepts,
   clinical tips, and follow-up questions.
4. Update the issue with a link to the new note file and close the issue with label "published".
-->
