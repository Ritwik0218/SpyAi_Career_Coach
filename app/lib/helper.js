// Helper function to convert entries to markdown
export function entriesToMarkdown(data) {
  if (!data) return "";

  let markdown = "";

  // Add contact info if available
  if (data.contactInfo && Object.values(data.contactInfo).some(val => val)) {
    markdown += "# Contact Information\n\n";
    if (data.contactInfo.email) markdown += `Email: ${data.contactInfo.email}\n`;
    if (data.contactInfo.mobile) markdown += `Phone: ${data.contactInfo.mobile}\n`;
    if (data.contactInfo.linkedin) markdown += `LinkedIn: ${data.contactInfo.linkedin}\n`;
    if (data.contactInfo.twitter) markdown += `Twitter: ${data.contactInfo.twitter}\n`;
    markdown += "\n";
  }

  // Add summary
  if (data.summary) {
    markdown += "# Professional Summary\n\n";
    markdown += data.summary + "\n\n";
  }

  // Add skills
  if (data.skills) {
    markdown += "# Skills\n\n";
    markdown += data.skills + "\n\n";
  }

  // Add experience
  if (data.experience?.length) {
    markdown += "# Work Experience\n\n";
    data.experience.forEach(exp => {
      markdown += `## ${exp.position || 'Position'} at ${exp.company || 'Company'}\n`;
      if (exp.location) markdown += `Location: ${exp.location}\n`;
      if (exp.duration) markdown += `Duration: ${exp.duration}\n`;
      if (exp.description) markdown += `\n${exp.description}\n`;
      markdown += "\n";
    });
  }

  // Add education
  if (data.education?.length) {
    markdown += "# Education\n\n";
    data.education.forEach(edu => {
      markdown += `## ${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}\n`;
      if (edu.field) markdown += `Field: ${edu.field}\n`;
      if (edu.duration) markdown += `Duration: ${edu.duration}\n`;
      if (edu.description) markdown += `\n${edu.description}\n`;
      markdown += "\n";
    });
  }

  // Add projects
  if (data.projects?.length) {
    markdown += "# Projects\n\n";
    data.projects.forEach(proj => {
      markdown += `## ${proj.title || 'Project'}\n`;
      if (proj.technologies) markdown += `Technologies: ${proj.technologies}\n`;
      if (proj.link) markdown += `Link: ${proj.link}\n`;
      if (proj.duration) markdown += `Duration: ${proj.duration}\n`;
      if (proj.description) markdown += `\n${proj.description}\n`;
      markdown += "\n";
    });
  }

  return markdown;
}
