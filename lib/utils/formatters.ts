export const formatSalary = (min: number, max: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

export const getExperienceLabel = (level: string): string => {
  const labels: Record<string, string> = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior",
    lead: "Lead",
  };
  return labels[level] || level;
};

export const getWorkModeLabel = (mode: string): string => {
  const labels: Record<string, string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    "on-site": "On-Site",
  };
  return labels[mode] || mode;
};

export const getJobTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    internship: "Internship",
  };
  return labels[type] || type;
};
